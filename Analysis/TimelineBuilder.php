<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis;

/**
 * Turns a finished profile into an ordered sequence with the geometry a waterfall needs.
 *
 * Three kinds of entry. A milestone marks a moment with no duration, the request starting
 * and finishing. A span has a duration, so it is drawn as a bar from start_ms to at_ms. A
 * point happened at a moment but took no measurable time.
 *
 * Anything a collector aggregated has no single moment it happened at, so it carries no
 * at_ms and is simply left out. A waterfall that invented positions for those would be
 * worse than one that admits it cannot place them.
 */
class TimelineBuilder
{
    private const KIND_MILESTONE = 'milestone';
    private const KIND_SPAN = 'span';
    private const KIND_POINT = 'point';

    /** Sections whose items are aggregates, not moments. */
    private const AGGREGATED = ['request', 'events', 'observers', 'cache', 'interception'];

    /**
     * @param array<string, mixed> $profile
     * @return array{items: list<array<string, mixed>>, summary: array<string, mixed>}
     */
    public function build(array $profile): array
    {
        $duration = (float) ($profile['metrics']['duration_ms'] ?? 0);

        $entries = [[
            'id' => 'request-start',
            'section' => 'request',
            'kind' => self::KIND_MILESTONE,
            'label' => 'Request started',
            'at_ms' => 0.0,
            'start_ms' => null,
            'duration_ms' => null,
        ]];

        foreach ((array) ($profile['sections'] ?? []) as $section => $data) {
            if (in_array($section, self::AGGREGATED, true)) {
                continue;
            }

            foreach ((array) ($data['payload']['items'] ?? []) as $index => $item) {
                $entry = $this->entry((string) $section, (int) $index, $item);

                if ($entry !== null) {
                    $entries[] = $entry;
                }
            }
        }

        $entries[] = [
            'id' => 'request-end',
            'section' => 'request',
            'kind' => self::KIND_MILESTONE,
            'label' => 'Request finished',
            'at_ms' => round($duration, 3),
            'start_ms' => null,
            'duration_ms' => null,
        ];

        usort($entries, static fn (array $left, array $right): int
            => $left['at_ms'] <=> $right['at_ms']);

        $scale = max(0.001, ...array_column($entries, 'at_ms'));
        $items = array_map(fn (array $entry): array => $this->withGeometry($entry, $scale), $entries);

        return [
            'items' => $items,
            'summary' => [
                'count' => count($items),
                'span_count' => count(array_filter($items, static fn (array $i): bool => $i['kind'] === self::KIND_SPAN)),
                'scale_ms' => round($scale, 3),
                'duration_ms' => round($duration, 2),
            ],
        ];
    }

    /**
     * @param mixed $item
     * @return array<string, mixed>|null
     */
    private function entry(string $section, int $index, $item): ?array
    {
        if (!is_array($item) || !isset($item['at_ms']) || !is_numeric($item['at_ms'])) {
            return null;
        }

        $at = round((float) $item['at_ms'], 3);
        $duration = isset($item['duration_ms']) && is_numeric($item['duration_ms'])
            ? max(0.0, (float) $item['duration_ms'])
            : null;

        // Blocks already know where they started, because they were timed as a span.
        $start = isset($item['start_ms']) && is_numeric($item['start_ms'])
            ? round((float) $item['start_ms'], 3)
            : ($duration !== null && $duration > 0 ? round(max(0, $at - $duration), 3) : null);

        return [
            'id' => $section . '-' . $index,
            'section' => $section,
            'kind' => $start === null ? self::KIND_POINT : self::KIND_SPAN,
            'label' => $this->label($section, $item),
            'at_ms' => $at,
            'start_ms' => $start,
            'duration_ms' => $duration === null ? null : round($duration, 3),
        ];
    }

    /**
     * @param array<string, mixed> $entry
     * @return array<string, mixed>
     */
    private function withGeometry(array $entry, float $scale): array
    {
        $entry['at_percent'] = $this->percent($entry['at_ms'], $scale);
        $entry['start_percent'] = $entry['start_ms'] === null
            ? null
            : $this->percent($entry['start_ms'], $scale);
        $entry['duration_percent'] = $entry['start_ms'] === null
            ? null
            : max(0.0, round($entry['at_percent'] - $entry['start_percent'], 3));

        return $entry;
    }

    private function percent(float $value, float $scale): float
    {
        return round(min(100, max(0, $value / $scale * 100)), 3);
    }

    /**
     * @param array<string, mixed> $item
     */
    private function label(string $section, array $item): string
    {
        foreach (['name', 'sql', 'label'] as $key) {
            if (isset($item[$key]) && is_string($item[$key]) && $item[$key] !== '') {
                return $item[$key];
            }
        }

        return ucfirst($section);
    }
}
