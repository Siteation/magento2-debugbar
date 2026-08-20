<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

/**
 * Block render times, with nesting accounted for.
 *
 * A parent block's own time includes everything it renders, so a container always looks
 * like the slowest thing on the page. Keeping a stack lets each block report both: total
 * time, and time spent in the block itself once its children are subtracted. The second
 * number is the one that points at the code to fix.
 */
class BlockCollector extends AbstractCollector
{
    /** @var list<array{name: string, startedAt: float, atMs: float, childMs: float}> */
    private array $stack = [];

    /** @var array<string, array<string, mixed>> */
    private array $blocks = [];

    private int $renderCount = 0;

    public function label(): string
    {
        return 'Blocks';
    }

    public function reset(): void
    {
        parent::reset();
        $this->stack = [];
        $this->blocks = [];
        $this->renderCount = 0;
    }

    public function begin(string $name): void
    {
        $this->stack[] = [
            'name' => $name,
            'startedAt' => microtime(true),
            'atMs' => $this->clock->elapsedMs(),
            'childMs' => 0.0,
        ];
    }

    public function finish(string $name, string $class, ?string $template): void
    {
        $frame = array_pop($this->stack);

        if ($frame === null) {
            return;
        }

        $totalMs = (microtime(true) - $frame['startedAt']) * 1000;
        $ownMs = max(0.0, $totalMs - $frame['childMs']);

        if ($this->stack !== []) {
            $this->stack[array_key_last($this->stack)]['childMs'] += $totalMs;
        }

        $this->renderCount++;

        if (!isset($this->blocks[$name])) {
            if ($this->atCapacity(count($this->blocks))) {
                return;
            }

            $this->blocks[$name] = [
                'name' => $name,
                'class' => $class,
                'template' => $template,
                'count' => 0,
                'total_ms' => 0.0,
                'own_ms' => 0.0,
                // The first render. A block rendered twice is one row in the list but the
                // waterfall only needs somewhere honest to put it.
                'at_ms' => round($frame['atMs'] + $totalMs, 3),
                'start_ms' => $frame['atMs'],
            ];
        }

        $this->blocks[$name]['count']++;
        $this->blocks[$name]['total_ms'] = round($this->blocks[$name]['total_ms'] + $totalMs, 3);
        $this->blocks[$name]['own_ms'] = round($this->blocks[$name]['own_ms'] + $ownMs, 3);
    }

    public function summary(): array
    {
        $ownTotal = 0.0;
        $templated = 0;

        foreach ($this->blocks as $block) {
            $ownTotal += $block['own_ms'];

            if ($block['template'] !== null && $block['template'] !== '') {
                $templated++;
            }
        }

        return [
            ...$this->counts($this->renderCount, count($this->blocks)),
            'unique_count' => count($this->blocks),
            'template_count' => $templated,
            'duration_ms' => round($ownTotal, 2),
        ];
    }

    public function payload(): array
    {
        $items = array_values($this->blocks);

        usort($items, static fn (array $left, array $right): int
            => $right['own_ms'] <=> $left['own_ms']);

        return ['items' => $items];
    }
}
