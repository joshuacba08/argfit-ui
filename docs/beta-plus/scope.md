# ArgFit UI 0.2.0-beta.0 Scope

## Status

This document defines the intended public scope for `0.2.0-beta.0`.

Beta+ is not a reset of the beta contract. It extends the healthy `0.1.0-beta.0` baseline with a broader catalog while preserving the same core architecture rules: adaptive-first public APIs, PrimeNG-first desktop renderers, Ionic-first mobile renderers, and no vendor leakage in ArgFit-owned contracts.

## Beta+ Categories

| Category | Meaning |
| --- | --- |
| `stable-from-beta` | Already part of the base beta contract and expected to stay conservative in Beta+. |
| `experimental-in-beta-plus` | Included in the Beta+ target, but still expected to evolve during the `0.2.0-beta.x` cycle. |
| `renderer-specific` | Public desktop/mobile renderer APIs. Supported, but not the preferred application-facing path. |
| `out-of-beta-plus` | Explicitly deferred beyond the intended `0.2.0-beta.0` target. |

## Product Decision

The primary consumer path remains:

```ts
import { provideArgfitUi } from '@argfit-ui/core';
import { AfButton, AfDialog, AfInput, AfPageShell } from '@argfit-ui/adaptive';
```

Beta+ expands what `@argfit-ui/adaptive` can express, but it does not change the product philosophy:

- Consumers should still prefer ArgFit semantic APIs over renderer packages.
- Desktop stays PrimeNG-first internally.
- Mobile stays Ionic-first internally.
- Angular CDK is approved when it provides a stronger interaction foundation than PrimeNG or Ionic.

## Package Scope

| Package | Beta+ role | Beta+ category |
| --- | --- | --- |
| `@argfit-ui/core` | Tokens, themes, config, services and ArgFit-owned shared types | mixed: `stable-from-beta` plus new `experimental-in-beta-plus` families |
| `@argfit-ui/primitives` | Vendor-agnostic accessibility, icon and low-level interaction helpers | mostly `stable-from-beta`, additive growth allowed |
| `@argfit-ui/adaptive` | Primary semantic Angular component API | mixed: current stable base plus new `experimental-in-beta-plus` components |
| `@argfit-ui/desktop` | PrimeNG-backed desktop renderer implementations | `renderer-specific` |
| `@argfit-ui/mobile` | Ionic-backed mobile renderer implementations | `renderer-specific` |

## Included In Beta+

### Stable Base Carried From Beta

The stable beta foundation remains in contract for Beta+:

- `provideArgfitUi`, theme runtime, platform runtime and shared token contracts.
- Accessibility and icon primitives.
- `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`, `AfBadge`, `AfPageShell`, `AfMetricCard`.
- Stable slot directives already exported for card, dialog and page shell composition.

### Beta+ Expansion Families

These families are intentionally in scope for `0.2.0-beta.0` and should enter as `experimental-in-beta-plus` unless a later HU explicitly promotes them.

#### Overlay

- `AfPopover`
- `AfDrawer`
- `AfTooltip`

#### Status And Identity

- `AfProgress`
- `AfAvatar`
- `AfChip`

#### Form

- `AfAutoComplete`
- `AfCascadeSelect`
- `AfCheckbox`
- `AfColorPicker`
- `AfDatePicker`
- `AfEditor`
- `AfField`
- `AfFloatLabel`
- `AfIconField`
- `AfIftaLabel`
- `AfInputGroup`
- `AfInputMask`
- `AfInputNumber`
- `AfInputCount`
- `AfInputOtp`
- `AfKeyFilter`
- `AfKnob`
- `AfListbox`
- `AfMultiSelect`
- `AfPassword`
- `AfRadioGroup`
- `AfRating`
- `AfSelect`
- `AfSegmentedControl`
- `AfSlider`
- `AfTextarea`
- `AfToggle`
- `AfToggleButton`
- `AfTreeSelect`

#### Data

- `AfDataView`
- `AfPaginator`
- `AfOrderList`
- `AfPickList`
- `AfTimeline`
- `AfTree`
- `AfTreeTable`
- `AfVirtualScroller`
- `AfOrganizationChart`

#### Panel And Layout

- `AfAccordion`
- `AfCard`
- `AfDivider`
- `AfFieldset`
- `AfPanel`
- `AfScrollPanel`
- `AfSplitter`
- `AfStepper`
- `AfTabs`
- `AfToolbar`

#### Workflow

- `AfKanban`

## Priority Within Beta+

The first high-priority expansion track is:

- `AfMultiSelect`
- `AfDatePicker`
- `AfAutoComplete`
- `AfTreeSelect`
- `AfDataView`
- `AfPaginator`
- `AfTabs`
- `AfStepper`
- `AfKanban`

The first low-risk/high-reuse expansion track is:

- `AfPopover`
- `AfDrawer`
- `AfTooltip`
- `AfProgress`
- `AfAvatar`
- `AfChip`

### Wave 1 Implementation Status

The current repository state already implements the first low-risk/high-reuse wave:

- `AfPopover`
- `AfDrawer`
- `AfTooltip`
- `AfProgress`
- `AfAvatar`
- `AfChip`

These six surfaces now exist with adaptive, desktop and mobile implementations plus showcase coverage in the preserved `alpha` showcase slot.

## Renderer Policy

- Desktop renderer policy: PrimeNG-first.
- Mobile renderer policy: Ionic-first.
- Mobile PrimeNG exceptions remain unapproved by default.
- Adaptive APIs must stay ArgFit-owned and vendor-independent.

### Kanban Interaction Decision

`AfKanban` is approved to use `@angular/cdk/drag-drop` as the interaction engine in both desktop and mobile implementations.

Rules for that decision:

- Drag and drop is an internal implementation detail, not public API.
- Desktop may compose PrimeNG visuals around the board.
- Mobile must remain touch-first.
- A non-drag accessible move flow is mandatory for keyboard and assistive technology users.

## Out Of Beta+

The following components are explicitly deferred beyond the intended `0.2.0-beta.0` target unless a later product decision changes the scope:

- `AfFileUpload`
- `AfActionSheet`
- `AfCalendarScheduler`
- `AfVirtualKanban`
- `AfTerminal`

## Promotion Policy

Promotion from `experimental-in-beta-plus` to a future productive contract requires all of the following:

- Adaptive, desktop and mobile implementations exist where the component is meant to be adaptive.
- Public types remain ArgFit-owned with no vendor leakage.
- Accessibility semantics and keyboard behavior are validated.
- Showcase coverage demonstrates desktop/mobile and key states.
- Consumer smoke validates imports from packed artifacts.
- Visual and performance impact are measured when the component meaningfully affects layout or overlays.

## Consumer Guidance

- Prefer `@argfit-ui/adaptive` for application code.
- Keep all `@argfit-ui/*` packages on the same prerelease version.
- Treat new Beta+ components as opt-in surfaces until they are explicitly promoted.
- Use the component engine map to understand renderer behavior, but not as a public API dependency.
