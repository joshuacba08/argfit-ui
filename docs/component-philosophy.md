# ArgFit UI — Component Philosophy

# Purpose

This document defines the philosophy behind component design in ArgFit UI.

The goal is to ensure:

- Consistency
- Scalability
- Reusability
- Adaptive rendering
- Stable APIs
- Long-term maintainability

This document applies to:

- Human contributors
- AI agents
- Copilot
- Claude
- GPT-based coding assistants

---

# Core Philosophy

ArgFit UI components represent:

- Product concepts
- User intentions
- UI behaviors

They DO NOT represent vendor implementations.

GOOD:

- `AfButton`
- `AfMetricCard`
- `AfPageShell`
- `AfSidebar`
- `AfNavigationItem`

BAD:

- `AfPrimeButton`
- `AfIonButton`
- `AfPrimeWrapper`
- `AfIonicCard`

---

# Adaptive Philosophy

The system is adaptive by design.

A component should expose a unified API while internally rendering platform-specific implementations.

Example:

```html id="zkx0ka"
<af-button variant="primary"> Save </af-button>
```

Internally:

- Desktop → PrimeNG implementation
- Mobile → Ionic implementation

Consumers should not care about rendering engines.

---

# Semantic Components

Components should represent semantic meaning.

GOOD:

- `AfPageShell`
- `AfAnalyticsCard`
- `AfEmptyState`
- `AfSectionHeader`

BAD:

- `AfBlueCard`
- `AfLargeContainer`
- `AfShadowBox`

Never encode visual appearance into component naming.

---

# Component Responsibilities

Each component should have:

- One clear responsibility
- One clear rendering purpose
- One clear API

Avoid giant multi-purpose components.

---

# Composition Over Inheritance

Prefer:

- Composition
- Small reusable pieces
- Slots/content projection
- Shared utilities

Avoid:

- Deep inheritance trees
- Base UI classes
- Over-abstracted hierarchies

---

# Public API Stability

Public APIs are part of the product contract.

Avoid breaking changes whenever possible.

Public APIs should remain:

- Predictable
- Typed
- Stable
- Minimal

---

# Component API Philosophy

Component APIs should feel:

- Natural
- Semantic
- Predictable

GOOD:

```
<af-button variant="primary">
  Save
</af-button>
```

BAD:

```
<af-button
  primeStyle="raised"
  ionicMode="ios"
  vendorType="primary"
>
```

Vendor implementation details must remain internal.

---

# Design Token Philosophy

Components must consume design tokens.

NEVER hardcode:

- Colors
- Radius
- Spacing
- Typography
- Elevation

All styling should derive from:

```
argfit-ui-core/tokens
```

---

# Responsive Philosophy

Responsive behavior should be intentional.

Avoid:

- Random breakpoint hacks
- Deep media query nesting
- Duplicated responsive logic

Prefer:

- Platform abstraction
- Adaptive rendering
- Shared responsive utilities

---

# Desktop Philosophy

Desktop components should prioritize:

- Information density
- Productivity
- Keyboard navigation
- Data-heavy workflows
- Fast interactions

Desktop experiences should feel:

- Professional
- Efficient
- Enterprise-grade

---

# Mobile Philosophy

Mobile components should prioritize:

- Touch interactions
- Simplicity
- Readability
- Native feeling
- Safe-area support

Mobile experiences should feel:

- Lightweight
- Natural
- Fast
- Gesture-aware

---

# Visual Philosophy

ArgFit UI visual identity is:

- Dark-first
- Minimal
- Modern
- Enterprise-oriented
- Data-focused

The system should NEVER visually feel like:

- Default PrimeNG
- Default Ionic
- Generic Tailwind templates

---

# Component Categories

The system is divided into categories.

---

## Base Components

Reusable semantic components.

Examples:

- Button
- Card
- Input
- Badge
- Avatar

---

## Primitive Building Blocks

Small vendor-agnostic pieces used to compose higher-level components.

Examples:

- VisuallyHidden
- FocusTrap
- Portal
- Disclosure

Primitives may depend on core tokens and shared types, but they must not depend on PrimeNG, Ionic, desktop, mobile, or adaptive implementations.

---

## Layout Components

Page structure.

Examples:

- PageShell
- Sidebar
- Topbar
- Section
- Grid

---

## Data Components

Data-heavy UI.

Examples:

- DataTable
- AnalyticsCard
- MetricCard
- Charts
- Timeline

---

## Feedback Components

User feedback and states.

Examples:

- Toast
- Alert
- EmptyState
- LoadingState
- ErrorState

---

## Navigation Components

Application navigation.

Examples:

- SidebarNav
- Tabs
- BottomNavigation
- Breadcrumbs

---

# Component Size Philosophy

Prefer:

- Small focused components

Avoid:

- Giant feature-monolith components

If a component becomes too large:

- Split rendering
- Split state
- Split behavior

---

# Internal Vendor Usage

PrimeNG and Ionic are internal rendering engines.

They are implementation details.

The architecture should allow future replacement if necessary.

---

# Accessibility Philosophy

Accessibility is mandatory.

All components should support:

- Keyboard navigation
- Focus states
- ARIA attributes
- Semantic HTML
- Screen readers

---

# Performance Philosophy

Components should prioritize:

- Minimal DOM
- Efficient rendering
- Lazy rendering
- Small reactive scopes

Avoid:

- Over-rendering
- Giant signal chains
- Unnecessary wrappers

---

# Agent Guidelines

Agents should:

- Reuse existing patterns
- Reuse existing tokens
- Reuse existing layouts

Agents should NOT:

- Invent inconsistent APIs
- Create vendor-coupled components
- Introduce unnecessary abstractions
- Create visual inconsistency

When uncertain:

- Prefer simplicity
- Prefer consistency
- Prefer semantic naming

---

# Long-Term Vision

ArgFit UI components should evolve into:

- A reusable adaptive ecosystem
- A premium enterprise UI system
- A scalable design platform
- A monetizable UI product
- A recognizable engineering portfolio

All future components should align with this vision.
