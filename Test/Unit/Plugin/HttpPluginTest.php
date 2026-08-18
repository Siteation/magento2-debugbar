<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Plugin;

use Magento\Framework\App\Http as AppHttp;
use Magento\Framework\HTTP\PhpEnvironment\Response;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Siteation\DebugBar\Model\ProfileManager;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Model\RequestEligibility;
use Siteation\DebugBar\Plugin\App\HttpPlugin;
use Siteation\DebugBar\Presentation\BarInjector;

/**
 * The bar must never break the page it is debugging. These are the paths where that
 * promise is actually kept.
 */
class HttpPluginTest extends TestCase
{
    #[Test]
    public function itLeavesTheResponseAloneWhenNotEligible(): void
    {
        $manager = $this->createMock(ProfileManager::class);
        $manager->expects($this->never())->method('begin');

        $response = $this->launch($this->plugin(eligible: false, manager: $manager));

        $this->assertSame('page', $response->getContent());
    }

    #[Test]
    public function aCollectorThatThrowsDoesNotTakeThePageWithIt(): void
    {
        $manager = $this->createMock(ProfileManager::class);
        $manager->method('isCollecting')->willReturn(true);
        $manager->method('finalize')->willThrowException(new RuntimeException('collector exploded'));
        $manager->expects($this->once())->method('discard');

        $response = $this->launch($this->plugin(manager: $manager));

        $this->assertSame('page', $response->getContent(), 'The page must survive a broken collector.');
    }

    #[Test]
    public function aFailureToStartDoesNotTakeThePageWithIt(): void
    {
        $manager = $this->createMock(ProfileManager::class);
        $manager->method('begin')->willThrowException(new RuntimeException('cannot start'));
        $manager->expects($this->once())->method('discard');

        $response = $this->launch($this->plugin(manager: $manager));

        $this->assertSame('page', $response->getContent());
    }

    #[Test]
    public function aStoreThatThrowsDoesNotTakeThePageWithIt(): void
    {
        $manager = $this->createStub(ProfileManager::class);
        $manager->method('isCollecting')->willReturn(true);
        $manager->method('finalize')->willReturn(['id' => 'x']);

        $store = $this->createStub(ProfileStore::class);
        $store->method('put')->willThrowException(new RuntimeException('disk full'));

        $response = $this->launch($this->plugin(manager: $manager, store: $store));

        $this->assertSame('page', $response->getContent());
    }

    private function launch(HttpPlugin $plugin): Response
    {
        $response = new Response();
        $response->setContent('page');

        $result = $plugin->aroundLaunch(
            $this->createStub(AppHttp::class),
            static fn (): Response => $response
        );

        $this->assertSame($response, $result);

        return $response;
    }

    private function plugin(
        bool $eligible = true,
        ?ProfileManager $manager = null,
        ?ProfileStore $store = null
    ): HttpPlugin {
        $eligibility = $this->createStub(RequestEligibility::class);
        $eligibility->method('allows')->willReturn($eligible);

        return new HttpPlugin(
            $eligibility,
            $manager ?? $this->createStub(ProfileManager::class),
            $store ?? $this->createStub(ProfileStore::class),
            $this->createStub(BarInjector::class),
            $this->createStub(LoggerInterface::class)
        );
    }
}
