<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Stdlib\CookieManagerInterface;
use Throwable;

/**
 * Proof that a request belongs to the developer rather than to a customer.
 *
 * The switch in configuration is per store, so on a live site it is the wrong shape: turning
 * the bar on for yourself turns it on for everyone. This is the per request half. Without a
 * key the request is an ordinary visitor's and produces nothing at all: no profile is
 * written, no bar is injected, and the endpoints answer as though the module were absent.
 *
 * Three ways to present it, because the bar profiles four areas and a browser is only one of
 * them. A header suits curl, an agent and the REST client; a cookie suits a browser once it
 * has one; the query parameter exists to hand the browser its cookie and is needed once.
 *
 * The comparison is hash_equals, so the answer takes the same time whether the first
 * character was wrong or the last.
 *
 * Wrong keys are counted, and an address that offers too many stops being answered for a
 * while. Only a request that presented something counts: a customer presents nothing, and a
 * live site must not lock out its own developer through the traffic it exists to serve.
 */
class AccessKey
{
    public const HEADER = 'X-Siteation-DebugBar-Key';
    public const COOKIE = 'siteation_debugbar_key';
    public const PARAM = 'siteation_debugbar_key';

    /** An hour, which is how long a profile lives: the key outlives nothing it unlocks. */
    private const COOKIE_LIFETIME = 3600;

    public function __construct(
        private readonly Config $config,
        private readonly HttpRequest $request,
        private readonly CookieManagerInterface $cookies,
        private readonly CookieMetadataFactory $cookieMetadata,
        private readonly AccessAttempts $attempts,
        private readonly ClientAddress $client
    ) {
    }

    /**
     * True when this request may be profiled and read.
     *
     * With no key configured there is nothing to prove, which is the developer machine case
     * the module was written for. Config refuses to enable at all in any other mode without
     * one, so "nothing to prove" can never be the answer on a live site.
     */
    public function allows(): bool
    {
        $expected = $this->config->accessKey();

        if ($expected === '') {
            return true;
        }

        $candidates = $this->presented();

        // Before the counter, so ordinary traffic on a live site costs no cache read at all
        // and cannot fill a bucket it never meant to touch.
        if ($candidates === []) {
            return false;
        }

        $client = $this->client->get();

        if ($this->attempts->lockedOut($client)) {
            return false;
        }

        foreach ($candidates as $candidate) {
            if (hash_equals($expected, $candidate)) {
                $this->attempts->forget($client);

                return true;
            }
        }

        $this->attempts->recordFailure($client);

        return false;
    }

    /**
     * Whether the key arrived in the URL, which is the only form worth trading for a cookie.
     */
    public function wasPresentedInUrl(): bool
    {
        $key = $this->request->getParam(self::PARAM);
        $expected = $this->config->accessKey();

        return $expected !== '' && is_string($key) && $key !== '' && hash_equals($expected, $key);
    }

    /**
     * Hands the browser a cookie so the key leaves the address bar after one request.
     *
     * Written through the public metadata rather than the sensitive one, which cannot carry
     * a lifetime: a sensitive cookie lasts the browser session, and a debugging credential
     * should not outlive the profiles it opens. Every attribute a sensitive cookie would
     * have set is set here by hand instead. Nothing in the bar reads it from JavaScript, so
     * JavaScript cannot.
     *
     * Must be called after the application has run: the cookie manager resolves its domain
     * and path through the store, and at the start of launch() there is no store yet.
     *
     * @return bool whether the browser was given one
     */
    public function issueCookie(): bool
    {
        try {
            $metadata = $this->cookieMetadata->createPublicCookieMetadata()
                ->setDuration(self::COOKIE_LIFETIME)
                ->setPath('/')
                ->setHttpOnly(true)
                ->setSecure($this->request->isSecure())
                ->setSameSite('Lax');

            $this->cookies->setPublicCookie(self::COOKIE, $this->config->accessKey(), $metadata);

            return true;
        } catch (Throwable) {
            // A cookie that cannot be set costs the developer one query parameter per
            // request. It is not worth failing a page over, but it is worth saying: the
            // caller logs it rather than leaving a silent no-op to be discovered by hand.
            return false;
        }
    }

    /**
     * @return list<string>
     */
    private function presented(): array
    {
        $candidates = [
            $this->request->getHeader(self::HEADER),
            $this->cookies->getCookie(self::COOKIE),
            $this->request->getParam(self::PARAM),
        ];

        return array_values(array_filter(
            $candidates,
            static fn (mixed $value): bool => is_string($value) && $value !== ''
        ));
    }
}
