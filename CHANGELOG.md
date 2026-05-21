# Changelog

All notable changes to ArgFit UI are documented here.

## 0.1.0-beta.0

First dedicated beta channel for ArgFit UI.

### Added

- Beta package metadata aligned on `0.1.0-beta.0` across `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile` and `@argfit-ui/adaptive`.
- Dedicated beta tarball flow under `dist/beta-tarballs/`.
- Beta release gate through `pnpm release:beta:check`.
- Dedicated beta smoke, publish workflow and release docs through `tools/beta-smoke.mjs`, `publish-beta.yml`, `docs/beta/release-notes-beta.md` and `docs/beta/release-checklist.md`.

### Notes

- Packages are MIT licensed.
- Beta publish uses the beta dist-tag and `publish-beta.yml`.
- Consumers should pin exact `0.1.0-beta.0` versions during prerelease evaluation.

## 0.1.0-alpha.0

Initial alpha candidate for ArgFit UI.

### Added

- Publishable packages for `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile` and `@argfit-ui/adaptive`.
- Token-driven theme runtime with dark and light themes.
- Adaptive component API over desktop PrimeNG and mobile Ionic renderers.
- Stable-for-alpha components: `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`, `AfBadge`, `AfPageShell` and `AfMetricCard`.
- Experimental alpha APIs for analytics, data table, form controls, password and feedback components.
- Alpha package metadata, local tarball generation, pack dry-run validation and release gate CI.

### Notes

- Packages are MIT licensed.
- Intended alpha distribution is the public npm registry with the `alpha` dist-tag, with tarballs still available for manual verification.
- Breaking changes can occur before beta; consumers should pin exact `0.1.0-alpha.0` versions.
