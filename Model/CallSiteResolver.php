<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Filesystem\DirectoryList;

/**
 * Finds the application frame a query came from.
 *
 * Backtraces are the expensive part of collecting queries, so the scan is bounded twice:
 * how many raw frames are inspected, and how many application frames are kept. Framework
 * and generated code are dropped, because "it came from Mysql.php" helps nobody.
 */
class CallSiteResolver
{
    /** @var list<string> */
    private const EXCLUDED_PATHS = [
        '/vendor/magento/framework/',
        '/vendor/magento/zend-db/',
        '/vendor/laminas/',
        '/generated/code/',
        '/package-source/siteation/module-debugbar/',
        '/vendor/siteation/',
    ];

    private ?string $root = null;

    public function __construct(
        private readonly DirectoryList $directoryList,
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
        $frames = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, $this->scanLimit);
        $found = [];

        foreach ($frames as $index => $frame) {
            $file = $frame['file'] ?? null;

            if (!is_string($file) || $this->isExcluded($file)) {
                continue;
            }

            $found[] = [
                'file' => $this->relative($file),
                'line' => (int) ($frame['line'] ?? 0),
                'call' => $this->call($frames[$index + 1] ?? []),
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

        return false;
    }

    private function relative(string $file): string
    {
        $this->root ??= $this->directoryList->getRoot();

        return str_starts_with($file, $this->root)
            ? ltrim(substr($file, strlen($this->root)), '/')
            : $file;
    }
}
