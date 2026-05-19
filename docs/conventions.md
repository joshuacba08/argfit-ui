# ArgFit UI — Conventions

# Purpose

This document defines the coding conventions and project standards used across ArgFit UI.

The goal is to ensure:

- Consistency
- Predictability
- Maintainability
- Agent alignment
- Long-term scalability

These conventions apply to:

- Human contributors
- AI agents
- Copilot
- Claude
- GPT-based assistants

---

# General Principles

Prefer:

- Simplicity
- Explicitness
- Reusability
- Predictability
- Consistency

Avoid:

- Clever abstractions
- Overengineering
- Deep inheritance
- Giant files
- Inconsistent naming

---

# Angular Conventions

# Required Angular Features

Use:

- Standalone components
- Signals
- inject()
- Strict typing
- Modern control flow (`@if`, `@for`)

Avoid:

- NgModules
- Legacy Angular syntax
- Untyped APIs
- `any`

---

# Component Naming

# Public Components

All public components MUST use:

```txt id="u0fdui"
Af
```

Examples:

- `AfButton`
- `AfCard`
- `AfSidebar`
- `AfMetricCard`

------

# Internal Components

Internal-only components may use:

```
Base
Internal
Desktop
Mobile
Adaptive
```

Examples:

- `AfButtonDesktop`
- `AfButtonMobile`
- `AfButtonAdaptive`

------

# File Naming

Use kebab-case.

GOOD:

```
af-button.component.ts
platform.service.ts
theme.tokens.ts
```

BAD:

```
AfButton.ts
PlatformService.ts
```

------

# Folder Structure

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

# Component Structure

Preferred component structure:

```
component/
  af-button.component.ts
  af-button.component.html
  af-button.component.scss
  af-button.types.ts
```

------

# Type Naming

Use descriptive names.

GOOD:

```
AfButtonVariant
AfPlatform
AfCardElevation
```

BAD:

```
Type1
ButtonType
```

------

# Service Naming

Services should end with:

```
Service
```

Examples:

- `PlatformService`
- `ThemeService`

------

# Signal Conventions

Signals should be explicit.

GOOD:

```
readonly currentPlatform = signal<AfPlatform>('desktop');
```

Avoid cryptic names.

BAD:

```
readonly data = signal();
```

------

# Inputs and Outputs

Use explicit typed inputs.

GOOD:

```
variant = input<AfButtonVariant>('primary');
```

Avoid untyped inputs.

BAD:

```
@Input() variant: any;
```

------

# Styling Conventions

# Preferred Styling

Use:

- Tailwind utilities
- CSS variables
- Design tokens

Avoid:

- Large custom SCSS systems
- Random utility duplication
- Inline hardcoded values

------

# Token Usage

All visual values MUST derive from tokens.

NEVER hardcode:

- Colors
- Radius
- Shadows
- Typography
- Spacing

GOOD:

```
background: var(--af-bg-surface);
```

BAD:

```
background: #121212;
```

------

# Responsive Conventions

Responsive behavior should be:

- Centralized
- Predictable
- Adaptive

Avoid random media queries inside components.

------

# Adaptive Conventions

Adaptive components should:

- Delegate rendering
- Remain lightweight
- Avoid business logic

GOOD:

```
AfButton
  -> Desktop implementation
  -> Mobile implementation
```

BAD:

```
Huge adaptive component with all logic inside
```

------

# PrimeNG Conventions

PrimeNG is an internal implementation detail.

DO:

- Wrap PrimeNG internally
- Adapt APIs
- Apply ArgFit styling

DO NOT:

- Expose PrimeNG APIs publicly
- Leak PrimeNG types
- Couple consumers to PrimeNG

------

# Ionic Conventions

Ionic is an internal implementation detail.

DO:

- Use Ionic internally for mobile UX
- Respect native mobile behavior
- Support safe areas

DO NOT:

- Leak Ionic APIs publicly
- Force Ionic patterns into desktop

------

# Import Conventions

Prefer clean imports.

GOOD:

```
import { PlatformService } from '@argfit-ui/core';
```

Avoid deep relative chains.

BAD:

```
import { PlatformService } from '../../../../services';
```

------

# Performance Conventions

Prefer:

- Small templates
- Minimal DOM
- Efficient rendering
- Local state

Avoid:

- Giant signal chains
- Over-rendering
- Deep nested templates

------

# Accessibility Conventions

All components should support:

- Keyboard navigation
- Focus states
- Semantic HTML
- ARIA attributes

Accessibility is mandatory.

------

# Documentation Conventions

All public components should include:

- Description
- Usage example
- Inputs
- Outputs
- Variants
- Accessibility notes

------

# Agent Conventions

Agents should:

- Reuse patterns
- Respect folder structures
- Respect adaptive architecture
- Respect tokens

Agents should NOT:

- Invent inconsistent APIs
- Introduce vendor coupling
- Create unnecessary abstractions

When uncertain:

- Prefer consistency
- Prefer simplicity
- Prefer reuse

------

# Long-Term Goal

These conventions exist to support:

- A scalable adaptive UI platform
- A reusable enterprise ecosystem
- A monetizable UI product
- A professional engineering portfolio

All future code should align with these conventions.
