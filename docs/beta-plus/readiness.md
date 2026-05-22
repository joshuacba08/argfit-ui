# ArgFit UI - Beta+ Readiness Plan

## Target

Recommended target: `0.2.0-beta.0`.

Beta+ is the milestone after the base beta. It should not destabilize the base catalog; it should add the next layer of reusable product primitives around advanced forms, selection controls, data views, panel/layout, overlays, status, identity and one workflow-grade component.

## Product Decision

Base beta focuses on trust: contract, accessibility, visual QA, consumer compatibility, performance and release gates.

Beta+ focuses on breadth with discipline:

- Add only components that unlock common app workflows.
- Keep desktop PrimeNG-first and mobile Ionic-first.
- Keep `@argfit-ui/adaptive` vendor-independent.
- Use Angular CDK when the interaction model is stronger there than in PrimeNG/Ionic, especially for drag/drop.
- Keep file upload, calendar scheduling and terminal-style surfaces for productive or post-Beta+ unless they are required to validate the API.

The contract baseline for this milestone lives in:

- `docs/beta-plus/scope.md`
- `docs/beta-plus/public-api.md`
- `docs/beta/component-engine-map.md`

## Beta+ Component Scope

Recommended Beta+ candidates by family:

- Overlay: `AfPopover`, `AfDrawer`, `AfTooltip`.
- Status and identity: `AfProgress`, `AfAvatar`, `AfChip`.
- Forms: `AfAutoComplete`, `AfCascadeSelect`, `AfCheckbox`, `AfColorPicker`, `AfDatePicker`, `AfEditor`, `AfField`, `AfFloatLabel`, `AfIconField`, `AfIftaLabel`, `AfInputGroup`, `AfInputMask`, `AfInputNumber`, `AfInputCount`, `AfInputOtp`, `AfKeyFilter`, `AfKnob`, `AfListbox`, `AfMultiSelect`, `AfPassword`, `AfRadioGroup`, `AfRating`, `AfSelect`, `AfSegmentedControl`, `AfSlider`, `AfTextarea`, `AfToggle`, `AfToggleButton`, `AfTreeSelect`.
- Data: `AfDataView`, `AfPaginator`, `AfOrderList`, `AfPickList`, `AfTimeline`, `AfTree`, `AfTreeTable`, `AfVirtualScroller`, `AfOrganizationChart`.
- Panel and layout: `AfAccordion`, `AfCard`, `AfDivider`, `AfFieldset`, `AfPanel`, `AfScrollPanel`, `AfSplitter`, `AfStepper`, `AfTabs`, `AfToolbar`.
- Workflow: `AfKanban`.

Beta+ deliberately includes `AfKanban` because it validates a richer ArgFit-owned workflow surface: filters, cards, columns, drag/drop, keyboard movement and mobile fallback. It should remain controlled in scope and avoid becoming a full project-management suite.

Deferred beyond the intended Beta+ target:

- `AfFileUpload`
- `AfActionSheet`
- `AfCalendarScheduler`
- `AfVirtualKanban`
- `AfTerminal`

## Current Wave 1 Status

The first low-risk/high-reuse Beta+ wave is now implemented in the repository:

- `AfPopover`
- `AfDrawer`
- `AfTooltip`
- `AfProgress`
- `AfAvatar`
- `AfChip`

Current validation completed for that wave:

- focused adaptive specs for `AfPopover` and `AfDrawer`
- full `argfit-ui-adaptive` unit suite
- showcase application spec covering the preserved `alpha` beta-consumer slot
- `pnpm guard:architecture`

## Current Wave 2 Status

The next Beta+ wave now includes these implemented slices:

- `AfInputCount`
- `AfMultiSelect`
- `AfDatePicker`
- `AfListbox`
- `AfField`
- `AfIconField`
- `AfInputGroup`

Current validation completed for the implemented wave 2 slices:

- focused adaptive spec for `AfInputCount`
- focused adaptive spec for `AfMultiSelect`
- focused adaptive spec for `AfDatePicker`
- focused adaptive spec for `AfField` composition helpers
- focused adaptive spec for `AfListbox`
- showcase application spec extended for the current wave 2 surfaces in the preserved `alpha` slot

`AfTreeSelect`, `AfAutoComplete` and the remaining advanced form backlog still need later Beta+ slices.

## Backlog HU Beta+

1. [HU-027 - Beta+ Scope And Component Strategy](../hus/HU-027-beta-plus-scope-component-strategy.md)
2. [HU-028 - Beta+ Overlay Components](../hus/HU-028-beta-plus-overlay-components.md)
3. [HU-029 - Beta+ Status Identity And Disclosure Components](../hus/HU-029-beta-plus-status-identity-disclosure.md)
4. [HU-030 - Beta+ Form Field And Input Components](../hus/HU-030-beta-plus-form-field-input-components.md)
5. [HU-031 - Beta+ Selection And Advanced Form Components](../hus/HU-031-beta-plus-selection-form-components.md)
6. [HU-032 - Beta+ Data Components Suite](../hus/HU-032-beta-plus-data-components-suite.md)
7. [HU-033 - Beta+ Panel And Layout Components](../hus/HU-033-beta-plus-panel-layout-components.md)
8. [HU-034 - Beta+ Kanban Workflow Board](../hus/HU-034-beta-plus-kanban-workflow-board.md)
9. [HU-035 - Beta+ Showcase And Documentation](../hus/HU-035-beta-plus-showcase-docs.md)
10. [HU-036 - Beta+ Consumer And Visual Validation](../hus/HU-036-beta-plus-consumer-visual-validation.md)
11. [HU-037 - Beta+ Release Gate And Publish Channel](../hus/HU-037-beta-plus-release-gate.md)

## Definition Of Done

Beta+ is ready when:

- `docs/beta-plus/scope.md` defines the Beta+ contract.
- New components have adaptive, desktop and mobile implementations.
- New components have accessibility and keyboard tests.
- `AfMultiSelect`, `AfDatePicker`, `AfTreeSelect`, `AfDataView`, `AfPaginator`, `AfTabs` and `AfStepper` are covered by showcase and consumer smoke.
- `AfKanban` supports drag/drop plus non-drag keyboard/fallback movement.
- Showcase covers desktop/mobile, dark/light and core states.
- Consumer smoke validates Beta+ imports from generated packages.
- `pnpm release:beta-plus:check` passes locally and in CI.
