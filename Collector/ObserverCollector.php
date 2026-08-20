<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

/**
 * Every observer that actually ran, with its own time.
 *
 * Aggregated by observer name, because the interesting question is which observer costs
 * the most across a request, not the order they happened to fire in.
 */
class ObserverCollector extends AbstractCollector
{
    /** @var array<string, array<string, mixed>> */
    private array $observers = [];

    private int $invocationCount = 0;

    public function label(): string
    {
        return 'Observers';
    }

    public function reset(): void
    {
        parent::reset();
        $this->observers = [];
        $this->invocationCount = 0;
    }

    public function recordInvocation(
        string $event,
        string $name,
        string $instance,
        float $durationMs
    ): void {
        $this->invocationCount++;
        $key = $event . "\0" . $name;

        if (!isset($this->observers[$key])) {
            if ($this->atCapacity(count($this->observers))) {
                return;
            }

            $this->observers[$key] = [
                'event' => $event,
                'name' => $name,
                'instance' => $instance,
                'count' => 0,
                'duration_ms' => 0.0,
            ];
        }

        $this->observers[$key]['count']++;
        $this->observers[$key]['duration_ms'] =
            round($this->observers[$key]['duration_ms'] + $durationMs, 3);
    }

    public function summary(): array
    {
        $total = 0.0;

        foreach ($this->observers as $observer) {
            $total += $observer['duration_ms'];
        }

        return [
            ...$this->counts($this->invocationCount, count($this->observers)),
            'unique_count' => count($this->observers),
            'duration_ms' => round($total, 2),
        ];
    }

    public function payload(): array
    {
        $items = array_values($this->observers);

        usort($items, static fn (array $left, array $right): int
            => $right['duration_ms'] <=> $left['duration_ms']);

        return ['items' => $items];
    }
}
