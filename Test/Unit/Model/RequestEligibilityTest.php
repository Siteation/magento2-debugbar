<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\App\AreaList;
use Magento\Framework\App\Request\Http as HttpRequest;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\AccessKey;
use Siteation\DebugBar\Model\ClientAddress;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\RequestEligibility;

class RequestEligibilityTest extends TestCase
{
    #[Test]
    public function readingIsRefusedWithoutTheKey(): void
    {
        // The wiring, not the comparison: an endpoint that answers someone the collector
        // would have ignored is a way around the gate rather than a thing behind it.
        $this->assertFalse($this->eligibility(key: false)->allowsRead());
        $this->assertFalse($this->eligibility(key: false)->allows());
    }

    #[Test]
    public function readingIsRefusedWhenTheBarIsOff(): void
    {
        $this->assertFalse($this->eligibility(enabled: false)->allowsRead());
    }

    #[Test]
    public function readingIsRefusedFromAnAddressThatIsNotAllowed(): void
    {
        $this->assertFalse($this->eligibility(ip: false)->allowsRead());
    }

    #[Test]
    public function everythingSatisfiedLetsBothThrough(): void
    {
        $this->assertTrue($this->eligibility()->allowsRead());
        $this->assertTrue($this->eligibility()->allows());
    }

    #[Test]
    public function anAreaThatIsNotCollectedCanStillBeRead(): void
    {
        // The area list says what is worth profiling, not who may look. A profile of an
        // area since switched off was still collected for this developer.
        $eligibility = $this->eligibility(area: false);

        $this->assertTrue($eligibility->allowsRead());
        $this->assertFalse($eligibility->allows());
    }

    #[Test]
    public function theBarDoesNotProfileItsOwnEndpoints(): void
    {
        $eligibility = $this->eligibility(path: '/siteation_debugbar/profile/view/id/x/');

        $this->assertFalse($eligibility->allows(), 'Reading a profile would evict real ones.');
        $this->assertTrue($eligibility->allowsRead());
    }

    private function eligibility(
        bool $enabled = true,
        bool $ip = true,
        bool $area = true,
        bool $key = true,
        string $path = '/checkout/cart/'
    ): RequestEligibility {
        $config = $this->createStub(Config::class);
        $config->method('isEnabled')->willReturn($enabled);
        $config->method('allowsIp')->willReturn($ip);
        $config->method('allowsArea')->willReturn($area);

        $request = $this->createStub(HttpRequest::class);
        $request->method('getPathInfo')->willReturn($path);
        $request->method('getFrontName')->willReturn(trim($path, '/'));
        $request->method('getServer')->willReturn('127.0.0.1');

        $accessKey = $this->createStub(AccessKey::class);
        $accessKey->method('allows')->willReturn($key);

        return new RequestEligibility(
            $config,
            $request,
            $this->createStub(AreaList::class),
            $accessKey,
            new ClientAddress($request)
        );
    }
}
