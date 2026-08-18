# Siteation_DebugBar

A debug bar for Magento 2 built for developers and for coding agents.

Every request writes one bounded, redacted JSON profile. The bar in the page is a viewer
over that profile, so AJAX, GraphQL and REST requests are captured too even though nothing
can be injected into them.

**Status: proof of concept.** The request and query collectors work end to end. Findings
and the MCP server are not built yet. See `docs/plan.md`.

## Requirements

* PHP 8.3 or 8.4
* Magento 2.4.8 or 2.4.9
* Developer or default mode. Production mode disables the bar unconditionally.

## Install

```
composer require --dev siteation/magento2-debugbar
bin/magento module:enable Siteation_DebugBar
bin/magento setup:upgrade
```

## Use

The bar is on by default outside production mode. To turn it off:

```
bin/magento config:set dev/siteation_debugbar/enabled 0
```

Settings live under **Stores > Configuration > Advanced > Developer > Siteation Debug Bar**.

Every profiled response carries the profile id:

```
X-Siteation-DebugBar-Profile: 4ae570c5-d45f-418c-92a7-5cda582be81e
```

Use that header to find the exact request rather than guessing at the newest profile.
Profiles are written to `var/siteation_debugbar/`, kept at 20 files and 60 minutes,
`0600`, and pruned on every write.

## Use it from a coding agent

The same profiles are readable over MCP, so an agent inspects exact data instead of
guessing. Four read only tools: `list_debug_profiles`, `get_debug_findings`,
`get_debug_profile_section`, `inspect_debug_queries`.

Claude Code:

```
claude mcp add --scope local siteation-debugbar -- php /abs/path/to/bin/magento siteation:debugbar:mcp
```

Anything else that speaks MCP over stdio:

```json
{
  "mcpServers": {
    "siteation-debugbar": {
      "command": "php",
      "args": ["/abs/path/to/bin/magento", "siteation:debugbar:mcp"]
    }
  }
}
```

The server reads stored files and never opens a database connection, so it starts in about
0.2 seconds and needs no unusual timeout.

Responses are bounded by both item count and byte budget. On an 817 kB profile from a
category page, `get_debug_findings` answers in 7 kB and `inspect_debug_queries` in 16 kB,
together under 3% of the raw document.

`docs/SKILL.md` is an agent skill describing how to use the tools well. Point your agent at
it, or copy it into your own skills directory.

## What it captures, and what it does not

The bar is off until you turn it on, and production mode refuses regardless of the
setting. Profiles are written `0600` in a `0700` directory, kept for 20 requests or 60
minutes, whichever comes first.

Redacted at record time, never stored:

* Values behind a sensitive looking key: passwords, tokens, API keys, authorization,
  cookies, session ids, form keys, card numbers, CVV, IBAN.
* String literals in SQL, so a `WHERE` clause cannot carry an email address.
* Request headers and cookies are not collected at all.

**Stored by default:** query bindings and request parameters. Bindings are positional, so
a value a customer typed arrives as an anonymous value with no key to judge it by. That is
the right default on a developer machine, where seeing the real value is the point. If the
instance is shared, set **Captured Values** to *Masked* or *None*:

```
bin/magento config:set dev/siteation_debugbar/value_policy masked
```

Choose which areas produce a profile under **Active In**, or from the CLI. Selecting
nothing covers all of them:

```
bin/magento config:set dev/siteation_debugbar/areas frontend,adminhtml
```

An IP allowlist covers both the bar and the profile endpoint:

```
bin/magento config:set dev/siteation_debugbar/allowed_ips 127.0.0.1
```

## What it costs

Measured on this instance against an uncached category page with roughly 860 queries,
1,300 observer runs and 126 blocks, alternating between enabled and disabled across three
rounds:

| | |
| --- | --- |
| Bar off | 156.6 ms |
| Bar on | 162.5 ms |
| Overhead | **+5.9 ms, about 4%** |

Most of that is the backtrace taken per query to find its call site. On a light page the
difference is around 2%.

## How it works

| Concern | Hook |
| --- | --- |
| Request lifecycle | `aroundLaunch` on `Magento\Framework\App\Http` |
| Queries | plugin on `Magento\Framework\DB\LoggerInterface` |
| Injection | `<script type="application/json">` plus two external files |
| Agent access | `bin/magento siteation:debugbar:mcp`, MCP over stdio |

The bar renders inside a shadow root with its own bundled Alpine under a `data-ndb-`
prefix, so it cannot collide with the theme's Alpine or its CSS, and it still works on a
page whose own JavaScript failed. No inline script and no inline style reach the page, so
`Magento_Csp` needs no nonce and no `unsafe-inline`.

## Development

PHP is edited in place; the package installs as a Composer path symlink.

The bar's JavaScript and CSS are built from `src-js/` and the **output is committed**, so
installing the module needs no build step.

```
cd src-js
npm install
npm run build     # or: npm run dev, to rebuild on change
```

```
vendor/bin/phpcs --standard=package-source/siteation/magento2-debugbar/phpcs.xml.dist .
```

## Documentation

* `docs/plan.md` — the build plan, phase by phase
* `docs/research.md` — prior art, verified framework hooks, and the traps found in them
* `docs/build-status.html` — progress tracker
