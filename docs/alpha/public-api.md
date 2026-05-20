# Alpha Public API Inventory

This is the expected public export inventory for `0.1.0-alpha.0`.

Status labels:

- `stable-for-alpha`: included in the alpha contract.
- `experimental`: public in alpha, but expected to change.
- `renderer-specific`: public renderer implementation API; prefer `@argfit-ui/adaptive` in app code.

## `@argfit-ui/core`

Status: `stable-for-alpha` unless a row is explicitly marked experimental.

| Export path | Expected public exports | Status |
| --- | --- | --- |
| `./lib/config/argfit-ui.config` | `AfUiConfig`, `AF_UI_CONFIG` | `stable-for-alpha` |
| `./lib/providers/provide-argfit-ui` | `provideArgfitUi` | `stable-for-alpha` |
| `./lib/services/platform.service` | `AfPlatformService` | `stable-for-alpha` |
| `./lib/services/toast.service` | `AfToastService` | `experimental` |
| `./lib/themes/argfit-dark.theme` | `ARGFIT_DARK_THEME` | `stable-for-alpha` |
| `./lib/themes/argfit-light.theme` | `ARGFIT_LIGHT_THEME` | `stable-for-alpha` |
| `./lib/themes/base-tokens` | `AF_BASE_THEME_TOKENS` | `stable-for-alpha` |
| `./lib/themes/theme.service` | `AfThemeService` | `stable-for-alpha` |
| `./lib/themes/theme.types` | `AfThemeKind`, `AfThemeDefinition` | `stable-for-alpha` |
| `./lib/tokens/breakpoints` | `AF_BREAKPOINTS`, `AF_MOBILE_MEDIA_QUERY` | `stable-for-alpha` |
| `./lib/tokens/theme-token-names` | `AF_THEME_TOKEN_NAMES`, `AfThemeTokenName`, `AfThemeTokenMap` | `stable-for-alpha` |
| `./lib/types/analytics-card.types` | `AfAnalyticsCardDensity`, `AfAnalyticsCardVariant`, `AfAnalyticsCardTone`, `AfAnalyticsCardState` | `experimental` |
| `./lib/types/badge.types` | `AfBadgeTone`, `AfBadgeVariant`, `AfBadgeSize`, `AfBadgeShape`, `AfBadgeIconName` | `stable-for-alpha` |
| `./lib/types/button.types` | `AfButtonVariant`, `AfButtonSize`, `AfButtonType` | `stable-for-alpha` |
| `./lib/types/card.types` | `AfCardVariant`, `AfCardDensity`, `AfCardTone` | `stable-for-alpha` |
| `./lib/types/chart.types` | `AfChartType`, `AfChartTone`, `AfChartDensity`, `AfChartStatus`, `AfChartValue`, `AfChartPoint`, `AfChartIndicator`, `AfChartSeries`, `AfChartPointEvent` | `stable-for-alpha` |
| `./lib/types/data-table.types` | `AfDataTable*` column, sort, pagination and template types | `experimental` |
| `./lib/types/dialog.types` | `AfDialogSize`, `AfDialogTone`, `AfDialogMobilePresentation` | `stable-for-alpha` |
| `./lib/types/feedback.types` | `AfFeedbackSeverity`, `AfToastPlacement`, `AfToastOptions`, `AfToast` | `experimental` |
| `./lib/types/form-control.types` | `AfFormOption`, `AfControlSize`, `AfValidationState` | `experimental` |
| `./lib/types/icon.types` | `AfIconName`, `AfIconSize`, `AfIconTone` | `stable-for-alpha` |
| `./lib/types/input.types` | `AfInputSize`, `AfInputTone`, `AfInputType` | `stable-for-alpha` |
| `./lib/types/metric-card.types` | `AfMetricCardTone`, `AfMetricCardSize`, `AfMetricCardDensity`, `AfMetricCardVariant`, `AfMetricTrendDirection`, `AfMetricCardIconName` | `stable-for-alpha` |
| `./lib/types/navigation.types` | `AfNavigationItemKind`, `AfNavigationItem`, `AfBreadcrumbItem` | `stable-for-alpha` |
| `./lib/types/page-shell.types` | `AfPageShellDensity`, `AfPageShellVariant` | `stable-for-alpha` |
| `./lib/types/platform.types` | `AfPlatform`, `AfPlatformPreference` | `stable-for-alpha` |

## `@argfit-ui/primitives`

| Export path | Expected public exports | Status |
| --- | --- | --- |
| `./lib/a11y/af-visually-hidden.component` | `AfVisuallyHiddenComponent` | `stable-for-alpha` |
| `./lib/dismiss/af-escape-key.directive` | `AfEscapeKeyDirective` | `stable-for-alpha` |
| `./lib/focus/af-focus-initial.directive` | `AfFocusInitialDirective` | `stable-for-alpha` |
| `./lib/focus/af-focus-trap.directive` | `AfFocusTrapDirective` | `stable-for-alpha` |
| `./lib/icon/af-icon.component` | `AfIconComponent` | `stable-for-alpha` |

## `@argfit-ui/adaptive`

Adaptive is the primary UI package for app consumers. Public aliases must use the `Af*` names shown below.

### Stable Adaptive Exports

| Export | Notes |
| --- | --- |
| `AfButton`, `AfButtonComponent` | Primary action component |
| `AfCard`, `AfCardComponent` | Surface component |
| `AfCardHeaderDirective`, `AfCardTitleDirective`, `AfCardSubtitleDirective`, `AfCardEyebrowDirective`, `AfCardContentDirective`, `AfCardFooterDirective`, `AF_CARD_SLOT_DIRECTIVES` | Stable card slot helpers |
| `AfInput`, `AfInputComponent` | Base text input with Angular Forms support |
| `AfDialog`, `AfDialogComponent` | Adaptive dialog/sheet |
| `AfDialogHeaderDirective`, `AfDialogTitleDirective`, `AfDialogDescriptionDirective`, `AfDialogContentDirective`, `AfDialogFooterDirective`, `AF_DIALOG_SLOT_DIRECTIVES` | Stable dialog slot helpers |
| `AfChart`, `AfChartComponent` | ArgFit chart facade over internal chart renderer |
| `AfBadge`, `AfBadgeComponent` | Compact status/tag badge |
| `AfPageShell`, `AfPageShellComponent` | Adaptive application shell |
| `AfPageShellBrandDirective`, `AfPageShellActionsDirective`, `AfPageShellUserDirective`, `AfPageShellFooterDirective`, `AF_PAGE_SHELL_SLOT_DIRECTIVES` | Stable page shell slot helpers |
| `AfMetricCard`, `AfMetricCardComponent` | KPI/value card |

### Experimental Adaptive Exports

| Export | Notes |
| --- | --- |
| `AfAnalyticsCard`, `AfAnalyticsCardComponent` | Analytics composition card |
| `AfAnalyticsCardActionsDirective`, `AfAnalyticsCardMetricsDirective`, `AfAnalyticsCardLegendDirective`, `AfAnalyticsCardFooterDirective`, `AF_ANALYTICS_CARD_SLOT_DIRECTIVES` | Analytics slot helpers |
| `AfDataTable`, `AfDataTableComponent` | Desktop table / mobile list data surface |
| `AfDataTableCellDirective`, `AfDataTableExpandedRowDirective`, `AfDataTableToolbarDirective`, `AfDataTableEmptyDirective`, `AF_DATA_TABLE_SLOT_DIRECTIVES` | Data table slot/template helpers |
| `AfSelect`, `AfSelectComponent` | Form select control |
| `AfTextarea`, `AfTextareaComponent` | Form textarea control |
| `AfToggle`, `AfToggleComponent` | Form toggle control |
| `AfCheckbox`, `AfCheckboxComponent` | Form checkbox control |
| `AfRadioGroup`, `AfRadioGroupComponent` | Form radio group control |
| `AfSegmentedControl`, `AfSegmentedControlComponent` | Segmented control |
| `AfPassword`, `AfPasswordComponent` | Password input with reveal toggle |
| `AfToast`, `AfToastComponent` | Low-level toast row |
| `AfToastViewport`, `AfToastViewportComponent` | Toast viewport/host |
| `AfInlineMessage`, `AfInlineMessageComponent` | Persistent inline feedback message |

## `@argfit-ui/desktop`

Status: `renderer-specific`. These exports are allowed, documented, and vendor-independent, but consumers should prefer adaptive aliases unless they intentionally target desktop rendering.

Expected exports:

- `AfAnalyticsCardDesktopComponent`
- `AfBadgeDesktopComponent`
- `AfButtonDesktopComponent`
- `AfCardDesktopComponent`
- `AfChartDesktopComponent`
- `AfCheckboxDesktopComponent`
- `AfDataTableDesktopComponent`
- `AfDialogDesktopComponent`
- `AfInlineMessageDesktopComponent`
- `AfInputDesktopComponent`
- `AfMetricCardDesktopComponent`
- `AfPageShellDesktopComponent`
- `AfPasswordDesktopComponent`
- `AfRadioGroupDesktopComponent`
- `AfSegmentedControlDesktopComponent`
- `AfSelectDesktopComponent`
- `AfSidebarDesktopComponent`
- `AfTextareaDesktopComponent`
- `AfToggleDesktopComponent`
- `AfToastDesktopComponent`
- `AfToastViewportDesktopComponent`
- `AfTopbarDesktopComponent`

`AfSidebarDesktopComponent` and `AfTopbarDesktopComponent` are supporting shell exports. They are documented renderer APIs, but app consumers should generally compose through `AfPageShell`.

## `@argfit-ui/mobile`

Status: `renderer-specific`. These exports are allowed, documented, and vendor-independent, but consumers should prefer adaptive aliases unless they intentionally target mobile rendering.

Expected exports:

- `AfAnalyticsCardMobileComponent`
- `AfBadgeMobileComponent`
- `AfBottomTabsMobileComponent`
- `AfButtonMobileComponent`
- `AfCardMobileComponent`
- `AfChartMobileComponent`
- `AfCheckboxMobileComponent`
- `AfDataTableMobileComponent`
- `AfDialogMobileComponent`
- `AfInlineMessageMobileComponent`
- `AfInputMobileComponent`
- `AfMetricCardMobileComponent`
- `AfPageShellMobileComponent`
- `AfPasswordMobileComponent`
- `AfRadioGroupMobileComponent`
- `AfSegmentedControlMobileComponent`
- `AfSelectMobileComponent`
- `AfTextareaMobileComponent`
- `AfToggleMobileComponent`
- `AfToastMobileComponent`
- `AfToastViewportMobileComponent`

`AfBottomTabsMobileComponent` is a supporting shell export. It is documented as a renderer API, but app consumers should generally compose through `AfPageShell`.

## Vendor Leakage Audit

The `@argfit-ui/adaptive` barrel must not export:

- PrimeNG components, directives, modules or types.
- Ionic Angular components, controllers or types.
- ECharts option, instance or event types.

Allowed vendor mentions in source comments or docs do not create API leakage. Public TypeScript signatures should use ArgFit-owned `Af*` types.
