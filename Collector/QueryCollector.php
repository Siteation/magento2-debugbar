<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

use Magento\Framework\DB\LoggerInterface;
use Siteation\DebugBar\Model\CallSiteResolver;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\Redactor;

/**
 * Every database query, timed.
 *
 * Fed by a plugin on Magento\Framework\DB\LoggerInterface, which the PDO adapter calls
 * around each query in a finally block, so connects, transactions and rollbacks arrive
 * here too without any extra wiring.
 */
class QueryCollector extends AbstractCollector
{
    private ?float $startedAt = null;

    private int $transactionCount = 0;

    public function __construct(
        Redactor $redactor,
        private readonly Config $config,
        private readonly CallSiteResolver $callSites,
        int $maxItems = 500
    ) {
        parent::__construct($redactor, $maxItems);
    }

    public function key(): string
    {
        return 'queries';
    }

    public function label(): string
    {
        return 'Queries';
    }

    public function reset(): void
    {
        parent::reset();
        $this->startedAt = null;
        $this->transactionCount = 0;
    }

    public function markStart(): void
    {
        $this->startedAt = microtime(true);
    }

    /**
     * @param array<array-key, mixed> $bindings
     */
    public function recordQuery(string $type, string $sql, array $bindings): void
    {
        $durationMs = $this->startedAt === null
            ? 0.0
            : round((microtime(true) - $this->startedAt) * 1000, 3);

        $this->startedAt = null;

        if ($type !== LoggerInterface::TYPE_QUERY) {
            $this->transactionCount++;
        }

        $this->record([
            'type' => $type,
            'sql' => $this->redactor->cleanSql($sql),
            'bindings' => $this->redactor->cleanBindings($bindings, $this->config->valuePolicy()),
            'duration_ms' => $durationMs,
            'slow' => $durationMs >= $this->config->slowQueryMs(),
            'callsite' => $this->callSites->resolve(),
        ]);
    }

    public function summary(): array
    {
        $slow = 0;

        foreach ($this->items as $item) {
            if ($item['slow'] ?? false) {
                $slow++;
            }
        }

        return [
            ...parent::summary(),
            'duration_ms' => round($this->totals['duration_ms'] ?? 0, 2),
            'slow_count' => $slow,
            'transaction_count' => $this->transactionCount,
            'slow_threshold_ms' => $this->config->slowQueryMs(),
        ];
    }

    protected function track(array $item): void
    {
        $this->totals['duration_ms'] =
            ($this->totals['duration_ms'] ?? 0) + (float) ($item['duration_ms'] ?? 0);
    }
}
