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

## Beta+ Expansion Contract

The following renderer decisions define the intended Beta+ expansion. They are not all equal in priority:

- Wave 1 for Beta+: `AfPopover`, `AfDrawer`, `AfTooltip`, `AfProgress`, `AfAvatar`, `AfChip`.
- Current implementation status: the full wave 1 list above is now implemented and covered in the adaptive suite plus showcase.
- Wave 2 current status: `AfInputCount`, `AfMultiSelect`, `AfDatePicker`, `AfListbox` and the adaptive field composition helpers now have initial slices with focused specs and showcase coverage.
- High-priority Beta+ track: `AfMultiSelect`, `AfDatePicker`, `AfAutoComplete`, `AfTreeSelect`, `AfDataView`, `AfPaginator`, `AfTabs`, `AfStepper`, `AfKanban`.
- All remaining rows stay in-scope Beta+ candidates unless moved out explicitly.

| API | Likely engines | Target |
| --- | --- | --- |
| `AfPopover` | `Popover`, `ConfirmPopup` / `ion-popover` | Beta+ wave 1 implemented |
| `AfDrawer` | `Drawer` / `ion-menu` or modal sheet | Beta+ wave 1 implemented |
| `AfTooltip` | `Tooltip` / custom help popover or inline help | Beta+ wave 1 implemented |
| `AfProgress` | `ProgressBar`, `ProgressSpinner`, `Skeleton` / `ion-progress-bar`, `ion-spinner`, `ion-skeleton-text` | Beta+ wave 1 implemented |
| `AfAvatar` | `Avatar` / `ion-avatar` | Beta+ wave 1 implemented |
| `AfChip` | `Chip`, `Tag` / `ion-chip` | Beta+ wave 1 implemented |
| `AfAutoComplete` | `AutoComplete` / `ion-searchbar` plus modal-list pattern | Beta+ high priority |
| `AfCascadeSelect` | `CascadeSelect` / custom drilldown sheet | Beta+ candidate |
| `AfColorPicker` | `ColorPicker` / custom swatches plus native color input fallback | Beta+ candidate |
| `AfDatePicker` | `DatePicker` / `ion-datetime`, `ion-datetime-button`, `ion-picker` | Beta+ wave 2 slice implemented |
| `AfEditor` | `Editor`/Quill / textarea-first rich editor fallback | Beta+ experimental |
| `AfField`, `AfFloatLabel`, `AfIftaLabel`, `AfIconField`, `AfInputGroup` | `FloatLabel`, `IftaLabel`, `IconField`, `InputGroup` / ArgFit field composition | Beta+ wave 2 slice implemented |
| `AfInputMask` | `InputMask` / custom mask directive or internal formatter | Beta+ candidate |
| `AfInputNumber` | `InputNumber` / `ion-input` type number plus ArgFit formatting | Beta+ candidate |
| `AfInputCount` | `InputNumber`, `Button`, `InputGroup` or custom tokenized wrapper / `ion-input`, `ion-button` or custom touch-first wrapper | Beta+ wave 2 slice implemented |
| `AfInputOtp` | `InputOtp` / custom segmented inputs | Beta+ candidate |
| `AfKeyFilter` | `KeyFilter` / custom directive | Beta+ experimental |
| `AfKnob` | `Knob` / custom SVG/range hybrid | Beta+ experimental |
| `AfListbox` | `Listbox` / Ionic/custom selection list | Beta+ wave 2 slice implemented |
| `AfMultiSelect` | `MultiSelect` / Ionic/custom modal checklist with search | Beta+ wave 2 slice implemented |
| `AfRating` | `Rating` / custom touch-friendly rating | Beta+ candidate |
| `AfToggleButton` | `ToggleButton` / `ion-button` or custom pressed button | Beta+ candidate |
| `AfTreeSelect` | `TreeSelect` / custom drilldown tree sheet | Beta+ high priority |
| `AfSlider` | `Slider` / `ion-range` | Beta+ candidate |
| `AfDataView` | `DataView` / ArgFit/Ionic cards or list/grid | Beta+ high priority |
| `AfPaginator` | `Paginator` / compact pagination, load-more or infinite pattern | Beta+ high priority |
| `AfOrderList` | `OrderList` or CDK DragDrop / CDK DragDrop or move actions | Beta+ candidate |
| `AfPickList` | `PickList` or CDK DragDrop / dual-sheet/list pattern | Beta+ candidate |
| `AfTimeline` | `Timeline` / custom or Ionic timeline list | Beta+ candidate |
| `AfTree` | `Tree` / custom nested list with disclosure | Beta+ candidate |
| `AfTreeTable` | `TreeTable` / grouped cards or list, not table shrink | Beta+ candidate |
| `AfVirtualScroller` | `VirtualScroller` or CDK virtual scroll / CDK virtual scroll or paginated fallback | Beta+ candidate |
| `AfOrganizationChart` | `OrganizationChart` / compact hierarchy viewer | Beta+ experimental |
| `AfAccordion` | `Accordion` / `ion-accordion`, `ion-accordion-group` | Beta+ candidate |
| `AfDivider` | `Divider` or custom / custom tokenized divider | Beta+ candidate |
| `AfFieldset` | `Fieldset` / custom or Ionic section card | Beta+ candidate |
| `AfPanel` | `Panel` / custom or Ionic section card | Beta+ candidate |
| `AfScrollPanel` | `ScrollPanel` / native scroll container with mobile momentum | Beta+ candidate |
| `AfSplitter` | `Splitter` or CDK layout / mobile stacked fallback | Beta+ experimental |
| `AfStepper` | `Stepper` / custom card-flow or segment-flow | Beta+ high priority |
| `AfTabs` | `Tabs` / `ion-segment` or custom tabs | Beta+ high priority |
| `AfToolbar` | `Toolbar` / `ion-toolbar` or ArgFit toolbar | Beta+ candidate |
| `AfKanban` | Angular CDK DragDrop plus ArgFit/PrimeNG composition / Angular CDK DragDrop plus Ionic/ArgFit cards and accessible move fallback | Beta+ high priority |
| `AfFileUpload` | `FileUpload` / native file input plus optional Capacitor integration | Post-beta candidate |
| `AfActionSheet` | `Menu`, `SplitButton`, `SpeedDial` / `ion-action-sheet`, `ion-fab` | Post-beta candidate |

## Product Interpretation

Equivalent does not mean identical widget.

Examples:

- Desktop `AfDataTable` can be a PrimeNG-style table, but mobile `AfDataTable` should stay a prioritized list or cards.
- Desktop `AfDialog` can be a centered modal, but mobile `AfDialog` should prefer sheet/modal/alert patterns.
- Desktop `AfTooltip` can be hover/focus driven, but mobile should prefer tap help, popover or inline disclosure.
- Desktop `AfAutoComplete` can be an overlay input, but mobile should prefer searchbar plus modal/list.

The goal remains one ArgFit API with platform-appropriate behavior.
