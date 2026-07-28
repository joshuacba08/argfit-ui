# Productive Enterprise Readiness

This document defines the enterprise-oriented production posture for the frozen `1.0.0` ArgFit UI surface.

It does not expand the `1.0.0` API. It explains how to operate the already exported `1.0-*` contract from `docs/productive/scope.md`, `docs/productive/public-api.md` and `docs/productive/quality-gates.md` in data-heavy, form-heavy and feedback-heavy application flows.

## Baseline Posture

- Prefer `@argfit-ui/adaptive` for application code and treat renderer packages as an explicit infrastructure-level choice.
- Keep all `@argfit-ui/*` packages on the same released version.
- Treat this document as production guidance for the current public barrels, not as approval for backlog features that remain `out-of-1.0`.
- Validate enterprise-facing releases through `pnpm release:production:check` and keep `pnpm test:all` green while developing large interaction flows.

## Data Table Production Profile

Included in the `1.0.0` profile:

- declarative columns with alignment, width hints and mobile priority
- adaptive sorting, density, row selection and pagination
- custom cell templates and expanded-row templates
- keyboard row activation and sortable-header semantics already covered by the accessibility gate
- adaptive desktop-table and mobile-list rendering through the same public contract

Production usage guidance:

- Prefer server-side pagination once a screen moves beyond low-thousands row counts. `AfDataTable` is a presentation contract, not a remote query engine.
- Keep page sizes bounded. The safe default is a business page, not an infinite scroller.
- Use `mobilePriority` and concise value labels so the mobile renderer can stay list-first instead of trying to mirror a dense desktop grid.
- Keep expanded rows summary-oriented. Heavy nested layouts should route to a details page, dialog or drawer instead of inflating each table row.
- Pre-format expensive cell values before rendering. Do not push repeated parsing, aggregation or localization work into every cell template pass.

Not included in the `1.0.0` profile:

- built-in row virtualization or windowing
- pinned, frozen, reordered or resizable columns
- spreadsheet-style inline editing
- built-in server query orchestration, filtering DSLs or saved views

Accessibility and performance caveats:

- Row activation must stay keyboard reachable with `Enter` and `Space`.
- Sort state must remain explicit and should not depend on visual arrows alone.
- Mobile should degrade to a readable list experience instead of preserving all desktop columns.

## Forms Production Profile

Included in the `1.0.0` profile:

- adaptive field composition with ArgFit-owned label, hint and error states
- core input, password, date, listbox and multi-select flows already exported in the frozen public barrels
- validation state projection through the public `default`, `error` and `success` state families
- desktop and mobile renderers that preserve the same semantic API while adapting interaction shape

Production usage guidance:

- Let the application own business validation, async validation and submit orchestration. ArgFit provides field surfaces, not a schema-driven form engine.
- Use one primary label strategy per form section. `stacked` remains the safest default for dense enterprise forms; `float` and `ifta` should be reserved for flows that are visually simpler and already QA'd on mobile.
- Keep error text local to the field and use inline feedback for blocking validation, not transient toasts.
- Prefer drawer, sheet or fullscreen presentation for dense mobile edit flows instead of forcing many small overlays.
- For large option sets, pair form controls with server-driven search or bounded option groups. Do not assume a control can replace remote lookup or taxonomy management on its own.

Not included in the `1.0.0` profile:

- schema-driven form generation
- built-in async validation orchestration or draft persistence
- backlog controls that remain outside the current `1.3.1` scope, such as `AfAutoComplete`, `AfInputMask`, `AfInputNumber`, `AfInputOtp` and `AfRating`

Accessibility caveats:

- Label, hint and error relationships must stay synchronized with the underlying control.
- Reveal, clear and dismiss actions must remain native-button reachable.
- Mobile flows should avoid hover-only help or cramped touch targets.

## Overlay And Feedback Orchestration

Use the overlay surfaces by intent:

- `AfDialog` for blocking confirmation, focused editing and high-risk actions
- `AfDrawer` for secondary task panels, progressive detail and mobile-first editing flows
- `AfPopover` and `AfTooltip` for lightweight contextual disclosure only
- `AfToastViewport` and `AfToastService` for transient post-action feedback
- `AfInlineMessage` for persistent local status, warnings and validation context

Production usage guidance:

- Keep a single app-level overlay posture. Teams should centralize placement, z-order and escape-dismiss expectations instead of letting each feature invent its own rules.
- Do not stack multiple blocking overlays in the same task path.
- On mobile, prefer `sheet` or `fullscreen` dialog presentation and `bottom` or edge drawers for dense flows.
- Critical information must not live only inside tooltips or hover-triggered disclosure.
- Toasts should confirm completed actions or background status changes. They should not carry the only copy of a blocking validation or recovery instruction.
- Inline messages are the correct default for form-local errors, risk warnings and persistent empty-state guidance.

Not included in the `1.0.0` profile:

- a built-in global notification center or inbox
- persisted toast history, cross-tab sync or delivery guarantees
- a public overlay stacking manager beyond the documented component behavior

Accessibility caveats:

- Dialogs must preserve focus trapping, `Escape` behavior and focus return.
- Severity-driven live-region semantics should stay aligned with the existing toast and inline-message contract.
- Non-drag alternatives remain mandatory where a workflow surface also offers drag interaction.

## Chart Production Profile

Included in the `1.0.0` profile:

- semantic chart kinds already exported through the public chart contract, including line, area, bar, stacked bar, horizontal bar, sparkline, donut, gauge, radar, heatmap, boxplot and parallel
- ArgFit-owned series, point and indicator types instead of vendor chart signatures
- configurable density, legend, grid and interactivity decisions in the renderer implementations
- loading, empty and interaction states already exercised by showcase and regression coverage

Production usage guidance:

- Treat charts as summary and decision-support surfaces, not as a full BI authoring layer.
- Pre-aggregate server-side for heatmap, boxplot, radar and parallel scenarios. The UI should render prepared insight, not compute raw warehouse-scale statistics in the browser.
- Keep the number of simultaneous series and categories deliberate. When a chart stops being legible, split the view instead of adding more legend burden.
- Provide a textual summary, metric card or table companion when the chart carries business-critical meaning.
- Disable or minimize interactive affordances when the chart is decorative or purely supportive.

Not included in the `1.0.0` profile:

- built-in drilldown orchestration, pivot builders or saved analytic workspaces
- real-time streaming dashboards with guaranteed high-frequency updates
- chart-specific query modeling or server aggregation helpers

Accessibility caveats:

- Charts are not the primary keyboard interaction path for a workflow.
- Loading and empty states must remain explicit.
- Important conclusions should never depend only on color or pointer hover.

## Enterprise Non-Goals For 1.0.0

This productive profile does not promote backlog names or advanced enterprise widgets that are still outside the public barrels. If a team needs capabilities such as tree select, autocomplete, input masking, file upload, scheduler workflows or virtualized kanban, those remain later-scope decisions rather than part of the `1.0.0` support promise.
