<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

use Magento\Framework\App\ResponseInterface;
use Siteation\DebugBar\Api\CollectorInterface;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Redactor;
use Throwable;

/**
 * Redacts and bounds every recorded item once, for all collectors.
 *
 * Totals keep counting after the item cap is reached, so a profile reports "900 queries,
 * showing 500" instead of quietly claiming there were 500.
 */
abstract class AbstractCollector implements CollectorInterface
{
    /** @var list<array<string, mixed>> */
    protected array $items = [];

    protected int $dropped = 0;

    /** @var array<string, float|int> */
    protected array $totals = [];

    public function __construct(
        protected readonly Redactor $redactor,
        protected readonly Clock $clock,
        protected readonly int $maxItems = 500
    ) {
    }

    public function reset(): void
    {
        $this->items = [];
        $this->dropped = 0;
        $this->totals = [];
    }

    public function record(array $item): void
    {
        /** @var array<string, mixed> $safe */
        $safe = $this->redactor->clean($item);

        // When it happened, not just how long it took. Collectors that already know their
        // own offset, because they timed a span themselves, keep theirs.
        $safe['at_ms'] ??= $this->clock->elapsedMs();

        $this->track($safe);

        if ($this->atCapacity(count($this->items))) {
            return;
        }

        $this->items[] = $safe;
    }

    public function summary(): array
    {
        $retained = count($this->items);

        return $this->counts($retained + $this->dropped, $retained);
    }

    /**
     * The four keys every section summary carries.
     *
     * Collectors that aggregate their rows rather than list them build their own summary, so
     * without this the shape TruncatedCollectorRule reads would be hand written once per
     * collector.
     *
     * @param int $total everything that happened, dropped rows included
     * @param int $retained what the payload actually holds
     * @return array{count: int, retained_count: int, dropped_count: int, truncated: bool}
     */
    protected function counts(int $total, int $retained): array
    {
        return [
            'count' => $total,
            'retained_count' => $retained,
            'dropped_count' => $this->dropped,
            'truncated' => $this->dropped > 0,
        ];
    }

    /**
     * True when there is no room for another row, counting the drop as it says so.
     *
     * @param int $retained how many rows are already held
     */
    protected function atCapacity(int $retained): bool
    {
        if ($retained < $this->maxItems) {
            return false;
        }

        $this->dropped++;

        return true;
    }

    public function payload(): array
    {
        return ['items' => $this->items];
    }

    /**
     * @param array<string, mixed> $item
     */
    protected function track(array $item): void
    {
    }

    public function finalize(ResponseInterface $response): void
    {
    }

    public function captureFailure(Throwable $thrown): void
    {
    }
}
