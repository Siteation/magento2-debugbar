<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Controller;

use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Controller\Result\Raw;
use Magento\Framework\Controller\Result\RawFactory;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\ProfileComparer;
use Siteation\DebugBar\Controller\Profile\Compare;
use Siteation\DebugBar\Controller\Profile\History;
use Siteation\DebugBar\Controller\Profile\View;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Model\RequestEligibility;
use Siteation\DebugBar\Presentation\ProfileReport;
use Siteation\DebugBar\Presentation\ProfileSummary;

/**
 * RequestEligibility answers correctly; these pin that the three endpoints still ask it.
 *
 * The gate was written out three times before it was consolidated, and consolidating it
 * removed the drift without adding anything that notices when a caller stops calling.
 * Deleting the three lines from any of these controllers used to leave the whole suite
 * green, and the endpoint would keep working perfectly for the developer testing it. History
 * is the one that matters most: it hands out the ids the other two take, so an ungated one
 * is an index of every stored profile.
 */
class GateTest extends TestCase
{
    #[Test]
    public function viewRefusesAndReadsNothingWhenTheGateSaysNo(): void
    {
        $controller = new View(
            $this->createStub(RequestInterface::class),
            $this->refusingFactory(),
            $this->rawFactory(),
            $this->untouchedStore(),
            $this->closedGate(),
            $this->createStub(ProfileReport::class)
        );

        $controller->execute();
    }

    #[Test]
    public function historyRefusesAndReadsNothingWhenTheGateSaysNo(): void
    {
        $controller = new History(
            $this->refusingFactory(),
            $this->untouchedStore(),
            $this->createStub(ProfileSummary::class),
            $this->closedGate()
        );

        $controller->execute();
    }

    #[Test]
    public function compareRefusesAndReadsNothingWhenTheGateSaysNo(): void
    {
        $controller = new Compare(
            $this->createStub(RequestInterface::class),
            $this->refusingFactory(),
            $this->untouchedStore(),
            $this->createStub(ProfileComparer::class),
            $this->closedGate()
        );

        $controller->execute();
    }

    private function closedGate(): RequestEligibility
    {
        $eligibility = $this->createStub(RequestEligibility::class);
        $eligibility->method('allowsRead')->willReturn(false);

        return $eligibility;
    }

    /**
     * A mock rather than a stub: answering 404 while still reading the disk would satisfy
     * the question about the status code and miss the one that matters.
     */
    private function untouchedStore(): ProfileStore
    {
        $store = $this->createMock(ProfileStore::class);
        $store->expects($this->never())->method('get');
        $store->expects($this->never())->method('recent');
        $store->expects($this->never())->method('tidy');

        return $store;
    }

    /** A factory whose result insists on being told 404 exactly once. */
    private function refusingFactory(): JsonFactory
    {
        $json = $this->createMock(Json::class);
        $json->expects($this->once())->method('setHttpResponseCode')->with(404)->willReturnSelf();
        $json->expects($this->once())->method('setData')->willReturnSelf();

        $factory = $this->createStub(JsonFactory::class);
        $factory->method('create')->willReturn($json);

        return $factory;
    }

    private function rawFactory(): RawFactory
    {
        $factory = $this->createStub(RawFactory::class);
        $factory->method('create')->willReturn($this->createStub(Raw::class));

        return $factory;
    }
}
