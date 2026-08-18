<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Mcp\Tool;

use Siteation\DebugBar\Api\McpToolInterface;
use Siteation\DebugBar\Presentation\McpProfilePresenter;

class GetFindings implements McpToolInterface
{
    public function __construct(private readonly McpProfilePresenter $profiles)
    {
    }

    public function name(): string
    {
        return 'get_debug_findings';
    }

    public function description(): string
    {
        return 'Return what the debug bar concluded about one request: what is wrong, why '
            . 'it matters, where it came from and what to check next. Read this before any '
            . 'raw section. A finding is a lead, not a verdict.';
    }

    public function inputSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'profile_id' => [
                    'type' => 'string',
                    'description' => 'Profile id, as returned by list_debug_profiles or the '
                        . 'X-Siteation-DebugBar-Profile response header.',
                ],
                'limit' => [
                    'type' => 'integer',
                    'minimum' => 1,
                    'maximum' => $this->profiles->maxItems(),
                    'default' => 10,
                ],
            ],
            'required' => ['profile_id'],
            'additionalProperties' => false,
        ];
    }

    public function call(array $arguments): array
    {
        return $this->profiles->findings(
            (string) ($arguments['profile_id'] ?? ''),
            (int) ($arguments['limit'] ?? 10)
        );
    }
}
