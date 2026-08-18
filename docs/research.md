# Debug bar research

Prior art, framework hooks and code patterns collected before building
`Siteation_DebugBar`. Everything below was read from source, not from marketing pages.

## 1. Prior art

| Project | Stack | License | Verdict |
| --- | --- | --- | --- |
| [newdebugbar/newdebugbar](https://github.com/newdebugbar/newdebugbar) | Laravel, Livewire 4, Tailwind 4, Vite, MCP | Apache-2.0 | Copy the architecture and the UX. Not the framework. |
| [Smile-SA/magento2-module-debug-toolbar](https://github.com/Smile-SA/magento2-module-debug-toolbar) | Magento, phtml, vanilla JS | EPL-2.0 | Best source of Magento collection hooks. UI is dated. |
| [fruitcake/magento2-debugbar](https://github.com/fruitcake/magento2-debugbar) | Magento, php-debugbar 2.1 | OSL-3.0 | Good injection and query backtrace patterns. Unmaintained (0 stars, 81 commits). |
| [yongchengchen/magento2debugbar](https://github.com/yongchengchen/magento2debugbar) | Magento, php-debugbar | | Hijacks the ObjectManager and the router. Do not copy. |
| [swissup/module-ignition](https://github.com/swissup/module-ignition) | Magento, spatie/ignition | MIT | The reference for error pages, CSP nonces and solution providers. |

### What New Debug Bar actually does differently

The video sells the look. The source shows the real ideas, and they port cleanly to Magento.

1. **Profile per request, stored, not rendered inline.** Every request writes one JSON
   profile. The bar in the page is a thin viewer over a stored document. That decouples
   collection from presentation, gives you history for free, and makes AJAX and GraphQL
   requests inspectable.
2. **Findings, not tabs.** A separate analysis pass turns raw collected data into ranked
   findings that answer five questions: what happened, what is wrong, why, where, what next.
   The tabs are the evidence behind the finding, not the product.
3. **MCP as a first-class feature.** The same profiles are exposed read-only over MCP so a
   coding agent reads exact data instead of guessing. They measured 68% fewer tokens than
   dumping full profiles.
4. **Bounded everything.** Every collector caps items, tracks how many it dropped, and
   reports `truncated`. Every MCP response is capped in items and bytes. Nothing can blow up.
5. **Redaction at record time**, not at render time.

Their own `AGENTS.md` product rules are worth stealing verbatim:

> Help developers answer: What happened? What is wrong? Why? Where? What should I check next?
> Show the request, errors, query count, and time first.
> Keep framework details, raw data, hashes, and repeated facts out of the main view.
> A finding should explain the problem, why it matters, where it came from, and what to do next.
> Do not show two findings for the same cause.
> Do not use `·`, `•`, or `|` to split facts. Use space, labels, icons, or groups.

## 2. Local stack facts

Verified against this instance.

* Magento 2.4.9, PHP 8.3/8.4, developer mode.
* Hyvä default theme 3.0.0, Tailwind CSS 4.3 (Oxide), `@hyva-themes/hyva-modules` 1.4.
* Alpine bundled by Hyvä: **3.14.3**, and a **CSP build** ships alongside
  (`alpine3-csp.min.js`). The theme picks the variant through
  `ThemeLibrariesConfig::getVersionIdFor('alpine')`.
* Alpine is loaded as `<script type="module" defer crossorigin>` in `before.body.end`.
  Anything registering `Alpine.data()` must run before `alpine:init` fires.
* `Magento_Csp` is present.
* Nebula ([qoliber/nebula-admin-theme](https://github.com/qoliber/nebula-admin-theme)) is
  the admin theme target: Alpine 3, Tailwind 4, native ES modules, no RequireJS, no
  Knockout, no jQuery, Magento 2.4.7+. Source-available under the Nebula Community License.

**Consequence:** frontend and admin converge on the same stack, so one Alpine 3 plus
Tailwind 4 debug bar covers both areas. It must not depend on the host theme's Alpine,
because it also has to work on Luma and on a page where the theme's JS threw.

## 3. Magento collection hooks

The interesting part. All verified present in 2.4.9.

### 3.1 Database queries

Two options. Prefer the first.

**`Magento\Framework\DB\LoggerInterface`.** The PDO adapter calls `startTimer()` then
`logStats()` around every query, unconditionally, in a `finally`. Verified in
`vendor/magento/framework/DB/Adapter/Pdo/Mysql.php:691`:

```php
protected function _query($sql, $bind = [])
{
    $result = null;
    try {
        $this->_checkDdlTransaction($sql);
        $this->_prepareQuery($sql, $bind);
        $this->logger->startTimer();
        $result = $this->performQuery(fn () => parent::query($sql, $bind));
    } finally {
        $this->logger->logStats(LoggerInterface::TYPE_QUERY, $sql, $bind, $result);
    }

    return $result;
}
```

It also fires for `TYPE_CONNECT` and `TYPE_TRANSACTION` (BEGIN, COMMIT, ROLLBACK), so
transactions and rollbacks come free. A plugin on the interface needs no `env.php` change
and does not fight the `db_logger` setting:

```xml
<type name="Magento\Framework\DB\LoggerInterface">
    <plugin name="siteation_debugbar_query_collector"
            type="Siteation\DebugBar\Plugin\Db\LoggerPlugin"
            sortOrder="1"/>
</type>
```

```php
public function beforeStartTimer(LoggerInterface $subject): array
{
    $this->queries->markStart();

    return [];
}

public function afterLogStats(
    LoggerInterface $subject,
    $result,
    $type,
    $sql,
    $bind = [],
    $queryResult = null
) {
    $this->queries->record($type, (string) $sql, (array) $bind);

    return $result;
}
```

**`Zend_Db_Profiler`.** Still shipped (`vendor/magento/zend-db`). Fruitcake subclasses it to
attach a backtrace per query, enabled from `app/etc/env.php`:

```php
'profiler' => [
    'class' => 'Fruitcake\\MagentoDebugbar\\Profiler\\QueryProfiler',
    'enabled' => true,
]
```

Requiring an `env.php` edit is a worse install story. Use it only if `LoggerInterface`
turns out to miss something.

### 3.2 Query call site

Fruitcake's exclude-path walk is the pattern worth keeping. Grab 50 frames, drop framework
and generated code, keep the first 5 application frames:

```php
protected $backtraceExcludePaths = [
    '/vendor/magento/zend-db/',
    '/vendor/magento/framework/',
    '/generated/code/Magento/Framework/',
    '/generated/code/Magento/Eav/',
    '/generated/code/Magento/Config/Model/ResourceModel',
    '/vendor/magento/framework/Data/',
    '/generated/code/Magento/Customer/Model/ResourceModel/',
    __DIR__,
];

protected function findSource()
{
    $stack = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS | DEBUG_BACKTRACE_PROVIDE_OBJECT, 50);

    $sources = [];
    foreach ($stack as $index => $trace) {
        $sources[] = $this->parseTrace($index, $trace);
    }

    return array_slice(array_filter($sources), 0, 5);
}
```

New Debug Bar makes this configurable and bounded: `call_site_frames: 5`,
`call_site_scan_limit: 40`. Same idea, better named. Adopt those two knobs.

### 3.3 Events and observers

Smile splits this cleanly into two plugins. `ManagerInterface` gives every dispatched event
including the ones nobody listens to. `InvokerInterface` gives every observer that actually
ran, with its own timing.

```xml
<type name="Magento\Framework\Event\ManagerInterface">
    <plugin name="..." type="...\Plugin\Event\ManagerPlugin" sortOrder="1"/>
</type>
<type name="Magento\Framework\Event\InvokerInterface">
    <plugin name="..." type="...\Plugin\Event\InvokerPlugin" sortOrder="1"/>
</type>
```

```php
public function aroundDispatch(
    MagentoInvoker $subject,
    Closure $closure,
    array $configuration,
    MagentoObserver $observer
): mixed {
    if (($configuration['disabled'] ?? false) === true) {
        return $closure($configuration, $observer);
    }

    $eventName = $observer->getEvent()->getName();
    $observerInstance = $configuration['instance'];
    $observerName = $configuration['name'] ?? $observerInstance;

    $this->observerHelper->initObserverStat($eventName, $observerName, $observerInstance, false);

    $startTime = microtime(true);
    $result = $closure($configuration, $observer);
    $this->observerHelper->addObserverStat($eventName, $observerName, microtime(true) - $startTime);

    return $result;
}
```

**Trap, from Smile's own comment:** you cannot check "is the module enabled" inside these
plugins, because the config read hits the cache, and the cache plugin dispatches events.
Infinite loop. Resolve enablement once, early, and hold it in a property.

### 3.4 Cache

```xml
<type name="Magento\Framework\App\CacheInterface">
    <plugin name="..." type="...\Plugin\App\CachePlugin" sortOrder="1"/>
</type>
```

`aroundLoad`, `aroundSave`, `aroundRemove`, each timing the closure and recording
identifier plus payload size. A load returning an empty string is a miss, which gives you
a hit rate. New Debug Bar turns that into a finding: warn only after 5 or more operations
and above an 80% miss rate, so one small lookup does not create noise.

### 3.5 Layout, blocks and templates

Fruitcake reflects into the layout structure on `layout_generate_blocks_after` and walks
the tree from `root`:

```php
$reflection = new \ReflectionClass($this->layout);
$structure = $reflection->getProperty('structure');
$structure->setAccessible(true);
$structure = $structure->getValue($this->layout);

$this->elements = $structure->exportElements();

if (isset($this->elements['root'])) {
    $this->addChildren($this->elements['root']);
}
```

Then for every child with `getTemplateFile()`, record name, template, type and element data.
Reflection on a private property is fragile across versions. Check whether
`Magento\Framework\View\Layout\Data\Structure` can be reached through a public path in
2.4.9 before shipping this.

### 3.6 Plugins and preferences

Smile reflects into `PluginListInterface` to list every intercepted type, which plugin
applies and whether each method is before, around or after:

```php
$reflectionClass = new ReflectionClass($this->pluginList);

$definitions = $reflectionClass->getProperty('_definitions')->getValue($this->pluginList);
$pluginInstances = $reflectionClass->getProperty('_pluginInstances')->getValue($this->pluginList);

foreach ($pluginInstances as $type => $pluginList) {
    foreach ($pluginList as $pluginName => $pluginInstance) {
        $methods = $definitions->getMethodList($pluginInstance);
        // DefinitionInterface::LISTENER_BEFORE | LISTENER_AROUND | LISTENER_AFTER
    }
}
```

This is the single most useful Magento-specific panel and nothing else provides it. It is
also the most likely to break on upgrade, so isolate it behind an interface and let it fail
soft.

### 3.7 Timers and the profiler

Smile starts the master timer with a `beforeLaunch` plugin on `Magento\Framework\App\Http`
and stops it in the response observer, before building the toolbar, so the bar does not
measure itself:

```php
// We do not want the toolbar to have an impact on stats => stop the main timer
$this->dataHelper->stopTimer('app_http');

$this->dataHelper->startTimer('profiler_build');
$this->profilerHelper->computeStats();
$this->dataHelper->stopTimer('profiler_build');
```

Magento's own `Magento\Framework\Profiler` gives nested timers for free when
`MAGE_PROFILER` is set. Smile ships an override of
`Profiler\Driver\Standard\Stat` because the core one is not PHP 8.1 clean. Check whether
that is still needed on 2.4.9 before copying it.

### 3.8 Response injection

Three approaches seen.

Smile uses `controller_front_send_response_before` and stores the toolbar to disk:

```xml
<event name="controller_front_send_response_before">
    <observer name="..." instance="Smile\DebugToolbar\Observer\AddToolbar"/>
</event>
```

Fruitcake plugs the response, frontend area only:

```xml
<type name="Magento\Framework\App\ResponseInterface">
    <plugin name="..." type="...\Plugin\ResponsePlugin" sortOrder="99"/>
</type>
```

```php
public function beforeSendResponse(ResponseInterface $response)
{
    $this->debugbar->modifyResponse($response);
}
```

New Debug Bar's `BarInjector` has the most careful guard set, and it is framework
independent. Port it directly:

```php
public function supports(Response $response): bool
{
    if ($response instanceof BinaryFileResponse || $response instanceof StreamedResponse) {
        return false;
    }
    if ($response->isRedirection()) {
        return false;
    }
    if (str_contains(strtolower((string) $response->headers->get('Content-Disposition')), 'attachment')) {
        return false;
    }
    $contentType = strtolower((string) $response->headers->get('Content-Type'));
    if ($contentType !== '' && ! str_contains($contentType, 'text/html')) {
        return false;
    }

    return preg_match('/<\/body\s*>/i', (string) $response->getContent()) === 1;
}
```

Injection itself: assets before `</head>`, bar before `</body>`, then

```php
$response->headers->remove('Content-Length');
$response->headers->set('X-NewDebugBar-Profile', $profileId);
```

The **profile id response header** is the key detail. It is how an agent, a browser
extension or an AJAX viewer correlates a request to its stored profile without guessing
"the newest one". Ship the equivalent header from day one.

## 4. CSP

Magento 2.4.9 ships `Magento_Csp` and Hyvä ships a CSP Alpine build. Two rules follow.

**Never inject inline `<script>`.** Serve the JS and CSS as real files and pass the profile
as non-executable JSON:

```html
<script type="application/json" id="siteation-debugbar-profile">{...}</script>
<script type="module" src="/static/.../debugbar.js" defer></script>
```

`type="application/json"` is data, not script, so no nonce and no `unsafe-inline` is needed.
This is strictly better than what any of the prior art does.

**If an inline script is ever unavoidable**, Ignition shows the Magento nonce dance,
including saving the nonce for a later error page:

```php
class CspNonceProvider
{
    public function afterGenerateNonce(\Magento\Csp\Helper\CspNonceProvider $subject, string $nonce)
    {
        $this->nonceProvider->saveNonce($nonce);

        return $nonce;
    }
}
```

```php
$html = str_replace(
    '<script>',
    "<script nonce='{$this->nonceProvider->generateNonce()}'>",
    ob_get_clean()
);
```

External hosts need `etc/csp_whitelist.xml`:

```xml
<csp_whitelist xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Csp:etc/csp_whitelist.xsd">
    <policies>
        <policy id="connect-src">
            <values>
                <value id="ingress_flareapp_io" type="host">ingress.flareapp.io</value>
            </values>
        </policy>
    </policies>
</csp_whitelist>
```

We should need none of these.

## 5. Alpine in a debug bar

### 5.1 Isolation

The bar cannot borrow the page's Alpine. Hyvä's Alpine may be the CSP build, may be a
different minor, and on a broken page may never boot. Bundle Alpine 3.14 into the debug bar
asset and give it its own directive prefix so the two instances never see each other's
markup:

```js
import Alpine from 'alpinejs'

Alpine.prefixed('data-ndb-')     // page uses x-, we use data-ndb-
Alpine.data('debugBar', debugBar)
Alpine.start()
```

That also keeps us CSP-safe by construction, because everything lives in registered
`Alpine.data()` components with no inline expressions.

### 5.2 Component shape

New Debug Bar's `state.js` is one 995 line `Alpine.data()` factory. It is the direct model
for our bar. Its state, abbreviated:

```js
{
  barVisible: true,
  inspectorOpen: false,
  selected: 'overview',
  theme: 'system',            // system | light | dark
  resolvedTheme: 'light',
  toolbarPlacement: 'bottom',
  favorites: [],              // drag-reorderable pinned sections
  queryFilter: 'all',         // all | slow | repeated
  querySearch: '',
  querySort: 'execution',
  paletteOpen: false,         // command palette
  paletteSearch: '',
  paletteIndex: 0,

  init() {},
  restore() {},               // localStorage: 'newdebugbar.preferences.v1'
  persist() {},
  isFavorite(key) {},
  selectSection(section, filter = null, focusHeading = false) {},
  navigateToSection(section, filter = null) {},
  openInspector(section, returnFocus = null) {},
}
```

Two details worth copying exactly:

**Host locking.** When the inspector opens full screen it marks every sibling of the bar
`inert`, locks body scroll and compensates for the scrollbar width, then restores all of it
on close. That is what makes it feel like an app rather than an overlay:

```js
lockHost: (root) => {
  if (!root || root.__newDebugBarHostLock) return

  const body = document.body
  const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
  const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight, inert: [] }

  ;[...body.children].forEach((element) => {
    if (element === root || element.contains(root)
      || !(element instanceof HTMLElement)
      || element.matches('script, style, link')) return

    previous.inert.push([element, element.inert])
    element.inert = true
  })

  body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    body.style.paddingRight =
      `${Number.parseFloat(window.getComputedStyle(body).paddingRight || '0') + scrollbarWidth}px`
  }

  root.__newDebugBarHostLock = previous
}
```

**Flash prevention.** One tiny critical style, injected in the head, before the stylesheet:

```html
<style id="newdebugbar-critical-css">#newdebugbar [x-cloak]{display:none!important}</style>
```

### 5.3 Syntax highlighting

`highlight.js/lib/core` with only `sql`, `json` and a hand-rolled 30 line PHP grammar
registered, driven off a data attribute:

```js
window.newDebugBarHighlight = (root = document) => {
  root.querySelectorAll('code[data-ndb-language]:not([data-highlighted])').forEach((block) => {
    block.classList.add(`language-${block.dataset.ndbLanguage}`)
    hljs.highlightElement(block)
  })
}
```

Registering three languages instead of the full bundle is the difference between ~20 kB and
~900 kB.

### 5.4 Alpine dev tools

The two links you collected, [@designbycode/alpine-debug](https://www.jsdelivr.com/package/npm/@designbycode/alpine-debug)
and [Alpine Toolbox](https://www.alpinetoolbox.com/dist/tools/), inspect Alpine component
state in the page. That is a different product from a request debug bar, but it is a good
candidate for a later panel: list every `x-data` root on the page with its live state, which
would be genuinely useful on Hyvä and has no Magento equivalent today.

## 6. Storage

Three shapes seen.

Smile writes rendered HTML per execution to `var/smile_toolbar` and keeps the last 5.
Fruitcake writes php-debugbar JSON to `var/debugbar` through Magento's `Filesystem`,
unbounded. New Debug Bar writes one JSON document per request, atomically, private, pruned
by both count and age.

New Debug Bar's `ProfileStore` is the one to port. The important properties:

* Directory created `0700`, files `0600`.
* Write to `$destination.'.'.bin2hex(random_bytes(6)).'.tmp'` then `rename()`, so a reader
  never sees a half-written profile.
* UUIDv4 ids validated by regex on every read and write, which makes the id safe to take
  from an HTTP request.
* Prune on every write, by `max_profiles` (20) and `max_age_minutes` (60).
* `withWriteLock()` using `flock` on a lock file for the rare concurrent update.

```php
public const ID_PATTERN =
    '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}';

public const ID_REGEX = '/\A'.self::ID_PATTERN.'\z/';
```

For Magento, write under `var/` through `Magento\Framework\Filesystem` so it respects
`DirectoryList` and remote filesystems, but keep the atomic rename and the pruning.

## 7. Collector contract

Small and worth copying almost verbatim.

```php
interface Collector
{
    public function key(): string;
    public function label(): string;
    public function reset(): void;

    /** @param array<string, mixed> $item */
    public function record(array $item): void;

    /** @return array<string, int|float|string> */
    public function summary(): array;

    /** @return array{items: array<int, array<string, mixed>>, dropped: int} */
    public function payload(): array;
}
```

The abstract base does redaction and bounding once, for every collector, and keeps the
*totals* accurate even when items are dropped:

```php
public function record(array $item): void
{
    $safeItem = $this->redactor->clean($item);
    $this->track($safeItem);                    // totals always updated

    if ($this->retainedCount() >= $this->maxItems) {
        $this->dropped++;                       // ... but the item is not kept

        return;
    }

    $this->items[] = $safeItem;
}

public function summary(): array
{
    $retained = count($this->items);

    return [
        'count' => $retained + $this->dropped,
        'retained_count' => $retained,
        'dropped_count' => $this->dropped,
        'truncated' => $this->dropped > 0,
    ];
}
```

`truncated` in the payload is what lets the UI and an agent say "there were 900 queries, I
am showing 500" instead of silently lying. Their agent skill calls this out explicitly:
"a collector limit does not mean application data is missing".

In Magento, collectors register through `di.xml` array arguments, exactly how Smile
registers its zones:

```xml
<type name="Siteation\DebugBar\Model\ProfileManager">
    <arguments>
        <argument name="collectors" xsi:type="array">
            <item name="request" xsi:type="object" sortOrder="10">Siteation\DebugBar\Collector\RequestCollector</item>
            <item name="queries" xsi:type="object" sortOrder="20">Siteation\DebugBar\Collector\QueryCollector</item>
        </argument>
    </arguments>
</type>
```

## 8. Analysis: the actual differentiator

### 8.1 Query analysis

`QueryAnalyzer` normalizes whitespace, fingerprints `sha256(normalized_sql + "\0" + connection)`
truncated to 16 chars, and groups by fingerprint. Per query it derives `slow`,
`repeated_count`, `query_time_percent`, `request_time_percent`, `query_type` (read or write,
including `WITH ... INSERT` handling).

The N+1 heuristic is three conditions, and the conservatism is the point:

```php
'likely_n_plus_one' => count($executions) >= 3
    && $bindingsVary
    && $hasSharedCallSite,
```

Same SQL shape, at least three times, **different bindings**, **from one call site**. Same
SQL from many call sites is not an N+1, and identical bindings repeated is a caching problem
rather than an N+1. Their own agent skill warns that chunked and paginated queries still
trip this, so it is labelled "likely".

Group level output carries `extra_executions` (count minus one), which is the number the
developer can actually remove.

### 8.2 Findings

Every finding has the same shape: id, severity, section, message, evidence, and a why /
location / next / action block.

```php
$findings[] = $this->finding(
    'query.slow',
    'warning',
    'queries',
    sprintf('%d queries exceeded the %s ms query threshold.', count($slowQueries), $threshold),
    ['count' => count($slowQueries), 'threshold_ms' => $threshold, 'fingerprints' => [...]],
    [
        'why' => sprintf('The slowest query took %s ms.', $slowestMs),
        'location' => $slowest['callsite'] ?? null,
        'next' => 'Review the SQL, bindings, call site, and database plan.',
        'action' => ['label' => 'Review slow queries', 'section' => 'queries', 'filter' => 'slow'],
    ],
);
```

`action` is what makes the finding clickable: it names the section and the filter to apply.
Findings are ordered errors first, then warnings, and capped at `max_findings: 50`.

Rule ids seen: `exception.captured`, `request.error`, `runtime.error`, `http.failed`,
`authorization.denied`, `validation.failed`, `request.slow`, `runtime.slow`, `query.slow`,
plus repeated-query and cache-miss rules.

Magento equivalents worth adding, none of which exist in any current tool:

* `cache.disabled` when a cache type is off in developer mode and it is costing measurable time.
* `layout.cache_miss` on a full layout rebuild.
* `plugin.heavy` when one interceptor dominates a request.
* `collection.loaded_in_loop`, the Magento shape of N+1.
* `block.uncacheable` when an uncacheable block kills full page cache for the whole page.
* `indexer.invalid` when an invalid indexer explains slow reads.

## 9. MCP

New Debug Bar uses `laravel/mcp` over **stdio**, four tools, all read-only:

```
list-debug-profiles
get-debug-profile-section
inspect-debug-queries
get-debug-findings
```

```php
protected string $instructions = 'Read bounded, redacted Laravel debug profiles. Use the exact profile ID from the X-NewDebugBar-Profile response header when correlating a request.';
```

Tools are annotated `#[IsReadOnly]` and `#[IsOpenWorld(false)]`, and every response is
double-bounded, by item count and by byte budget, dropping items until the response fits:

```php
while ($this->byteLength($response) > $this->maxBytes && $summaries !== []) {
    array_pop($summaries);
    $response = $this->profileListResponse($summaries, $total, true);
}
```

Defaults: `max_items: 50`, `max_bytes: 100_000`. Responses are versioned
(`RESPONSE_VERSION = 1`).

Client wiring is just a command:

```bash
claude mcp add --scope local newdebugbar -- php /abs/path/artisan mcp:start newdebugbar
```

For Magento there is no `laravel/mcp`. Options:

* [`mcp/sdk`](https://packagist.org/packages/mcp/sdk), the official PHP SDK from the MCP
  project and the PHP Foundation, framework agnostic, still pre-1.0.
* [`php-mcp/server`](https://github.com/php-mcp/server), PHP 8 attributes, stdio and HTTP
  transports, more mature in practice.

Either way the server becomes a `bin/magento siteation:debugbar:mcp` console command that
speaks stdio, and the client config is:

```json
{
  "mcpServers": {
    "siteation-debugbar": {
      "command": "php",
      "args": ["/abs/path/bin/magento", "siteation:debugbar:mcp"]
    }
  }
}
```

Because Magento boots slowly, bump `startup_timeout_sec` well above their 15.

Their agent-facing `SKILL.md` is worth mirroring as a skill in our repo. Its best rules:

> Set small limits instead of accepting maximums. Start with 10 profile summaries, 10
> findings, and 5 items from a section or query search.
> Read findings first, then the smallest useful section.
> Treat a finding as a lead, not a verdict.
> Compare query time with total request time. If queries are a small share, inspect
> lifecycle, models, events, and views before blaming the database.

## 10. Error page

Ignition wraps the whole app in `aroundLaunch` because Magento's own `catchException` does
not handle `Throwable`:

```php
public function aroundLaunch(AppHttp $subject, Closure $proceed)
{
    $this->registerErrorHandler();

    try {
        return $proceed();
    } catch (Throwable $e) {
        // Can't rely on Magento's app->catchException in Magento/Framework/App/Bootstrap::run
        // because it doesn't handle Throwable types.
        $this->handleThrowable($e);
    }
}
```

Solution providers are plain `HasSolutionsForThrowable` classes wired by `di.xml`:

```php
class DbTableNotFoundSolutionProvider implements HasSolutionsForThrowable
{
    public function canSolve(Throwable $throwable): bool
    {
        return $throwable instanceof TableNotFoundException;
    }

    public function getSolutions(Throwable $throwable): array
    {
        return [new RunSetupUpdgradeSolution('A table was not found')];
    }
}
```

Their agent affordance is also worth copying: a `window.swissupIgnition` object exposing the
stack trace, plus hidden DOM nodes with stable ids so a browser agent can read the error
without evaluating JS.

Decision to make: build our own error page, or detect `swissup/module-ignition` and hand off
to it. Handing off is cheaper and Ignition is already good.

## 11. Things to avoid

* **Do not hijack the ObjectManager or the router.** `yongchengchen/magento2debugbar` ships
  `Framework/ClassHijacker.php`, `RouterListHijacker.php` and a stand-in ObjectManager. It
  is unmaintainable and it will not survive an upgrade.
* **Do not render the bar through the layout.** Smile has to ship a fake
  `Layout\BuilderInterface` just to avoid a layout rebuild while rendering its own toolbar.
  Rendering from stored JSON in JS sidesteps the entire problem.
* **Do not `echo` and `exit` on failure.** Smile's `AddToolbar` does
  `echo json_encode($e->getMessage()); exit;` when the toolbar throws, which destroys the
  page you were debugging. Fail soft, always.
* **Do not gate on config inside the event or cache plugins.** Cache reads dispatch events.
  Resolve enablement once at launch.
* **Do not depend on php-debugbar.** Its widget system is jQuery era and it dictates the UX.
  The whole point of copying New Debug Bar is that they wrote their own.

## 12. Direct recommendations

1. Store one bounded, redacted JSON profile per request. The in-page bar is a viewer.
2. Return `X-Siteation-DebugBar-Profile` on every profiled response.
3. Bundle our own Alpine 3 with a `data-ndb-` prefix. Never inline a script. Pass data as
   `<script type="application/json">`.
4. Collect through `DB\LoggerInterface`, `Event\ManagerInterface`, `Event\InvokerInterface`,
   `App\CacheInterface`, plus layout and interception reflection behind fail-soft interfaces.
5. Ship findings, not just tabs, and make every finding clickable into its evidence.
6. Ship the MCP server in the first release, not as a follow-up. It is the reason to build
   this rather than install Smile's.
7. Tailwind 4 with a `ndb-` prefix, compiled and committed, so installing needs no build step.
   Nebula proves the "ships with compiled assets, install and go" model works in Magento.

## 13. Corrections from the POC

Four things the reading got wrong, each found by running the code against Magento 2.4.9,
Hyvä 3.0 and Alpine 3.14.3 on a real store.

### 13.1 An `after` plugin on `App\Http::launch()` cannot work

The plan called `afterLaunch` the ideal place to finalise and inject, because
`Bootstrap::run()` calls `launch()` before `sendResponse()`. It fails immediately:

```
ErrorException: Undefined array key "Magento\Framework\App\Http"
  in vendor/magento/framework/Interception/PluginList/PluginList.php on line 174
```

The cause is a scope reload halfway through the call.

1. The interceptor calls `PluginList::getNext()`, which runs `_loadScopedData()` at the
   primary scope and then lazily fills `_inherited['Magento\Framework\App\Http']`, because
   `App\Http` is not among the bulk `getClassDefinitions()` classes.
2. `launch()` then does `$this->_state->setAreaCode($areaCode)` and
   `$this->_objectManager->configure($this->_configLoader->load($areaCode))`.
3. The next `getNext()` anywhere in the request sees a new scope, and `_loadScopedData()`
   overwrites `_inherited` wholesale from the newly scoped cache. That cache has no entry
   for `App\Http`, because the entry only ever existed as a lazy addition.
4. Control returns to `Interceptor::___callPlugins()` line 144, the `after` branch. It
   calls `getPlugin()` directly, and `getPlugin()` never calls `_loadScopedData()`, so it
   reads straight into the hole.

`around` is resolved at line 133, before step 2, so it survives. This is exactly why
Ignition uses `aroundLaunch` and why Smile keeps its response work in a
`controller_front_send_response_before` observer rather than an after plugin.

**Use one `aroundLaunch` plugin.** Begin before `$proceed()`, finalise after it.

### 13.2 A full page cache hit produces a broken asset URL

`Asset\Repository::getUrl()` builds `frontend/_view/en_US/...` on an FPC hit, and
`pub/static.php` answers `Requested path ... is wrong`. Nothing initialises the design on
a cached page, so `DesignInterface::getThemePath()` returns an empty string and the
fallback context has no theme.

Passing the theme id explicitly makes `updateDesignParams()` resolve it through the cached
theme provider instead, which needs no rendered page:

```php
$area = $this->appState->getAreaCode();
$params = ['area' => $area];
$themeId = $this->design->getConfigurationDesignTheme($area);

if ($themeId) {
    $params['themeId'] = $themeId;
}

return $this->assetRepository->getUrlWithParams('Siteation_DebugBar::' . $file, $params);
```

This closes the plan's open question about whether a dedicated asset route is needed. It
is not.

### 13.3 Two Alpine instances cannot both call `start()`

Bundling our own Alpine under a custom prefix is not enough on its own. Alpine registers
its shorthand transformers against the live prefix:

```js
mapAttributes(startingWith("@", into(prefix("on:"))))
```

`prefix()` reads the instance's own `prefixAsString`, so in our instance `@click` becomes
`data-ndb-on:click`, which then matches our directive regex. On its own that is harmless,
because `start()` only initialises trees from elements matching a root selector. The
problem is the mutation observer it installs:

```js
startObservingMutations();
onElAdded((el) => initTree(el, walk));
```

`onMutate` collects **every** added element, not only those under an Alpine root. So any
node the theme adds at runtime, a mini cart row or a modal, would be walked by our
instance too, its `@click` rewritten to our prefix, and its handler bound a second time.
Every such click would fire twice.

**Put the bar in a shadow root and call `Alpine.initTree(root)` rather than
`Alpine.start()`.** No document wide observer is installed, the theme's Alpine cannot see
our markup, and `x-for` and `x-if` still work because both call `initTree` on the subtrees
they create.

This also removes the need for a Tailwind prefix and a scoped preflight: a shadow root
already isolates styles in both directions, so the bar's CSS can be written plainly.

### 13.4 `renameFile` does not carry file permissions

Setting the mode on the temporary file before the rename leaves `0775` behind. Narrow the
destination after the rename instead, or the profile ends up group and world readable
while holding SQL, bindings and request data.

### 13.5 `rem` is the wrong unit inside a shadow root

`rem` resolves against the **document** root font size, not the shadow host. A store that
sets `html { font-size: 62.5% }`, a common Sass era habit, would shrink the entire bar to
roughly 60% of its intended size, and nothing in the bar's own stylesheet would explain
why. Size the bar in `px`.

The first pass also sized text far too small, 13px base with 0.66rem labels. A tool that is
read all day should not ask for a squint: 15px base, 14px mono for SQL, 12px for uppercase
labels.

### 13.6 `preg_replace` corrupts the injected payload

Injecting the bar with

```php
preg_replace('#</body\s*>#i', $markup . '$0', $html, 1)
```

silently mangles it. `preg_replace` reads backslashes in the **replacement** as escape
sequences, and the profile is full of them the moment observers are collected:
`Mollie\Payment\Observer\...` arrives in the page as `Mollie\Payment\Observer\...`
with single backslashes, which is invalid JSON. The bar then renders every value as empty
with no error anywhere.

It did not show up until observers were collected, because SQL contains no backslashes.
Use a callback so the replacement is handed back untouched:

```php
preg_replace_callback(
    '#</body\s*>#i',
    static fn (array $matches): string => $markup . $matches[0],
    $html,
    1
);
```

### 13.7 New plugins need `cache:flush`, not `cache:clean config`

The merged plugin list lives in the interception cache, which tag based invalidation does
not reach. After adding a plugin, `bin/magento cache:clean config` leaves
`PluginList::$_data` without the new entry, `hasPlugins()` still returns true for the type,
and `getNext($type, $method)` returns null. The plugin simply never runs, with no error.

`bin/magento cache:flush` purges the backend and fixes it. Worth knowing before spending an
hour proving a correctly written plugin does not work.

### 13.8 Observer counts arrive before their event is recorded

`ManagerInterface::aroundDispatch` can only record a dispatch once `$proceed()` returns,
because that is when its duration is known. Observers run *inside* that call, so an
`InvokerInterface` plugin that increments a counter on the event's own record finds no
record yet and drops it.

The effect is subtle: events dispatched many times look almost right, because the entry
exists from the second dispatch onward, while an event dispatched once reports zero
observers. `layout_load_before` showed 0 observers while the observers section listed three
running on it.

Count observers in their own map keyed by event name and merge the two at read time, so
neither has to arrive first.

### 13.9 The layout structure needs no reflection

The plan carried an open question about reaching
`Magento\Framework\View\Layout\Data\Structure` without reflecting a private property.
It is moot. `Layout::getAllBlocks()`, `getChildNames()` and `getElementProperty()` are all
public in 2.4.9, and `$structure` is `protected` rather than private as Fruitcake's code
suggests.

Better still, an around plugin on `AbstractBlock::toHtml` gives what a structure walk
cannot: per block timing. Keeping a stack separates own time from total time, which
matters because a parent's time includes everything it renders, so containers always look
like the slowest thing on the page.

### 13.10 Embedding the whole profile does not scale

The POC embedded the full profile as JSON in the page. That was fine at 76 queries and
stopped being fine as collectors were added: an uncached homepage reached **364 kB**, added
to every response while developing.

Embedding summaries only brings that to about 1.5 kB, and the bar fetches section payloads
from a controller the first time it is opened. Two things this needs:

* The id must be validated against the UUID pattern before it reaches the filesystem. The
  store already does this, which is exactly why that rule was worth porting.
* The bar's own endpoint must be excluded from profiling, or fetching a profile stores
  another one and a few clicks push the real profiles out of the ring buffer.

### 13.11 The N+1 heuristic earns its keep on stock Magento

Running the finished rules against an untouched Luma sample category page finds a real one:
the same EAV attribute query executed 40 times from a single call site in
`Magento\Eav\Model\ResourceModel\Entity\Attribute`. Nothing about that page is unusual,
which is the point. The conservative three condition test still fires on genuine cases
while staying quiet on the many queries that merely repeat.

The negative cases matter as much and are covered by tests: the same query from three call
sites is not a loop, identical bindings repeated is a caching problem, and two executions
is not yet a pattern.

One further rule turned out to be about presentation rather than detection. Reporting each
repeated query group separately produced three near identical findings out of seven, which
buried everything else. They are merged into one finding now. Distinct queries, yes, but
"queries are repeating" is one thing to go and look at.

### 13.12 A request watcher has to load before the theme does

Wrapping `fetch` from the bar's own deferred module catches nothing on page load. Hyvä
fetches its private content while that module is still waiting for the parser, so the one
AJAX request every storefront page makes is invisible.

The watcher belongs in a separate classic script in the head, blocking, with no dependency
on the bundle. It buffers what it sees into `window.__siteationDebugBar` and the bar drains
the buffer when it boots. At 1.1 kB that is an acceptable thing to put in front of a page
in developer mode, and it is still an external file, so nothing about the CSP story
changes.

### 13.13 Magento is not slow to start when it has nothing to load

The plan assumed the MCP server would need a generous startup timeout because Magento
boots slowly. It does not. The server only reads JSON files from `var/`, never opens a
database connection, and never launches the application, so `initialize` plus a tool call
completes in about 0.2 seconds. No special timeout is needed in any client config.

The bounding is worth more than expected, because Magento profiles are much larger than
Laravel ones. A category page profile is 817 kB. `get_debug_findings` answers from it in
7 kB and `inspect_debug_queries` in 16 kB, together under 3% of the document. New Debug
Bar reported a 68% saving against full dumps; here it is closer to 97%, simply because
there is more to throw away.

Two stdio rules matter and neither is obvious:

* Nothing but protocol may reach stdout. Magento will happily emit a deprecation notice.
  Buffer ordinary output with `ob_start()` and write protocol lines with `fwrite(STDOUT)`,
  which bypasses the buffer.
* Echo the client's `protocolVersion` back when it is one you support. Clients disconnect
  on an unexpected version rather than negotiating down.

### 13.14 Smaller confirmations

* One `aroundLaunch` plugin really does cover frontend, adminhtml, GraphQL and REST.
  Verified: all four return `X-Siteation-DebugBar-Profile`.
* The no inline script rule holds. Magento's CSP is report only here and logged no
  violation for the bar, because the only injected tags are a `<script type="module" src>`,
  a `<script type="application/json">` and a `data-` attribute.
* `DB\LoggerInterface` collects real queries with no `env.php` change: 16 on an empty cart,
  56 on a category page, 76 on the admin login.
* Magento's `Magento2` phpcs standard wants a docblock and a `@param` on every method,
  which on fully typed code only restates the signature. The package ships a
  `phpcs.xml.dist` that excludes `Magento2.Annotation.*` and keeps the rest.
