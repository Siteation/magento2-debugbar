<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Mcp\Tool;

use Siteation\DebugBar\Api\McpToolInterface;
use Siteation\DebugBar\Presentation\McpProfilePresenter;

class ListProfiles implements McpToolInterface
{
    public function __construct(private readonly McpProfilePresenter $profiles)
    {
    }

    public function name(): string
    {
        return 'list_debug_profiles';
    }

    public function description(): string
    {
        return 'List recently profiled Magento requests, newest first, with their status, '
            . 'duration, query count and how many findings each produced. Start here when '
            . 'you do not already have a profile id from the X-Siteation-DebugBar-Profile '
            . 'response header.';
    }

    public function inputSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'limit' => [
                    'type' => 'integer',
                    'minimum' => 1,
                    'maximum' => $this->profiles->maxItems(),
                    'default' => 10,
                    'description' => 'How many profiles to return. Ask for the fewest that answer the question.',
                ],
                'method' => ['type' => 'string', 'description' => 'Filter by HTTP method, for example GET.'],
                'path' => ['type' => 'string', 'description' => 'Substring match against the request path.'],
                'status' => ['type' => 'integer', 'description' => 'Filter by exact HTTP status.'],
                'only_with_findings' => [
                    'type' => 'boolean',
                    'default' => false,
                    'description' => 'Return only requests that produced at least one finding.',
                ],
            ],
            'additionalProperties' => false,
        ];
    }

    public function call(array $arguments): array
    {
        return $this->profiles->list(
            [
                'method' => $arguments['method'] ?? null,
                'path' => $arguments['path'] ?? null,
                'status' => $arguments['status'] ?? null,
                'only_with_findings' => (bool) ($arguments['only_with_findings'] ?? false),
            ],
            (int) ($arguments['limit'] ?? 10)
        );
    }
}
