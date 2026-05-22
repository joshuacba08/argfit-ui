# Productive Public API Inventory

This document freezes the public API surface for `1.0.0`.

The source of truth is the set of symbols re-exported from these package barrels:

- `projects/argfit-ui-core/src/public-api.ts`
- `projects/argfit-ui-primitives/src/public-api.ts`
- `projects/argfit-ui-adaptive/src/public-api.ts`
- `projects/argfit-ui-desktop/src/public-api.ts`
- `projects/argfit-ui-mobile/src/public-api.ts`

Any export reachable through those barrels inherits the `1.0` category assigned below. There is no public `experimental` category in the `1.0.0` contract.

## 1.0 Categories

| Category | Meaning |
| --- | --- |
| `1.0-foundation` | Stable shared runtime, token, primitive and type contracts. |
| `1.0-adaptive` | Stable semantic Angular component APIs recommended for application code. |
| `1.0-renderer-specific` | Stable renderer APIs supported for intentional desktop/mobile targeting. |

## `@argfit-ui/core`

All exports re-exported from `projects/argfit-ui-core/src/public-api.ts` are category `1.0-foundation`.

### Bootstrap, Runtime And Theme Paths

- `./lib/config/argfit-ui.config`
- `./lib/providers/provide-argfit-ui`
- `./lib/services/platform.service`
- `./lib/services/toast.service`
- `./lib/themes/argfit-dark.theme`
- `./lib/themes/argfit-light.theme`
- `./lib/themes/base-tokens`
- `./lib/themes/theme.service`
- `./lib/themes/theme.types`
- `./lib/tokens/breakpoints`
- `./lib/tokens/theme-token-names`

### Shared Type Family Paths

- `./lib/types/accordion.types`
- `./lib/types/analytics-card.types`
- `./lib/types/avatar.types`
- `./lib/types/badge.types`
- `./lib/types/button.types`
- `./lib/types/card.types`
- `./lib/types/chart.types`
- `./lib/types/chip.types`
- `./lib/types/data-table.types`
- `./lib/types/data-view.types`
- `./lib/types/date-picker.types`
- `./lib/types/dialog.types`
- `./lib/types/drawer.types`
- `./lib/types/feedback.types`
- `./lib/types/form-control.types`
- `./lib/types/form-field.types`
- `./lib/types/icon.types`
- `./lib/types/input-count.types`
- `./lib/types/input.types`
- `./lib/types/kanban.types`
- `./lib/types/metric-card.types`
- `./lib/types/navigation.types`
- `./lib/types/order-list.types`
- `./lib/types/organization-chart.types`
- `./lib/types/page-shell.types`
- `./lib/types/paginator.types`
- `./lib/types/panel.types`
- `./lib/types/pick-list.types`
- `./lib/types/platform.types`
- `./lib/types/popover.types`
- `./lib/types/progress.types`
- `./lib/types/selection.types`
- `./lib/types/stepper.types`
- `./lib/types/tabs.types`
- `./lib/types/timeline.types`
- `./lib/types/tooltip.types`
- `./lib/types/tree-table.types`
- `./lib/types/tree.types`
- `./lib/types/virtual-scroller.types`

## `@argfit-ui/primitives`

All exports re-exported from `projects/argfit-ui-primitives/src/public-api.ts` are category `1.0-foundation`.

- `./lib/a11y/af-visually-hidden.component`
- `./lib/dismiss/af-escape-key.directive`
- `./lib/focus/af-focus-initial.directive`
- `./lib/focus/af-focus-trap.directive`
- `./lib/icon/af-icon.component`

## `@argfit-ui/adaptive`

All exports re-exported from `projects/argfit-ui-adaptive/src/public-api.ts` are category `1.0-adaptive`.

### Foundation And Base Composition

- `AfButton`, `AfButtonComponent`
- `AfCard`, `AfCardComponent`
- `AfCardHeaderDirective`, `AfCardTitleDirective`, `AfCardSubtitleDirective`, `AfCardEyebrowDirective`, `AfCardContentDirective`, `AfCardFooterDirective`, `AF_CARD_SLOT_DIRECTIVES`
- `AfDialog`, `AfDialogComponent`
- `AfDialogHeaderDirective`, `AfDialogTitleDirective`, `AfDialogDescriptionDirective`, `AfDialogContentDirective`, `AfDialogFooterDirective`, `AF_DIALOG_SLOT_DIRECTIVES`
- `AfInput`, `AfInputComponent`
- `AfPageShell`, `AfPageShellComponent`
- `AfPageShellBrandDirective`, `AfPageShellActionsDirective`, `AfPageShellUserDirective`, `AfPageShellFooterDirective`, `AF_PAGE_SHELL_SLOT_DIRECTIVES`

### Analytics, Feedback And Status

- `AfAnalyticsCard`, `AfAnalyticsCardComponent`
- `AfAnalyticsCardActionsDirective`, `AfAnalyticsCardMetricsDirective`, `AfAnalyticsCardLegendDirective`, `AfAnalyticsCardFooterDirective`, `AF_ANALYTICS_CARD_SLOT_DIRECTIVES`
- `AfBadge`, `AfBadgeComponent`
- `AfChip`, `AfChipComponent`
- `AfInlineMessage`, `AfInlineMessageComponent`
- `AfMetricCard`, `AfMetricCardComponent`
- `AfProgress`, `AfProgressComponent`
- `AfToast`, `AfToastComponent`
- `AfToastViewport`, `AfToastViewportComponent`

### Overlay And Identity

- `AfAvatar`, `AfAvatarComponent`
- `AfDrawer`, `AfDrawerComponent`
- `AfPopover`, `AfPopoverComponent`
- `AfPopoverTriggerDirective`, `AfPopoverContentDirective`, `AF_POPOVER_SLOT_DIRECTIVES`
- `AfTooltip`, `AfTooltipComponent`

### Forms And Selection

- `AfCheckbox`, `AfCheckboxComponent`
- `AfDatePicker`, `AfDatePickerComponent`
- `AfField`, `AfFieldComponent`
- `AfFieldset`, `AfFieldsetComponent`
- `AfIconField`, `AfIconFieldComponent`
- `AfIconFieldPrefixDirective`, `AfIconFieldControlDirective`, `AfIconFieldSuffixDirective`, `AF_ICON_FIELD_SLOT_DIRECTIVES`
- `AfInputCount`, `AfInputCountComponent`
- `AfInputGroup`, `AfInputGroupComponent`
- `AfInputGroupPrefixDirective`, `AfInputGroupControlDirective`, `AfInputGroupSuffixDirective`, `AF_INPUT_GROUP_SLOT_DIRECTIVES`
- `AfListbox`, `AfListboxComponent`
- `AfMultiSelect`, `AfMultiSelectComponent`
- `AfPassword`, `AfPasswordComponent`
- `AfRadioGroup`, `AfRadioGroupComponent`
- `AfSegmentedControl`, `AfSegmentedControlComponent`
- `AfSelect`, `AfSelectComponent`
- `AfTextarea`, `AfTextareaComponent`
- `AfToggle`, `AfToggleComponent`

### Data, Hierarchy And Workflow

- `AfChart`, `AfChartComponent`
- `AfDataTable`, `AfDataTableComponent`
- `AfDataTableCellDirective`, `AfDataTableExpandedRowDirective`, `AfDataTableToolbarDirective`, `AfDataTableEmptyDirective`, `AF_DATA_TABLE_SLOT_DIRECTIVES`
- `AfDataView`, `AfDataViewComponent`
- `AfDataViewItemDirective`, `AfDataViewActionsDirective`, `AfDataViewEmptyDirective`, `AfDataViewLoadingDirective`, `AF_DATA_VIEW_SLOT_DIRECTIVES`
- `AfKanban`, `AfKanbanComponent`
- `AfKanbanCardDirective`, `AfKanbanColumnHeaderDirective`, `AfKanbanEmptyDirective`, `AfKanbanCardFooterDirective`, `AF_KANBAN_SLOT_DIRECTIVES`
- `AfOrderList`, `AfOrderListComponent`
- `AfOrderListItemDirective`, `AfOrderListActionsDirective`, `AfOrderListEmptyDirective`, `AfOrderListLoadingDirective`, `AF_ORDER_LIST_SLOT_DIRECTIVES`
- `AfOrganizationChart`, `AfOrganizationChartComponent`
- `AfOrganizationChartNodeDirective`, `AfOrganizationChartActionsDirective`, `AfOrganizationChartEmptyDirective`, `AfOrganizationChartLoadingDirective`, `AF_ORGANIZATION_CHART_SLOT_DIRECTIVES`
- `AfPaginator`, `AfPaginatorComponent`
- `AfPickList`, `AfPickListComponent`
- `AfPickListItemDirective`, `AfPickListActionsDirective`, `AfPickListLoadingDirective`, `AfPickListSourceEmptyDirective`, `AfPickListTargetEmptyDirective`, `AF_PICK_LIST_SLOT_DIRECTIVES`
- `AfTimeline`, `AfTimelineComponent`
- `AfTimelineItemDirective`, `AfTimelineActionsDirective`, `AfTimelineEmptyDirective`, `AfTimelineLoadingDirective`, `AF_TIMELINE_SLOT_DIRECTIVES`
- `AfTree`, `AfTreeComponent`
- `AfTreeNodeDirective`, `AfTreeActionsDirective`, `AfTreeEmptyDirective`, `AfTreeLoadingDirective`, `AF_TREE_SLOT_DIRECTIVES`
- `AfTreeTable`, `AfTreeTableComponent`
- `AfTreeTableCellDirective`, `AfTreeTableActionsDirective`, `AfTreeTableEmptyDirective`, `AfTreeTableLoadingDirective`, `AF_TREE_TABLE_SLOT_DIRECTIVES`
- `AfVirtualScroller`, `AfVirtualScrollerComponent`
- `AfVirtualScrollerItemDirective`, `AfVirtualScrollerActionsDirective`, `AfVirtualScrollerEmptyDirective`, `AfVirtualScrollerLoadingDirective`, `AF_VIRTUAL_SCROLLER_SLOT_DIRECTIVES`

### Layout And Navigation

- `AfAccordion`, `AfAccordionComponent`
- `AfAccordionPanelDirective`
- `AfDivider`, `AfDividerComponent`
- `AfPanel`, `AfPanelComponent`
- `AfScrollPanel`, `AfScrollPanelComponent`
- `AfSplitter`, `AfSplitterComponent`
- `AfSplitterPrimaryDirective`, `AfSplitterSecondaryDirective`, `AF_SPLITTER_SLOT_DIRECTIVES`
- `AfStepper`, `AfStepperComponent`
- `AfStepPanelDirective`
- `AfTabs`, `AfTabsComponent`
- `AfTabPanelDirective`
- `AfToolbar`, `AfToolbarComponent`
- `AfToolbarStartDirective`, `AfToolbarCenterDirective`, `AfToolbarEndDirective`, `AF_TOOLBAR_SLOT_DIRECTIVES`

## `@argfit-ui/desktop`

All exports re-exported from `projects/argfit-ui-desktop/src/public-api.ts` are category `1.0-renderer-specific`.

- `./lib/components/accordion/af-accordion-desktop.component`
- `./lib/components/analytics-card/af-analytics-card-desktop.component`
- `./lib/components/avatar/af-avatar-desktop.component`
- `./lib/components/badge/af-badge-desktop.component`
- `./lib/components/button/af-button-desktop.component`
- `./lib/components/card/af-card-desktop.component`
- `./lib/components/chart/af-chart-desktop.component`
- `./lib/components/checkbox/af-checkbox-desktop.component`
- `./lib/components/chip/af-chip-desktop.component`
- `./lib/components/data-table/af-data-table-desktop.component`
- `./lib/components/data-view/af-data-view-desktop.component`
- `./lib/components/date-picker/af-date-picker-desktop.component`
- `./lib/components/dialog/af-dialog-desktop.component`
- `./lib/components/divider/af-divider-desktop.component`
- `./lib/components/drawer/af-drawer-desktop.component`
- `./lib/components/fieldset/af-fieldset-desktop.component`
- `./lib/components/inline-message/af-inline-message-desktop.component`
- `./lib/components/input-count/af-input-count-desktop.component`
- `./lib/components/input/af-input-desktop.component`
- `./lib/components/kanban/af-kanban-desktop.component`
- `./lib/components/listbox/af-listbox-desktop.component`
- `./lib/components/metric-card/af-metric-card-desktop.component`
- `./lib/components/multi-select/af-multi-select-desktop.component`
- `./lib/components/order-list/af-order-list-desktop.component`
- `./lib/components/organization-chart/af-organization-chart-desktop.component`
- `./lib/components/page-shell/af-page-shell-desktop.component`
- `./lib/components/paginator/af-paginator-desktop.component`
- `./lib/components/panel/af-panel-desktop.component`
- `./lib/components/password/af-password-desktop.component`
- `./lib/components/pick-list/af-pick-list-desktop.component`
- `./lib/components/popover/af-popover-desktop.component`
- `./lib/components/progress/af-progress-desktop.component`
- `./lib/components/radio-group/af-radio-group-desktop.component`
- `./lib/components/scroll-panel/af-scroll-panel-desktop.component`
- `./lib/components/segmented-control/af-segmented-control-desktop.component`
- `./lib/components/select/af-select-desktop.component`
- `./lib/components/sidebar/af-sidebar-desktop.component`
- `./lib/components/splitter/af-splitter-desktop.component`
- `./lib/components/stepper/af-stepper-desktop.component`
- `./lib/components/tabs/af-tabs-desktop.component`
- `./lib/components/textarea/af-textarea-desktop.component`
- `./lib/components/timeline/af-timeline-desktop.component`
- `./lib/components/toast-viewport/af-toast-viewport-desktop.component`
- `./lib/components/toast/af-toast-desktop.component`
- `./lib/components/toggle/af-toggle-desktop.component`
- `./lib/components/toolbar/af-toolbar-desktop.component`
- `./lib/components/tooltip/af-tooltip-desktop.component`
- `./lib/components/topbar/af-topbar-desktop.component`
- `./lib/components/tree-table/af-tree-table-desktop.component`
- `./lib/components/tree/af-tree-desktop.component`
- `./lib/components/virtual-scroller/af-virtual-scroller-desktop.component`

## `@argfit-ui/mobile`

All exports re-exported from `projects/argfit-ui-mobile/src/public-api.ts` are category `1.0-renderer-specific`.

- `./lib/components/accordion/af-accordion-mobile.component`
- `./lib/components/analytics-card/af-analytics-card-mobile.component`
- `./lib/components/avatar/af-avatar-mobile.component`
- `./lib/components/badge/af-badge-mobile.component`
- `./lib/components/bottom-tabs/af-bottom-tabs-mobile.component`
- `./lib/components/button/af-button-mobile.component`
- `./lib/components/card/af-card-mobile.component`
- `./lib/components/chart/af-chart-mobile.component`
- `./lib/components/checkbox/af-checkbox-mobile.component`
- `./lib/components/chip/af-chip-mobile.component`
- `./lib/components/data-table/af-data-table-mobile.component`
- `./lib/components/data-view/af-data-view-mobile.component`
- `./lib/components/date-picker/af-date-picker-mobile.component`
- `./lib/components/dialog/af-dialog-mobile.component`
- `./lib/components/divider/af-divider-mobile.component`
- `./lib/components/drawer/af-drawer-mobile.component`
- `./lib/components/fieldset/af-fieldset-mobile.component`
- `./lib/components/inline-message/af-inline-message-mobile.component`
- `./lib/components/input-count/af-input-count-mobile.component`
- `./lib/components/input/af-input-mobile.component`
- `./lib/components/kanban/af-kanban-mobile.component`
- `./lib/components/listbox/af-listbox-mobile.component`
- `./lib/components/metric-card/af-metric-card-mobile.component`
- `./lib/components/multi-select/af-multi-select-mobile.component`
- `./lib/components/order-list/af-order-list-mobile.component`
- `./lib/components/organization-chart/af-organization-chart-mobile.component`
- `./lib/components/page-shell/af-page-shell-mobile.component`
- `./lib/components/paginator/af-paginator-mobile.component`
- `./lib/components/panel/af-panel-mobile.component`
- `./lib/components/password/af-password-mobile.component`
- `./lib/components/pick-list/af-pick-list-mobile.component`
- `./lib/components/popover/af-popover-mobile.component`
- `./lib/components/progress/af-progress-mobile.component`
- `./lib/components/radio-group/af-radio-group-mobile.component`
- `./lib/components/scroll-panel/af-scroll-panel-mobile.component`
- `./lib/components/segmented-control/af-segmented-control-mobile.component`
- `./lib/components/select/af-select-mobile.component`
- `./lib/components/splitter/af-splitter-mobile.component`
- `./lib/components/stepper/af-stepper-mobile.component`
- `./lib/components/tabs/af-tabs-mobile.component`
- `./lib/components/textarea/af-textarea-mobile.component`
- `./lib/components/timeline/af-timeline-mobile.component`
- `./lib/components/toast-viewport/af-toast-viewport-mobile.component`
- `./lib/components/toast/af-toast-mobile.component`
- `./lib/components/toggle/af-toggle-mobile.component`
- `./lib/components/toolbar/af-toolbar-mobile.component`
- `./lib/components/tooltip/af-tooltip-mobile.component`
- `./lib/components/tree-table/af-tree-table-mobile.component`
- `./lib/components/tree/af-tree-mobile.component`
- `./lib/components/virtual-scroller/af-virtual-scroller-mobile.component`

## Public API Rules

For `1.0.x`:

- new public exports may be added only in a backward-compatible way
- current public exports may not be renamed or removed in `1.x`
- renderer packages remain public but secondary to the adaptive contract
- vendor-specific types remain forbidden in ArgFit-owned public signatures