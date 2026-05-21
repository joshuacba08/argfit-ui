# Beta+ Public API Inventory

This document classifies the intended public export surface for the `0.2.0-beta.0` target.

It extends the base beta contract documented in `docs/beta/public-api.md`. Anything already classified as stable in beta remains part of the Beta+ baseline unless explicitly deprecated in a later HU.

## Status Labels

| Status | Meaning |
| --- | --- |
| `stable-from-beta` | Already part of the trusted beta baseline and expected to evolve conservatively. |
| `experimental-in-beta-plus` | Included in the Beta+ target, but still expected to evolve during the `0.2.0-beta.x` cycle. |
| `renderer-specific` | Public renderer package API; supported, but not the preferred application-facing path. |
| `out-of-beta-plus` | Explicitly deferred beyond the intended Beta+ target. |

## `@argfit-ui/core`

### Stable Base Carried Forward

The existing beta bootstrap, theme, platform, accessibility-supporting and common display types remain `stable-from-beta`.

That includes the existing contracts for:

- configuration and bootstrap (`provideArgfitUi`, `AfUiConfig`, `AF_UI_CONFIG`)
- theme runtime (`AfThemeService`, shipped themes, token maps and token names)
- platform runtime (`AfPlatformService`, platform preference/types, breakpoints)
- existing stable component type families already used by the base beta catalog

### New Beta+ Type Families

The following new ArgFit-owned type families are approved to enter as `experimental-in-beta-plus` when implemented:

| Type family | Intended exports | Status | Notes |
| --- | --- | --- | --- |
| Overlay types | `AfPopover*`, `AfDrawer*`, `AfTooltip*` | `experimental-in-beta-plus` | Implemented in wave 1. Must describe ArgFit semantics only; no PrimeNG/Ionic event leakage. |
| Status and identity types | `AfProgress*`, `AfAvatar*`, `AfChip*` | `experimental-in-beta-plus` | Implemented in wave 1. Must cover accessible labels, variants and renderer-independent state. |
| Advanced form types | `AfAutoComplete*`, `AfDatePicker*`, `AfInputCount*`, `AfMultiSelect*`, `AfTreeSelect*` and related field/input families | `experimental-in-beta-plus` | High-priority Beta+ form vocabulary. `AfInputCount` and `AfMultiSelect` are now implemented as the first wave 2 opening slices. |
| Data and workflow types | `AfDataView*`, `AfPaginator*`, `AfTree*`, `AfKanban*` and related item/state models | `experimental-in-beta-plus` | Must stay product-semantic rather than mirroring renderer widgets. |
| Layout and panel types | `AfTabs*`, `AfStepper*`, `AfPanel*`, `AfToolbar*`, `AfSplitter*` and related families | `experimental-in-beta-plus` | Must preserve adaptive semantics across renderers. |

## `@argfit-ui/primitives`

Current primitives remain `stable-from-beta`.

Additive primitive growth is approved for Beta+ where it helps power overlays, disclosure, drag/drop or loading semantics without introducing renderer coupling.

## `@argfit-ui/adaptive`

### Stable Base Carried Forward

The current stable adaptive contract remains `stable-from-beta`:

- `AfButton`
- `AfCard`
- `AfInput`
- `AfDialog`
- `AfChart`
- `AfBadge`
- `AfPageShell`
- `AfMetricCard`
- their already documented stable slot directives

### Existing Experimental Beta Surfaces

The current experimental beta surfaces remain public and continue as `experimental-in-beta-plus` until explicitly promoted:

- `AfAnalyticsCard`
- `AfDataTable`
- `AfSelect`
- `AfTextarea`
- `AfToggle`
- `AfCheckbox`
- `AfRadioGroup`
- `AfSegmentedControl`
- `AfPassword`
- `AfToast`
- `AfToastViewport`
- `AfInlineMessage`

### New Beta+ Adaptive Exports

The following exports are in scope for `0.2.0-beta.0` and should enter as `experimental-in-beta-plus` when implemented:

| Public exports | Status | Reason | Change policy |
| --- | --- | --- | --- |
| `AfPopover`, `AfPopoverComponent` | `experimental-in-beta-plus` | Contextual overlay contract with platform-appropriate presentation. | May change during Beta+ with migration notes. |
| `AfDrawer`, `AfDrawerComponent` | `experimental-in-beta-plus` | Side-panel and sheet navigation/content surface. | May change during Beta+ with migration notes. |
| `AfTooltip`, `AfTooltipComponent` | `experimental-in-beta-plus` | Lightweight help/disclosure surface that must work without hover-only assumptions on mobile. | May change during Beta+ with migration notes. |
| `AfProgress`, `AfProgressComponent` | `experimental-in-beta-plus` | Progress, loading and skeleton semantics reusable across the catalog. | May change during Beta+ with migration notes. |
| `AfAvatar`, `AfAvatarComponent` | `experimental-in-beta-plus` | Identity primitive needed by richer workflow and data views. | May change during Beta+ with migration notes. |
| `AfChip`, `AfChipComponent` | `experimental-in-beta-plus` | Compact identity/status/removal primitive reusable across forms and workflow. | May change during Beta+ with migration notes. |
| `AfInputCount`, `AfInputCountComponent` | `experimental-in-beta-plus` | Numeric stepper/count control for dense operational forms and reactive form flows. | May change during Beta+ with migration notes. |
| `AfAutoComplete`, `AfAutoCompleteComponent` | `experimental-in-beta-plus` | High-priority selection/search surface. | May change during Beta+ with migration notes. |
| `AfDatePicker`, `AfDatePickerComponent` | `experimental-in-beta-plus` | High-priority date input surface. | May change during Beta+ with migration notes. |
| `AfMultiSelect`, `AfMultiSelectComponent` | `experimental-in-beta-plus` | High-priority complex selection surface. | May change during Beta+ with migration notes. |
| `AfTreeSelect`, `AfTreeSelectComponent` | `experimental-in-beta-plus` | High-priority hierarchical selection surface. | May change during Beta+ with migration notes. |
| `AfDataView`, `AfDataViewComponent` | `experimental-in-beta-plus` | High-priority list/grid presentation surface. | May change during Beta+ with migration notes. |
| `AfPaginator`, `AfPaginatorComponent` | `experimental-in-beta-plus` | High-priority navigation surface for large data sets. | May change during Beta+ with migration notes. |
| `AfTabs`, `AfTabsComponent` | `experimental-in-beta-plus` | High-priority panel navigation/composition surface. | May change during Beta+ with migration notes. |
| `AfStepper`, `AfStepperComponent` | `experimental-in-beta-plus` | High-priority workflow progression surface. | May change during Beta+ with migration notes. |
| `AfKanban`, `AfKanbanComponent` | `experimental-in-beta-plus` | Workflow-grade composite component and drag/drop proving ground. | May change during Beta+ with migration notes. |

### Implemented Wave 1 Adaptive Helpers

The following additional adaptive exports are already implemented for the current wave 1 overlay contract:

- `AfPopoverTriggerDirective`
- `AfPopoverContentDirective`
- `AF_POPOVER_SLOT_DIRECTIVES`

Current implemented Beta+ adaptive exports in the repository:

- `AfPopover`, `AfPopoverComponent`
- `AfDrawer`, `AfDrawerComponent`
- `AfTooltip`, `AfTooltipComponent`
- `AfProgress`, `AfProgressComponent`
- `AfAvatar`, `AfAvatarComponent`
- `AfChip`, `AfChipComponent`
- `AfInputCount`, `AfInputCountComponent`
- `AfMultiSelect`, `AfMultiSelectComponent`

## `@argfit-ui/desktop`

Desktop renderer exports remain `renderer-specific`.

Beta+ may add renderer-specific implementations for overlay, status/identity, advanced form, data, panel/layout and workflow components, but those should remain secondary to the adaptive contract.

## `@argfit-ui/mobile`

Mobile renderer exports remain `renderer-specific`.

Beta+ mobile renderers must continue to be Ionic-first, touch-first and free of PrimeNG leakage unless a dedicated architecture exception is approved.

## Out Of Beta+

The following surfaces remain `out-of-beta-plus`:

- `AfFileUpload`
- `AfActionSheet`
- `AfCalendarScheduler`
- `AfVirtualKanban`
- `AfTerminal`

## Vendor Leakage Audit

The Beta+ contract must not export:

- PrimeNG components, directives, modules, CSS classes or event types.
- Ionic Angular components, controllers or public event types.
- Angular CDK drag/drop types as part of public component inputs/outputs.
- ECharts option, instance or event types.

Renderer packages may compose those engines internally, but public TypeScript signatures must stay ArgFit-owned.
