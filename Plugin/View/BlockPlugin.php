<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Plugin\View;

use Closure;
use Magento\Framework\View\Element\AbstractBlock;
use Magento\Framework\View\Element\Template;
use Siteation\DebugBar\Collector\BlockCollector;
use Siteation\DebugBar\Model\ProfileManager;

/**
 * Times every block render.
 *
 * This runs for every block on the page, so it does as little as possible when the bar is
 * off and reads no configuration, for the same reason the event plugins do not.
 */
class BlockPlugin
{
    public function __construct(
        private readonly ProfileManager $manager,
        private readonly BlockCollector $blocks
    ) {
    }

    public function aroundToHtml(AbstractBlock $subject, Closure $proceed): string
    {
        if (!$this->manager->isCollecting()) {
            return $proceed();
        }

        $name = $subject->getNameInLayout() ?: get_class($subject);
        $this->manager->quietly(fn () => $this->blocks->begin($name));

        try {
            return $proceed();
        } finally {
            // Only Template blocks have a template. On anything else getTemplate()
            // resolves through DataObject's magic __call, which happens to work and is
            // not something to depend on.
            $this->manager->quietly(fn () => $this->blocks->finish(
                $name,
                get_class($subject),
                $subject instanceof Template ? ($subject->getTemplate() ?: null) : null
            ));
        }
    }
}
