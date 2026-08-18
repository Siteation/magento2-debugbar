<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

/**
 * How far into the request we are.
 *
 * Separate from ProfileManager so collectors can ask without depending on the thing that
 * owns them, which would be circular: the manager is constructed with the collectors.
 */
class Clock
{
    private float $startedAt = 0.0;

    public function start(): void
    {
        $this->startedAt = microtime(true);
    }

    public function elapsedMs(): float
    {
        return $this->startedAt === 0.0
            ? 0.0
            : round((microtime(true) - $this->startedAt) * 1000, 3);
    }
}
