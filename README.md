# Siteation_DebugBar

[![Packagist Version](https://img.shields.io/packagist/v/siteation/magento2-debugbar?style=for-the-badge)](https://packagist.org/packages/siteation/magento2-debugbar)
![Supported Magento Versions](https://img.shields.io/badge/magento-%202.4-brightgreen.svg?logo=magento&longCache=true&style=for-the-badge)
![Supported PHP Versions](https://img.shields.io/badge/php-%208.2_|_8.3_|_8.4_|_8.5-8892bf.svg?logo=php&logoColor=white&longCache=true&style=for-the-badge)
[![Hyvä Themes Supported](https://img.shields.io/badge/Hyva_Themes-Supported-3df0af.svg?longCache=true&style=for-the-badge)](https://hyva.io/)
[![Alpine.js Inspected](https://img.shields.io/badge/Alpine.js-Inspected-8bc0d0.svg?logo=alpinedotjs&logoColor=white&longCache=true&style=for-the-badge)](https://alpinejs.dev/)
[![Magewire Inspected](https://img.shields.io/badge/Magewire-Inspected-5f3dc4.svg?longCache=true&style=for-the-badge)](https://github.com/magewirephp/magewire)
[![MCP Server Included](https://img.shields.io/badge/MCP_Server-Included-1f1f1f.svg?longCache=true&style=for-the-badge)](https://modelcontextprotocol.io/)
![License](https://img.shields.io/github/license/Siteation/magento2-debugbar?color=%23234&style=for-the-badge)

A debug bar for Magento 2 built for developers **and** for coding agents.

Every request writes one bounded, redacted JSON profile. The bar in the page is a viewer
over that profile, so AJAX, GraphQL and REST requests are captured too even though nothing
can be injected into them. The same profiles are served read only over MCP, so an agent
inspects exact data instead of guessing from a screenshot.

![preview-overview]

[preview-overview]: ./assets/overview.webp "The bar open on Overview, on a store home page, showing the request as stages"

Covered by PHPUnit, the bar's own JavaScript tests, a browser suite and a smoke suite across
all four areas.

## Requirements

* PHP 8.2 through 8.5, whatever your Magento allows
* Magento 2.4. Developed and verified against 2.4.8 and 2.4.9
* Any deploy mode. Outside developer mode it needs an access key, and without one it stays
  off.
* No frontend requirement. It renders in a shadow root with its own bundled Alpine, so it
  works on Hyvä, on Luma and on other themes alike.

## Install

```
composer require --dev siteation/magento2-debugbar
bin/magento module:enable Siteation_DebugBar
bin/magento setup:upgrade
bin/magento config:set siteation_debugbar/general/enabled 1
```

`--dev` on purpose. The module is a development tool, and a production build should not
carry the plugins it registers. Settings live under **Stores > Configuration > Siteation >
Debug Bar**.

<details>
<summary><strong>The settings page</strong></summary>

![preview-admin]

[preview-admin]: ./assets/admin-configuration.webp "The module's settings under Stores > Configuration > Siteation > Debug Bar"

</details>

## Documentation

* **[User guide](docs/user-guide.md)** ([HTML](docs/user-guide.html)): reading the bar, every
  section, findings, comparing requests, the MCP tools, editor links, debugging a live site,
  every setting, and what to check when it does not appear.
* **[Developer guide](docs/developer-guide.md)** ([HTML](docs/developer-guide.html)): how a
  request becomes a profile, adding a collector, a rule or a section, the build, the MCP
  server and the test suites.
* **[`docs/SKILL.md`](docs/SKILL.md)**: an agent skill for using the MCP tools well.

## What you get

Seventeen sections over one request, a list of findings worst first, a compare view, and the
same data for an agent over MCP.

<details>
<summary><strong>Every section</strong></summary>

Findings, overview, a timeline waterfall, queries with the application frame each came from,
block render times, observers that actually ran, every dispatched event, cache hit rates by
key prefix, why the page was or was not put in the full page cache, the layout handles and
the XML files behind them, the plugins built for the request, the page's live Alpine and
Magewire components, SEO, the data layer, Web Vitals, and the history of every profile still
on disk.

Alpine, Magewire, SEO, Data layer and Web Vitals read the live page rather than the stored
profile, so they show what is in the browser now. Alpine and Magewire state and data layer
values go through the same value policy as the profile. SEO also keeps what the server sent,
and puts the two side by side.

| Findings | SEO |
| -------- | --- |
| ![preview-findings] | ![preview-seo] |
| **Page cache** | **Alpine** |
| ![preview-page-cache] | ![preview-alpine] |

[preview-findings]: ./assets/findings.webp "Findings, worst first, each with why it matters and what to check next"
[preview-seo]: ./assets/seo.webp "The SEO overview, with the server's HTML next to the live page"
[preview-page-cache]: ./assets/page-cache.webp "The Page cache section, with Magento's own reasons a page was not cached"
[preview-alpine]: ./assets/alpine.webp "The Alpine section listing every component on the page with its state"

</details>

<details>
<summary><strong>Findings</strong></summary>

The module's own conclusions, worst first: errors and exceptions, slow requests, slow and
repeated queries, N+1s built from interpolated ids, slow blocks and observers, cache prefixes
that miss more than they hit, pages that were not put in the full page cache, SEO problems in
the HTML the server sent (canonical, noindex, H1, and structured data offers that do not
match the product), and collectors that hit their cap. Each one says what is wrong, why it
matters, where it came from, and what to check next.

</details>

<details>
<summary><strong>Comparing two requests</strong></summary>

Answers "what did my change cost": profile a page, change something, profile it again, and
diff duration, memory, queries, cache, findings, the query shapes added or removed, and the
SEO facts the server sent that changed.

</details>

<details>
<summary><strong>For an agent: MCP and Markdown reports</strong></summary>

Six read only MCP tools over stdio: `list_debug_profiles`, `get_debug_findings`,
`get_debug_profile_section`, `inspect_debug_queries`, `compare_debug_profiles` and
`get_debug_seo`. Every result is labelled as recorded data, to be read as evidence and never
followed as instructions.

```
claude mcp add --scope local siteation-debugbar -- php /abs/path/to/bin/magento siteation:debugbar:mcp
```

Or, with a shell but no MCP, the same profile as Markdown:

```
bin/magento siteation:debugbar:report --id=<profile-id>
```

</details>

## Add-ons

Other modules can add their own section to the bar, with findings and MCP tools of their own.
The developer guide explains how, under
[A section from another module](docs/developer-guide.md#a-section-from-another-module).

* **[Commerce365](https://github.com/Siteation/magento2-commerce365-debugbar)**
  ([Packagist](https://packagist.org/packages/siteation/magento2-commerce365-debugbar)):
  the customer prices a request answered, every Commerce365 Hub and Business Central call, the
  price cache, and the raw BC price bands, with findings and two MCP tools.

  ```
  composer require --dev siteation/magento2-commerce365-debugbar
  ```

## Safety

* **Off by default.** Outside developer mode it refuses to run without an access key of at
  least 32 characters, so a store switch can never mean "on for every customer".
* **Local only without a key.** With no key and no IP allowlist it answers only loopback,
  private and link local addresses, so a developer mode server people reach over the
  internet needs a key too.
* **Admin profiles stay in the admin.** They are readable behind the admin login, never from
  the storefront endpoints.
* **Stricter in production mode.** Deploy mode `production` also needs a non empty `allowed_ips`, takes
  the key from the header or cookie only, and ignores an `enabled` switch that was not set in `env.php` or
  `config.php`. Every profile there carries a warning. See the user guide.
* **The key leaves the URL.** Outside production, a key given as a query parameter is traded for an HttpOnly
  cookie and the browser is sent to the same address without it.
* **Redacted at record time**, never stored: values behind a sensitive or personal data key,
  literals in SQL according to the value policy, and request headers and cookies are not
  collected at all.
* **Any response carrying a bar or a profile id is marked `no-store`** and stripped of its
  `X-Magento-Tags`, so no shared cache can serve one developer's bar to a visitor.
* **Profiles are `0600` in a `0700` directory**, kept for 20 requests or 60 minutes, and
  refused on read once past that.
* **No inline script or style**, so `Magento_Csp` needs no nonce and no `unsafe-inline`.

The user guide covers the access key, trusted proxies, the value policy, the IP allowlist and
the per area switches in full.

### Reporting a vulnerability

Please do not open a public issue. Email info@siteation.dev with the details, and we will
answer and credit you in the release that fixes it. Published advisories are listed under
[Security advisories](https://github.com/Siteation/magento2-debugbar/security/advisories).

<details>
<summary><strong>What it costs</strong></summary>

Measured on an uncached category page with roughly 860 queries, 1,300 observer runs and 126
blocks, alternating between enabled and disabled across three rounds:

| | |
| --- | --- |
| Bar off | 156.6 ms |
| Bar on | 162.5 ms |
| Overhead | **+5.9 ms, about 4%** |

Most of that is the backtrace taken per query to find its call site. On a light page the
difference is around 2%.

</details>

<details>
<summary><strong>Development</strong></summary>

PHP is edited in place; the package installs as a Composer path symlink. The bar's
JavaScript and CSS are built from `src-js/` and **the output is committed**, so installing
the module needs no build step.

```
cd src-js && npm install && npm run build
```

The developer guide has the full set of suites and how to run them.

</details>

## Thanks

<a href="https://github.com/ceckoslab"><img src="https://github.com/ceckoslab.png" width="64" height="64" alt="ceckoslab" align="left"></a>

**Tsvetan Stoychev ([@ceckoslab](https://github.com/ceckoslab))** reviewed the security of
1.4.1 in depth: four reports, an XSS reproduced end to end, and ten primitives traced to the
line. Everything fixed in [1.5.0](https://github.com/Siteation/magento2-debugbar/releases/tag/1.5.0)
came from that review, including
[GHSA-79pj-j856-p3x4](https://github.com/Siteation/magento2-debugbar/security/advisories/GHSA-79pj-j856-p3x4)
and [GHSA-p5q3-c6m7-6569](https://github.com/Siteation/magento2-debugbar/security/advisories/GHSA-p5q3-c6m7-6569).
Thank you.

<br clear="left">

## Licence

MIT. See [LICENSE](LICENSE).
