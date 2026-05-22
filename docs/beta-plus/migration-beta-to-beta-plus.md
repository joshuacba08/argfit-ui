# Migration Beta To Beta+

This guide explains how a current `0.1.0-beta.0` consumer should approach the Beta+ track targeting `0.2.0-beta.0`.

Beta+ is additive. It expands the catalog, but it does not replace the base beta philosophy: semantic ArgFit APIs, adaptive-first imports, and no vendor leakage in public contracts.

## What Stays The Same

- `provideArgfitUi` remains the bootstrap entry point.
- `@argfit-ui/adaptive` remains the preferred application-facing package.
- Stable beta components such as `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`, `AfBadge`, `AfPageShell` and `AfMetricCard` carry forward unchanged in intent.
- Consumers should still keep every `@argfit-ui/*` package on the exact same prerelease version.

## What Beta+ Adds

The first current Beta+ families already implemented in the repository are:

- overlays: `AfPopover`, `AfDrawer`, `AfTooltip`
- status and identity: `AfProgress`, `AfAvatar`, `AfChip`
- advanced forms: `AfInputCount`, `AfMultiSelect`, `AfDatePicker`, `AfListbox`, `AfField`, `AfIconField`, `AfInputGroup`
- workflow: `AfKanban`

Wave 3 data surfaces and wave 4 panel/layout surfaces are also implemented in the repository, but the current-state showcase is intentionally curated around waves 1, 2 and 5.

## Recommended Migration Path

1. Keep the existing base beta imports untouched.
2. Add Beta+ components incrementally from `@argfit-ui/adaptive`.
3. Wrap `experimental-in-beta-plus` surfaces at the app level if your product needs stricter change control.
4. Re-test both desktop and mobile behavior for any newly adopted adaptive component.

## Import Example

```ts
import {
  AfAvatar,
  AfButton,
  AfDatePicker,
  AfInputCount,
  AfKanban,
  AfPopover,
} from '@argfit-ui/adaptive';
```

There is no recommended migration path that switches application code to `@argfit-ui/desktop` or `@argfit-ui/mobile` as the default import surface.

## Behavior Changes To Re-Test

### Tooltip Disclosure

- Desktop can still expose contextual help with hover.
- Mobile must keep a touch-safe fallback based on explicit trigger and focus semantics.
- Do not hide critical product meaning behind hover-only affordances.

### Kanban Movement

- Desktop supports drag and drop through an internal CDK implementation.
- Mobile currently uses explicit move actions and announcements instead of drag.
- Keyboard movement and fallback actions are part of the contract and must be preserved in app-level testing.

## Showcase Expectation Change

The current repository showcase is no longer a full catalog wall for Beta+.

It now acts as a current-state consumer reference focused on:

- wave 1 overlays and identity
- wave 2 advanced forms and field composition
- wave 5 workflow with `AfKanban`

If you need the broader implemented Beta+ inventory, use [Beta+ components](./components.md), [Beta+ public API](./public-api.md) and [Beta+ readiness](./readiness.md) instead of assuming every implemented family is still rendered in the current-state showcase.

## Migration Checklist

- Keep all `@argfit-ui/*` versions aligned.
- Continue to prefer `@argfit-ui/adaptive`.
- Treat newly adopted Beta+ surfaces as experimental until they are explicitly promoted.
- Re-test mobile disclosure for `AfTooltip`.
- Re-test desktop and mobile movement flows for `AfKanban`.
- Re-check the Beta+ docs when upgrading between `0.2.0-beta.x` prereleases.
