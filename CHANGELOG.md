# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
where applicable.

## [Unreleased]

### Added

- Added an initial changelog to track future project changes.
- Added resilient Firebase API helpers, form validation, loading states, and user feedback.
- Added behavioral tests and a complete lint, test, audit, and build CI pipeline.
- Added an environment variable template for Firebase configuration.

### Changed

- Redesigned the movie library with a responsive, accessible interface.
- Rewrote the README with accurate setup, architecture, quality, and security guidance.
- Simplified the dependency tree by removing unused form, date picker, fetch, and styling packages.

### Fixed

- Refresh the library automatically after a movie is added.
- Use stable Firebase record identifiers as React keys.
- Keep Firebase endpoints out of committed source code.

<!--
When preparing a release, move relevant entries from Unreleased into a dated
version section. Use Added, Changed, Deprecated, Removed, Fixed, and Security
headings as appropriate.
-->
