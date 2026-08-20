<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Api;

use Magento\Framework\App\ResponseInterface;
use Throwable;

/**
 * One section of a request profile.
 *
 * A collector gathers raw data during the request and hands back two views of it: a small
 * summary that is always cheap to render, and a bounded payload holding the evidence.
 *
 * The section key is the key it is registered under in di.xml, so it is not asked for here:
 * a collector that named itself could disagree with the array it lives in.
 */
interface CollectorInterface
{
    /**
     * Human readable name, shown in the bar.
     */
    public function label(): string;

    public function reset(): void;

    /**
     * The end of the request, once there is a response to read.
     *
     * Most collectors have everything they need by now and do nothing here. It is on the
     * interface so that ProfileManager can end the request with one loop rather than a list
     * of instanceof checks against the two that do.
     */
    public function finalize(ResponseInterface $response): void;

    /**
     * The request threw instead of finishing. Only the collector that owns the request
     * itself has anything to say about it.
     */
    public function captureFailure(Throwable $thrown): void;

    /**
     * @param array<string, mixed> $item
     */
    public function record(array $item): void;

    /**
     * @return array<string, mixed>
     */
    public function summary(): array;

    /**
     * @return array<string, mixed>
     */
    public function payload(): array;
}
