# Changelog

All notable changes to ArgFit UI are documented here.

## 1.2.0

Additive minor release. Closes nine of the ten remaining `GAP-UI-nnn` findings from building
ArgFit Football: four new components and five extensions. Nothing was renamed or removed, so
upgrading from `1.1.0` costs nothing.

### Added

- `AfSlider` (`GAP-UI-006`) across core, desktop, mobile and adaptive. Native range input,
  `min`/`max`/`step`, labelled `marks`, `ControlValueAccessor`, and a thumb that stays above
  the 44 px touch target on mobile at every size.
- `AfFileUpload` (`GAP-UI-005`). `accept`, `multiple`, `maxSizeBytes`, `maxFiles`,
  application-reported `progress`, desktop drag-and-drop over a real `<input type="file">`.
  Constraints are announced before choosing and rejected files are returned with a reason.
- `AfEmptyState` (`GAP-UI-008`) with `tone` (`empty`, `filtered`, `error`, `permission`) and
  required-by-contract `actions`.
- `AfSkeleton` (`GAP-UI-014`) with `shape` (`text`, `rect`, `circle`), `lines`, and a pulse
  that stops under `prefers-reduced-motion`.
- Core helpers: `afClampToStep`, `afFormatFileSize`, `afMatchesAccept`, `afSplitPlacement`,
  `isAfDateValue`, `isAfDateRange`, plus `AfDateRange` and the type modules for the new
  components.

### Changed

- `AfChart` accepts `scatter` and `bubble` (`GAP-UI-009`); bubble radius scales by square
  root so areas compare correctly.
- `AfChart` gains `dataTable` (`GAP-UI-010`), publishing the series as an accessible table
  beside the canvas.
- `AfSelect` and `AfListbox` gain `searchable`, `searchPlaceholder` and `searchEmptyText`
  (`GAP-UI-004`). On mobile the searchable select swaps to a trigger plus a sheet, because
  Ionic cannot filter inside `ion-select`.
- `AfPopoverPlacement` gains `-start` and `-end` variants for all four sides (`GAP-UI-012`).
- `AfNavigationItem` gains `disabledReason` (`GAP-UI-013`), surfaced as a tooltip and through
  `aria-describedby`.
- All publishable packages move to `1.2.0` with internal peers realigned.

### Notes

- `GAP-UI-003` (range selection in `AfDatePicker`) is **not** in this release. Ionic has no
  range-capable datetime, and a control that behaves differently per platform defeats the
  adaptive layer. The period types ship so applications composing two pickers share one
  validated contract.
- Release notes: `docs/productive/release-notes-1.2.0.md`.

## 1.1.0

Additive minor release. Closes the four blocking gaps found while building ArgFit Football on
`1.0.0` (`GAP-UI-001`, `GAP-UI-002`, `GAP-UI-007`, `GAP-UI-011`). No existing input, output,
selector or type was renamed or removed, so upgrading from `1.0.0` costs nothing.

Published to the npm `latest` dist-tag through `pnpm release:production:check`.

### Added

- `AfTimePicker` across core, desktop, mobile and adaptive (`GAP-UI-002`). Civil `HH:mm`
  value on a 24-hour clock, `min`/`max` bounds, `minuteStep` granularity and
  `ControlValueAccessor` support. Desktop renders PrimeNG in `timeOnly` mode; mobile opens
  an Ionic wheel inside a sheet.
- Civil-time helpers in core: `isAfTimeValue`, `afTimeToMinutes`, `afMinutesToTime`, plus
  `AfTimePickerSize`, `AfTimePickerDensity`, `AfTimePickerValue` and `AfTimePickerMinuteStep`.
- 19 icons in `AfIconName` (`GAP-UI-001`): `arrow-left`, `arrow-right`, `copy`,
  `external-link`, `image`, `log-out`, `map-pin`, `more-horizontal`, `more-vertical`,
  `pause`, `refresh-cw`, `save`, `share-2`, `target`, `undo-2`, `user`, `video`, `wifi`
  and `wifi-off`. The set now covers 63 names.
- `AF_ICON_NAMES` runtime array so the icon registry can be verified in tests; the
  primitive's spec now renders every declared name and fails if one does not resolve.
- `state`, `emptyText`, `emptyDescription`, `errorText`, `sample`, `period`, `provenance`
  and `provenanceLabel` on `AfMetricCard` (`GAP-UI-007`), plus `AfMetricCardState`,
  `AfMetricSample`, `AfMetricProvenance` and `AF_METRIC_PROVENANCE_LABEL` in core. A metric
  without a sample now renders its empty text instead of a misleading `0`.
- `action` on `AfToastOptions` and `AfToast`, with an `actionInvoked` output on
  `AfToastViewport` (`GAP-UI-011`). Activating the action also dismisses the toast.

### Changed

- All publishable packages move to `1.1.0`, with internal `@argfit-ui/*` peer dependencies
  realigned to the exact `1.1.0` version.
- `AfMetricCard` gained a separate `errorDescription` so the error state no longer borrows the
  empty state's copy.

### Notes

- `AfMetricCard.loading` still takes precedence over `state`, so existing consumers passing
  only the boolean keep their current behaviour.
- The toast service intentionally stores no handlers: the viewport is a single root-level
  element, so applications dispatch on `event.action.id`.
- Release notes: `docs/productive/release-notes-1.1.0.md`.

## 1.0.0

First production release of ArgFit UI.

### Added

- Stable `1.0.0` package metadata across `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile` and `@argfit-ui/adaptive`.
- Exact internal `@argfit-ui/*` peer dependency alignment on `1.0.0` for the production package set.
- npm latest dist-tag metadata and production publish validation through `publish-production.yml`.
- Production tarball flow under `dist/production-tarballs/` through `pnpm pack:production:dist`.
- Production release checklist and canonical `1.0.0` release notes under `docs/productive/`.

### Notes

- `pnpm release:production:check` is the required gate before tagging or publishing production releases.
- Production packages must publish with the `latest` dist-tag and public npm access.
- Prerelease alpha, beta and Beta+ docs remain available as historical upgrade context.

## 0.2.0-beta.0

First dedicated Beta+ delivery channel for ArgFit UI.

### Added

- Parallel Beta+ tarball flow under `dist/beta-plus-tarballs/` stamped to `0.2.0-beta.0` without disturbing the historical `0.1.0-beta.0` source baseline.
- Dedicated Beta+ consumer smoke, visual smoke, accessibility audit and public API guard through `pnpm beta-plus:consumer-smoke`, `pnpm visual:beta-plus`, `pnpm audit:accessibility:beta-plus` and `pnpm guard:beta-plus:api`.
- Dedicated Beta+ release gate through `pnpm release:beta-plus:check` and the optional `publish-beta-plus.yml` workflow.
- Beta+ release and validation docs through `docs/beta-plus/visual-qa.md`, `docs/beta-plus/release-checklist.md` and `docs/beta-plus/release-notes-beta-plus.md`.

### Notes

- The source workspace remains on the historical `0.1.0-beta.0` baseline so existing beta regression guards keep working.
- Published Beta+ tarballs are generated as `0.2.0-beta.0` during packaging.
- `AfTreeSelect` remains outside this release and the current selection validation uses `AfListbox` as the implemented hierarchical-selection fallback.

## 0.1.0-beta.0

First dedicated beta channel for ArgFit UI.

### Added

- Beta package metadata aligned on `0.1.0-beta.0` across `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile` and `@argfit-ui/adaptive`.
- Dedicated beta tarball flow under `dist/beta-tarballs/`.
- Beta release gate through `pnpm release:beta:check`.
- Dedicated beta smoke, publish workflow and release docs through `tools/beta-smoke.mjs`, `publish-beta.yml`, `docs/beta/release-notes-beta.md` and `docs/beta/release-checklist.md`.

### Notes

- Packages are MIT licensed.
- Beta publish uses the beta dist-tag and `publish-beta.yml`.
- Consumers should pin exact `0.1.0-beta.0` versions during prerelease evaluation.

## 0.1.0-alpha.0

Initial alpha candidate for ArgFit UI.

### Added

- Publishable packages for `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile` and `@argfit-ui/adaptive`.
- Token-driven theme runtime with dark and light themes.
- Adaptive component API over desktop PrimeNG and mobile Ionic renderers.
- Stable-for-alpha components: `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`, `AfBadge`, `AfPageShell` and `AfMetricCard`.
- Experimental alpha APIs for analytics, data table, form controls, password and feedback components.
- Alpha package metadata, local tarball generation, pack dry-run validation and release gate CI.

### Notes

- Packages are MIT licensed.
- Intended alpha distribution is the public npm registry with the `alpha` dist-tag, with tarballs still available for manual verification.
- Breaking changes can occur before beta; consumers should pin exact `0.1.0-alpha.0` versions.
