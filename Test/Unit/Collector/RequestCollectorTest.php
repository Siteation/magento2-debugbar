<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Collector;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\App\State;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Siteation\DebugBar\Collector\RequestCollector;
use Siteation\DebugBar\Model\AccessKey;
use Siteation\DebugBar\Model\CallSiteResolver;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\Redactor;

/**
 * The two places where this collector writes a secret into a file if it gets them wrong.
 *
 * The admin URL carries a per-route CSRF token as a path segment, and an exception message
 * carries whatever the application was told: "No such entity with email = jane@example.com"
 * is a normal Magento message. Both are pure string functions, and neither had a test.
 */
class RequestCollectorTest extends TestCase
{
    #[Test]
    public function theAdminUrlSecretNeverReachesTheStoredPath(): void
    {
        $collector = $this->collector('/magedebugbar_admin/admin/dashboard/index/key/c9e10dcff2511b58f0a/');
        $collector->finalize($this->createStub(ResponseInterface::class));

        $path = $collector->summary()['path'];

        $this->assertStringNotContainsString('c9e10dcff2511b58f0a', $path);
        $this->assertStringContainsString(Redactor::REDACTED, $path);
        $this->assertStringContainsString('/admin/dashboard/index/', $path, 'the route still identifies it');
    }

    #[Test]
    public function aPathIsStillStoredWhenThereIsNoSecretInIt(): void
    {
        $collector = $this->collector('/checkout/cart/');
        $collector->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame('/checkout/cart/', $collector->summary()['path']);
    }

    #[Test]
    public function anExceptionMessageFollowsTheValuePolicy(): void
    {
        $message = 'No such entity with email = jane@example.com';

        $full = $this->collector('/x', Redactor::POLICY_FULL);
        $full->captureFailure(new RuntimeException($message));
        $full->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame($message, $full->summary()['exception']['message']);

        $masked = $this->collector('/x', Redactor::POLICY_MASKED);
        $masked->captureFailure(new RuntimeException($message));
        $masked->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame(Redactor::MASKED, $masked->summary()['exception']['message']);

        $none = $this->collector('/x', Redactor::POLICY_NONE);
        $none->captureFailure(new RuntimeException($message));
        $none->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame('', $none->summary()['exception']['message']);

        // Whatever the policy, the class is what went wrong and it stays.
        foreach ([$full, $masked, $none] as $collector) {
            $this->assertSame(RuntimeException::class, $collector->summary()['exception']['class']);
        }
    }

    #[Test]
    public function aRequestThatDidNotThrowCarriesNoExceptionKey(): void
    {
        // A null on every profile would say a request threw nothing, which is not the same
        // as a request that was never asked.
        $collector = $this->collector('/x');
        $collector->finalize($this->createStub(ResponseInterface::class));

        $this->assertArrayNotHasKey('exception', $collector->summary());
        $this->assertTrue($collector->summary()['completed']);
    }

    #[Test]
    public function theAccessKeyIsNotStoredInTheQueryItArrivedIn(): void
    {
        // The bootstrap request carries the key in its URL and is the first thing profiled.
        // Left there it would write the credential that gates the module into the file it
        // unlocks. The sensitive-key pattern would not catch it: only this module knows it.
        $collector = $this->collector('/', Redactor::POLICY_FULL, [
            AccessKey::PARAM => 'a-real-key',
            'q' => 'shoes',
        ]);

        $query = $collector->payload()['query_params'] ?? [];

        $this->assertArrayNotHasKey(AccessKey::PARAM, $query);
        $this->assertSame('shoes', $query['q'] ?? null);
    }

    /**
     * @param array<string, mixed> $query
     */
    private function collector(
        string $path,
        string $policy = Redactor::POLICY_FULL,
        array $query = []
    ): RequestCollector {
        $request = $this->createStub(HttpRequest::class);
        $request->method('getPathInfo')->willReturn($path);
        $request->method('getMethod')->willReturn('GET');
        $request->method('getRouteName')->willReturn('route');
        $request->method('getFullActionName')->willReturn('action');
        $request->method('getQueryValue')->willReturn($query);

        $config = $this->createStub(Config::class);
        $config->method('valuePolicy')->willReturn($policy);

        $state = $this->createStub(State::class);
        $state->method('getAreaCode')->willReturn('frontend');
        $state->method('getMode')->willReturn(State::MODE_DEVELOPER);

        $callSites = $this->createStub(CallSiteResolver::class);
        $callSites->method('relativePath')->willReturnArgument(0);
        $callSites->method('fromTrace')->willReturn([]);

        return new RequestCollector(
            new Redactor(),
            new Clock(),
            $request,
            $state,
            $config,
            $callSites
        );
    }
}
