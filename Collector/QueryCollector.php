<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

use Magento\Framework\DB\LoggerInterface;
use Siteation\DebugBar\Model\CallSiteResolver;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\Clock;
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
        Clock $clock,
        private readonly Config $config,
        private readonly CallSiteResolver $callSites,
        int $maxItems = 500
    ) {
        parent::__construct($redactor, $clock, $maxItems);
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
     * Every query arrives here twice.
     *
     * LoggerInterface resolves to LoggerProxy, which delegates to an inner logger that
     * also implements LoggerInterface, so both are intercepted and both report the same
     * query. The adapter always calls startTimer() before logStats(), so a call with no
     * marked start is the delegated copy rather than a query.
     *
     * @param array<array-key, mixed> $bindings
     */
    public function recordQuery(string $type, string $sql, array $bindings): void
    {
        if ($this->startedAt === null) {
            return;
        }

        $durationMs = round((microtime(true) - $this->startedAt) * 1000, 3);
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
