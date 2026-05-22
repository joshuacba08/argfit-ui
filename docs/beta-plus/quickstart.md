# Beta+ Quickstart

This guide documents the intended consumer path for the Beta+ track targeting `0.2.0-beta.0`.

The repository already contains the current Beta+ slices, but published artifacts are still aligned on `0.1.0-beta.0`. Use this guide as the contract for the next prerelease and validate from the repository until the dedicated Beta+ consumer and release flow lands in HU-036 and HU-037.

## Requirements

| Requirement | Beta+ target |
| --- | --- |
| Angular | `21.x` standalone app |
| TypeScript | `5.9.x` |
| Node | `22.x` recommended; local hardening also validated on Node `24.x` |
| Package manager | pnpm `10.x` recommended |
| Rendering | Browser app; SSR remains outside the current Beta+ scope |

## Recommended Package Set

The recommended consumer path remains `@argfit-ui/adaptive`.

When the Beta+ prerelease is published, keep every ArgFit package on the exact same `0.2.0-beta.x` version:

```bash
pnpm add @argfit-ui/core@0.2.0-beta.x
pnpm add @argfit-ui/primitives@0.2.0-beta.x
pnpm add @argfit-ui/desktop@0.2.0-beta.x @argfit-ui/mobile@0.2.0-beta.x
pnpm add @argfit-ui/adaptive@0.2.0-beta.x
```

Install the external peers required by the current Beta+ contract:

```bash
pnpm add @angular/cdk@^21.2.0 @angular/forms@^21.2.0 @ionic/angular@^8.8.7 @lucide/angular@^1.16.0 echarts@^6.1.0 primeng@^21.1.8
```

Until the Beta+ publish channel opens, validate the current slices from this repository:

```bash
pnpm install
pnpm build:all
pnpm start
```

## Preferred Consumer Path

Keep using the ArgFit semantic API from `@argfit-ui/adaptive`:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AfAvatar,
  AfButton,
  AfCard,
  AfCardContentDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
  AfDatePicker,
  AfInputCount,
  AfKanban,
  AfPopover,
} from '@argfit-ui/adaptive';

@Component({
  selector: 'app-beta-plus-overview',
  imports: [
    AfAvatar,
    AfButton,
    AfCard,
    AfCardContentDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    AfDatePicker,
    AfInputCount,
    AfKanban,
    AfPopover,
  ],
  template: `
    <af-card variant="panel" tone="primary">
      <header afCardHeader>
        <h2 afCardTitle>Beta+ workflow overview</h2>
      </header>

      <div afCardContent>
        <af-input-count label="Intentos" />
        <af-date-picker label="Fecha" />
        <af-button>Open workflow</af-button>
      </div>
    </af-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetaPlusOverviewComponent {}
```

Renderer-specific imports remain public for advanced cases, but they are not the preferred application path.

## Current Showcase Coverage

The current-state showcase intentionally focuses on the slices that are active in product-facing validation:

- wave 1 overlays, progress and identity
- wave 2 advanced forms and field composition
- wave 5 workflow with `AfKanban`

Wave 3 data components and wave 4 panel/layout components remain implemented in the repository and documented in Beta+ docs, but they are not kept visible in the streamlined current-state showcase.

## Interaction Notes

- `AfTooltip` must remain usable without hover-only assumptions. On mobile, the fallback is explicit trigger and focus-driven disclosure rather than desktop hover behavior.
- `AfKanban` uses drag and drop on desktop, but mobile currently prefers explicit move actions plus live-region feedback instead of touch drag.
- `AfKanban` keyboard and assistive-technology users must always have a non-drag move path.

## Local Validation Before Beta+ Publish

Use the repository checks that reflect the current real state:

```bash
pnpm build:all
ng test showcase --watch=false --include=projects/showcase/src/app/app.spec.ts
pnpm visual:beta:dist
```

Broader external consumer and release validation belongs to HU-036 and HU-037.

## Next Reading

- [Beta+ components](./components.md)
- [Beta+ public API](./public-api.md)
- [Beta+ known limitations](./known-limitations.md)
- [Migration beta to Beta+](./migration-beta-to-beta-plus.md)
- [Beta+ readiness](./readiness.md)
