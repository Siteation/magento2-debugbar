<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\State;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\Redactor;

class ConfigTest extends TestCase
{
    #[Test]
    public function productionModeRefusesEvenWhenTheFlagIsOn(): void
    {
        $config = $this->config(State::MODE_PRODUCTION, ['dev/siteation_debugbar/enabled' => true]);

        $this->assertFalse($config->isEnabled());
    }

    #[Test]
    public function developerModeStillNeedsTheFlag(): void
    {
        $this->assertFalse($this->config(State::MODE_DEVELOPER, [])->isEnabled());
        $this->assertTrue(
            $this->config(State::MODE_DEVELOPER, ['dev/siteation_debugbar/enabled' => true])->isEnabled()
        );
    }

    #[Test]
    public function anEmptyAreaListMeansEveryArea(): void
    {
        $config = $this->enabled([]);

        $this->assertTrue($config->allowsArea('frontend'));
        $this->assertTrue($config->allowsArea('adminhtml'));
    }

    #[Test]
    public function anAreaListExcludesEverythingElse(): void
    {
        $config = $this->enabled(['dev/siteation_debugbar/areas' => 'frontend,graphql']);

        $this->assertTrue($config->allowsArea('frontend'));
        $this->assertTrue($config->allowsArea('graphql'));
        $this->assertFalse($config->allowsArea('adminhtml'));
        $this->assertFalse($config->allowsArea(null));
    }

    #[Test]
    public function anEmptyAllowlistMeansEveryAddress(): void
    {
        $this->assertTrue($this->enabled([])->allowsIp('203.0.113.9'));
    }

    #[Test]
    public function anAllowlistExcludesEverythingElse(): void
    {
        $config = $this->enabled(['dev/siteation_debugbar/allowed_ips' => '127.0.0.1, 192.168.1.5']);

        $this->assertTrue($config->allowsIp('127.0.0.1'));
        $this->assertTrue($config->allowsIp('192.168.1.5'));
        $this->assertFalse($config->allowsIp('203.0.113.9'));
        $this->assertFalse($config->allowsIp(null), 'An unknown address is not on the list.');
    }

    #[Test]
    public function anUnknownValuePolicyFallsBackToFull(): void
    {
        $config = $this->enabled(['dev/siteation_debugbar/value_policy' => 'nonsense']);

        $this->assertSame(Redactor::POLICY_FULL, $config->valuePolicy());
    }

    #[Test]
    public function thresholdsRejectNonsenseAndKeepTheirDefaults(): void
    {
        $config = $this->enabled([
            'dev/siteation_debugbar/slow_query_ms' => 'abc',
            'dev/siteation_debugbar/slow_request_ms' => '-5',
        ]);

        $this->assertSame(100.0, $config->slowQueryMs());
        $this->assertSame(1000.0, $config->slowRequestMs());
    }

    /**
     * @param array<string, mixed> $values
     */
    private function enabled(array $values): Config
    {
        return $this->config(
            State::MODE_DEVELOPER,
            ['dev/siteation_debugbar/enabled' => true] + $values
        );
    }

    /**
     * @param array<string, mixed> $values
     */
    private function config(string $mode, array $values): Config
    {
        $scopeConfig = $this->createStub(ScopeConfigInterface::class);
        $scopeConfig->method('isSetFlag')
            ->willReturnCallback(static fn (string $path): bool => (bool) ($values[$path] ?? false));
        $scopeConfig->method('getValue')
            ->willReturnCallback(static fn (string $path): mixed => $values[$path] ?? null);

        $state = $this->createStub(State::class);
        $state->method('getMode')->willReturn($mode);

        return new Config($scopeConfig, $state);
    }
}
