# Publish Alpha Procedure

This is the manual procedure for producing and verifying `0.1.0-alpha.0` package artifacts.

HU-016 does not publish to npm. Publishing should happen only after the maintainer confirms registry access, package ownership and license policy.

## Prerequisites

- Node, pnpm and npm available in the shell.
- Clean or intentionally reviewed git worktree.
- Registry authentication configured if publishing to a private registry.
- License decision reviewed. Current alpha manifests are `UNLICENSED`.

## 1. Build Packages

Run the alpha release gate before tagging or publishing:

```bash
pnpm release:alpha:check
```

For manual inspection, the individual steps are:

```bash
pnpm build:libs
```

This writes the package artifacts to:

```txt
dist/argfit-ui-core
dist/argfit-ui-primitives
dist/argfit-ui-desktop
dist/argfit-ui-mobile
dist/argfit-ui-adaptive
```

## 2. Run Pack Dry-Run

```bash
pnpm publish:alpha:dry-run
```

The script runs `npm pack --dry-run --json` for each built package and validates metadata, internal peer versions and accidental tarball contents.

Equivalent manual commands:

```bash
pnpm build:libs
cd dist/argfit-ui-core && npm pack --dry-run
cd ../argfit-ui-primitives && npm pack --dry-run
cd ../argfit-ui-desktop && npm pack --dry-run
cd ../argfit-ui-mobile && npm pack --dry-run
cd ../argfit-ui-adaptive && npm pack --dry-run
```

## 3. Generate Local Tarballs

```bash
pnpm pack:alpha
```

Tarballs are written to:

```txt
dist/alpha-tarballs/
```

Expected filenames:

```txt
argfit-ui-core-0.1.0-alpha.0.tgz
argfit-ui-primitives-0.1.0-alpha.0.tgz
argfit-ui-desktop-0.1.0-alpha.0.tgz
argfit-ui-mobile-0.1.0-alpha.0.tgz
argfit-ui-adaptive-0.1.0-alpha.0.tgz
```

## 4. Local Consumer Install

In a throwaway Angular 21 consumer app, install the tarballs from `dist/alpha-tarballs`:

```bash
npm install path/to/argfit-ui-core-0.1.0-alpha.0.tgz
npm install path/to/argfit-ui-primitives-0.1.0-alpha.0.tgz
npm install path/to/argfit-ui-desktop-0.1.0-alpha.0.tgz
npm install path/to/argfit-ui-mobile-0.1.0-alpha.0.tgz
npm install path/to/argfit-ui-adaptive-0.1.0-alpha.0.tgz
```

Then verify a minimal app can import:

```ts
import { provideArgfitUi } from '@argfit-ui/core';
import { AfButton, AfCard, AfInput } from '@argfit-ui/adaptive';
```

## 5. Private Registry Publish

Use this only after registry authentication and package ownership are confirmed.

```bash
pnpm build:libs
node tools/pack-alpha.mjs --dry-run
npm publish dist/argfit-ui-core --tag alpha --access restricted
npm publish dist/argfit-ui-primitives --tag alpha --access restricted
npm publish dist/argfit-ui-desktop --tag alpha --access restricted
npm publish dist/argfit-ui-mobile --tag alpha --access restricted
npm publish dist/argfit-ui-adaptive --tag alpha --access restricted
```

If the private registry does not use npmjs access flags, omit `--access restricted` and configure the registry through `.npmrc` or `npm config set registry` before publishing.

## Do Not Publish Publicly Yet

Do not publish these artifacts to the public npm registry as public packages until:

- The `@argfit-ui` package scope is owned by the maintainer or organization.
- A public license is selected and added to the repository.

Use the [release checklist](release-checklist.md) before creating `v0.1.0-alpha.0` or publishing to a private registry.
