<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

/**
 * Reports on own time, not total. A container's total time is the page's time, which
 * would flag the layout root on every request and mean nothing.
 */
class SlowBlockRule implements RuleInterface
{
    public function __construct(
        private readonly float $shareThreshold = 20.0,
        private readonly float $minimumMs = 25.0
    ) {
    }

    public function apply(array $profile): array
    {
        $items = $profile['sections']['blocks']['payload']['items'] ?? [];
        $requestMs = (float) ($profile['metrics']['duration_ms'] ?? 0);

        if (!is_array($items) || $items === [] || $requestMs <= 0) {
            return [];
        }

        $worst = $items[0];
        $ownMs = (float) ($worst['own_ms'] ?? 0);

        if ($ownMs < $this->minimumMs) {
            return [];
        }

        $share = round($ownMs / $requestMs * 100, 1);

        if ($share < $this->shareThreshold) {
            return [];
        }

        return [
            new Finding(
                'block.slow',
                Finding::SEVERITY_WARNING,
                'blocks',
                sprintf('One block used %s%% of the request.', $share),
                sprintf(
                    '%s spent %s ms in its own template, excluding anything it renders inside it.',
                    $worst['name'] ?? 'A block',
                    round($ownMs, 1)
                ),
                'Read the template and the block class. Look for work in a loop, an '
                    . 'uncached collection load, or a call that belongs in a view model.',
                [
                    'name' => $worst['name'] ?? null,
                    'template' => $worst['template'] ?? null,
                    'own_ms' => $ownMs,
                    'share_percent' => $share,
                ],
                ['label' => 'Review blocks', 'section' => 'blocks'],
                $worst['template'] ?? ($worst['class'] ?? null)
            ),
        ];
    }
}
