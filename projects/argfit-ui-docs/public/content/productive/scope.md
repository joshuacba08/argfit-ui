# ArgFit UI 1.3.2 Scope

## Status

This document defines the stable public scope for `1.3.2`.

ArgFit UI `1.3.2` extends the stable 1.x contract while keeping public barrels, the recommended usage path and support expectations explicit.

## 1.0 Categories

| Category | Meaning |
| --- | --- |
| `1.0-foundation` | Stable bootstrap, token, runtime and shared type contracts that application code may depend on directly. |
| `1.0-adaptive` | Stable semantic component APIs exported from `@argfit-ui/adaptive`. This is the recommended application-facing path. |
| `1.0-renderer-specific` | Stable renderer package APIs exported from `@argfit-ui/desktop` and `@argfit-ui/mobile`. Supported, but secondary to the adaptive path. |
| `out-of-1.0` | Planned or historical surfaces that are not part of the `1.3.2` contract because they are not publicly exported or are intentionally outside the recommended path. |

Every public export included in the current package barrels must belong to one of the `1.0-*` categories above. There is no `experimental` public category in the `1.3.2` contract.

## Product Decision

The recommended production path remains:

```ts
import { provideArgfitUi } from '@argfit-ui/core';
import { AfButton, AfDialog, AfInput, AfPageShell } from '@argfit-ui/adaptive';
import { AfIconComponent } from '@argfit-ui/primitives';
```

The `1.3.2` product rules are:

- application code should prefer `@argfit-ui/adaptive` over renderer packages
- `@argfit-ui/core` remains vendor-agnostic and owns the shared runtime contract
- `@argfit-ui/primitives` remains vendor-agnostic and low-level
- desktop remains PrimeNG-first internally
- mobile remains Ionic-first internally
- renderer packages stay public, but they are an intentional opt-in path rather than the recommended default

This is how the former beta and Beta+ experimental surface remains resolved for `1.3.2`: promoted exports stay public, renderer-specific exports stay isolated in renderer packages, and backlog ideas that never shipped stay outside the stable contract.

## Included In 1.3.2

### `@argfit-ui/core` as `1.0-foundation`

Included and frozen for `1.0.x`:

- bootstrap and configuration: `provideArgfitUi`, `AfUiConfig`, `AF_UI_CONFIG`
- theme runtime: `AfThemeService`, shipped themes, token maps, theme token names
- platform runtime: `AfPlatformService`, platform preference and platform types
- shared ArgFit-owned component and workflow type families already exported through the core barrel

### `@argfit-ui/primitives` as `1.0-foundation`

Included and frozen for `1.0.x`:

- accessibility helpers: visually hidden, focus trap, initial focus, escape-key behavior
- shared icon primitive

### `@argfit-ui/adaptive` as `1.0-adaptive`

Included and frozen for `1.0.x`:

- stable application shell and base controls
- feedback and status surfaces
- overlay surfaces
- advanced form and selection surfaces that are already exported in the adaptive barrel
- data, hierarchy and workflow surfaces already exported in the adaptive barrel
- panel and layout surfaces already exported in the adaptive barrel
- slot directives and slot-directive constants exported alongside those adaptive families

The adaptive barrel is the canonical application contract for `1.3.2`.

### `@argfit-ui/desktop` and `@argfit-ui/mobile` as `1.0-renderer-specific`

Included and frozen for `1.0.x`:

- the renderer component classes currently re-exported from the desktop and mobile barrels
- supporting renderer-only shell components such as desktop sidebar/topbar and mobile bottom tabs

These exports are supported, but they are not the preferred application-facing path. New application examples, migration guides and docs should continue to point teams toward adaptive imports unless a renderer-specific integration is intentional.

## Out Of 1.3.2

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

Teams moving from beta or Beta+ to `1.3.2` should:

- prefer `@argfit-ui/adaptive` imports for application code
- treat renderer-package imports as advanced or infrastructure-level integration points
- remove reliance on planned-but-unshipped Beta+ backlog surfaces
- align their internal wrappers with the stable `1.3.2` names and semantics documented in the productive API inventory
