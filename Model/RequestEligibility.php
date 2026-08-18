<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Request\Http as HttpRequest;

/**
 * Decides whether a request should produce a profile at all.
 *
 * The bar's own endpoints are excluded, otherwise fetching a profile would store another
 * one and a handful of clicks would push the real profiles out of the ring buffer.
 */
class RequestEligibility
{
    public const FRONT_NAME = 'siteation_debugbar';

    public function __construct(
        private readonly Config $config,
        private readonly HttpRequest $request
    ) {
    }

    public function allows(): bool
    {
        if (!$this->config->isEnabled()) {
            return false;
        }

        if (!$this->config->allowsIp($this->clientIp())) {
            return false;
        }

        return !$this->isOwnRequest();
    }

    /**
     * Deliberately ignores X-Forwarded-For. An allowlist that trusts a client supplied
     * header is not an allowlist.
     */
    public function clientIp(): ?string
    {
        $ip = $this->request->getServer('REMOTE_ADDR');

        return is_string($ip) && $ip !== '' ? $ip : null;
    }

    private function isOwnRequest(): bool
    {
        $path = trim((string) $this->request->getPathInfo(), '/');

        return $path === self::FRONT_NAME || str_starts_with($path, self::FRONT_NAME . '/');
    }
}
