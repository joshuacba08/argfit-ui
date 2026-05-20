# Release Notes: 0.1.0-alpha.0

Initial ArgFit UI alpha candidate.

## Highlights

- Five publishable packages: `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile` and `@argfit-ui/adaptive`.
- Shared version: `0.1.0-alpha.0`.
- Adaptive Angular component API for desktop/mobile rendering.
- Token-driven dark-first theme runtime.
- Vendor-independent public contracts over PrimeNG, Ionic, ECharts and Lucide internals.
- Public npm alpha distribution with MIT licensing, plus tarball and `npm pack --dry-run` workflow.
- Reproducible alpha release gate through `pnpm release:alpha:check` and CI.

## Stable For Alpha

- `provideArgfitUi`, theme runtime and platform runtime.
- Accessibility primitives and icon primitive.
- `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`, `AfBadge`, `AfPageShell` and `AfMetricCard`.

## Experimental

- `AfAnalyticsCard`.
- `AfDataTable`.
- Form controls: `AfSelect`, `AfTextarea`, `AfToggle`, `AfCheckbox`, `AfRadioGroup`, `AfSegmentedControl` and `AfPassword`.
- Feedback components: `AfToast`, `AfToastViewport` and `AfInlineMessage`.

## Packaging

- Packages are MIT licensed.
- Root workspace remains private.
- `publishConfig.tag` is `alpha`.
- Intended alpha distribution is the public npm registry with the `alpha` dist-tag, or generated tarballs.

## Validation Commands

```bash
pnpm publish:alpha:dry-run
pnpm build:all
ng test showcase --watch=false
pnpm release:alpha:check
```

## Breaking Change Notice

This alpha can break before beta. Consumers should pin exact `0.1.0-alpha.0` package versions when testing.
