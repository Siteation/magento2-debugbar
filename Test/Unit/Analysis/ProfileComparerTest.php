<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Analysis;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\ProfileComparer;
use Siteation\DebugBar\Analysis\QueryAnalyzer;
use Siteation\DebugBar\Presentation\ProfileSummary;

class ProfileComparerTest extends TestCase
{
    private ProfileComparer $comparer;

    protected function setUp(): void
    {
        $this->comparer = new ProfileComparer(new QueryAnalyzer(), new ProfileSummary());
    }

    #[Test]
    public function itJudgesEachMetricByItsOwnDirection(): void
    {
        $result = $this->comparer->compare(
            $this->profile(['duration_ms' => 100.0, 'hit_rate' => 90.0]),
            $this->profile(['duration_ms' => 80.0, 'hit_rate' => 50.0])
        );

        $duration = $this->metric($result, 'duration_ms');
        $this->assertSame(-20.0, $duration['delta']);
        $this->assertSame(-20.0, $duration['percent']);
        $this->assertSame('better', $duration['verdict'], 'A shorter request is a better one.');

        $cache = $this->metric($result, 'cache_hit_rate');
        $this->assertSame('worse', $cache['verdict'], 'A lower hit rate is a worse one.');
    }

    #[Test]
    public function itPassesNoVerdictOnMetricsThatHaveNoBetter(): void
    {
        $result = $this->comparer->compare(
            $this->profile(['events' => 10]),
            $this->profile(['events' => 400])
        );

        $events = $this->metric($result, 'event_count');
        $this->assertSame(390.0, $events['delta']);
        $this->assertSame('same', $events['verdict'], 'More events is not worse, it is different.');
    }

    #[Test]
    public function itReportsNoPercentageAgainstZero(): void
    {
        $result = $this->comparer->compare(
            $this->profile(['queries' => []]),
            $this->profile(['queries' => [['sql' => 'SELECT 1', 'duration_ms' => 1.0]]])
        );

        $count = $this->metric($result, 'query_count');
        $this->assertSame(1.0, $count['delta']);
        $this->assertNull($count['percent'], 'A percentage of nothing is unanswerable, not infinite.');
    }

    #[Test]
    public function itSeparatesNewFindingsFromResolvedOnes(): void
    {
        $result = $this->comparer->compare(
            $this->profile(['findings' => [
                ['id' => 'slow-query', 'message' => 'A query took 400 ms', 'severity' => 'warning'],
                ['id' => 'cache-miss', 'message' => 'Cache is missing', 'severity' => 'warning'],
            ]]),
            $this->profile(['findings' => [
                ['id' => 'cache-miss', 'message' => 'Cache is missing', 'severity' => 'warning'],
                ['id' => 'n-plus-one', 'message' => 'The same query ran 40 times', 'severity' => 'error'],
            ]])
        );

        $this->assertSame(['The same query ran 40 times'], array_column($result['findings']['added'], 'message'));
        $this->assertSame(['A query took 400 ms'], array_column($result['findings']['resolved'], 'message'));
        $this->assertSame(1, $result['findings']['unchanged']);
    }

    #[Test]
    public function itTellsOneRuleSpeakingTwiceApart(): void
    {
        $result = $this->comparer->compare(
            $this->profile(['findings' => [['id' => 'repeated', 'message' => 'ran 4 times']]]),
            $this->profile(['findings' => [
                ['id' => 'repeated', 'message' => 'ran 4 times'],
                ['id' => 'repeated', 'message' => 'ran 9 times'],
            ]])
        );

        $this->assertCount(1, $result['findings']['added']);
        $this->assertSame(1, $result['findings']['unchanged']);
    }

    #[Test]
    public function itComparesQueriesByShapeRatherThanByText(): void
    {
        $result = $this->comparer->compare(
            $this->profile(['queries' => [
                ['sql' => 'SELECT * FROM catalog WHERE id = ?', 'duration_ms' => 1.0],
            ]]),
            $this->profile(['queries' => [
                // The same shape, only reformatted: not a change.
                ['sql' => "SELECT   *  FROM catalog\n WHERE id = ?", 'duration_ms' => 1.0],
                ['sql' => 'SELECT * FROM catalog WHERE id = ?', 'duration_ms' => 1.0],
                ['sql' => 'SELECT * FROM stock', 'duration_ms' => 2.0],
            ]])
        );

        $queries = $result['queries'];

        $this->assertSame(['SELECT * FROM stock'], array_column($queries['added'], 'sql'));
        $this->assertSame([], $queries['removed']);
        $this->assertSame(1, $queries['changed_total'], 'The catalog query ran once more.');
        $this->assertSame(1, $queries['changed'][0]['delta']);
    }

    #[Test]
    public function itRanksTheBiggestQueryChangesFirstAndKeepsTheListShort(): void
    {
        $subject = [];

        // Distinct by identifier, not by number: a number is a value now, so thirty of
        // those would be one shape rather than thirty.
        for ($shape = 0; $shape < 30; $shape++) {
            for ($run = 0; $run <= $shape; $run++) {
                $subject[] = ['sql' => "SELECT * FROM `table_$shape`", 'duration_ms' => 0.1];
            }
        }

        $result = $this->comparer->compare(
            $this->profile(['queries' => []]),
            $this->profile(['queries' => $subject])
        );

        $this->assertSame(30, $result['queries']['added_total'], 'The total is honest.');
        $this->assertCount(15, $result['queries']['added'], 'The list is not.');
        $this->assertSame(30, $result['queries']['added'][0]['count'], 'Worst first.');
    }

    /**
     * @param array<string, mixed> $result
     * @return array<string, mixed>
     */
    private function metric(array $result, string $key): array
    {
        foreach ($result['metrics'] as $metric) {
            if ($metric['key'] === $key) {
                return $metric;
            }
        }

        $this->fail("No $key metric in the comparison.");
    }

    /**
     * @param array<string, mixed> $values
     * @return array<string, mixed>
     */
    private function profile(array $values = []): array
    {
        return [
            'id' => '11111111-1111-4111-8111-111111111111',
            'metrics' => [
                'duration_ms' => $values['duration_ms'] ?? 50.0,
                'memory_peak_mb' => $values['memory_peak_mb'] ?? 16.0,
            ],
            'findings' => $values['findings'] ?? [],
            'sections' => [
                'request' => ['summary' => ['path' => $values['path'] ?? '/', 'response_bytes' => 1000]],
                'queries' => [
                    'summary' => ['count' => count($values['queries'] ?? [])],
                    'payload' => ['items' => $values['queries'] ?? []],
                ],
                'events' => ['summary' => ['count' => $values['events'] ?? 0]],
                'cache' => ['summary' => ['hit_rate' => $values['hit_rate'] ?? null]],
            ],
        ];
    }
}
