# Productive API Reference

This page summarizes the public `1.0.0` API contract at a package and composition level.

The canonical export inventory remains [productive public API](./public-api.md). Use this page when you need the practical import path, the intended responsibility of a package, or the slot directive family that accompanies a component.

## Package Entry Points

| Package | Use it for | Notes |
| --- | --- | --- |
| `@argfit-ui/core` | Bootstrap, themes, platform runtime, toast service and shared types | Remains vendor-agnostic. |
| `@argfit-ui/primitives` | Focus management, escape handling, visually hidden content and shared icon primitive | Remains vendor-agnostic. |
| `@argfit-ui/adaptive` | Recommended application-facing semantic components | Primary path for product code. |
| `@argfit-ui/desktop` | Renderer-specific desktop components | Public, but secondary to adaptive imports. |
| `@argfit-ui/mobile` | Renderer-specific mobile components | Public, but secondary to adaptive imports. |

## Bootstrap Example

```ts
import { ApplicationConfig } from '@angular/core';
import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideArgfitUi({
      theme: ARGFIT_DARK_THEME,
      platform: 'auto',
    }),
  ],
};
```

Key runtime services:

- `AfThemeService`
- `AfPlatformService`
- `AfToastService`

## Recommended Component Import Pattern

```ts
import {
  AfButton,
  AfCard,
  AfCardContentDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
  AfDataTable,
  AfDialog,
  AfInlineMessage,
} from '@argfit-ui/adaptive';
```

Avoid mixing the adaptive path with desktop/mobile package imports in normal app components unless the integration is explicitly renderer-specific.

## Shared Type Families

`@argfit-ui/core` owns the shared ArgFit-owned type families used across the adaptive and renderer packages.

High-value families for application code include:

- chart: `AfChartType`, `AfChartSeries`, `AfChartIndicator`, `AfChartPointEvent`
- data table: `AfDataTableColumn`, `AfDataTableSort`, `AfDataTablePagination`, `AfDataTablePageChange`
- feedback: `AfFeedbackSeverity`, `AfToastOptions`, `AfToast`
- forms and selection: `AfFormOption`, `AfValidationState`, `AfListboxSelectionMode`, `AfMultiSelectOption`
- navigation and shell: `AfNavigationItem`, `AfBreadcrumbItem`
- workflow: `AfKanbanColumn`, `AfKanbanCard`, `AfKanbanMoveEvent`

## Slot Directive Families

ArgFit uses slot directives to keep composition semantic without exposing vendor markup.

| Surface | Slot directives |
| --- | --- |
| Card | `AfCardHeaderDirective`, `AfCardTitleDirective`, `AfCardSubtitleDirective`, `AfCardEyebrowDirective`, `AfCardContentDirective`, `AfCardFooterDirective` |
| Dialog | `AfDialogHeaderDirective`, `AfDialogTitleDirective`, `AfDialogDescriptionDirective`, `AfDialogContentDirective`, `AfDialogFooterDirective` |
| Page shell | `AfPageShellBrandDirective`, `AfPageShellActionsDirective`, `AfPageShellUserDirective`, `AfPageShellFooterDirective` |
| Analytics card | `AfAnalyticsCardActionsDirective`, `AfAnalyticsCardMetricsDirective`, `AfAnalyticsCardLegendDirective`, `AfAnalyticsCardFooterDirective` |
| Popover | `AfPopoverTriggerDirective`, `AfPopoverContentDirective` |
| Data table | `AfDataTableCellDirective`, `AfDataTableExpandedRowDirective`, `AfDataTableToolbarDirective`, `AfDataTableEmptyDirective` |
| Data view | `AfDataViewItemDirective`, `AfDataViewActionsDirective`, `AfDataViewEmptyDirective`, `AfDataViewLoadingDirective` |
| Kanban | `AfKanbanCardDirective`, `AfKanbanColumnHeaderDirective`, `AfKanbanEmptyDirective`, `AfKanbanCardFooterDirective` |
| Order list | `AfOrderListItemDirective`, `AfOrderListActionsDirective`, `AfOrderListEmptyDirective`, `AfOrderListLoadingDirective` |
| Organization chart | `AfOrganizationChartNodeDirective`, `AfOrganizationChartActionsDirective`, `AfOrganizationChartEmptyDirective`, `AfOrganizationChartLoadingDirective` |
| Pick list | `AfPickListItemDirective`, `AfPickListActionsDirective`, `AfPickListLoadingDirective`, `AfPickListSourceEmptyDirective`, `AfPickListTargetEmptyDirective` |
| Timeline | `AfTimelineItemDirective`, `AfTimelineActionsDirective`, `AfTimelineEmptyDirective`, `AfTimelineLoadingDirective` |
| Tree | `AfTreeNodeDirective`, `AfTreeActionsDirective`, `AfTreeEmptyDirective`, `AfTreeLoadingDirective` |
| Tree table | `AfTreeTableCellDirective`, `AfTreeTableActionsDirective`, `AfTreeTableEmptyDirective`, `AfTreeTableLoadingDirective` |
| Virtual scroller | `AfVirtualScrollerItemDirective`, `AfVirtualScrollerActionsDirective`, `AfVirtualScrollerEmptyDirective`, `AfVirtualScrollerLoadingDirective` |
| Splitter | `AfSplitterPrimaryDirective`, `AfSplitterSecondaryDirective` |
| Toolbar | `AfToolbarStartDirective`, `AfToolbarCenterDirective`, `AfToolbarEndDirective` |

## Renderer-Specific Posture

Desktop and mobile packages remain public because some teams need intentional renderer-level integration. Even in those cases:

- keep `@argfit-ui/core` as the shared runtime contract
- do not re-expose PrimeNG or Ionic types through your own public wrappers
- prefer adaptive docs and examples as the default training path for application engineers

## API Rules For 1.0.x

- public names may not be removed or renamed in `1.0.x`
- additive surface is allowed only when backward-compatible and documented
- vendor-specific types remain forbidden in ArgFit-owned public signatures
- the package barrels listed in [productive public API](./public-api.md) are the source of truth