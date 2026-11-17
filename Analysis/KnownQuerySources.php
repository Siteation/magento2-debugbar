<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis;

/**
 * Core code whose repeated queries nobody can act on, so the rules describe them instead of
 * warning about them.
 *
 * A source is matched by the method a call site frame sits in, not by file and line: the
 * line moves with every Magento release, and the file moves between vendor/ and app/code.
 * Add sources through di.xml (`sources` argument); an entry with a known key replaces the
 * built in one.
 */
class KnownQuerySources
{
    /**
     * @var array<string, array{call: string, label: string, explanation: string}>
     */
    private const DEFAULTS = [
        'magento_theme_registration' => [
            'call' => 'Magento\Theme\Model\Theme\Plugin\Registration::',
            'label' => 'Magento theme registration',
            'explanation' => 'Core Magento re-registers every theme from the filesystem before each '
                . 'admin request, one save per theme. It runs in developer and default mode only '
                . 'and is absent in production, so there is nothing to change here.',
        ],
    ];

    /**
     * @var array<string, array{call: string, label: string, explanation: string}>
     */
    private readonly array $sources;

    /**
     * @param array<string, array{call: string, label: string, explanation: string}> $sources
     */
    public function __construct(array $sources = [])
    {
        $this->sources = array_filter(
            [...self::DEFAULTS, ...$sources],
            static fn (array $source): bool => $source['call'] !== ''
        );
    }

    /**
     * The key of the first source any frame of a query's call site sits in.
     *
     * @param mixed $callSite
     * @return string|null
     */
    public function match($callSite): ?string
    {
        if (!is_array($callSite)) {
            return null;
        }

        foreach ($callSite as $frame) {
            $call = is_array($frame) ? (string) ($frame['call'] ?? '') : '';

            if ($call === '') {
                continue;
            }

            foreach ($this->sources as $key => $source) {
                if (str_starts_with($call, $source['call'])) {
                    return $key;
                }
            }
        }

        return null;
    }

    /**
     * @param string $key
     * @return array{call: string, label: string, explanation: string}|null
     */
    public function get(string $key): ?array
    {
        return $this->sources[$key] ?? null;
    }
}
