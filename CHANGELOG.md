# Changelog

All notable changes to ArgFit UI are documented here.

## 2.0.0

Major release that moves the advanced chart engine out of initial application assets.

### Added

- `@argfit-ui/adaptive/chart` as the supported application entry point for `AfChart` and `AfChartComponent`.
- `@argfit-ui/chart-runtime` as a technical, lazy-loaded package shared by both renderers.
- Accessible runtime error/retry UI and bundle guards built from production tarballs.

### Changed

- ECharts and ZRender load only when a browser chart is first rendered; `echarts-gl` remains a second lazy level for 3D charts.
- Storybook and MCP snippets understand component-specific entry points.
- Production publishing uses stable `v2.*.*` tags and the `latest` dist-tag.

### Removed

- `AfChart` and `AfChartComponent` from the root `@argfit-ui/adaptive` barrel. Consumers must import them from `@argfit-ui/adaptive/chart`.

### Release

- All seven publishable packages move to `2.0.0`, with internal peer versions aligned exactly.
- Validated through `pnpm release:production:check`.

## 1.7.0

Minor release focused on making multidimensional chart data easier to inspect
and frequent chart actions easier to reach.

### Added

- Public `AfChartTableLayout` and `AfChartTableHeaders` contracts, exposed
  through `AfChart` as `dataTableLayout` and `dataTableHeaders`.
- Point-oriented accessible chart tables with one row per observation and
  explicit label, X, Y and Z dimension headers.
- `inlineActions` on `AfChartCard` for promoting frequent actions into the
  header on both desktop and mobile renderers.
- A canonical Storybook example for a bubble chart with a visible
  observation table and inline data/image controls.

### Changed

- Accessible chart tables now select their layout automatically from the
  shape of the data while retaining the existing series-oriented layout for
  categorical and temporal charts.
- Actions promoted to the `AfChartCard` header are removed from the overflow
  menu to avoid duplicate controls.
- The generated MCP catalog includes the new chart and chart-card inputs.

### Release

- All six publishable packages move to `1.7.0`, with internal peer versions
  aligned exactly.
- Validated through `pnpm release:production:check` and published with the
  `latest` dist-tag.

## 1.6.0

Minor release focused on adaptive data exploration, command discovery and a
substantially broader chart contract.

### Added

- Public `AfChartCard` family across adaptive, desktop and mobile packages,
  including actions, loading/empty/error states and responsive composition.
- Public `AfCommandPalette` family with grouped commands, keyboard navigation,
  filtering, accessible focus management and mobile fullscreen behavior.
- New vendor-neutral chart contracts and ECharts renderers for advanced 2D,
  statistical, relationship, geographic and optional WebGL-backed 3D views.
- Storybook pattern stories for analytics panels and chart windows, plus
  canonical MDX documentation for the two new component families.

### Changed

- The generated MCP catalog now exposes 70 documented adaptive components and
  validates consumer snippets for the new command palette API.
- `echarts-gl` loads lazily from its browser-ready distribution only when a 3D
  chart requires it, keeping the WebGL payload out of the initial bundle.
- Production size budgets were remeasured and retained as ratcheted ceilings
  roughly 5% above the new artifacts.

### Release

- All six publishable packages move to `1.6.0`, with internal peer versions
  aligned exactly.
- Validated through `pnpm release:production:check` and published with the
  `latest` dist-tag.

## 1.5.0

Minor release focused on an extensible icon catalog and the P0 interaction
contract of `AfCalendar`.

### Added

- Explicit, tree-shakeable registration of additional Lucide icons and any
  `@ng-icons/*` pack through the stable `AfIcon` surface.
- Pointer-based Calendar drag, cross-day movement, start/end resize, all-day
  and timed conversion, auto-scroll and controlled optimistic resolution.
- Synchronous product validation with `allowMutation`, explicit
  `resolveMutation`, undo-token requests and an accessible F2 dialog path.
- Secondary Calendar entry point at `@argfit-ui/adaptive/calendar`.

### Changed

- Calendar Storybook documentation now contains the P0 traceability matrix,
  editable controlled example and keyboard/touch guidance.
- Primary buttons consistently use black foreground and secondary buttons use
  white foreground for both labels and icons.
- Storybook no longer depends on remote font downloads, making smoke, visual
  and accessibility gates deterministic offline.
- The generated MCP catalog includes the new public Calendar and icon APIs.

### Release

- All six publishable packages move to `1.5.0`, with internal peer versions
  aligned exactly.
- Validated through `pnpm release:production:check` and published with the
  `latest` dist-tag.

## 1.4.0

Minor release that makes Storybook the canonical development surface and adds
an official MCP server for AI-assisted consumption of ArgFit UI.

### Added

- `AfAuthShell` across desktop, mobile and adaptive packages, with split and
  centered layouts plus vendor-neutral projection slots.
- `@argfit-ui/mcp`, a public read-only MCP server with STDIO and Streamable HTTP
  transports, component search, recommendations, usage generation, validation
  and design-token discovery.
- Canonical Storybook stories for all 59 adaptive components, including typed
  controls, relevant states and metadata shared with the generated MCP catalog.
- Infinite-scroll loading for searchable `AfSelect` instances.

### Changed

- Storybook is now the single source of truth for public component behavior,
  examples and component-development guidance.
- DatePicker layouts, component documentation pages, ImageCropper controls and
  several shared surfaces were refined for a more compact, consistent UI.
- The MCP catalog now indexes 57 documented and 2 experimental components with
  no historical undocumented exceptions.

### Release

- All six publishable packages move to `1.4.0`, with internal peer versions
  aligned exactly.
- Validated through `pnpm release:production:check` and published with the
  `latest` dist-tag.

## 1.3.4

Patch release focused on searchable, paginated selects and calendar correctness.

### Fixed

- Searchable selects keep their filter visible while scrolling and expose a
  clearer, themed scrollbar for API-backed infinite loading.
- Infinite-scroll listeners bind to the select panel that owns the trigger,
  avoiding cross-talk when a page contains multiple openable selects.
- Date pickers allow selecting the visible days that belong to the previous or
  next month.

### Developer experience

- Storybook now boots with the ArgFit UI theme and global styles.
- Select stories cover search, long result sets and loading-more states.

### Release

- All five publishable packages move to `1.3.4`, with internal peer versions
  aligned exactly.
- Validated through the production release gate and published with the `latest`
  dist-tag.

## 1.3.3

Patch release driven by the compact collection navigation used in ArgFit
Football.

### Added

- `AfTabs.variant="line"` for compact horizontal tab bars on desktop and mobile.
- `AfTabs.renderPanel` for tabs that control application-owned content instead
  of an ArgFit UI projected panel.
- Productive guidance for line tabs and their accessibility ownership.

### Fixed

- Line tabs no longer inherit the minimum card width that caused short labels to
  wrap into a vertical stack.
- Tabs without a rendered panel omit dangling `aria-controls` references.
- Automatic renderer selection now uses available width only. Touch tablets at
  768 px or wider keep the tablet/desktop renderer instead of collapsing to the
  mobile shell because of a coarse pointer.

### Release

- All five publishable packages move to `1.3.3`, with internal peer versions
  aligned exactly.
- Validated through the production release gate and published with the `latest`
  dist-tag.

## 1.3.1

Patch release driven by the responsive ArgFit Football shell and exercise
library implementation.

### Added

- `AfChip.interactive`, `AfChip.selected` and the `pressed` event for compact,
  keyboard-operable filter chips with an explicit `aria-pressed` state.
- Productive examples for interactive filters and the four `AfPageShell` slot
  regions.

### Fixed

- `AfPageShell` now preserves brand, action, user and footer projection while
  switching between its desktop and mobile renderers. Previously those nodes
  could fall through into the main content region.
- Desktop page-shell templates now cross the sidebar and topbar composition
  boundary without losing their semantic destination.

### Release

- All five publishable packages move to `1.3.1`, with internal peer versions
  aligned exactly.
- Validated through the production release gate and published with the `latest`
  dist-tag.

## 1.3.0

Minor release driven by the first production integration in ArgFit Football. It
promotes icon-bearing, full-width actions into the shared adaptive contract so
applications do not need renderer-specific CSS or hand-authored SVG markup.

### Added

- `AfButton.icon`, typed as `AfIconName`, across adaptive, desktop and mobile.
- `AfButton.iconPosition` with `start` and `end` placement.
- `AfButtonIconPosition` as a public core type.
- `log-in` in the curated `AfIconName` registry for identity-provider actions.
- Productive documentation and showcase examples for icon buttons, trailing
  actions and the full-width Hub Identity login pattern.

### Fixed

- Mobile `AfButton.fullWidth` now stretches both the Angular host and the inner
  Ionic button to the full available width.
- Button icons are decorative when visible text supplies the accessible name;
  icon-only actions remain supported through `ariaLabel`.

### Release

- All five publishable packages move to `1.3.0`, with internal peer versions
  aligned exactly.
- Validated with `pnpm release:production:check` before tagging.
- Published through the `latest` dist-tag.

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
