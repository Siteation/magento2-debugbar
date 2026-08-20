<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

/**
 * Cache reads and writes, aggregated into a hit rate.
 *
 * A load returning an empty string is a miss. Identifiers are grouped by their leading
 * segment, because Magento cache keys carry hashes that would otherwise make every row
 * unique and tell you nothing.
 */
class CacheCollector extends AbstractCollector
{
    private const OPERATION_LOAD = 'load';

    /** @var array<string, array<string, mixed>> */
    private array $groups = [];

    private int $operationCount = 0;

    private int $hits = 0;

    private int $misses = 0;

    public function label(): string
    {
        return 'Cache';
    }

    public function reset(): void
    {
        parent::reset();
        $this->groups = [];
        $this->operationCount = 0;
        $this->hits = 0;
        $this->misses = 0;
    }

    public function recordOperation(
        string $operation,
        string $identifier,
        float $durationMs,
        int $bytes = 0,
        bool $hit = false
    ): void {
        $this->operationCount++;

        if ($operation === self::OPERATION_LOAD) {
            $hit ? $this->hits++ : $this->misses++;
        }

        $group = $this->group($identifier);

        if (!isset($this->groups[$group])) {
            if ($this->atCapacity(count($this->groups))) {
                return;
            }

            $this->groups[$group] = [
                'group' => $group,
                'count' => 0,
                'hits' => 0,
                'misses' => 0,
                'writes' => 0,
                'duration_ms' => 0.0,
                'bytes' => 0,
            ];
        }

        $this->groups[$group]['count']++;
        $this->groups[$group]['duration_ms'] =
            round($this->groups[$group]['duration_ms'] + $durationMs, 3);
        $this->groups[$group]['bytes'] += $bytes;

        if ($operation === self::OPERATION_LOAD) {
            $hit ? $this->groups[$group]['hits']++ : $this->groups[$group]['misses']++;
        } else {
            $this->groups[$group]['writes']++;
        }
    }

    public function summary(): array
    {
        $loads = $this->hits + $this->misses;
        $total = 0.0;

        foreach ($this->groups as $group) {
            $total += $group['duration_ms'];
        }

        return [
            ...$this->counts($this->operationCount, count($this->groups)),
            'hits' => $this->hits,
            'misses' => $this->misses,
            'hit_rate' => $loads > 0 ? round($this->hits / $loads * 100, 1) : null,
            'duration_ms' => round($total, 2),
        ];
    }

    public function payload(): array
    {
        $items = array_values($this->groups);

        usort($items, static fn (array $left, array $right): int
            => $right['duration_ms'] <=> $left['duration_ms'] ?: $right['count'] <=> $left['count']);

        return ['items' => $items];
    }

    /**
     * Magento cache ids look like BLOCK_HTML_a1b2c3... or CATALOG_PRODUCT_1234. The
     * leading alphabetic segments identify the kind of cache; everything after the first
     * digit or hash is noise for a summary.
     */
    private function group(string $identifier): string
    {
        $normalized = strtoupper($identifier);

        if (preg_match('/^([A-Z][A-Z_]*[A-Z])(?:_|$)/', $normalized, $matches) === 1) {
            return $matches[1];
        }

        return preg_split('/[_\-]/', $normalized)[0] ?: 'OTHER';
    }
}
