<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Presentation;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\ProfileComparer;
use Siteation\DebugBar\Analysis\QueryAnalyzer;
use Siteation\DebugBar\Presentation\ProfileReport;
use Siteation\DebugBar\Presentation\ProfileSummary;

/**
 * The report is the path for assistants that cannot call MCP, and the baseline form is what
 * a developer reaches for when asking whether a change helped.
 *
 * The "what changed" block ran in neither suite: the smoke script checks the response starts
 * with '# ' and the browser test checks the clipboard holds three headings, and neither ever
 * passes a baseline. A sign error there produces a plausible document that says the opposite
 * of the truth.
 */
class ProfileReportTest extends TestCase
{
    #[Test]
    public function aReportSaysWhatTheRequestWasBeforeAnythingElse(): void
    {
        $markdown = $this->report()->render($this->profile());

        $this->assertStringStartsWith('# GET /checkout/cart/', $markdown);
        $this->assertStringContainsString('## Slowest queries', $markdown);
    }

    #[Test]
    public function aLongStatementIsCutRatherThanPasted(): void
    {
        $profile = $this->profile();
        $profile['sections']['queries']['payload']['items'][0]['sql'] = 'SELECT ' . str_repeat('a', 500);

        $markdown = $this->report()->render($profile);

        $this->assertStringContainsString(' ...', $markdown);
        $this->assertStringNotContainsString(str_repeat('a', 400), $markdown);
    }

    #[Test]
    public function theChangedTableCarriesTheSignAndNamesTheBaseline(): void
    {
        $baseline = $this->profile('11111111-1111-4111-8111-111111111111', 100.0);
        $subject = $this->profile('22222222-2222-4222-8222-222222222222', 250.0);

        $markdown = $this->report()->render($subject, $baseline);

        $this->assertStringContainsString('11111111-1111-4111-8111-111111111111', $markdown);
        $this->assertStringContainsString('| Duration | 100.00 | 250.00 | +150.00 (worse) |', $markdown);
    }

    #[Test]
    public function aMetricOneSideNeverMeasuredIsNotReportedAsZero(): void
    {
        // Cache hit rate is null on a request that read no cache. Cast to zero it read as
        // "0.00 -> 80.0 (better)", which is a verdict about a number nobody wrote down.
        $baseline = $this->profile('11111111-1111-4111-8111-111111111111');
        $baseline['sections']['cache'] = ['summary' => ['hit_rate' => null]];

        $subject = $this->profile('22222222-2222-4222-8222-222222222222');
        $subject['sections']['cache'] = ['summary' => ['hit_rate' => 80.0]];

        $markdown = $this->report()->render($subject, $baseline);

        $this->assertStringContainsString('| Cache hit rate | none | 80.0 | not comparable |', $markdown);
        $this->assertStringNotContainsString('Cache hit rate | 0.0', $markdown);
    }

    #[Test]
    public function aChangeInFindingsIsNamedRatherThanCounted(): void
    {
        $baseline = $this->profile('11111111-1111-4111-8111-111111111111');
        $baseline['findings'] = [[
            'id' => 'query.n_plus_one',
            'severity' => 'warning',
            'message' => 'The same query ran 5 times from one place.',
        ]];

        $subject = $this->profile('22222222-2222-4222-8222-222222222222');
        $subject['findings'] = [[
            'id' => 'request.slow',
            'severity' => 'warning',
            'message' => 'The request took 3287 ms.',
        ]];

        $markdown = $this->report()->render($subject, $baseline);

        $this->assertStringContainsString('Resolved: The same query ran 5 times', $markdown);
        $this->assertStringContainsString('New finding: The request took 3287 ms.', $markdown);
    }

    private function report(): ProfileReport
    {
        $summary = new ProfileSummary();

        return new ProfileReport($summary, new ProfileComparer(new QueryAnalyzer(), $summary));
    }

    /**
     * @return array<string, mixed>
     */
    private function profile(
        string $id = '11111111-1111-4111-8111-111111111111',
        float $durationMs = 120.0
    ): array {
        return [
            'id' => $id,
            'started_at' => 1750000000,
            'metrics' => ['duration_ms' => $durationMs, 'memory_peak_mb' => 32.0],
            'findings' => [],
            'sections' => [
                'request' => ['summary' => [
                    'method' => 'GET',
                    'path' => '/checkout/cart/',
                    'action' => 'checkout_cart_index',
                    'area' => 'frontend',
                    'status' => 200,
                ]],
                'queries' => [
                    'summary' => ['count' => 1, 'duration_ms' => 4.0],
                    'payload' => ['items' => [[
                        'sql' => 'SELECT * FROM quote WHERE entity_id = ?',
                        'duration_ms' => 4.0,
                        'bindings' => [1],
                        'callsite' => [['file' => 'Quote.php', 'line' => 42, 'call' => 'load()']],
                    ]]],
                ],
            ],
        ];
    }
}
