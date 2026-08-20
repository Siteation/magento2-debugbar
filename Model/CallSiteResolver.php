<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Component\ComponentRegistrar;

/**
 * Finds the application frame a query came from.
 *
 * Backtraces are the expensive part of collecting queries, so the scan is bounded twice:
 * how many raw frames are inspected, and how many application frames are kept. Framework
 * and generated code are dropped, because "it came from Mysql.php" helps nobody.
 */
class CallSiteResolver
{
    private const MODULE_NAME = 'Siteation_DebugBar';

    /**
     * The bar's own frames are excluded by asking the registrar where the module is, not by
     * naming a path: it is installed from vendor/, symlinked from a package directory, or
     * wherever else a developer put it, and a literal only excludes the one layout it was
     * written on.
     *
     * @var list<string>
     */
    private const EXCLUDED_PATHS = [
        '/vendor/magento/framework/',
        '/vendor/magento/zend-db/',
        '/vendor/laminas/',
        '/generated/code/',
    ];

    private ?string $root = null;

    private ?string $ownPath = null;

    public function __construct(
        private readonly DirectoryList $directoryList,
        private readonly ComponentRegistrar $registrar,
        private readonly bool $enabled = true,
        private readonly int $keepFrames = 5,
        private readonly int $scanLimit = 40
    ) {
    }

    /**
     * @return list<array{file: string, line: int, call: string}>
     */
    public function resolve(): array
    {
        if (!$this->enabled) {
            return [];
        }

        // phpcs:ignore Magento2.Functions.DiscouragedFunction
        return $this->frames(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, $this->scanLimit));
    }

    /**
     * The application frames of a trace that already exists, an exception's for instance.
     *
     * Same exclusions as a live backtrace, because "it came from Mysql.php" helps nobody
     * whether the trace was taken now or thrown earlier.
     *
     * @param list<array<string, mixed>> $trace
     * @return list<array{file: string, line: int, call: string}>
     */
    public function fromTrace(array $trace): array
    {
        return $this->frames($trace);
    }

    /**
     * One loop for both, so the exclusion set and the frame bound cannot differ between a
     * live backtrace and a thrown one, which is the pair a reader compares when a request
     * fails.
     *
     * @param list<array<string, mixed>> $trace
     * @return list<array{file: string, line: int, call: string}>
     */
    private function frames(array $trace): array
    {
        $found = [];

        foreach ($trace as $index => $frame) {
            $file = $frame['file'] ?? null;

            if (!is_string($file) || $this->isExcluded($file)) {
                continue;
            }

            $found[] = [
                'file' => $this->relative($file),
                'line' => (int) ($frame['line'] ?? 0),
                'call' => $this->call($trace[$index + 1] ?? []),
            ];

            if (count($found) >= $this->keepFrames) {
                break;
            }
        }

        return $found;
    }

    /**
     * @param array<string, mixed> $frame
     */
    private function call(array $frame): string
    {
        $function = (string) ($frame['function'] ?? '');

        if ($function === '') {
            return '';
        }

        $class = (string) ($frame['class'] ?? '');

        return $class === '' ? $function . '()' : $class . '::' . $function . '()';
    }

    private function isExcluded(string $file): bool
    {
        $normalized = str_replace('\\', '/', $file);

        foreach (self::EXCLUDED_PATHS as $excluded) {
            if (str_contains($normalized, $excluded)) {
                return true;
            }
        }

        $own = $this->ownPath();

        return $own !== '' && str_starts_with($normalized, $own);
    }

    /** Where this module is installed, with a trailing slash, or '' if it cannot be found. */
    private function ownPath(): string
    {
        if ($this->ownPath === null) {
            $path = $this->registrar->getPath(ComponentRegistrar::MODULE, self::MODULE_NAME);
            $this->ownPath = $path === null ? '' : rtrim(str_replace('\\', '/', $path), '/') . '/';
        }

        return $this->ownPath;
    }

    /** A path as the profile stores them: relative to the application root. */
    public function relativePath(string $file): string
    {
        return $this->relative($file);
    }

    private function relative(string $file): string
    {
        $this->root ??= $this->directoryList->getRoot();

        return str_starts_with($file, $this->root)
            ? ltrim(substr($file, strlen($this->root)), '/')
            : $file;
    }
}
