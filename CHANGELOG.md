# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-09-11

### Added

* **The collapsed bar can be moved.** A dotted grip on the left of the pill drags it
  anywhere the viewport allows, by pointer or by touch. Where it was left is remembered
  across pages and kept inside the screen when the window is resized, so a bar parked at the
  bottom of a tall window is still reachable in a short one. A press only becomes a drag
  once the pointer has travelled three pixels, so clicking the grip never pins a bar that
  was centring itself.
* **The moved bar goes back.** Double click the grip, press Enter or Space while it is
  focused, or run "Put the bar back on its edge" from the command palette. It returns to the
  standard edge nearest where it stood rather than crossing the viewport.
* **The grip answers the arrow keys**, moving the bar ten pixels at a time, so a control
  labelled Move works without a pointing device.
* **The inspector and the bubble follow the bar.** Both still open against an edge, and the
  edge they choose is the one the moved bar is nearest, so opening the inspector never
  travels to the opposite side of the screen.
* Screenshots of the bar, the two live sections and the admin page, in the README and the
  user guide.
* **The supported range is checked, not asserted.** `phpstan-versions.neon.dist` layers the
  range from `composer.json` onto the existing configuration, so a typed class constant or a
  `json_validate()` is reported as unavailable on 8.2 rather than waiting for an install on
  8.2 to find it at runtime. It is a separate file because the range form needs PHPStan 2.1
  or newer, while `phpstan.neon.dist` has to keep working with the 1.x a Magento install
  carries. The developer guide has the command.
* **An `.editorconfig`**, so indentation, line endings and trailing whitespace are settled
  by the repository rather than by whichever editor opened the file. It records what the
  code already does: four spaces for PHP and XML, which is what phpcs enforces, and two
  everywhere else. Existing files are not reformatted to match it, and whether to do that
  is a separate decision.

### Changed

* **The supported PHP versions are 8.2 through 8.5.** The constraint was `~8.3.0 || ~8.4.0`
  from the first commit of the skeleton, which was the range Magento 2.4.8 supported rather
  than anything the module needs: nothing here uses syntax or a function newer than 8.1. The
  floor is therefore a decision and not a requirement, and 8.2 is where it is drawn, because
  8.1 reached the end of its security support on 31 December 2025. Composer still resolves
  against whatever your Magento allows, so the module no longer narrows a 2.4.6 or 2.4.7
  install to a PHP it never required.

### Fixed

* **A block that legitimately returns nothing no longer turns into a 500.**
  `BlockPlugin::aroundToHtml()` declared a strict `string` return type while Magento's own
  `AbstractBlock::toHtml()` declares none, and blocks that return `null` or `false` when
  there is nothing to render (Mirasvit_SeoMarkup's card and search box blocks among them)
  tripped a `TypeError` with the bar enabled. The plugin now matches core's untyped
  signature exactly rather than guessing which falsy values are legitimate.

Thanks to [@claudio-ferraro](https://github.com/claudio-ferraro) for finding and fixing the
block plugin regression ([#1]), and to [@wpoortman](https://github.com/wpoortman) for the
movable bar ([#2]).

## [1.1.1] - 2026-08-21

Packaging only. No code changed.

### Added

* **A LICENSE file.** `composer.json` said MIT and there was nothing for GitHub or a reader
  to detect.
* A maintainer in `composer.json`, compatibility badges in the README, and a README that is
  a landing page rather than the manual.

### Removed

* **The development notes are gone from the package.** A handoff, two build plans, a
  research log and a progress tracker were written to get the module built and shipped
  inside every tarball with it. In their place, a user guide and a developer guide, in
  Markdown with generated HTML, rendered by `dev/docs`.

## [1.1.0] - 2026-08-21

Three defects the security audit named, closed. Nothing in the interface changed.

### Security

* **A profile past the age bound is refused on read, not only swept.** Retention was
  enforced by deletion alone, and a sweep runs on a write or when the history endpoint is
  opened, so on an instance nobody is browsing a profile stayed readable by id for as long
  as its file survived. Refused rather than deleted, because the MCP tools read through the
  same path and are advertised as read only.
* **Every MCP response says its payload is recorded data.** A profile holds whatever the
  request held, and it reaches an agent as tool output that reads like the module talking.
  Successful responses carry a `recorded_data` line saying the values were captured from
  requests and are to be read as evidence, never followed as instructions; the server says
  the same at connect.
* **The access key has a length floor and a per address lockout.** At least 32 characters or
  empty, refused on save with a message and refused again when the configuration resolves,
  so a value written straight to the database or `env.php` is no way around it. Ten wrong
  keys from one address inside fifteen minutes and it stops being answered, so the endpoints
  are no longer an oracle. Only a request that presented something is counted, so customer
  traffic cannot lock a developer out of their own site.

Magento's integration test suite is closed by decision rather than deferred again. What it
would assert is asserted by `dev/smoke` over HTTP, the browser suite under an enforced CSP,
and 202 unit tests.

## [1.0.0] - 2026-08-21

First release. Everything below is what 1.0.0 contains, so there are no entries for the
work that led up to it. The interface was built as a phase numbered 1.1 during
development, which was a build order rather than a version: it ships here.

### Added

#### The bar

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

#### For coding agents

* `bin/magento siteation:debugbar:mcp` serves stored profiles over MCP on stdio, with five
  read only tools.
* Responses are bounded by item count and byte budget. On an 817 kB profile, findings
  answer in 7 kB.
* `docs/SKILL.md` describes how to use the tools without drawing the wrong conclusions.

#### Settings

* Settings live at **Stores > Configuration > Siteation > Debug Bar**, beside the other
  Siteation modules, and the values are at `siteation_debugbar/general/*`. Deliberately not
  a group under Advanced > Developer: Magento hides that whole section in production mode,
  which is exactly where the access key makes the bar usable, so the settings for it were
  unreachable in the one mode that has to be configured before it does anything. The ACL
  resource is still the developer one, so who may change them has not changed.

#### Safety

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

[#1]: https://github.com/Siteation/magento2-debugbar/pull/1
[#2]: https://github.com/Siteation/magento2-debugbar/pull/2
[unreleased]: https://github.com/Siteation/magento2-debugbar/compare/1.2.0...HEAD
[1.2.0]: https://github.com/Siteation/magento2-debugbar/compare/1.1.1...1.2.0
[1.1.1]: https://github.com/Siteation/magento2-debugbar/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/Siteation/magento2-debugbar/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/Siteation/magento2-debugbar/releases/tag/1.0.0
