# Release Notes: 1.0.0 Target Archive

ArgFit UI `1.0.0` is the first productive contract for the platform.

This page preserves the earlier target release story. The canonical shipped release notes now live in [release notes 1.0.0](./release-notes-1.0.0.md).

## Summary

- Recommended version target: `1.0.0`
- Primary application path: `@argfit-ui/adaptive` plus `provideArgfitUi` from `@argfit-ui/core`
- Product posture: frozen public API, semver policy, enterprise guidance and mandatory production gate

## Included In The Productive Line

- Frozen public barrels documented in [productive public API](./public-api.md)
- Scope freeze and `1.0.x` rules documented in [scope](./scope.md) and [semver policy](./semver-policy.md)
- Production validation through `pnpm release:production:check`
- Performance budgets and package smoke for production `1.0.0` tarballs
- Productive docs for quickstart, components, API, theming, accessibility, enterprise readiness, release operations, support policy, migration and release notes
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

The documentation, public API freeze, support policy, release operations, package metadata and production gate now describe the `1.0.0` contract. The production publish workflow refuses prerelease metadata and publishes only with the `latest` dist-tag.

## Recommended Reading

- [Productive quickstart](./quickstart.md)
- [Productive components](./components.md)
- [Productive API reference](./api-reference.md)
- [Productive theming](./theming.md)
- [Productive enterprise readiness](./enterprise-readiness.md)
- [Productive quality gates](./quality-gates.md)
- [Productive release operations](./release-operations.md)
- [Productive support policy](./support-policy.md)
