# Handoff

Everything a fresh session needs to pick this up. Read `plan.md` for scope, `plan-1.1.md`
for what is being built now, and `research.md` for why things are the way they are.

## What this is

`siteation/magento2-debugbar`, module `Siteation_DebugBar`. A debug bar for Magento 2 built
for developers **and** for coding agents. Every request writes one bounded, redacted JSON
profile; the bar in the page is a viewer over it; the same profiles are served read only
over MCP.

Modelled on [newdebugbar/newdebugbar](https://github.com/newdebugbar/newdebugbar)
(Laravel, Apache-2.0). Its source is worth reading directly, not just its screenshots.

## Rules that are not negotiable

* **Repositories live under the `Siteation` GitHub org.** Never a personal account.
* **Everything starts private.** Making something public is Rutger's decision, never a step
  in a plan.
* **No GitHub Actions.** The org's Actions budget is spent. This project needs none: tests
  run locally, the JS build output is committed, and Packagist uses a webhook.
* **Never break the page being debugged.** Every collector call and the whole finalize step
  is wrapped; a throw discards the profile and returns the untouched response.
* **No inline script or style.** The profile travels as
  `<script type="application/json">` and everything else is an external file, so
  `Magento_Csp` needs no nonce and no `unsafe-inline`.

## Where things are

| | |
| --- | --- |
| Package | `package-source/siteation/module-debugbar` (symlinked into `vendor/siteation/magento2-debugbar`) |
| Remote | `git@github.com:Siteation/magento2-debugbar.git`, private, branch `main` |
| Instance | `https://mage-debugbar.test`, admin at `/magedebugbar_admin` |
| Profiles | `var/siteation_debugbar/*.json`, 20 files or 60 minutes, `0600` |
| Root repo | local only, no remote, keeps `composer.json`, `composer.lock`, `CLAUDE.md` |

The root `composer.json` has a `path` repository at `package-source/*/*`, so the package
installs as a symlink and edits take effect immediately.

## Three stale artifact traps

These cost hours each. Check them before believing a bug is real.

1. **Static assets.** Magento's static URL carries a version that only changes on deploy,
   so a rebuilt bundle keeps its URL and the browser serves the old one. Fixed: asset URLs
   now carry the built file's mtime. If the bar looks unchanged after a build, hard reload.
2. **The interception cache.** `bin/magento cache:clean config` does not reach it. After
   adding or changing a plugin, run `bin/magento cache:flush` or the plugin silently never
   runs.
3. **Generated interceptors.** Developer mode creates them once and never rechecks, so
   changing a constructor gives `Too few arguments ... generated/code/.../Interceptor.php`.
   Fix with `rm -rf generated/code/Siteation`.

## Architecture

**One entry hook.** An `around` plugin on `Magento\Framework\App\Http::launch()` brackets
every web request in every area. It has to be `around`: `launch()` switches the object
manager to the request's area, `PluginList` reloads its scoped data, and an `after`
listener dies in `getPlugin()`. See `research.md` 13.1.

**The Alpine section is the exception to all of this.** It reads the page's live Alpine
instead of a stored profile, so it is client only, invisible to MCP, and applies the value
policy itself in `redact.js`. The policy reaches the page as `data-value-policy` on the
bar's root element.

**Collectors** implement `Api\CollectorInterface`, registered as a sorted `di.xml` array on
`ProfileManager`. `AbstractCollector` does redaction, bounding and `at_ms` stamping once for
all of them. Seven: request, queries, events, observers, blocks, cache, interception. Plus a
`timeline` section built at finalize by `Analysis\TimelineBuilder`.

**Findings** are produced by rules behind `Api\RuleInterface`, also registered in `di.xml`.
A rule that throws is skipped and logged. Nine rules ship.

**The bar** renders in a shadow root with its own bundled Alpine under a `data-ndb-` prefix
and is started with `Alpine.initTree(root)`, never `Alpine.start()`. A full start installs
a document wide mutation observer that would claim the host theme's `@click` shorthands and
bind every handler twice. See `research.md` 13.3.

**Only summaries are embedded** in the page, about 1.5 kB. Section payloads are fetched from
`siteation_debugbar/profile/view` on first open.

**MCP** is `bin/magento siteation:debugbar:mcp`, hand rolled JSON-RPC 2.0 over stdio, four
read only tools. Starts in about 0.2 seconds because it only reads files. Registered in
Claude Code as `siteation-debugbar`.

## Verify

```
bin/magento cache:flush                                        # after any plugin change
vendor/bin/phpcs  --standard=<pkg>/phpcs.xml.dist <pkg>
vendor/bin/phpstan analyse -c <pkg>/phpstan.neon.dist
vendor/bin/phpunit --configuration <pkg>/phpunit.xml.dist      # 71 tests
<pkg>/dev/smoke https://mage-debugbar.test magedebugbar_admin  # 24 assertions
cd <pkg>/src-js && npm run build                               # output is committed
```

Browser work: measure geometry with `javascript_tool` before diagnosing layout from a
screenshot. Screenshots are scaled and have misled me twice.

## State

**1.0**: 53 done, 2 closed, **1 open**. The open item is *tag 1.0.0 and publish*, which is
Rutger's call: it needs the repository made public so Packagist can read it. Not an
engineering task, and not something to push toward.

**1.1**: 23 of 27.

| Phase | | |
| --- | --- | --- |
| A. Timeline | 5/5 | `at_ms` on every item, `TimelineBuilder`, waterfall view |
| B. Window | 5/5 | floating glass dock, modal sheet, `lockHost`, window controls |
| C. Navigation | 6/7 | 210px sidebar, favourites with drag, section leads, inline findings |
| D. Alpine | 6/7 | components, stores, deferred, health, sub-tabs, value policy |
| E. Comfort | 1/5 | light theme done; palette, highlighting, history left |

Backlog is in `build-status.html`, which is the live tracker. Open it in a browser.

## Next: the interface pass Rutger asked for

Compared against New Debug Bar's own screenshot, ours reads as cramped rather than wrong:
type is too small in places, the theme and window icons are too small, and there is a
question about whether the header metrics and the sidebar are saying the same thing twice.
Measure before changing anything, and mind the 12px floor.

## Decided in D, worth not relitigating

* **The value policy runs in the browser too.** `redact.js` mirrors the key pattern, depth
  bound and item bound of `Model/Redactor.php`, and `x-data` expressions have their string
  literals replaced the way SQL does, because a server rendered expression carries page
  data inline.
* **MCP stays blind to the Alpine section.** Making it visible means posting a snapshot
  back, which means a write endpoint on a module whose whole safety story is that it only
  reads. The section has to prove itself first, and an agent can already ask a browser.

## Open, needing Rutger

* Tagging 1.0.0, which needs the repo public.
* Deleting `allrude/siteation-magento2`, the old monorepo. The token lacks `delete_repo`:
  `gh auth refresh -h github.com -s delete_repo` then `gh repo delete ... --yes`.
* Magento's full integration test suite, deferred until the interface stops moving.

## Things learned the hard way

Beyond the three stale artifact traps, the ones most likely to bite again:

* An interface plugin fires **once per implementing object in the chain**, not once per
  logical operation. `LoggerInterface` resolves to `LoggerProxy`, which delegates to
  another implementer, so every query was counted twice for months.
* `preg_replace` reads backslashes in the **replacement** as escapes. Injecting a payload
  containing PHP class names corrupts it silently. Use `preg_replace_callback`.
* Inside a shadow root, `rem` resolves against the **document** root. Size in `px`.
* A shadow root isolates the bar from the page, not from itself. Generic class names
  collide; `.ndb-facts` was defined twice and the header broke.
* Do not use tiny type. 15px body, 14px mono, 12px floor.
* An `x-for` variable that shares a name with a component property silently redirects every
  write inside the loop. `select(id) { this.section = id }` wrote to the loop's `section`,
  which blanked the row's own label and never changed the panel. Nothing throws.
* `Object.keys` on Alpine's merged scope proxy returns `[]`. Its `ownKeys` trap answers over
  a bare `{}`, so each key it names is dropped for having no descriptor. Use
  `Reflect.ownKeys`.
* `Alpine.$data(el)` folds every parent scope into the child. For one component's own state,
  read `el._x_dataStack[0]`.
* Alpine 3.14.3, which Hyvä ships, has no `setErrorHandler` and no `injectMagics`. Expression
  errors have to be read from `console.warn`, and `$store` from `Alpine.evaluate`.
