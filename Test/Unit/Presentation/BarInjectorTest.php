<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Presentation;

use Laminas\Http\Header\ContentType;
use Magento\Framework\HTTP\PhpEnvironment\Response as HttpResponse;
use Magento\Framework\UrlInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\Redactor;
use Siteation\DebugBar\Presentation\AssetUrl;
use Siteation\DebugBar\Presentation\BarInjector;

class BarInjectorTest extends TestCase
{
    private BarInjector $injector;

    protected function setUp(): void
    {
        $assets = $this->createStub(AssetUrl::class);
        $assets->method('for')->willReturnCallback(
            static fn (string $file): string => 'https://example.test/static/' . $file
        );

        $url = $this->createStub(UrlInterface::class);
        $url->method('getUrl')->willReturn('https://example.test/siteation_debugbar/profile/view/');

        $config = $this->createStub(Config::class);
        $config->method('valuePolicy')->willReturn(Redactor::POLICY_MASKED);

        $this->injector = new BarInjector($assets, $url, $config);
    }

    #[Test]
    public function itInjectsIntoHtml(): void
    {
        $response = $this->response('<html><head></head><body><p>Hello</p></body></html>');

        $this->injector->inject($response, $this->profile());

        $body = $response->getContent();
        $this->assertStringContainsString('<siteation-debugbar data-css=', $body);
        $this->assertStringContainsString('</siteation-debugbar>', $body);
        $this->assertStringContainsString('type="application/json"', $body);
        $this->assertStringContainsString('debugbar-early.js', $body);
        $this->assertStringContainsString(
            'data-value-policy="masked"',
            $body,
            'The Alpine section redacts in the browser, so it has to be told the policy.'
        );
        $this->assertStringContainsString('<p>Hello</p>', $body, 'The page itself must survive.');
    }

    #[Test]
    public function aResponseCarryingDebugDataIsNeverShared(): void
    {
        // The promise the module treats as non-negotiable, and the one whose failure is
        // invisible on a developer machine: with no cache in front, dropping these headers
        // changes nothing you can see and every other test stays green. It only shows up on
        // the one installation that matters, a live site behind a CDN serving one
        // developer's profile id to everybody.
        foreach ([$this->response('<html><body></body></html>'), $this->response('{}', 'application/json')] as $response) {
            $response->setHeader('X-Magento-Tags', 'cat_p_1');

            $this->injector->inject($response, $this->profile());

            $cacheControl = $response->getHeader('Cache-Control');

            $this->assertNotFalse($cacheControl);
            $this->assertStringContainsString('no-store', $cacheControl->getFieldValue());
            $this->assertFalse(
                $response->getHeader('X-Magento-Tags'),
                'A tagged response is one Varnish would store and serve to someone else.'
            );
        }
    }

    #[Test]
    public function itAlwaysSetsTheProfileHeader(): void
    {
        $response = $this->response('{"data":1}', 'application/json');

        $this->injector->inject($response, $this->profile());

        $header = $response->getHeader(BarInjector::PROFILE_HEADER);
        $this->assertNotFalse($header);
        $this->assertSame('11111111-1111-4111-8111-111111111111', $header->getFieldValue());
    }

    #[Test]
    public function itLeavesNonHtmlBodiesAlone(): void
    {
        $response = $this->response('{"data":1}', 'application/json');

        $this->injector->inject($response, $this->profile());

        $this->assertSame('{"data":1}', $response->getContent());
    }

    #[Test]
    public function itLeavesRedirectsAlone(): void
    {
        $response = $this->response('<html><body></body></html>');
        $response->setHttpResponseCode(302);

        $this->injector->inject($response, $this->profile());

        $this->assertStringNotContainsString('siteation-debugbar', $response->getContent());
    }

    #[Test]
    public function itLeavesAttachmentsAlone(): void
    {
        $response = $this->response('<html><body></body></html>');
        $response->setHeader('Content-Disposition', 'attachment; filename="export.html"');

        $this->injector->inject($response, $this->profile());

        $this->assertStringNotContainsString('siteation-debugbar', $response->getContent());
    }

    #[Test]
    public function itLeavesBodylessResponsesAlone(): void
    {
        $response = $this->response('<html><head></head></html>');

        $this->injector->inject($response, $this->profile());

        $this->assertStringNotContainsString('<siteation-debugbar', $response->getContent());
    }

    #[Test]
    public function itSurvivesBackslashesInThePayload(): void
    {
        $response = $this->response('<html><head></head><body></body></html>');
        $profile = $this->profile();
        $profile['sections']['observers'] = [
            'label' => 'Observers',
            'summary' => ['count' => 1],
            'payload' => ['items' => [['instance' => 'Vendor\\Module\\Observer\\Thing']]],
        ];

        $this->injector->inject($response, $profile);

        preg_match(
            '#<script type="application/json" id="siteation-debugbar-profile">(.*?)</script>#s',
            $response->getContent(),
            $matches
        );

        $this->assertNotEmpty($matches, 'The JSON island must be present.');
        $this->assertIsArray(
            json_decode($matches[1], true),
            'preg_replace would read the backslashes as escapes and break the JSON.'
        );
    }

    #[Test]
    public function itEmbedsSummariesButNotItems(): void
    {
        $response = $this->response('<html><head></head><body></body></html>');
        $profile = $this->profile();
        $profile['sections']['queries']['payload']['items'] = [['sql' => 'SELECT needle']];

        $this->injector->inject($response, $profile);

        $this->assertStringNotContainsString('SELECT needle', $response->getContent());
        $this->assertStringContainsString('"count":42', $response->getContent());
    }

    /**
     * The framework's App\Response\Http needs five collaborators to construct. Its parent
     * already implements App\Response\HttpInterface, which is all the injector asks for.
     */
    private function response(string $body, string $contentType = 'text/html'): HttpResponse
    {
        $response = new HttpResponse();
        $response->setContent($body);
        $response->getHeaders()->addHeader(new ContentType($contentType));

        return $response;
    }

    /**
     * @return array<string, mixed>
     */
    private function profile(): array
    {
        return [
            'id' => '11111111-1111-4111-8111-111111111111',
            'version' => 1,
            'metrics' => ['duration_ms' => 10.0],
            'sections' => [
                'queries' => [
                    'label' => 'Queries',
                    'summary' => ['count' => 42],
                    'payload' => ['items' => []],
                ],
            ],
            'findings' => [],
        ];
    }
}
