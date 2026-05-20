# ArgFit UI 0.1.0-alpha.0 Scope

## Status

This document defines the intended public scope for `0.1.0-alpha.0`.

The alpha is a deliberate contract, not a snapshot of every file in the repo. It is usable by an Angular consumer, but it may contain breaking changes between alpha prereleases. No API in this document should be treated as stable for `1.0`.

## Product Decision

The primary consumer API for the alpha is:

```ts
import { provideArgfitUi } from '@argfit-ui/core';
import { AfButton, AfCard, AfInput } from '@argfit-ui/adaptive';
import { AfIconComponent } from '@argfit-ui/primitives';
```

Consumers should prefer `@argfit-ui/adaptive` for UI components. The `@argfit-ui/desktop` and `@argfit-ui/mobile` packages are publishable renderer packages for advanced or internal composition, but they are not the recommended application-facing entry point.

## Publishable Packages

The alpha package set is:

| Package | Alpha role | Status |
| --- | --- | --- |
| `@argfit-ui/core` | Tokens, themes, config, services and shared types | `stable-for-alpha` |
| `@argfit-ui/primitives` | Vendor-agnostic accessibility and icon primitives | `stable-for-alpha` |
| `@argfit-ui/adaptive` | Primary semantic Angular component API | mixed, see below |
| `@argfit-ui/desktop` | PrimeNG-backed desktop renderer implementations | renderer-specific, experimental unless noted |
| `@argfit-ui/mobile` | Ionic-backed mobile renderer implementations | renderer-specific, experimental unless noted |

## Stable For Alpha

These APIs are included in the `0.1.0-alpha.0` contract and should remain coherent across alpha prereleases, even though breaking changes remain allowed with changelog notes.

| Area | Public APIs |
| --- | --- |
| Configuration | `provideArgfitUi`, `AfUiConfig`, `AF_UI_CONFIG` |
| Theme runtime | `AfThemeService`, `ARGFIT_DARK_THEME`, `ARGFIT_LIGHT_THEME`, theme token exports |
| Platform runtime | `AfPlatformService`, platform preference/types |
| Accessibility primitives | `AfVisuallyHiddenComponent`, `AfFocusTrapDirective`, `AfFocusInitialDirective`, `AfEscapeKeyDirective` |
| Icons | `AfIconComponent`, `AfIconName`, icon size/tone types |
| Base components | `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`, `AfBadge`, `AfPageShell`, `AfMetricCard` |
| Stable slot directives | Card, dialog and page shell slot directives exported from `@argfit-ui/adaptive` |

## Experimental In Alpha

These APIs are available in alpha builds but can change more aggressively between prereleases. They are documented so they are not accidental exports.

| Area | Public APIs | Reason |
| --- | --- | --- |
| Data surfaces | `AfDataTable` and data table slot/cell directives | Enterprise table API still needs broader consumer validation |
| Analytics composition | `AfAnalyticsCard` and analytics slot directives | Useful in showcase, but chart/layout contracts may evolve |
| Form controls expansion | `AfSelect`, `AfTextarea`, `AfToggle`, `AfCheckbox`, `AfRadioGroup`, `AfSegmentedControl` | HU-013 slice is implemented but still broad and likely to evolve |
| Password input | `AfPassword` | Implemented after the original alpha suggestion; keep experimental until form-control conventions settle |
| Feedback | `AfToast`, `AfToastViewport`, `AfInlineMessage`, `AfToastService` | HU-014 is implemented, but placement/timing and viewport behavior may evolve |
| Renderer packages | Desktop and mobile implementation components | Exposed for renderer-specific usage, not the preferred consumer surface |

## Planned Or Out Of Alpha

These are not part of the `0.1.0-alpha.0` public contract unless they appear later in a separate HU.

- Popover, dropdown, tooltip, drawer, command palette and menu systems.
- Date picker, file upload, autocomplete, slider, stepper and schema-driven forms.
- Virtualized data table, server-side data source, column resizing/reorder and inline editing.
- Chart export, drilldown, synchronized charts and 3D chart presets.
- Notification center, browser push notifications and persistent user notification history.
- Packaging, npm publish, final changelog, CI release gates and smoke consumer app.

## Vendor-Independent Contract

The alpha public API must not require consumers to import PrimeNG, Ionic or ECharts types from `@argfit-ui/adaptive`.

Allowed internal implementation details:

- `@argfit-ui/desktop` may use PrimeNG internally.
- `@argfit-ui/mobile` may use Ionic internally.
- Chart implementations may use ECharts internally.
- Icon primitives may use Lucide internally.

Public contracts must stay ArgFit-owned: `Af*` components, `Af*` directives, `Af*` services and `Af*` types.

## Alpha Breaking Changes Policy

Breaking changes are allowed between `0.1.0-alpha.x` prereleases. Every breaking change should be captured in the future alpha changelog or release notes with:

- API removed or renamed.
- Migration path if one exists.
- Whether the change affects `stable-for-alpha` or `experimental` APIs.

## Acceptance Checklist

- [x] Five publishable packages are named.
- [x] Stable and experimental API groups are separated.
- [x] Planned/out-of-alpha components are listed.
- [x] Vendor-independent contract is stated.
- [x] Public API inventory lives in `docs/alpha/public-api.md`.
- [x] Compatibility checklist lives in `docs/alpha/compatibility.md`.
- [ ] `pnpm guard:architecture` passes after this HU.
- [ ] `pnpm build:libs` passes after this HU.
