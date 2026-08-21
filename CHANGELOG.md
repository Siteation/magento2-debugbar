# Changelog

## Unreleased

First release. Everything below describes what 1.0.0 will contain, so there are no
entries for the work that led up to it.

### The bar

* One JSON profile per request, stored under `var/siteation_debugbar/`, pruned to the last
  20 or 60 minutes, written `0600` in a `0700` directory.
* Seven collectors: request, queries, events, observers, blocks, cache and interception.
* Repeated queries are matched by shape with numbers treated as values, so an N+1 built
  from interpolated ids is visible rather than hidden as one query per id.
* Findings: eight rules producing ten kinds of finding, each saying what is wrong, why it
  matters, where it came from and what to check next, and linking to the evidence behind
  it.
* A Magewire section: every component on the page with its resolver, its listeners, its
  children, the state it posts back on every update, and that state itself under the value
  policy. Plus the round trip each update actually took, measured in the browser, which is
  the network and the DOM morph as well as the server. Read from the page's own Magewire,
  so the module requires nothing and works on a store that has never heard of it.
* One admin setting for what the bar collects and what it shows. A section switched off is
  not gathered either, so turning off Blocks on a page that renders four hundred of them
  makes the request being debugged cheaper as well as the panel quieter. Findings and the
  overview are always on: a profile that cannot say which request it belongs to is one the
  history, the report and the MCP tools cannot use.
* Magewire updates are named by their component and what it was asked to do. Every
  component posts to one URL, so a page that uses it produced a request list of identical
  rows; the bar, the history, the markdown report and the MCP tools all say
  `checkout.cart addToCart()` instead. Magewire is not a dependency: the request is
  recognised by shape.
* Covers frontend HTML, adminhtml, AJAX, GraphQL and REST. Requests that cannot carry a
  bar still return `X-Siteation-DebugBar-Profile`, and the bar lists them so they can be
  opened.
* Renders in a shadow root with its own bundled Alpine, so it cannot collide with the
  theme's styles or its Alpine, and still works on a page whose own JavaScript failed.
* Every query shows the application frame it came from, and that frame is a link into your
  editor when one is configured. Eight are named, anything with a URL scheme works, and a
  path map covers running in a container.
* A markdown report of any profile, for assistants that cannot call MCP:
  `bin/magento siteation:debugbar:report`, `format/markdown` on the profile endpoint, and a
  Copy for AI button in the bar.
* A request that throws is profiled too, and the finding names the exception and the frame
  it stopped at instead of sending you to the log.
* Cross request comparison: diff two stored profiles for what changed in duration, memory,
  queries, cache and findings, with query shapes matched by fingerprint. In the bar beside
  the history, and over MCP as `compare_debug_profiles`.
* A history section listing every profile still on disk, so an earlier request is one
  click away rather than a header away.
* Syntax highlighting for SQL, for Alpine state and for component expressions.
* The overview tells the request as stages, Received to Responded, with fact grids and a
  one line summary of what happened.
* A command palette on Cmd/Ctrl Shift P: every section, the themes, placement, pinning and
  the window controls, filtered as you type.
* Closing the bar collapses it to a corner bubble that restores it, follows the top or
  bottom placement and carries the findings count, so getting the bar back no longer costs
  the reload that would profile the page again and lose the request being read. The bubble
  is remembered across pages. Hiding the bar outright, for a screenshot or a sticky footer,
  is a palette command and lasts until the next page load.
* An Alpine section that reads the page's own instance: every component with its live
  state, the registered stores, which components Hyva deferred and whether they have
  started, and the version, build and expression errors behind it.
* The bar hosts itself in a `<siteation-debugbar>` custom element, so it mounts on upgrade
  rather than being found by id, and the tag name is the only thing the injector, the
  bundle and the error capture have to agree on.

### For coding agents

* `bin/magento siteation:debugbar:mcp` serves stored profiles over MCP on stdio, with five
  read only tools.
* Responses are bounded by item count and byte budget. On an 817 kB profile, findings
  answer in 7 kB.
* `docs/SKILL.md` describes how to use the tools without drawing the wrong conclusions.

### Settings

* Settings live at **Stores > Configuration > Siteation > Debug Bar**, beside the other
  Siteation modules, and the values are at `siteation_debugbar/general/*`. Deliberately not
  a group under Advanced > Developer: Magento hides that whole section in production mode,
  which is exactly where the access key makes the bar usable, so the settings for it were
  unreachable in the one mode that has to be configured before it does anything. The ACL
  resource is still the developer one, so who may change them has not changed.

### Safety

* Off by default. Production mode refuses unless a developer access key is set, and then
  the bar collects and answers only for requests presenting it: a store switch can never
  mean on for every customer. Present it as a header, or once as a query parameter to swap
  it for an hour long HttpOnly cookie.
* Any response carrying a bar or a profile id is marked no-store and stripped of its
  X-Magento-Tags, so no shared cache can serve one developer's bar to a visitor.
* Optional IP allowlist, applied to the bar and to the profile endpoint.
* Per area control: storefront, admin, GraphQL and REST can each be switched off.
* Sensitive keys are redacted at record time and string literals are stripped from SQL.
  Captured values follow a configurable policy, because query bindings are positional and
  cannot be judged by name.
* The Alpine section reads live objects rather than a stored profile, so it applies the
  same policy, the same key pattern and the same bounds in the browser.
* No inline script and no inline style reach the page, so `Magento_Csp` needs no nonce and
  no `unsafe-inline`.
