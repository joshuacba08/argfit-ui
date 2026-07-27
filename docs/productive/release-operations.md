# Productive Release Operations

This document defines the release operations policy for the productive `1.x` line.

The source manifests, publishable package manifests and production packaging flow are aligned to stable `1.1.0` metadata. Production packages publish only through the `latest` npm dist-tag.

## Branch And Tag Strategy

- `main` is the integration branch and the source of truth for productive release candidates.
- Use short-lived `release/<version>` branches only when a production release needs final stabilization after feature work has stopped.
- Use short-lived `hotfix/<version>` branches for urgent production patches that start from the latest supported production tag.
- Merge release and hotfix branches back to `main` after the release is tagged.
- Production tags use annotated semver tags without prerelease identifiers, such as `v1.0.0` or `v1.0.1`.
- Alpha, beta and Beta+ tags stay on their dedicated prerelease workflows and must not use the production publish workflow.

## Required Release Gate

Every production release candidate must pass the full gate before tagging or publishing:

```bash
pnpm release:production:check
```

The gate must pass locally and in CI. If any source, docs, package metadata or workflow file changes after the last green gate, rerun the gate before tagging.

Use [production release checklist](./release-checklist.md) for the final pre-tag review.

## npm Publish Process

Production npm publishing is performed by `.github/workflows/publish-production.yml`.

The workflow:

- runs on manual dispatch and on `v1.*.*` tag pushes
- checks out the exact release tag
- rejects prerelease tags
- runs `pnpm release:production:check`
- rebuilds library packages after the gate so `dist/argfit-ui-*` reflects the tagged source manifests
- verifies every publishable package version matches the tag version
- verifies every publishable package has `publishConfig.access = public`
- verifies every publishable package has `publishConfig.tag = latest`
- verifies internal `@argfit-ui/*` peer dependencies are aligned to the release version
- verifies npm authentication through `NPM_TOKEN`
- publishes each built package with `npm publish <dist-package> --tag latest --access public`

The production workflow must not be dispatched from an arbitrary commit. It publishes only from a tag that points at `HEAD` in the checked-out repository.

## Patch Release Procedure

Patch releases (`1.0.x`) are for compatible fixes as defined in [semver policy](./semver-policy.md).

Use this procedure for a production patch:

1. Confirm the issue affects the supported production line and does not require a breaking API change.
2. Create a `hotfix/<version>` branch from the latest supported production tag or from `main` if `main` already contains the required production baseline.
3. Add or update focused tests, smoke coverage or docs that prove the fix.
4. Update package versions and internal `@argfit-ui/*` peer dependencies to the patch version.
5. Update `CHANGELOG.md` with the patch entry before tagging.
6. Run `pnpm release:production:check` locally.
7. Open and merge the release pull request after CI is green.
8. Create the annotated tag, for example `git tag -a v1.0.1 -m "ArgFit UI 1.0.1"`.
9. Push the tag and let `.github/workflows/publish-production.yml` publish the packages.
10. Verify npm shows all five `@argfit-ui/*` packages on the `latest` dist-tag for the patch version.

Patch releases must not remove public exports, rename public exports, narrow documented type contracts or change defaults in a way that requires consumer rewrites.

## Changelog Policy

`CHANGELOG.md` is the release history source of truth.

Each production release entry must include:

- the released version as a top-level version heading, for example `## 1.0.1`
- a short release summary
- relevant sections from `Added`, `Changed`, `Fixed`, `Security`, `Deprecated` and `Removed`
- links or names for affected public packages and components when useful
- migration notes for any deprecation or behavior change that could affect consumers
- confirmation that the production gate was run before tagging

Changelog entries must land before the release tag. Deprecations must name the replacement path and the earliest removal window.

## Failed Publish And Recovery

npm packages are immutable after publish. If a production publish fails partway through:

- stop and identify exactly which packages published
- do not force-republish the same version
- publish a new patch version if consumers could receive a partial or inconsistent package set
- use `npm deprecate` only for genuinely bad published artifacts and include the replacement version in the message
- record the recovery in `CHANGELOG.md` and the release notes

Unpublishing public production packages is reserved for npm policy, legal or security emergencies.
