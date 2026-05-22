# Beta+ Known Limitations

ArgFit UI Beta+ targets `0.2.0-beta.0`, but the repository is still moving through the transition from the base beta line.

This document tracks the current limits that consumers and maintainers should treat as real today.

## Distribution Status

- The repository implementation already contains the current Beta+ slices.
- Dedicated Beta+ tarballs are generated under `dist/beta-plus-tarballs/` as `0.2.0-beta.0`.
- The source workspace still stays on the historical `0.1.0-beta.0` baseline so the existing beta regression guard and docs contract remain stable.
- `pnpm beta-plus:consumer-smoke`, `pnpm audit:accessibility:beta-plus`, `pnpm visual:beta-plus` and `pnpm release:beta-plus:check` now validate the Beta+ channel locally.
- The optional Beta+ publish workflow uses the npm `beta` dist-tag.

## Current Showcase Scope

The preserved `alpha` showcase slot is intentionally narrower than the full implemented Beta+ catalog.

Today it focuses on:

- wave 1 overlays, progress and identity
- wave 2 advanced forms and field composition
- wave 5 workflow with `AfKanban`

Wave 3 data components and wave 4 panel/layout components remain implemented in the repository, but they are currently documented rather than kept visible in the streamlined current-state showcase.

## Pending Beta+ Gaps

The following high-value Beta+ surfaces are still pending later slices:

- `AfTreeSelect`
- `AfAutoComplete`
- `AfInputMask`
- additional advanced-form surfaces from the broader Beta+ scope

## Interaction Model Constraints

### AfTooltip

- Mobile must not rely on hover-only behavior.
- The current safe fallback is explicit trigger and focus-driven disclosure.
- Consumers should not place critical information behind hover-only tooltips.

### AfKanban

- Desktop drag and drop is implemented internally with Angular CDK.
- Mobile currently uses explicit move actions instead of touch drag.
- Non-drag movement remains mandatory for keyboard and assistive-technology users.

## Validation Scope Limits

- The current Beta+ visual checks are targeted smoke scenarios, not a full pixel-baseline workflow.
- The product-facing showcase is still intentionally centered on waves 1, 2 and 5.
- Wave 3 data components and wave 4 panel/layout components are covered through the generated Beta+ consumer app rather than being restored into the curated showcase.
- `AfTreeSelect` remains outside the release gate until the component exists in the repository.

## Recommended Consumer Posture

- Prefer `@argfit-ui/adaptive` in application code.
- Keep all `@argfit-ui/*` packages on the same prerelease version.
- Wrap `experimental-in-beta-plus` surfaces when product change control is strict.
- Use the Beta+ docs as the source of truth for implemented scope instead of assuming the current-state showcase is exhaustive.
