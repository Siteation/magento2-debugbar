# Siteation_DebugBar

A debug bar for Magento 2 built for developers and for coding agents.

Every request writes one bounded, redacted JSON profile. The bar in the page is a viewer
over that profile, so AJAX, GraphQL and REST requests are captured too even though nothing
can be injected into them.

**Status: 1.1.0.** Everything described below is built and verified against a running
store: 189 unit tests, 67 for the bar's own JavaScript, 16 driving it in a browser, and a
30 assertion smoke suite against all four areas.

## Requirements

* PHP 8.3 or 8.4
* Magento 2.4.8 or 2.4.9
* Any deploy mode. Outside developer mode it needs an access key, and without one it stays
  off: see "Debugging a live site" below.

## Install

```
composer require --dev siteation/magento2-debugbar
bin/magento module:enable Siteation_DebugBar
bin/magento setup:upgrade
```

`--dev` on purpose. The module is a development tool, and a production build should not
carry the plugins it registers.

## Use

The bar collects nothing until it is switched on. Outside developer mode it also refuses
unless an access key is set, so a store switch can never mean "on for every customer":

```
bin/magento config:set siteation_debugbar/general/enabled 1
```

Settings live under **Stores > Configuration > Siteation > Debug Bar**.
They apply to the whole installation: the collector decides before the store is known, so a
per website or per store value is ignored rather than half honoured.

Every profiled response carries the profile id:

```
X-Siteation-DebugBar-Profile: 4ae570c5-d45f-418c-92a7-5cda582be81e
```

Use that header to find the exact request rather than guessing at the newest profile.
Profiles are written to `var/siteation_debugbar/`, kept at 20 files and 60 minutes,
`0600`, and pruned on every write.

## Use it from a coding agent

The same profiles are readable over MCP, so an agent inspects exact data instead of
guessing. Five read only tools: `list_debug_profiles`, `get_debug_findings`,
`get_debug_profile_section`, `inspect_debug_queries`, `compare_debug_profiles`.

The last one answers "what did my change cost": profile a page, change something, profile
it again, and compare the two. Duration, memory, queries, cache and findings, plus the
query shapes that were added or removed, in about 5 kB.

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

Every successful response carries a `recorded_data` line saying what the payload is: values
captured from requests to the store, which anyone who can reach the store can write. It
arrives as tool output, which reads like the server talking, so it is labelled where it is
read rather than only in the server's connect instructions.

`docs/SKILL.md` is an agent skill describing how to use the tools well. Point your agent at
it, or copy it into your own skills directory.

### For an assistant that cannot call MCP

A browser tab, a chat window, or a coding agent that has a shell but no MCP server
configured. Any of them can read the same profile as markdown:

```
bin/magento siteation:debugbar:report                       # the newest profile
bin/magento siteation:debugbar:report --id=<profile-id>
bin/magento siteation:debugbar:report --id=<after> --baseline=<before>
```

The bar has a **Copy for AI** button on the Overview that puts the same report on the
clipboard, and `siteation_debugbar/profile/view/id/<id>/format/markdown/` serves it over
HTTP. Findings first, then cost, then the slowest queries with their call sites. About
3 kB for a cart page.

## What it captures, and what it does not

The bar is off until you turn it on. Outside developer mode it stays off unless an access
key is set, and then it only ever collects for a request that presents that key. Profiles are written `0600` in a `0700` directory, kept for 20 requests or 60
minutes, whichever comes first.

Redacted at record time, never stored:

* Values behind a sensitive looking key: passwords, tokens, API keys, authorization,
  cookies, session ids, form keys, card numbers, CVV, IBAN.
* String literals in SQL, so a `WHERE` clause cannot carry an email address.
* Request headers and cookies are not collected at all.

The **Alpine** section is the exception to all of this: it reads the page's live Alpine
components rather than a stored profile, so nothing it shows is ever written to disk, and
it applies the same policy, the same key pattern and the same bounds in the browser.

**Stored by default:** query bindings and request parameters. Bindings are positional, so
a value a customer typed arrives as an anonymous value with no key to judge it by. That is
the right default on a developer machine, where seeing the real value is the point. If the
instance is shared, set **Captured Values** to *Masked* or *None*:

```
bin/magento config:set siteation_debugbar/general/value_policy masked
```

Choose which areas produce a profile under **Active In**, or from the CLI. Selecting
nothing covers all of them:

```
bin/magento config:set siteation_debugbar/general/areas frontend,adminhtml
```

An IP allowlist covers both the bar and the profile endpoint:

```
bin/magento config:set siteation_debugbar/general/allowed_ips 127.0.0.1
```

## Debugging a live site

The switch in configuration is per store, which on a live site is the wrong shape: it would
turn the bar on for every visitor. The access key is the per request half.

```
bin/magento config:set siteation_debugbar/general/access_key "$(openssl rand -hex 32)"
bin/magento config:set siteation_debugbar/general/enabled 1
```

With a key set, a request that does not present it is an ordinary visitor's: no profile is
written, no bar is injected, and the three endpoints answer 404 as though the module were
not installed. Present it in one of three ways:

```
curl -H "X-Siteation-DebugBar-Key: <key>" https://your-store.test/
open "https://your-store.test/?siteation_debugbar_key=<key>"
```

The second swaps the key for a cookie that lasts an hour, which is how long a profile lives,
so the key leaves the address bar after one request. The header suits curl, an agent and the
REST client, since a browser is only one of the four areas this profiles.

The key must be at least 32 characters, or empty. Anything shorter is refused when you save
it, in the admin and from the CLI alike, and refused again when the configuration resolves,
so a value written straight into the database or `env.php` is no way around it. Outside
developer mode the key is the entire reason the bar may run, and "on for whoever holds the
key" means nothing when the key is `x`.

Wrong keys are counted per address. Ten from one address with less than fifteen minutes
between them and that address stops being answered at all until fifteen minutes after the
last one, so the endpoints cannot be used as an oracle. Only a request that presented
something counts, so ordinary customer traffic never fills the bucket and costs nothing to
serve. Behind a load balancer every client shares one bucket, which is a reason to keep the
key long rather than to lean on the counter. `cache:flush` clears it.

Two things follow from a key being set, both deliberate:

* **Production and default mode are allowed, but only behind a key.** Developer mode is the
  only one that runs keyless, because it is the only one that is not somebody's live site.
  Default mode is what `MAGE_MODE` falls back to, so it is treated as live.
* **Any response carrying a bar or a profile id is marked `no-store` and stripped of its
  `X-Magento-Tags`.** Varnish and any CDN in front will refuse to keep it, because a page
  with your bar in it is one developer's view of one request and must never be served to a
  second person.

An IP allowlist can be combined with the key, but on its own it is not enough behind a proxy
or load balancer: the address the module trusts is `REMOTE_ADDR`, never a forwarded header,
because an allowlist that trusts a client supplied header is not an allowlist.

Rotate the key with the same command when you are done, or empty it to lock production again.

## Open in your editor

Every query shows the application frame it came from. Name an editor and that frame becomes
a link that opens the file at the line:

```
bin/magento config:set siteation_debugbar/general/editor zed
```

PhpStorm, VS Code and Insiders, Cursor, Windsurf, Zed, Sublime Text and TextMate are named.
Anything else with a URL scheme works through `custom`, where `%f` is the absolute file and
`%l` the line:

```
bin/magento config:set siteation_debugbar/general/editor custom
bin/magento config:set siteation_debugbar/general/editor_template 'myeditor://open?file=%f&line=%l'
```

`%f` is absolute and so already starts with a slash. A path style template is therefore
`myeditor://file%f:%l`, with no slash of its own: `://file/%f` produces two, which some
editors open nothing at all for, without saying so.

If the application runs somewhere your editor cannot see, a container for instance, map the
root across. Paths are stored relative to it, so mapping the root maps every path:

```
bin/magento config:set siteation_debugbar/general/editor_path_map '/var/www/html:/Users/you/dev/shop'
```

Left unset, the file and line are shown as plain text.

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
| Injection | `<script type="application/json">` plus three external files (two scripts and a stylesheet) |
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
npm run build         # or: npm run dev, to rebuild the bundle on change
npm test              # node's own runner, no test dependency
npm run test:browser  # drives the bar in Chrome against a running store
```

`npm run dev` builds `early.js` once and then watches the main bundle only. Editing
`early.js` during a watch session needs another `npm run build`, because the page keeps
serving the committed file and its URL carries an mtime, so a stale one does not look
like a cache problem.

The browser suite needs the store up and the bar enabled. It uses your installed Chrome
rather than downloading one; point it elsewhere with `NDB_BASE_URL` or
`NDB_BROWSER_CHANNEL`.

From the instance root, where `PKG` is this package's directory:

```
vendor/bin/phpcs --standard=$PKG/phpcs.xml.dist $PKG
vendor/bin/phpstan analyse -c $PKG/phpstan.neon.dist
vendor/bin/phpunit --configuration $PKG/phpunit.xml.dist
$PKG/dev/smoke https://your-store.test admin
```

## Documentation

* `docs/handoff.md` — start here if you are picking this up cold
* `docs/plan.md` — the collection and analysis build plan, phase by phase
* `docs/plan-1.1.md` — the interface build plan, which shipped in 1.0.0 too
* `docs/research.md` — prior art, verified framework hooks, and the traps found in them
* `docs/build-status.html` — progress tracker
