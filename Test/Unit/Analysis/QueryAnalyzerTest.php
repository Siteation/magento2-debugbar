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
}
