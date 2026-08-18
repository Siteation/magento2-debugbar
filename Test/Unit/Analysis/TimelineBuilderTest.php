<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Analysis;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\TimelineBuilder;

class TimelineBuilderTest extends TestCase
{
    private TimelineBuilder $builder;

    protected function setUp(): void
    {
        $this->builder = new TimelineBuilder();
    }

    #[Test]
    public function itBracketsEverythingWithMilestones(): void
    {
        $items = $this->builder->build($this->profile([]))['items'];

        $this->assertSame('Request started', $items[0]['label']);
        $this->assertSame('milestone', $items[0]['kind']);
        $this->assertSame('Request finished', end($items)['label']);
        $this->assertSame(100.0, end($items)['at_percent']);
    }

    #[Test]
    public function anItemWithADurationBecomesASpan(): void
    {
        $entry = $this->firstOf('queries', ['at_ms' => 50.0, 'duration_ms' => 10.0, 'sql' => 'SELECT 1']);

        $this->assertSame('span', $entry['kind']);
        $this->assertSame(40.0, $entry['start_ms'], 'A span starts where it ends minus its duration.');
        $this->assertSame(50.0, $entry['at_percent'], 'Half way through a 100 ms request.');
        $this->assertSame(10.0, $entry['duration_percent']);
    }

    #[Test]
    public function anItemWithoutADurationBecomesAPoint(): void
    {
        $entry = $this->firstOf('queries', ['at_ms' => 25.0, 'sql' => 'SELECT 1']);

        $this->assertSame('point', $entry['kind']);
        $this->assertNull($entry['start_ms']);
        $this->assertNull($entry['duration_percent']);
    }

    #[Test]
    public function anItemThatKnowsItsOwnStartKeepsIt(): void
    {
        $entry = $this->firstOf('blocks', [
            'at_ms' => 90.0,
            'start_ms' => 10.0,
            'duration_ms' => 5.0,
            'name' => 'header',
        ]);

        $this->assertSame(10.0, $entry['start_ms'], 'A block was timed as a span, so it is not inferred.');
    }

    #[Test]
    public function aggregatedSectionsAreLeftOut(): void
    {
        $profile = $this->profile([
            'observers' => ['payload' => ['items' => [['at_ms' => 10.0, 'name' => 'obs']]]],
            'cache' => ['payload' => ['items' => [['at_ms' => 20.0, 'group' => 'BLOCK']]]],
        ]);

        $sections = array_column($this->builder->build($profile)['items'], 'section');

        $this->assertSame(
            ['request', 'request'],
            $sections,
            'An aggregate has no single moment, so inventing one would be worse than omitting it.'
        );
    }

    #[Test]
    public function itemsWithoutATimestampAreLeftOut(): void
    {
        $profile = $this->profile([
            'queries' => ['payload' => ['items' => [['sql' => 'SELECT 1', 'duration_ms' => 3.0]]]],
        ]);

        $this->assertCount(2, $this->builder->build($profile)['items']);
    }

    #[Test]
    public function itOrdersByWhenThingsHappened(): void
    {
        $profile = $this->profile([
            'queries' => ['payload' => ['items' => [
                ['at_ms' => 80.0, 'sql' => 'late'],
                ['at_ms' => 20.0, 'sql' => 'early'],
            ]]],
        ]);

        $labels = array_column($this->builder->build($profile)['items'], 'label');

        $this->assertSame(['Request started', 'early', 'late', 'Request finished'], $labels);
    }

    #[Test]
    public function itCountsSpans(): void
    {
        $profile = $this->profile([
            'queries' => ['payload' => ['items' => [
                ['at_ms' => 10.0, 'duration_ms' => 2.0, 'sql' => 'a'],
                ['at_ms' => 20.0, 'sql' => 'b'],
            ]]],
        ]);

        $summary = $this->builder->build($profile)['summary'];

        $this->assertSame(4, $summary['count']);
        $this->assertSame(1, $summary['span_count']);
    }

    /**
     * @param array<string, mixed> $item
     * @return array<string, mixed>
     */
    private function firstOf(string $section, array $item): array
    {
        $items = $this->builder->build(
            $this->profile([$section => ['payload' => ['items' => [$item]]]])
        )['items'];

        return $items[1];
    }

    /**
     * @param array<string, mixed> $sections
     * @return array<string, mixed>
     */
    private function profile(array $sections): array
    {
        return ['metrics' => ['duration_ms' => 100.0], 'sections' => $sections];
    }
}
