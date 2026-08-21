# Developer guide

For working on Siteation_DebugBar itself. If you want to use it, read the
[user guide](user-guide.md).

## Layout

| | |
| --- | --- |
| `Api/` | `CollectorInterface`, `RuleInterface`, `McpToolInterface` |
| `Plugin/` | The entry hook and the four collection hooks |
| `Collector/` | Seven collectors and the abstract they share |
| `Analysis/` | Findings, rules, the query analyzer, the timeline, the comparer |
| `Model/` | Config, the gate, the access key, the store, the redactor |
| `Presentation/` | Bar injection, the markdown report, the MCP presenter |
| `Mcp/` | JSON-RPC server and five tools |
| `Controller/Profile/` | `view`, `history`, `compare` |
| `Console/` | `siteation:debugbar:mcp`, `siteation:debugbar:report` |
| `src-js/` | Alpine sources for the bar; build output is committed |
| `view/base/web/` | The committed build output |
| `dev/` | `smoke`, an HTTP test over a running store, and `docs` |

PHP is edited in place. The package installs as a Composer path symlink, so nothing needs
reinstalling after an edit.

## How a request becomes a profile

**One entry hook.** An `around` plugin on `Magento\Framework\App\Http::launch()` brackets
every web request in every area.

It has to be `around`. `launch()` switches the object manager to the request's area,
`PluginList` reloads its scoped data as it does so, and an `after` listener does not survive
that reload: it dies inside `getPlugin()`. There is no ordering trick that fixes it; the
bracket has to be taken before the switch.

In order:

1. `RequestEligibility::allows()` decides whether to profile at all. It reads the config
   flag, the area list, the IP allowlist, the access key, and whether this is one of the
   bar's own endpoints.
2. `ProfileManager` starts collecting. Every plugin records through it, and it holds a
   single boolean that the plugins branch on, so an unprofiled request pays a plugin hop and
   no config read.
3. `proceed()` runs the application. The query, event, observer, block and cache plugins
   record as they fire.
4. `finalize()` asks each enabled collector for its section, builds the timeline, runs the
   rules, and hands the result to `ProfileStore`.
5. `BarInjector` sets the profile header, marks the response unshareable, and injects the
   bar if the response can carry one.

**Nothing may read configuration while a request is being collected.** A config read can miss
the cache, a cache miss issues queries and dispatches events, and the query, cache and event
collectors all call back in. `Config` resolves every value once in one guarded pass, at
launch, before any collector is active.

**Never break the page being debugged.** Every collector call and the whole finalize step is
wrapped. A throw discards the profile and returns the untouched response.

## Adding a collector

Implement `Api\CollectorInterface`, extend `Collector\AbstractCollector`, and register it in
the sorted array on `ProfileManager` in `etc/di.xml`.

`AbstractCollector` does redaction, bounding and `at_ms` stamping once for all of them. Do
not do any of those in your collector; a collector that bypasses the abstract is how the
contract stops meaning anything.

Recording is done through `ProfileManager::quietly()`, which is also where the "is this
section switched on" decision is honoured, so a section that is off costs nothing rather
than being gathered and hidden.

Add the section to `src-js/src/sections.js` as well, or the panel will never be drawn.
`Test/Unit/Analysis/RuleSectionTest.php` reads that list from PHP, so the two cannot drift.

## Adding a rule

Implement `Api\RuleInterface` and register it in the rules array in `etc/di.xml`. A rule that
throws is skipped and logged rather than taking the profile with it.

A rule returns `Analysis\Finding` objects. Each carries a severity, a message, where it came
from, what to check next, and the section and filter holding its evidence. Point the action
at a filter that actually narrows: mapping `repeated` to `all` is no filter at all, which is
a mistake this codebase has already made once.

Eight rules ship, producing ten kinds of finding. `RequestErrorRule` and `RepeatedQueryRule`
emit two each.

## The profile

One JSON file per request under `var/siteation_debugbar/`, `0600` inside a `0700` directory,
pruned to 20 files or 60 minutes.

Retention is enforced twice. `ProfileStore::tidy()` sweeps on a write and when the history
endpoint is read, and `get()` refuses anything past the age bound whether or not a sweep has
reached it. `get()` refuses rather than deletes: the MCP tools read through the same path and
are advertised as read only.

`Model\Redactor` masks sensitive keys at record time, bounds depth and item counts, and
strips string literals from SQL. `src-js/src/redact.js` mirrors it for the Alpine section,
which reads live objects rather than a stored profile and therefore has to apply the policy
itself.

**Query shapes ignore numbers as well as quoted values**, because Magento interpolates ids
unquoted and an N+1 made of them was invisible otherwise. Identifiers are protected, so `t1`
is not `t2`, and `LIMIT 10` and `LIMIT 100` are deliberately one shape.

## The gate and the endpoints

`RequestEligibility::allows()` decides whether a request is profiled. `allowsRead()` decides
whether one may be read. Three controllers call `allowsRead()` rather than repeating the
check, because an endpoint that hands out a profile to someone the bar would not have
collected for is a way around the gate rather than a thing behind it.

Three endpoints, all behind the same gate: `profile/view` for one profile,
`profile/history` for the list, `profile/compare` for the diff. Anything that hands out
profile ids sits behind the same check as the thing that hands out profiles.

`Model\AccessKey` is what makes a live site possible. `Config::MIN_ACCESS_KEY_LENGTH` is 32;
below that the bar refuses to run rather than treating the key as absent, since absent means
keyless. `Model\Config\Backend\AccessKey` refuses it on save so the refusal is visible, and
`Model\AccessAttempts` stops answering an address that offers ten wrong keys inside fifteen
minutes.

`Model\ClientAddress` is the one definition of who a request came from, `REMOTE_ADDR` and
never a forwarded header. The allowlist and the lockout both read it, because a difference
between them would be a way around one of the two.

## The bar

Sources in `src-js/src/`, output committed to `view/base/web/`. Installing the module needs
no build step, and that is deliberate.

```
cd src-js
npm install
npm run build         # or npm run dev, which watches the main bundle
```

`npm run dev` builds `early.js` once and then watches the main bundle only. Editing
`early.js` during a watch session needs another `npm run build`.

**The host is a custom element**, `<siteation-debugbar>`, written before `</body>` alongside
the profile JSON and the module script. It mounts itself in `connectedCallback`, so the tag
name is the only thing `BarInjector`, `debugbar.js` and `early.js` have to agree on.

**A shadow root** keeps the bar's styles off the store and the store's styles off the bar,
and hides the bar's markup from the theme's Alpine.

**Its own bundled Alpine**, the CSP build, under a `data-ndb-` prefix, started with
`Alpine.initTree(root)` and never `Alpine.start()`. A full start installs a document wide
mutation observer that would claim the host theme's `@click` shorthands and bind every
handler twice.

**No inline script or style.** The profile travels as `<script type="application/json">` and
everything else is an external file, so `Magento_Csp` needs no nonce and no `unsafe-inline`.

**Only summaries are embedded**, about 1.5 kB. Section payloads are fetched from
`profile/view` on first open.

File by file: `state.js` is the Alpine component, `template.js` the markup, `sections.js` the
section list, `header.js` the header used by both the dock and the sheet, `palette.js` the
command list, `alpine.js` and `magewire.js` the two live readers, `early.js` the request
watcher and error capture that loads in the head.

## MCP

`bin/magento siteation:debugbar:mcp`, hand rolled JSON-RPC 2.0 over newline delimited stdio,
five read only tools. It starts in about 0.2 seconds because it only reads files.

Add a tool by implementing `Api\McpToolInterface` and registering it in the tools array in
`etc/di.xml`. Shaping belongs in `Presentation\McpProfilePresenter`, which bounds every
response by item count and byte budget and labels the payload as recorded data.

**The presenter's envelope is built inside the byte budget**, so anything added to it is paid
for out of the response rather than pushing it over.

## Testing

```
vendor/bin/phpcs  --standard=<pkg>/phpcs.xml.dist <pkg>
vendor/bin/phpstan analyse -c <pkg>/phpstan.neon.dist
vendor/bin/phpunit --configuration <pkg>/phpunit.xml.dist      # 202 tests
<pkg>/dev/smoke https://your-store.test admin                  # 30 assertions over HTTP
cd <pkg>/src-js && npm test                                    # 67, no dependency
cd <pkg>/src-js && npm run test:browser                        # 16, needs the store up
```

Magento's integration framework is deliberately not used. It needs its own database and
install and runs in minutes; `dev/smoke` drives a real store over HTTP across all four areas
in seconds and asserts the same regressions.

**The browser suite is the one that catches a binding that throws.** `early.js` watches
`console.warn` for every Alpine on the page, including the bar's own, and the suite walks
every section and sub-tab and asserts that buffer is empty. A throwing binding renders as an
empty element and says nothing otherwise. Two of the tests run under an injected policy that
forbids `unsafe-eval`, because the store's own policy is report-only on most pages and the
violations the bar used to commit were reported and never blocked.

Two habits that suite enforces: the header is built once and used twice, so a header selector
without `.ndb-sheet` matches both; and selecting a section starts work, so wait for the state
rather than for a length of time.

When looking at layout in a browser, measure geometry with JavaScript before diagnosing from
a screenshot. Screenshots are scaled and have misled more than once.

## Adding a setting

1. A field in `etc/adminhtml/system.xml`, under the existing `general` group.
2. A default in `etc/config.xml`.
3. An `XML_PATH_` constant and a resolved property in `Model\Config`, set inside `resolve()`.

Settings live at `siteation_debugbar/general/*` under a Siteation tab, deliberately not under
Advanced > Developer: Magento hides the whole `dev` section in production mode, which is
exactly where the access key makes the bar usable.

One group rather than several, because every field's `depends` on Enabled would otherwise
become a cross group dependency.

## Traps that cost hours

These are the ones that have actually bitten. Check them before believing a bug is real.

**Stale artifacts, in order of likelihood.**

1. **The interception cache.** `cache:clean config` does not reach it. After adding or
   changing a plugin, run `cache:flush` or the plugin silently never runs.
2. **Generated interceptors.** Developer mode creates them once and never rechecks, so
   changing a constructor gives `Too few arguments ... generated/code/.../Interceptor.php`.
   Fix with `rm -rf generated/code/Siteation`.
3. **`generated/metadata`.** Adding an item to a `di.xml` argument array survives both of the
   above. It takes `rm -rf generated/metadata` as well.
4. **Static assets.** Asset URLs carry the built file's mtime, so a rebuilt bundle gets a new
   URL. If the bar looks unchanged after a build, hard reload.

**PHP and Magento.**

- An interface plugin fires **once per implementing object in the chain**, not once per
  logical operation. `LoggerInterface` resolves to `LoggerProxy`, which delegates to another
  implementer, so every query was counted twice for months.
- `preg_replace` reads backslashes in the **replacement** as escapes, so injecting a payload
  containing PHP class names corrupts it silently. Use `preg_replace_callback`.
- Two `<comment>` elements on one `system.xml` field cancel each other out: Magento collapses
  the repeat into an array and renders neither.
- `Cache-Control: private` is not a milder `no-store` to Magento's Varnish. It means a 24 hour
  hit-for-pass that tag invalidation cannot clear.
- The cookie manager resolves its domain through the store, so it cannot be used at the top of
  `launch()`: there is no store yet. Issue cookies after `proceed()`.
- Magento hides the whole `dev` configuration section in production mode. The check runs
  against the structure path, not the stored one.

**The bar.**

- Inside a shadow root, `rem` resolves against the **document** root. Size in `px`.
- A shadow root isolates the bar from the page, not from itself. Generic class names collide.
- `x-show` **evaluates everything inside it while hidden**, so a panel bound to state that
  starts as `null` throws once per binding on every page load, invisibly. Use `x-if` for a
  panel that has no data yet. `x-show` also defers every reveal after the first through a
  `setTimeout`, so nothing can be timed against it.
- An `x-for` variable that shares a name with a component property silently redirects every
  write inside the loop. Nothing throws.
- `Object.keys` on Alpine's merged scope proxy returns `[]`. Use `Reflect.ownKeys`.
- `Alpine.$data(el)` folds every parent scope into the child. For one component's own state,
  read `el._x_dataStack[0]`.
- Alpine 3.14.3, which Hyvä ships, has no `setErrorHandler` and no `injectMagics`. Expression
  errors have to be read from `console.warn`.
- Writing to a key named `__proto__` on a plain object sets the prototype instead of the key,
  so the value disappears. Use `Object.create(null)` for anything built from page data.
- A background tab throttles timers and stops `requestAnimationFrame`, so anything timing
  sensitive measures as broken there.

**Conventions.**

- A query's call site is stored under `callsite`, one word, relative to the application root.
- Label over value beats label beside value. `facts()` in `facts.js` builds the grid.
- No tiny type. 15px body, 14px mono, 12px floor. The uppercase micro label is 12px.
- An editor URL template writes `://file%f`, never `://file/%f`: `%f` is absolute, so the
  second form carries two slashes and Zed ignores it silently.

## Testing a crash

There is no fixture for a 500, on purpose: a route that throws does not belong on a working
instance. Four files under `app/code/Siteation/BoomTest` recreate one, a controller whose
`execute()` throws. Give it a real return type; `never` breaks Magento's generated interceptor
before the exception ever happens. Delete it afterwards.

## Documentation

The two guides are Markdown, and their HTML is generated:

```
php dev/docs
```

Edit the `.md`. The `.html` is a view of it, and `dev/docs` is the only place the two can
differ. It needs no dependencies, for the same reason the bar ships prebuilt.

## Releasing

1. Everything green: phpcs, phpstan, phpunit, smoke, both JS suites.
2. `npm run build`, and commit the output if it changed.
3. `php dev/docs` if a guide changed.
4. A dated section in `CHANGELOG.md`.
5. An annotated tag, plain semver with no `v` prefix, matching the other Siteation packages.
6. `git push origin main && git push origin <tag>`.

There are no GitHub Actions and none are wanted: tests run locally, the build output is
committed, and Packagist reads the tag through a webhook.
