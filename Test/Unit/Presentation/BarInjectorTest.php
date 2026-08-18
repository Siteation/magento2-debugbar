<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Presentation;

use Laminas\Http\Header\ContentType;
use Magento\Framework\HTTP\PhpEnvironment\Response as HttpResponse;
use Magento\Framework\UrlInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
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

        $this->injector = new BarInjector($assets, $url);
    }

    #[Test]
    public function itInjectsIntoHtml(): void
    {
        $response = $this->response('<html><head></head><body><p>Hello</p></body></html>');

        $this->injector->inject($response, $this->profile());

        $body = $response->getContent();
        $this->assertStringContainsString('id="siteation-debugbar"', $body);
        $this->assertStringContainsString('type="application/json"', $body);
        $this->assertStringContainsString('debugbar-early.js', $body);
        $this->assertStringContainsString('<p>Hello</p>', $body, 'The page itself must survive.');
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

        $this->assertStringNotContainsString('id="siteation-debugbar"', $response->getContent());
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
