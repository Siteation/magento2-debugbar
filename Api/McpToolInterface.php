<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Api;

/**
 * One tool exposed to a coding agent over MCP.
 *
 * Every tool here is read only. The server never changes anything about the store, and
 * the profiles it reads are already redacted and bounded.
 */
interface McpToolInterface
{
    public function name(): string;

    public function description(): string;

    /**
     * JSON Schema for the tool's arguments.
     *
     * @return array<string, mixed>
     */
    public function inputSchema(): array;

    /**
     * @param array<string, mixed> $arguments
     * @return array<string, mixed>
     */
    public function call(array $arguments): array;
}
