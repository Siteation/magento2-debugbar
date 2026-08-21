<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Stdlib\Cookie\PublicCookieMetadata;
use Magento\Framework\Stdlib\CookieManagerInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Magento\Framework\App\CacheInterface;
use Siteation\DebugBar\Model\AccessAttempts;
use Siteation\DebugBar\Model\AccessKey;
use Siteation\DebugBar\Model\ClientAddress;
use Siteation\DebugBar\Model\Config;

class AccessKeyTest extends TestCase
{
    /** @var array<string, string> what the fake cache is holding */
    private array $cached = [];

    #[Test]
    public function withNoKeyConfiguredThereIsNothingToProve(): void
    {
        // The developer machine the module was written for. Config refuses to enable in
        // production without a key, so this can never be the answer on a live site.
        $this->assertTrue($this->key('', [])->allows());
    }

    #[Test]
    public function aRequestWithoutTheKeyIsAnOrdinaryVisitor(): void
    {
        $this->assertFalse($this->key('secret', [])->allows());
        $this->assertFalse($this->key('secret', ['header' => 'wrong'])->allows());
        $this->assertFalse($this->key('secret', ['cookie' => ''])->allows());
    }

    #[Test]
    public function anyOfThreeChannelsWillDo(): void
    {
        // Four areas are profiled and a browser is only one of them: curl and an agent send
        // a header, a browser sends the cookie it was given.
        $this->assertTrue($this->key('secret', ['header' => 'secret'])->allows());
        $this->assertTrue($this->key('secret', ['cookie' => 'secret'])->allows());
        $this->assertTrue($this->key('secret', ['param' => 'secret'])->allows());
    }

    #[Test]
    public function oneWrongChannelDoesNotSpoilARightOne(): void
    {
        $this->assertTrue($this->key('secret', ['header' => 'stale', 'cookie' => 'secret'])->allows());
    }

    #[Test]
    public function onlyTheUrlFormIsWorthTradingForACookie(): void
    {
        $this->assertTrue($this->key('secret', ['param' => 'secret'])->wasPresentedInUrl());
        $this->assertFalse($this->key('secret', ['header' => 'secret'])->wasPresentedInUrl());
        $this->assertFalse($this->key('secret', ['param' => 'wrong'])->wasPresentedInUrl());
        $this->assertFalse($this->key('', ['param' => ''])->wasPresentedInUrl());
    }

    #[Test]
    public function theCookieIsBoundedAndOutOfReachOfJavaScript(): void
    {
        $metadata = $this->createMock(PublicCookieMetadata::class);

        foreach (['setDuration', 'setPath', 'setHttpOnly', 'setSecure', 'setSameSite'] as $setter) {
            $metadata->method($setter)->willReturnSelf();
        }

        $metadata->expects($this->once())->method('setHttpOnly')->with(true);
        $metadata->expects($this->once())->method('setDuration')->with(3600);
        $metadata->expects($this->once())->method('setSameSite')->with('Lax');

        $factory = $this->createStub(CookieMetadataFactory::class);
        $factory->method('createPublicCookieMetadata')->willReturn($metadata);

        $cookies = $this->createMock(CookieManagerInterface::class);
        $cookies->expects($this->once())->method('setPublicCookie')
            ->with(AccessKey::COOKIE, 'secret', $metadata);

        $this->assertTrue($this->key('secret', ['param' => 'secret'], $cookies, $factory)->issueCookie());
    }

    #[Test]
    public function aCookieThatCannotBeSetDoesNotCostThePageAndSaysSo(): void
    {
        // The return value is the contract, not the absence of a throw: HttpPlugin branches
        // on it to decide whether to warn, and a catch that returned true would leave the
        // silent no-op the warning exists to prevent.
        $cookies = $this->createStub(CookieManagerInterface::class);
        $cookies->method('setPublicCookie')->willThrowException(new \RuntimeException('headers sent'));

        $this->assertFalse($this->key('secret', ['param' => 'secret'], $cookies)->issueCookie());
    }

    /**
     * @param array{header?: string, cookie?: string, param?: string} $presented
     */
    #[Test]
    public function anAddressThatKeepsGuessingStopsBeingAnswered(): void
    {
        $key = str_repeat('a', 32);

        for ($attempt = 0; $attempt < AccessAttempts::LIMIT; $attempt++) {
            $this->assertFalse($this->sharedKey($key, ['header' => 'wrong'])->allows());
        }

        // Past the limit the right key is refused too, which is the point: the endpoint
        // stops being an oracle rather than merely answering "no" more often.
        $this->assertFalse($this->sharedKey($key, ['header' => $key])->allows());
    }

    #[Test]
    public function aCustomerWhoPresentsNothingNeverFillsTheBucket(): void
    {
        // On a live site with a key set, every visitor request arrives without one. Counting
        // those would lock the developer out through the traffic the site exists to serve,
        // and would cost a cache read on every page to do it.
        $key = str_repeat('a', 32);

        for ($attempt = 0; $attempt < AccessAttempts::LIMIT * 2; $attempt++) {
            $this->assertFalse($this->sharedKey($key, [])->allows());
        }

        $this->assertTrue($this->sharedKey($key, ['header' => $key])->allows());
    }

    #[Test]
    public function theRightKeyClearsWhatCameBeforeIt(): void
    {
        // A developer who pasted the wrong thing twice is not two mistakes from a lockout
        // for the next quarter of an hour.
        $key = str_repeat('a', 32);

        $this->assertFalse($this->sharedKey($key, ['header' => 'wrong'])->allows());
        $this->assertTrue($this->sharedKey($key, ['header' => $key])->allows());

        for ($attempt = 0; $attempt < AccessAttempts::LIMIT - 1; $attempt++) {
            $this->assertFalse($this->sharedKey($key, ['header' => 'wrong'])->allows());
        }

        $this->assertTrue(
            $this->sharedKey($key, ['header' => $key])->allows(),
            'the count restarted, so this is still inside the limit'
        );
    }

    #[Test]
    public function aCacheThatFailsLeavesTheCounterOpenRatherThanTheDoorShut(): void
    {
        // The key comparison is the control and is untouched by any of this. Refusing on a
        // cache hiccup would lock a developer out of their own store to protect a check that
        // has already happened.
        $cache = $this->createStub(CacheInterface::class);
        $cache->method('load')->willThrowException(new RuntimeException('cache down'));
        $cache->method('save')->willThrowException(new RuntimeException('cache down'));

        $key = str_repeat('a', 32);
        $attempts = new AccessAttempts($cache);

        $this->assertFalse($this->key($key, ['header' => 'no'], null, null, $attempts)->allows());
        $this->assertTrue($this->key($key, ['header' => $key], null, null, $attempts)->allows());
    }

    /**
     * Successive requests from one address, which is what the counter is about: each call
     * builds a new AccessKey over the same cache.
     *
     * @param array<string, string> $presented
     */
    private function sharedKey(string $configured, array $presented): AccessKey
    {
        return $this->key($configured, $presented, null, null, $this->attempts());
    }

    /**
     * A counter over a cache that only has to remember, which is all it asks of one.
     */
    private function attempts(): AccessAttempts
    {
        $cache = $this->createStub(CacheInterface::class);
        $cache->method('load')->willReturnCallback(
            fn (string $key): string|false => $this->cached[$key] ?? false
        );
        $cache->method('save')->willReturnCallback(
            function (string $data, string $key): bool {
                $this->cached[$key] = $data;

                return true;
            }
        );
        $cache->method('remove')->willReturnCallback(
            function (string $key): bool {
                unset($this->cached[$key]);

                return true;
            }
        );

        return new AccessAttempts($cache);
    }

    private function key(
        string $configured,
        array $presented,
        ?CookieManagerInterface $cookies = null,
        ?CookieMetadataFactory $factory = null,
        ?AccessAttempts $attempts = null
    ): AccessKey {
        $config = $this->createStub(Config::class);
        $config->method('accessKey')->willReturn($configured);

        $request = $this->createStub(HttpRequest::class);
        $request->method('getHeader')->willReturn($presented['header'] ?? false);
        $request->method('getParam')->willReturn($presented['param'] ?? null);
        $request->method('isSecure')->willReturn(true);

        $cookieManager = $cookies ?? $this->createStub(CookieManagerInterface::class);

        if ($cookies === null) {
            $stub = $this->createStub(CookieManagerInterface::class);
            $stub->method('getCookie')->willReturn($presented['cookie'] ?? null);
            $cookieManager = $stub;
        }

        return new AccessKey(
            $config,
            $request,
            $cookieManager,
            $factory ?? $this->createStub(CookieMetadataFactory::class),
            $attempts ?? $this->attempts(),
            new ClientAddress($request)
        );
    }
}
