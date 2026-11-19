<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Analysis\Rule;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\QueryAnalyzer;
use Siteation\DebugBar\Analysis\Rule\CacheMissRule;
use Siteation\DebugBar\Analysis\Rule\PageNotCachedRule;
use Siteation\DebugBar\Analysis\Rule\ProductionModeRule;
use Siteation\DebugBar\Analysis\Rule\RepeatedQueryRule;
use Siteation\DebugBar\Analysis\Rule\RequestErrorRule;
use Siteation\DebugBar\Analysis\Rule\SlowBlockRule;
use Siteation\DebugBar\Analysis\Rule\SlowObserverRule;
use Siteation\DebugBar\Analysis\Rule\SlowQueryRule;
use Siteation\DebugBar\Analysis\Rule\SlowRequestRule;
use Siteation\DebugBar\Analysis\Rule\TruncatedCollectorRule;
use Siteation\DebugBar\Model\Config;

class RulesTest extends TestCase
{
    #[Test]
    public function requestErrorFiresOnServerError(): void
    {
        $findings = (new RequestErrorRule())->apply(
            $this->profile(['request' => ['summary' => ['status' => 500]]])
        );

        $this->assertCount(1, $findings);
        $this->assertSame('error', $findings[0]->toArray()['severity']);
    }

    #[Test]
    public function requestErrorIsAWarningForClientErrors(): void
    {
        $findings = (new RequestErrorRule())->apply(
            $this->profile(['request' => ['summary' => ['status' => 404]]])
        );

        $this->assertSame('warning', $findings[0]->toArray()['severity']);
    }

    #[Test]
    public function productionModeIsWorthAWarningEveryTime(): void
    {
        $findings = (new ProductionModeRule())->apply(
            $this->profile(['request' => ['summary' => ['mode' => 'production']]])
        );

        $this->assertCount(1, $findings);
        $this->assertSame('warning', $findings[0]->toArray()['severity']);
        $this->assertSame('overview.production_mode', $findings[0]->id());
    }

    #[Test]
    public function productionModeRuleIsQuietElsewhere(): void
    {
        foreach (['developer', 'default', 'unknown'] as $mode) {
            $this->assertSame([], (new ProductionModeRule())->apply(
                $this->profile(['request' => ['summary' => ['mode' => $mode]]])
            ), $mode);
        }

        $this->assertSame([], (new ProductionModeRule())->apply($this->profile([])));
    }

    #[Test]
    public function requestErrorStaysQuietOnSuccess(): void
    {
        $this->assertSame([], (new RequestErrorRule())->apply(
            $this->profile(['request' => ['summary' => ['status' => 200]]])
        ));
    }

    #[Test]
    public function cacheMissIgnoresASmallNumberOfReads(): void
    {
        $rule = new CacheMissRule();

        $this->assertSame([], $rule->apply(
            $this->profile(['cache' => ['summary' => ['hits' => 0, 'misses' => 4]]])
        ), 'Four cold reads is not a story.');
    }

    #[Test]
    public function cacheMissFiresOnASustainedMissRate(): void
    {
        $findings = (new CacheMissRule())->apply(
            $this->profile(['cache' => ['summary' => ['hits' => 1, 'misses' => 19]]])
        );

        $this->assertCount(1, $findings);
        $this->assertSame(95.0, $findings[0]->toArray()['evidence']['miss_rate']);
    }

    #[Test]
    public function cacheMissStaysQuietOnAHealthyRate(): void
    {
        $this->assertSame([], (new CacheMissRule())->apply(
            $this->profile(['cache' => ['summary' => ['hits' => 18, 'misses' => 2]]])
        ));
    }

    #[Test]
    public function slowBlockNeedsBothAShareAndAFloor(): void
    {
        $rule = new SlowBlockRule();

        // 50% of the request, but only 5 ms of it.
        $this->assertSame([], $rule->apply($this->profile(
            ['blocks' => ['payload' => ['items' => [['name' => 'x', 'own_ms' => 5.0]]]]],
            10.0
        )), 'Half of a fast request is still fast.');

        $findings = $rule->apply($this->profile(
            ['blocks' => ['payload' => ['items' => [['name' => 'slow.block', 'own_ms' => 400.0]]]]],
            1000.0
        ));

        $this->assertCount(1, $findings);
        $this->assertSame(40.0, $findings[0]->toArray()['evidence']['share_percent']);
    }

    #[Test]
    public function slowObserverReportsTheWorstOne(): void
    {
        $findings = (new SlowObserverRule())->apply($this->profile(
            ['observers' => ['payload' => ['items' => [
                ['name' => 'heavy', 'event' => 'e', 'count' => 1, 'duration_ms' => 300.0],
            ]]]],
            1000.0
        ));

        $this->assertCount(1, $findings);
        $this->assertStringContainsString('heavy', $findings[0]->toArray()['why']);
    }

    #[Test]
    public function truncationIsReported(): void
    {
        $findings = (new TruncatedCollectorRule())->apply($this->profile([
            'queries' => ['label' => 'Queries', 'summary' => [
                'truncated' => true, 'dropped_count' => 120, 'count' => 620,
            ]],
        ]));

        $this->assertCount(1, $findings);
        $this->assertStringContainsString('120', $findings[0]->toArray()['message']);
    }

    #[Test]
    public function anNPlusOneIsReportedOnceNotTwice(): void
    {
        $items = [];

        for ($i = 1; $i <= 5; $i++) {
            $items[] = [
                'sql' => 'SELECT * FROM product WHERE id = ?',
                'bindings' => [$i],
                'duration_ms' => 1.0,
                'callsite' => [['file' => 'Loader.php', 'line' => 10, 'call' => 'x()']],
            ];
        }

        $findings = (new RepeatedQueryRule(new QueryAnalyzer()))->apply(
            $this->profile(['queries' => ['payload' => ['items' => $items]]])
        );

        $ids = array_map(static fn ($finding): string => $finding->toArray()['id'], $findings);

        $this->assertSame(['query.n_plus_one'], $ids, 'One cause must produce one finding.');
    }

    #[Test]
    public function coreThemeRegistrationIsInfoAndARealNPlusOneStillWarns(): void
    {
        $items = [];
        $registration = [
            'file' => 'vendor/magento/module-theme/Model/Theme/Plugin/Registration.php',
            'line' => 116,
            'call' => 'Magento\Theme\Model\Theme\Plugin\Registration::updateThemeData()',
        ];

        for ($i = 1; $i <= 5; $i++) {
            $items[] = [
                'sql' => 'UPDATE `theme` SET `theme_title` = ? WHERE (theme_id=?)',
                'bindings' => ['Theme', $i],
                'duration_ms' => 0.2,
                'callsite' => [$registration],
            ];
            $items[] = [
                'sql' => 'BEGIN',
                'bindings' => [],
                'duration_ms' => 0.1,
                'callsite' => [
                    ['file' => 'Model/ResourceModel/Theme.php', 'line' => 3, 'call' => 'y()'],
                    $registration,
                ],
            ];
            $items[] = [
                'sql' => 'SELECT * FROM product WHERE id = ?',
                'bindings' => [$i],
                'duration_ms' => 1.0,
                'callsite' => [['file' => 'Loader.php', 'line' => 10, 'call' => 'x()']],
            ];
        }

        $findings = (new RepeatedQueryRule(new QueryAnalyzer()))->apply(
            $this->profile(['queries' => ['payload' => ['items' => $items]]])
        );

        $byId = [];

        foreach ($findings as $finding) {
            $byId[$finding->toArray()['id']] = $finding->toArray();
        }

        $this->assertSame(['query.known_source', 'query.n_plus_one'], array_keys($byId));
        $this->assertSame('info', $byId['query.known_source']['severity']);
        $this->assertStringContainsString('production', $byId['query.known_source']['why']);
        $this->assertSame(2, $byId['query.known_source']['evidence']['group_count'], 'UPDATE and BEGIN');
        $this->assertSame('warning', $byId['query.n_plus_one']['severity']);
        $this->assertStringContainsString('product', $byId['query.n_plus_one']['evidence']['sql']);
    }

    #[Test]
    public function blockCacheLockPairsAreNeitherNPlusOneNorRepeated(): void
    {
        $items = [];
        $callsite = [['file' => 'Logger/LoggerProxy.php', 'line' => 184, 'call' => 'proxy()']];

        for ($i = 1; $i <= 20; $i++) {
            $items[] = [
                'sql' => 'SELECT GET_LOCK(?, ?)',
                'bindings' => ['lock_' . $i, 10],
                'duration_ms' => 0.1,
                'callsite' => $callsite,
            ];
            $items[] = [
                'sql' => 'SELECT RELEASE_LOCK(?)',
                'bindings' => ['lock_' . $i],
                'duration_ms' => 0.1,
                'callsite' => $callsite,
            ];
        }

        $findings = (new RepeatedQueryRule(new QueryAnalyzer()))->apply(
            $this->profile(['queries' => ['payload' => ['items' => $items]]])
        );

        $this->assertSame([], $findings);
    }

    #[Test]
    public function aRealRepeatedSelectIsStillFlaggedBesideLockPairs(): void
    {
        $items = [];
        $callsite = [['file' => 'Loader.php', 'line' => 10, 'call' => 'x()']];

        for ($i = 1; $i <= 4; $i++) {
            $items[] = ['sql' => 'SELECT GET_LOCK(?, ?)', 'bindings' => ['l' . $i, 10], 'duration_ms' => 0.1, 'callsite' => $callsite];
            $items[] = ['sql' => 'SELECT * FROM product WHERE id = ?', 'bindings' => [$i], 'duration_ms' => 1.0, 'callsite' => $callsite];
        }

        $findings = (new RepeatedQueryRule(new QueryAnalyzer()))->apply(
            $this->profile(['queries' => ['payload' => ['items' => $items]]])
        );

        $this->assertCount(1, $findings);
        $this->assertStringContainsString('product', $findings[0]->toArray()['evidence']['sql']);
    }

    #[Test]
    public function aKnownSourceBelowTheRepeatThresholdSaysNothing(): void
    {
        $items = [[
            'sql' => 'BEGIN',
            'bindings' => [],
            'duration_ms' => 0.1,
            'callsite' => [['file' => 'R.php', 'line' => 1, 'call' => 'Magento\Theme\Model\Theme\Plugin\Registration::beforeExecute()']],
        ]];

        $findings = (new RepeatedQueryRule(new QueryAnalyzer()))->apply(
            $this->profile(['queries' => ['payload' => ['items' => $items]]])
        );

        $this->assertSame([], $findings);
    }

    #[Test]
    public function repeatedQueriesFromManyPlacesAreOneFindingNotMany(): void
    {
        // A different query each time, each run from two call sites, so none of them is a
        // loop. "Queries are repeating" is one thing to go and look at, and a list of near
        // identical findings would push everything else off the page.
        $items = [];

        for ($shape = 1; $shape <= 4; $shape++) {
            for ($run = 1; $run <= 3; $run++) {
                $items[] = [
                    'sql' => sprintf('SELECT * FROM t%d WHERE id = ?', $shape),
                    'bindings' => [$run],
                    'duration_ms' => 0.5,
                    'callsite' => [['file' => 'Caller' . ($run % 2) . '.php', 'line' => 10, 'call' => 'x()']],
                ];
            }
        }

        $findings = (new RepeatedQueryRule(new QueryAnalyzer()))->apply(
            $this->profile(['queries' => ['payload' => ['items' => $items]]])
        );

        $this->assertCount(1, $findings);

        $finding = $findings[0]->toArray();

        $this->assertSame('query.repeated', $finding['id']);
        $this->assertSame('info', $finding['severity']);
        $this->assertStringContainsString('4 queries', $finding['message']);
        $this->assertStringContainsString('8 executions', $finding['message'], 'three runs each is two extra');
    }

    #[Test]
    public function slowQueriesAreCountedAndTheSlowestIsNamed(): void
    {
        $findings = (new SlowQueryRule())->apply($this->profile(['queries' => [
            'summary' => ['slow_count' => 2, 'slow_threshold_ms' => 100],
            'payload' => ['items' => [
                ['slow' => true, 'duration_ms' => 140.0, 'callsite' => [['file' => 'A.php', 'line' => 5]]],
                ['slow' => true, 'duration_ms' => 260.4, 'callsite' => [['file' => 'B.php', 'line' => 9]]],
                ['slow' => false, 'duration_ms' => 900.0, 'callsite' => [['file' => 'C.php', 'line' => 1]]],
            ]],
        ]]));

        $this->assertCount(1, $findings);

        $finding = $findings[0]->toArray();

        $this->assertStringContainsString('2 queries', $finding['message']);
        $this->assertStringContainsString('260.4', $finding['why']);
        $this->assertSame('B.php:9', $finding['location'], 'a fast query is not the slowest one');
    }

    #[Test]
    public function slowQueriesStayQuietWhenNoneWereSlow(): void
    {
        $this->assertSame([], (new SlowQueryRule())->apply(
            $this->profile(['queries' => ['summary' => ['slow_count' => 0]]])
        ));
    }

    #[Test]
    public function aSlowRequestIsJudgedAgainstTheConfiguredThreshold(): void
    {
        $rule = new SlowRequestRule($this->threshold(1000.0));

        $this->assertSame([], $rule->apply($this->profile([], 999.0)), 'under the threshold');

        $findings = $rule->apply($this->profile([], 3287.0));

        $this->assertCount(1, $findings);
        $this->assertStringContainsString('3287', $findings[0]->toArray()['message']);
        $this->assertStringContainsString('1000', $findings[0]->toArray()['why']);
    }

    #[Test]
    public function aLoweredThresholdMovesTheLine(): void
    {
        // The threshold is configuration, so a rule reading it wrongly fires on every
        // request or on none, which is a quiet loss of the feature rather than a crash.
        $this->assertCount(1, (new SlowRequestRule($this->threshold(500.0)))->apply(
            $this->profile([], 600.0)
        ));
    }

    #[Test]
    public function aSlowRequestPointsAtTheSectionThatTookTheMostTime(): void
    {
        $finding = (new SlowRequestRule($this->threshold(1000.0)))->apply($this->profile([
            'queries' => ['summary' => ['duration_ms' => 640.0]],
            'blocks' => ['summary' => ['duration_ms' => 210.0]],
            'observers' => ['summary' => ['duration_ms' => 35.0]],
        ], 1200.0))[0]->toArray();

        $this->assertSame('queries', $finding['action']['section']);
        $this->assertSame('Review queries', $finding['action']['label']);
    }

    #[Test]
    public function aSlowCacheHitPointsAtThePageCacheNotAtEmptyBlocks(): void
    {
        // A full page cache hit runs no block, query or observer, so "Review blocks"
        // opened an empty list under a "No clear problem found" banner.
        $finding = (new SlowRequestRule($this->threshold(1000.0)))->apply($this->profile([
            'pagecache' => ['summary' => ['served_from_cache' => true, 'status' => 'hit']],
        ], 1094.0))[0]->toArray();

        $this->assertSame('pagecache', $finding['action']['section']);
        $this->assertStringContainsString('full page cache answered', $finding['why']);
    }

    #[Test]
    public function aSlowRequestWithNothingMeasuredOffersNoButton(): void
    {
        $finding = (new SlowRequestRule($this->threshold(1000.0)))->apply($this->profile([], 1500.0))[0]->toArray();

        $this->assertNull($finding['action']);
    }

    #[Test]
    public function aProductPageThatWasNotCachedIsAWarningNamingTheReason(): void
    {
        $findings = (new PageNotCachedRule())->apply($this->profile(['pagecache' => ['summary' => [
            'status' => 'not_cached',
            'page_type' => 'product',
            'count' => 1,
            'reasons' => [[
                'code' => 'layout',
                'text' => '1 block marked cacheable="false" made the whole layout uncacheable.',
            ]],
        ]]]));

        $this->assertCount(1, $findings);
        $finding = $findings[0]->toArray();
        $this->assertSame('warning', $finding['severity']);
        $this->assertStringContainsString('cacheable="false"', $finding['why']);
        $this->assertSame('pagecache', $finding['action']['section']);
    }

    #[Test]
    public function aCacheSwitchedOffOnPurposeIsOnlyMentioned(): void
    {
        $findings = (new PageNotCachedRule())->apply($this->profile(['pagecache' => ['summary' => [
            'status' => 'not_cached',
            'page_type' => 'category',
            'reasons' => [['code' => 'disabled', 'text' => 'The full_page cache type is disabled.']],
        ]]]));

        $this->assertSame('info', $findings[0]->toArray()['severity']);
    }

    #[Test]
    public function pagesNobodyExpectsCachedAndPagesThatWereProduceNothing(): void
    {
        $rule = new PageNotCachedRule();
        $reasons = [['code' => 'not_public', 'text' => 'private']];

        $this->assertSame([], $rule->apply($this->profile(['pagecache' => ['summary' => [
            'status' => 'not_cached', 'page_type' => null, 'reasons' => $reasons,
        ]]])), 'a cart that is not cached is Magento working as intended');
        $this->assertSame([], $rule->apply($this->profile(['pagecache' => ['summary' => [
            'status' => 'hit', 'page_type' => 'product', 'reasons' => [],
        ]]])));
        $this->assertSame([], $rule->apply($this->profile([])), 'a store that does not collect the section');
    }

    private function threshold(float $ms): Config
    {
        $config = $this->createStub(Config::class);
        $config->method('slowRequestMs')->willReturn($ms);

        return $config;
    }

    /**
     * @param array<string, mixed> $sections
     * @return array<string, mixed>
     */
    private function profile(array $sections, float $durationMs = 100.0): array
    {
        return ['metrics' => ['duration_ms' => $durationMs], 'sections' => $sections];
    }
}
