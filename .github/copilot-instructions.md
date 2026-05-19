# ArgFit UI — Copilot Instructions

This repository contains an adaptive Angular UI platform.

The system supports:

- Desktop rendering using PrimeNG internally
- Mobile rendering using Ionic internally
- Unified adaptive APIs
- Token-driven theming
- Enterprise-oriented UI systems

---

# Core Stack

Use:

- Angular 21+
- Standalone components
- Signals
- inject()
- TailwindCSS
- PrimeNG
- Ionic Angular

---

# Architecture

The repository is divided into layers:

```txt
argfit-ui-core
argfit-ui-primitives
argfit-ui-desktop
argfit-ui-mobile
argfit-ui-adaptive
showcase
```

Public imports use scoped packages:

```ts
import { AfPlatformService } from '@argfit-ui/core';
import { AfVisuallyHiddenComponent } from '@argfit-ui/primitives';
import { AfButton } from '@argfit-ui/adaptive';
```

Do not create new public imports with unscoped package names.

# Layer Responsibilities

## core

Contains:

- Tokens
- Shared services
- Shared types
- Theme logic
- Platform logic

The core layer MUST remain vendor-agnostic.

Do NOT import:

- PrimeNG
- Ionic
- ArgFit implementation packages

inside core.

---

## primitives

Contains small vendor-agnostic building blocks shared by the implementation layers.

Examples:

- Accessibility helpers
- Structural primitives
- Low-level composition utilities

Primitives may depend on `@argfit-ui/core`.

Do NOT import:

- PrimeNG
- Ionic
- `@argfit-ui/desktop`
- `@argfit-ui/mobile`
- `@argfit-ui/adaptive`

inside primitives.

---

## desktop

Contains desktop-oriented implementations using PrimeNG internally.

PrimeNG should remain an internal implementation detail.

Do NOT expose PrimeNG APIs publicly.

---

## mobile

Contains mobile-oriented implementations using Ionic internally.

Ionic should remain an internal implementation detail.

Do NOT expose Ionic APIs publicly.

---

## adaptive

Contains adaptive rendering orchestration.

Adaptive components decide:

- Desktop rendering
- Mobile rendering

Adaptive components MUST remain lightweight.

Avoid business logic in adaptive components.

---

# Angular Rules

Always:

- Use standalone components
- Use signals
- Use inject()
- Use strict typing
- Use OnPush change detection
- Use modern Angular syntax

Never:

- Use NgModules
- Use `any`
- Use legacy Angular patterns
- Create giant components

---

# Component Philosophy

Components represent semantic product concepts.

GOOD:

- AfButton
- AfCard
- AfPageShell
- AfMetricCard

BAD:

- AfPrimeButton
- AfIonButton
- AfPrimeWrapper

---

# Styling Rules

Use:

- TailwindCSS
- CSS variables
- Design tokens

Avoid:

- Hardcoded colors
- Random spacing values
- Large SCSS systems

All visual values should derive from tokens.

---

# Design System

The system is:

- Dark-first
- Minimal
- Enterprise-oriented
- Data-focused

Avoid making the UI feel like default PrimeNG or default Ionic.

---

# Adaptive Philosophy

Adaptive components should expose unified APIs.

Example:

```
<af-button>
  Save
</af-button>
```

Internally:

- Desktop → PrimeNG implementation
- Mobile → Ionic implementation

Consumers should not care about rendering engines.

---

# Preferred Development Style

Prefer:

- Small focused components
- Reusable logic
- Composition over inheritance
- Stable APIs
- Consistent naming

Avoid:

- Overengineering
- Vendor coupling
- Deep inheritance
- Massive abstractions

---

# Naming Rules

Public components MUST use:

```
Af
```

Examples:

- AfButton
- AfCard
- AfSidebar

Use kebab-case for files.

---

# Long-Term Vision

ArgFit UI aims to become:

- A reusable adaptive Angular ecosystem
- A premium enterprise UI platform
- A monetizable UI product
- A public engineering portfolio

All generated code should align with this vision.

Run `pnpm guard:architecture` after changing imports across libraries.
