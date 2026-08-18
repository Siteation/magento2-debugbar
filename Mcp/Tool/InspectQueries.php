<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Mcp\Tool;

use Siteation\DebugBar\Api\McpToolInterface;
use Siteation\DebugBar\Presentation\McpProfilePresenter;

class InspectQueries implements McpToolInterface
{
    public function __construct(private readonly McpProfilePresenter $profiles)
    {
    }

    public function name(): string
    {
        return 'inspect_debug_queries';
    }

    public function description(): string
    {
        return 'Read a request\'s queries sorted slowest first, with their call sites and '
            . 'timings. Use the slow filter first. Compare query time against total request '
            . 'time before blaming the database: if queries are a small share, look at '
            . 'blocks, observers and cache instead.';
    }

    public function inputSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'profile_id' => ['type' => 'string'],
                'filter' => [
                    'type' => 'string',
                    'enum' => ['all', 'slow'],
                    'default' => 'all',
                ],
                'limit' => [
                    'type' => 'integer',
                    'minimum' => 1,
                    'maximum' => $this->profiles->maxItems(),
                    'default' => 5,
                ],
            ],
            'required' => ['profile_id'],
            'additionalProperties' => false,
        ];
    }

    public function call(array $arguments): array
    {
        return $this->profiles->queries(
            (string) ($arguments['profile_id'] ?? ''),
            (string) ($arguments['filter'] ?? 'all'),
            (int) ($arguments['limit'] ?? 5)
        );
    }
}
