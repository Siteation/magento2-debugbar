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

    #[Test]
    public function aMagewireUpdateSaysWhichComponentAndWhatItWasAskedToDo(): void
    {
        // Every component posts to the same URL, so without this the request list is a
        // column of identical rows.
        $collector = $this->collector('/magewire/post/livewire', body: [
            'fingerprint' => ['id' => 'abc', 'name' => 'checkout.cart', 'resolver' => 'layout'],
            'updates' => [
                ['type' => 'callMethod', 'payload' => ['method' => 'addToCart', 'params' => [42]]],
            ],
        ], route: 'magewire');

        $collector->finalize($this->createStub(ResponseInterface::class));

        $magewire = $collector->summary()['magewire'];

        $this->assertSame('checkout.cart', $magewire['component']);
        $this->assertSame('addToCart()', $magewire['action']);
        $this->assertSame('layout', $magewire['resolver']);
        $this->assertSame(1, $magewire['update_count']);
    }

    #[Test]
    public function anUpdateNamesItsPropertyOrItsEventButNeverTheValue(): void
    {
        // A method name is the developer's. What was typed into the input beside it is the
        // customer's, and it has no business in a label.
        $syncing = $this->collector('/magewire/post/livewire', body: [
            'fingerprint' => ['name' => 'search.form'],
            'updates' => [
                ['type' => 'syncInput', 'payload' => ['name' => 'term', 'value' => 'jane@example.com']],
            ],
        ], route: 'magewire');
        $syncing->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame('set term', $syncing->summary()['magewire']['action']);
        $this->assertStringNotContainsString(
            'jane@example.com',
            json_encode($syncing->summary()),
            'the payload beside the name is what the customer typed'
        );

        $firing = $this->collector('/magewire/post/livewire', body: [
            'fingerprint' => ['name' => 'cart'],
            'updates' => [['type' => 'fireEvent', 'payload' => ['event' => 'cartUpdated', 'params' => []]]],
        ], route: 'magewire');
        $firing->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame('on cartUpdated', $firing->summary()['magewire']['action']);
    }

    #[Test]
    public function aNameOffTheWireIsBoundedAndReducedToWhatANameCanBe(): void
    {
        $collector = $this->collector('/magewire/post/livewire', body: [
            'fingerprint' => ['name' => '<img src=x onerror=alert(1)>' . str_repeat('a', 300)],
            'updates' => [],
        ], route: 'magewire');
        $collector->finalize($this->createStub(ResponseInterface::class));

        $component = $collector->summary()['magewire']['component'];

        $this->assertStringNotContainsString('<', $component);
        $this->assertStringNotContainsString(' ', $component);
        $this->assertLessThanOrEqual(120, strlen($component));
    }

    #[Test]
    public function aRequestThatIsNotAMagewireUpdateCarriesNoMagewireKey(): void
    {
        // Including a body that looks like one on a route that is not it, and a route that
        // is it with a body that is not JSON: a store without Magewire must read the same
        // as it did before.
        $plain = $this->collector('/checkout/cart/');
        $plain->finalize($this->createStub(ResponseInterface::class));

        $this->assertArrayNotHasKey('magewire', $plain->summary());

        $rubbish = $this->collector('/magewire/post/livewire', route: 'magewire');
        $rubbish->finalize($this->createStub(ResponseInterface::class));

        $this->assertArrayNotHasKey('magewire', $rubbish->summary());
    }

    /**
     * @param array<string, mixed> $query
     * @param array<string, mixed>|null $body
     */
    private function collector(
        string $path,
        string $policy = Redactor::POLICY_FULL,
        array $query = [],
        ?array $body = null,
        string $route = 'route'
    ): RequestCollector {
        $request = $this->createStub(HttpRequest::class);
        $request->method('getPathInfo')->willReturn($path);
        $request->method('getMethod')->willReturn($body === null ? 'GET' : 'POST');
        $request->method('getRouteName')->willReturn($route);
        $request->method('getContent')->willReturn($body === null ? 'not json' : json_encode($body));
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
