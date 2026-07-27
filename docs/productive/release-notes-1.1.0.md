# Release Notes: 1.1.0

ArgFit UI `1.1.0` is an additive minor release. It closes the four blocking gaps found while
building ArgFit Football on `1.0.0`, where the library forced the product to hand-roll UI that
belongs in the design system.

## Summary

- Stable version: `1.1.0`
- npm dist-tag: `latest`
- Primary application path: `@argfit-ui/adaptive`
- Runtime bootstrap: `provideArgfitUi` from `@argfit-ui/core`
- Production validation: `pnpm release:production:check`
- Upgrade cost from `1.0.0`: none. No public input, output, selector or type was renamed or removed.

## Added

### `AfTimePicker`

A civil time control, complementing `AfDatePicker`. Together they express "the session starts on
27 July at 17:30 in the venue's timezone" without either control pretending to be an instant.

- Value is a `HH:mm` string on a 24-hour clock — not a `Date`, and with no offset. A schedule that
  shifts when read from another timezone is a bug, not a feature.
- `min` / `max` bounds, `minuteStep` granularity and full `ControlValueAccessor` support.
- Desktop renders PrimeNG in `timeOnly` mode; mobile opens an Ionic wheel inside a sheet so the
  surrounding form stays on screen.
- Core also exports `isAfTimeValue`, `afTimeToMinutes` and `afMinutesToTime` for the value contract.

### Value lifecycle on `AfMetricCard`

`AfMetricCard` could not say "there is no data". Its `value` was `string | number`, so the only way
to express an empty metric was to pass the literal `0` — which misreports the measurement, because
a zero is itself a valid reading.

- New `state`: `'ready' | 'loading' | 'empty' | 'error'`, matching `AfAnalyticsCard`. The asymmetry
  between the two cards was an oversight, not a decision.
- New `emptyText`, `emptyDescription`, `errorText` and `errorDescription`.
- New `sample`, `period`, `provenance` and `provenanceLabel`, so a card can publish the numerator and
  denominator behind an aggregate and where the number came from. `1 / 1` and `240 / 240` both render
  as 100 %, and they do not mean the same thing.
- `loading` still takes precedence over `state`, so consumers passing only the boolean are unaffected.

### Toast actions

`AfToastOptions` had no way to offer an action, so a confirmation could not carry "Deshacer",
"Abrir" or "Ver detalles" and the user had to go hunting for whatever just happened.

- New `action` on `AfToastOptions` and `AfToast`.
- New `actionInvoked` output on `AfToastViewport`, emitting `{ toastId, action }`.
- Activating the action also dismisses the toast.
- The toast service stores no handlers on purpose: keeping component closures inside a core singleton
  would leak UI state into the data layer. The viewport is a single root-level element, so
  applications dispatch on `event.action.id`.

### Icon set: 44 to 63 names

The curated set was too small to build an operational application with, so products fell back to
hand-rolled SVG — precisely what the primitive exists to prevent.

Added: `arrow-left`, `arrow-right`, `copy`, `external-link`, `image`, `log-out`, `map-pin`,
`more-horizontal`, `more-vertical`, `pause`, `refresh-cw`, `save`, `share-2`, `target`, `undo-2`,
`user`, `video`, `wifi`, `wifi-off`.

`AF_ICON_NAMES` is now exported as a runtime array so the registry is self-verifying: the primitive's
spec renders every declared name and fails if one does not resolve. A type union cannot catch a
kebab-case typo, and Lucide does not throw on an unknown name — it renders an empty `<svg>`.

## Stable Contract

Unchanged from `1.0.0`. The recommended application-facing API is the adaptive package; consumers
should install all ArgFit packages at the same exact version and prefer semantic adaptive imports
over renderer-specific ones. PrimeNG and Ionic remain implementation details behind ArgFit-owned
contracts, verified by the public API guard.

## Fixed

- `tools/pack-production.mjs` now removes tarballs from earlier versions before packing, and
  `tools/production-performance.mjs` requires the tarball of the version being released instead of
  resolving it by name prefix. Previously a stale `.tgz` left in `dist/production-tarballs/` could be
  the one measured, so the size budgets could report green without ever inspecting the current build.

## Validation

The production gate must pass before tagging or publishing:

```bash
pnpm release:production:check
```

It builds every package, runs the full test suite and the accessibility audit, verifies that no
PrimeNG or Ionic type leaks through the public declarations, then writes the signed package set to
`dist/production-tarballs/` and smoke-tests the result.

Tag as `v1.1.0` and publish to the `latest` dist-tag with public access.
