<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\App\ResponseInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Siteation\DebugBar\Analysis\ProfileAnalyzer;
use Siteation\DebugBar\Analysis\TimelineBuilder;
use Siteation\DebugBar\Api\CollectorInterface;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\ProfileManager;

/**
 * One setting decides what is collected and what is drawn.
 *
 * The half that matters most is this one: a section that is off must not be gathered either,
 * because the point of switching Blocks off on a page that renders four hundred of them is
 * that the request being debugged gets cheaper, not just that a tab disappears.
 */
class ProfileManagerTest extends TestCase
{
    #[Test]
    public function aSectionThatIsOffIsNeverEvenCollected(): void
    {
        $blocks = $this->createMock(CollectorInterface::class);
        $blocks->expects($this->never())->method('finalize');
        $blocks->expects($this->never())->method('summary');

        $manager = $this->manager(['blocks' => $blocks], ['queries']);
        $manager->begin();

        // The plugins record through quietly(), which is what makes the switch cost nothing.
        $recorded = false;
        $manager->quietly('blocks', function () use (&$recorded): void {
            $recorded = true;
        });

        $profile = $manager->finalize($this->createStub(ResponseInterface::class));

        $this->assertFalse($recorded, 'a plugin call for a section that is off must not run');
        $this->assertArrayNotHasKey('blocks', $profile['sections']);
    }

    #[Test]
    public function aSectionThatIsOnIsCollectedAndPresent(): void
    {
        $manager = $this->manager(['queries' => $this->collector()], ['queries']);
        $manager->begin();

        $recorded = false;
        $manager->quietly('queries', function () use (&$recorded): void {
            $recorded = true;
        });

        $profile = $manager->finalize($this->createStub(ResponseInterface::class));

        $this->assertTrue($recorded);
        $this->assertArrayHasKey('queries', $profile['sections']);
    }

    #[Test]
    public function theCollectorKeyThatIsNotItsPanelName(): void
    {
        // Registered as 'interception', shown as 'Plugins'. Without the map, turning the
        // panel off would leave the collector running.
        $manager = $this->manager(['interception' => $this->collector()], ['queries']);
        $manager->begin();

        $profile = $manager->finalize($this->createStub(ResponseInterface::class));

        $this->assertArrayNotHasKey('interception', $profile['sections']);
    }

    #[Test]
    public function noChoiceMeansEveryChoice(): void
    {
        $manager = $this->manager(['queries' => $this->collector(), 'cache' => $this->collector()], []);
        $manager->begin();

        $profile = $manager->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame(['queries', 'cache', 'timeline'], array_keys($profile['sections']));
    }

    private function collector(): CollectorInterface
    {
        $collector = $this->createStub(CollectorInterface::class);
        $collector->method('label')->willReturn('Section');
        $collector->method('summary')->willReturn([]);
        $collector->method('payload')->willReturn(['items' => []]);

        return $collector;
    }

    /**
     * @param array<string, CollectorInterface> $collectors
     * @param list<string> $sections
     */
    private function manager(array $collectors, array $sections): ProfileManager
    {
        $config = $this->createStub(Config::class);
        $config->method('sections')->willReturn($sections);
        // Plain membership. The always-on rule belongs to Config and is pinned in ConfigTest;
        // reimplementing it here would have this test agreeing with itself.
        $config->method('collects')->willReturnCallback(
            static fn (string $section): bool => $sections === [] || in_array($section, $sections, true)
        );

        $analyzer = $this->createStub(ProfileAnalyzer::class);
        $analyzer->method('analyze')->willReturn([]);

        $timeline = $this->createStub(TimelineBuilder::class);
        $timeline->method('build')->willReturn(['summary' => [], 'items' => []]);

        return new ProfileManager(
            $analyzer,
            $timeline,
            new Clock(),
            $config,
            $this->createStub(LoggerInterface::class),
            $collectors
        );
    }
}
