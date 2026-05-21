# ArgFit UI - Beta+ Readiness Plan

## Target

Recommended target: `0.2.0-beta.0`.

Beta+ is the milestone after the base beta. It should not destabilize the base catalog; it should add the next small layer of reusable product primitives around overlays, status, identity and disclosure.

## Product Decision

Base beta focuses on trust: contract, accessibility, visual QA, consumer compatibility, performance and release gates.

Beta+ focuses on breadth with discipline:

- Add only components that unlock common app workflows.
- Keep desktop PrimeNG-first and mobile Ionic-first.
- Keep `@argfit-ui/adaptive` vendor-independent.
- Keep advanced enterprise features for productive or post-Beta+ unless they are required to validate the API.

## Beta+ Component Scope

Recommended Beta+ candidates:

- `AfPopover`
- `AfDrawer`
- `AfTooltip`
- `AfProgress`
- `AfAvatar`
- `AfChip`
- `AfAccordion`

Deferred to productive/post-Beta+:

- `AfAutocomplete`
- `AfDatePicker`
- `AfFileUpload`
- `AfSlider`
- `AfStepper`
- `AfTree`
- `AfVirtualList`
- `AfActionSheet`

## Backlog HU Beta+

1. [HU-027 - Beta+ Scope And Component Strategy](../hus/HU-027-beta-plus-scope-component-strategy.md)
2. [HU-028 - Beta+ Overlay Components](../hus/HU-028-beta-plus-overlay-components.md)
3. [HU-029 - Beta+ Status Identity And Disclosure Components](../hus/HU-029-beta-plus-status-identity-disclosure.md)
4. [HU-030 - Beta+ Showcase And Documentation](../hus/HU-030-beta-plus-showcase-docs.md)
5. [HU-031 - Beta+ Consumer And Visual Validation](../hus/HU-031-beta-plus-consumer-visual-validation.md)
6. [HU-032 - Beta+ Release Gate And Publish Channel](../hus/HU-032-beta-plus-release-gate.md)

## Definition Of Done

Beta+ is ready when:

- `docs/beta-plus/scope.md` defines the Beta+ contract.
- New components have adaptive, desktop and mobile implementations.
- New components have accessibility and keyboard tests.
- Showcase covers desktop/mobile, dark/light and core states.
- Consumer smoke validates Beta+ imports from generated packages.
- `pnpm release:beta-plus:check` passes locally and in CI.

