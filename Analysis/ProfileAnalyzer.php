<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis;

use Psr\Log\LoggerInterface;
use Siteation\DebugBar\Api\RuleInterface;
use Throwable;

/**
 * Runs every rule over a finished profile and ranks what comes back.
 *
 * A rule that throws is skipped rather than allowed to take the profile with it: a missing
 * finding is a small loss, a lost profile is the whole point of the request.
 */
class ProfileAnalyzer
{
    /**
     * @param array<string, RuleInterface> $rules
     */
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly array $rules = [],
        private readonly int $maxFindings = 50
    ) {
    }

    /**
     * @param array<string, mixed> $profile
     * @return list<array<string, mixed>>
     */
    public function analyze(array $profile): array
    {
        $findings = [];

        foreach ($this->rules as $name => $rule) {
            try {
                $produced = $rule->apply($profile);
            } catch (Throwable $exception) {
                // With the exception, as HttpPlugin logs it: a rule that starts throwing
                // leaves nothing else behind, and "Undefined array key" with no file or
                // line is the hunt this module exists to spare someone.
                $this->logger->warning(
                    sprintf('Siteation_DebugBar rule %s failed: %s', $name, $exception->getMessage()),
                    ['exception' => $exception]
                );

                continue;
            }

            foreach ($produced as $finding) {
                $findings[] = $finding;
            }
        }

        usort($findings, static fn (Finding $left, Finding $right): int
            => $left->rank() <=> $right->rank());

        $result = [];

        foreach ($findings as $finding) {
            if (count($result) >= $this->maxFindings) {
                break;
            }

            $result[] = $finding->toArray();
        }

        return $result;
    }
}
