# Changelog

All notable changes to ArgFit UI are documented here.

## 1.0.0

First production release of ArgFit UI.

### Added

- Stable `1.0.0` package metadata across `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile` and `@argfit-ui/adaptive`.
- Exact internal `@argfit-ui/*` peer dependency alignment on `1.0.0` for the production package set.
- npm latest dist-tag metadata and production publish validation through `publish-production.yml`.
- Production tarball flow under `dist/production-tarballs/` through `pnpm pack:production:dist`.
- Production release checklist and canonical `1.0.0` release notes under `docs/productive/`.

### Notes

- `pnpm release:production:check` is the required gate before tagging or publishing production releases.
- Production packages must publish with the `latest` dist-tag and public npm access.
- Prerelease alpha, beta and Beta+ docs remain available as historical upgrade context.

## 0.2.0-beta.0

First dedicated Beta+ delivery channel for ArgFit UI.

### Added

- Parallel Beta+ tarball flow under `dist/beta-plus-tarballs/` stamped to `0.2.0-beta.0` without disturbing the historical `0.1.0-beta.0` source baseline.
- Dedicated Beta+ consumer smoke, visual smoke, accessibility audit and public API guard through `pnpm beta-plus:consumer-smoke`, `pnpm visual:beta-plus`, `pnpm audit:accessibility:beta-plus` and `pnpm guard:beta-plus:api`.
- Dedicated Beta+ release gate through `pnpm release:beta-plus:check` and the optional `publish-beta-plus.yml` workflow.
- Beta+ release and validation docs through `docs/beta-plus/visual-qa.md`, `docs/beta-plus/release-checklist.md` and `docs/beta-plus/release-notes-beta-plus.md`.

### Notes

- The source workspace remains on the historical `0.1.0-beta.0` baseline so existing beta regression guards keep working.
- Published Beta+ tarballs are generated as `0.2.0-beta.0` during packaging.
- `AfTreeSelect` remains outside this release and the current selection validation uses `AfListbox` as the implemented hierarchical-selection fallback.

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
