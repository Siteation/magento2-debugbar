<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

class CacheMissRule implements RuleInterface
{
    public function __construct(
        private readonly int $minimumReads = 5,
        private readonly float $missRateThreshold = 80.0
    ) {
    }

    public function apply(array $profile): array
    {
        $summary = $profile['sections']['cache']['summary'] ?? [];
        $hits = (int) ($summary['hits'] ?? 0);
        $misses = (int) ($summary['misses'] ?? 0);
        $reads = $hits + $misses;

        // One cold lookup is not a story. Only a sustained miss rate is.
        if ($reads < $this->minimumReads) {
            return [];
        }

        $missRate = round($misses / $reads * 100, 1);

        if ($missRate < $this->missRateThreshold) {
            return [];
        }

        return [
            new Finding(
                'cache.high_miss_rate',
                Finding::SEVERITY_WARNING,
                'cache',
                sprintf('%s%% of cache reads missed.', $missRate),
                sprintf('%d of %d reads had to be rebuilt rather than fetched.', $misses, $reads),
                'If this persists after a warm run, check which cache types are enabled and '
                    . 'whether something is invalidating them on every request.',
                ['hits' => $hits, 'misses' => $misses, 'miss_rate' => $missRate],
                ['label' => 'Review cache', 'section' => 'cache']
            ),
        ];
    }
}
