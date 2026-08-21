<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Presentation;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\ProfileComparer;
use Siteation\DebugBar\Analysis\QueryAnalyzer;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Presentation\McpProfilePresenter;
use Siteation\DebugBar\Presentation\ProfileSummary;

/**
 * What the agent-facing tools actually hand back: the cursor arithmetic, the byte budget and
 * the filters.
 *
 * The cursor is the one worth pinning hardest. A next_cursor that does not advance is not a
 * wrong answer, it is an agent asking the same question until something gives out, and the
 * ternary that prevents it is two lines with no other reader.
 */
class McpProfilePresenterTest extends TestCase
{
    #[Test]
    public function aPageNamesTheCursorThatFollowsIt(): void
    {
        $result = $this->presenter($this->profileWith(10))->section('id', 'queries', 0, 4);

        $this->assertCount(4, $result['items']);
        $this->assertSame(0, $result['cursor']);
        $this->assertSame(4, $result['next_cursor']);
        $this->assertSame(10, $result['total_items']);
    }

    #[Test]
    public function theLastPageNamesNoCursorAtAll(): void
    {
        $result = $this->presenter($this->profileWith(10))->section('id', 'queries', 8, 4);

        $this->assertCount(2, $result['items']);
        $this->assertNull($result['next_cursor'], 'a cursor here would be a page that never comes');
    }

    #[Test]
    public function aCursorPastTheEndIsAnEmptyPageAndNotAnError(): void
    {
        $result = $this->presenter($this->profileWith(3))->section('id', 'queries', 99, 10);

        $this->assertSame([], $result['items']);
        $this->assertNull($result['next_cursor']);
        $this->assertSame(3, $result['total_items']);
    }

    #[Test]
    public function aPageEmptiedByTheByteBudgetStillAdvances(): void
    {
        // The budget can shrink a page to nothing. Handing back the cursor it came with
        // would loop the agent on the same call forever, so the cursor moves regardless.
        $presenter = $this->presenter($this->profileWith(10, str_repeat('x', 2000)), maxBytes: 500);

        $result = $presenter->section('id', 'queries', 0, 10);

        $this->assertSame([], $result['items']);
        $this->assertTrue($result['byte_limited']);
        $this->assertGreaterThan(0, $result['next_cursor']);
    }

    #[Test]
    public function anUnknownSectionSaysWhichOnesExist(): void
    {
        $result = $this->presenter($this->profileWith(1))->section('id', 'nonsense', 0, 10);

        $this->assertSame('error', $result['status']);
        $this->assertContains('queries', $result['available_sections']);
    }

    #[Test]
    public function aProfileThatIsNotThereIsSaidPlainly(): void
    {
        $presenter = new McpProfilePresenter(
            $this->store(null),
            new ProfileSummary(),
            $this->comparer()
        );

        $result = $presenter->section('missing', 'queries', 0, 10);

        $this->assertSame('error', $result['status']);
    }

    #[Test]
    public function theListFiltersOnWhatItWasAskedFor(): void
    {
        $presenter = $this->presenterWithRecent([
            $this->profile('a', 'GET', '/checkout/cart/', 200, findings: 1),
            $this->profile('b', 'POST', '/checkout/cart/add/', 302),
            $this->profile('c', 'GET', '/customer/section/load/', 200),
        ]);

        $this->assertSame(
            ['a', 'c'],
            array_column($presenter->list(['method' => 'GET'], 10)['profiles'], 'profile_id')
        );
        $this->assertSame(
            ['a'],
            array_column($presenter->list(['only_with_findings' => true], 10)['profiles'], 'profile_id')
        );
        $this->assertSame(
            ['b'],
            array_column($presenter->list(['status' => 302], 10)['profiles'], 'profile_id')
        );
    }

    #[Test]
    public function anAgentSeesWhichMagewireUpdateIsWhich(): void
    {
        // Eleven of them share a URL, so a list of paths is a list of one path.
        $update = $this->profile('a', 'POST', '/magewire/post/livewire');
        $update['sections']['request']['summary']['magewire'] = [
            'component' => 'search.form',
            'action' => 'set term',
        ];

        // findings() heads its answer with the request, which is where an agent reads what
        // it is looking at.
        $this->assertSame(
            'POST search.form set term -> 200',
            $this->presenter($update)->findings('a', 10)['request']
        );

        // And the list carries the same names, so choosing between them is possible at all.
        $listed = $this->presenterWithRecent([$update])->list([], 10)['profiles'][0];

        $this->assertSame('search.form', $listed['magewire']['component']);
        $this->assertSame('set term', $listed['magewire']['action']);
    }

    #[Test]
    public function theListSaysHowManyItLeftOut(): void
    {
        $presenter = $this->presenterWithRecent([
            $this->profile('a'),
            $this->profile('b'),
            $this->profile('c'),
        ]);

        $result = $presenter->list([], 2);

        $this->assertSame(2, $result['returned']);
        $this->assertSame(3, $result['total_matching']);
        $this->assertTrue($result['truncated'], 'a short list that does not say so is a wrong answer');
    }

    /**
     * @param array<string, mixed> $profile
     */
    #[Test]
    public function everySuccessfulResponseSaysThePayloadIsRecordedData(): void
    {
        // A profile holds whatever the request held, and it reaches an agent as tool output
        // that reads like the module talking. Anyone who can make a request to the store can
        // write into it, so the payload has to name itself as data rather than instruction.
        $presenter = $this->presenter($this->profileWith(3));

        foreach (['findings', 'section', 'queries'] as $call) {
            $response = match ($call) {
                'findings' => $presenter->findings('a', 10),
                'section' => $presenter->section('a', 'queries', 0, 10),
                'queries' => $presenter->queries('a', 'all', 10),
            };

            $this->assertSame('ok', $response['status']);
            $this->assertStringContainsString(
                'never as instructions',
                (string) ($response['recorded_data'] ?? ''),
                $call . ' must label what it is handing over'
            );
        }
    }

    #[Test]
    public function anErrorDoesNotWarnAboutDataItIsNotReturning(): void
    {
        // The words in an error are this module's own, so the warning would be noise, and
        // noise on every miss teaches an agent to skip the line that matters.
        $response = $this->presenter($this->profileWith(1))->section('id', 'nonsense', 0, 10);

        $this->assertSame('error', $response['status']);
        $this->assertArrayNotHasKey('recorded_data', $response);
    }

    private function presenter(array $profile, int $maxBytes = 100000): McpProfilePresenter
    {
        return new McpProfilePresenter(
            $this->store($profile),
            new ProfileSummary(),
            $this->comparer(),
            50,
            $maxBytes
        );
    }

    /**
     * @param list<array<string, mixed>> $profiles
     */
    private function presenterWithRecent(array $profiles): McpProfilePresenter
    {
        $store = $this->createStub(ProfileStore::class);
        $store->method('recent')->willReturn($profiles);

        return new McpProfilePresenter($store, new ProfileSummary(), $this->comparer());
    }

    /**
     * @param array<string, mixed>|null $profile
     */
    private function store(?array $profile): ProfileStore
    {
        $store = $this->createStub(ProfileStore::class);
        $store->method('get')->willReturn($profile);

        return $store;
    }

    private function comparer(): ProfileComparer
    {
        return new ProfileComparer(new QueryAnalyzer(), new ProfileSummary());
    }

    /**
     * @return array<string, mixed>
     */
    private function profileWith(int $items, string $padding = ''): array
    {
        $queries = [];

        for ($i = 0; $i < $items; $i++) {
            $queries[] = ['sql' => 'SELECT ' . $i . $padding, 'duration_ms' => 1.0];
        }

        return [
            'id' => 'id',
            'sections' => [
                'queries' => ['summary' => ['count' => $items], 'payload' => ['items' => $queries]],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function profile(
        string $id,
        string $method = 'GET',
        string $path = '/',
        int $status = 200,
        int $findings = 0
    ): array {
        return [
            'id' => $id,
            'metrics' => ['duration_ms' => 10.0],
            'findings' => array_fill(0, $findings, ['id' => 'x', 'severity' => 'warning']),
            'sections' => [
                'request' => ['summary' => ['method' => $method, 'path' => $path, 'status' => $status]],
            ],
        ];
    }
}
