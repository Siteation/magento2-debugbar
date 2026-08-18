<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
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
    #[Test]
    public function noEditorMeansNoLink(): void
    {
        $this->assertSame('', $this->enabled([])->editor());
        $this->assertSame('', $this->enabled(['dev/siteation_debugbar/editor' => 'nonsense'])->editor());
    }

    #[Test]
    public function aNamedEditorResolvesToItsTemplate(): void
    {
        $config = $this->enabled(['dev/siteation_debugbar/editor' => 'vscode']);

        $this->assertSame('vscode://file%f:%l', $config->editor());
    }

    #[Test]
    public function aPathStyleTemplateDoesNotAddItsOwnSlash(): void
    {
        // %f is absolute, so ://file/%f would produce two slashes. Zed opens nothing at all
        // when it sees that, without complaining.
        foreach (['vscode', 'vscode_insiders', 'cursor', 'windsurf', 'zed'] as $editor) {
            $template = $this->enabled(['dev/siteation_debugbar/editor' => $editor])->editor();

            $this->assertStringContainsString('://file%f', $template, $editor);
        }
    }

    #[Test]
    public function aCustomEditorUsesTheTemplateThatWasTyped(): void
    {
        $config = $this->enabled([
            'dev/siteation_debugbar/editor' => 'custom',
            'dev/siteation_debugbar/editor_template' => '  myeditor://go?f=%f&l=%l  ',
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
            'dev/siteation_debugbar/editor_path_map' => '/srv/app:/elsewhere,/var/www/html:/Users/you/shop',
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
        $config = $this->enabled(['dev/siteation_debugbar/editor_path_map' => '/var/www/html:, :/somewhere']);

        $this->assertSame('/var/www/html', $config->editorRoot());
    }

    private function config(string $mode, array $values): Config
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

        return new Config($scopeConfig, $state, $directoryList);
    }
}
