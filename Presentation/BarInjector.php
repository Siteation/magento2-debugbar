<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Presentation;

use Magento\Framework\App\Response\HttpInterface as HttpResponse;
use Magento\Framework\App\ResponseInterface;

/**
 * Adds the bar to HTML responses, and the profile id to every profiled response.
 *
 * Only three tags reach the page, and none of them are inline script or inline style: the
 * profile travels as <script type="application/json">, which browsers treat as data, and
 * the stylesheet URL travels as a data attribute for the bar to load inside its shadow
 * root. Magento_Csp therefore needs no nonce and no unsafe-inline.
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

    public function __construct(
        private readonly AssetUrl $assets
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

        if (!$this->supports($response)) {
            return;
        }

        $html = $this->insertBody((string) $response->getContent(), $profile);

        $response->setBody($html);
        $response->clearHeader('Content-Length');
    }

    private function supports(HttpResponse $response): bool
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
    private function insertBody(string $html, array $profile): string
    {
        $json = json_encode(
            $profile,
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP
        );

        $markup = sprintf(
            '<div id="%s" data-css="%s"></div>'
            . '<script type="application/json" id="%s">%s</script>'
            . '<script type="module" src="%s" defer></script>',
            self::ROOT_ID,
            $this->escape($this->assets->for('css/debugbar.css')),
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

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
