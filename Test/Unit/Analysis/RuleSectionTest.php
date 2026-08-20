<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Analysis;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * A finding names the panel that shows it, and that panel is declared in JavaScript. Nothing
 * else connects the two sides, so a rule can name a panel that does not exist and the only
 * symptom is a finding that is counted and never drawn. That is what happened to the two
 * findings a 500 produces, for as long as the bar has had panels.
 *
 * Reading the JavaScript from PHP is the ugly part and the whole point: the list has one
 * home, and this fails the moment a rule stops agreeing with it.
 */
class RuleSectionTest extends TestCase
{
    #[Test]
    public function everySectionARuleNamesIsAPanelThatExists(): void
    {
        $sections = $this->declaredSections();

        $this->assertContains('overview', $sections, 'the section list was not parsed');

        foreach ($this->emittedSections() as $rule => $emitted) {
            foreach ($emitted as $section) {
                $this->assertContains(
                    $section,
                    $sections,
                    $rule . ' produces findings for a panel that does not exist'
                );
            }
        }
    }

    #[Test]
    public function noPanelIsGradedThatNoRuleCanReach(): void
    {
        $graded = array_diff($this->declaredSections(), $this->ungradedSections(), ['findings']);
        $reached = array_unique(array_merge(...array_values($this->emittedSections())));

        sort($graded);
        sort($reached);

        // A graded panel that no rule reaches renders "No clear problem found", which is a
        // verdict nobody wrote the rule to give.
        $this->assertSame($reached, $graded);
    }

    /**
     * @return list<string>
     */
    private function declaredSections(): array
    {
        preg_match_all("/^\s*id: '([a-z]+)',$/m", $this->sectionsSource(), $matches);

        return $matches[1];
    }

    /**
     * @return list<string>
     */
    private function ungradedSections(): array
    {
        preg_match_all(
            "/id: '([a-z]+)',(?:(?!\n  \},).)*?graded: false/s",
            $this->sectionsSource(),
            $matches
        );

        return $matches[1];
    }

    private function sectionsSource(): string
    {
        $path = dirname(__DIR__, 3) . '/src-js/src/sections.js';

        $this->assertFileExists($path);

        return (string) file_get_contents($path);
    }

    /**
     * The third argument to Finding's constructor, per rule.
     *
     * @return array<string, list<string>>
     */
    private function emittedSections(): array
    {
        $emitted = [];

        foreach (glob(dirname(__DIR__, 3) . '/Analysis/Rule/*.php') ?: [] as $path) {
            $source = (string) file_get_contents($path);

            preg_match_all(
                "/new Finding\(\s*'[^']*',\s*[^,]+,\s*'([a-z]+)'/",
                $source,
                $matches
            );

            $emitted[basename($path, '.php')] = $matches[1];
        }

        $this->assertNotEmpty($emitted, 'no rules were found to check');

        return $emitted;
    }
}
