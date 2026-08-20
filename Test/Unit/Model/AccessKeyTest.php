<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Stdlib\Cookie\PublicCookieMetadata;
use Magento\Framework\Stdlib\CookieManagerInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\AccessKey;
use Siteation\DebugBar\Model\Config;

class AccessKeyTest extends TestCase
{
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
    private function key(
        string $configured,
        array $presented,
        ?CookieManagerInterface $cookies = null,
        ?CookieMetadataFactory $factory = null
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
            $factory ?? $this->createStub(CookieMetadataFactory::class)
        );
    }
}
