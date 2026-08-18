<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Presentation;

use Magento\Framework\App\Response\HttpInterface as HttpResponse;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\HTTP\PhpEnvironment\Response as ReadableResponse;
use Magento\Framework\UrlInterface;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\RequestEligibility;

/**
 * Adds the bar to HTML responses, and the profile id to every profiled response.
 *
 * Only three tags reach the page, and none of them are inline script or inline style: the
 * profile travels as <script type="application/json">, which browsers treat as data, and
 * the stylesheet URL travels as a data attribute for the bar to load inside its shadow
 * root. Magento_Csp therefore needs no nonce and no unsafe-inline.
 *
 * The value policy rides along as an attribute too. The Alpine section reads live objects
 * out of the page rather than a redacted profile, so the bar has to know the policy at
 * render time to apply it itself.
 *
 * Responses that cannot carry a bar still get the header, which is how AJAX, GraphQL and
 * REST requests reach the bar's request list and how an agent correlates a request to its
 * stored profile.
 */
class BarInjector
{
    public const PROFILE_HEADER = 'X-Siteation-DebugBar-Profile';

    private const ROOT_ID = 'siteation-debugbar';
    private const DATA_ID = 'siteation-debugbar-profile';

    /**
     * The URL is emitted as a template so the bar can load any profile it discovers, not
     * only the one that rendered the page.
     */
    private const ID_PLACEHOLDER = '__PROFILE_ID__';

    public function __construct(
        private readonly AssetUrl $assets,
        private readonly UrlInterface $url,
        private readonly Config $config
    ) {
    }

    /**
     * @param array<string, mixed> $profile
     */
    public function inject(ResponseInterface $response, array $profile): void
    {
        if (!$response instanceof HttpResponse) {
            return;
        }

        $response->setHeader(self::PROFILE_HEADER, (string) $profile['id'], true);

        // The header rides on anything. Reading and rewriting a body needs the concrete
        // response, because App\Response\HttpInterface declares no getter for it.
        if (!$response instanceof ReadableResponse || !$this->supports($response)) {
            return;
        }

        $html = $this->insertHead((string) $response->getContent());
        $html = $this->insertBody($html, $profile);

        $response->setBody($html);
        $response->clearHeader('Content-Length');
    }

    private function supports(ReadableResponse $response): bool
    {
        if ($response->isRedirect()) {
            return false;
        }

        $disposition = $response->getHeader('Content-Disposition');

        if ($disposition !== false && str_contains(strtolower($disposition->getFieldValue()), 'attachment')) {
            return false;
        }

        $contentType = $response->getHeader('Content-Type');

        if ($contentType !== false && !str_contains(strtolower($contentType->getFieldValue()), 'text/html')) {
            return false;
        }

        return preg_match('#</body\s*>#i', (string) $response->getContent()) === 1;
    }

    /**
     * @param array<string, mixed> $profile
     */
    /**
     * The request watcher has to block in the head. By the time a deferred module at the
     * end of the body runs, the theme has already fetched its private content, and those
     * requests would never be seen.
     */
    private function insertHead(string $html): string
    {
        $script = sprintf(
            '<script src="%s"></script>',
            $this->escape($this->assets->for('js/debugbar-early.js'))
        );

        if (preg_match('#</head\s*>#i', $html) !== 1) {
            return $html;
        }

        return (string) preg_replace_callback(
            '#</head\s*>#i',
            static fn (array $matches): string => $script . $matches[0],
            $html,
            1
        );
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function insertBody(string $html, array $profile): string
    {
        $json = json_encode(
            $this->slim($profile),
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP
        );

        $markup = sprintf(
            '<div id="%s" data-css="%s" data-profile-url="%s" data-front-name="%s"'
            . ' data-value-policy="%s"></div>'
            . '<script type="application/json" id="%s">%s</script>'
            . '<script type="module" src="%s" defer></script>',
            self::ROOT_ID,
            $this->escape($this->assets->for('css/debugbar.css')),
            $this->escape($this->profileUrl(self::ID_PLACEHOLDER)),
            RequestEligibility::FRONT_NAME,
            $this->escape($this->config->valuePolicy()),
            self::DATA_ID,
            $json === false ? '{}' : $json,
            $this->escape($this->assets->for('js/debugbar.js'))
        );

        // preg_replace would read the backslashes in the payload, PHP class names above
        // all, as escape sequences in the replacement and corrupt the JSON. A callback
        // hands the replacement back untouched.
        return (string) preg_replace_callback(
            '#</body\s*>#i',
            static fn (array $matches): string => $markup . $matches[0],
            $html,
            1
        );
    }

    /**
     * Summaries only. A busy uncached page produces a profile of several hundred
     * kilobytes, and adding that to every response while developing would be worse than
     * the problem the bar solves. The bar fetches a section's items when it is opened.
     *
     * @param array<string, mixed> $profile
     * @return array<string, mixed>
     */
    private function slim(array $profile): array
    {
        $sections = [];

        foreach ((array) ($profile['sections'] ?? []) as $key => $section) {
            $sections[$key] = [
                'label' => $section['label'] ?? $key,
                'summary' => $section['summary'] ?? [],
            ];
        }

        return [...$profile, 'sections' => $sections, 'lazy' => true];
    }

    private function profileUrl(string $id): string
    {
        return $this->url->getUrl('siteation_debugbar/profile/view', ['id' => $id, '_secure' => true]);
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
