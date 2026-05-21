# ArgFit UI — Roadmap

# Purpose

This document defines the long-term roadmap of ArgFit UI.

The roadmap exists to provide:

- Direction
- Priorities
- Architectural sequencing
- Agent alignment
- Product vision

This roadmap should guide future HUs and implementation phases.

---

# Vision

ArgFit UI aims to become:

- A reusable adaptive Angular UI platform
- A professional enterprise design system
- A monetizable UI ecosystem
- A premium dashboard/block system
- A public engineering portfolio

The system should support:

- Desktop applications
- Mobile applications
- Adaptive rendering
- Enterprise dashboards
- SaaS products
- Analytics platforms

---

# Current Stack

## Core Technologies

- Angular 21+
- Standalone APIs
- Signals
- TailwindCSS
- PrimeNG
- Ionic Angular
- Lucide icons
- ECharts

---

# Architectural Layers

```txt id="jlwm9i"
argfit-ui-core
argfit-ui-primitives
argfit-ui-desktop
argfit-ui-mobile
argfit-ui-adaptive
showcase
```

# Development Philosophy

The roadmap prioritizes:

1. Foundations first
2. Architecture before components
3. Tokens before styling
4. Consistency before feature quantity
5. Reusability before customization
6. Adaptive architecture before advanced UX

---

# Phase 0 — Workspace Foundation

# Goal

Create the foundational architecture.

## Status

COMPLETED

---

## Tasks

- Create Angular workspace
- Install PrimeNG
- Install Ionic Angular
- Configure TailwindCSS
- Create core library
- Create primitives library
- Create desktop library
- Create mobile library
- Create adaptive library
- Create showcase app
- Create architectural documentation

---

# Phase 1 — Core System

# Goal

Build the shared foundation.

## Status

COMPLETE

## Planned Systems

### Design Tokens

- Colors — initial slice complete
- Typography — initial slice complete
- Radius — initial slice complete
- Spacing — initial slice complete
- Elevation — initial slice complete
- Motion — initial slice complete
- Breakpoints — initial slice complete
- HU-001 — [Formalizar tokens del design system](./hus/HU-001-design-tokens.md) — ready for implementation

---

### Theme System

- CSS variable architecture — initial slice complete
- Dark theme — initial slice complete
- Theme switching
- Theme service — initial slice complete
- HU-002 — [Theme runtime y estilos base](./hus/HU-002-theme-runtime-base-styles.md) — ready for implementation

---

### Platform System

- AfPlatformService — initial slice complete
- Desktop detection — initial slice complete
- Mobile detection — initial slice complete
- Adaptive helpers — initial slice complete

---

### Utilities

- Shared utilities
- Shared types
- Responsive helpers
- HU-007 — [Icon and chart foundations](./hus/HU-007-icon-chart-foundations.md) — ready for implementation

---

# Phase 2 — Primitive Foundation

# Goal

Create vendor-agnostic building blocks that higher-level components can compose.

## Status

IN PROGRESS

## Planned Primitives

- AfVisuallyHiddenComponent — initial slice complete
- HU-003 — [Accessibility primitives](./hus/HU-003-accessibility-primitives.md) — ready for implementation
- HU-007 — [Icon and chart foundations](./hus/HU-007-icon-chart-foundations.md) — ready for implementation
- AfIcon
- Focus management helpers
- Disclosure primitives
- Portal/overlay foundations
- Shared loading and status primitives

Primitive code may depend on `@argfit-ui/core`, but must not depend on PrimeNG, Ionic, desktop, mobile, or adaptive packages.

---

# Phase 3 — Desktop Foundation

# Goal

Create desktop-oriented rendering.

## Planned Components

### Base Components

- AfButtonDesktop — initial slice complete
- HU-004 — [AfCard vertical slice](./hus/HU-004-af-card.md) — ready for implementation
- AfCardDesktop
- HU-005 — [AfInput vertical slice](./hus/HU-005-af-input.md) — ready for implementation
- AfInputDesktop
- HU-006 — [AfDialog vertical slice](./hus/HU-006-af-dialog.md) — ready for implementation
- AfDialogDesktop
- HU-008 — [AfBadge vertical slice](./hus/HU-008-af-badge.md) — ready for implementation
- AfBadgeDesktop
- HU-013 — [AfFormControls expansion slice](./hus/HU-013-af-form-controls.md) — ready for implementation
- AfSelectDesktop
- AfTextareaDesktop
- AfToggleDesktop
- AfCheckboxDesktop
- AfRadioGroupDesktop
- AfSegmentedControlDesktop

---

### Layout Components

- HU-009 — [AfPageShell navigation slice](./hus/HU-009-af-page-shell.md) — ready for implementation
- AfSidebarDesktop
- AfTopbarDesktop
- AfPageShellDesktop
- AfGridDesktop

---

### Data Components

- HU-010 — [AfMetricCard vertical slice](./hus/HU-010-af-metric-card.md) — ready for implementation
- AfMetricCardDesktop
- HU-012 — [AfAnalyticsCard vertical slice](./hus/HU-012-af-analytics-card.md) — ready for implementation
- AfAnalyticsCardDesktop
- HU-011 — [AfDataTable vertical slice](./hus/HU-011-af-data-table.md) — ready for implementation
- AfDataTableDesktop

---

### Feedback Components

- HU-014 — [AfFeedback toast slice](./hus/HU-014-af-feedback-toast.md) — ready for implementation
- AfToastDesktop
- AfToastViewportDesktop
- AfInlineMessageDesktop

---

# Phase 4 — Mobile Foundation

# Goal

Create mobile-native rendering.

## Planned Components

### Base Components

- AfButtonMobile — initial slice complete
- AfCardMobile
- AfInputMobile
- AfModalMobile
- HU-008 — [AfBadge vertical slice](./hus/HU-008-af-badge.md) — ready for implementation
- AfBadgeMobile
- HU-013 — [AfFormControls expansion slice](./hus/HU-013-af-form-controls.md) — ready for implementation
- AfSelectMobile
- AfTextareaMobile
- AfToggleMobile
- AfCheckboxMobile
- AfRadioGroupMobile
- AfSegmentedControlMobile

---

### Navigation Components

- HU-009 — [AfPageShell navigation slice](./hus/HU-009-af-page-shell.md) — ready for implementation
- AfBottomTabsMobile
- AfMobileHeader
- AfMobileShell

---

### Data Components

- HU-010 — [AfMetricCard vertical slice](./hus/HU-010-af-metric-card.md) — ready for implementation
- AfMetricCardMobile
- HU-012 — [AfAnalyticsCard vertical slice](./hus/HU-012-af-analytics-card.md) — ready for implementation
- AfAnalyticsCardMobile
- HU-011 — [AfDataTable vertical slice](./hus/HU-011-af-data-table.md) — ready for implementation
- AfMobileList

---

### Feedback Components

- HU-014 — [AfFeedback toast slice](./hus/HU-014-af-feedback-toast.md) — ready for implementation
- AfToastMobile
- AfToastViewportMobile
- AfInlineMessageMobile

---

# Phase 5 — Adaptive Layer

# Goal

Expose unified adaptive APIs.

## Planned Components

- AfButton — initial slice complete
- AfCard
- AfInput
- AfDialog
- AfChart
- AfBadge
- HU-009 — [AfPageShell navigation slice](./hus/HU-009-af-page-shell.md) — ready for implementation
- AfPageShell
- AfSidebar
- HU-010 — [AfMetricCard vertical slice](./hus/HU-010-af-metric-card.md) — ready for implementation
- AfMetricCard
- HU-011 — [AfDataTable vertical slice](./hus/HU-011-af-data-table.md) — ready for implementation
- AfDataTable
- HU-012 — [AfAnalyticsCard vertical slice](./hus/HU-012-af-analytics-card.md) — ready for implementation
- AfAnalyticsCard
- HU-013 — [AfFormControls expansion slice](./hus/HU-013-af-form-controls.md) — ready for implementation
- AfSelect
- AfTextarea
- AfToggle
- AfCheckbox
- AfRadioGroup
- AfSegmentedControl
- HU-014 — [AfFeedback toast slice](./hus/HU-014-af-feedback-toast.md) — ready for implementation
- AfToastViewport
- AfInlineMessage

---

# Adaptive Goals

Adaptive components should:

- Detect platform
- Delegate rendering
- Remain lightweight
- Expose stable APIs

---

# Phase 6 — Showcase Platform

# Goal

Transform showcase into:

- Documentation platform
- Portfolio platform
- Demo environment

---

## Planned Features

- Component gallery
- Theme preview
- Adaptive demos
- Responsive playground
- Code examples
- Documentation pages
- HU-017 — [Alpha consumer docs and showcase](./hus/HU-017-alpha-consumer-docs-showcase.md) — ready for implementation

---

# Phase 7 — Enterprise Systems

# Goal

Build advanced enterprise features.

## Planned Systems

- HU-007 — [Icon and chart foundations](./hus/HU-007-icon-chart-foundations.md) — ready for implementation
- Data visualization components
- HU-010 — [AfMetricCard vertical slice](./hus/HU-010-af-metric-card.md) — ready for implementation
- Dashboard blocks
- HU-011 — [AfDataTable vertical slice](./hus/HU-011-af-data-table.md) — ready for implementation
- Advanced tables
- HU-012 — [AfAnalyticsCard vertical slice](./hus/HU-012-af-analytics-card.md) — ready for implementation
- Analytics widgets
- HU-013 — [AfFormControls expansion slice](./hus/HU-013-af-form-controls.md) — ready for implementation
- Complex forms
- HU-014 — [AfFeedback toast slice](./hus/HU-014-af-feedback-toast.md) — ready for implementation
- Feedback systems
- Entity management systems

---

# Phase 8 — Premium Ecosystem

# Goal

Monetization layer.

---

## Planned Products

### Premium Themes

- Trading theme
- Healthcare theme
- Analytics theme
- Corporate theme

---

### Premium Blocks

- CRM blocks
- ERP blocks
- Analytics blocks
- Monitoring blocks

---

### Premium Templates

- Admin dashboard
- SaaS shell
- Analytics platform
- Mobile starter

---

# Phase 9 — Tooling

# Goal

Developer productivity systems.

---

## Planned Systems

- Storybook integration
- CLI generators
- Visual regression testing
- Figma token sync
- Theme builder
- Design token pipelines
- HU-016 — [Alpha packaging and versioning](./hus/HU-016-alpha-packaging-versioning.md) — ready for implementation
- HU-018 — [Alpha release gate and CI](./hus/HU-018-alpha-release-gate-ci.md) — ready for implementation

---

# Phase 10 — Alpha Distribution

# Goal

Prepare and ship the first installable `0.1.0-alpha.0` version of ArgFit UI.

## Planned Systems

- HU-015 — [Alpha public API scope](./hus/HU-015-alpha-public-api-scope.md) — ready for implementation
- HU-016 — [Alpha packaging and versioning](./hus/HU-016-alpha-packaging-versioning.md) — ready for implementation
- HU-017 — [Alpha consumer docs and showcase](./hus/HU-017-alpha-consumer-docs-showcase.md) — ready for implementation
- HU-018 — [Alpha release gate and CI](./hus/HU-018-alpha-release-gate-ci.md) — ready for implementation

## Alpha Definition

The alpha is ready when:

- The public API surface is documented.
- Package metadata and prerelease versions are aligned.
- Consumer documentation exists.
- Build, tests, architecture guard, pack dry-run, and smoke checks pass.
- Publishing can be done manually with a documented checklist.

---

# Phase 11 — Beta Hardening

# Goal

Convert the healthy alpha into a reliable `0.1.0-beta.0` prerelease.

## Status

IN PROGRESS

## Current Evaluation

The beta hardening baseline is now materially stronger than the original alpha gate. In addition to architecture, build, tests, packaging and alpha smoke, the repo now has:

- `docs/beta/quickstart.md`, `docs/beta/components.md`, `docs/beta/theming.md` and `docs/beta/known-limitations.md`, plus README and showcase links aligned to beta;
- `docs/beta/visual-qa.md` and a reproducible `pnpm visual:beta` smoke;
- `docs/beta/compatibility.md` and `docs/beta/package-matrix.md` backed by `pnpm beta:consumer-smoke`;
- `docs/beta/performance.md` and `pnpm measure:beta-performance` with a documented showcase budget decision;
- `pnpm release:beta:check` passing locally;
- `.github/workflows/publish-beta.yml`, `docs/beta/release-notes-beta.md` and `docs/beta/release-checklist.md` closing the dedicated beta release channel.

Phase 11 is now complete for `0.1.0-beta.0`.

What remains is no longer beta-hardening baseline work; it is future product scope work:

- experimental surfaces can stay `experimental-in-beta` or be promoted in later prereleases;
- Beta+ decides the next controlled catalog expansion.

See [Beta readiness evaluation](./beta/readiness.md).

## Planned HUs

- HU-019 — [Beta Scope And Public API Contract](./hus/HU-019-beta-scope-public-api-contract.md)
- HU-020 — [Beta Experimental Components Hardening](./hus/HU-020-beta-experimental-components-hardening.md)
- HU-021 — [Beta Accessibility And Keyboard Audit](./hus/HU-021-beta-accessibility-keyboard-audit.md)
- HU-022 — [Beta Visual Regression And Responsive QA](./hus/HU-022-beta-visual-regression-responsive-qa.md)
- HU-023 — [Beta Consumer Compatibility Matrix](./hus/HU-023-beta-consumer-compatibility-matrix.md)
- HU-024 — [Beta Performance And Bundle Budget](./hus/HU-024-beta-performance-bundle-budget.md)
- HU-025 — [Beta Docs, API Reference And Migration](./hus/HU-025-beta-docs-api-reference-migration.md)
- HU-026 — [Beta Release Gate And Publish Channel](./hus/HU-026-beta-release-gate-publish-channel.md)

## Beta Definition

The beta is ready when:

- `docs/beta/beta-scope.md` defines the beta contract.
- `docs/beta/public-api.md` classifies every public export.
- `docs/beta/component-engine-map.md` defines PrimeNG/Ionic/custom renderer decisions.
- Promoted components have contract, accessibility and parity tests.
- Visual QA is reproducible.
- Consumer smoke validates generated packages from a temporary external app.
- `pnpm build:all` has no unresolved budget warnings.
- `pnpm release:beta:check` passes locally and in CI.
- Publishing uses the `beta` dist-tag.

---

# Phase 12 — Beta+ Component Expansion

# Goal

Ship a controlled `0.2.0-beta.0` expansion after the base beta is reliable.

## Status

PLANNED

## Scope

Beta+ adds a broad but controlled expansion for advanced interfaces:

- Forms: autocomplete, cascade select, checkbox, color picker, date picker, editor, field wrappers, input group, masks, number/count, OTP, key filter, knob, listbox, multiselect, password, radio, rating, select, segmented control, slider, textarea, toggles and tree select.
- Data: data view, paginator, order list, pick list, timeline, tree, tree table, virtual scroller and organization chart.
- Panel/layout: accordion, card integration, divider, fieldset, panel, scroll panel, splitter, stepper, tabs and toolbar.
- Workflow: `AfKanban` with CDK drag/drop and accessible movement fallback.
- Supporting primitives: overlays, progress, avatar and chip.

See [Beta+ readiness plan](./beta-plus/readiness.md).

The Beta+ contract is defined by [Beta+ scope](./beta-plus/scope.md), [Beta+ public API inventory](./beta-plus/public-api.md) and the shared [component engine map](./beta/component-engine-map.md).

## Planned HUs

- HU-027 — [Beta+ Scope And Component Strategy](./hus/HU-027-beta-plus-scope-component-strategy.md)
- HU-028 — [Beta+ Overlay Components](./hus/HU-028-beta-plus-overlay-components.md)
- HU-029 — [Beta+ Status Identity And Disclosure Components](./hus/HU-029-beta-plus-status-identity-disclosure.md)
- HU-030 — [Beta+ Form Field And Input Components](./hus/HU-030-beta-plus-form-field-input-components.md)
- HU-031 — [Beta+ Selection And Advanced Form Components](./hus/HU-031-beta-plus-selection-form-components.md)
- HU-032 — [Beta+ Data Components Suite](./hus/HU-032-beta-plus-data-components-suite.md)
- HU-033 — [Beta+ Panel And Layout Components](./hus/HU-033-beta-plus-panel-layout-components.md)
- HU-034 — [Beta+ Kanban Workflow Board](./hus/HU-034-beta-plus-kanban-workflow-board.md)
- HU-035 — [Beta+ Showcase And Documentation](./hus/HU-035-beta-plus-showcase-docs.md)
- HU-036 — [Beta+ Consumer And Visual Validation](./hus/HU-036-beta-plus-consumer-visual-validation.md)
- HU-037 — [Beta+ Release Gate And Publish Channel](./hus/HU-037-beta-plus-release-gate.md)

---

# Phase 13 — Productive 1.0

# Goal

Turn the beta/Beta+ platform into a production-ready `1.0.0` release.

## Status

PLANNED

## Scope

The productive version focuses on API freeze, semver, mandatory quality gates, enterprise readiness, documentation and release operations.

See [Productive version projection](./productive/projection.md).

## Planned HUs

- HU-038 — [Productive Scope And Semver Freeze](./hus/HU-038-productive-scope-semver-freeze.md)
- HU-039 — [Productive Quality Gates](./hus/HU-039-productive-quality-gates.md)
- HU-040 — [Productive Enterprise Readiness](./hus/HU-040-productive-enterprise-readiness.md)
- HU-041 — [Productive Documentation Site](./hus/HU-041-productive-documentation-site.md)
- HU-042 — [Productive Release Operations And Support Policy](./hus/HU-042-productive-release-operations-support.md)
- HU-043 — [Production 1.0 Release Gate](./hus/HU-043-production-1-release-gate.md)

## Productive Definition

The productive version is ready when:

- The public API is frozen for `1.0.0`.
- Semver, deprecation and support policies are documented.
- Visual, accessibility, consumer, performance and release gates are mandatory.
- Docs are complete enough for a team with no repo context.
- Publishing uses the npm `latest` dist-tag.

---

# Long-Term Vision

ArgFit UI should evolve into:

- A recognizable Angular ecosystem
- A professional adaptive UI platform
- A scalable design system
- A monetizable UI product
- A public engineering showcase

---

# Strategic Principles

Future decisions should prioritize:

- Maintainability
- Simplicity
- Reusability
- Adaptive architecture
- Stable APIs
- Vendor abstraction
- Long-term scalability

---

# Important Reminder

ArgFit UI is NOT:

- A PrimeNG skin
- An Ionic wrapper collection
- A random component library

ArgFit UI is an adaptive UI platform with its own identity and architecture.
