<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

class SlowQueryRule implements RuleInterface
{
    public function apply(array $profile): array
    {
        $summary = $profile['sections']['queries']['summary'] ?? [];
        $slow = (int) ($summary['slow_count'] ?? 0);

        if ($slow < 1) {
            return [];
        }

        $items = $profile['sections']['queries']['payload']['items'] ?? [];
        $slowest = null;

        foreach ($items as $item) {
            if (($item['slow'] ?? false)
                && (float) ($item['duration_ms'] ?? 0) > (float) ($slowest['duration_ms'] ?? 0)
            ) {
                $slowest = $item;
            }
        }

        $threshold = (float) ($summary['slow_threshold_ms'] ?? 100);

        return [
            new Finding(
                'query.slow',
                Finding::SEVERITY_WARNING,
                'queries',
                sprintf('%d %s over the %s ms threshold.', $slow, $slow === 1 ? 'query' : 'queries', round($threshold)),
                $slowest === null
                    ? 'At least one query is slow enough to notice.'
                    : sprintf('The slowest took %s ms.', round((float) $slowest['duration_ms'], 1)),
                'Read the SQL and its call site, then check the plan and the indexes it uses.',
                ['slow_count' => $slow, 'threshold_ms' => $threshold],
                ['label' => 'Review slow queries', 'section' => 'queries', 'filter' => 'slow'],
                $this->location($slowest)
            ),
        ];
    }

    /**
     * @param array<string, mixed>|null $query
     */
    private function location(?array $query): ?string
    {
        $frame = $query['callsite'][0] ?? null;

        return is_array($frame) ? sprintf('%s:%d', $frame['file'] ?? '?', $frame['line'] ?? 0) : null;
    }
}
