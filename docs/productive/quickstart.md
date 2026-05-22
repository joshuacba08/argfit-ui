# Productive Quickstart

This guide describes the intended consumer posture for the frozen `1.0.0` ArgFit UI contract.

The documentation target is `1.0.0`, but the repository still validates publishable artifacts through the Beta+ substrate until `HU-043` aligns package publishing to the final major version. Treat this page as the source of truth for the productive API posture, not as a claim that `1.0.0` has already been published.

## Requirements

| Requirement | Productive target |
| --- | --- |
| Angular | `21.x` standalone app |
| TypeScript | `5.9.x` |
| Node | `22.x` recommended; local validation also runs on Node `24.x` |
| Package manager | pnpm `10.x` |
| Rendering | Browser application; SSR remains outside the current productive scope |

## Recommended Package Posture

The recommended application-facing path remains `@argfit-ui/adaptive`.

When `1.0.0` is published, keep every ArgFit package aligned to the exact same release:

```bash
pnpm add @argfit-ui/core@1.0.0
pnpm add @argfit-ui/primitives@1.0.0
pnpm add @argfit-ui/desktop@1.0.0 @argfit-ui/mobile@1.0.0
pnpm add @argfit-ui/adaptive@1.0.0
```

Until the final `1.0.0` publish flow lands, validate the productive contract directly from this repository:

```bash
pnpm install
pnpm build:all
pnpm release:production:check
```

## Bootstrap The Runtime

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

The productive bootstrap remains intentionally small:

- `provideArgfitUi` owns the shared runtime configuration
- `AfThemeService` owns theme application and switching
- `AfPlatformService` owns renderer preference and adaptive resolution
- `AfToastService` owns application-level transient feedback orchestration

## Preferred Consumer Path

Use semantic components from `@argfit-ui/adaptive` in application code:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AfButton,
  AfCard,
  AfCardContentDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
  AfDataTable,
  AfDialog,
  AfInlineMessage,
} from '@argfit-ui/adaptive';

@Component({
  selector: 'app-productive-overview',
  imports: [
    AfButton,
    AfCard,
    AfCardContentDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    AfDataTable,
    AfDialog,
    AfInlineMessage,
  ],
  template: `
    <af-card variant="panel" tone="primary">
      <header afCardHeader>
        <h2 afCardTitle>Productive overview</h2>
      </header>

      <div afCardContent>
        <af-inline-message severity="info" title="1.0 contract">
          Adaptive components remain the preferred app-facing path.
        </af-inline-message>

        <af-button>Review release gate</af-button>
      </div>
    </af-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductiveOverviewComponent {}
```

Renderer-specific packages remain public, but they are an explicit opt-in path for intentional desktop/mobile integration work rather than the default application contract.

## Local Validation Before Shipping

The productive baseline is only credible if the repo-level gates remain green:

```bash
pnpm build:all
pnpm test:all
pnpm release:production:check
```

Use the broader gate before tagging or opening a final release workflow. `pnpm build:all` alone proves the docs front and showcase build, but it does not replace the production gate.

## Next Reading

- [Productive components](./components.md)
- [Productive API reference](./api-reference.md)
- [Productive accessibility](./accessibility.md)
- [Productive theming](./theming.md)
- [Migration beta/Beta+ to 1.0](./migration-beta-to-1-0.md)
- [Productive release notes](./release-notes-1-0.md)
- [Productive quality gates](./quality-gates.md)
