<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

/**
 * Removes sensitive values and bounds captured data, at record time rather than at render
 * time, so a stored profile can never hold something a later reader must be trusted with.
 */
class Redactor
{
    public const REDACTED = '[redacted]';
    public const TRUNCATED = '[maximum depth reached]';

    /**
     * Matched against array keys, case insensitively.
     */
    private const SENSITIVE_KEY_PATTERN =
        '/(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key'
        . '|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i';

    public function __construct(
        private readonly int $maxDepth = 5,
        private readonly int $maxStringLength = 2000,
        private readonly int $maxItemsPerArray = 100
    ) {
    }

    public function clean(mixed $value, int $depth = 0): mixed
    {
        if ($depth > $this->maxDepth) {
            return self::TRUNCATED;
        }

        if (is_array($value)) {
            return $this->cleanArray($value, $depth);
        }

        if (is_string($value)) {
            return $this->cleanString($value);
        }

        if (is_scalar($value) || $value === null) {
            return $value;
        }

        if (is_object($value)) {
            return get_class($value);
        }

        return gettype($value);
    }

    /**
     * SQL is kept readable but string literals are dropped, because a WHERE clause can
     * carry an email address or a token just as easily as bound parameters can.
     */
    public function cleanSql(string $sql): string
    {
        $sql = preg_replace("/'(?:[^'\\\\]|\\\\.)*'/", "'?'", $sql) ?? $sql;

        return $this->cleanString($sql);
    }

    /**
     * @param array<array-key, mixed> $bindings
     * @return array<array-key, mixed>
     */
    public function cleanBindings(array $bindings): array
    {
        $clean = [];

        foreach ($bindings as $key => $value) {
            $clean[$key] = $this->isSensitiveKey((string) $key)
                ? self::REDACTED
                : $this->clean($value, 1);
        }

        return $clean;
    }

    /**
     * @param array<array-key, mixed> $value
     * @return array<array-key, mixed>
     */
    private function cleanArray(array $value, int $depth): array
    {
        $clean = [];
        $kept = 0;

        foreach ($value as $key => $item) {
            if ($kept >= $this->maxItemsPerArray) {
                $clean['__truncated__'] = count($value) - $kept;
                break;
            }

            $clean[$key] = $this->isSensitiveKey((string) $key)
                ? self::REDACTED
                : $this->clean($item, $depth + 1);

            $kept++;
        }

        return $clean;
    }

    private function cleanString(string $value): string
    {
        if (strlen($value) <= $this->maxStringLength) {
            return $value;
        }

        return substr($value, 0, $this->maxStringLength) . '...';
    }

    private function isSensitiveKey(string $key): bool
    {
        return preg_match(self::SENSITIVE_KEY_PATTERN, $key) === 1;
    }
}
