<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Plugin\Event;

use Closure;
use Magento\Framework\Event\ManagerInterface;
use Siteation\DebugBar\Collector\EventCollector;
use Siteation\DebugBar\Model\ProfileManager;

/**
 * Every dispatched event, observed or not.
 *
 * This must never read configuration. A config read can miss the cache, a cache miss
 * dispatches events, and the check would re-enter itself. It only ever asks the profile
 * manager for a boolean it already holds.
 */
class ManagerPlugin
{
    public function __construct(
        private readonly ProfileManager $manager,
        private readonly EventCollector $events
    ) {
    }

    /**
     * @param array<string, mixed> $data
     */
    public function aroundDispatch(
        ManagerInterface $subject,
        Closure $proceed,
        string $eventName,
        array $data = []
    ): mixed {
        if (!$this->manager->isCollecting()) {
            return $proceed($eventName, $data);
        }

        $startedAt = microtime(true);

        try {
            return $proceed($eventName, $data);
        } finally {
            $this->events->recordDispatch(
                $eventName,
                (microtime(true) - $startedAt) * 1000
            );
        }
    }
}
