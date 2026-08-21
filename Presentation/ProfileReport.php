<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Presentation;

use Siteation\DebugBar\Analysis\ProfileComparer;

/**
 * A profile as markdown, for reading rather than for parsing.
 *
 * The MCP tools already serve agents that can call them. This is for everything else: an
 * assistant in a browser tab, a colleague in a chat window, a coding agent that has a
 * shell but no MCP server configured. Markdown because every one of them reads it, and
 * because a person can check what they are about to paste.
 *
 * Defined once here and rendered by three things: the console command, the profile
 * endpoint, and the bar's copy button. A second renderer would drift from the first.
 *
 * Bounded like everything else. A profile can hold six hundred queries; a report that
 * carried them all would be pasted nowhere.
 */
class ProfileReport
{
    private const MAX_FINDINGS = 10;
    private const MAX_QUERIES = 10;
    private const MAX_SPANS = 8;
    private const MAX_SQL_LENGTH = 300;
    private const MAX_LABEL_LENGTH = 90;

    public function __construct(
        private readonly ProfileSummary $summary,
        private readonly ProfileComparer $comparer
    ) {
    }

    /**
     * @param array<string, mixed> $profile
     * @param array<string, mixed>|null $baseline an earlier profile to measure against
     */
    public function render(array $profile, ?array $baseline = null): string
    {
        $summary = $this->summary->for($profile);

        $blocks = [
            $this->heading($summary),
            $this->findings($profile),
            $this->cost($profile),
            $this->queries($profile),
            $this->slowest($profile),
        ];

        if ($baseline !== null) {
            $blocks[] = $this->changed($baseline, $profile);
        }

        $blocks[] = $this->footer($summary);

        return implode("\n\n", array_filter($blocks)) . "\n";
    }

    /**
     * @param array<string, mixed> $summary
     */
    private function heading(array $summary): string
    {
        return sprintf(
            "# %s %s\n\n%s in %s ms, %s %s, %d %s.",
            $summary['method'] ?? 'GET',
            $this->requestLabel($summary),
            $summary['status'] ?? 'Threw, no response',
            $this->number($summary['duration_ms'] ?? 0, 2),
            $summary['area'] ?? 'unknown area',
            $summary['action'] ? "action `{$summary['action']}`" : 'no action',
            (int) ($summary['query_count'] ?? 0),
            (int) ($summary['query_count'] ?? 0) === 1 ? 'query' : 'queries'
        );
    }

    /**
     * The conclusions first. An agent that reads nothing else should still read these.
     *
     * @param array<string, mixed> $profile
     */
    private function findings(array $profile): string
    {
        $findings = array_slice((array) ($profile['findings'] ?? []), 0, self::MAX_FINDINGS);

        if ($findings === []) {
            return "## Findings\n\nNothing matched a rule on this request.";
        }

        $lines = ['## Findings', ''];

        foreach ($findings as $finding) {
            $lines[] = sprintf('- **%s** %s', $finding['severity'] ?? 'notice', $finding['message'] ?? '');

            if (!empty($finding['why'])) {
                $lines[] = '  - Why: ' . $finding['why'];
            }

            if (!empty($finding['next'])) {
                $lines[] = '  - Next: ' . $finding['next'];
            }

            if (!empty($finding['location'])) {
                $lines[] = '  - Where: `' . $finding['location'] . '`';
            }
        }

        $total = count((array) ($profile['findings'] ?? []));

        if ($total > self::MAX_FINDINGS) {
            $lines[] = sprintf('- ... %d more, worst first.', $total - self::MAX_FINDINGS);
        }

        return implode("\n", $lines);
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function cost(array $profile): string
    {
        $rows = [
            ['Duration', $this->number($profile['metrics']['duration_ms'] ?? 0, 2) . ' ms'],
            ['Memory peak', $this->number($profile['metrics']['memory_peak_mb'] ?? 0, 1) . ' MB'],
            ['Queries', $this->section($profile, 'queries', 'count')
                . ' in ' . $this->number($this->section($profile, 'queries', 'duration_ms'), 2) . ' ms'],
            ['Blocks', $this->section($profile, 'blocks', 'unique_count')
                . ' in ' . $this->number($this->section($profile, 'blocks', 'duration_ms'), 2) . ' ms'],
            ['Observers', $this->section($profile, 'observers', 'count')
                . ' in ' . $this->number($this->section($profile, 'observers', 'duration_ms'), 2) . ' ms'],
            ['Events', $this->section($profile, 'events', 'count') . ' dispatched'],
            ['Cache', $this->cacheLine($profile)],
        ];

        $lines = ['## Cost', '', '| | |', '| --- | --- |'];

        foreach ($rows as [$label, $value]) {
            $lines[] = sprintf('| %s | %s |', $label, $value);
        }

        return implode("\n", $lines);
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function cacheLine(array $profile): string
    {
        $rate = $profile['sections']['cache']['summary']['hit_rate'] ?? null;

        return $rate === null
            ? 'no reads'
            : $this->number($rate, 1) . '% hit rate';
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function queries(array $profile): string
    {
        $items = (array) ($profile['sections']['queries']['payload']['items'] ?? []);

        if ($items === []) {
            return '';
        }

        usort(
            $items,
            static fn (array $a, array $b): int => ($b['duration_ms'] ?? 0) <=> ($a['duration_ms'] ?? 0)
        );

        $lines = ['## Slowest queries', ''];

        foreach (array_slice($items, 0, self::MAX_QUERIES) as $index => $query) {
            // A fenced block, not a code span: Magento quotes every identifier in
            // backticks, so a single backtick span would end at the first one and the rest
            // of the statement would be rendered as prose.
            $lines[] = sprintf('%d. %s ms', $index + 1, $this->number($query['duration_ms'] ?? 0, 2));
            $lines[] = '';
            $lines[] = '   ```sql';
            $lines[] = '   ' . $this->trim((string) ($query['sql'] ?? ''));
            $lines[] = '   ```';

            $frame = $query['callsite'][0] ?? null;

            if (is_array($frame) && isset($frame['file'], $frame['line'])) {
                $lines[] = sprintf('   %s:%d', $frame['file'], $frame['line']);
            }
        }

        return implode("\n", $lines);
    }

    /**
     * The waterfall's answer without the waterfall.
     *
     * Queries are left out: they have their own list above with the same durations, and a
     * report that says the same thing twice is one nobody finishes reading.
     *
     * @param array<string, mixed> $profile
     */
    private function slowest(array $profile): string
    {
        $items = (array) ($profile['sections']['timeline']['payload']['items'] ?? []);
        $spans = array_values(array_filter(
            $items,
            static fn (array $item): bool => ($item['kind'] ?? '') === 'span'
                && ($item['section'] ?? '') !== 'queries'
        ));

        if ($spans === []) {
            return '';
        }

        usort(
            $spans,
            static fn (array $a, array $b): int => ($b['duration_ms'] ?? 0) <=> ($a['duration_ms'] ?? 0)
        );

        $lines = ['## Where the rest of the time went', ''];

        foreach (array_slice($spans, 0, self::MAX_SPANS) as $span) {
            $lines[] = sprintf(
                '- %s ms — %s (%s), starting at %s ms',
                $this->number($span['duration_ms'] ?? 0, 2),
                $this->label((string) ($span['label'] ?? '')),
                $span['section'] ?? '',
                $this->number($span['start_ms'] ?? 0, 1)
            );
        }

        return implode("\n", $lines);
    }

    /**
     * @param array<string, mixed> $baseline
     * @param array<string, mixed> $subject
     */
    private function changed(array $baseline, array $subject): string
    {
        $diff = $this->comparer->compare($baseline, $subject);
        $lines = [
            '## What changed',
            '',
            sprintf(
                'Against `%s`, %s %s.',
                $diff['baseline']['profile_id'] ?? '',
                $diff['baseline']['method'] ?? '',
                $diff['baseline']['path'] ?? ''
            ),
            '',
            '| | before | now | change |',
            '| --- | --- | --- | --- |',
        ];

        foreach ($diff['metrics'] as $metric) {
            // A side that is null was never measured, and printing it as 0.00 would read as
            // a measurement of nothing rather than as nothing measured.
            $lines[] = sprintf(
                '| %s | %s | %s | %s |',
                $metric['label'],
                $this->side($metric, 'baseline'),
                $this->side($metric, 'subject'),
                $this->delta($metric)
            );
        }

        foreach ($diff['findings']['added'] as $finding) {
            $lines[] = '';
            $lines[] = '- New finding: ' . ($finding['message'] ?? '');
        }

        foreach ($diff['findings']['resolved'] as $finding) {
            $lines[] = '';
            $lines[] = '- Resolved: ' . ($finding['message'] ?? '');
        }

        $queries = $diff['queries'];

        $lines[] = '';
        $lines[] = sprintf(
            'Query shapes: %d added, %d gone, %d running a different number of times.',
            $queries['added_total'],
            $queries['removed_total'],
            $queries['changed_total']
        );

        foreach (array_slice($queries['added'], 0, 5) as $row) {
            $lines[] = sprintf('- +%d', $row['count']);
            $lines[] = '';
            $lines[] = '  ```sql';
            $lines[] = '  ' . $this->trim((string) $row['sql']);
            $lines[] = '  ```';
        }

        return implode("\n", $lines);
    }

    /**
     * @param array<string, mixed> $summary
     */
    private function footer(array $summary): string
    {
        return sprintf(
            "---\n\nProfile `%s`, captured by Siteation_DebugBar. Values are redacted at "
            . 'record time and lists are truncated, so absence here is not absence in the request.',
            $summary['profile_id'] ?? ''
        );
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function section(array $profile, string $section, string $key): float|int
    {
        $value = $profile['sections'][$section]['summary'][$key] ?? 0;

        return is_numeric($value) ? $value + 0 : 0;
    }

    /** A label is a name, not a document: one line, short enough to scan. */
    private function label(string $value): string
    {
        $value = trim((string) preg_replace('/\s+/', ' ', $value));

        return strlen($value) <= self::MAX_LABEL_LENGTH
            ? $value
            : substr($value, 0, self::MAX_LABEL_LENGTH) . ' ...';
    }

    private function trim(string $sql): string
    {
        $sql = trim((string) preg_replace('/\s+/', ' ', $sql));

        return strlen($sql) <= self::MAX_SQL_LENGTH
            ? $sql
            : substr($sql, 0, self::MAX_SQL_LENGTH) . ' ...';
    }

    /**
     * The path does not tell two Magewire updates apart: every component posts to the same
     * URL. Where the collector recognised one, the component and the action stand in.
     *
     * @param array<string, mixed> $summary
     */
    private function requestLabel(array $summary): string
    {
        $magewire = $summary['magewire'] ?? null;

        if (is_array($magewire) && ($magewire['component'] ?? '') !== '') {
            return trim(sprintf('%s %s', $magewire['component'], $magewire['action'] ?? ''));
        }

        return (string) ($summary['path'] ?? '/');
    }

    /**
     * @param array<string, mixed> $metric
     */
    private function side(array $metric, string $side): string
    {
        return $metric[$side] === null
            ? 'none'
            : $this->number((float) $metric[$side], (int) $metric['decimals']);
    }

    /**
     * @param array<string, mixed> $metric
     */
    private function delta(array $metric): string
    {
        if ($metric['delta'] === null) {
            return 'not comparable';
        }

        $sign = $metric['delta'] > 0 ? '+' : '';
        $verdict = $metric['verdict'] === 'same' ? '' : ' (' . $metric['verdict'] . ')';

        return $sign . $this->number((float) $metric['delta'], (int) $metric['decimals']) . $verdict;
    }

    private function number(mixed $value, int $decimals): string
    {
        return number_format((float) $value, $decimals, '.', '');
    }
}
