<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\ResponseInterface;
use Psr\Log\LoggerInterface;
use Siteation\DebugBar\Api\CollectorInterface;
use Siteation\DebugBar\Analysis\ProfileAnalyzer;
use Siteation\DebugBar\Analysis\TimelineBuilder;
use Siteation\DebugBar\Collector\InterceptionCollector;
use Siteation\DebugBar\Collector\RequestCollector;
use Throwable;

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
        private readonly ProfileAnalyzer $analyzer,
        private readonly TimelineBuilder $timeline,
        private readonly Clock $clock,
        private readonly LoggerInterface $logger,
        private readonly array $collectors = []
    ) {
    }

    public function begin(): void
    {
        $this->clock->start();

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

    /**
     * Runs a collector call so that it can only ever cost data, never the response.
     *
     * Three of the five plugins record from a finally block, where a throw would replace the
     * exception the application was already unwinding: the bar would break the page and
     * erase the real error on its way out. Nothing on these paths throws today, but
     * Bootstrap installs ErrorHandler before launch(), so one deprecation added to a
     * collector later is a throw rather than a log line.
     */
    public function quietly(callable $record): void
    {
        try {
            $record();
        } catch (Throwable $exception) {
            $this->failed('collector', $exception);
        }
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
                $this->quietly(fn () => $collector->capture($response));
            }

            if ($collector instanceof InterceptionCollector) {
                $this->quietly(fn () => $collector->capture());
            }
        }

        $sections = [];

        // Per collector, for the reason ProfileAnalyzer guards per rule: a missing section is
        // a small loss and a lost profile is the whole point of the request. A section that
        // failed says so, rather than disappearing and leaving "the bar stopped appearing"
        // as the only symptom.
        foreach ($this->collectors as $key => $collector) {
            try {
                $sections[$key] = [
                    'label' => $collector->label(),
                    'summary' => $collector->summary(),
                    'payload' => $collector->payload(),
                ];
            } catch (Throwable $exception) {
                $sections[$key] = $this->brokenSection($key, $exception);
                $this->failed($key, $exception);
            }
        }

        $profile = [
            'id' => $this->id,
            'version' => self::VERSION,
            'started_at' => round($this->startedAt, 6),
            'metrics' => [
                'duration_ms' => round((microtime(true) - $this->startedAt) * 1000, 2),
                'memory_peak_mb' => round(memory_get_peak_usage(true) / 1048576, 2),
            ],
            'sections' => $sections,
        ];

        // Built from the finished sections, so it must come before the analyzer sees the
        // profile and after every collector has stopped.
        try {
            $timeline = $this->timeline->build($profile);
            $profile['sections']['timeline'] = [
                'label' => 'Timeline',
                'summary' => $timeline['summary'],
                'payload' => ['items' => $timeline['items']],
            ];
        } catch (Throwable $exception) {
            $profile['sections']['timeline'] = $this->brokenSection('Timeline', $exception);
            $this->failed('timeline', $exception);
        }

        $profile['findings'] = $this->analyzer->analyze($profile);

        return $profile;
    }

    /**
     * A section shaped like any other, so every reader keeps working, saying what went wrong
     * where the panel would have been.
     *
     * @return array<string, mixed>
     */
    private function brokenSection(string $key, Throwable $exception): array
    {
        return [
            'label' => ucfirst($key),
            'summary' => ['error' => $exception->getMessage()],
            'payload' => ['items' => []],
        ];
    }

    private function failed(string $what, Throwable $exception): void
    {
        $this->logger->warning(sprintf(
            'Siteation_DebugBar %s failed: %s',
            $what,
            $exception->getMessage()
        ));
    }
}
