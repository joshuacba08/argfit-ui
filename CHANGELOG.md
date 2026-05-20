# Changelog

All notable changes to ArgFit UI are documented here.

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
