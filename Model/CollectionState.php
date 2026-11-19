<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

/**
 * Whether this request is being collected, held apart from ProfileManager.
 *
 * Every plugin asks this on every query, event, block and cache call. Asked of the manager it
 * would build the manager, its analyzer and its collectors on the first call of every request,
 * the bar on or off. This has no dependencies, so the plugins can hold the manager and the
 * collectors behind proxies that are only ever built once the bar is running.
 */
class CollectionState
{
    private bool $collecting = false;

    public function isCollecting(): bool
    {
        return $this->collecting;
    }

    public function start(): void
    {
        $this->collecting = true;
    }

    public function stop(): void
    {
        $this->collecting = false;
    }
}
