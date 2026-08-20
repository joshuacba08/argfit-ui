# ArgFit UI 2.1.0 Scope

## Status

This document defines the stable public scope for `2.1.0`.

ArgFit UI `2.1.0` introduces one deliberate breaking import change for charts while keeping public barrels, the recommended usage path and support expectations explicit.

## 2.0 Categories

| Category | Meaning |
| --- | --- |
| `2.0-foundation` | Stable bootstrap, token, runtime and shared type contracts that application code may depend on directly. |
| `2.0-adaptive` | Stable semantic component APIs exported from `@argfit-ui/adaptive` and its documented secondary entry points. This is the recommended application-facing path. |
| `2.0-renderer-specific` | Stable renderer package APIs exported from `@argfit-ui/desktop` and `@argfit-ui/mobile`. Supported, but secondary to the adaptive path. |
| `out-of-2.0` | Planned or historical surfaces that are not part of the `2.1.0` contract because they are not publicly exported or are intentionally outside the recommended path. |

Every public export included in the current package barrels must belong to one of the `2.0-*` categories above. There is no `experimental` public category in the `2.1.0` contract.

## Product Decision

The recommended production path remains:

```ts
import { provideArgfitUi } from '@argfit-ui/core';
import { AfButton, AfDialog, AfInput, AfPageShell } from '@argfit-ui/adaptive';
import { AfIconComponent } from '@argfit-ui/primitives';
```

The `2.1.0` product rules are:

- application code should prefer `@argfit-ui/adaptive` over renderer packages
- application code imports `AfChart` from `@argfit-ui/adaptive/chart`
- `@argfit-ui/chart-runtime` is an installed technical peer and not an application API
- `@argfit-ui/core` remains vendor-agnostic and owns the shared runtime contract
- `@argfit-ui/primitives` remains vendor-agnostic and low-level
- desktop remains PrimeNG-first internally
- mobile remains Ionic-first internally
- renderer packages stay public, but they are an intentional opt-in path rather than the recommended default

This is how the former beta and Beta+ experimental surface remains resolved for `2.1.0`: promoted exports stay public, renderer-specific exports stay isolated in renderer packages, and backlog ideas that never shipped stay outside the stable contract.

## Included In 2.1.0

### `@argfit-ui/core` as `2.0-foundation`

Included and frozen for `1.0.x`:

- bootstrap and configuration: `provideArgfitUi`, `AfUiConfig`, `AF_UI_CONFIG`
- theme runtime: `AfThemeService`, shipped themes, token maps, theme token names
- platform runtime: `AfPlatformService`, platform preference and platform types
- shared ArgFit-owned component and workflow type families already exported through the core barrel
- headless Calendar geometry, interaction, validation, controlled decisions and undo contracts

### `@argfit-ui/primitives` as `2.0-foundation`

Included and frozen for `1.0.x`:

- accessibility helpers: visually hidden, focus trap, initial focus, escape-key behavior
- shared icon primitive
- explicit Lucide and `@ng-icons/*` registration helpers; concrete icon packs remain optional

### `@argfit-ui/adaptive` as `2.0-adaptive`

Included and frozen for `1.0.x`:

- stable application shell and base controls
- feedback and status surfaces
- overlay surfaces
- advanced form and selection surfaces that are already exported in the adaptive barrel
- data, hierarchy and workflow surfaces already exported in the adaptive barrel
- panel and layout surfaces already exported in the adaptive barrel
- slot directives and slot-directive constants exported alongside those adaptive families
- the Calendar family secondary entry point at `@argfit-ui/adaptive/calendar`
- the Chart family secondary entry point at `@argfit-ui/adaptive/chart`
- adaptive `AfChartCard` and `AfCommandPalette` families with desktop and mobile renderers
- expanded vendor-neutral `AfChart` contracts for 2D, statistical and optional 3D visualization
- accessible chart tables with automatic, series-oriented or point-oriented layouts and consumer-defined dimension headers
- inline `AfChartCard` header actions for frequent operations without duplicating them in the overflow menu

The adaptive root plus its documented `calendar` and `chart` secondary entry points are the canonical application contract for `2.1.0`.

### `@argfit-ui/desktop` and `@argfit-ui/mobile` as `2.0-renderer-specific`

Included and frozen for `1.0.x`:

- the renderer component classes currently re-exported from the desktop and mobile barrels
- supporting renderer-only shell components such as desktop sidebar/topbar and mobile bottom tabs

These exports are supported, but they are not the preferred application-facing path. New application examples, migration guides and docs should continue to point teams toward adaptive imports unless a renderer-specific integration is intentional.

## Out Of 2.1.0

The following surfaces are `out-of-1.0` because they are not part of the current public barrels or were intentionally deferred:

- `AfAutoComplete`
- `AfCascadeSelect`
- `AfColorPicker`
- `AfEditor`
- `AfFloatLabel`
- `AfIftaLabel`
- `AfInputMask`
- `AfInputNumber`
- `AfInputOtp`
- `AfKeyFilter`
- `AfKnob`
- `AfRating`
- `AfToggleButton`
- `AfTreeSelect`
- `AfActionSheet`
- `AfCalendarScheduler`
- `AfVirtualKanban`
- `AfTerminal`

These names may re-enter in a later minor or major release only after they have a documented ArgFit-owned contract, tests, accessibility notes and an explicit public-barrel decision.

## Freeze Rules

For `1.0.x`:

- the public barrels described in `docs/productive/public-api.md` are frozen
- public names, input/output semantics and ArgFit-owned event/type shapes must remain backward-compatible
- vendor types must not leak into ArgFit-owned public signatures
- public removals, renames or type-shape breaks are deferred to the next major
- new public surface is allowed only as additive `1.x` growth and must be documented before release

## Recommended Migration Posture

Teams moving from 1.x to `2.1.0` should:

- prefer `@argfit-ui/adaptive` imports for application code
- treat renderer-package imports as advanced or infrastructure-level integration points
- remove reliance on planned-but-unshipped Beta+ backlog surfaces
- migrate `AfChart` imports to `@argfit-ui/adaptive/chart`
- align their internal wrappers with the stable `2.1.0` names and semantics documented in the productive API inventory
