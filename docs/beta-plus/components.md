# Beta+ Components

This page summarizes the intended `0.2.0-beta.0` component surface and separates the current active showcase slices from the broader implemented catalog already present in the repository.

The preferred application path remains `@argfit-ui/adaptive`.

## Status Labels

| Status | Meaning |
| --- | --- |
| `stable-from-beta` | Already part of the trusted base beta contract. |
| `experimental-in-beta-plus` | Public in the Beta+ track, but still expected to evolve during the `0.2.0-beta.x` cycle. |
| `implemented-in-repo` | Shipped in the repository today, even if the streamlined current-state showcase does not highlight it. |
| `pending-later-slice` | Still planned for Beta+, but not implemented in the current repository state. |

## Stable Base Carried Forward

These components remain the conservative baseline and do not change consumer posture in Beta+:

- `AfButton`
- `AfCard`
- `AfInput`
- `AfDialog`
- `AfChart`
- `AfBadge`
- `AfPageShell`
- `AfMetricCard`

## Active Current-State Showcase Slices

These families are both implemented and currently highlighted in the preserved `alpha` showcase slot:

| Family | Components | Status | Current-state showcase |
| --- | --- | --- | --- |
| Overlay | `AfPopover`, `AfDrawer`, `AfTooltip` | `experimental-in-beta-plus`, `implemented-in-repo` | Yes |
| Status and identity | `AfProgress`, `AfAvatar`, `AfChip` | `experimental-in-beta-plus`, `implemented-in-repo` | Yes |
| Advanced forms | `AfInputCount`, `AfMultiSelect`, `AfDatePicker`, `AfListbox`, `AfField`, `AfIconField`, `AfInputGroup` | `experimental-in-beta-plus`, `implemented-in-repo` | Yes |
| Workflow | `AfKanban` | `experimental-in-beta-plus`, `implemented-in-repo` | Yes |

## Implemented In Repo, Currently Documented Outside The Current-State Showcase

These families are implemented and covered by focused library validation, but the streamlined current-state showcase no longer keeps them visible by default:

| Family | Components | Status | Notes |
| --- | --- | --- | --- |
| Data | `AfDataView`, `AfPaginator`, `AfOrderList`, `AfPickList`, `AfTimeline`, `AfTree`, `AfTreeTable`, `AfVirtualScroller`, `AfOrganizationChart` | `experimental-in-beta-plus`, `implemented-in-repo` | The repository keeps these surfaces alive, but the current product-facing showcase is now curated to active slices only. |
| Panel and layout | `AfTabs`, `AfAccordion`, `AfToolbar`, `AfDivider`, `AfFieldset`, `AfPanel`, `AfScrollPanel`, `AfStepper`, `AfSplitter` | `experimental-in-beta-plus`, `implemented-in-repo` | `AfStepper` and `AfSplitter` remain the most change-prone members of this family. |

Use [Beta+ public API](./public-api.md) and [Beta+ readiness](./readiness.md) as the source of truth for the full implemented catalog.

## Pending Later Beta+ Slices

The following surfaces remain in the intended Beta+ scope, but they are not implemented in the current repository state:

- `AfTreeSelect`
- `AfAutoComplete`
- `AfInputMask`
- `AfCascadeSelect`
- the remaining advanced form backlog from the broader Beta+ scope

## Behavior Notes For Current Beta+ Surfaces

### AfTooltip

- Keep the API semantic and adaptive.
- Desktop can express hover help, but mobile must fall back to explicit trigger or focus-driven disclosure.
- Consumers should not depend on hover-only interaction to reveal critical information.

### AfKanban

- Desktop uses internal CDK drag and drop for same-column reorder and cross-column moves.
- Mobile currently uses a grouped touch-first board with explicit move actions instead of touch drag.
- Keyboard and assistive-technology users must always have a non-drag move path.

## Recommended Import Pattern

```ts
import {
  AfAvatar,
  AfChip,
  AfDatePicker,
  AfDrawer,
  AfInputCount,
  AfKanban,
  AfListbox,
  AfMultiSelect,
  AfPopover,
  AfProgress,
  AfTooltip,
} from '@argfit-ui/adaptive';
```

Prefer renderer packages only when you are intentionally building renderer-specific examples, tests or integration layers.
