<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

class SlowObserverRule implements RuleInterface
{
    public function __construct(
        private readonly float $shareThreshold = 10.0,
        private readonly float $minimumMs = 20.0
    ) {
    }

    public function apply(array $profile): array
    {
        $items = $profile['sections']['observers']['payload']['items'] ?? [];
        $requestMs = (float) ($profile['metrics']['duration_ms'] ?? 0);

        if (!is_array($items) || $items === [] || $requestMs <= 0) {
            return [];
        }

        $worst = $items[0];
        $durationMs = (float) ($worst['duration_ms'] ?? 0);

        if ($durationMs < $this->minimumMs) {
            return [];
        }

        $share = round($durationMs / $requestMs * 100, 1);

        if ($share < $this->shareThreshold) {
            return [];
        }

        return [
            new Finding(
                'observer.slow',
                Finding::SEVERITY_WARNING,
                'observers',
                sprintf('One observer used %s%% of the request.', $share),
                sprintf(
                    '%s ran %d time(s) on %s and took %s ms.',
                    $worst['name'] ?? 'An observer',
                    (int) ($worst['count'] ?? 1),
                    $worst['event'] ?? 'an event',
                    round($durationMs, 1)
                ),
                'Check whether the work belongs on this event, and whether it can be '
                    . 'deferred, cached, or moved out of a frequently dispatched event.',
                [
                    'name' => $worst['name'] ?? null,
                    'event' => $worst['event'] ?? null,
                    'instance' => $worst['instance'] ?? null,
                    'duration_ms' => $durationMs,
                    'share_percent' => $share,
                ],
                ['label' => 'Review observers', 'section' => 'observers'],
                $worst['instance'] ?? null
            ),
        ];
    }
}
