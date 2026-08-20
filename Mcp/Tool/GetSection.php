<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Mcp\Tool;

use Siteation\DebugBar\Api\McpToolInterface;
use Siteation\DebugBar\Presentation\McpProfilePresenter;

class GetSection implements McpToolInterface
{
    public function __construct(private readonly McpProfilePresenter $profiles)
    {
    }

    public function name(): string
    {
        return 'get_debug_profile_section';
    }

    public function description(): string
    {
        return 'Read one section of a profile: request, queries, events, observers, blocks, '
            . 'cache, interception or timeline. Paginated. Ask for the smallest section that '
            . 'answers the question rather than reading everything.';
    }

    public function inputSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'profile_id' => ['type' => 'string'],
                'section' => [
                    'type' => 'string',
                    'enum' => [
                        'request', 'queries', 'events', 'observers', 'blocks', 'cache',
                        'interception', 'timeline',
                    ],
                ],
                'cursor' => ['type' => 'integer', 'minimum' => 0, 'default' => 0],
                'limit' => [
                    'type' => 'integer',
                    'minimum' => 1,
                    'maximum' => $this->profiles->maxItems(),
                    'default' => 10,
                ],
            ],
            'required' => ['profile_id', 'section'],
            'additionalProperties' => false,
        ];
    }

    public function call(array $arguments): array
    {
        return $this->profiles->section(
            (string) ($arguments['profile_id'] ?? ''),
            (string) ($arguments['section'] ?? ''),
            (int) ($arguments['cursor'] ?? 0),
            (int) ($arguments['limit'] ?? 10)
        );
    }
}
