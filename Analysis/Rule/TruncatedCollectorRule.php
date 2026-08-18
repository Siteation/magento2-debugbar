<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

/**
 * Says out loud when the bar is showing less than it saw.
 *
 * A collector limit is not an application problem, but a developer reading a truncated
 * list without knowing it is truncated will draw the wrong conclusion from it.
 */
class TruncatedCollectorRule implements RuleInterface
{
    public function apply(array $profile): array
    {
        $truncated = [];

        foreach ((array) ($profile['sections'] ?? []) as $key => $section) {
            if (($section['summary']['truncated'] ?? false) === true) {
                $truncated[$key] = [
                    'label' => $section['label'] ?? $key,
                    'dropped' => (int) ($section['summary']['dropped_count'] ?? 0),
                    'total' => (int) ($section['summary']['count'] ?? 0),
                ];
            }
        }

        if ($truncated === []) {
            return [];
        }

        $names = implode(', ', array_column($truncated, 'label'));
        $dropped = array_sum(array_column($truncated, 'dropped'));

        return [
            new Finding(
                'collector.truncated',
                Finding::SEVERITY_INFO,
                'overview',
                sprintf('%d records were collected but not kept.', $dropped),
                sprintf('%s reached the retention limit for one profile.', $names),
                'Totals and timings are still complete. Only the listed items are cut, so '
                    . 'read the counts rather than the list length.',
                ['sections' => $truncated],
                ['label' => 'Review overview', 'section' => 'overview']
            ),
        ];
    }
}
