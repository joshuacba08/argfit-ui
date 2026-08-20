# ArgFit UI

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10.28-F69220?logo=pnpm&logoColor=white)
![Status](https://img.shields.io/badge/status-2.1.0-2599D5)

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

ArgFit UI is aligned on the stable `2.1.0` production contract. Publishable packages use exact `2.1.0` internal peers, public npm metadata and the `latest` dist-tag.

The production release gate keeps the broad Beta+ validation substrate for regression confidence, then rebuilds and validates stable production packages under `dist/production-tarballs/`.

Alpha, beta and Beta+ docs remain in the repository as historical baselines and migration sources for prerelease consumers.

## Package Architecture

```txt
argfit-ui-core
argfit-ui-primitives
argfit-ui-chart-runtime
argfit-ui-desktop
argfit-ui-mobile
argfit-ui-adaptive
argfit-ui-docs
argfit-ui-pwa-starter
showcase
```

| Package    | Public import           | Responsibility                                                     |
| ---------- | ----------------------- | ------------------------------------------------------------------ |
| Core       | `@argfit-ui/core`       | Tokens, themes, shared types, platform services, configuration     |
| Primitives | `@argfit-ui/primitives` | Vendor-agnostic accessibility and low-level composition utilities  |
| Chart runtime | technical peer | Lazy ECharts option builder shared by both renderers |
| Desktop    | `@argfit-ui/desktop`    | PrimeNG-backed desktop implementations kept behind ArgFit APIs     |
| Mobile     | `@argfit-ui/mobile`     | Ionic-backed mobile implementations kept behind ArgFit APIs        |
| Adaptive   | `@argfit-ui/adaptive`   | Public adaptive components that select desktop or mobile rendering |

The `argfit-ui-pwa-starter` workspace app demonstrates installable app behavior, service worker updates, offline shell state and app-level device capability detection.

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

For the production consumer contract, start with:

- [Productive quickstart](docs/productive/quickstart.md)
- [Productive components](docs/productive/components.md)
- [Productive API reference](docs/productive/api-reference.md)
- [Productive accessibility](docs/productive/accessibility.md)
- [Productive theming](docs/productive/theming.md)
- [Productive enterprise readiness](docs/productive/enterprise-readiness.md)
- [Migration beta/Beta+ to 1.0](docs/productive/migration-beta-to-1-0.md)
- [Productive release checklist](docs/productive/release-checklist.md)
- [Productive release notes](docs/productive/release-notes-1.0.0.md)
- [Productive release operations](docs/productive/release-operations.md)
- [Productive support policy](docs/productive/support-policy.md)
- [Productive quality gates](docs/productive/quality-gates.md)

For installable app and device capability work, start with:

- [PWA quickstart](docs/pwa/quickstart.md)
- [PWA device capabilities](docs/pwa/device-capabilities.md)
- [PWA browser support](docs/pwa/browser-support.md)

The historical beta consumer contract remains documented here:

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

The dedicated documentation application now lives in the separate Angular project `argfit-ui-docs`. The showcase remains the demo and validation surface; the docs platform is served independently.

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

Run the dedicated docs platform:

```bash
pnpm start:docs
```

Run the PWA starter:

```bash
pnpm start:pwa
```

Run Storybook directly from source (library prebuilds are not required):

```bash
pnpm storybook
```

Run the read-only ArgFit UI MCP server for Claude, Cursor, Codex and other MCP clients:

```bash
pnpm mcp
```

The MCP catalog is generated from Storybook, Compodoc, public exports and design tokens.
Its canonical setup and tool reference are rendered as **Getting Started / AI & MCP** in
Storybook. Build and validate it with `pnpm mcp:build` and `pnpm mcp:test`.

Storybook is the canonical source for component documentation. New component APIs,
examples and usage guidance belong beside the adaptive component as stories or MDX;
do not add new component pages to the legacy Angular docs application. The complete,
normative workflow lives in
[`projects/showcase/src/stories/component-workflow.docs.mdx`](projects/showcase/src/stories/component-workflow.docs.mdx)
and is rendered as **Getting Started / New Component Workflow** in Storybook.

Build and validate the component catalog:

```bash
pnpm build-storybook
pnpm guard:storybook
pnpm test-storybook
pnpm test-storybook:a11y
pnpm test-storybook:visual
pnpm guard:mcp-catalog
pnpm mcp:test
```

The Vercel portal build keeps Angular documentation at `/` and embeds the
static component catalog at `/storybook/`:

```bash
pnpm build:portal
```

Build all libraries, the showcase and the docs platform:

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

Run the production release gate before tagging or publishing `1.0.0`:

```bash
pnpm release:production:check
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

| Command                     | Description                                                                                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm start`                | Builds libraries and serves the showcase app                                                                                                       |
| `pnpm build:libs`           | Builds all library packages                                                                                                                        |
| `pnpm mcp`                  | Starts the read-only ArgFit UI MCP over STDIO                                                                                                      |
| `pnpm mcp:build`            | Regenerates the catalog and builds the publishable MCP package                                                                                     |
| `pnpm mcp:test`             | Regenerates the catalog and runs MCP engine, protocol and HTTP tests                                                                                |
| `pnpm mcp:smoke:package`    | Packs, installs and handshakes with the package through `npx`                                                                                      |
| `pnpm build:all`            | Builds libraries and the showcase app                                                                                                              |
| `pnpm test`                 | Runs Angular tests                                                                                                                                 |
| `pnpm test:all`             | Builds, validates architecture, and runs project test suites                                                                                       |
| `pnpm release:beta:check`   | Runs the beta release gate: architecture, build, tests, beta pack validation, consumer smoke, visual smoke, performance measurement and beta smoke |
| `pnpm publish:beta:dry-run` | Runs beta package metadata checks and `npm pack --dry-run` for every built package                                                                 |
| `pnpm pack:beta`            | Generates beta tarballs under `dist/beta-tarballs/`                                                                                                |
| `pnpm guard:architecture`   | Checks package boundaries and vendor isolation                                                                                                     |
| `pnpm guard:regression`     | Checks restored showcase and component regression contracts                                                                                        |

## Architecture Guard

ArgFit UI includes a local architecture guard that protects layer boundaries:

```bash
pnpm guard:architecture
```

The guard prevents accidental coupling such as importing PrimeNG or Ionic from `core`, `primitives`, or `adaptive`, and helps keep the public API vendor-independent.

## Documentation

Storybook is the only editable source of truth for component documentation, examples and the
component creation workflow. Run `pnpm storybook`, then open:

- **Getting Started / Component Workflow** for creating, documenting, testing and releasing a component.
- **Getting Started / AI & MCP** for Claude, Cursor, Codex, ChatGPT and generic MCP clients.
- The component's **Docs** page for its current contract and canonical usage.

The generated `tools/mcp/argfit-catalog.json` mirrors Storybook and the public API. Do not edit it
manually. The legacy `docs/` tree is historical/release material and must not receive new component
documentation.

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
  mcp/                   Public read-only MCP server and generated catalog
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

The workspace and publishable packages are aligned on `2.1.0`. The root workspace remains private. Publishable `@argfit-ui/*` packages, including `@argfit-ui/chart-runtime` and `@argfit-ui/mcp`, are MIT licensed and prepared for public npm distribution with the `latest` dist-tag, while production tarballs remain available for manual verification under `dist/production-tarballs/`.
