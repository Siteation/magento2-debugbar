# Siteation_DebugBar: implementation plan

## Context

Magento's existing debug tooling is a decade behind. `Smile-SA/magento2-module-debug-toolbar`
is the most complete option and it still renders server-side phtml zones into the page,
`echo`s and `exit`s when it throws, and shows raw tables with no interpretation.
`fruitcake/magento2-debugbar` is unmaintained and inherits php-debugbar's jQuery era widget
system. Nothing in the Magento ecosystem exposes debug data to a coding agent.

[newdebugbar/newdebugbar](https://github.com/newdebugbar/newdebugbar) (Laravel, Apache-2.0)
solved this well. Reading its source rather than watching the demo, four ideas carry over
cleanly and none of them are Laravel specific:

1. Collection and presentation are decoupled by a **stored JSON profile per request**. The
   bar in the page is a viewer over that document.
2. A separate analysis pass turns raw data into ranked **findings** that answer what
   happened, what is wrong, why, where, and what to check next. Tabs are the evidence
   behind a finding, not the product.
3. The same profiles are exposed read only over **MCP**, so an agent reads exact bounded
   data instead of guessing from a screenshot or a log dump.
4. **Everything is bounded and redacted at record time**, and truncation is reported rather
   than hidden.

We build the Magento equivalent as `siteation/magento2-debugbar` (`Siteation_DebugBar`) in the
existing `package-source/siteation` monorepo, on the stack this instance already runs:
Magento 2.4.9, PHP 8.3/8.4, Hyvä 3.0 with Alpine 3.14 and Tailwind 4, and Nebula
(`qoliber/nebula-admin-theme`, Alpine 3 + Tailwind 4 + ES modules) in the admin.

Full prior art notes, verified hooks and extracted code live in
`package-source/siteation/magento2-debugbar/docs/research.md`.

### Decisions already taken

* **Bundle our own Alpine** with `Alpine.prefix('data-ndb-')`, in a shadow root. The bar
  must work on Luma, in adminhtml, against Hyvä's CSP Alpine build, and on a page where the
  theme's JS threw.
* **v1 = profiles + findings + MCP.** MCP ships in the first release. It is the reason to
  build this rather than install Smile's toolbar.
* **Coverage:** frontend HTML, AJAX/fetch, adminhtml, GraphQL/REST.
* **Error page out of scope.** `swissup/module-ignition` (MIT) already does it well.

## Architecture

```
            App\Http::launch()  (one around plugin)
   begin profile ────┬──────────────────────── finalize, analyse, store, inject
                     │
        ┌────────────┴────────────┐
        │  collectors (di.xml)    │   plugins on framework interfaces
        │  request  queries       │   DB\LoggerInterface
        │  events   observers     │   Event\ManagerInterface / InvokerInterface
        │  cache    layout        │   App\CacheInterface
        │  plugins  timers        │   PluginListInterface (reflection, fail soft)
        └────────────┬────────────┘
                     v
            Profile (bounded, redacted JSON)
                     │
        ┌────────────┼────────────────────┐
        v            v                    v
   ProfileStore   Analyzer           BarInjector
   var/siteation  findings           <script type="application/json">
   _debugbar/                        + X-Siteation-DebugBar-Profile header
        │            │                    │
        │            │                    v
        │            │            Alpine bar (own Alpine, data-ndb- prefix)
        v            v
   MCP stdio server (bin/magento siteation:debugbar:mcp)
```

**One entry hook.** `pub/index.php` is the only web entry point and it always creates
`Magento\Framework\App\Http`. Frontend, adminhtml, GraphQL and REST all route through it.
`Bootstrap::run()` does `$response = $application->launch(); $response->sendResponse();`
(verified at `vendor/magento/framework/App/Bootstrap.php`), so a single plugin on
`App\Http` covers all four coverage targets and can still modify the response.

It has to be an **`around` plugin**, not before plus after. `launch()` switches the object
manager to the request's area, `PluginList` reloads its scoped data, and the lazily
inherited entry for `App\Http` does not survive that reload, so an `after` listener dies in
`PluginList::getPlugin()` with an undefined array key. An `around` plugin is resolved
before the switch. Full trace in `docs/research.md` section 13.1.

**No inline scripts.** The profile is passed as `<script type="application/json">`, which is
data and not script, so `Magento_Csp` needs no nonce and no `unsafe-inline`. JS and CSS are
served as real files. This is strictly better than every prior art module.

## Package layout

```
package-source/siteation/magento2-debugbar/
  composer.json                 exists, add "type": "magento2-module" deps only
  registration.php              exists
  etc/module.xml                exists
  etc/di.xml                    collectors, plugin wiring, console command
  etc/config.xml                defaults (disabled by default)
  etc/adminhtml/system.xml      enable, areas, thresholds, storage limits
  Api/
    CollectorInterface.php      key/label/reset/record/summary/payload
    ProfileStoreInterface.php
  Model/
    Profile.php                 value object
    ProfileManager.php          begin, record, finalize, discard, isCollecting
    ProfileStore.php            atomic write, prune by count and age
    RequestEligibility.php      area, config, self-request, asset guards
    Redactor.php                clean, cleanSql, cleanBindings, depth/length bounds
    Config.php                  resolved once at launch, never re-read
  Collector/
    AbstractCollector.php       redaction + bounding + dropped tracking
    RequestCollector.php  QueryCollector.php  EventCollector.php
    ObserverCollector.php CacheCollector.php  LayoutCollector.php
    InterceptionCollector.php   TimerCollector.php
  Plugin/
    App/HttpPlugin.php          aroundLaunch: begin, proceed, finalize, inject
    Db/LoggerPlugin.php         beforeStartTimer / afterLogStats
    Event/ManagerPlugin.php     aroundDispatch
    Event/InvokerPlugin.php     aroundDispatch
    App/CachePlugin.php         aroundLoad / aroundSave / aroundRemove
  Observer/
    CollectLayoutObserver.php   layout_generate_blocks_after
  Analysis/
    ProfileAnalyzer.php         orchestrates rules, caps at max_findings
    QueryAnalyzer.php           fingerprint, group, slow, N+1
    Finding.php                 id, severity, section, message, evidence, why/where/next/action
    Rule/*.php                  one class per rule, registered in di.xml
  Presentation/
    BarInjector.php             response guards + injection
    ProfilePresenter.php        profile -> view payload
    McpProfilePresenter.php     profile -> bounded, byte-capped agent payload
  Console/
    McpServerCommand.php        stdio JSON-RPC loop
  Mcp/
    Server.php  Tool/*.php      four read only tools
  view/base/web/
    js/debugbar.js              built, committed
    css/debugbar.css            built, committed
  src-js/                       Alpine + Tailwind sources, vite + tailwind build
  docs/research.md              exists
```

## Deliverables to write first

Before any code, two tracking artifacts land in the module so progress is visible:

* `docs/plan.md` — this plan, committed alongside `docs/research.md`.
* `docs/build-status.html` — a standalone tracker page (no build step, no external
  requests) with summary cards, a workflow stepper for the six phases, `<details>` blocks
  per phase holding the task breakdown, `<dialog>` elements for task detail, and a
  checklist marking every item **done**, **todo** or **backlog**. Kept current as phases
  complete, so it is the single place to see where the build stands.

## Phase 0: POC

Goal: prove the spine end to end on one collector. Deliberately thin, deliberately real.

1. `Plugin/App/HttpPlugin` with a single `aroundLaunch` that starts a profile, proceeds,
   then finalizes, stores and injects.
2. `Model/ProfileStore` writing `var/siteation_debugbar/<uuid4>.json` through
   `Magento\Framework\Filesystem`, atomic temp file plus `rename()`, pruned by count and age.
   Port the id regex and pruning from New Debug Bar's `ProfileStore`.
3. `Collector/QueryCollector` fed by `Plugin/Db/LoggerPlugin` on
   `Magento\Framework\DB\LoggerInterface`. The PDO adapter calls `startTimer()` then
   `logStats()` around every query in a `finally` (verified at
   `vendor/magento/framework/DB/Adapter/Pdo/Mysql.php:691`), so `beforeStartTimer` plus
   `afterLogStats` gives count, SQL, bindings and duration with no `env.php` change.
   Also fires for CONNECT and for BEGIN/COMMIT/ROLLBACK.
4. `Collector/RequestCollector` for method, path, route, action, area, status, duration,
   peak memory.
5. `Presentation/BarInjector` porting New Debug Bar's guard set verbatim (skip redirects,
   non-HTML content types, attachments, binary and streamed responses, and require a
   closing `</body>`), then remove `Content-Length` and set
   `X-Siteation-DebugBar-Profile: <uuid>`.
6. Minimal Alpine bar: own Alpine 3.14 bundle with `Alpine.prefix('data-ndb-')`, mounted
   in a shadow root and started with `Alpine.initTree(root)`, one
   `Alpine.data('debugBar', ...)` component, collapsed strip showing request, status,
   duration, query count and memory, expanding to a query list.
7. Assets resolved through `Magento\Framework\View\Asset\Repository`, passing the theme
   id explicitly. Plain `getUrl()` builds a `frontend/_view/...` URL that 404s on a full
   page cache hit, because nothing initializes the design on a cached page. See
   `docs/research.md` section 13.2.

**POC exit criteria:** load a Hyvä category page, see the bar with a real query count,
click through to the query list, and find the matching JSON in `var/siteation_debugbar/`
with an id equal to the `X-Siteation-DebugBar-Profile` header.

## Phase 1: collection completeness

Add the remaining collectors behind the same `CollectorInterface`, registered as a sorted
`di.xml` array argument on `ProfileManager` in the pattern Smile uses for its zones.

* **Events and observers.** Two plugins: `Event\ManagerInterface::aroundDispatch` for every
  dispatched event including unobserved ones, `Event\InvokerInterface::aroundDispatch` for
  every observer that ran, with per observer timing.
* **Cache.** `App\CacheInterface` around load, save and remove. An empty load result is a
  miss, which yields a hit rate.
* **Layout, blocks and templates.** `layout_generate_blocks_after`, walking the structure
  from `root`. Fruitcake reflects a private `structure` property; check first whether 2.4.9
  exposes a public path, and keep the collector fail soft either way.
* **Interception.** Reflect `PluginListInterface` for intercepted types, applied plugins and
  before/around/after method classification. Highest value Magento specific panel, highest
  upgrade risk, so it sits behind an interface and returns empty on any `ReflectionException`.
* **Timers.** Magento's own nested `Magento\Framework\Profiler` when `MAGE_PROFILER` is set,
  plus our own spans. Stop the master timer before building the profile so the bar never
  measures itself.

**Critical trap.** Do not read config inside the event or cache plugins. Config reads hit
the cache, the cache dispatches events, and you get infinite recursion. Smile documents this
in a source comment. `Model/Config` resolves enablement once at launch and every
plugin reads that resolved value from a property.

**Second trap.** The bar must never break the page it is debugging. Every collector call and
the whole finalize step is wrapped so a throw discards the profile and returns the
untouched response. Never `echo`, never `exit`.

`AbstractCollector` does redaction and bounding once for all collectors, and keeps totals
accurate even when items are dropped, so `summary()` reports `count`, `retained_count`,
`dropped_count` and `truncated`.

## Phase 2: analysis and findings

`Analysis/QueryAnalyzer` normalizes whitespace, fingerprints
`substr(sha256(normalized_sql . "\0" . connection), 0, 16)`, groups by fingerprint, and
derives per query `slow`, `repeated_count`, `query_time_percent`, `request_time_percent` and
read/write type. N+1 uses New Debug Bar's deliberately conservative three condition test:
at least three executions, **bindings vary**, and **one shared call site**. Same SQL from
many call sites is not an N+1; identical bindings repeated is a caching problem. Label it
`likely_n_plus_one`, because chunked and paginated queries still trip it.

Call sites come from Fruitcake's exclude path walk: 40 frames scanned, framework and
`generated/code` paths dropped, first 5 application frames kept, both limits configurable.

Every finding carries id, severity, section, message, evidence, and a `why` / `location` /
`next` / `action` block, where `action` names the section and filter to open. Ordered errors
first, capped at 50.

Ported rules: `exception.captured`, `request.error`, `request.slow`, `query.slow`,
`query.repeated`, `cache.high_miss_rate` (only above 5 operations and an 80% miss rate, so
one lookup makes no noise).

Magento specific rules, none of which exist in any current tool:

* `layout.cache_miss` on a full layout rebuild.
* `block.uncacheable` when one block disables full page cache for the whole page.
* `plugin.heavy` when a single interceptor dominates the request.
* `collection.loaded_in_loop`, the Magento shape of N+1.
* `indexer.invalid` when an invalid indexer explains slow reads.
* `cache.type_disabled` when a disabled cache type costs measurable time.

## Phase 3: the bar

Sources in `src-js/`, built with Vite and Tailwind 4, output committed to
`view/base/web/`. Nebula proves the "ships with compiled assets, install and go" model
works in Magento, and it means `mage build hyva` is irrelevant to this module.

* Own Alpine 3.14 with `Alpine.prefix('data-ndb-')`, mounted in a **shadow root** and
  started with `Alpine.initTree(root)` rather than `Alpine.start()`. A full start installs a
  document wide mutation observer that would rewrite the host theme's `@click` to our prefix
  and bind every handler twice. See `docs/research.md` section 13.3.
* The shadow root isolates CSS in both directions, so Tailwind needs no prefix and no
  scoped preflight.
* One `Alpine.data('debugBar', ...)` factory, modelled on New Debug Bar's `state.js`:
  collapsed strip, full screen inspector, section list, favorites, per section filters and
  search, command palette, light/dark/system theme, preferences in `localStorage`.
* Port `lockHost` verbatim: when the inspector opens, mark every sibling `inert`, lock body
  scroll, compensate for scrollbar width, restore all of it on close. This is what makes it
  feel like an app instead of an overlay.
* Critical CSS in the head to prevent flash: `#siteation-debugbar [data-ndb-cloak]{display:none!important}`.
* `highlight.js/lib/core` with only `sql`, `json` and a hand rolled PHP grammar registered.
  Three languages instead of the full bundle is ~20 kB against ~900 kB.
* AJAX, GraphQL and REST requests are stored but not injected. A `fetch` and
  `XMLHttpRequest` interceptor in the bar reads `X-Siteation-DebugBar-Profile` off responses
  and appends them to a request list, which is how those three coverage targets become
  visible without touching their payloads.

UX rules taken from New Debug Bar's own `AGENTS.md` and worth enforcing in review:

> Show the request, errors, query count, and time first.
> Keep framework details, raw data, hashes, and repeated facts out of the main view.
> A finding should explain the problem, why it matters, where it came from, and what to do next.
> Do not show two findings for the same cause.
> Do not use `·`, `•`, or `|` to split facts. Use space, labels, icons, or groups.

## Phase 4: MCP server

`bin/magento siteation:debugbar:mcp` speaking MCP over stdio, registered through
`Magento\Framework\Console\CommandListInterface` in `etc/di.xml`.

**Hand roll the JSON-RPC loop rather than take a dependency.** `php-mcp/server` 3.3.0 pulls
ReactPHP plus `symfony/finder` into a Magento vendor tree, and `mcp/sdk` is pre-1.0. We need
`initialize`, `notifications/initialized`, `tools/list`, `tools/call` and `ping` over
newline delimited JSON-RPC 2.0, which is a few hundred lines. Revisit only if we later need
SSE or HTTP transport.

Four read only tools, mirroring New Debug Bar's proven set:

```
list-debug-profiles          filter by method, path, status, warning
get-debug-profile-section    cursor paginated
inspect-debug-queries        filter slow | repeated, sort by duration
get-debug-findings           cursor paginated
```

Server instructions tell the agent to correlate by header:

> Read bounded, redacted Magento debug profiles. Use the exact profile ID from the
> `X-Siteation-DebugBar-Profile` response header when correlating a request.

Every response is **double bounded**, by item count (50) and by byte budget (100 kB),
dropping items until it fits, and carries a `response_version` so the contract can evolve.

Client config, with a generous startup timeout because Magento boots slowly:

```json
{
  "mcpServers": {
    "siteation-debugbar": {
      "command": "php",
      "args": ["/abs/path/bin/magento", "siteation:debugbar:mcp"],
      "startup_timeout_sec": 60
    }
  }
}
```

Ship a `SKILL.md` alongside it, mirroring New Debug Bar's, whose best rules are:

> Set small limits instead of accepting maximums. Start with 10 profile summaries, 10
> findings, and 5 items from a section or query search.
> Read findings first, then the smallest useful section.
> Treat a finding as a lead, not a verdict.
> Compare query time with total request time. If queries are a small share, inspect
> lifecycle, models, events, and views before blaming the database.

## Phase 5: hardening for release

* **Off by default.** `etc/config.xml` ships `enabled = 0`, matching Smile. Enabling
  requires developer mode plus explicit config, with an optional IP allowlist.
* **Redaction.** Passwords, tokens, cookies, session ids, card data and customer PII removed
  at record time. Bounded depth (5), string length (2000) and array size (100).
* **Overhead budget.** Measure the profiler's own cost and show it in the bar. Assert in a
  test that a profiled request stays within an agreed multiple of an unprofiled one.
* **Quality gates.** PHPStan, `phpcs` with the Magento2 standard, and the repo's
  `.php-cs-fixer.dist.php`.
* **Tests.** Unit tests for `QueryAnalyzer` fingerprinting and the N+1 heuristic,
  `Redactor`, `ProfileStore` pruning and atomicity, and `BarInjector` guards. Integration
  tests asserting a profile is produced for frontend, adminhtml, GraphQL and AJAX requests,
  and that a thrown collector leaves the response untouched.
* **Docs.** README with install, enable, MCP setup and a screenshot. `CHANGELOG.md` starting
  at v1.
* Tag `1.0.0` on `git@github.com:Siteation/magento2-debugbar.git` and submit to Packagist.

## Verification

Per phase, in this instance:

```bash
# module is registered and enabled
bin/magento module:status Siteation_DebugBar

# profile written, id matches the response header
curl -sD - -o /dev/null https://<host>/ | grep -i x-siteation-debugbar-profile
ls -la var/siteation_debugbar/

# profile is valid, bounded JSON
jq '.sections | keys, .metrics' var/siteation_debugbar/<uuid>.json

# MCP server answers a handshake
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  | php bin/magento siteation:debugbar:mcp | jq .
```

Browser checks, using the Chrome tooling already available in this session: load a Hyvä
category page and confirm the bar renders, the theme's own Alpine components still work
(prefix isolation holds), no CSP violations appear in the console, light and dark themes
both read correctly, keyboard navigation reaches every control, and the bar is usable at
390px wide. Repeat in adminhtml. Then trigger an AJAX add to cart and confirm the request
appears in the bar's request list.

Agent check: point Claude Code at the MCP server, load a slow page, and ask it to explain
what happened. Success is a correct answer citing a specific profile id, not a data dump.

## Open items to settle during Phase 1

* Whether `Magento\Framework\View\Layout\Data\Structure` can be reached in 2.4.9 without
  reflecting a private property.
* Whether Smile's override of `Profiler\Driver\Standard\Stat` (PHP 8.1 compatibility) is
  still needed on 2.4.9.
* How large the embedded profile may get before the payload should move behind a lazy
  fetch. The POC embeds the whole profile, which is fine at 76 queries and will not be at
  500.

Settled during the POC: the asset URL needs no dedicated route, only an explicit theme id.
