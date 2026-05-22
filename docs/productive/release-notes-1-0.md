# Release Notes: 1.0.0 Target

ArgFit UI `1.0.0` is the first productive contract for the platform.

This page documents the intended `1.0.0` release story and the hardening already completed in the repository. It is a target release note until the final publish alignment work lands.

## Summary

- Recommended version target: `1.0.0`
- Primary application path: `@argfit-ui/adaptive` plus `provideArgfitUi` from `@argfit-ui/core`
- Product posture: frozen public API, semver policy, enterprise guidance and mandatory production gate

## Included In The Productive Line

- Frozen public barrels documented in [productive public API](./public-api.md)
- Scope freeze and `1.0.x` rules documented in [scope](./scope.md) and [semver policy](./semver-policy.md)
- Production validation through `pnpm release:production:check`
- Performance budgets and package smoke for the current publishable substrate
- Productive docs for quickstart, components, API, theming, accessibility, enterprise readiness, migration and release notes
- Showcase documentation front that exposes the productive docs posture through the current Angular app

## Consumer Notes

- Prefer `@argfit-ui/adaptive` for application code.
- Keep all `@argfit-ui/*` packages aligned on the same release.
- Do not assume planned backlog surfaces are part of `1.0.0` unless they are documented in the public barrels.
- Use the productive docs as the source of truth instead of older beta/Beta+ assumptions.

## Validation Commands

Run before accepting the productive line:

```bash
pnpm build:all
pnpm test:all
pnpm release:production:check
```

## Publish Reality

The documentation, public API freeze and production gate now describe the `1.0.0` contract, but the final package version alignment and release workflow are still completed later in the roadmap. Until that step lands, the productive gate intentionally reuses the Beta+ packaging substrate.

## Recommended Reading

- [Productive quickstart](./quickstart.md)
- [Productive components](./components.md)
- [Productive API reference](./api-reference.md)
- [Productive theming](./theming.md)
- [Productive enterprise readiness](./enterprise-readiness.md)
- [Productive quality gates](./quality-gates.md)
