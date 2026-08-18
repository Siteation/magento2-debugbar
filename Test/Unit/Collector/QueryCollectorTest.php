<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Collector;

use Magento\Framework\DB\LoggerInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Collector\QueryCollector;
use Siteation\DebugBar\Model\CallSiteResolver;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\Redactor;

class QueryCollectorTest extends TestCase
{
    private QueryCollector $collector;

    protected function setUp(): void
    {
        $config = $this->createStub(Config::class);
        $config->method('slowQueryMs')->willReturn(100.0);
        $config->method('valuePolicy')->willReturn(Redactor::POLICY_FULL);

        $callSites = $this->createStub(CallSiteResolver::class);
        $callSites->method('resolve')->willReturn([]);

        $clock = new Clock();
        $clock->start();

        $this->collector = new QueryCollector(new Redactor(), $clock, $config, $callSites);
    }

    #[Test]
    public function itRecordsAQueryThatWasTimed(): void
    {
        $this->collector->markStart();
        $this->collector->recordQuery(LoggerInterface::TYPE_QUERY, 'SELECT 1', []);

        $this->assertSame(1, $this->collector->summary()['count']);
    }

    #[Test]
    public function itIgnoresADelegatedSecondReport(): void
    {
        // LoggerInterface resolves to LoggerProxy, which delegates to an inner logger that
        // also implements it, so both are intercepted and both report the same query.
        $this->collector->markStart();
        $this->collector->recordQuery(LoggerInterface::TYPE_QUERY, 'SELECT 1', []);
        $this->collector->recordQuery(LoggerInterface::TYPE_QUERY, 'SELECT 1', []);

        $this->assertSame(
            1,
            $this->collector->summary()['count'],
            'Counting the delegated copy doubles every query on every page.'
        );
    }

    #[Test]
    public function itIgnoresAReportWithNoTimingAtAll(): void
    {
        $this->collector->recordQuery(LoggerInterface::TYPE_QUERY, 'SELECT 1', []);

        $this->assertSame(0, $this->collector->summary()['count']);
    }

    #[Test]
    public function itStampsWhenTheQueryHappened(): void
    {
        $this->collector->markStart();
        $this->collector->recordQuery(LoggerInterface::TYPE_QUERY, 'SELECT 1', []);

        $item = $this->collector->payload()['items'][0];

        $this->assertArrayHasKey('at_ms', $item);
        $this->assertGreaterThanOrEqual(0.0, $item['at_ms']);
    }

    #[Test]
    public function itCountsTransactionsSeparately(): void
    {
        $this->collector->markStart();
        $this->collector->recordQuery(LoggerInterface::TYPE_TRANSACTION, 'BEGIN', []);

        $summary = $this->collector->summary();

        $this->assertSame(1, $summary['transaction_count']);
    }

    #[Test]
    public function itStripsLiteralsFromRecordedSql(): void
    {
        $this->collector->markStart();
        $this->collector->recordQuery(
            LoggerInterface::TYPE_QUERY,
            "SELECT * FROM customer WHERE email = 'alice@example.com'",
            []
        );

        $this->assertStringNotContainsString(
            'alice@example.com',
            $this->collector->payload()['items'][0]['sql']
        );
    }
}
