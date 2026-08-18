<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis;

/**
 * One thing worth a developer's attention.
 *
 * A finding has to answer five questions or it is just a number with a colour: what
 * happened, what is wrong, why it matters, where it came from, and what to do next. The
 * action names the section and filter that hold the evidence, which is what makes a
 * finding a starting point rather than a dead end.
 */
class Finding
{
    public const SEVERITY_ERROR = 'error';
    public const SEVERITY_WARNING = 'warning';
    public const SEVERITY_INFO = 'info';

    /** @var array<string, int> */
    private const SEVERITY_ORDER = [
        self::SEVERITY_ERROR => 0,
        self::SEVERITY_WARNING => 1,
        self::SEVERITY_INFO => 2,
    ];

    /**
     * @param array<string, mixed> $evidence
     * @param array{label: string, section: string, filter?: string}|null $action
     */
    public function __construct(
        private readonly string $id,
        private readonly string $severity,
        private readonly string $section,
        private readonly string $message,
        private readonly string $why,
        private readonly string $next,
        private readonly array $evidence = [],
        private readonly ?array $action = null,
        private readonly ?string $location = null
    ) {
    }

    public function id(): string
    {
        return $this->id;
    }

    public function rank(): int
    {
        return self::SEVERITY_ORDER[$this->severity] ?? 9;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'severity' => $this->severity,
            'section' => $this->section,
            'message' => $this->message,
            'why' => $this->why,
            'next' => $this->next,
            'location' => $this->location,
            'evidence' => $this->evidence,
            'action' => $this->action,
        ];
    }
}
