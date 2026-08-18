<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\State;
use Throwable;

/**
 * Every value is resolved once, in one guarded pass, and read from plain properties after
 * that. Each getter triggers that pass, so no caller has to know it must ask whether the
 * bar is enabled before asking anything else.
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
    private const XML_PATH_ALLOWED_IPS = 'dev/siteation_debugbar/allowed_ips';
    private const XML_PATH_VALUE_POLICY = 'dev/siteation_debugbar/value_policy';
    private const XML_PATH_AREAS = 'dev/siteation_debugbar/areas';

    private const DEFAULT_SLOW_QUERY_MS = 100.0;
    private const DEFAULT_SLOW_REQUEST_MS = 1000.0;

    private ?bool $enabled = null;

    private bool $resolving = false;

    private float $slowQueryMs = self::DEFAULT_SLOW_QUERY_MS;

    private float $slowRequestMs = self::DEFAULT_SLOW_REQUEST_MS;

    /** @var list<string> */
    private array $allowedIps = [];

    private string $valuePolicy = Redactor::POLICY_FULL;

    /** @var list<string> */
    private array $areas = [];

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
        $this->isEnabled();

        return $this->slowQueryMs;
    }

    public function slowRequestMs(): float
    {
        $this->isEnabled();

        return $this->slowRequestMs;
    }

    /**
     * An empty list allows everyone, which is the normal case on a developer machine.
     *
     * @return list<string>
     */
    public function allowedIps(): array
    {
        $this->isEnabled();

        return $this->allowedIps;
    }

    /**
     * Whether captured values are kept, masked, or dropped.
     */
    public function valuePolicy(): string
    {
        $this->isEnabled();

        return $this->valuePolicy;
    }

    /**
     * Which areas may be profiled. An empty list means every area, so an upgrade that
     * predates this setting keeps behaving as it did.
     *
     * @return list<string>
     */
    public function areas(): array
    {
        $this->isEnabled();

        return $this->areas;
    }

    public function allowsArea(?string $area): bool
    {
        if ($this->areas() === []) {
            return true;
        }

        return $area !== null && in_array($area, $this->areas, true);
    }

    public function allowsIp(?string $ip): bool
    {
        if ($this->allowedIps() === []) {
            return true;
        }

        return $ip !== null && in_array($ip, $this->allowedIps, true);
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
        $this->allowedIps = $this->ipList($this->scopeConfig->getValue(self::XML_PATH_ALLOWED_IPS));
        $this->valuePolicy = $this->policy($this->scopeConfig->getValue(self::XML_PATH_VALUE_POLICY));
        $this->areas = $this->csv($this->scopeConfig->getValue(self::XML_PATH_AREAS));

        return true;
    }

    private function policy(mixed $value): string
    {
        $allowed = [Redactor::POLICY_FULL, Redactor::POLICY_MASKED, Redactor::POLICY_NONE];

        return is_string($value) && in_array($value, $allowed, true)
            ? $value
            : Redactor::POLICY_FULL;
    }

    /**
     * @return list<string>
     */
    private function ipList(mixed $value): array
    {
        return $this->csv($value);
    }

    /**
     * @return list<string>
     */
    private function csv(mixed $value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map('strval', $value)));
        }

        if (!is_string($value) || trim($value) === '') {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode(',', $value))));
    }

    private function positiveFloat(mixed $value, float $fallback): float
    {
        return is_numeric($value) && (float) $value > 0 ? (float) $value : $fallback;
    }
}
