<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Api;

use Siteation\DebugBar\Analysis\Finding;

/**
 * Turns a captured profile into findings.
 *
 * Rules are registered through di.xml so a project can add its own without touching the
 * module, and each one owns a single cause. Two rules must never describe the same
 * problem: a developer reading two findings assumes there are two problems.
 */
interface RuleInterface
{
    /**
     * @param array<string, mixed> $profile
     * @return list<Finding>
     */
    public function apply(array $profile): array;
}
