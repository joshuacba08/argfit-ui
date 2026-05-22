# Productive Semver Policy

This document defines the semver, deprecation and migration rules for the `1.0.0` contract.

## Contract Boundary

The semver-governed surface for ArgFit UI is:

- package versions published under the `@argfit-ui/*` scope
- the public barrel exports frozen in `docs/productive/public-api.md`
- the recommended import path documented in `docs/productive/scope.md`
- ArgFit-owned type shapes, input/output semantics and documented renderer behavior for public APIs

The following are not semver-governed public contracts unless explicitly documented otherwise:

- internal implementation details inside libraries
- PrimeNG, Ionic, Angular CDK or ECharts implementation choices
- internal CSS class names inside renderer implementations
- showcase-only composition details
- temporary tooling or generated `.tmp` artifacts

## Versioning Rules

### Patch Releases

Patch releases (`1.0.x`) are for:

- bug fixes
- accessibility fixes
- visual fixes
- documentation fixes
- dependency updates that do not change the public API contract
- internal performance improvements that preserve public behavior

Patch releases must not:

- remove public exports
- rename public exports
- narrow documented public type contracts in a breaking way
- change default behavior in a way that requires consumer code changes

### Minor Releases

Minor releases (`1.x.0`) are for additive evolution:

- new components or directives added to public barrels
- new optional inputs, outputs or configuration values
- new ArgFit-owned type members added compatibly
- new tokens, themes or documented renderer integrations added without breaking the existing contract

Minor releases must keep all existing `1.0.0` public APIs working without mandatory migration.

### Major Releases

Major releases (`2.0.0`, `3.0.0`, and so on) are required for:

- removing public exports
- renaming public exports
- breaking public type shapes
- changing required behavior in a way that forces consumer rewrites
- moving public APIs between packages in a non-compatible way

## Deprecation Policy

ArgFit UI deprecates public APIs only with a documented path forward.

Required steps:

1. Mark the API as deprecated in docs and changelog before removal.
2. Point to the replacement API or migration path.
3. Keep the deprecated API available for the rest of the current major line unless there is a security or correctness reason that makes continued support impossible.
4. Remove the deprecated API only in the next major release.

Additional rules:

- deprecations in renderer packages follow the same process as adaptive APIs
- if there is no direct replacement, the docs must state that explicitly
- deprecations should land with migration examples whenever consumer code is expected to change

## Migration Policy

### Into 1.0.0

Migration from alpha, beta or Beta+ into `1.0.0` should be low-friction for consumers already using the published public barrels.

The expected migration posture is:

- prefer `@argfit-ui/adaptive` imports for application code
- keep `@argfit-ui/core` and `@argfit-ui/primitives` for shared runtime and primitive contracts
- treat `@argfit-ui/desktop` and `@argfit-ui/mobile` as intentional renderer-targeted integration points
- remove reliance on backlog or planned surfaces that never entered the public barrels
- align internal wrappers with the `1.0.0` names and semantics frozen in `docs/productive/public-api.md`

### Within 1.x

Migration between `1.x` releases should be optional or purely additive. If a release needs a required migration, that change belongs in the next major.

### For Future Major Releases

Every future major must ship with:

- a documented breaking-change summary
- a package-level migration guide
- replacement recommendations for removed or deprecated APIs
- notes for adaptive and renderer-specific consumers when behavior changes differ by package

## Stable API Expectations

For the `1.0.0` line:

- all public APIs listed in `docs/productive/public-api.md` are considered stable
- all public APIs must retain ArgFit-owned naming and vendor-independent signatures
- any new public surface added in `1.x` must be categorized before release and documented as part of the semver-governed contract
