<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\AreaList;
use Magento\Framework\App\Request\Http as HttpRequest;

/**
 * Decides whether a request should produce a profile at all, and whether one may be read.
 *
 * Both questions in one place because they have to give the same answer. An endpoint that
 * hands out a profile to someone the bar would not have collected for is a way around the
 * gate rather than a thing behind it, and while the check was written out three times in
 * three controllers it was one edit away from becoming exactly that.
 *
 * The bar's own endpoints are excluded from collection, otherwise fetching a profile would
 * store another one and a handful of clicks would push the real profiles out of the ring.
 */
class RequestEligibility
{
    public const FRONT_NAME = 'siteation_debugbar';

    public function __construct(
        private readonly Config $config,
        private readonly HttpRequest $request,
        private readonly AreaList $areaList,
        private readonly AccessKey $accessKey
    ) {
    }

    /** Whether this request should be profiled. */
    public function allows(): bool
    {
        if (!$this->allowsRead()) {
            return false;
        }

        if (!$this->config->allowsArea($this->area())) {
            return false;
        }

        return !$this->isOwnRequest();
    }

    /**
     * Whether this request may read what was collected.
     *
     * The area list is deliberately not consulted: it says which areas are worth profiling,
     * not who may look, and a profile of an area no longer being collected is still a
     * profile that was collected for this developer.
     */
    public function allowsRead(): bool
    {
        return $this->config->isEnabled()
            && $this->config->allowsIp($this->clientIp())
            && $this->accessKey->allows();
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
