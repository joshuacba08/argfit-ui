# Alpha Release Checklist

Use this checklist before tagging or publishing `0.1.0-alpha.0` artifacts.

## Required Gate

Run the full local gate from a clean or intentionally reviewed worktree:

```bash
pnpm release:alpha:check
```

This gate validates architecture, production build, unit tests, regression contracts, package dry-run, tarball generation and a minimal TypeScript consumer import smoke test.

## Pre-Tag Checklist

- Confirm the version is `0.1.0-alpha.0` in the root workspace and every publishable `@argfit-ui/*` package.
- Confirm `pnpm release:alpha:check` passes locally.
- Confirm CI passes on the release branch or pull request.
- Confirm `git status --short` contains only intentional source and documentation changes.
- Confirm `.tmp/` is absent or ignored and `dist/alpha-tarballs/*.tgz` is not versioned.
- Review [release notes](release-notes-alpha.md) and [known limitations](known-limitations.md).
- Confirm package scope ownership on npm.
- Confirm the GitHub Actions secret `NPM_TOKEN` exists and has publish rights for `@argfit-ui`.

## Tag

Create the tag only after the gate passes:

```bash
git tag v0.1.0-alpha.0
git push origin v0.1.0-alpha.0
```

## Tarball Distribution

Generate local tarballs:

```bash
pnpm pack:alpha
```

Tarballs are written to:

```txt
dist/alpha-tarballs/
```

Share these files only through the approved alpha distribution channel.

## Public npm Publish

Automated publish uses [publish-alpha.yml](../../.github/workflows/publish-alpha.yml) and the repository secret `NPM_TOKEN`.

For a manual local publish, publish the generated tarballs:

```bash
npm publish dist/alpha-tarballs/argfit-ui-core-0.1.0-alpha.0.tgz --tag alpha --access public
npm publish dist/alpha-tarballs/argfit-ui-primitives-0.1.0-alpha.0.tgz --tag alpha --access public
npm publish dist/alpha-tarballs/argfit-ui-desktop-0.1.0-alpha.0.tgz --tag alpha --access public
npm publish dist/alpha-tarballs/argfit-ui-mobile-0.1.0-alpha.0.tgz --tag alpha --access public
npm publish dist/alpha-tarballs/argfit-ui-adaptive-0.1.0-alpha.0.tgz --tag alpha --access public
```

## GitHub Actions Publish

After pushing `v0.1.0-alpha.0`, GitHub Actions will use `NPM_TOKEN` as `NODE_AUTH_TOKEN` and publish the five packages automatically.

## Public Publish Notes

The publishable packages are MIT licensed and configured with `publishConfig.access = public` and `publishConfig.tag = alpha`.
