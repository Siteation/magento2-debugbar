<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Analysis\KnownQuerySources;
use Siteation\DebugBar\Analysis\QueryAnalyzer;
use Siteation\DebugBar\Api\RuleInterface;

/**
 * Two findings, never both for the same group: an N+1 is a repeated query, so reporting
 * it twice would describe one cause as two problems.
 */
class RepeatedQueryRule implements RuleInterface
{
    private const MIN_REPEATS = 3;

    private readonly KnownQuerySources $knownSources;

    public function __construct(
        private readonly QueryAnalyzer $analyzer,
        private readonly int $minRepeats = self::MIN_REPEATS,
        ?KnownQuerySources $knownSources = null
    ) {
        $this->knownSources = $knownSources ?? new KnownQuerySources();
    }

    public function apply(array $profile): array
    {
        $items = $profile['sections']['queries']['payload']['items'] ?? [];

        if (!is_array($items) || $items === []) {
            return [];
        }

        $known = [];
        $unknown = [];

        foreach ($items as $item) {
            $source = is_array($item) ? $this->knownSources->match($item['callsite'] ?? null) : null;

            if ($source === null) {
                $unknown[] = $item;
            } else {
                $known[$source][] = $item;
            }
        }

        $findings = $this->knownSourceFindings($known);

        if ($unknown === []) {
            return $findings;
        }

        $groups = $this->analyzer->analyze($unknown)['groups'];
        $nPlusOne = [];
        $repeated = [];

        foreach ($groups as $group) {
            if ($group['count'] < $this->minRepeats) {
                continue;
            }

            if ($group['likely_n_plus_one']) {
                $nPlusOne[] = $group;

                continue;
            }

            $repeated[] = $group;
        }

        foreach (array_slice($nPlusOne, 0, 3) as $group) {
            $findings[] = new Finding(
                'query.n_plus_one',
                Finding::SEVERITY_WARNING,
                'queries',
                sprintf('The same query ran %d times from one place.', $group['count']),
                'Same shape, different values, one call site. That is the signature of a '
                    . 'query inside a loop rather than one query fetching the set.',
                'Load the related records in one query, or add the collection to the parent '
                    . 'load. Chunked and paginated reads look like this too, so confirm before changing anything.',
                [
                    'fingerprint' => $group['fingerprint'],
                    'count' => $group['count'],
                    'extra_executions' => $group['extra_executions'],
                    'duration_ms' => $group['duration_ms'],
                    'sql' => $group['sql'],
                ],
                ['label' => 'Review queries', 'section' => 'queries', 'filter' => 'repeated'],
                $group['shared_call_site']
            );
        }

        // One finding for all of them. Each group is a different query, but "queries are
        // repeating" is one thing to go and look at, and a list of near identical findings
        // would push everything else off the page.
        if ($repeated !== []) {
            $extra = array_sum(array_column($repeated, 'extra_executions'));
            $wasted = round(array_sum(array_column($repeated, 'duration_ms')), 1);

            $findings[] = new Finding(
                'query.repeated',
                Finding::SEVERITY_INFO,
                'queries',
                sprintf(
                    '%d %s ran %d or more times, %d executions above one run each.',
                    count($repeated),
                    count($repeated) === 1 ? 'query' : 'queries',
                    $this->minRepeats,
                    $extra
                ),
                sprintf(
                    'Together they account for %s ms. They come from more than one place '
                        . 'each, so none of them is a simple loop.',
                    $wasted
                ),
                'Check whether the callers can share one lookup, or whether the result is '
                    . 'stable enough to hold for the length of the request.',
                [
                    'group_count' => count($repeated),
                    'extra_executions' => $extra,
                    'duration_ms' => $wasted,
                    'groups' => array_map(
                        static fn (array $group): array => [
                            'sql' => $group['sql'],
                            'count' => $group['count'],
                            'duration_ms' => $group['duration_ms'],
                        ],
                        array_slice($repeated, 0, 5)
                    ),
                ],
                ['label' => 'Review queries', 'section' => 'queries', 'filter' => 'repeated']
            );
        }

        return $findings;
    }

    /**
     * One info finding per known source that repeats, so the reader still sees where the
     * queries went without being told to fix code they do not own.
     *
     * @param array<string, list<mixed>> $known
     * @return list<Finding>
     */
    private function knownSourceFindings(array $known): array
    {
        $findings = [];

        foreach ($known as $key => $items) {
            $source = $this->knownSources->get($key);
            $repeated = array_values(array_filter(
                $this->analyzer->analyze($items)['groups'],
                fn (array $group): bool => $group['count'] >= $this->minRepeats
            ));

            if ($source === null || $repeated === []) {
                continue;
            }

            $findings[] = new Finding(
                'query.known_source',
                Finding::SEVERITY_INFO,
                'queries',
                sprintf(
                    '%s repeated %d %s, %d executions in all.',
                    $source['label'],
                    count($repeated),
                    count($repeated) === 1 ? 'query' : 'queries',
                    array_sum(array_column($repeated, 'count'))
                ),
                $source['explanation'],
                'Nothing to change. Measure in production mode to see the request without it.',
                [
                    'source' => $key,
                    'group_count' => count($repeated),
                    'duration_ms' => round(array_sum(array_column($repeated, 'duration_ms')), 1),
                    'groups' => array_map(
                        static fn (array $group): array => [
                            'sql' => $group['sql'],
                            'count' => $group['count'],
                            'duration_ms' => $group['duration_ms'],
                        ],
                        array_slice($repeated, 0, 5)
                    ),
                ],
                ['label' => 'Review queries', 'section' => 'queries', 'filter' => 'repeated']
            );
        }

        return $findings;
    }
}
