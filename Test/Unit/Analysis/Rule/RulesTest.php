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
use Siteation\DebugBar\Analysis\Rule\TruncatedCollectorRule;

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

    /**
     * @param array<string, mixed> $sections
     * @return array<string, mixed>
     */
    private function profile(array $sections, float $durationMs = 100.0): array
    {
        return ['metrics' => ['duration_ms' => $durationMs], 'sections' => $sections];
    }
}
