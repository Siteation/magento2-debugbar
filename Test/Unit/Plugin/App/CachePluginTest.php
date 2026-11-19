<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Plugin\App;

use Magento\Framework\App\CacheInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Siteation\DebugBar\Analysis\ProfileAnalyzer;
use Siteation\DebugBar\Analysis\TimelineBuilder;
use Siteation\DebugBar\Collector\CacheCollector;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\CollectionState;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\ProfileManager;
use Siteation\DebugBar\Plugin\App\CachePlugin;

/**
 * A removal is recorded the way a load and a save are: only while the cache section is
 * collected, and never at the cost of the shop's own cache call.
 */
class CachePluginTest extends TestCase
{
    private CollectionState $state;

    protected function setUp(): void
    {
        $this->state = new CollectionState();
    }

    #[Test]
    public function aRemovalSurvivesARecorderThatThrows(): void
    {
        $cache = $this->createStub(CacheCollector::class);
        $cache->method('recordOperation')->willThrowException(new RuntimeException('collector broke'));

        $removed = (new CachePlugin($this->state, $this->manager(['cache']), $cache))->aroundRemove(
            $this->createStub(CacheInterface::class),
            static fn (string $identifier): bool => true,
            'config_scopes'
        );

        $this->assertTrue($removed, 'The shop asked for a removal and must get its answer.');
    }

    #[Test]
    public function aRemovalIsNotRecordedWhileTheCacheSectionIsOff(): void
    {
        $cache = $this->createMock(CacheCollector::class);
        $cache->expects($this->never())->method('recordOperation');

        (new CachePlugin($this->state, $this->manager(['queries']), $cache))->aroundRemove(
            $this->createStub(CacheInterface::class),
            static fn (string $identifier): bool => true,
            'config_scopes'
        );
    }

    #[Test]
    public function aRemovalIsRecordedWhileTheCacheSectionIsOn(): void
    {
        $cache = $this->createMock(CacheCollector::class);
        $cache->expects($this->once())->method('recordOperation')
            ->with('remove', 'config_scopes', $this->isFloat());

        (new CachePlugin($this->state, $this->manager(['cache']), $cache))->aroundRemove(
            $this->createStub(CacheInterface::class),
            static fn (string $identifier): bool => true,
            'config_scopes'
        );
    }

    /**
     * @param list<string> $sections
     */
    private function manager(array $sections): ProfileManager
    {
        $config = $this->createStub(Config::class);
        $config->method('collects')->willReturnCallback(
            static fn (string $section): bool => in_array($section, $sections, true)
        );

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
