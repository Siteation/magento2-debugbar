<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

class RequestErrorRule implements RuleInterface
{
    public function apply(array $profile): array
    {
        $request = $profile['sections']['request']['summary'] ?? [];
        $status = (int) ($request['status'] ?? 0);

        if ($status < 400) {
            return [];
        }

        return [
            new Finding(
                'request.error',
                $status >= 500 ? Finding::SEVERITY_ERROR : Finding::SEVERITY_WARNING,
                'request',
                sprintf('The request returned HTTP %d.', $status),
                $status >= 500
                    ? 'The application could not complete the request.'
                    : 'The application refused the request or could not find what it asked for.',
                'Check the controller, the route, and the log for the exception behind it.',
                ['status' => $status, 'action' => $request['action'] ?? null],
                ['label' => 'Inspect request', 'section' => 'overview']
            ),
        ];
    }
}
