# Beta Public API Inventory

This document classifies the current public export surface for the intended `0.1.0-beta.0` contract.

## Status Labels

| Status | Meaning |
| --- | --- |
| `stable-for-beta` | Recommended and expected to evolve conservatively. |
| `experimental-in-beta` | Public but still expected to move during beta prereleases. |
| `renderer-specific` | Public renderer package API; not the primary consumer path. |
| `out-of-beta` | Not promised for the beta milestone. |

## `@argfit-ui/core`

| Export path | Public exports | Beta category | Reason | Change policy |
| --- | --- | --- | --- | --- |
| `./lib/config/argfit-ui.config` | `AfUiConfig`, `AF_UI_CONFIG` | `stable-for-beta` | Small bootstrap contract used by all consumers. | Conservative; document any breaking change. |
| `./lib/providers/provide-argfit-ui` | `provideArgfitUi` | `stable-for-beta` | Primary bootstrap entrypoint. | Conservative; document any breaking change. |
| `./lib/services/platform.service` | `AfPlatformService` | `stable-for-beta` | Core adaptive runtime dependency. | Conservative; additive changes preferred. |
| `./lib/services/toast.service` | `AfToastService` | `experimental-in-beta` | Toast lifecycle is covered, but service orchestration and stacking policy are still evolving. | May change during beta with migration notes. |
| `./lib/themes/argfit-dark.theme` | `ARGFIT_DARK_THEME` | `stable-for-beta` | Primary shipped theme preset. | Keep shape stable. |
| `./lib/themes/argfit-light.theme` | `ARGFIT_LIGHT_THEME` | `stable-for-beta` | Secondary shipped theme preset. | Keep shape stable. |
| `./lib/themes/base-tokens` | `AF_BASE_THEME_TOKENS` | `stable-for-beta` | Foundation token contract. | Additive token growth preferred. |
| `./lib/themes/theme.service` | `AfThemeService` | `stable-for-beta` | Small runtime service exercised throughout the showcase. | Conservative; additive changes preferred. |
| `./lib/themes/theme.types` | `AfThemeKind`, `AfThemeDefinition` | `stable-for-beta` | Theme runtime types are already central and small. | Conservative. |
| `./lib/tokens/breakpoints` | `AF_BREAKPOINTS`, `AF_MOBILE_MEDIA_QUERY` | `stable-for-beta` | Shared responsive contract used by adaptive decisions. | Conservative. |
| `./lib/tokens/theme-token-names` | `AF_THEME_TOKEN_NAMES`, `AfThemeTokenName`, `AfThemeTokenMap` | `stable-for-beta` | Explicit token-name contract for theming consumers. | Conservative; additive changes preferred. |
| `./lib/types/analytics-card.types` | `AfAnalyticsCardDensity`, `AfAnalyticsCardVariant`, `AfAnalyticsCardTone`, `AfAnalyticsCardState` | `experimental-in-beta` | Slot/state coverage exists, but the analytics layout contract still needs more real consumer validation. | May change with analytics component notes. |
| `./lib/types/badge.types` | `AfBadgeTone`, `AfBadgeVariant`, `AfBadgeSize`, `AfBadgeShape`, `AfBadgeIconName` | `stable-for-beta` | Badge semantics are simple and already consistent. | Conservative. |
| `./lib/types/button.types` | `AfButtonVariant`, `AfButtonSize`, `AfButtonType` | `stable-for-beta` | Base action semantics are well bounded. | Conservative. |
| `./lib/types/card.types` | `AfCardVariant`, `AfCardDensity`, `AfCardTone` | `stable-for-beta` | Card surface contract is already small and reusable. | Conservative. |
| `./lib/types/chart.types` | `AfChartType`, `AfChartTone`, `AfChartDensity`, `AfChartStatus`, `AfChartValue`, `AfChartPoint`, `AfChartIndicator`, `AfChartSeries`, `AfChartPointEvent` | `stable-for-beta` | Chart facade is core to the current beta-ready catalog. | Conservative; additive changes preferred. |
| `./lib/types/data-table.types` | `AfDataTable*` column, sort, pagination and template types | `experimental-in-beta` | Keyboard, state and mobile-list parity are covered, but the data table remains a broad enterprise surface. | May change with table hardening. |
| `./lib/types/dialog.types` | `AfDialogSize`, `AfDialogTone`, `AfDialogMobilePresentation` | `stable-for-beta` | Dialog contract is already coherent across renderers. | Conservative. |
| `./lib/types/feedback.types` | `AfFeedbackSeverity`, `AfToastPlacement`, `AfToastOptions`, `AfToast` | `experimental-in-beta` | Live-region semantics and dismissibility are covered, but placement/lifecycle rules are still settling. | May change with feedback hardening. |
| `./lib/types/form-control.types` | `AfFormOption`, `AfControlSize`, `AfValidationState` | `experimental-in-beta` | Shared form-control vocabulary has CVA coverage, but still tracks experimental form surfaces. | May change with form-control hardening. |
| `./lib/types/icon.types` | `AfIconName`, `AfIconSize`, `AfIconTone` | `stable-for-beta` | Small display type set used broadly. | Conservative. |
| `./lib/types/input.types` | `AfInputSize`, `AfInputTone`, `AfInputType` | `stable-for-beta` | Base input contract is already stable and covered. | Conservative. |
| `./lib/types/metric-card.types` | `AfMetricCardTone`, `AfMetricCardSize`, `AfMetricCardDensity`, `AfMetricCardVariant`, `AfMetricTrendDirection`, `AfMetricCardIconName` | `stable-for-beta` | Metric cards are part of the stable catalog. | Conservative. |
| `./lib/types/navigation.types` | `AfNavigationItemKind`, `AfNavigationItem`, `AfBreadcrumbItem` | `stable-for-beta` | Page-shell composition depends on them. | Conservative. |
| `./lib/types/page-shell.types` | `AfPageShellDensity`, `AfPageShellVariant` | `stable-for-beta` | Shell contract is part of the base stable set. | Conservative. |
| `./lib/types/platform.types` | `AfPlatform`, `AfPlatformPreference` | `stable-for-beta` | Core adaptive runtime types. | Conservative. |

## `@argfit-ui/primitives`

| Export path | Public exports | Beta category | Reason | Change policy |
| --- | --- | --- | --- | --- |
| `./lib/a11y/af-visually-hidden.component` | `AfVisuallyHiddenComponent` | `stable-for-beta` | Small accessibility primitive. | Conservative. |
| `./lib/dismiss/af-escape-key.directive` | `AfEscapeKeyDirective` | `stable-for-beta` | Reusable interaction primitive with low surface area. | Conservative. |
| `./lib/focus/af-focus-initial.directive` | `AfFocusInitialDirective` | `stable-for-beta` | Focus-management primitive already broadly applicable. | Conservative. |
| `./lib/focus/af-focus-trap.directive` | `AfFocusTrapDirective` | `stable-for-beta` | Core accessibility primitive used by dialog flows. | Conservative. |
| `./lib/icon/af-icon.component` | `AfIconComponent` | `stable-for-beta` | Shared icon primitive used across stable components. | Conservative. |

## `@argfit-ui/adaptive`

### Stable Adaptive Exports

| Public exports | Beta category | Reason | Change policy |
| --- | --- | --- | --- |
| `AfButton`, `AfButtonComponent` | `stable-for-beta` | Primary semantic action component with clear inputs and tests. | Conservative; additive changes preferred. |
| `AfCard`, `AfCardComponent` | `stable-for-beta` | Stable surface primitive for composition. | Conservative. |
| `AfCardHeaderDirective`, `AfCardTitleDirective`, `AfCardSubtitleDirective`, `AfCardEyebrowDirective`, `AfCardContentDirective`, `AfCardFooterDirective`, `AF_CARD_SLOT_DIRECTIVES` | `stable-for-beta` | Card slots are part of the intended semantic composition model. | Conservative. |
| `AfInput`, `AfInputComponent` | `stable-for-beta` | Base input contract is mature enough for beta consumers. | Conservative. |
| `AfDialog`, `AfDialogComponent` | `stable-for-beta` | Dialog/sheet contract is central and already coherent across renderers. | Conservative. |
| `AfDialogHeaderDirective`, `AfDialogTitleDirective`, `AfDialogDescriptionDirective`, `AfDialogContentDirective`, `AfDialogFooterDirective`, `AF_DIALOG_SLOT_DIRECTIVES` | `stable-for-beta` | Dialog slots are part of the stable composition contract. | Conservative. |
| `AfChart`, `AfChartComponent` | `stable-for-beta` | Chart facade is intentionally ArgFit-owned and already central to the showcase. | Conservative; additive changes preferred. |
| `AfBadge`, `AfBadgeComponent` | `stable-for-beta` | Compact status/tag surface with bounded semantics. | Conservative. |
| `AfPageShell`, `AfPageShellComponent` | `stable-for-beta` | Shell composition is one of the key adaptive differentiators. | Conservative. |
| `AfPageShellBrandDirective`, `AfPageShellActionsDirective`, `AfPageShellUserDirective`, `AfPageShellFooterDirective`, `AF_PAGE_SHELL_SLOT_DIRECTIVES` | `stable-for-beta` | Page-shell slots are part of the stable shell contract. | Conservative. |
| `AfMetricCard`, `AfMetricCardComponent` | `stable-for-beta` | KPI/value surface is compact and already coherent. | Conservative. |

### Experimental Adaptive Exports

| Public exports | Beta category | Reason | Change policy |
| --- | --- | --- | --- |
| `AfAnalyticsCard`, `AfAnalyticsCardComponent` | `experimental-in-beta` | Analytics composition has slot/state coverage, but still needs more consumer validation. | May change with explicit migration notes. |
| `AfAnalyticsCardActionsDirective`, `AfAnalyticsCardMetricsDirective`, `AfAnalyticsCardLegendDirective`, `AfAnalyticsCardFooterDirective`, `AF_ANALYTICS_CARD_SLOT_DIRECTIVES` | `experimental-in-beta` | Track the analytics card contract. | May change with analytics hardening. |
| `AfDataTable`, `AfDataTableComponent` | `experimental-in-beta` | Enterprise table/list API now has keyboard/state/mobile parity coverage, but remains broad and high-risk. | May change with table hardening. |
| `AfDataTableCellDirective`, `AfDataTableExpandedRowDirective`, `AfDataTableToolbarDirective`, `AfDataTableEmptyDirective`, `AF_DATA_TABLE_SLOT_DIRECTIVES` | `experimental-in-beta` | Track the data table contract after the new keyboard/state hardening baseline. | May change with table hardening. |
| `AfSelect`, `AfSelectComponent` | `experimental-in-beta` | CVA and renderer coverage exist, but overlay and mobile selection behavior still need stricter validation. | May change with form-control hardening. |
| `AfTextarea`, `AfTextareaComponent` | `experimental-in-beta` | CVA coverage exists, but it remains part of the wider expanded form-control family. | May change with form-control hardening. |
| `AfToggle`, `AfToggleComponent` | `experimental-in-beta` | CVA coverage exists, but it still needs broader parity/accessibility validation with the rest of forms. | May change with form-control hardening. |
| `AfCheckbox`, `AfCheckboxComponent` | `experimental-in-beta` | CVA coverage exists, but it still needs broader parity/accessibility validation with the rest of forms. | May change with form-control hardening. |
| `AfRadioGroup`, `AfRadioGroupComponent` | `experimental-in-beta` | CVA coverage exists, but it still needs broader parity/accessibility validation with the rest of forms. | May change with form-control hardening. |
| `AfSegmentedControl`, `AfSegmentedControlComponent` | `experimental-in-beta` | CVA coverage exists, but it is still tied to platform-specific interaction details. | May change with form-control hardening. |
| `AfPassword`, `AfPasswordComponent` | `experimental-in-beta` | Label/error wiring exists, but reveal/toggle behavior and mobile keyboard flows still need validation. | May change with form-control hardening. |
| `AfToast`, `AfToastComponent` | `experimental-in-beta` | Feedback row contract now has explicit live-region coverage, but still depends on feedback orchestration decisions. | May change with feedback hardening. |
| `AfToastViewport`, `AfToastViewportComponent` | `experimental-in-beta` | Viewport rendering is covered, but placement and stacking policy are still evolving. | May change with feedback hardening. |
| `AfInlineMessage`, `AfInlineMessageComponent` | `experimental-in-beta` | Severity-based live-region semantics are covered, but feedback pattern guidance may still evolve. | May change with feedback hardening. |

## `@argfit-ui/desktop`

All current desktop exports are classified as `renderer-specific`.

| Public exports | Beta category | Reason | Change policy |
| --- | --- | --- | --- |
| `AfAnalyticsCardDesktopComponent`, `AfBadgeDesktopComponent`, `AfButtonDesktopComponent`, `AfCardDesktopComponent`, `AfChartDesktopComponent`, `AfCheckboxDesktopComponent`, `AfDataTableDesktopComponent`, `AfDialogDesktopComponent`, `AfInlineMessageDesktopComponent`, `AfInputDesktopComponent`, `AfMetricCardDesktopComponent`, `AfPageShellDesktopComponent`, `AfPasswordDesktopComponent`, `AfRadioGroupDesktopComponent`, `AfSegmentedControlDesktopComponent`, `AfSelectDesktopComponent`, `AfSidebarDesktopComponent`, `AfTextareaDesktopComponent`, `AfToggleDesktopComponent`, `AfToastDesktopComponent`, `AfToastViewportDesktopComponent`, `AfTopbarDesktopComponent` | `renderer-specific` | Desktop renderers are supported public APIs, but not the primary consumer contract. | May evolve with renderer-focused notes; vendor leakage remains forbidden. |

## `@argfit-ui/mobile`

All current mobile exports are classified as `renderer-specific`.

| Public exports | Beta category | Reason | Change policy |
| --- | --- | --- | --- |
| `AfAnalyticsCardMobileComponent`, `AfBadgeMobileComponent`, `AfBottomTabsMobileComponent`, `AfButtonMobileComponent`, `AfCardMobileComponent`, `AfChartMobileComponent`, `AfCheckboxMobileComponent`, `AfDataTableMobileComponent`, `AfDialogMobileComponent`, `AfInlineMessageMobileComponent`, `AfInputMobileComponent`, `AfMetricCardMobileComponent`, `AfPageShellMobileComponent`, `AfPasswordMobileComponent`, `AfRadioGroupMobileComponent`, `AfSegmentedControlMobileComponent`, `AfSelectMobileComponent`, `AfTextareaMobileComponent`, `AfToggleMobileComponent`, `AfToastMobileComponent`, `AfToastViewportMobileComponent` | `renderer-specific` | Mobile renderers are supported public APIs, but not the primary consumer contract. | May evolve with renderer-focused notes; vendor leakage remains forbidden. |

## Vendor Leakage Audit

The adaptive beta contract must not export:

- PrimeNG components, directives, modules or event types.
- Ionic Angular components, controllers or public event types.
- ECharts option, instance or event types.

Renderer packages may wrap those engines internally, but public TypeScript signatures must stay ArgFit-owned.
