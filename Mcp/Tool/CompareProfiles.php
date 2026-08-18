<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Mcp\Tool;

use Siteation\DebugBar\Api\McpToolInterface;
use Siteation\DebugBar\Presentation\McpProfilePresenter;

class CompareProfiles implements McpToolInterface
{
    public function __construct(private readonly McpProfilePresenter $profiles)
    {
    }

    public function name(): string
    {
        return 'compare_debug_profiles';
    }

    public function description(): string
    {
        return 'Compare two profiled requests and report what changed: duration, memory, '
            . 'queries, cache, findings that appeared or went away, and which query shapes '
            . 'were added, removed or now run a different number of times. Use this after '
            . 'changing code to measure what the change cost, with a before profile and an '
            . 'after profile of the same page.';
    }

    /**
     * @return array<string, mixed>
     */
    public function inputSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'baseline_profile_id' => [
                    'type' => 'string',
                    'description' => 'The earlier request, what it was before the change.',
                ],
                'subject_profile_id' => [
                    'type' => 'string',
                    'description' => 'The later request, what it is now.',
                ],
            ],
            'required' => ['baseline_profile_id', 'subject_profile_id'],
            'additionalProperties' => false,
        ];
    }

    /**
     * @param array<string, mixed> $arguments
     * @return array<string, mixed>
     */
    public function call(array $arguments): array
    {
        return $this->profiles->compare(
            (string) ($arguments['baseline_profile_id'] ?? ''),
            (string) ($arguments['subject_profile_id'] ?? '')
        );
    }
}
