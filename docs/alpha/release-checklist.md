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
- Confirm package scope ownership, registry target and license policy before publishing.

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

## Private Registry Publish

Publish only after registry authentication and package ownership are confirmed:

```bash
npm publish dist/argfit-ui-core --tag alpha --access restricted
npm publish dist/argfit-ui-primitives --tag alpha --access restricted
npm publish dist/argfit-ui-desktop --tag alpha --access restricted
npm publish dist/argfit-ui-mobile --tag alpha --access restricted
npm publish dist/argfit-ui-adaptive --tag alpha --access restricted
```

If the private registry does not use npmjs access flags, omit `--access restricted` and configure the registry through `.npmrc` or `npm config set registry` before publishing.

## Public Publish Hold

Do not publish these artifacts as public npm packages until the `@argfit-ui` scope and repository license decision are finalized.
