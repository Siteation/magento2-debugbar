<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Analysis;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\QueryAnalyzer;

class QueryAnalyzerTest extends TestCase
{
    private QueryAnalyzer $analyzer;

    protected function setUp(): void
    {
        $this->analyzer = new QueryAnalyzer();
    }

    #[Test]
    public function itGroupsQueriesOfTheSameShape(): void
    {
        $groups = $this->analyzer->analyze([
            $this->query('SELECT * FROM product WHERE id = ?', ['1'], 'Loader.php:10'),
            $this->query('SELECT  *   FROM product WHERE id = ?', ['2'], 'Loader.php:10'),
            $this->query('SELECT * FROM category', [], 'Other.php:5'),
        ])['groups'];

        $this->assertCount(2, $groups);
        $this->assertSame(2, $groups[0]['count']);
        $this->assertSame(1, $groups[0]['extra_executions']);
    }

    #[Test]
    public function itFlagsAnNPlusOne(): void
    {
        $group = $this->analyzer->analyze([
            $this->query('SELECT * FROM product WHERE id = ?', ['1'], 'Loader.php:10'),
            $this->query('SELECT * FROM product WHERE id = ?', ['2'], 'Loader.php:10'),
            $this->query('SELECT * FROM product WHERE id = ?', ['3'], 'Loader.php:10'),
        ])['groups'][0];

        $this->assertTrue($group['likely_n_plus_one']);
        $this->assertSame('Loader.php:10', $group['shared_call_site']);
    }

    #[Test]
    public function itDoesNotFlagRepeatsFromDifferentCallSites(): void
    {
        $group = $this->analyzer->analyze([
            $this->query('SELECT * FROM product WHERE id = ?', ['1'], 'A.php:10'),
            $this->query('SELECT * FROM product WHERE id = ?', ['2'], 'B.php:20'),
            $this->query('SELECT * FROM product WHERE id = ?', ['3'], 'C.php:30'),
        ])['groups'][0];

        $this->assertFalse(
            $group['likely_n_plus_one'],
            'The same query from three places is not a loop.'
        );
    }

    #[Test]
    public function itDoesNotFlagIdenticalBindingsAsAnNPlusOne(): void
    {
        $group = $this->analyzer->analyze([
            $this->query('SELECT * FROM config WHERE path = ?', ['x'], 'Loader.php:10'),
            $this->query('SELECT * FROM config WHERE path = ?', ['x'], 'Loader.php:10'),
            $this->query('SELECT * FROM config WHERE path = ?', ['x'], 'Loader.php:10'),
        ])['groups'][0];

        $this->assertFalse(
            $group['likely_n_plus_one'],
            'Identical values repeated is a caching problem, not an N+1.'
        );
        $this->assertFalse($group['bindings_vary']);
    }

    #[Test]
    public function itNeedsThreeExecutionsBeforeCallingSomethingAnNPlusOne(): void
    {
        $group = $this->analyzer->analyze([
            $this->query('SELECT * FROM product WHERE id = ?', ['1'], 'Loader.php:10'),
            $this->query('SELECT * FROM product WHERE id = ?', ['2'], 'Loader.php:10'),
        ])['groups'][0];

        $this->assertFalse($group['likely_n_plus_one']);
    }

    #[Test]
    public function itTotalsDuration(): void
    {
        $result = $this->analyzer->analyze([
            $this->query('SELECT 1', [], 'A.php:1', 1.5),
            $this->query('SELECT 2', [], 'A.php:2', 2.25),
        ]);

        $this->assertSame(3.75, $result['total_ms']);
    }

    /**
     * @param list<string> $bindings
     * @return array<string, mixed>
     */
    private function query(string $sql, array $bindings, string $callSite, float $durationMs = 1.0): array
    {
        [$file, $line] = explode(':', $callSite);

        return [
            'sql' => $sql,
            'bindings' => $bindings,
            'duration_ms' => $durationMs,
            'callsite' => [['file' => $file, 'line' => (int) $line, 'call' => 'x()']],
        ];
    }
    #[Test]
    public function itSeesThroughAnInterpolatedNumber(): void
    {
        // Magento interpolates ids unquoted, so these were two different queries and an
        // N+1 built from numeric ids could not be seen at all.
        $result = $this->analyzer->analyze([
            ['sql' => 'SELECT * FROM `t` WHERE (`entity_id` = 1)', 'duration_ms' => 1.0],
            ['sql' => 'SELECT * FROM `t` WHERE (`entity_id` = 2)', 'duration_ms' => 1.0],
            ['sql' => 'SELECT * FROM `t` WHERE (`entity_id` = 3)', 'duration_ms' => 1.0],
        ]);

        $this->assertCount(1, $result['groups']);
        $this->assertSame(3, $result['groups'][0]['count']);
        $this->assertStringContainsString('= ?', $result['groups'][0]['sql']);
    }

    #[Test]
    public function itLeavesTheDigitsInsideAnIdentifierAlone(): void
    {
        // `t1` is not `t2`, and merging them would invent repetition that never happened.
        $result = $this->analyzer->analyze([
            ['sql' => 'SELECT `t1`.`a` FROM `x` AS `t1`', 'duration_ms' => 1.0],
            ['sql' => 'SELECT `t2`.`a` FROM `x` AS `t2`', 'duration_ms' => 1.0],
            ['sql' => 'SELECT `attribute_2`.* FROM `y`', 'duration_ms' => 1.0],
            ['sql' => 'SELECT `attribute_3`.* FROM `y`', 'duration_ms' => 1.0],
        ]);

        $this->assertCount(4, $result['groups'], 'Four identifiers, four queries.');
    }

    #[Test]
    public function itTreatsTwoLimitsAsOneStatement(): void
    {
        // Deliberate: this counts how often a statement ran, and these are one statement.
        // What each run cost is reported per group, so a heavy one still shows itself.
        $result = $this->analyzer->analyze([
            ['sql' => 'SELECT * FROM `t` LIMIT 10', 'duration_ms' => 1.0],
            ['sql' => 'SELECT * FROM `t` LIMIT 1000', 'duration_ms' => 9.0],
        ]);

        $this->assertCount(1, $result['groups']);
        $this->assertSame(10.0, $result['groups'][0]['duration_ms']);
    }

    #[Test]
    public function itDoesNotReachIntoAQuotedValue(): void
    {
        $result = $this->analyzer->analyze([
            ['sql' => "SELECT * FROM `t` WHERE `code` = 'a1'", 'duration_ms' => 1.0],
            ['sql' => "SELECT * FROM `t` WHERE `code` = 'a2'", 'duration_ms' => 1.0],
        ]);

        // The redactor replaces quoted values long before this; whatever survives that is
        // not something to rewrite again.
        $this->assertCount(2, $result['groups']);
    }

}
