<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\DeploymentConfig;
use Magento\Framework\App\Filesystem\DirectoryList;
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
        $config = $this->config(State::MODE_PRODUCTION, ['siteation_debugbar/general/enabled' => true]);

        $this->assertFalse($config->isEnabled());
    }

    #[Test]
    public function developerModeStillNeedsTheFlag(): void
    {
        $this->assertFalse($this->config(State::MODE_DEVELOPER, [])->isEnabled());
        $this->assertTrue(
            $this->config(State::MODE_DEVELOPER, ['siteation_debugbar/general/enabled' => true])->isEnabled()
        );
    }

    #[Test]
    public function everyModeButDeveloperNeedsAKey(): void
    {
        // Default is the third mode, is what MAGE_MODE falls back to, and is what plenty of
        // live sites actually run. Keying the rule off production alone left those open.
        foreach ([State::MODE_PRODUCTION, State::MODE_DEFAULT] as $mode) {
            $this->assertFalse(
                $this->production($mode, [])->isEnabled(),
                $mode . ' must not run keyless'
            );

            $this->assertTrue(
                $this->production($mode, ['siteation_debugbar/general/access_key' => str_repeat('a', 32)])->isEnabled(),
                $mode . ' runs behind a key'
            );
        }
    }

    #[Test]
    public function productionNeedsANonEmptyAddressList(): void
    {
        $key = ['siteation_debugbar/general/access_key' => str_repeat('a', 32)];

        $this->assertFalse($this->production(State::MODE_PRODUCTION, $key, false)->isEnabled());
        $this->assertFalse(
            $this->production(State::MODE_PRODUCTION, $key + ['siteation_debugbar/general/allowed_ips' => ' , '], false)
                ->isEnabled()
        );
        $this->assertTrue($this->production(State::MODE_PRODUCTION, $key)->isEnabled());
    }

    #[Test]
    public function otherModesStillRunWithoutAnAddressList(): void
    {
        $values = [
            'siteation_debugbar/general/enabled' => true,
            'siteation_debugbar/general/access_key' => str_repeat('a', 32),
        ];

        $this->assertTrue($this->config(State::MODE_DEFAULT, $values)->isEnabled());
        $this->assertTrue($this->config(State::MODE_DEVELOPER, $values)->isEnabled());
    }

    #[Test]
    public function productionIgnoresTheSwitchSavedInTheAdmin(): void
    {
        $values = [
            'siteation_debugbar/general/enabled' => true,
            'siteation_debugbar/general/access_key' => str_repeat('a', 32),
            'siteation_debugbar/general/allowed_ips' => '203.0.113.9',
        ];

        $this->assertFalse($this->config(State::MODE_PRODUCTION, $values)->isEnabled());
        $this->assertFalse(
            $this->config(
                State::MODE_PRODUCTION,
                $values,
                ['system/default/siteation_debugbar/general/enabled' => '0']
            )->isEnabled()
        );
    }

    #[Test]
    public function productionRunsOnASwitchFromTheDeploymentConfig(): void
    {
        $values = [
            'siteation_debugbar/general/access_key' => str_repeat('a', 32),
            'siteation_debugbar/general/allowed_ips' => '203.0.113.9',
        ];

        foreach ([true, 1, '1'] as $deployed) {
            $this->assertTrue(
                $this->config(
                    State::MODE_PRODUCTION,
                    $values,
                    ['system/default/siteation_debugbar/general/enabled' => $deployed]
                )->isEnabled(),
                var_export($deployed, true)
            );
        }
    }

    #[Test]
    public function onlyProductionReportsAsProduction(): void
    {
        $this->assertTrue($this->production(State::MODE_PRODUCTION, [
            'siteation_debugbar/general/access_key' => str_repeat('a', 32),
        ])->isProduction());
        $this->assertFalse($this->production(State::MODE_DEFAULT, [
            'siteation_debugbar/general/access_key' => str_repeat('a', 32),
        ])->isProduction());
        $this->assertFalse(
            $this->config(State::MODE_DEVELOPER, ['siteation_debugbar/general/enabled' => true])->isProduction()
        );
    }

    /**
     * A shop that is set up the way production now requires: the switch in the deployment
     * config and an address on the list.
     *
     * @param array<string, mixed> $values
     */
    private function production(string $mode, array $values, bool $withIps = true): Config
    {
        return $this->config(
            $mode,
            $values + ($withIps ? ['siteation_debugbar/general/allowed_ips' => '203.0.113.9'] : [])
                + ['siteation_debugbar/general/enabled' => true],
            ['system/default/siteation_debugbar/general/enabled' => true]
        );
    }

    #[Test]
    public function aKeyTooShortToBeAControlIsNotReadAsOne(): void
    {
        // The backend model refuses to save one this short, so a value that gets here was
        // written straight to the database or to env.php. Refusing to run at all is the
        // honest answer: treating it as absent would widen access rather than narrow it, and
        // in developer mode that would turn a typo into a bar for every visitor.
        foreach ([State::MODE_PRODUCTION, State::MODE_DEFAULT, State::MODE_DEVELOPER] as $mode) {
            $this->assertFalse(
                $this->production($mode, [
                    'siteation_debugbar/general/access_key' => str_repeat('a', 31),
                ])->isEnabled(),
                $mode . ' must not accept a key below the floor'
            );
        }

        $this->assertTrue(
            $this->production(State::MODE_PRODUCTION, [
                'siteation_debugbar/general/access_key' => str_repeat('a', Config::MIN_ACCESS_KEY_LENGTH),
            ])->isEnabled(),
            'exactly the floor is long enough'
        );
    }

    #[Test]
    public function developerModeIsTheOneThatRunsKeyless(): void
    {
        // It is the only mode that is not somebody's live site.
        $config = $this->config(State::MODE_DEVELOPER, ['siteation_debugbar/general/enabled' => true]);

        $this->assertTrue($config->isEnabled());
        $this->assertSame('', $config->accessKey());
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
        $config = $this->enabled(['siteation_debugbar/general/areas' => 'frontend,graphql']);

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
        $config = $this->enabled(['siteation_debugbar/general/allowed_ips' => '127.0.0.1, 192.168.1.5']);

        $this->assertTrue($config->allowsIp('127.0.0.1'));
        $this->assertTrue($config->allowsIp('192.168.1.5'));
        $this->assertFalse($config->allowsIp('203.0.113.9'));
        $this->assertFalse($config->allowsIp(null), 'An unknown address is not on the list.');
    }

    #[Test]
    public function noProxyIsTrustedByDefault(): void
    {
        $this->assertSame([], $this->enabled([])->trustedProxies());
    }

    #[Test]
    public function trustedProxiesAreParsedLikeTheAllowlist(): void
    {
        $config = $this->enabled(['siteation_debugbar/general/trusted_proxies' => ' 10.0.0.1, ,10.0.0.2 ']);

        $this->assertSame(['10.0.0.1', '10.0.0.2'], $config->trustedProxies());
    }

    #[Test]
    public function aDisabledBarTrustsNoProxy(): void
    {
        $config = $this->config(State::MODE_DEVELOPER, [
            'siteation_debugbar/general/trusted_proxies' => '10.0.0.1',
        ]);

        $this->assertSame([], $config->trustedProxies());
    }

    #[Test]
    public function anUnknownValuePolicyFallsBackToFull(): void
    {
        $config = $this->enabled(['siteation_debugbar/general/value_policy' => 'nonsense']);

        $this->assertSame(Redactor::POLICY_FULL, $config->valuePolicy());
    }

    #[Test]
    public function thresholdsRejectNonsenseAndKeepTheirDefaults(): void
    {
        $config = $this->enabled([
            'siteation_debugbar/general/slow_query_ms' => 'abc',
            'siteation_debugbar/general/slow_request_ms' => '-5',
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
            ['siteation_debugbar/general/enabled' => true] + $values
        );
    }

    /**
     * @param array<string, mixed> $values
     */
    #[Test]
    public function noEditorMeansNoLink(): void
    {
        $this->assertSame('', $this->enabled([])->editor());
        $this->assertSame('', $this->enabled(['siteation_debugbar/general/editor' => 'nonsense'])->editor());
    }

    #[Test]
    public function aNamedEditorResolvesToItsTemplate(): void
    {
        $config = $this->enabled(['siteation_debugbar/general/editor' => 'vscode']);

        $this->assertSame('vscode://file%f:%l', $config->editor());
    }

    #[Test]
    public function aPathStyleTemplateDoesNotAddItsOwnSlash(): void
    {
        // %f is absolute, so ://file/%f would produce two slashes. Zed opens nothing at all
        // when it sees that, without complaining.
        foreach (['vscode', 'vscode_insiders', 'cursor', 'windsurf', 'zed'] as $editor) {
            $template = $this->enabled(['siteation_debugbar/general/editor' => $editor])->editor();

            $this->assertStringContainsString('://file%f', $template, $editor);
        }
    }

    #[Test]
    public function aCustomEditorUsesTheTemplateThatWasTyped(): void
    {
        $config = $this->enabled([
            'siteation_debugbar/general/editor' => 'custom',
            'siteation_debugbar/general/editor_template' => '  myeditor://go?f=%f&l=%l  ',
        ]);

        $this->assertSame('myeditor://go?f=%f&l=%l', $config->editor());
    }

    #[Test]
    public function withoutAPathMapTheRootIsTheApplicationRoot(): void
    {
        $this->assertSame('/var/www/html', $this->enabled([])->editorRoot());
    }

    #[Test]
    public function aPathMapMovesTheRootToWhereTheEditorCanSeeIt(): void
    {
        $config = $this->enabled([
            'siteation_debugbar/general/editor_path_map' => '/srv/app:/elsewhere,/var/www/html:/Users/you/shop',
        ]);

        $this->assertSame(
            '/Users/you/shop',
            $config->editorRoot(),
            'The first pair that matches wins, and the one that does not match is skipped.'
        );
    }

    #[Test]
    public function aHalfWrittenPathMapChangesNothing(): void
    {
        $config = $this->enabled(['siteation_debugbar/general/editor_path_map' => '/var/www/html:, :/somewhere']);

        $this->assertSame('/var/www/html', $config->editorRoot());
    }

    #[Test]
    public function noChosenSectionsMeansEverySection(): void
    {
        // Empty is all of them, so an instance that predates the setting behaves as it did.
        $config = $this->config(State::MODE_DEVELOPER, ['siteation_debugbar/general/enabled' => true]);

        foreach (['queries', 'blocks', 'events', 'cache', 'plugins', 'timeline'] as $section) {
            $this->assertTrue($config->collects($section), $section);
        }
    }

    #[Test]
    public function onlyTheChosenSectionsAreCollected(): void
    {
        $config = $this->config(State::MODE_DEVELOPER, [
            'siteation_debugbar/general/enabled' => true,
            'siteation_debugbar/general/sections' => 'queries,timeline',
        ]);

        $this->assertTrue($config->collects('queries'));
        $this->assertTrue($config->collects('timeline'));
        $this->assertFalse($config->collects('blocks'));
        $this->assertFalse($config->collects('plugins'));
    }

    #[Test]
    public function theTwoSectionsAProfileCannotDoWithoutIgnoreTheList(): void
    {
        // A profile that cannot say which request it belongs to is one the history, the
        // report and the MCP tools cannot use, and the findings are what the bar is for.
        // Neither is offered in the admin field, and neither is read from it.
        $config = $this->config(State::MODE_DEVELOPER, [
            'siteation_debugbar/general/enabled' => true,
            'siteation_debugbar/general/sections' => 'queries',
        ]);

        $this->assertTrue($config->collects('overview'));
        $this->assertTrue($config->collects('findings'));
    }

    private function config(string $mode, array $values, array $deployed = []): Config
    {
        $scopeConfig = $this->createStub(ScopeConfigInterface::class);
        $scopeConfig->method('isSetFlag')
            ->willReturnCallback(static fn (string $path): bool => (bool) ($values[$path] ?? false));
        $scopeConfig->method('getValue')
            ->willReturnCallback(static fn (string $path): mixed => $values[$path] ?? null);

        $state = $this->createStub(State::class);
        $state->method('getMode')->willReturn($mode);

        $directoryList = $this->createStub(DirectoryList::class);
        $directoryList->method('getRoot')->willReturn('/var/www/html');

        $deployment = $this->createStub(DeploymentConfig::class);
        $deployment->method('get')
            ->willReturnCallback(static fn (string $path): mixed => $deployed[$path] ?? null);

        return new Config($scopeConfig, $state, $directoryList, $deployment);
    }
}
