# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.6] - 2026-10-20

### Fixed

- `verifyMinecraft` always returning `false` because `mojang.pem` could not be found. The key now lives in `src/`

### Changed
- Updated dependencies
- README

## [1.3.5] - 2026-06-26

### Changed

- Updated dependencies (`axios` 1.18.1, `jsonwebtoken` 9.0.3)
- npm publishing workflow
- Added repository information to `package.json`

## [1.3.4] - 2025-06-12

### Changed

- Moved back from ES modules to CommonJS
- Updated documentation

## [1.3.3] - 2025-06-09

### Changed

- Reformatted code

### Fixed

- Package version

## [1.3.2] - 2025-04-22

### Changed

- Migrated from CommonJS to ES modules
- Source moved into `src/`

## [1.3.1] - 2025-01-20

> Tagged as `v1.3.1`.

### Added

- `CHANGELOG.md`

### Changed

- **Breaking:** Package renamed from `@jackcooper04/cauldronauthentication` to `@jackcooperdev/cauldronauthentication`
- Updated `package-lock.json`

### Fixed

- GitHub Actions
- README

## [1.3.0] - 2024-12-22

### Changed

- **Breaking:** `startAuthenticationFlow` now takes a single Microsoft access token
  (`startAuthenticationFlow(microsoftAccessToken)`). The `restoreData` and `forceRefresh` arguments have been removed and
  the full flow runs on every call
- `authenticateXboxLive` now returns the Xbox Live token instead of the full response

### Removed

- Microsoft OAuth management. Getting a Microsoft access token is now handled by the application

## [1.2.0] - 2024-12-22

### Changed

- **Breaking:** `startAuthenticationFlow(accessToken, restoreData, forceRefresh)` no longer takes Azure credentials or
  a refresh token

### Removed

- Token refreshing (`refreshToken` and `redeemToken`)
- `refresh_token` from the `startAuthenticationFlow` result
- `qs` dependency

## [1.1.0] - 2024-12-18

### Changed

- GitHub Actions publishing workflows

## [1.0.6] - 2024-12-18

### Changed

- **Breaking:** MAS functions now return their data directly instead of `{ toSave, toReturn }` objects
- **Breaking:** Error codes renamed: `REDEEM_FAIL`, `XBOXLIVE_AUTH_FAIL`, `MOJANG_FAIL`, `MINECRAFT_FAIL`,
  `PROFILE_GET_ERROR`
- Rewrote README

## [1.0.5] - 2024-12-17

### Changed

- Code tidy up
- Missing accounts now reject with `No Such Account` instead of throwing

### Removed

- Deprecated code

## [1.0.4] - 2024-11-15

> This tag points at code still versioned 1.0.3.

### Fixed

- npm publishing workflow

## [1.0.3] - 2024-11-15

### Added

- npm publishing workflow
- `azureCredentials` argument to `startAuthenticationFlow`, replacing the bundled config

### Changed

- Updated `axios` to 1.7.4
- README updates

### Removed

- Bundled `config.json` and logger
- `setAuthCode`
- Console logging

## [1.0.2] - 2024-08-10

### Changed

- OAuth redirect URI moved to `https://api.cauldronmc.com/microsoft/mcCallback`

## [1.0.1] - 2024-08-02

### Changed

- OAuth redirect URI moved from localhost to `https://api.cauldronmc.com/auth/mcCallback`

## [1.0.0] - 2024-07-26

### Added

- Initial release
- Microsoft authentication flow (`startAuthenticationFlow`) with token refreshing and session restoring
- MAS functions: `redeemToken`, `refreshToken`, `authenticateXboxLive`, `authorizeMojang`, `authenticateMinecraft`,
  `verifyMinecraft` and `getProfileData`

[unreleased]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.3.6...HEAD
[1.3.6]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.3.5...1.3.6
[1.3.5]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.3.4...1.3.5
[1.3.4]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.3.3...1.3.4
[1.3.3]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.3.2...1.3.3
[1.3.2]: https://github.com/jackcooperdev/CauldronAuthentication/compare/v1.3.1...1.3.2
[1.3.1]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.3.0...v1.3.1
[1.3.0]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.0.6...1.1.0
[1.0.6]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.0.5...1.0.6
[1.0.5]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.0.4...1.0.5
[1.0.4]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.0.3...1.0.4
[1.0.3]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/jackcooperdev/CauldronAuthentication/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/jackcooperdev/CauldronAuthentication/releases/tag/1.0.0
