# Release Notes: 1.0.0

ArgFit UI `1.0.0` is the first production release of the adaptive Angular UI platform.

## Summary

- Stable version: `1.0.0`
- npm dist-tag: `latest`
- Primary application path: `@argfit-ui/adaptive`
- Runtime bootstrap: `provideArgfitUi` from `@argfit-ui/core`
- Production validation: `pnpm release:production:check`

## Added

- Stable package metadata for `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile` and `@argfit-ui/adaptive`.
- Internal `@argfit-ui/*` peer dependency alignment on exact version `1.0.0`.
- Production npm packaging through `dist/production-tarballs/` and `tools/pack-production.mjs`.
- Production release checklist for version alignment, docs, tagging, workflow validation and recovery.
- Production publish workflow guardrails for stable `v1.*.*` tags, npm `latest`, public access and internal peer alignment.

## Stable Contract

The recommended application-facing API is the adaptive package. Consumers should install all ArgFit packages at the same exact version and prefer semantic adaptive imports over renderer-specific imports.

Renderer packages remain public for intentional desktop or mobile integration work, but PrimeNG and Ionic APIs remain implementation details behind ArgFit-owned contracts.

## Validation

The production gate must pass before tagging or publishing:

```bash
pnpm release:production:check
```

The gate validates architecture boundaries, tests, regression expectations, Beta+ consumer coverage, production packaging, production performance budgets and production smoke checks.

## Publish Notes

Production publish uses `.github/workflows/publish-production.yml` from a stable `v1.0.0` tag. The workflow publishes the five built package directories with:

```bash
npm publish <dist-package> --tag latest --access public
```

Do not use alpha, beta or Beta+ workflows for `1.0.0` production packages.

## Migration Notes

- Move from prerelease package versions to exact `1.0.0` versions.
- Keep all `@argfit-ui/*` packages aligned on the same version.
- Review [migration beta/Beta+ to 1.0](./migration-beta-to-1-0.md) before upgrading prerelease consumers.
- Run consumer application tests after upgrading, especially around overlays, forms, feedback and dense data views.
