<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Collector;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Collector\BlockCollector;
use Siteation\DebugBar\Collector\CacheCollector;
use Siteation\DebugBar\Collector\EventCollector;
use Siteation\DebugBar\Collector\ObserverCollector;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Redactor;

/**
 * The arithmetic the bar accuses a block with, and the bookkeeping the reader is told to
 * trust over the list length.
 *
 * A wrong own_ms does not throw, it lies: a container that absorbs its children's time makes
 * the bar name the wrong block on every page, and the finding built on it sends the
 * developer to the wrong file. A retained and dropped count that drifted apart would make
 * every truncated profile misreport how much it left out.
 */
class CollectorsTest extends TestCase
{
    #[Test]
    public function aParentBlockIsNotChargedForItsChildrenExceptInItsTotal(): void
    {
        $blocks = $this->blocks();

        $blocks->begin('page');
        usleep(4000);
        $blocks->begin('child');
        usleep(8000);
        $blocks->finish('child', 'Child', 'child.phtml');
        $blocks->finish('page', 'Page', 'page.phtml');

        $items = [];

        foreach ($blocks->payload()['items'] as $item) {
            $items[$item['name']] = $item;
        }

        $this->assertGreaterThan(7.0, $items['child']['own_ms']);
        $this->assertGreaterThan(11.0, $items['page']['total_ms'], 'the parent contains the child');
        $this->assertLessThan(
            $items['child']['own_ms'],
            $items['page']['own_ms'],
            'the child is the slow one, so the parent must not out-rank it'
        );
    }

    #[Test]
    public function aBlockRenderedTwiceIsOneRowWithACount(): void
    {
        $blocks = $this->blocks();

        foreach ([1, 2, 3] as $ignored) {
            $blocks->begin('item');
            $blocks->finish('item', 'Item', 'item.phtml');
        }

        $summary = $blocks->summary();

        $this->assertSame(3, $summary['count'], 'three renders happened');
        $this->assertSame(1, $summary['unique_count'], 'of one block');
        $this->assertSame(3, $blocks->payload()['items'][0]['count']);
    }

    #[Test]
    public function aCollectorSaysHowMuchItLeftOutRatherThanShrinkingQuietly(): void
    {
        // "900 queries, showing 500" is the promise. It only holds if the totals keep
        // counting after the cap is reached.
        $events = new EventCollector(new Redactor(), new Clock(), 2);

        foreach (['a', 'b', 'c', 'd'] as $name) {
            $events->recordDispatch($name, 1.0);
        }

        $events->recordDispatch('a', 1.0);

        $summary = $events->summary();

        $this->assertSame(5, $summary['count'], 'every dispatch counts');
        $this->assertSame(2, $summary['retained_count'], 'two of them are kept');
        $this->assertSame(2, $summary['dropped_count']);
        $this->assertTrue($summary['truncated']);
        $this->assertCount(2, $events->payload()['items']);
    }

    #[Test]
    public function nothingDroppedIsNotTruncated(): void
    {
        $observers = new ObserverCollector(new Redactor(), new Clock(), 10);
        $observers->recordInvocation('sales_order_place_after', 'mailer', 'A\B', 3.0);

        $summary = $observers->summary();

        $this->assertSame(1, $summary['count']);
        $this->assertSame(0, $summary['dropped_count']);
        $this->assertFalse($summary['truncated']);
    }

    #[Test]
    public function aRequestThatReadNoCacheHasNoHitRateRatherThanZeroPercent(): void
    {
        // Zero would be a measurement. Null is the absence of one, and the comparison
        // between two profiles depends on the difference.
        $cache = $this->cache();

        $this->assertNull($cache->summary()['hit_rate']);

        $cache->recordOperation('save', 'BLOCK_HTML_abc', 1.0, 40);

        $this->assertNull($cache->summary()['hit_rate'], 'a write is not a read');
    }

    #[Test]
    public function theHitRateCountsReadsAndOnlyReads(): void
    {
        $cache = $this->cache();

        $cache->recordOperation('load', 'BLOCK_HTML_abc', 1.0, 10, true);
        $cache->recordOperation('load', 'BLOCK_HTML_def', 1.0, 0, false);
        $cache->recordOperation('load', 'BLOCK_HTML_ghi', 1.0, 0, false);
        $cache->recordOperation('load', 'BLOCK_HTML_jkl', 1.0, 10, true);
        $cache->recordOperation('save', 'BLOCK_HTML_mno', 1.0, 10);

        $summary = $cache->summary();

        $this->assertSame(2, $summary['hits']);
        $this->assertSame(2, $summary['misses']);
        $this->assertSame(50.0, $summary['hit_rate']);
        $this->assertSame(5, $summary['count'], 'the write is still an operation');
    }

    #[Test]
    public function cacheIdentifiersGroupByKindRatherThanByHash(): void
    {
        $cache = $this->cache();

        $cache->recordOperation('load', 'BLOCK_HTML_a1b2c3', 1.0, 0, true);
        $cache->recordOperation('load', 'BLOCK_HTML_d4e5f6', 1.0, 0, true);
        $cache->recordOperation('load', 'CATALOG_PRODUCT_1234', 1.0, 0, true);

        $groups = array_column($cache->payload()['items'], 'count', 'group');

        $this->assertSame(2, $groups['BLOCK_HTML'] ?? null);
        $this->assertSame(1, $groups['CATALOG_PRODUCT'] ?? null);
    }

    private function blocks(): BlockCollector
    {
        return new BlockCollector(new Redactor(), new Clock());
    }

    private function cache(): CacheCollector
    {
        return new CacheCollector(new Redactor(), new Clock());
    }
}
