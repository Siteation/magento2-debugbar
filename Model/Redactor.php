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
    public const MASKED = '[masked]';
    public const TRUNCATED = '[maximum depth reached]';

    /** Keep captured values. Correct on a developer machine, which is where this runs. */
    public const POLICY_FULL = 'full';

    /** Keep the shape, drop the content. For an unusual shared environment. */
    public const POLICY_MASKED = 'masked';

    /** Store no values at all. */
    public const POLICY_NONE = 'none';

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
     *
     * Both quoting styles, matching QueryAnalyzer::normalize(). Magento's adapter only ever
     * emits single quotes, so the second is for hand written SQL from a third party module
     * that chose the other one and would otherwise keep its values at every policy.
     */
    public function cleanSql(string $sql): string
    {
        $sql = preg_replace(
            ['/\'(?:[^\'\\\\]|\\\\.)*\'/', '/"(?:[^"\\\\]|\\\\.)*"/'],
            ["'?'", '"?"'],
            $sql
        ) ?? $sql;

        return $this->cleanString($sql);
    }

    /**
     * Bindings are usually positional, so there is no key to judge them by. Anything a
     * customer typed arrives here as an anonymous value, which is why the policy exists
     * rather than a cleverer key rule.
     *
     * @param array<array-key, mixed> $bindings
     * @return array<array-key, mixed>
     */
    public function cleanBindings(array $bindings, string $policy = self::POLICY_FULL): array
    {
        if ($policy === self::POLICY_NONE) {
            return [];
        }

        $clean = [];

        foreach ($bindings as $key => $value) {
            if ($this->isSensitiveKey((string) $key)) {
                $clean[$key] = self::REDACTED;

                continue;
            }

            $clean[$key] = $policy === self::POLICY_MASKED
                ? $this->mask($value)
                : $this->clean($value, 1);
        }

        return $clean;
    }

    /**
     * @param array<array-key, mixed> $values
     * @return array<array-key, mixed>
     */
    public function cleanValues(array $values, string $policy = self::POLICY_FULL): array
    {
        if ($policy === self::POLICY_NONE) {
            return [];
        }

        $clean = [];

        foreach ($values as $key => $value) {
            if ($this->isSensitiveKey((string) $key)) {
                $clean[$key] = self::REDACTED;

                continue;
            }

            $clean[$key] = $policy === self::POLICY_MASKED
                ? $this->mask($value)
                : $this->clean($value, 1);
        }

        return $clean;
    }

    /**
     * Numbers and booleans stay: they carry little on their own and losing them makes a
     * query impossible to read at all.
     */
    private function mask(mixed $value): mixed
    {
        if (is_string($value)) {
            return $value === '' ? '' : self::MASKED;
        }

        if (is_array($value)) {
            return array_map(fn (mixed $item): mixed => $this->mask($item), $value);
        }

        return $this->clean($value, 1);
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

        // mb_strcut, not substr: the bound stays a byte bound, because it exists to cap the
        // file, but a byte offset splits a multi-byte character whenever it lands
        // mid-sequence. Half a character is not valid UTF-8, and the store encodes the whole
        // profile in one call, so one split character used to cost every section.
        return mb_strcut($value, 0, $this->maxStringLength, 'UTF-8') . '...';
    }

    private function isSensitiveKey(string $key): bool
    {
        return preg_match(self::SENSITIVE_KEY_PATTERN, $key) === 1;
    }
}
