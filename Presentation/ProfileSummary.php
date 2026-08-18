<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Presentation;

/**
 * One row's worth of a stored profile.
 *
 * Two things list profiles: the MCP server, for an agent, and the bar's history section,
 * for a person. They ask the same question, so they get the same answer from here rather
 * than from two summarizers that drift apart.
 */
class ProfileSummary
{
    /** Worst first, so the first one present wins. */
    private const SEVERITIES = ['error', 'warning', 'info'];

    /**
     * @param array<string, mixed> $profile
     * @return array<string, mixed>
     */
    public function for(array $profile): array
    {
        $request = $profile['sections']['request']['summary'] ?? [];
        $findings = is_array($profile['findings'] ?? null) ? $profile['findings'] : [];

        return [
            'profile_id' => $profile['id'] ?? null,
            'method' => $request['method'] ?? null,
            'path' => $request['path'] ?? null,
            'action' => $request['action'] ?? null,
            'area' => $request['area'] ?? null,
            'status' => $request['status'] ?? null,
            'duration_ms' => $profile['metrics']['duration_ms'] ?? null,
            'query_count' => $profile['sections']['queries']['summary']['count'] ?? 0,
            'finding_count' => count($findings),
            'worst_severity' => $this->worstSeverity($findings),
            'started_at' => $profile['started_at'] ?? null,
        ];
    }

    /**
     * @param list<array<string, mixed>> $findings
     */
    public function worstSeverity(array $findings): ?string
    {
        foreach (self::SEVERITIES as $severity) {
            foreach ($findings as $finding) {
                if (($finding['severity'] ?? null) === $severity) {
                    return $severity;
                }
            }
        }

        return null;
    }
}
