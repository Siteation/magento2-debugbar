# Siteation_DebugBar

A debug bar for Magento 2 built for developers **and** for coding agents.

Every request writes one bounded, redacted JSON profile. The bar in the page is a viewer
over that profile, so AJAX, GraphQL and REST requests are captured too even though nothing
can be injected into them. The same profiles are served read only over MCP, so an agent
inspects exact data instead of guessing from a screenshot.

**1.1.0.** Verified against a running store: 202 unit tests, 67 for the bar's own
JavaScript, 16 driving it in a browser, and a 30 assertion smoke suite across all four
areas.

## Requirements

* PHP 8.3 or 8.4
* Magento 2.4.8 or 2.4.9
* Any deploy mode. Outside developer mode it needs an access key, and without one it stays
  off.

## Install

```
composer require --dev siteation/magento2-debugbar
bin/magento module:enable Siteation_DebugBar
bin/magento setup:upgrade
bin/magento config:set siteation_debugbar/general/enabled 1
```

`--dev` on purpose. The module is a development tool, and a production build should not
carry the plugins it registers.

Settings live under **Stores > Configuration > Siteation > Debug Bar**.

## Documentation

* **[User guide](docs/user-guide.md)** ([HTML](docs/user-guide.html)) — reading the bar, the
  sections, findings, comparing requests, editor links, debugging a live site, every
  setting, and what to check when it does not appear.
* **[Developer guide](docs/developer-guide.md)** ([HTML](docs/developer-guide.html)) — how a
  request becomes a profile, adding a collector or a rule, the bar's build, the MCP server,
  the test suites, and the traps that have cost hours.
* `docs/SKILL.md` — an agent skill describing how to use the MCP tools well. Point your
  agent at it, or copy it into your own skills directory.

## What you get

Twelve sections over one request: findings, overview, a timeline waterfall, queries with the
application frame each came from, block render times, observers that actually ran, every
dispatched event, cache hit rates by key prefix, the plugins built for the request, the
page's live Alpine and Magewire components, and the history of every profile still on disk.

**Findings** are the module's own conclusions, worst first: errors and exceptions, slow
requests, slow and repeated queries, N+1s built from interpolated ids, slow blocks and
observers, cache prefixes that miss more than they hit, and collectors that hit their cap.
Each one says what is wrong, why it matters, where it came from, and what to check next.

**Comparison** answers "what did my change cost": profile a page, change something, profile
it again, and diff duration, memory, queries, cache, findings, and the query shapes added or
removed.

**For an agent**, five read only MCP tools over stdio:

```
claude mcp add --scope local siteation-debugbar -- php /abs/path/to/bin/magento siteation:debugbar:mcp
```

Or, with a shell but no MCP, the same profile as markdown:

```
bin/magento siteation:debugbar:report --id=<profile-id>
```

## Safety

* **Off by default**, and outside developer mode it refuses to run without an access key of
  at least 32 characters, so a store switch can never mean "on for every customer".
* **Redacted at record time**, never stored: values behind a sensitive looking key, string
  literals in SQL, and request headers and cookies are not collected at all.
* **Any response carrying a bar or a profile id is marked `no-store`** and stripped of its
  `X-Magento-Tags`, so no shared cache can serve one developer's bar to a visitor.
* **Profiles are `0600` in a `0700` directory**, kept for 20 requests or 60 minutes, and
  refused on read once past that.
* **No inline script or style**, so `Magento_Csp` needs no nonce and no `unsafe-inline`.

The user guide covers the access key, the value policy for query bindings, the IP allowlist
and the per area switches in full.

## What it costs

Measured on an uncached category page with roughly 860 queries, 1,300 observer runs and 126
blocks, alternating between enabled and disabled across three rounds:

| | |
| --- | --- |
| Bar off | 156.6 ms |
| Bar on | 162.5 ms |
| Overhead | **+5.9 ms, about 4%** |

Most of that is the backtrace taken per query to find its call site. On a light page the
difference is around 2%.

## Development

PHP is edited in place; the package installs as a Composer path symlink. The bar's
JavaScript and CSS are built from `src-js/` and **the output is committed**, so installing
the module needs no build step.

```
cd src-js && npm install && npm run build
```

The developer guide has the full set of suites and how to run them.

## Licence

MIT.
