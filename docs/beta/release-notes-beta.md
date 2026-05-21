# Release Notes: 0.1.0-beta.0

ArgFit UI `0.1.0-beta.0` promotes the prerelease baseline from public alpha to a dedicated beta channel with a reproducible release gate.

## Summary

- Shared version: `0.1.0-beta.0`.
- Publish tag: `beta`.
- Primary application path: `@argfit-ui/adaptive` plus `provideArgfitUi` from `@argfit-ui/core`.

## Included In This Beta

- Stable-for-beta contract for `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`, `AfBadge`, `AfPageShell` and `AfMetricCard`.
- `experimental-in-beta` contract for analytics, data-table, expanded form controls and feedback APIs.
- Dedicated beta pack flow through `pnpm pack:beta`, `pnpm publish:beta:dry-run` and `dist/beta-tarballs/`.
- Reproducible beta release gate through `pnpm release:beta:check`, CI and `publish-beta.yml`.
- Consumer compatibility smoke, visual smoke, accessibility baseline and performance measurement all wired into the beta release story.
- Beta consumer docs, API reference, theming, known limitations, migration notes, release checklist and release notes.

## Validation Commands

Run before tagging:

```bash
pnpm publish:beta:dry-run
pnpm release:beta:check
```

## Publish Workflow

- Git tag: `v0.1.0-beta.0`
- GitHub Actions workflow: `publish-beta.yml`
- npm publish mode: `--tag beta --access public`

## Consumer Notes

- Keep all `@argfit-ui/*` packages aligned on the exact `0.1.0-beta.0` version.
- Prefer adaptive imports in application code.
- Treat `experimental-in-beta` APIs as opt-in previews that may still evolve during beta.
- Review [migration notes](./migration-alpha-to-beta.md) before upgrading from alpha.