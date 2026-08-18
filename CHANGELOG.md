# Changelog

## Unreleased

First release. Everything below describes what 1.0.0 will contain, so there are no
entries for the work that led up to it.

### The bar

* One JSON profile per request, stored under `var/siteation_debugbar/`, pruned to the last
  20 or 60 minutes, written `0600` in a `0700` directory.
* Seven collectors: request, queries, events, observers, blocks, cache and interception.
* Findings: nine rules that say what is wrong, why it matters, where it came from and what
  to check next, each linking to the evidence behind it.
* Covers frontend HTML, adminhtml, AJAX, GraphQL and REST. Requests that cannot carry a
  bar still return `X-Siteation-DebugBar-Profile`, and the bar lists them so they can be
  opened.
* Renders in a shadow root with its own bundled Alpine, so it cannot collide with the
  theme's styles or its Alpine, and still works on a page whose own JavaScript failed.
* A history section listing every profile still on disk, so an earlier request is one
  click away rather than a header away.
* Syntax highlighting for SQL, for Alpine state and for component expressions.
* The overview tells the request as stages, Received to Responded, with fact grids and a
  one line summary of what happened.
* A command palette on Cmd/Ctrl Shift P: every section, the themes, placement, pinning and
  the window controls, filtered as you type.
* An Alpine section that reads the page's own instance: every component with its live
  state, the registered stores, which components Hyva deferred and whether they have
  started, and the version, build and expression errors behind it.

### For coding agents

* `bin/magento siteation:debugbar:mcp` serves stored profiles over MCP on stdio, with four
  read only tools.
* Responses are bounded by item count and byte budget. On an 817 kB profile, findings
  answer in 7 kB.
* `docs/SKILL.md` describes how to use the tools without drawing the wrong conclusions.

### Safety

* Off by default. Production mode refuses regardless of the setting.
* Optional IP allowlist, applied to the bar and to the profile endpoint.
* Per area control: storefront, admin, GraphQL and REST can each be switched off.
* Sensitive keys are redacted at record time and string literals are stripped from SQL.
  Captured values follow a configurable policy, because query bindings are positional and
  cannot be judged by name.
* The Alpine section reads live objects rather than a stored profile, so it applies the
  same policy, the same key pattern and the same bounds in the browser.
* No inline script and no inline style reach the page, so `Magento_Csp` needs no nonce and
  no `unsafe-inline`.
