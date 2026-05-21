# ArgFit UI - Component Engine Map

## Decision

ArgFit UI should not mirror PrimeNG one-to-one. PrimeNG and Ionic are rendering engines, not the public product API.

Default policy:

- Desktop renderer: PrimeNG-first.
- Mobile renderer: Ionic-first.
- Adaptive package: ArgFit-owned API only.
- PrimeNG in mobile is allowed only as an internal exception when it improves delivery without hurting touch UX, accessibility, bundle size or platform feel.

The public contract remains:

```ts
import { AfButton, AfDataTable, AfDialog } from '@argfit-ui/adaptive';
```

Consumers should not need to know whether the renderer is PrimeNG, Ionic, ECharts or custom ArgFit code.

## Mobile PrimeNG Exception Rule

PrimeNG may be used inside `argfit-ui-mobile` only when all conditions below are true:

- Ionic has no strong equivalent for the behavior.
- The interaction does not depend on delicate mobile gestures, safe areas or native-feeling overlays.
- The component still feels touch-first, not like a desktop widget squeezed into a phone.
- The public API does not expose PrimeNG symbols, types, CSS classes or event shapes.
- The bundle impact is measured and acceptable.
- Accessibility and keyboard/touch behavior are validated.

Examples where PrimeNG mobile is usually not recommended:

- Dense table rendering on phones.
- Desktop-style dropdowns.
- Desktop dialogs instead of mobile sheets/modals.
- Tooltip-heavy interactions.
- Complex desktop menus.

Examples where PrimeNG mobile can be considered:

- Simple status or display components if they do not leak vendor API.
- Utility components without mobile-specific interaction complexity.
- Tablet/large-screen mobile renderers where the UX is intentionally desktop-like.

## Priority Matrix

| Priority | ArgFit API | PrimeNG desktop engine | Ionic mobile engine | Recommendation |
| --- | --- | --- | --- | --- |
| High | `AfButton` | `Button` | `ion-button` | Existing beta core candidate |
| High | `AfInput` | `InputText`, `IconField`, `InputGroup` | `ion-input`, `ion-searchbar` | Existing beta core candidate |
| High | `AfTextarea` | `Textarea` | `ion-textarea` | Existing beta candidate |
| High | `AfPassword` | `Password` | `ion-input`, `ion-input-password-toggle` | Existing beta candidate |
| High | `AfSelect` | `Select` | `ion-select` | Existing beta candidate |
| High | `AfMultiSelect` | `MultiSelect` | `ion-select` with multiple or modal list | Post-beta candidate |
| High | `AfCheckbox` | `Checkbox` | `ion-checkbox` | Existing beta candidate |
| High | `AfRadioGroup` | `RadioButton` | `ion-radio-group`, `ion-radio` | Existing beta candidate |
| High | `AfToggle` | `ToggleSwitch` | `ion-toggle` | Existing beta candidate |
| High | `AfSegmentedControl` | `SelectButton` | `ion-segment`, `ion-segment-button` | Existing beta candidate |
| High | `AfDialog` | `Dialog`, `ConfirmDialog` | `ion-modal`, `ion-alert` | Existing beta core candidate |
| High | `AfToast`, `AfInlineMessage` | `Toast`, `Message` | `ion-toast` plus custom inline message | Existing beta candidate |
| High | `AfBadge` | `Badge`, `Tag`, parts of `Chip` | `ion-badge`, `ion-chip` | Existing beta core candidate |
| High | `AfCard` | `Card`, `Panel` | `ion-card` | Existing beta core candidate |
| High | `AfDataTable` | `Table`, `Paginator` | `ion-list`, `ion-item`, `ion-infinite-scroll`, `ion-refresher` or custom list | Existing beta candidate; mobile must not force horizontal table |
| High | `AfPageShell` | `Menu`, `Menubar`, `Breadcrumb`, `Toolbar`, `Drawer` | `ion-menu`, `ion-split-pane`, `ion-tabs`, `ion-toolbar` | Existing beta core candidate |
| Medium | `AfPopover` | `Popover`, `ConfirmPopup` | `ion-popover` | Beta+ candidate |
| Medium | `AfDrawer` | `Drawer` | `ion-menu` or `ion-modal` sheet | Beta+ candidate |
| Medium | `AfTooltip` | `Tooltip` | Custom help popover/sheet | Desktop-first, mobile carefully scoped |
| Medium | `AfAutocomplete` | `AutoComplete` | `ion-searchbar` plus modal/list/popover | Post-beta candidate |
| Medium | `AfDatePicker` | `DatePicker` | `ion-datetime`, `ion-datetime-button`, `ion-picker` | Post-beta candidate |
| Medium | `AfFileUpload` | `FileUpload` | Native file input plus optional Capacitor integration | Post-beta candidate |
| Medium | `AfProgress` | `ProgressBar`, `ProgressSpinner`, `Skeleton` | `ion-progress-bar`, `ion-spinner`, `ion-skeleton-text`, `ion-loading` | Beta+ candidate |
| Medium | `AfAvatar` | `Avatar` | `ion-avatar` | Beta+ candidate |
| Medium | `AfChip` | `Chip`, `Tag` | `ion-chip` | Beta+ candidate |
| Medium | `AfAccordion` | `Accordion` | `ion-accordion`, `ion-accordion-group` | Beta+ candidate |
| Low | `AfSlider` | `Slider`, `Knob` | `ion-range` | Post-beta candidate |
| Low | `AfTabs` | `Tabs` | `ion-tabs` or `ion-segment` | Usually covered by shell/segment |
| Low | `AfStepper` | `Stepper` | Custom mobile flow with segment/cards | Post-beta candidate |
| Low | `AfTree` | `Tree`, `TreeSelect`, `TreeTable` | Custom list/tree pattern | Enterprise advanced |
| Low | `AfVirtualList` | `VirtualScroller`, table virtualization | Custom/CDK strategy | Enterprise advanced |
| Low | `AfActionSheet` | `Menu`, `SplitButton`, `SpeedDial` | `ion-action-sheet`, `ion-fab` | Mobile-first, post-beta candidate |
| Not core | `AfCarousel`, `AfGallery`, `AfImageCompare`, `AfOrganizationChart`, `AfTerminal`, `AfDock`, `AfMegaMenu` | PrimeNG specialized components | Partial or no Ionic equivalent | Not recommended for beta core |

## Product Interpretation

For ArgFit, equivalent does not always mean same widget.

Examples:

- Desktop `AfDataTable` can be a PrimeNG-style table, but mobile `AfDataTable` should become a prioritized list or cards.
- Desktop `AfDialog` can be a centered modal, but mobile `AfDialog` should become a sheet/modal/alert pattern.
- Desktop `AfTooltip` can be hover/focus driven, but mobile should prefer tap help, popover or inline disclosure.
- Desktop `AfAutocomplete` can be an overlay input, but mobile should prefer searchbar plus modal/list.

The goal is one ArgFit API with platform-appropriate behavior.

