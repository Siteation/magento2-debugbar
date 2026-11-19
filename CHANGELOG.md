# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

[Unreleased]: https://github.com/Siteation/magento2-debugbar/compare/1.5.1...main

### Changed

- Query findings and repeat counts ignore Magento's block cache lock pairs (`GET_LOCK` and `RELEASE_LOCK`). They stay in the Queries tab.
- Repeated queries from known core code that only runs outside production mode are reported as one info
  finding that says so, instead of an N+1 warning. The first is Magento's theme registration plugin, which saves
  every theme before each admin request in developer mode. Real N+1 detection is unchanged, and more sources can
  be added through the `sources` argument of `Siteation\DebugBar\Analysis\KnownQuerySources` in di.xml.

## [1.5.1] - 2026-10-31

[1.5.1]: https://github.com/Siteation/magento2-debugbar/compare/1.5.0...1.5.1

### Security

- Every successful MCP tool result now says its data was recorded from requests and is to be read as evidence,
  never followed as instructions. The module's own tools always did; a tool another module adds builds its own
  response and reached the agent without the note. The server now adds it to any result that lacks one.
  ([#64](https://github.com/Siteation/magento2-debugbar/issues/64))

## [1.5.0] - 2026-10-31

[1.5.0]: https://github.com/Siteation/magento2-debugbar/compare/1.4.1...1.5.0

Thanks to Tsvetan Stoychev ([@ceckoslab](https://github.com/ceckoslab)), whose security review of 1.4.1 found
everything in this release. Upgrading is recommended for every installation.

### Security

- The bar is no longer inserted inside another template's script, style or comment.
  The injector put it before the first `</head>` and `</body>` it found, including text inside a script element.
  A page holding that text in inert script data, such as a JSON block with visitor input, then had its script
  closed early by the bar, and the rest of the data ran as HTML. The bar runs on admin pages by default, so this
  could be XSS in an admin session. The insertion point is now the document's own closing tag.
  ([#51](https://github.com/Siteation/magento2-debugbar/issues/51))

- Without an access key, the bar only answers local addresses, and admin profiles stay in the admin.
  In developer mode with no key and no IP allowlist, anyone who could reach the store could list and read every
  profile through the storefront endpoints, admin profiles included. Keyless now answers only loopback, private
  and link local addresses, so a local Docker, Warden or DDEV setup works as before, and a developer mode server
  reachable from the internet needs a key. The storefront endpoints no longer return admin profiles; the admin
  reads them behind its login. ([#52](https://github.com/Siteation/magento2-debugbar/issues/52))

- A key given in the URL now redirects to the same address without it, so it leaves the address bar and the
  browser history. The first request still leaves one line in the access log, so the header remains the way for
  scripts and agents. The key is also stripped from the PageSpeed Insights, Rich Results Test and Schema Markup
  Validator links. ([#53](https://github.com/Siteation/magento2-debugbar/issues/53))

### Added

- A **Trusted Proxies** setting. When a request comes from a listed proxy, the client address is read from
  `X-Forwarded-For`, for the IP allowlist and the wrong key lockout alike. Empty by default, which keeps the
  previous behaviour. ([#54](https://github.com/Siteation/magento2-debugbar/issues/54))

### Changed

- Keys named after personal data (`email`, `phone`, `telephone`, `dob`, `birth`) are redacted under every policy.
  Under `masked`, hex literals are removed from captured SQL; under `none`, numbers are removed as well.
  ([#55](https://github.com/Siteation/magento2-debugbar/issues/55))

### Fixed

- A microdata property named `__proto__`, `constructor` or `toString` is read as an ordinary property.
- Captured values in the Markdown report can no longer break out of their code spans or add markup.
- A profile whose file permissions could not be narrowed is logged once instead of passing silently.
  ([#56](https://github.com/Siteation/magento2-debugbar/issues/56))

## [1.4.1] - 2026-10-27

[1.4.1]: https://github.com/Siteation/magento2-debugbar/compare/1.4.0...1.4.1

### Fixed

- A page no longer crashes while the bar collects when an event is dispatched with an `event` key in its data,
  as Nebula's admin grids do (`nebula_grid_data_*`). Magento puts that value on the observer in place of its own
  event, and the observer timer called `getName()` on it. The observer is now timed under the name the event
  was dispatched with.

## [1.4.0] - 2026-10-27

[1.4.0]: https://github.com/Siteation/magento2-debugbar/compare/1.3.0...1.4.0

### Added

- Other modules can add a section to the bar.
  It is declared in their `di.xml` on `Model\ContributedSections`, with a label, a lead and up to two halves:
  a view built from the stored profile, and a script that reads the live page.
  Both describe the panel as blocks the bar draws with its own markup, so it stays CSP safe and looks like the rest.
  A contributed section can be switched off under **Sections** like a built in one, is in the command palette,
  shows its findings, and can be read with `get_debug_profile_section`.
  See "A section from another module" in the developer guide.

## [1.3.0] - 2026-10-26

[1.3.0]: https://github.com/Siteation/magento2-debugbar/compare/1.2.0...1.3.0

### Added

- A Page cache section.
  It says whether the page was served from the full page cache, stored for the next request, or not cached,
  with every reason in the order Magento checks them.
  Each block marked `cacheable="false"` is listed with the layout handle and file that declared it,
  and the headers are shown as the application offered them to the cache.
  A CMS page, category or product page that was not cached is a finding.
  ([#8](https://github.com/Siteation/magento2-debugbar/issues/8))

- A Layout section.
  It lists the layout handles the request loaded, in the order Magento merged them,
  with the XML files behind each one and the module or theme each file comes from.
  Handles pulled in by an `<update handle>` are listed after the handle that pulled them in.
  A separate layout, such as the one prices render through, is listed after the page's own and marked.
  Each handle links to the Blocks section, filtered to the blocks that handle put on the page.
  ([#9](https://github.com/Siteation/magento2-debugbar/issues/9))

- An SEO section, read from the live page, with five views:
  Overview (title, meta description, canonical, robots, hreflang, language, viewport,
  charset, word count and quick links), Headings, Images, Links and Social.
  Each view counts what needs a look, and the sidebar shows the total.
  ([#4](https://github.com/Siteation/magento2-debugbar/issues/4))

- A Schema view in the SEO section.
  JSON-LD and microdata are shown as one list of entities, with parse errors and their line,
  Google's rich result rules for the types a shop uses,
  and a warning when one entity is described twice.
  The markup can be copied into Google's tools when they cannot reach the shop.
  ([#6](https://github.com/Siteation/magento2-debugbar/issues/6))

- SEO facts from the HTML the server sent, recorded in the profile of a storefront page:
  title, description, canonical links, robots meta tag and header, language and hreflang alternates,
  headings, Open Graph and X tags, and structured data types.
  The markdown report has an SEO table, and a new MCP tool, `get_debug_seo`, returns the facts with their findings.
  ([#10](https://github.com/Siteation/magento2-debugbar/issues/10))

- Five SEO findings from those facts:
  no canonical on a product or category page, more than one canonical,
  noindex on a page meant to be found, more than one H1, and no H1.
  A finding opens the SEO view that shows the same thing on the live page.
  ([#10](https://github.com/Siteation/magento2-debugbar/issues/10))

- The SEO overview puts the HTML the server sent next to the live page,
  and marks what a script changed after load, which a crawler that does not run JavaScript never sees.
  Compare, the markdown report and `compare_debug_profiles` list the SEO facts that differ between two requests.
  ([#10](https://github.com/Siteation/magento2-debugbar/issues/10))

- The SEO overview names where the title, description, H1, canonical and robots of a product,
  category or CMS page come from: the attribute, CMS field or setting, with a link to edit it.
  A value the page does not match is marked as set elsewhere.
  The report and `get_debug_seo` carry the same.
  ([#10](https://github.com/Siteation/magento2-debugbar/issues/10))

- Three findings that check the structured data offers on a product page against the product:
  a price it does not sell for, another currency,
  and a stock status that says the opposite of whether it can be bought.
  ([#10](https://github.com/Siteation/magento2-debugbar/issues/10))

- A Data layer section, with Pushes, Tags and Consent views.
  Pushes lists every `dataLayer.push` from the first byte, kept across pages in the tab,
  with paths to copy and GA4 ecommerce checks.
  Tags lists the tags on the page and the ones loaded twice.
  Consent shows the Consent Mode v2 state.
  Values go through the value policy before they are shown or kept.
  ([#5](https://github.com/Siteation/magento2-debugbar/issues/5))

- A Web Vitals section.
  LCP, CLS and INP, with TTFB and FCP, rated against Google's thresholds and updated as the page is used.
  It points at the LCP element, the slowest interaction's target, and the elements each layout shift moved.
  Clicks on the bar are left out of INP.
  ([#7](https://github.com/Siteation/magento2-debugbar/issues/7))

- Edit this page in the admin, on product, category and CMS pages.
  It goes through a new admin route, `siteation_debugbar/entity/edit`,
  which checks the role for that kind of page and adds the secret key when the store uses one.

- The `request` section records the `X-Robots-Tag` response header as `robots_header` when one is sent,
  because the page cannot read its own response headers.

- Request entries in the head script's buffer carry `at`, the time the response arrived,
  so a data layer push can be matched to the request before it.

- A GitHub Actions workflow runs PHPUnit and PHPStan on PHP 8.2 to 8.5, phpcs, the JS unit tests,
  and a check that the committed bundle matches a fresh build.
  Magento comes from the Mage-OS mirror, so it needs no keys.
  The smoke and browser suites need a store and stay manual.
  ([#27](https://github.com/Siteation/magento2-debugbar/issues/27))

### Changed

- The overview no longer guesses at a cache hit from an empty profile.
  The Page cache section says so instead.
  ([#8](https://github.com/Siteation/magento2-debugbar/issues/8))

- The Page cache section reads layout files through the same lookup as the Layout section.
  ([#9](https://github.com/Siteation/magento2-debugbar/issues/9))

- Each distinct SQL statement is normalised once per request instead of five times.
  On a page of 300 queries the analysis takes about 2.4 ms instead of 4.6 ms.
  ([#32](https://github.com/Siteation/magento2-debugbar/issues/32))

- PHPStan runs at level 8 instead of 6, clean on both PHPStan 1.12 and 2.x.
  ([#34](https://github.com/Siteation/magento2-debugbar/issues/34))

- A store that already chose which sections to show keeps that list,
  so the SEO, Data layer and Web Vitals sections stay off there
  until they are added under Sections in the configuration.

- The README and both guides describe every section, sub view and MCP tool as they ship now,
  with new screenshots.
  ([#26](https://github.com/Siteation/magento2-debugbar/issues/26))

### Fixed

- The collapsed bar fits narrow screens.
  As it gets narrower it hides peak memory, mode, queries and duration in that order,
  then the search and theme buttons, all of which the open inspector still shows.
  Before, the stats never shrank, so the path disappeared first
  and then the window controls were pushed off the bar.
  ([#48](https://github.com/Siteation/magento2-debugbar/pull/48))

- The theme and maximise icons sit in the middle of their buttons.
  The theme icon was 2.8 pixels above centre.

- In the admin, the bar no longer stores a profile of its own requests.
  Opening a profile, the history or a comparison used to save one more profile each time
  and push the real ones out of the twenty kept.
  ([#30](https://github.com/Siteation/magento2-debugbar/issues/30))

- In the admin, the bar's sections, History and Compare no longer say
  "Could not load profile details: The response was not JSON".
  Their requests went to admin addresses that had no controller,
  so the admin answered with its 404 page.

- A cache removal is recorded only while the cache section is collected,
  and a recorder that fails no longer breaks the removal itself.
  Loads and saves already worked this way.
  ([#31](https://github.com/Siteation/magento2-debugbar/issues/31))

- A row past a section's 500-row cap is counted without being redacted first.
  It was redacted in full and then thrown away, so a page with thousands of queries paid for each one.
  ([#33](https://github.com/Siteation/magento2-debugbar/issues/33))

- The Full Page Cache section names every cookie a response sets in its headers, not only the first.
  ([#34](https://github.com/Siteation/magento2-debugbar/issues/34))

- Web Vitals no longer keeps every entry on a page left open.
  It kept every interaction and layout shift for as long as the page was open, each with the element it was about.
  Each read now trims them to what the vitals need: the last LCP candidate,
  the slowest hundred interactions (more on a page used enough for INP to reach further),
  and the worst layout shift window with the latest ones.
  The numbers shown do not change.
  INP is exact up to 5000 interactions on one page, the interaction count still counts every one,
  and a shift window keeps its number.
  ([#35](https://github.com/Siteation/magento2-debugbar/issues/35))

### Security

- The admin no longer shows the Developer Access Key.
  The field is masked, and saving the page without touching it keeps the stored key.
  It is still stored as an ordinary setting.
  ([#36](https://github.com/Siteation/magento2-debugbar/issues/36))

## [1.2.0] - 2026-10-11

[1.2.0]: https://github.com/Siteation/magento2-debugbar/compare/1.1.1...1.2.0

### Added

- The collapsed bar can be moved, by dragging the grip on the left of the pill.
  Where you leave it is remembered across pages,
  and kept inside the viewport when the window resizes.
  Thanks [@wpoortman](https://github.com/wpoortman)
  ([#2](https://github.com/Siteation/magento2-debugbar/pull/2))

- The bar goes back to its edge on a double click of the grip,
  on Enter or Space while the grip is focused,
  or from the new "Put the bar back on its edge" palette command.

- Arrow keys on the grip move the bar ten pixels at a time.

### Changed

- Supported PHP is now 8.2 through 8.5, where it was 8.3 and 8.4.
  Nothing here ever needed 8.3, so the old constraint only kept the module
  off Magento installs running an older PHP.

### Fixed

- A block that returns `null` or `false` instead of a string no longer causes a 500.
  `BlockPlugin::aroundToHtml()` declared a `string` return type
  that Magento's own `AbstractBlock::toHtml()` does not.
  Thanks [@claudio-ferraro](https://github.com/claudio-ferraro)
  ([#1](https://github.com/Siteation/magento2-debugbar/pull/1))

## [1.1.1] - 2026-08-21

[1.1.1]: https://github.com/Siteation/magento2-debugbar/compare/1.1.0...1.1.1

Packaging only. No code changed.

### Added

- A LICENSE file, a maintainer in `composer.json`, and compatibility badges in the README.

### Changed

- The README is a landing page rather than the manual.

### Removed

- The development notes, which shipped inside every tarball.
  In their place, a user guide and a developer guide, rendered by `dev/docs`.

## [1.1.0] - 2026-08-21

[1.1.0]: https://github.com/Siteation/magento2-debugbar/compare/1.0.0...1.1.0

Three defects the security audit named, closed. Nothing in the interface changed.

### Security

- A profile past the age bound is refused on read, not only swept.
  Retention was enforced by deletion alone,
  so on an instance nobody is browsing a profile stayed readable by id
  for as long as its file survived.

- Every MCP response says its payload is recorded data,
  so an agent reads the captured values as evidence rather than as instructions.

- The access key needs at least 32 characters and locks out an address
  after ten wrong keys in fifteen minutes.
  The floor is applied when the configuration resolves as well as on save,
  so writing a short one straight to the database is no way around it.

## 1.0.0 - 2026-08-21

Initial release 🎉
