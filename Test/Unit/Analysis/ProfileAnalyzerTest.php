<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Analysis;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Analysis\ProfileAnalyzer;
use Siteation\DebugBar\Api\RuleInterface;

/**
 * The promise this class exists for: one broken rule costs one finding, not the profile.
 *
 * HttpPluginTest proves a throwing ProfileManager does not break the page. The finer promise
 * lives here, and without it a regression turns a bug in one rule into a lost profile on
 * every request.
 */
class ProfileAnalyzerTest extends TestCase
{
    #[Test]
    public function aRuleThatThrowsCostsItsOwnFindingAndNothingElse(): void
    {
        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())
            ->method('warning')
            ->with(
                $this->stringContains('broken'),
                // With the exception, not just its message: a rule that starts throwing
                // leaves nothing else behind, and a line with no file is the hunt this
                // module exists to spare someone.
                $this->callback(static fn (array $context): bool => isset($context['exception']))
            );

        $analyzer = new ProfileAnalyzer($logger, [
            'broken' => $this->throwingRule(),
            'working' => $this->rule([$this->finding('query.slow', Finding::SEVERITY_WARNING)]),
        ]);

        $findings = $analyzer->analyze([]);

        $this->assertCount(1, $findings);
        $this->assertSame('query.slow', $findings[0]['id']);
    }

    #[Test]
    public function theWorstFindingIsTheFirstOneRead(): void
    {
        $analyzer = new ProfileAnalyzer($this->createStub(LoggerInterface::class), [
            'info' => $this->rule([$this->finding('c', Finding::SEVERITY_INFO)]),
            'warning' => $this->rule([$this->finding('b', Finding::SEVERITY_WARNING)]),
            'error' => $this->rule([$this->finding('a', Finding::SEVERITY_ERROR)]),
        ]);

        $this->assertSame(['a', 'b', 'c'], array_column($analyzer->analyze([]), 'id'));
    }

    #[Test]
    public function theFindingCapHoldsAndKeepsTheWorstOnes(): void
    {
        $noise = [];

        for ($i = 0; $i < 10; $i++) {
            $noise[] = $this->finding('info.' . $i, Finding::SEVERITY_INFO);
        }

        $analyzer = new ProfileAnalyzer(
            $this->createStub(LoggerInterface::class),
            [
                'noise' => $this->rule($noise),
                'real' => $this->rule([$this->finding('request.error', Finding::SEVERITY_ERROR)]),
            ],
            3
        );

        $findings = $analyzer->analyze([]);

        $this->assertCount(3, $findings);
        $this->assertSame('request.error', $findings[0]['id'], 'the cap must not cut the worst one');
    }

    /**
     * @param list<Finding> $findings
     */
    private function rule(array $findings): RuleInterface
    {
        $rule = $this->createStub(RuleInterface::class);
        $rule->method('apply')->willReturn($findings);

        return $rule;
    }

    private function throwingRule(): RuleInterface
    {
        $rule = $this->createStub(RuleInterface::class);
        $rule->method('apply')->willThrowException(new RuntimeException('undefined array key'));

        return $rule;
    }

    private function finding(string $id, string $severity): Finding
    {
        return new Finding($id, $severity, 'overview', 'message', 'why', 'next');
    }
}
