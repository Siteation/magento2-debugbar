<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

/**
 * Every dispatched event, including the ones nobody observes.
 *
 * Events repeat heavily, so they are aggregated by name rather than listed one by one.
 * A page that dispatches core_layout_render_element 400 times should read as one row with
 * a count, not as 400 rows.
 */
class EventCollector extends AbstractCollector
{
    /** @var array<string, array{name: string, count: int, duration_ms: float}> */
    private array $events = [];

    /**
     * Counted separately because observers run inside the dispatch, which is only
     * recorded once it returns. Keying on the event name lets the two arrive in any order.
     *
     * @var array<string, int>
     */
    private array $observed = [];

    private int $dispatchCount = 0;

    public function key(): string
    {
        return 'events';
    }

    public function label(): string
    {
        return 'Events';
    }

    public function reset(): void
    {
        parent::reset();
        $this->events = [];
        $this->observed = [];
        $this->dispatchCount = 0;
    }

    public function recordDispatch(string $name, float $durationMs): void
    {
        $this->dispatchCount++;

        if (!isset($this->events[$name])) {
            if (count($this->events) >= $this->maxItems) {
                $this->dropped++;

                return;
            }

            $this->events[$name] = [
                'name' => $name,
                'count' => 0,
                'duration_ms' => 0.0,
            ];
        }

        $this->events[$name]['count']++;
        $this->events[$name]['duration_ms'] = round($this->events[$name]['duration_ms'] + $durationMs, 3);
    }

    public function recordObserved(string $name): void
    {
        $this->observed[$name] = ($this->observed[$name] ?? 0) + 1;
    }

    public function summary(): array
    {
        $observed = 0;
        $total = 0.0;

        foreach ($this->events as $name => $event) {
            $total += $event['duration_ms'];

            if (($this->observed[$name] ?? 0) > 0) {
                $observed++;
            }
        }

        return [
            'count' => $this->dispatchCount,
            'retained_count' => count($this->events),
            'dropped_count' => $this->dropped,
            'truncated' => $this->dropped > 0,
            'unique_count' => count($this->events),
            'observed_count' => $observed,
            'unobserved_count' => count($this->events) - $observed,
            'duration_ms' => round($total, 2),
        ];
    }

    public function payload(): array
    {
        $items = [];

        foreach ($this->events as $name => $event) {
            $items[] = [...$event, 'observer_count' => $this->observed[$name] ?? 0];
        }

        usort($items, static fn (array $left, array $right): int
            => $right['duration_ms'] <=> $left['duration_ms'] ?: $right['count'] <=> $left['count']);

        return ['items' => $items];
    }
}
