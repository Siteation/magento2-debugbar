<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;
use Siteation\DebugBar\Model\Config;

class SlowRequestRule implements RuleInterface
{
    public function __construct(private readonly Config $config)
    {
    }

    public function apply(array $profile): array
    {
        $durationMs = (float) ($profile['metrics']['duration_ms'] ?? 0);
        $threshold = $this->config->slowRequestMs();

        if ($durationMs < $threshold) {
            return [];
        }

        return [
            new Finding(
                'request.slow',
                Finding::SEVERITY_WARNING,
                'overview',
                sprintf('The request took %s ms.', round($durationMs)),
                sprintf('That is above the %s ms threshold, and long enough to feel.', round($threshold)),
                'Compare query, block and observer time to see which of them dominates.',
                ['duration_ms' => $durationMs, 'threshold_ms' => $threshold],
                ['label' => 'Review blocks', 'section' => 'blocks']
            ),
        ];
    }
}
