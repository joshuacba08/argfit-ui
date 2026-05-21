# ArgFit UI - Component Engine Map

## Beta Renderer Decision

ArgFit UI should not mirror PrimeNG or Ionic one-to-one. PrimeNG and Ionic are rendering engines, not the public product API.

Renderer contract for the beta target:

- Desktop renderer: PrimeNG-first.
- Mobile renderer: Ionic-first.
- Adaptive package: ArgFit-owned API only.
- Current beta scope approves zero PrimeNG exceptions inside `argfit-ui-mobile`.

The public contract remains:

```ts
import { AfButton, AfDataTable, AfDialog } from '@argfit-ui/adaptive';
```

Consumers should not need to know whether the renderer is PrimeNG, Ionic, ECharts or custom ArgFit code.

## Mobile PrimeNG Policy

For `0.1.0-beta.0`, PrimeNG is not approved inside `argfit-ui-mobile`.

That matches the current architecture guard. A future exception would require a dedicated architecture change and all of the following conditions:

- Ionic has no strong equivalent.
- The resulting interaction still feels touch-first.
- Safe areas, keyboard behavior and mobile overlays are not degraded.
- No PrimeNG symbols, types, events or classes leak into the public API.
- Bundle impact is measured and accepted.
- Tests or visual QA prove it does not look like a desktop widget shrunk onto a phone.

## Beta Component Matrix

| ArgFit API | PrimeNG desktop engine | Ionic mobile engine | Beta category | Decision |
| --- | --- | --- | --- | --- |
| `AfButton` | `Button` | `ion-button` | `stable-for-beta` | Keep as a stable base action contract. |
| `AfInput` | `InputText`, `IconField`, `InputGroup` | `ion-input`, `ion-searchbar` | `stable-for-beta` | Keep as a stable base input contract. |
| `AfTextarea` | `Textarea` | `ion-textarea` | `experimental-in-beta` | Useful, but still part of the wider form-controls hardening surface. |
| `AfPassword` | `Password` | `ion-input`, `ion-input-password-toggle` | `experimental-in-beta` | Reveal semantics and mobile keyboard behavior still need more validation. |
| `AfSelect` | `Select` | `ion-select` | `experimental-in-beta` | Overlay and mobile selection UX remain higher risk. |
| `AfCheckbox` | `Checkbox` | `ion-checkbox` | `experimental-in-beta` | Keep experimental until the full form-control contract is hardened. |
| `AfRadioGroup` | `RadioButton` | `ion-radio-group`, `ion-radio` | `experimental-in-beta` | Keep experimental until the full form-control contract is hardened. |
| `AfToggle` | `ToggleSwitch` | `ion-toggle` | `experimental-in-beta` | Keep experimental until the full form-control contract is hardened. |
| `AfSegmentedControl` | `SelectButton` | `ion-segment`, `ion-segment-button` | `experimental-in-beta` | Platform interaction details still need more consumer validation. |
| `AfDialog` | `Dialog`, `ConfirmDialog` | `ion-modal`, `ion-alert` | `stable-for-beta` | Core modal/sheet contract is stable enough for beta. |
| `AfToast` and `AfInlineMessage` | `Toast`, `Message` | `ion-toast` plus custom inline message | `experimental-in-beta` | Feedback orchestration remains under validation. |
| `AfBadge` | `Badge`, `Tag`, parts of `Chip` | `ion-badge`, `ion-chip` | `stable-for-beta` | Compact status/tag display contract is already small and coherent. |
| `AfCard` | `Card`, `Panel` | `ion-card` | `stable-for-beta` | Stable composition surface. |
| `AfChart` | ArgFit wrapper over ECharts | ArgFit wrapper over ECharts | `stable-for-beta` | Public chart contract is ArgFit-owned even though the engine is shared. |
| `AfAnalyticsCard` | Custom ArgFit composition plus chart/card primitives | Custom ArgFit composition plus chart/card primitives | `experimental-in-beta` | Layout composition and analytics density contracts still need more validation. |
| `AfDataTable` | `Table`, `Paginator` | `ion-list`, `ion-item`, `ion-infinite-scroll`, `ion-refresher` or custom list | `experimental-in-beta` | Mobile must stay list-first and the enterprise surface is still broad. |
| `AfPageShell` | `Menu`, `Menubar`, `Breadcrumb`, `Toolbar`, `Drawer` | `ion-menu`, `ion-split-pane`, `ion-tabs`, `ion-toolbar` | `stable-for-beta` | One of the strongest current adaptive differentiators. |

## Beta+ And Post-Beta Candidates

| API | Likely engines | Target |
| --- | --- | --- |
| `AfPopover` | `Popover`, `ConfirmPopup` / `ion-popover` | Beta+ candidate |
| `AfDrawer` | `Drawer` / `ion-menu` or modal sheet | Beta+ candidate |
| `AfTooltip` | `Tooltip` / custom help popover or inline help | Beta+ candidate |
| `AfProgress` | `ProgressBar`, `ProgressSpinner`, `Skeleton` / `ion-progress-bar`, `ion-spinner`, `ion-skeleton-text` | Beta+ candidate |
| `AfAvatar` | `Avatar` / `ion-avatar` | Beta+ candidate |
| `AfChip` | `Chip`, `Tag` / `ion-chip` | Beta+ candidate |
| `AfAccordion` | `Accordion` / `ion-accordion`, `ion-accordion-group` | Beta+ candidate |
| `AfAutocomplete` | `AutoComplete` / `ion-searchbar` plus modal-list pattern | Post-beta candidate |
| `AfDatePicker` | `DatePicker` / `ion-datetime`, `ion-datetime-button`, `ion-picker` | Post-beta candidate |
| `AfFileUpload` | `FileUpload` / native file input plus optional Capacitor integration | Post-beta candidate |
| `AfSlider` | `Slider`, `Knob` / `ion-range` | Post-beta candidate |
| `AfStepper` | `Stepper` / custom card-flow or segment-flow | Post-beta candidate |
| `AfTree` | `Tree`, `TreeSelect`, `TreeTable` / custom list-tree pattern | Post-beta candidate |
| `AfVirtualList` | `VirtualScroller` / custom or CDK-backed strategy | Post-beta candidate |
| `AfActionSheet` | `Menu`, `SplitButton`, `SpeedDial` / `ion-action-sheet`, `ion-fab` | Post-beta candidate |

## Product Interpretation

Equivalent does not mean identical widget.

Examples:

- Desktop `AfDataTable` can be a PrimeNG-style table, but mobile `AfDataTable` should stay a prioritized list or cards.
- Desktop `AfDialog` can be a centered modal, but mobile `AfDialog` should prefer sheet/modal/alert patterns.
- Desktop `AfTooltip` can be hover/focus driven, but mobile should prefer tap help, popover or inline disclosure.
- Desktop `AfAutocomplete` can be an overlay input, but mobile should prefer searchbar plus modal/list.

The goal remains one ArgFit API with platform-appropriate behavior.

