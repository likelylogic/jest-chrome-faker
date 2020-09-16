# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]


## [0.2.0] - 2019-09-16

Added

- Initial stubs for [High Priority](https://github.com/likelylogic/jest-chrome-fake/issues?q=is%3Aopen+is%3Aissue+milestone%3A%22High+Priority%22) APIs
- Standard JS

Removed

- Prettier

Changed

- Simplified setup and build process
- Mocking function now supports non-API properties (enables inspection / debugging of fake API states)

Fixed

- Chrome must now be injected into the module with `setChrome(global.chrome)`


## [0.1.0] - 2019-09-15

Added

- Initial implementations of Tabs, Storage, History
- Unit tests for Tabs, Storage, History


[Unreleased]: https://github.com/likelylogic/jest-chrome-faker/compare/v1.0.0...HEAD
[0.2.0]: https://github.com/likelylogic/jest-chrome-faker/compare/v0.0.1...v0.0.2
[0.1.0]: https://github.com/likelylogic/jest-chrome-faker/releases/tag/v0.0.1
