# ArgFit UI

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10.28-F69220?logo=pnpm&logoColor=white)
![Status](https://img.shields.io/badge/status-0.1.0--beta.0-2599D5)

ArgFit UI is an adaptive Angular UI platform for enterprise applications, dashboards, SaaS products, and mobile-first workflows.

It provides a semantic, vendor-independent public API while rendering through specialized engines internally: PrimeNG for desktop experiences, Ionic Angular for mobile experiences, and a lightweight adaptive layer that chooses the right implementation for the current platform.

## Why ArgFit UI

Modern product teams often need one design system that works across dense desktop workflows and touch-first mobile screens without exposing separate component APIs. ArgFit UI is built around that constraint.

- Unified Angular components for adaptive interfaces.
- Vendor abstraction across desktop and mobile rendering engines.
- Token-driven styling for consistent dark-first enterprise UI.
- Standalone Angular APIs, signals, strict typing, and OnPush change detection.
- Architecture guards that protect package boundaries and prevent vendor leakage.

## Project Status

ArgFit UI keeps the source workspace aligned with the historical `0.1.0-beta.0` baseline so the existing beta regression contract remains stable. The dedicated Beta+ packaging flow now produces `0.2.0-beta.0` tarballs in parallel for the current release candidate.

The official `0.1.0-beta.0` surface is tracked in the beta docs. Stable-for-beta components include `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`, `AfBadge`, `AfPageShell`, and `AfMetricCard`. Analytics, data-table, expanded form controls and feedback components remain public as `experimental-in-beta` APIs.

The Beta+ track is already taking shape in the repository. The current showcase intentionally highlights the active Beta+ slices only: wave 1 overlays and identity, wave 2 advanced forms, and wave 5 workflow with `AfKanban`.

Alpha docs remain in the repository as the historical baseline and migration source for prerelease consumers.

## Package Architecture

```txt
argfit-ui-core
argfit-ui-primitives
argfit-ui-desktop
argfit-ui-mobile
argfit-ui-adaptive
showcase
```

| Package | Public import | Responsibility |
| --- | --- | --- |
| Core | `@argfit-ui/core` | Tokens, themes, shared types, platform services, configuration |
| Primitives | `@argfit-ui/primitives` | Vendor-agnostic accessibility and low-level composition utilities |
| Desktop | `@argfit-ui/desktop` | PrimeNG-backed desktop implementations kept behind ArgFit APIs |
| Mobile | `@argfit-ui/mobile` | Ionic-backed mobile implementations kept behind ArgFit APIs |
| Adaptive | `@argfit-ui/adaptive` | Public adaptive components that select desktop or mobile rendering |

The public contract is the scoped package API. Implementation project names are workspace details.

## Design Principles

- Semantic components over vendor wrappers.
- Stable, typed, minimal public APIs.
- Dark-first, data-focused visual language.
- CSS variables and design tokens instead of hardcoded visual values.
- Small focused components composed through Angular content projection and directives.
- Desktop experiences optimized for density, keyboard use, and productivity.
- Mobile experiences optimized for touch, safe areas, and native-feeling interaction.

## Quick Start

For the current beta consumer contract, start with:

- [Beta quickstart](docs/beta/quickstart.md)
- [Beta theming and adaptive rendering](docs/beta/theming.md)
- [Beta components](docs/beta/components.md)
- [Beta known limitations](docs/beta/known-limitations.md)
- [Migration alpha to beta](docs/beta/migration-alpha-to-beta.md)

The current Beta+ expansion track is documented separately:

- [Beta+ scope](docs/beta-plus/scope.md)
- [Beta+ public API](docs/beta-plus/public-api.md)
- [Beta+ quickstart](docs/beta-plus/quickstart.md)
- [Beta+ components](docs/beta-plus/components.md)
- [Beta+ known limitations](docs/beta-plus/known-limitations.md)
- [Migration beta to Beta+](docs/beta-plus/migration-beta-to-beta-plus.md)
- [Beta+ readiness](docs/beta-plus/readiness.md)
- [Beta+ visual QA](docs/beta-plus/visual-qa.md)
- [Beta+ release checklist](docs/beta-plus/release-checklist.md)
- [Beta+ release notes](docs/beta-plus/release-notes-beta-plus.md)

The historical alpha distribution remains documented here:

- [Alpha quickstart](docs/alpha/quickstart.md)
- [Alpha theming and adaptive rendering](docs/alpha/theming.md)
- [Alpha components](docs/alpha/components.md)

For local workspace development:

Install dependencies:

```bash
pnpm install
```

Run the showcase app:

```bash
pnpm start
```

Build all libraries and the showcase:

```bash
pnpm build:all
```

Run the full validation suite:

```bash
pnpm test:all
```

Run the beta release gate before tagging or publishing:

```bash
pnpm release:beta:check
```

Run the Beta+ consumer smoke locally:

```bash
pnpm beta-plus:consumer-smoke
```

Run the Beta+ accessibility and visual smoke locally:

```bash
pnpm audit:accessibility:beta-plus
pnpm exec playwright install chromium
pnpm visual:beta-plus
```

Run the Beta+ prerelease gate before dispatching the Beta+ publish workflow:

```bash
pnpm release:beta-plus:check
```

Run the beta package dry-run locally:

```bash
pnpm publish:beta:dry-run
```

Run the beta release gate with external consumer and visual smoke checks:

```bash
pnpm release:beta:check
```

Run the beta visual smoke locally:

```bash
pnpm exec playwright install chromium
pnpm visual:beta
```

Run the external consumer smoke locally:

```bash
pnpm beta:consumer-smoke
```

## Usage

Register ArgFit UI at application bootstrap:

```ts
import { ApplicationConfig } from '@angular/core';
import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideArgfitUi({
      theme: ARGFIT_DARK_THEME,
      platform: 'auto',
    }),
  ],
};
```

Use adaptive components from the public API:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AfButton,
  AfCard,
  AfCardContentDirective,
  AfCardEyebrowDirective,
  AfCardFooterDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
  AfInput,
} from '@argfit-ui/adaptive';

@Component({
  selector: 'app-dashboard-card',
  imports: [
    AfButton,
    AfCard,
    AfCardHeaderDirective,
    AfCardEyebrowDirective,
    AfCardTitleDirective,
    AfCardContentDirective,
    AfCardFooterDirective,
    AfInput,
  ],
  template: `
    <af-card variant="panel" tone="primary">
      <header afCardHeader>
        <span afCardEyebrow>Performance</span>
        <h2 afCardTitle>Weekly readiness</h2>
      </header>

      <div afCardContent>
        <af-input label="Athlete" placeholder="Search athlete" type="search" />
      </div>

      <footer afCardFooter>
        <af-button variant="secondary">View details</af-button>
        <af-button>Save changes</af-button>
      </footer>
    </af-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCardComponent {}
```

## Public Imports

```ts
import { AfPlatformService, provideArgfitUi } from '@argfit-ui/core';
import { AfVisuallyHiddenComponent } from '@argfit-ui/primitives';
import { AfButton, AfCard, AfDialog, AfInput } from '@argfit-ui/adaptive';
```

Consumers should depend on semantic ArgFit APIs, not on PrimeNG or Ionic component APIs.

## Development Commands

| Command | Description |
| --- | --- |
| `pnpm start` | Builds libraries and serves the showcase app |
| `pnpm build:libs` | Builds all library packages |
| `pnpm build:all` | Builds libraries and the showcase app |
| `pnpm test` | Runs Angular tests |
| `pnpm test:all` | Builds, validates architecture, and runs project test suites |
| `pnpm release:beta:check` | Runs the beta release gate: architecture, build, tests, beta pack validation, consumer smoke, visual smoke, performance measurement and beta smoke |
| `pnpm publish:beta:dry-run` | Runs beta package metadata checks and `npm pack --dry-run` for every built package |
| `pnpm pack:beta` | Generates beta tarballs under `dist/beta-tarballs/` |
| `pnpm guard:architecture` | Checks package boundaries and vendor isolation |
| `pnpm guard:regression` | Checks restored showcase and component regression contracts |

## Architecture Guard

ArgFit UI includes a local architecture guard that protects layer boundaries:

```bash
pnpm guard:architecture
```

The guard prevents accidental coupling such as importing PrimeNG or Ionic from `core`, `primitives`, or `adaptive`, and helps keep the public API vendor-independent.

## Documentation

- [Architecture](docs/architecture.md)
- [Component philosophy](docs/component-philosophy.md)
- [Design system](docs/design-system.md)
- [Conventions](docs/conventions.md)
- [Roadmap](docs/roadmap.md)
- [Alpha scope](docs/alpha/alpha-scope.md)
- [Alpha public API](docs/alpha/public-api.md)
- [Alpha compatibility](docs/alpha/compatibility.md)
- [Alpha quickstart](docs/alpha/quickstart.md)
- [Alpha theming and adaptive rendering](docs/alpha/theming.md)
- [Alpha components](docs/alpha/components.md)
- [Alpha known limitations](docs/alpha/known-limitations.md)
- [Alpha release notes](docs/alpha/release-notes-alpha.md)
- [Alpha release checklist](docs/alpha/release-checklist.md)
- [Alpha package metadata](docs/alpha/package-metadata.md)
- [Publish alpha procedure](docs/alpha/publish-alpha.md)
- [Beta scope](docs/beta/beta-scope.md)
- [Beta quickstart](docs/beta/quickstart.md)
- [Beta theming and adaptive rendering](docs/beta/theming.md)
- [Beta components](docs/beta/components.md)
- [Beta known limitations](docs/beta/known-limitations.md)
- [Beta public API](docs/beta/public-api.md)
- [Beta component engine map](docs/beta/component-engine-map.md)
- [Beta accessibility audit](docs/beta/accessibility.md)
- [Beta visual QA](docs/beta/visual-qa.md)
- [Beta consumer compatibility](docs/beta/compatibility.md)
- [Beta package matrix](docs/beta/package-matrix.md)
- [Beta performance and budgets](docs/beta/performance.md)
- [Beta release notes](docs/beta/release-notes-beta.md)
- [Beta release checklist](docs/beta/release-checklist.md)
- [Migration alpha to beta](docs/beta/migration-alpha-to-beta.md)
- [Beta readiness evaluation](docs/beta/readiness.md)
- [Beta+ readiness plan](docs/beta-plus/readiness.md)
- [Productive version projection](docs/productive/projection.md)
- [Changelog](CHANGELOG.md)
- [Human units](docs/hus/README.md)

## Repository Layout

```txt
projects/
  argfit-ui-core/        Shared tokens, themes, services, types, and config
  argfit-ui-primitives/  Accessibility and low-level vendor-agnostic utilities
  argfit-ui-desktop/     Desktop implementations backed by PrimeNG internally
  argfit-ui-mobile/      Mobile implementations backed by Ionic internally
  argfit-ui-adaptive/    Public adaptive components and orchestration
  showcase/              Local showcase and integration playground
tools/
  architecture-guard.mjs Package boundary validation
docs/
  Architecture, component philosophy, design system, roadmap, and HUs
```

## Standards

ArgFit UI code is expected to follow these constraints:

- Angular standalone components only.
- Signals and `inject()` for modern Angular patterns.
- Strict TypeScript without `any`.
- OnPush change detection for components.
- Token-based visual values and CSS variables.
- No public PrimeNG or Ionic API leakage.
- Small, semantic components with clear responsibilities.

## Versioning And Distribution

The workspace and publishable packages are aligned on `0.1.0-beta.0`. The root workspace remains private. Publishable `@argfit-ui/*` packages are MIT licensed and prepared for public npm distribution with the `beta` dist-tag, while tarballs remain available for manual verification under `dist/beta-tarballs/`.
