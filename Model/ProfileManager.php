<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\ResponseInterface;
use Siteation\DebugBar\Api\CollectorInterface;
use Siteation\DebugBar\Collector\InterceptionCollector;
use Siteation\DebugBar\Collector\RequestCollector;

/**
 * Owns the profile for the current request.
 *
 * isCollecting() is the hot check every plugin makes, so it stays a plain boolean read.
 */
class ProfileManager
{
    public const VERSION = 1;

    private ?string $id = null;

    private float $startedAt = 0.0;

    private bool $collecting = false;

    /**
     * @param array<string, CollectorInterface> $collectors
     */
    public function __construct(
        private readonly array $collectors = []
    ) {
    }

    public function begin(): void
    {
        foreach ($this->collectors as $collector) {
            $collector->reset();
        }

        $this->id = ProfileStore::generateId();
        $this->startedAt = microtime(true);
        $this->collecting = true;
    }

    public function isCollecting(): bool
    {
        return $this->collecting;
    }

    public function id(): ?string
    {
        return $this->id;
    }

    public function collector(string $key): ?CollectorInterface
    {
        return $this->collectors[$key] ?? null;
    }

    public function discard(): void
    {
        $this->collecting = false;
        $this->id = null;
    }

    /**
     * @return array<string, mixed>
     */
    public function finalize(ResponseInterface $response): array
    {
        $this->collecting = false;

        foreach ($this->collectors as $collector) {
            if ($collector instanceof RequestCollector) {
                $collector->capture($response);
            }

            if ($collector instanceof InterceptionCollector) {
                $collector->capture();
            }
        }

        $sections = [];

        foreach ($this->collectors as $key => $collector) {
            $sections[$key] = [
                'label' => $collector->label(),
                'summary' => $collector->summary(),
                'payload' => $collector->payload(),
            ];
        }

        return [
            'id' => $this->id,
            'version' => self::VERSION,
            'started_at' => round($this->startedAt, 6),
            'metrics' => [
                'duration_ms' => round((microtime(true) - $this->startedAt) * 1000, 2),
                'memory_peak_mb' => round(memory_get_peak_usage(true) / 1048576, 2),
            ],
            'sections' => $sections,
        ];
    }
}
