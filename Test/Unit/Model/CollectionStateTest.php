<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\CollectionState;

class CollectionStateTest extends TestCase
{
    #[Test]
    public function aRequestIsNotCollectedUntilTheGateSaidYes(): void
    {
        $this->assertFalse((new CollectionState())->isCollecting());
    }

    #[Test]
    public function itFollowsStartAndStop(): void
    {
        $state = new CollectionState();

        $state->start();
        $this->assertTrue($state->isCollecting());

        $state->stop();
        $this->assertFalse($state->isCollecting());
    }
}
