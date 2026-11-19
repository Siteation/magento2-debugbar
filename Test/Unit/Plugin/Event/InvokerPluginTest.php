<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Plugin\Event;

use Magento\Framework\Event;
use Magento\Framework\Event\InvokerInterface;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Event\Observer;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Siteation\DebugBar\Analysis\ProfileAnalyzer;
use Siteation\DebugBar\Analysis\TimelineBuilder;
use Siteation\DebugBar\Collector\EventCollector;
use Siteation\DebugBar\Collector\ObserverCollector;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\CollectionState;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\ProfileManager;
use Siteation\DebugBar\Model\Redactor;
use Siteation\DebugBar\Plugin\Event\InvokerPlugin;
use Siteation\DebugBar\Plugin\Event\ManagerPlugin;
use stdClass;

/**
 * An observer is timed under the event it observes, also when the dispatch data replaced the
 * Magento event on the observer: Magento merges the data over `event`, and Nebula's grid
 * events pass an `event` of their own.
 */
class InvokerPluginTest extends TestCase
{
    private CollectionState $state;

    protected function setUp(): void
    {
        $this->state = new CollectionState();
    }

    #[Test]
    public function anObserverIsTimedUnderItsEvent(): void
    {
        $event = new Event();
        $event->setName('catalog_product_load_after');

        $this->assertSame('catalog_product_load_after', $this->observedName('catalog_product_load_after', $event));
    }

    #[Test]
    public function anEventReplacedByTheDispatchDataStillNamesTheObserver(): void
    {
        $this->assertSame(
            'nebula_grid_data_cache_grid',
            $this->observedName('nebula_grid_data_cache_grid', new stdClass())
        );
    }

    #[Test]
    public function theNameIsTheInnermostDispatch(): void
    {
        $events = new EventCollector(new Redactor(), new Clock());
        $manager = $this->manager();
        $dispatch = new ManagerPlugin($this->state, $manager, $events);
        $subject = $this->createStub(ManagerInterface::class);

        $dispatch->aroundDispatch($subject, function () use ($dispatch, $subject, $events): void {
            $dispatch->aroundDispatch($subject, static fn () => null, 'inner');
            $this->assertSame('outer', $events->dispatching());
        }, 'outer');

        $this->assertNull($events->dispatching());
    }

    private function observedName(string $eventName, object $event): string
    {
        $events = new EventCollector(new Redactor(), new Clock());
        $manager = $this->manager();
        $named = null;

        $observers = $this->createMock(ObserverCollector::class);
        $observers->expects($this->once())->method('recordInvocation')->willReturnCallback(
            static function (string $event) use (&$named): void {
                $named = $event;
            }
        );

        $invoker = new InvokerPlugin($this->state, $manager, $observers, $events);
        $observer = new Observer(['event' => $event]);

        (new ManagerPlugin($this->state, $manager, $events))->aroundDispatch(
            $this->createStub(ManagerInterface::class),
            fn () => $invoker->aroundDispatch(
                $this->createStub(InvokerInterface::class),
                static fn () => null,
                ['instance' => 'Vendor\\Observer', 'name' => 'vendor_observer'],
                $observer
            ),
            $eventName
        );

        return (string) $named;
    }

    private function manager(): ProfileManager
    {
        $config = $this->createStub(Config::class);
        $config->method('collects')->willReturn(true);

        $manager = new ProfileManager(
            $this->createStub(ProfileAnalyzer::class),
            $this->createStub(TimelineBuilder::class),
            new Clock(),
            $config,
            $this->createStub(LoggerInterface::class),
            $this->state
        );
        $manager->begin();

        return $manager;
    }
}
