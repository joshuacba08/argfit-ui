# Alpha Package Metadata

This document records the package metadata decision for `0.1.0-alpha.0`.

HU-016 prepared the artifacts; the current metadata now supports public npm publication.

## Version

All publishable packages use the same prerelease version:

```txt
0.1.0-alpha.0
```

The root workspace is also set to `0.1.0-alpha.0` for milestone alignment, but it remains `private: true` and is not publishable.

## License Decision

The repository now ships with an MIT license and all publishable package manifests use:

```json
"license": "MIT"
```

The alpha can be consumed directly from npm or from generated tarballs.

## Publish Config

Each publishable package declares:

```json
"publishConfig": {
  "access": "public",
  "tag": "alpha"
}
```

This records the intended prerelease dist-tag and allows public npm distribution under the `alpha` channel.

## Package Matrix

| Package | Version | License | Publish mode | Role |
| --- | --- | --- | --- | --- |
| `@argfit-ui/core` | `0.1.0-alpha.0` | `MIT` | public npm or tarball | Tokens, themes, config, services and shared types |
| `@argfit-ui/primitives` | `0.1.0-alpha.0` | `MIT` | public npm or tarball | Vendor-agnostic accessibility and icon primitives |
| `@argfit-ui/desktop` | `0.1.0-alpha.0` | `MIT` | public npm or tarball | Desktop renderer package backed by PrimeNG internally |
| `@argfit-ui/mobile` | `0.1.0-alpha.0` | `MIT` | public npm or tarball | Mobile renderer package backed by Ionic internally |
| `@argfit-ui/adaptive` | `0.1.0-alpha.0` | `MIT` | public npm or tarball | Primary adaptive component API |

## Internal Peer Dependencies

Internal `@argfit-ui/*` package relationships use the exact alpha version. This prevents accidental mixing of incompatible prerelease builds.

| Package | Internal peers |
| --- | --- |
| `@argfit-ui/core` | none |
| `@argfit-ui/primitives` | `@argfit-ui/core@0.1.0-alpha.0` |
| `@argfit-ui/desktop` | `@argfit-ui/core@0.1.0-alpha.0`, `@argfit-ui/primitives@0.1.0-alpha.0` |
| `@argfit-ui/mobile` | `@argfit-ui/core@0.1.0-alpha.0`, `@argfit-ui/primitives@0.1.0-alpha.0` |
| `@argfit-ui/adaptive` | `@argfit-ui/core@0.1.0-alpha.0`, `@argfit-ui/primitives@0.1.0-alpha.0`, `@argfit-ui/desktop@0.1.0-alpha.0`, `@argfit-ui/mobile@0.1.0-alpha.0` |

## External Peer Dependencies

External peers reflect the current Angular and renderer stack used by the workspace.

| Package | External peers |
| --- | --- |
| `@argfit-ui/core` | `@angular/common`, `@angular/core` |
| `@argfit-ui/primitives` | `@angular/cdk`, `@angular/common`, `@angular/core`, `@lucide/angular` |
| `@argfit-ui/desktop` | `@angular/cdk`, `@angular/common`, `@angular/core`, `@angular/forms`, `primeng`, `echarts` |
| `@argfit-ui/mobile` | `@angular/cdk`, `@angular/common`, `@angular/core`, `@ionic/angular`, `echarts` |
| `@argfit-ui/adaptive` | `@angular/common`, `@angular/core`, `@angular/forms` plus internal renderer peers |

## Scripts

Root scripts added for the alpha packaging flow:

```bash
pnpm build:packages
pnpm pack:alpha
pnpm publish:alpha:dry-run
pnpm release:alpha:check
```

`pnpm publish:alpha:dry-run` rebuilds the libraries and runs `npm pack --dry-run` for every package under `dist/argfit-ui-*`.

`pnpm pack:alpha` rebuilds the libraries and writes tarballs to:

```txt
dist/alpha-tarballs/
```

`pnpm release:alpha:check` runs the alpha release gate: architecture guard, production build, full tests, pack dry-run, tarball generation and the consumer smoke test.

`publish-alpha.yml` uses `NPM_TOKEN` in GitHub Actions and publishes the generated tarballs to npm with `--access public --tag alpha`.

## ng-packagr Entry Points

The five `projects/*/ng-package.json` files were reviewed for HU-016. No changes were required:

- Each package writes to its matching `dist/argfit-ui-*` directory.
- Each package uses `src/public-api.ts` as its entry file.
- Package metadata is sourced from the package-level `package.json` and copied into `dist` during `pnpm build:libs`.

## Tarball Content Rules

`tools/pack-alpha.mjs` validates each built package before and after `npm pack`:

- Package name must be scoped under `@argfit-ui/*`.
- Version must be `0.1.0-alpha.0`.
- Package must not be `private: true`.
- Metadata fields must exist: description, keywords, author, license, repository, homepage and bugs.
- Internal `@argfit-ui/*` relationships must be peer dependencies at the exact alpha version.
- Tarball must include `package.json`, `README.md` and `LICENSE`.
- Tarball must not include source folders, workspace projects, showcase output, logs, lockfiles, temp files or env files.
