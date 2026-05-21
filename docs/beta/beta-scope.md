# ArgFit UI 0.1.0-beta.0 Scope

## Status

This document defines the intended public scope for `0.1.0-beta.0`.

The beta is not just the alpha with a different tag. It is a stricter contract for early adopters: a smaller set of APIs is recommended for production-like trials, while the rest stays explicitly experimental.

## Beta Categories

| Category | Meaning |
| --- | --- |
| `stable-for-beta` | Recommended for beta consumers. Breaking changes should be rare, documented and accompanied by migration notes. |
| `experimental-in-beta` | Public and usable, but still expected to change during beta prereleases. |
| `renderer-specific` | Public renderer package API. Supported, but not the primary consumer path. |
| `out-of-beta` | Not promised for `0.1.0-beta.0`. |

## Product Decision

The primary consumer API for beta remains:

```ts
import { provideArgfitUi } from '@argfit-ui/core';
import { AfButton, AfCard, AfDialog, AfInput } from '@argfit-ui/adaptive';
import { AfIconComponent } from '@argfit-ui/primitives';
```

Consumers should continue to prefer `@argfit-ui/adaptive` for UI components. `@argfit-ui/desktop` and `@argfit-ui/mobile` remain publishable renderer packages, but they are secondary to the adaptive contract.

## Package Scope

| Package | Beta role | Beta category |
| --- | --- | --- |
| `@argfit-ui/core` | Tokens, themes, config, services and shared types | mixed: mostly `stable-for-beta`, some `experimental-in-beta` |
| `@argfit-ui/primitives` | Vendor-agnostic accessibility and icon primitives | `stable-for-beta` |
| `@argfit-ui/adaptive` | Primary semantic Angular component API | mixed: base contract stable, advanced surfaces experimental |
| `@argfit-ui/desktop` | PrimeNG-backed desktop renderer implementations | `renderer-specific` |
| `@argfit-ui/mobile` | Ionic-backed mobile renderer implementations | `renderer-specific` |

## Renderer Policy

- Desktop renderer policy: PrimeNG-first.
- Mobile renderer policy: Ionic-first.
- Adaptive package policy: ArgFit-owned, vendor-independent public API only.
- Vendor leakage remains forbidden in `@argfit-ui/adaptive`.

### PrimeNG Inside `argfit-ui-mobile`

For the current beta contract, there are zero approved PrimeNG exceptions inside `argfit-ui-mobile`.

That is consistent with the current architecture guard, which forbids PrimeNG imports in the mobile package. A future exception would require a dedicated architecture decision and all of the following conditions:

- Ionic has no strong equivalent for the required behavior.
- The result still feels touch-first and respects mobile keyboard/safe-area behavior.
- No PrimeNG types, classes, events or APIs leak into the public consumer contract.
- Bundle impact is measured and accepted.
- Accessibility and visual QA cover the exception.

## Stable For Beta

These APIs are recommended for beta consumers.

| Area | Public APIs | Reason |
| --- | --- | --- |
| Configuration | `provideArgfitUi`, `AfUiConfig`, `AF_UI_CONFIG` | Core bootstrap contract is already small, clear and vendor-agnostic. |
| Theme runtime | `AfThemeService`, `ARGFIT_DARK_THEME`, `ARGFIT_LIGHT_THEME`, base theme tokens, theme token names, theme types | Theme switching and token runtime are foundational and already exercised across the showcase. |
| Platform runtime | `AfPlatformService`, platform preference/types, breakpoints | Adaptive routing depends on these APIs and they are stable in shape. |
| Accessibility primitives | `AfVisuallyHiddenComponent`, `AfFocusTrapDirective`, `AfFocusInitialDirective`, `AfEscapeKeyDirective` | Small, focused primitives with low surface area. |
| Icons | `AfIconComponent`, icon name/size/tone types | Stable display primitive used across the showcase. |
| Base adaptive components | `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`, `AfBadge`, `AfPageShell`, `AfMetricCard` | These are the strongest current consumer slices with cross-package tests and clear semantics. |
| Stable slot directives | Card, dialog and page shell slot directives exported from `@argfit-ui/adaptive` | Their structure is already part of the intended semantic composition model. |

## Experimental In Beta

These APIs remain public in beta, but they still require more hardening before they should be treated as low-risk contracts.

| Area | Public APIs | Beta decision | Exit condition |
| --- | --- | --- | --- |
| Analytics composition | `AfAnalyticsCard`, analytics slot directives, analytics card types | Stay `experimental-in-beta` | Promote only after layout, density and chart composition contracts are validated with real consumer usage. |
| Data surfaces | `AfDataTable`, data table slot/cell directives, data table types | Stay `experimental-in-beta` | Promote only after mobile/desktop parity, enterprise interaction coverage and performance constraints are hardened. |
| Expanded form controls | `AfSelect`, `AfTextarea`, `AfToggle`, `AfCheckbox`, `AfRadioGroup`, `AfSegmentedControl`, `AfPassword`, shared form-control types | Stay `experimental-in-beta` | Promote only after keyboard, validation and mobile overlay behavior are audited across all controls. |
| Feedback | `AfToastService`, `AfToast`, `AfToastViewport`, `AfInlineMessage`, feedback types | Stay `experimental-in-beta` | Promote only after placement, lifecycle, stacking and app-level feedback orchestration are finalized. |

## HU-020 Hardening Outcome

HU-020 does not promote the experimental catalog yet. It establishes the minimum beta baseline for keeping these APIs public without pretending they are low-risk:

- `AfDataTable` now has explicit desktop/mobile coverage for sorting, pagination, selection, loading, empty, error, expansion and keyboard row activation.
- `AfAnalyticsCard` keeps slot/state coverage, but still needs more consumer validation before promotion.
- Expanded form controls keep `ControlValueAccessor` coverage across adaptive, desktop and mobile renderers, but still need broader overlay and keyboard audits before promotion.
- Feedback surfaces now have explicit toast lifecycle coverage and live-region semantics for toast and inline message variants, but service orchestration remains experimental.

## Renderer-Specific In Beta

All exports from `@argfit-ui/desktop` and `@argfit-ui/mobile` remain public, but they are categorized as `renderer-specific`.

Why they stay renderer-specific instead of stable-for-beta:

- They are valid public APIs for teams that intentionally target one renderer.
- They should remain vendor-agnostic in their public TypeScript signatures.
- They are not the preferred application-facing path for most consumers.
- Their visuals and implementation details may evolve faster than adaptive aliases.

Supporting shell renderer exports such as `AfSidebarDesktopComponent`, `AfTopbarDesktopComponent` and `AfBottomTabsMobileComponent` remain documented, but should not be treated as the primary contract for app composition.

## Out Of Beta

The following components are not promised for `0.1.0-beta.0`:

- `AfPopover`, `AfDrawer`, `AfTooltip`, `AfProgress`, `AfAvatar`, `AfChip`, `AfAccordion`.
- `AfAutocomplete`, `AfDatePicker`, `AfFileUpload`, `AfSlider`, `AfStepper`, `AfTree`, `AfVirtualList`, `AfActionSheet`.
- Advanced data-table features: virtualization, server-side sources, column resizing/reorder and inline editing.
- Advanced chart features: export, drilldown, synchronized charts and 3D presets.
- Notification center and persistent notification history.

## Beta Breaking-Change Policy

- `stable-for-beta` APIs should change only for serious correctness, accessibility or architecture reasons.
- Any breaking change to `stable-for-beta` must ship with release notes and a migration section.
- `experimental-in-beta` APIs may still change between beta prereleases, but changes must remain intentional and documented.
- `renderer-specific` APIs may evolve with renderer-focused notes, but they must not leak vendor event/types into public signatures.

## Consumer Guidance

- Prefer `@argfit-ui/adaptive` in application code.
- Pin exact prerelease versions during beta (`0.1.0-beta.x`).
- Keep all `@argfit-ui/*` packages on the same prerelease version.
- Treat experimental beta APIs as opt-in previews, not low-risk building blocks.
