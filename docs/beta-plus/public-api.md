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
| Advanced form types | `AfAutoComplete*`, `AfDatePicker*`, `AfInputCount*`, `AfListbox*`, `AfMultiSelect*`, `AfTreeSelect*` and related field/input families | `experimental-in-beta-plus` | High-priority Beta+ form vocabulary. `AfInputCount`, `AfDatePicker`, `AfMultiSelect`, `AfListbox` and the current field/input composition helpers are now implemented as wave 2 slices; `AfTreeSelect` remains pending. |
| Data and workflow types | `AfDataView*`, `AfPaginator*`, `AfOrderList*`, `AfPickList*`, `AfTimeline*`, `AfTree*`, `AfTreeTable*`, `AfVirtualScroller*`, `AfOrganizationChart*`, `AfKanban*` and related item/state models | `experimental-in-beta-plus` | Must stay product-semantic rather than mirroring renderer widgets. `AfDataView`, `AfPaginator`, `AfOrderList`, `AfPickList`, `AfTimeline`, `AfTree`, `AfTreeTable`, `AfVirtualScroller` and `AfOrganizationChart` now have current HU-032 slices; `AfVirtualScroller` currently relies on explicit fixed-height configuration (`itemHeight`, `viewportHeight`) while broader workflow surfaces remain pending. |
| Layout and panel types | `AfAccordion*`, `AfDivider*`, `AfFieldset*`, `AfPanel*`, `AfScrollPanel*`, `AfTabs*`, `AfToolbar*`, `AfStepper*`, `AfSplitter*` and related families | `experimental-in-beta-plus` | Must preserve adaptive semantics across renderers. HU-033 now ships its stable layout surfaces plus the experimental `AfStepper`/`AfSplitter` slice with renderer-neutral contracts and mobile fallback notes. |

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
| `AfField`, `AfFieldComponent` | `experimental-in-beta-plus` | Adaptive field wrapper for labels, helper/error copy and shared form state. | May change during Beta+ with migration notes. |
| `AfIconField`, `AfIconFieldComponent`, `AfIconFieldPrefixDirective`, `AfIconFieldControlDirective`, `AfIconFieldSuffixDirective`, `AF_ICON_FIELD_SLOT_DIRECTIVES` | `experimental-in-beta-plus` | Adaptive field composition helper for prefix/control/suffix layouts without vendor leakage. | May change during Beta+ with migration notes. |
| `AfInputGroup`, `AfInputGroupComponent`, `AfInputGroupPrefixDirective`, `AfInputGroupControlDirective`, `AfInputGroupSuffixDirective`, `AF_INPUT_GROUP_SLOT_DIRECTIVES` | `experimental-in-beta-plus` | Adaptive grouped-field helper for units, inline actions and dense form composition. | May change during Beta+ with migration notes. |
| `AfListbox`, `AfListboxComponent` | `experimental-in-beta-plus` | Inline selection list surface with vendor-independent single and multiple selection behavior. | May change during Beta+ with migration notes. |
| `AfMultiSelect`, `AfMultiSelectComponent` | `experimental-in-beta-plus` | High-priority complex selection surface. | May change during Beta+ with migration notes. |
| `AfTreeSelect`, `AfTreeSelectComponent` | `experimental-in-beta-plus` | High-priority hierarchical selection surface. | May change during Beta+ with migration notes. |
| `AfDataView`, `AfDataViewComponent` | `experimental-in-beta-plus` | High-priority list/grid presentation surface. | May change during Beta+ with migration notes. |
| `AfPaginator`, `AfPaginatorComponent` | `experimental-in-beta-plus` | High-priority navigation surface for large data sets. | May change during Beta+ with migration notes. |
| `AfOrderList`, `AfOrderListComponent` | `experimental-in-beta-plus` | Ordered list surface for explicit reordering workflows with controlled selection. | May change during Beta+ with migration notes. |
| `AfPickList`, `AfPickListComponent` | `experimental-in-beta-plus` | Dual-list assignment surface for source/target transfer flows. | May change during Beta+ with migration notes. |
| `AfTimeline`, `AfTimelineComponent` | `experimental-in-beta-plus` | Ordered event and process history surface with slot-based customization. | May change during Beta+ with migration notes. |
| `AfTree`, `AfTreeComponent` | `experimental-in-beta-plus` | Hierarchical navigation and selection surface with controlled expansion state. | May change during Beta+ with migration notes. |
| `AfTreeTable`, `AfTreeTableComponent` | `experimental-in-beta-plus` | Hierarchical tabular surface with controlled expansion, selection and cell templating. | May change during Beta+ with migration notes. |
| `AfVirtualScroller`, `AfVirtualScrollerComponent` | `experimental-in-beta-plus` | High-volume list surface with explicit fixed-height virtualization and range reporting. | May change during Beta+ with migration notes. |
| `AfOrganizationChart`, `AfOrganizationChartComponent` | `experimental-in-beta-plus` | Hierarchical ownership surface with controlled expansion, selection and projected node templating. | May change during Beta+ with migration notes. |
| `AfAccordion`, `AfAccordionComponent` | `experimental-in-beta-plus` | Collapsible section surface with controlled expansion, single/multiple modes and projected panel content. | May change during Beta+ with migration notes. |
| `AfDivider`, `AfDividerComponent` | `experimental-in-beta-plus` | Tokenized separator surface for dense layouts and semantic grouping. | May change during Beta+ with migration notes. |
| `AfFieldset`, `AfFieldsetComponent` | `experimental-in-beta-plus` | Semantic grouping surface for field-heavy flows without nested cards. | May change during Beta+ with migration notes. |
| `AfPanel`, `AfPanelComponent` | `experimental-in-beta-plus` | Section container with heading semantics and renderer-neutral presentation. | May change during Beta+ with migration notes. |
| `AfScrollPanel`, `AfScrollPanelComponent` | `experimental-in-beta-plus` | Overflow container that preserves keyboard focus and touch scroll behavior. | May change during Beta+ with migration notes. |
| `AfTabs`, `AfTabsComponent` | `experimental-in-beta-plus` | High-priority panel navigation/composition surface. | May change during Beta+ with migration notes. |
| `AfToolbar`, `AfToolbarComponent` | `experimental-in-beta-plus` | Three-slot adaptive action lane for dense operational layouts. | May change during Beta+ with migration notes. |
| `AfStepper`, `AfStepperComponent` | `experimental-in-beta-plus` | High-priority workflow progression surface. | May change during Beta+ with migration notes. |
| `AfSplitter`, `AfSplitterComponent` | `experimental-in-beta-plus` | Desktop-first resizable master-detail surface with mobile stacked fallback. | May change during Beta+ with migration notes. |
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
- `AfDatePicker`, `AfDatePickerComponent`
- `AfField`, `AfFieldComponent`
- `AfIconField`, `AfIconFieldComponent`
- `AfIconFieldPrefixDirective`, `AfIconFieldControlDirective`, `AfIconFieldSuffixDirective`, `AF_ICON_FIELD_SLOT_DIRECTIVES`
- `AfInputGroup`, `AfInputGroupComponent`
- `AfInputGroupPrefixDirective`, `AfInputGroupControlDirective`, `AfInputGroupSuffixDirective`, `AF_INPUT_GROUP_SLOT_DIRECTIVES`
- `AfListbox`, `AfListboxComponent`
- `AfMultiSelect`, `AfMultiSelectComponent`
- `AfDataView`, `AfDataViewComponent`
- `AfDataViewItemDirective`
- `AfDataViewActionsDirective`, `AfDataViewEmptyDirective`, `AfDataViewLoadingDirective`, `AF_DATA_VIEW_SLOT_DIRECTIVES`
- `AfPaginator`, `AfPaginatorComponent`
- `AfOrderList`, `AfOrderListComponent`
- `AfOrderListItemDirective`
- `AfOrderListActionsDirective`, `AfOrderListEmptyDirective`, `AfOrderListLoadingDirective`, `AF_ORDER_LIST_SLOT_DIRECTIVES`
- `AfPickList`, `AfPickListComponent`
- `AfPickListItemDirective`
- `AfPickListActionsDirective`, `AfPickListSourceEmptyDirective`, `AfPickListTargetEmptyDirective`, `AfPickListLoadingDirective`, `AF_PICK_LIST_SLOT_DIRECTIVES`
- `AfTimeline`, `AfTimelineComponent`
- `AfTimelineItemDirective`
- `AfTimelineActionsDirective`, `AfTimelineEmptyDirective`, `AfTimelineLoadingDirective`, `AF_TIMELINE_SLOT_DIRECTIVES`
- `AfTree`, `AfTreeComponent`
- `AfTreeNodeDirective`
- `AfTreeActionsDirective`, `AfTreeEmptyDirective`, `AfTreeLoadingDirective`, `AF_TREE_SLOT_DIRECTIVES`
- `AfTreeTable`, `AfTreeTableComponent`
- `AfTreeTableCellDirective`
- `AfTreeTableActionsDirective`, `AfTreeTableEmptyDirective`, `AfTreeTableLoadingDirective`, `AF_TREE_TABLE_SLOT_DIRECTIVES`
- `AfVirtualScroller`, `AfVirtualScrollerComponent`
- `AfVirtualScrollerItemDirective`
- `AfVirtualScrollerActionsDirective`, `AfVirtualScrollerEmptyDirective`, `AfVirtualScrollerLoadingDirective`, `AF_VIRTUAL_SCROLLER_SLOT_DIRECTIVES`
- `AfOrganizationChart`, `AfOrganizationChartComponent`
- `AfOrganizationChartNodeDirective`
- `AfOrganizationChartActionsDirective`, `AfOrganizationChartEmptyDirective`, `AfOrganizationChartLoadingDirective`, `AF_ORGANIZATION_CHART_SLOT_DIRECTIVES`
- `AfAccordion`, `AfAccordionComponent`
- `AfAccordionPanelDirective`
- `AfDivider`, `AfDividerComponent`
- `AfFieldset`, `AfFieldsetComponent`
- `AfPanel`, `AfPanelComponent`
- `AfScrollPanel`, `AfScrollPanelComponent`
- `AfTabs`, `AfTabsComponent`
- `AfTabPanelDirective`
- `AfToolbar`, `AfToolbarComponent`
- `AfToolbarStartDirective`, `AfToolbarCenterDirective`, `AfToolbarEndDirective`, `AF_TOOLBAR_SLOT_DIRECTIVES`
- `AfStepper`, `AfStepperComponent`
- `AfStepPanelDirective`
- `AfSplitter`, `AfSplitterComponent`
- `AfSplitterPrimaryDirective`, `AfSplitterSecondaryDirective`, `AF_SPLITTER_SLOT_DIRECTIVES`
- `AfKanban`, `AfKanbanComponent`
- `AfKanbanCardDirective`
- `AfKanbanColumnHeaderDirective`, `AfKanbanEmptyDirective`, `AfKanbanCardFooterDirective`, `AF_KANBAN_SLOT_DIRECTIVES`

`AfKanban` now ships as the HU-034 workflow slice with an ArgFit-owned controlled API, projected card/header/empty/footer slots, desktop CDK drag/drop and a touch-first mobile fallback based on explicit move actions.

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
