<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\App\State;
use Siteation\DebugBar\Model\Config\Source\Editor;
use Throwable;

/**
 * Every value is resolved once, in one guarded pass, and read from plain properties after
 * that. Each getter triggers that pass, so no caller has to know it must ask whether the
 * bar is enabled before asking anything else.
 *
 * Nothing may read configuration while a request is being collected. A config read can
 * miss the cache, a cache miss issues queries and dispatches events, and the query, cache
 * and event collectors would all call back in here. Reading a threshold per query is
 * enough to recurse forever the first time the config cache is cold.
 *
 * The resolving flag closes the loop for the one read that does happen, at launch, before
 * any collector is active.
 */
class Config
{
    private const XML_PATH_ENABLED = 'siteation_debugbar/general/enabled';
    private const XML_PATH_SLOW_QUERY_MS = 'siteation_debugbar/general/slow_query_ms';
    private const XML_PATH_SLOW_REQUEST_MS = 'siteation_debugbar/general/slow_request_ms';
    private const XML_PATH_ALLOWED_IPS = 'siteation_debugbar/general/allowed_ips';
    private const XML_PATH_VALUE_POLICY = 'siteation_debugbar/general/value_policy';
    private const XML_PATH_AREAS = 'siteation_debugbar/general/areas';
    private const XML_PATH_SECTIONS = 'siteation_debugbar/general/sections';

    /** @var list<string> */
    private const ALWAYS_COLLECTED = ['findings', 'overview'];
    private const XML_PATH_ACCESS_KEY = 'siteation_debugbar/general/access_key';
    private const XML_PATH_EDITOR = 'siteation_debugbar/general/editor';
    private const XML_PATH_EDITOR_TEMPLATE = 'siteation_debugbar/general/editor_template';
    private const XML_PATH_EDITOR_PATH_MAP = 'siteation_debugbar/general/editor_path_map';

    private const DEFAULT_SLOW_QUERY_MS = 100.0;
    private const DEFAULT_SLOW_REQUEST_MS = 1000.0;

    private ?bool $enabled = null;

    private bool $resolving = false;

    private float $slowQueryMs = self::DEFAULT_SLOW_QUERY_MS;

    private float $slowRequestMs = self::DEFAULT_SLOW_REQUEST_MS;

    /** @var list<string> */
    private array $allowedIps = [];

    private string $valuePolicy = Redactor::POLICY_FULL;

    /** @var list<string> */
    private array $areas = [];

    /** @var list<string> */
    private array $sections = [];

    private string $accessKey = '';

    private string $editor = '';

    private string $editorRoot = '';

    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly State $appState,
        private readonly DirectoryList $directoryList,
        private readonly int $maxProfiles = 20,
        private readonly int $maxAgeMinutes = 60
    ) {
    }

    public function isEnabled(): bool
    {
        if ($this->enabled !== null) {
            return $this->enabled;
        }

        if ($this->resolving) {
            return false;
        }

        $this->resolving = true;

        try {
            $this->enabled = $this->resolve();
        } catch (Throwable) {
            $this->enabled = false;
        } finally {
            $this->resolving = false;
        }

        return $this->enabled;
    }

    public function maxProfiles(): int
    {
        return $this->maxProfiles;
    }

    public function maxAgeMinutes(): int
    {
        return $this->maxAgeMinutes;
    }

    public function slowQueryMs(): float
    {
        $this->isEnabled();

        return $this->slowQueryMs;
    }

    public function slowRequestMs(): float
    {
        $this->isEnabled();

        return $this->slowRequestMs;
    }

    /**
     * An empty list allows everyone, which is the normal case on a developer machine.
     *
     * @return list<string>
     */
    public function allowedIps(): array
    {
        $this->isEnabled();

        return $this->allowedIps;
    }

    /**
     * Whether captured values are kept, masked, or dropped.
     */
    public function valuePolicy(): string
    {
        $this->isEnabled();

        return $this->valuePolicy;
    }

    /**
     * Which areas may be profiled. An empty list means every area, so an upgrade that
     * predates this setting keeps behaving as it did.
     *
     * @return list<string>
     */
    public function areas(): array
    {
        $this->isEnabled();

        return $this->areas;
    }

    /**
     * Which sections are wanted, as the ids the bar names them by.
     *
     * One setting for two things on purpose. A section that is off is not collected and not
     * drawn, so turning off blocks on a page that renders four hundred of them makes the
     * request being debugged cheaper as well as the panel quieter. Half a switch, where the
     * work still happened and only the tab was hidden, would be the worse half.
     *
     * Empty means all of them, so an instance that predates this setting behaves as it did.
     *
     * @return list<string>
     */
    public function sections(): array
    {
        $this->isEnabled();

        return $this->sections;
    }

    /**
     * Findings and the overview are not offered on the list and are not read from it either:
     * a profile that cannot say which request it belongs to is one the history, the report
     * and the MCP tools cannot use, and the findings are what the bar is for.
     */
    public function collects(string $section): bool
    {
        if (in_array($section, self::ALWAYS_COLLECTED, true)) {
            return true;
        }

        return $this->sections() === [] || in_array($section, $this->sections(), true);
    }

    /**
     * The secret a request proves itself with, or an empty string when none is set.
     *
     * Empty is the developer machine: there is nobody to keep out. It cannot be empty in
     * any other mode, because resolve() refuses to enable there without one.
     */
    public function accessKey(): string
    {
        $this->isEnabled();

        return $this->accessKey;
    }

    /**
     * The URL template a call site becomes a link with, or an empty string when no editor
     * is configured. `%f` is the absolute file, `%l` the line.
     */
    public function editor(): string
    {
        $this->isEnabled();

        return $this->editor;
    }

    /**
     * The root that a stored path is relative to, as the editor sees it. Inside a
     * container the application root is not the path the editor has to open, which is what
     * the path map exists to correct.
     */
    public function editorRoot(): string
    {
        $this->isEnabled();

        return $this->editorRoot;
    }

    public function allowsArea(?string $area): bool
    {
        if ($this->areas() === []) {
            return true;
        }

        return $area !== null && in_array($area, $this->areas, true);
    }

    public function allowsIp(?string $ip): bool
    {
        if ($this->allowedIps() === []) {
            return true;
        }

        return $ip !== null && in_array($ip, $this->allowedIps, true);
    }

    /**
     * Deploy mode comes from env.php, so the primary gate costs no cache or database read.
     */
    private function resolve(): bool
    {
        if (!$this->scopeConfig->isSetFlag(self::XML_PATH_ENABLED)) {
            return false;
        }

        $this->accessKey = trim((string) $this->scopeConfig->getValue(self::XML_PATH_ACCESS_KEY));

        // Keyless is a developer machine and nothing else. Anywhere else the bar is
        // reachable on one condition, that a key exists, so it answers whoever holds it and
        // nobody else. Refusing outright would be safe and would also mean a live site could
        // not be debugged at all.
        //
        // The rule is "not developer" rather than "is production" because default mode is
        // the third one, is what MAGE_MODE falling back lands on, and is what plenty of live
        // sites actually run. Keying off production alone left those wide open.
        if ($this->appState->getMode() !== State::MODE_DEVELOPER && $this->accessKey === '') {
            return false;
        }

        $this->slowQueryMs = $this->positiveFloat(
            $this->scopeConfig->getValue(self::XML_PATH_SLOW_QUERY_MS),
            self::DEFAULT_SLOW_QUERY_MS
        );
        $this->slowRequestMs = $this->positiveFloat(
            $this->scopeConfig->getValue(self::XML_PATH_SLOW_REQUEST_MS),
            self::DEFAULT_SLOW_REQUEST_MS
        );
        $this->allowedIps = $this->ipList($this->scopeConfig->getValue(self::XML_PATH_ALLOWED_IPS));
        $this->valuePolicy = $this->policy($this->scopeConfig->getValue(self::XML_PATH_VALUE_POLICY));
        $this->areas = $this->csv($this->scopeConfig->getValue(self::XML_PATH_AREAS));
        $this->sections = $this->csv($this->scopeConfig->getValue(self::XML_PATH_SECTIONS));
        $this->editor = $this->editorTemplate();
        $this->editorRoot = $this->mappedRoot();

        return true;
    }

    private function editorTemplate(): string
    {
        $choice = (string) $this->scopeConfig->getValue(self::XML_PATH_EDITOR);

        if ($choice === Editor::CUSTOM) {
            return trim((string) $this->scopeConfig->getValue(self::XML_PATH_EDITOR_TEMPLATE));
        }

        return Editor::EDITORS[$choice]['template'] ?? '';
    }

    /**
     * The map is `container:host` pairs, and the first one that matches the root wins.
     * Only the root is mapped: a stored path is relative to it, so mapping the root maps
     * every path built on it.
     */
    private function mappedRoot(): string
    {
        try {
            $root = rtrim($this->directoryList->getRoot(), '/');
        } catch (Throwable) {
            return '';
        }

        foreach ($this->csv($this->scopeConfig->getValue(self::XML_PATH_EDITOR_PATH_MAP)) as $pair) {
            [$from, $to] = array_pad(explode(':', $pair, 2), 2, '');
            $from = rtrim(trim($from), '/');
            $to = rtrim(trim($to), '/');

            if ($from !== '' && $to !== '' && str_starts_with($root, $from)) {
                return $to . substr($root, strlen($from));
            }
        }

        return $root;
    }

    private function policy(mixed $value): string
    {
        $allowed = [Redactor::POLICY_FULL, Redactor::POLICY_MASKED, Redactor::POLICY_NONE];

        return is_string($value) && in_array($value, $allowed, true)
            ? $value
            : Redactor::POLICY_FULL;
    }

    /**
     * @return list<string>
     */
    private function ipList(mixed $value): array
    {
        return $this->csv($value);
    }

    /**
     * @return list<string>
     */
    private function csv(mixed $value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map('strval', $value)));
        }

        if (!is_string($value) || trim($value) === '') {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode(',', $value))));
    }

    private function positiveFloat(mixed $value, float $fallback): float
    {
        return is_numeric($value) && (float) $value > 0 ? (float) $value : $fallback;
    }
}
