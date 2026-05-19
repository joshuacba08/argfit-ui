# ArgFit UI — Agent Rules

## Purpose

ArgFit UI is an adaptive Angular UI system designed to provide:

- Desktop experiences using PrimeNG internally
- Mobile experiences using Ionic internally
- A unified adaptive API for applications
- A consistent design system and visual identity

The goal is to create a reusable UI platform for:

- Enterprise applications
- Dashboards
- SaaS products
- Mobile apps
- Data visualization systems
- CRM/ERP-like interfaces

---

# Core Philosophy

ArgFit UI abstracts **user intent**, not vendor components.

GOOD:

- `AfActionButton`
- `AfMetricCard`
- `AfPageShell`
- `AfNavigationItem`

BAD:

- `AfPrimeButtonWrapper`
- `AfIonButtonWrapper`
- `AfPrimeDialog`
- `AfIonicCard`

Public APIs must represent product concepts, not implementation details.

---

# Technology Stack

## Core Technologies

- Angular 21+
- Standalone Components
- Signals
- inject()
- TailwindCSS
- PrimeNG
- Ionic Angular

## Architectural Layers

```txt
core
desktop
mobile
adaptive
showcase
```

# Architectural Rules

## core

Contains:

- Design tokens
- Shared services
- Shared types
- Utilities
- Theme logic
- Platform logic

The core layer MUST NOT depend on:

- PrimeNG
- Ionic
- Vendor-specific implementations

------

## desktop

Contains:

- PrimeNG-based implementations
- Desktop-specific layouts
- Desktop data-dense components

Desktop components may internally use PrimeNG, but MUST NOT expose PrimeNG APIs publicly.

------

## mobile

Contains:

- Ionic-based implementations
- Mobile-specific navigation
- Touch-first interfaces
- Safe-area-aware layouts

Mobile components may internally use Ionic, but MUST NOT expose Ionic APIs publicly.

------

## adaptive

Contains:

- Adaptive rendering orchestration
- Platform switching logic
- Responsive component composition

Adaptive components decide WHAT to render.

They MUST NOT contain business logic.

------

## showcase

Contains:

- Documentation
- Demo pages
- Visual testing
- Example usage

The showcase application is also part of the public portfolio.

------

# Angular Rules

## Required Patterns

ALWAYS:

- Use standalone components
- Use signals when appropriate
- Use inject()
- Use typed inputs
- Use strict typing
- Prefer composition over inheritance
- Prefer small reusable components
- Use OnPush change detection
- Use modern Angular control flow (`@if`, `@for`)

------

## Forbidden Patterns

NEVER:

- Use NgModules
- Use legacy Angular syntax
- Use `any`
- Expose vendor-specific APIs publicly
- Hardcode colors
- Hardcode spacing
- Duplicate responsive logic
- Create giant components
- Couple business logic to UI rendering

------

# Design System Rules

## Visual Identity

ArgFit UI has its own identity.

The system MUST NOT visually feel like:

- Raw PrimeNG
- Default Ionic
- Generic Tailwind templates

The design system is:

- Dark-first
- Minimal
- Enterprise-oriented
- Data-focused
- Performance-oriented
- Responsive
- Touch-friendly

------

# Design Tokens

All visual values MUST come from tokens.

NEVER hardcode:

- Colors
- Radius
- Spacing
- Shadows
- Typography
- Elevation

Use tokens from:

```
argfit-ui-core/tokens
```

------

# Adaptive Component Philosophy

Adaptive components exist to orchestrate rendering.

Example:

```
<af-button>
  Save
</af-button>
```

Internally:

- Desktop → PrimeNG implementation
- Mobile → Ionic implementation

The adaptive layer MUST remain lightweight.

------

# Public API Rules

Public APIs must remain stable.

DO:

- Create semantic APIs
- Use meaningful naming
- Keep APIs platform-agnostic

DO NOT:

- Leak PrimeNG types
- Leak Ionic types
- Leak vendor implementation details

------

# Component Naming Rules

## Prefix

All public components MUST use:

```
Af
```

Examples:

- `AfButton`
- `AfCard`
- `AfPageShell`
- `AfSidebar`

------

# File Organization

Preferred structure:

```
feature/
  components/
  services/
  types/
  utils/
```

Avoid flat giant folders.

------

# Styling Rules

## Preferred Styling Strategy

- TailwindCSS utilities
- CSS variables
- Design tokens
- Minimal custom SCSS

------

## Forbidden Styling Patterns

NEVER:

- Hardcode colors inline
- Create duplicated utility classes
- Use random spacing values
- Create component-specific color systems

------

# Performance Rules

Always prioritize:

- Lazy rendering
- Small components
- Reusable logic
- Minimal DOM complexity
- Mobile responsiveness

Avoid:

- Over-rendering
- Giant templates
- Excessive nesting
- Large reactive chains

------

# Accessibility Rules

All components should support:

- Keyboard navigation
- Focus states
- Screen readers
- Semantic HTML
- Proper ARIA attributes

Accessibility is not optional.

------

# Documentation Rules

All public components MUST include:

- Description
- Usage example
- Inputs
- Outputs
- Variants
- Accessibility notes

------

# Agent Behavior Rules

Agents working on this repository MUST:

- Respect architectural boundaries
- Respect adaptive architecture
- Respect design tokens
- Avoid introducing vendor coupling
- Avoid overengineering
- Avoid inventing new patterns unnecessarily

When unsure:

- Prefer simplicity
- Prefer consistency
- Prefer reuse

------

# Long-Term Vision

ArgFit UI aims to become:

- A reusable adaptive Angular UI platform
- A premium enterprise UI ecosystem
- A design system for real production software
- A monetizable UI product
- A public technical portfolio

All architectural decisions should support long-term scalability and maintainability.

