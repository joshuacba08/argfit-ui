# Release Notes: 2.1.0

ArgFit UI 2.1 fixes the layout contract of `AfMetricCard` and `AfAnalyticsCard`: the height of a card is decided by the layout that contains it, not by how much text it happens to carry.

## Fixed

- The internal renderer of `AfMetricCard` (`af-metric-card-desktop` / `af-metric-card-mobile`) now fills its host. Previously the adaptive host was a block container, so a grid row stretched the host while the visible surface stayed at its intrinsic height, leaving cards of different heights in the same row.
- `AfAnalyticsCard` carried the same defect: its surface asked for `height: 100%` against a block host with automatic height, and on mobile the surface had no height rule at all.
- `min-height` per `size` and `density` is unchanged and still acts as the floor. A card outside a stretching container keeps measuring its own content.

## Added

- `fill` input on `AfMetricCard` and `AfAnalyticsCard` (adaptive and both renderers). It covers the remaining case, where the host itself receives no height: a flex parent with `align-items` other than `stretch`, or a parent with a fixed height. It emits `data-fill` on the host and on the renderer.
- `FillsContainer` and `FillFixedHeightContainer` stories for `AfMetricCard`.

## Compatibility

This release is additive. No public export, input name or default value was removed or renamed, and consumers that already relied on cards stretching in a grid need no change: they get the corrected height for free.

`fill` and the analytics-card `height` input are different axes and compose: `height` sets the chart content area and remains the floor, while `fill` makes the host claim its container.

## Validation

The release is validated through `pnpm release:production:check`, including unit, Storybook/MCP, consumer, production tarball and bundle-splitting gates.

Verified artifacts are written to `dist/production-tarballs/` and the seven packages publish under the npm `latest` dist-tag.
