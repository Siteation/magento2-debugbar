<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Magento\Framework\App\State;
use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

/**
 * The bar is running on a live site.
 *
 * It is allowed there on tighter terms than in developer mode, and being on at all costs the
 * request a profile and the visitor nothing, so the one thing worth saying every time is
 * that it is on, and what to do when the work is finished.
 */
class ProductionModeRule implements RuleInterface
{
    public function apply(array $profile): array
    {
        if (($profile['sections']['request']['summary']['mode'] ?? null) !== State::MODE_PRODUCTION) {
            return [];
        }

        return [
            new Finding(
                'overview.production_mode',
                Finding::SEVERITY_WARNING,
                'overview',
                'The debug bar is running in production mode.',
                'Every request that presents the key is profiled and stored, and queries and request '
                    . 'data are captured from a live shop.',
                'Set siteation_debugbar/general/enabled to 0 with config:set --lock-env when you are done.',
                ['mode' => State::MODE_PRODUCTION],
                ['label' => 'Open overview', 'section' => 'overview']
            ),
        ];
    }
}
