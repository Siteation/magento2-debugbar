<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\AreaList;
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
        private readonly HttpRequest $request,
        private readonly AreaList $areaList
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

        if (!$this->config->allowsArea($this->area())) {
            return false;
        }

        return !$this->isOwnRequest();
    }

    /**
     * Resolved the same way App\Http::launch() does, because the decision has to be made
     * before launch() gets round to setting the area.
     */
    public function area(): ?string
    {
        try {
            return $this->areaList->getCodeByFrontName($this->request->getFrontName());
        } catch (\Throwable) {
            return null;
        }
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
