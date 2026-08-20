<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Presentation;

use Siteation\DebugBar\Analysis\ProfileComparer;
use Siteation\DebugBar\Model\ProfileStore;

/**
 * Shapes stored profiles for a coding agent.
 *
 * Every response is bounded twice, by item count and by byte budget, because an agent
 * paying for context cannot afford a section that happens to hold six hundred queries.
 * When a response is trimmed it says so, so the agent knows to page rather than assume it
 * has seen everything.
 */
class McpProfilePresenter
{
    public const RESPONSE_VERSION = 1;

    /** @var list<string> */
    private const SECTIONS = [
        'request', 'queries', 'events', 'observers', 'blocks', 'cache', 'interception',
        'timeline',
    ];

    public function __construct(
        private readonly ProfileStore $store,
        private readonly ProfileSummary $summary,
        private readonly ProfileComparer $comparer,
        private readonly int $maxItems = 50,
        private readonly int $maxBytes = 100000
    ) {
    }

    public function maxItems(): int
    {
        return $this->maxItems;
    }

    /**
     * @param array{method?: string|null, path?: string|null, status?: int|null, only_with_findings?: bool} $filters
     * @return array<string, mixed>
     */
    public function list(array $filters, int $limit): array
    {
        $summaries = [];

        foreach ($this->store->recent() as $profile) {
            $summary = $this->summary->for($profile);

            if ($this->matches($summary, $filters)) {
                $summaries[] = $summary;
            }
        }

        $total = count($summaries);
        $page = array_slice($summaries, 0, $this->bound($limit));

        return $this->fit(
            fn (array $items): array => $this->envelope([
                'profiles' => $items,
                'returned' => count($items),
                'total_matching' => $total,
                'truncated' => count($items) < $total,
            ]),
            $page
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function section(string $profileId, string $section, int $cursor, int $limit): array
    {
        $profile = $this->store->get($profileId);

        if ($profile === null) {
            return $this->notFound($profileId);
        }

        if (!in_array($section, self::SECTIONS, true) || !isset($profile['sections'][$section])) {
            return $this->envelope([
                'error' => sprintf('Unknown section "%s".', $section),
                'available_sections' => array_keys($profile['sections'] ?? []),
            ], 'error');
        }

        $data = $profile['sections'][$section];
        $items = $data['payload']['items'] ?? [];
        $items = is_array($items) ? $items : [];
        $total = count($items);
        $page = array_slice($items, max(0, $cursor), $this->bound($limit));

        return $this->fit(
            fn (array $shown): array => $this->envelope([
                'profile_id' => $profileId,
                'section' => $section,
                'summary' => $data['summary'] ?? [],
                'items' => $shown,
                'cursor' => $cursor,
                // Always past the cursor it was given. A page that the byte budget emptied
                // would otherwise hand back the cursor it came with, and an agent paging on
                // it would ask the same question until something gave out.
                'next_cursor' => $cursor + max(1, count($shown)) < $total
                    ? $cursor + max(1, count($shown))
                    : null,
                'total_items' => $total,
            ]),
            $page
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function queries(string $profileId, string $filter, int $limit): array
    {
        $profile = $this->store->get($profileId);

        if ($profile === null) {
            return $this->notFound($profileId);
        }

        $items = $profile['sections']['queries']['payload']['items'] ?? [];
        $items = is_array($items) ? $items : [];

        if ($filter === 'slow') {
            $items = array_values(array_filter($items, static fn (array $q): bool => (bool) ($q['slow'] ?? false)));
        }

        usort($items, static fn (array $a, array $b): int
            => ($b['duration_ms'] ?? 0) <=> ($a['duration_ms'] ?? 0));

        $total = count($items);
        $page = array_slice($items, 0, $this->bound($limit));

        return $this->fit(
            fn (array $shown): array => $this->envelope([
                'profile_id' => $profileId,
                'filter' => $filter,
                'summary' => $profile['sections']['queries']['summary'] ?? [],
                'queries' => $shown,
                'returned' => count($shown),
                'total_matching' => $total,
                'sorted_by' => 'duration_ms desc',
            ]),
            $page
        );
    }

    /**
     * What changed between two requests. The comparison itself is bounded already, so this
     * only has to say which profiles it read.
     *
     * @return array<string, mixed>
     */
    public function compare(string $baselineId, string $subjectId): array
    {
        $baseline = $this->store->get($baselineId);
        $subject = $this->store->get($subjectId);

        if ($baseline === null) {
            return $this->notFound($baselineId);
        }

        if ($subject === null) {
            return $this->notFound($subjectId);
        }

        return $this->envelope($this->comparer->compare($baseline, $subject));
    }

    /**
     * @return array<string, mixed>
     */
    public function findings(string $profileId, int $limit): array
    {
        $profile = $this->store->get($profileId);

        if ($profile === null) {
            return $this->notFound($profileId);
        }

        $findings = is_array($profile['findings'] ?? null) ? $profile['findings'] : [];
        $total = count($findings);
        $page = array_slice($findings, 0, $this->bound($limit));

        return $this->fit(
            fn (array $shown): array => $this->envelope([
                'profile_id' => $profileId,
                'request' => $this->requestLine($profile),
                'findings' => $shown,
                'returned' => count($shown),
                'total' => $total,
            ]),
            $page
        );
    }

    /**
     * Drop items until the encoded response fits the byte budget.
     *
     * @param callable(list<mixed>): array<string, mixed> $build
     * @param list<mixed> $items
     * @return array<string, mixed>
     */
    private function fit(callable $build, array $items): array
    {
        $response = $build($items);

        while ($items !== [] && strlen((string) json_encode($response)) > $this->maxBytes) {
            array_pop($items);
            $response = $build($items);
            $response['byte_limited'] = true;
        }

        return $response;
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function requestLine(array $profile): string
    {
        $request = $profile['sections']['request']['summary'] ?? [];
        $magewire = $request['magewire'] ?? null;

        // Named rather than pathed where the path is shared. An agent picking a profile out
        // of a list cannot tell eleven Magewire updates apart by URL, because they have one.
        $what = is_array($magewire) && ($magewire['component'] ?? '') !== ''
            ? trim(sprintf('%s %s', $magewire['component'], $magewire['action'] ?? ''))
            : ($request['path'] ?? '?');

        return trim(sprintf(
            '%s %s -> %s',
            $request['method'] ?? '?',
            $what,
            (string) ($request['status'] ?? '?')
        ));
    }

    /**
     * @param array<string, mixed> $summary
     * @param array<string, mixed> $filters
     */
    private function matches(array $summary, array $filters): bool
    {
        if (!empty($filters['method'])
            && strcasecmp((string) $summary['method'], (string) $filters['method']) !== 0
        ) {
            return false;
        }

        if (!empty($filters['path'])
            && !str_contains((string) $summary['path'], (string) $filters['path'])
        ) {
            return false;
        }

        if (!empty($filters['status']) && (int) $summary['status'] !== (int) $filters['status']) {
            return false;
        }

        if (!empty($filters['only_with_findings']) && (int) $summary['finding_count'] === 0) {
            return false;
        }

        return true;
    }

    private function bound(int $limit): int
    {
        return max(1, min($limit, $this->maxItems));
    }

    /**
     * @return array<string, mixed>
     */
    private function notFound(string $profileId): array
    {
        return $this->envelope([
            'error' => sprintf('No profile "%s". It may have expired or been pruned.', $profileId),
            'hint' => 'Call list_debug_profiles to see what is still stored.',
        ], 'error');
    }

    /**
     * @param array<string, mixed> $payload
     * @return array<string, mixed>
     */
    private function envelope(array $payload, string $status = 'ok'): array
    {
        return ['response_version' => self::RESPONSE_VERSION, 'status' => $status, ...$payload];
    }
}
