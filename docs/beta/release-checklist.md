# Beta Release Checklist

Use this checklist before tagging or publishing `0.1.0-beta.0` artifacts.

## Required Gate

Run the full local beta gate from a clean or intentionally reviewed worktree:

```bash
pnpm release:beta:check
```

This gate validates architecture, production build, unit tests, regression contracts, beta pack dry-run, beta tarball generation, consumer smoke, visual smoke, reproducible performance measurement and beta smoke.

## Pre-Tag Checklist

- Confirm the version is `0.1.0-beta.0` in the root workspace and every publishable `@argfit-ui/*` package.
- Confirm `pnpm release:beta:check` passes locally.
- Confirm CI passes on the release branch or pull request.
- Confirm `git status --short` contains only intentional source and documentation changes.
- Confirm `.tmp/` is absent or ignored and `dist/beta-tarballs/*.tgz` is not versioned.
- Review [release notes](release-notes-beta.md), [known limitations](known-limitations.md) and [migration notes](migration-alpha-to-beta.md).
- Confirm package scope ownership on npm.
- Confirm the GitHub Actions secret `NPM_TOKEN` exists and has publish rights for `@argfit-ui`.

## Tag

Create the tag only after the gate passes:

```bash
git tag v0.1.0-beta.0
git push origin v0.1.0-beta.0
```

## Tarball Distribution

Generate local tarballs:

```bash
pnpm pack:beta
```

Tarballs are written to:

```txt
dist/beta-tarballs/
```

Share these files only through the approved beta distribution channel.

## Public npm Publish

Automated publish uses [publish-beta.yml](../../.github/workflows/publish-beta.yml) and the repository secret `NPM_TOKEN`.

For a manual local publish, publish the generated tarballs:

```bash
npm publish dist/beta-tarballs/argfit-ui-core-0.1.0-beta.0.tgz --tag beta --access public
npm publish dist/beta-tarballs/argfit-ui-primitives-0.1.0-beta.0.tgz --tag beta --access public
npm publish dist/beta-tarballs/argfit-ui-desktop-0.1.0-beta.0.tgz --tag beta --access public
npm publish dist/beta-tarballs/argfit-ui-mobile-0.1.0-beta.0.tgz --tag beta --access public
npm publish dist/beta-tarballs/argfit-ui-adaptive-0.1.0-beta.0.tgz --tag beta --access public
```

## GitHub Actions Publish

After pushing `v0.1.0-beta.0`, GitHub Actions will use `NPM_TOKEN` as `NODE_AUTH_TOKEN` and publish the five packages automatically.

## Publish Notes

The publishable packages are MIT licensed and configured with `publishConfig.access = public` and `publishConfig.tag = beta`.
