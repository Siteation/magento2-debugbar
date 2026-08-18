<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\State;
use Throwable;

/**
 * Resolved once per request and then held.
 *
 * Nothing may read configuration again while the request is being collected: a config read
 * hits the cache, the cache dispatches events, and the event collector would call back in
 * here. The resolving flag closes that loop, and the resolved values are plain properties
 * from then on.
 */
class Config
{
    private const XML_PATH_ENABLED = 'dev/siteation_debugbar/enabled';
    private const XML_PATH_SLOW_QUERY_MS = 'dev/siteation_debugbar/slow_query_ms';
    private const XML_PATH_SLOW_REQUEST_MS = 'dev/siteation_debugbar/slow_request_ms';

    private ?bool $enabled = null;

    private bool $resolving = false;

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
            $this->enabled = $this->resolveEnabled();
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
        return (float) ($this->scopeConfig->getValue(self::XML_PATH_SLOW_QUERY_MS) ?: 100);
    }

    public function slowRequestMs(): float
    {
        return (float) ($this->scopeConfig->getValue(self::XML_PATH_SLOW_REQUEST_MS) ?: 1000);
    }

    /**
     * Deploy mode comes from env.php, so the primary gate costs no cache or database read.
     */
    private function resolveEnabled(): bool
    {
        if ($this->appState->getMode() === State::MODE_PRODUCTION) {
            return false;
        }

        return $this->scopeConfig->isSetFlag(self::XML_PATH_ENABLED);
    }
}
