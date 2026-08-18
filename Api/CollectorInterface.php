<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Api;

/**
 * One section of a request profile.
 *
 * A collector gathers raw data during the request and hands back two views of it: a small
 * summary that is always cheap to render, and a bounded payload holding the evidence.
 */
interface CollectorInterface
{
    /**
     * Machine name, used as the section key in the stored profile.
     */
    public function key(): string;

    /**
     * Human readable name, shown in the bar.
     */
    public function label(): string;

    public function reset(): void;

    /**
     * @param array<string, mixed> $item
     */
    public function record(array $item): void;

    /**
     * @return array<string, mixed>
     */
    public function summary(): array;

    /**
     * @return array<string, mixed>
     */
    public function payload(): array;
}
