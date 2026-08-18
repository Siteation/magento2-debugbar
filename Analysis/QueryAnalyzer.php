<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis;

/**
 * Groups queries by shape so repetition becomes visible.
 *
 * Two queries are the same shape when their normalised SQL and connection match. Literal
 * values are already stripped at record time, so "the same query with different ids"
 * collapses to one group, which is exactly what an N+1 looks like.
 */
class QueryAnalyzer
{
    private const MIN_N_PLUS_ONE_EXECUTIONS = 3;

    /**
     * @param list<array<string, mixed>> $queries
     * @return array{groups: list<array<string, mixed>>, total_ms: float}
     */
    public function analyze(array $queries): array
    {
        $groups = [];
        $totalMs = 0.0;

        foreach ($queries as $query) {
            $sql = (string) ($query['sql'] ?? '');
            $normalized = $this->normalize($sql);
            $fingerprint = $this->fingerprint($sql);
            $durationMs = (float) ($query['duration_ms'] ?? 0);
            $totalMs += $durationMs;

            if (!isset($groups[$fingerprint])) {
                $groups[$fingerprint] = [
                    'fingerprint' => $fingerprint,
                    'sql' => $normalized,
                    'count' => 0,
                    'duration_ms' => 0.0,
                    'bindings' => [],
                    'call_sites' => [],
                ];
            }

            $groups[$fingerprint]['count']++;
            $groups[$fingerprint]['duration_ms'] = round(
                $groups[$fingerprint]['duration_ms'] + $durationMs,
                3
            );
            $groups[$fingerprint]['bindings'][] = $this->bindingSignature($query['bindings'] ?? []);
            $groups[$fingerprint]['call_sites'][] = $this->callSiteKey($query['callsite'] ?? []);
        }

        $result = [];

        foreach ($groups as $group) {
            $result[] = $this->finish($group, $queries);
        }

        usort($result, static fn (array $left, array $right): int
            => $right['count'] <=> $left['count'] ?: $right['duration_ms'] <=> $left['duration_ms']);

        return ['groups' => $result, 'total_ms' => round($totalMs, 2)];
    }

    /**
     * @param array<string, mixed> $group
     * @param list<array<string, mixed>> $queries
     * @return array<string, mixed>
     */
    private function finish(array $group, array $queries): array
    {
        $bindings = $group['bindings'];
        $callSites = array_filter($group['call_sites']);

        $bindingsVary = count(array_unique($bindings)) > 1;
        $uniqueCallSites = array_unique($callSites);
        $sharedCallSite = count($callSites) === $group['count'] && count($uniqueCallSites) === 1;

        unset($group['bindings'], $group['call_sites']);

        return [
            ...$group,
            'extra_executions' => $group['count'] - 1,
            'bindings_vary' => $bindingsVary,
            'shared_call_site' => $sharedCallSite ? reset($uniqueCallSites) : null,
            // Deliberately conservative. The same SQL from many call sites is not an N+1,
            // and the same SQL with identical bindings is a caching problem instead.
            // Chunked and paginated reads still trip this, which is why it says "likely".
            'likely_n_plus_one' => $group['count'] >= self::MIN_N_PLUS_ONE_EXECUTIONS
                && $bindingsVary
                && $sharedCallSite,
        ];
    }

    /**
     * What makes two queries the same one. Public because more than one thing needs to
     * agree on it, and agreeing by having the same code twice is how they stop agreeing.
     */
    public function fingerprint(string $sql): string
    {
        return substr(hash('sha256', $this->normalize($sql)), 0, 16);
    }

    private function normalize(string $sql): string
    {
        return trim((string) preg_replace('/\s+/', ' ', $sql));
    }

    /**
     * @param mixed $bindings
     */
    private function bindingSignature($bindings): string
    {
        return json_encode($bindings, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: '[]';
    }

    /**
     * @param mixed $callSite
     */
    private function callSiteKey($callSite): ?string
    {
        if (!is_array($callSite) || $callSite === []) {
            return null;
        }

        $first = reset($callSite);

        if (!is_array($first) || !isset($first['file'], $first['line'])) {
            return null;
        }

        return $first['file'] . ':' . $first['line'];
    }
}
