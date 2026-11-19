<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Plugin\View;

use Magento\Framework\View\Layout;
use Siteation\DebugBar\Collector\LayoutCollector;
use Siteation\DebugBar\Collector\PageCacheCollector;
use Siteation\DebugBar\Model\CollectionState;
use Siteation\DebugBar\Model\ProfileManager;
use Siteation\DebugBar\Model\UncacheableBlocks;

/**
 * Asks the layout, once it exists, which handles it loaded, whether it can be cached, and
 * which blocks say no.
 *
 * After generateElements() because that is when Magento itself asks: the page cache's own
 * layout plugin marks the response public at the same point.
 */
class LayoutPlugin
{
    public function __construct(
        private readonly CollectionState $state,
        private readonly ProfileManager $manager,
        private readonly PageCacheCollector $pageCache,
        private readonly UncacheableBlocks $uncacheable,
        private readonly LayoutCollector $layout
    ) {
    }

    /**
     * @param Layout $subject
     * @param mixed $result
     * @return mixed
     */
    public function afterGenerateElements(Layout $subject, $result)
    {
        if ($this->state->isCollecting()) {
            $this->manager->quietly('layout', fn () => $this->layout->generated($subject));
            $this->manager->quietly('pagecache', fn () => $this->pageCache->layout(
                (bool) $subject->isCacheable(),
                $this->uncacheable->find($subject)
            ));
        }

        return $result;
    }
}
