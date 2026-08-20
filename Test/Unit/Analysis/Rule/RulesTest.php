<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Analysis\Rule;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\QueryAnalyzer;
use Siteation\DebugBar\Analysis\Rule\CacheMissRule;
use Siteation\DebugBar\Analysis\Rule\RepeatedQueryRule;
use Siteation\DebugBar\Analysis\Rule\RequestErrorRule;
use Siteation\DebugBar\Analysis\Rule\SlowBlockRule;
use Siteation\DebugBar\Analysis\Rule\SlowObserverRule;
use Siteation\DebugBar\Analysis\Rule\SlowQueryRule;
use Siteation\DebugBar\Analysis\Rule\SlowRequestRule;
use Siteation\DebugBar\Analysis\Rule\TruncatedCollectorRule;
use Siteation\DebugBar\Model\Config;

class RulesTest extends TestCase
{
    #[Test]
    public function requestErrorFiresOnServerError(): void
    {
        $findings = (new RequestErrorRule())->apply(
            $this->profile(['request' => ['summary' => ['status' => 500]]])
        );

        $this->assertCount(1, $findings);
        $this->assertSame('error', $findings[0]->toArray()['severity']);
    }

    #[Test]
    public function requestErrorIsAWarningForClientErrors(): void
    {
        $findings = (new RequestErrorRule())->apply(
            $this->profile(['request' => ['summary' => ['status' => 404]]])
        );

        $this->assertSame('warning', $findings[0]->toArray()['severity']);
    }

    #[Test]
    public function requestErrorStaysQuietOnSuccess(): void
    {
        $this->assertSame([], (new RequestErrorRule())->apply(
            $this->profile(['request' => ['summary' => ['status' => 200]]])
        ));
    }

    #[Test]
    public function cacheMissIgnoresASmallNumberOfReads(): void
    {
        $rule = new CacheMissRule();

        $this->assertSame([], $rule->apply(
            $this->profile(['cache' => ['summary' => ['hits' => 0, 'misses' => 4]]])
        ), 'Four cold reads is not a story.');
    }

    #[Test]
    public function cacheMissFiresOnASustainedMissRate(): void
    {
        $findings = (new CacheMissRule())->apply(
            $this->profile(['cache' => ['summary' => ['hits' => 1, 'misses' => 19]]])
        );

        $this->assertCount(1, $findings);
        $this->assertSame(95.0, $findings[0]->toArray()['evidence']['miss_rate']);
    }

    #[Test]
    public function cacheMissStaysQuietOnAHealthyRate(): void
    {
        $this->assertSame([], (new CacheMissRule())->apply(
            $this->profile(['cache' => ['summary' => ['hits' => 18, 'misses' => 2]]])
        ));
    }

    #[Test]
    public function slowBlockNeedsBothAShareAndAFloor(): void
    {
        $rule = new SlowBlockRule();

        // 50% of the request, but only 5 ms of it.
        $this->assertSame([], $rule->apply($this->profile(
            ['blocks' => ['payload' => ['items' => [['name' => 'x', 'own_ms' => 5.0]]]]],
            10.0
        )), 'Half of a fast request is still fast.');

        $findings = $rule->apply($this->profile(
            ['blocks' => ['payload' => ['items' => [['name' => 'slow.block', 'own_ms' => 400.0]]]]],
            1000.0
        ));

        $this->assertCount(1, $findings);
        $this->assertSame(40.0, $findings[0]->toArray()['evidence']['share_percent']);
    }

    #[Test]
    public function slowObserverReportsTheWorstOne(): void
    {
        $findings = (new SlowObserverRule())->apply($this->profile(
            ['observers' => ['payload' => ['items' => [
                ['name' => 'heavy', 'event' => 'e', 'count' => 1, 'duration_ms' => 300.0],
            ]]]],
            1000.0
        ));

        $this->assertCount(1, $findings);
        $this->assertStringContainsString('heavy', $findings[0]->toArray()['why']);
    }

    #[Test]
    public function truncationIsReported(): void
    {
        $findings = (new TruncatedCollectorRule())->apply($this->profile([
            'queries' => ['label' => 'Queries', 'summary' => [
                'truncated' => true, 'dropped_count' => 120, 'count' => 620,
            ]],
        ]));

        $this->assertCount(1, $findings);
        $this->assertStringContainsString('120', $findings[0]->toArray()['message']);
    }

    #[Test]
    public function anNPlusOneIsReportedOnceNotTwice(): void
    {
        $items = [];

        for ($i = 1; $i <= 5; $i++) {
            $items[] = [
                'sql' => 'SELECT * FROM product WHERE id = ?',
                'bindings' => [$i],
                'duration_ms' => 1.0,
                'callsite' => [['file' => 'Loader.php', 'line' => 10, 'call' => 'x()']],
            ];
        }

        $findings = (new RepeatedQueryRule(new QueryAnalyzer()))->apply(
            $this->profile(['queries' => ['payload' => ['items' => $items]]])
        );

        $ids = array_map(static fn ($finding): string => $finding->toArray()['id'], $findings);

        $this->assertSame(['query.n_plus_one'], $ids, 'One cause must produce one finding.');
    }

    #[Test]
    public function repeatedQueriesFromManyPlacesAreOneFindingNotMany(): void
    {
        // A different query each time, each run from two call sites, so none of them is a
        // loop. "Queries are repeating" is one thing to go and look at, and a list of near
        // identical findings would push everything else off the page.
        $items = [];

        for ($shape = 1; $shape <= 4; $shape++) {
            for ($run = 1; $run <= 3; $run++) {
                $items[] = [
                    'sql' => sprintf('SELECT * FROM t%d WHERE id = ?', $shape),
                    'bindings' => [$run],
                    'duration_ms' => 0.5,
                    'callsite' => [['file' => 'Caller' . ($run % 2) . '.php', 'line' => 10, 'call' => 'x()']],
                ];
            }
        }

        $findings = (new RepeatedQueryRule(new QueryAnalyzer()))->apply(
            $this->profile(['queries' => ['payload' => ['items' => $items]]])
        );

        $this->assertCount(1, $findings);

        $finding = $findings[0]->toArray();

        $this->assertSame('query.repeated', $finding['id']);
        $this->assertSame('info', $finding['severity']);
        $this->assertStringContainsString('4 queries', $finding['message']);
        $this->assertStringContainsString('8 executions', $finding['message'], 'three runs each is two extra');
    }

    #[Test]
    public function slowQueriesAreCountedAndTheSlowestIsNamed(): void
    {
        $findings = (new SlowQueryRule())->apply($this->profile(['queries' => [
            'summary' => ['slow_count' => 2, 'slow_threshold_ms' => 100],
            'payload' => ['items' => [
                ['slow' => true, 'duration_ms' => 140.0, 'callsite' => [['file' => 'A.php', 'line' => 5]]],
                ['slow' => true, 'duration_ms' => 260.4, 'callsite' => [['file' => 'B.php', 'line' => 9]]],
                ['slow' => false, 'duration_ms' => 900.0, 'callsite' => [['file' => 'C.php', 'line' => 1]]],
            ]],
        ]]));

        $this->assertCount(1, $findings);

        $finding = $findings[0]->toArray();

        $this->assertStringContainsString('2 queries', $finding['message']);
        $this->assertStringContainsString('260.4', $finding['why']);
        $this->assertSame('B.php:9', $finding['location'], 'a fast query is not the slowest one');
    }

    #[Test]
    public function slowQueriesStayQuietWhenNoneWereSlow(): void
    {
        $this->assertSame([], (new SlowQueryRule())->apply(
            $this->profile(['queries' => ['summary' => ['slow_count' => 0]]])
        ));
    }

    #[Test]
    public function aSlowRequestIsJudgedAgainstTheConfiguredThreshold(): void
    {
        $rule = new SlowRequestRule($this->threshold(1000.0));

        $this->assertSame([], $rule->apply($this->profile([], 999.0)), 'under the threshold');

        $findings = $rule->apply($this->profile([], 3287.0));

        $this->assertCount(1, $findings);
        $this->assertStringContainsString('3287', $findings[0]->toArray()['message']);
        $this->assertStringContainsString('1000', $findings[0]->toArray()['why']);
    }

    #[Test]
    public function aLoweredThresholdMovesTheLine(): void
    {
        // The threshold is configuration, so a rule reading it wrongly fires on every
        // request or on none, which is a quiet loss of the feature rather than a crash.
        $this->assertCount(1, (new SlowRequestRule($this->threshold(500.0)))->apply(
            $this->profile([], 600.0)
        ));
    }

    private function threshold(float $ms): Config
    {
        $config = $this->createStub(Config::class);
        $config->method('slowRequestMs')->willReturn($ms);

        return $config;
    }

    /**
     * @param array<string, mixed> $sections
     * @return array<string, mixed>
     */
    private function profile(array $sections, float $durationMs = 100.0): array
    {
        return ['metrics' => ['duration_ms' => $durationMs], 'sections' => $sections];
    }
}
