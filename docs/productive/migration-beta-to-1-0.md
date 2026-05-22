# Migration Beta And Beta+ To 1.0

This guide explains how current `0.1.0-beta.0` and `0.2.0-beta.0` consumers should approach the frozen `1.0.0` ArgFit UI contract.

The productive line is not a broader prerelease. It is the first semver-major promise where the public barrels, release gate and documentation posture are explicitly frozen.

## What Stays The Same

- `provideArgfitUi` remains the bootstrap entry point.
- `@argfit-ui/adaptive` remains the preferred application-facing package.
- `@argfit-ui/core` and `@argfit-ui/primitives` remain vendor-agnostic.
- Renderer-specific packages remain public, but they are still secondary to the adaptive path.
- All `@argfit-ui/*` packages must stay on the same exact version.

## What Changes At 1.0

- The public barrels documented in [productive public API](./public-api.md) become the frozen `1.0.0` contract.
- The old `experimental-in-beta` and `experimental-in-beta-plus` posture disappears for the public adaptive surface included in `1.0.0`.
- Productive documentation now includes quickstart, components, API, theming, accessibility, enterprise guidance, migration and release notes.
- The production gate becomes the required posture for release readiness.

## What Does Not Enter 1.0

The productive line does not silently promote backlog names that never reached the public barrels.

Examples that remain outside `1.0.0` include:

- `AfAutoComplete`
- `AfTreeSelect`
- `AfInputMask`
- `AfInputNumber`
- `AfInputOtp`
- `AfFileUpload`
- `AfCalendarScheduler`
- `AfVirtualKanban`

If your app wrapped these planned names locally, replace those wrappers with shipped public surfaces or keep them private until a future documented release includes them.

## Recommended Migration Path

1. Keep existing adaptive imports where possible.
2. Remove assumptions that public adaptive components are still prerelease-only.
3. Re-check app wrappers against the frozen names and semantics in [productive public API](./public-api.md).
4. Re-test accessibility and mobile disclosure behavior for overlays, feedback and dense forms.
5. Re-run the productive gate before accepting the migration.

## Import Example

```ts
import {
  AfDataTable,
  AfDialog,
  AfInlineMessage,
  AfKanban,
  AfMultiSelect,
  AfPageShell,
} from '@argfit-ui/adaptive';
```

There is still no recommended migration path that switches application code wholesale to `@argfit-ui/desktop` or `@argfit-ui/mobile` as the default import surface.

## Behavior Changes To Re-Test

### Overlay Disclosure

- `AfTooltip` still needs a touch-safe disclosure path.
- `AfPopover` stays contextual and should not absorb dialog-level tasks.
- `AfDrawer` and `AfDialog` should preserve the same focus and dismiss expectations your product already relies on.

### Data And Workflow

- `AfDataTable` should keep keyboard row activation and list-first mobile degradation.
- `AfKanban` still needs non-drag movement paths.
- Data-heavy views should move expensive filtering, sorting or aggregation work out of the template layer.

### Feedback

- Persistent validation or recovery steps belong in inline messaging, not only in toasts.
- Severity-driven live-region behavior should stay aligned with the built-in feedback contract.

## Current Publish Reality

The repo-level productive docs and gates now describe the `1.0.0` target, but final package version alignment and publishing remain part of the later release-gate work. Until that flow lands, keep validating the productive posture from this repository and from the current Beta+ tarball channel.