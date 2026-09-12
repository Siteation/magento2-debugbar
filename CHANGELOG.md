# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

[Unreleased]: https://github.com/Siteation/magento2-debugbar/compare/1.2.0...main

## [1.2.0] - 2026-09-12

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
