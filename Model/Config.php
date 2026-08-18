<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\State;
use Throwable;

/**
 * Every value is resolved once, in one guarded pass, and read from plain properties after
 * that.
 *
 * Nothing may read configuration while a request is being collected. A config read can
 * miss the cache, a cache miss issues queries and dispatches events, and the query, cache
 * and event collectors would all call back in here. Reading a threshold per query is
 * enough to recurse forever the first time the config cache is cold.
 *
 * The resolving flag closes the loop for the one read that does happen, at launch, before
 * any collector is active.
 */
class Config
{
    private const XML_PATH_ENABLED = 'dev/siteation_debugbar/enabled';
    private const XML_PATH_SLOW_QUERY_MS = 'dev/siteation_debugbar/slow_query_ms';
    private const XML_PATH_SLOW_REQUEST_MS = 'dev/siteation_debugbar/slow_request_ms';

    private const DEFAULT_SLOW_QUERY_MS = 100.0;
    private const DEFAULT_SLOW_REQUEST_MS = 1000.0;

    private ?bool $enabled = null;

    private bool $resolving = false;

    private float $slowQueryMs = self::DEFAULT_SLOW_QUERY_MS;

    private float $slowRequestMs = self::DEFAULT_SLOW_REQUEST_MS;

    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly State $appState,
        private readonly int $maxItemsPerCollector = 500,
        private readonly int $maxProfiles = 20,
        private readonly int $maxAgeMinutes = 60
    ) {
    }

    public function isEnabled(): bool
    {
        if ($this->enabled !== null) {
            return $this->enabled;
        }

        if ($this->resolving) {
            return false;
        }

        $this->resolving = true;

        try {
            $this->enabled = $this->resolve();
        } catch (Throwable) {
            $this->enabled = false;
        } finally {
            $this->resolving = false;
        }

        return $this->enabled;
    }

    public function maxItemsPerCollector(): int
    {
        return $this->maxItemsPerCollector;
    }

    public function maxProfiles(): int
    {
        return $this->maxProfiles;
    }

    public function maxAgeMinutes(): int
    {
        return $this->maxAgeMinutes;
    }

    public function slowQueryMs(): float
    {
        return $this->slowQueryMs;
    }

    public function slowRequestMs(): float
    {
        return $this->slowRequestMs;
    }

    /**
     * Deploy mode comes from env.php, so the primary gate costs no cache or database read.
     */
    private function resolve(): bool
    {
        if ($this->appState->getMode() === State::MODE_PRODUCTION) {
            return false;
        }

        if (!$this->scopeConfig->isSetFlag(self::XML_PATH_ENABLED)) {
            return false;
        }

        $this->slowQueryMs = $this->positiveFloat(
            $this->scopeConfig->getValue(self::XML_PATH_SLOW_QUERY_MS),
            self::DEFAULT_SLOW_QUERY_MS
        );
        $this->slowRequestMs = $this->positiveFloat(
            $this->scopeConfig->getValue(self::XML_PATH_SLOW_REQUEST_MS),
            self::DEFAULT_SLOW_REQUEST_MS
        );

        return true;
    }

    private function positiveFloat(mixed $value, float $fallback): float
    {
        return is_numeric($value) && (float) $value > 0 ? (float) $value : $fallback;
    }
}
