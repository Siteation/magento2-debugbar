<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Plugin\Event;

use Closure;
use Magento\Framework\Event\InvokerInterface;
use Magento\Framework\Event\Observer;
use Siteation\DebugBar\Collector\EventCollector;
use Siteation\DebugBar\Collector\ObserverCollector;
use Siteation\DebugBar\Model\ProfileManager;

/**
 * Every observer that actually ran, timed individually.
 *
 * Like the manager plugin, this reads no configuration.
 */
class InvokerPlugin
{
    public function __construct(
        private readonly ProfileManager $manager,
        private readonly ObserverCollector $observers,
        private readonly EventCollector $events
    ) {
    }

    /**
     * @param array<string, mixed> $configuration
     */
    public function aroundDispatch(
        InvokerInterface $subject,
        Closure $proceed,
        array $configuration,
        Observer $observer
    ): mixed {
        if (!$this->manager->isCollecting() || ($configuration['disabled'] ?? false) === true) {
            return $proceed($configuration, $observer);
        }

        $instance = (string) ($configuration['instance'] ?? '');
        $name = (string) ($configuration['name'] ?? $instance);
        $eventName = (string) $observer->getEvent()->getName();

        $this->manager->quietly(fn () => $this->events->recordObserved($eventName));

        $startedAt = microtime(true);

        try {
            return $proceed($configuration, $observer);
        } finally {
            $this->manager->quietly(fn () => $this->observers->recordInvocation(
                $eventName,
                $name,
                $instance,
                (microtime(true) - $startedAt) * 1000
            ));
        }
    }
}
