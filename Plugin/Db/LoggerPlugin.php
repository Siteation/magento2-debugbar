<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Plugin\Db;

use Magento\Framework\DB\LoggerInterface;
use Siteation\DebugBar\Collector\QueryCollector;
use Siteation\DebugBar\Model\ProfileManager;

/**
 * Times every query without touching app/etc/env.php.
 *
 * The PDO adapter brackets each query with startTimer() and logStats(), and calls
 * logStats() from a finally block, so a failed query is still recorded.
 */
class LoggerPlugin
{
    public function __construct(
        private readonly ProfileManager $manager,
        private readonly QueryCollector $queries
    ) {
    }

    /**
     * @return array<int, mixed>
     */
    public function beforeStartTimer(LoggerInterface $subject): array
    {
        if ($this->manager->isCollecting()) {
            $this->manager->quietly('queries', fn () => $this->queries->markStart());
        }

        return [];
    }

    /**
     * @param array<array-key, mixed> $bind
     */
    public function afterLogStats(
        LoggerInterface $subject,
        mixed $result,
        string $type,
        string $sql = '',
        array $bind = [],
        mixed $queryResult = null
    ): mixed {
        if ($this->manager->isCollecting()) {
            $this->manager->quietly('queries', fn () => $this->queries->recordQuery($type, $sql, $bind));
        }

        return $result;
    }
}
