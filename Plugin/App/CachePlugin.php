<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Plugin\App;

use Closure;
use Magento\Framework\App\CacheInterface;
use Siteation\DebugBar\Collector\CacheCollector;
use Siteation\DebugBar\Model\ProfileManager;

/**
 * Cache reads and writes.
 *
 * Reads no configuration, for the same reason as the event plugins: resolving a config
 * value loads the config cache, which would land straight back here.
 */
class CachePlugin
{
    public function __construct(
        private readonly ProfileManager $manager,
        private readonly CacheCollector $cache
    ) {
    }

    public function aroundLoad(CacheInterface $subject, Closure $proceed, string $identifier): mixed
    {
        if (!$this->manager->isCollecting()) {
            return $proceed($identifier);
        }

        $startedAt = microtime(true);
        $result = $proceed($identifier);

        $this->manager->quietly('cache', fn () => $this->cache->recordOperation(
            'load',
            $identifier,
            (microtime(true) - $startedAt) * 1000,
            is_string($result) ? strlen($result) : 0,
            $result !== false && $result !== null && $result !== ''
        ));

        return $result;
    }

    /**
     * @param array<int, string> $tags
     * @param int|null $lifeTime left untyped to match CacheInterface::save()
     */
    public function aroundSave(
        CacheInterface $subject,
        Closure $proceed,
        string $data,
        string $identifier,
        array $tags = [],
        $lifeTime = null
    ): bool {
        if (!$this->manager->isCollecting()) {
            return $proceed($data, $identifier, $tags, $lifeTime);
        }

        $startedAt = microtime(true);
        $result = $proceed($data, $identifier, $tags, $lifeTime);

        $this->manager->quietly('cache', fn () => $this->cache->recordOperation(
            'save',
            $identifier,
            (microtime(true) - $startedAt) * 1000,
            strlen($data)
        ));

        return $result;
    }

    public function aroundRemove(CacheInterface $subject, Closure $proceed, string $identifier): bool
    {
        if (!$this->manager->isCollecting()) {
            return $proceed($identifier);
        }

        $startedAt = microtime(true);
        $result = $proceed($identifier);

        $this->cache->recordOperation(
            'remove',
            $identifier,
            (microtime(true) - $startedAt) * 1000
        );

        return $result;
    }
}
