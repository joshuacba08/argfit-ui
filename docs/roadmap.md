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

IN PROGRESS

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
- AfAnalyticsCardDesktop
- HU-011 — [AfDataTable vertical slice](./hus/HU-011-af-data-table.md) — ready for implementation
- AfDataTableDesktop

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
- AfAnalyticsCardMobile
- HU-011 — [AfDataTable vertical slice](./hus/HU-011-af-data-table.md) — ready for implementation
- AfMobileList

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
- Analytics widgets
- Complex forms
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
