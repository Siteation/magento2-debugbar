<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\CacheInterface;
use Throwable;

/**
 * How many wrong keys an address has offered lately, and whether it is still being answered.
 *
 * Without this the endpoints are an oracle: they answer an unlimited number of guesses, at
 * whatever length the key happens to be, and say plainly which one was right. The length
 * floor in Config is what makes guessing hopeless; this is what makes it slow, and what
 * keeps a key that predates the floor from being brute forced at leisure.
 *
 * Only a request that presented something is counted. An ordinary customer presents nothing
 * and must never fill the bucket, or a live site would lock out its own developer through
 * the traffic it was built to serve.
 *
 * Every failure restarts the window, so the limit is "ten wrong keys with less than fifteen
 * minutes between them" and the lockout ends fifteen minutes after the last one.
 *
 * A cache that fails leaves the counter open rather than closed. The key comparison is the
 * control and is untouched by any of this; refusing on a cache hiccup would lock a developer
 * out of their own store to protect a check that already happened.
 */
class AccessAttempts
{
    /** Wrong keys one address may offer before it stops being answered at all. */
    public const LIMIT = 10;

    /** Seconds without a failure before the count is forgotten. */
    public const WINDOW = 900;

    private const PREFIX = 'siteation_debugbar_attempts_';
    private const TAG = 'SITEATION_DEBUGBAR_ATTEMPTS';

    public function __construct(private readonly CacheInterface $cache)
    {
    }

    public function lockedOut(?string $client): bool
    {
        return $this->failures($client) >= self::LIMIT;
    }

    public function recordFailure(?string $client): void
    {
        $count = $this->failures($client) + 1;

        try {
            $this->cache->save((string) $count, $this->key($client), [self::TAG], self::WINDOW);
        } catch (Throwable) {
            // Depth, not the control. A counter that cannot be written is not a page to fail.
        }
    }

    /**
     * Forgets the count, so a developer who mistyped once is not one guess from a lockout
     * for the next quarter of an hour.
     */
    public function forget(?string $client): void
    {
        try {
            $this->cache->remove($this->key($client));
        } catch (Throwable) {
            // As above.
        }
    }

    private function failures(?string $client): int
    {
        try {
            $stored = $this->cache->load($this->key($client));
        } catch (Throwable) {
            return 0;
        }

        return is_string($stored) ? max(0, (int) $stored) : 0;
    }

    /**
     * Hashed, because an address is not a cache identifier: IPv6 carries colons, and the
     * bucket has no reason to be readable by anyone browsing the cache.
     */
    private function key(?string $client): string
    {
        return self::PREFIX . sha1($client ?? 'unknown');
    }
}
