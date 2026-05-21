# Beta Quickstart

This guide documents the intended consumer path for ArgFit UI `0.1.0-beta.0`.

The workspace still builds as `0.1.0-alpha.0` today, but the contract below is the beta shape consumers should evaluate. If the `beta` dist-tag is not available yet, validate the same install and import path locally with `pnpm beta:consumer-smoke`.

## Requirements

| Requirement | Beta target |
| --- | --- |
| Angular | `21.x` standalone app |
| TypeScript | `5.9.x` |
| Node | `22.x` recommended; local hardening also validated on Node `24.x` |
| Package manager | pnpm `10.x` recommended |
| Rendering | Browser app for the current catalog; SSR remains outside the beta scope |

## Recommended Package Set

The recommended application surface remains `@argfit-ui/adaptive`.

Install all ArgFit packages on the same prerelease version:

```bash
pnpm add @argfit-ui/core@0.1.0-beta.0
pnpm add @argfit-ui/primitives@0.1.0-beta.0
pnpm add @argfit-ui/desktop@0.1.0-beta.0 @argfit-ui/mobile@0.1.0-beta.0
pnpm add @argfit-ui/adaptive@0.1.0-beta.0
```

Install the external peers required by the current beta contract:

```bash
pnpm add @angular/cdk@^21.2.0 @ionic/angular@^8.8.7 @lucide/angular@^1.16.0 echarts@^6.1.0 primeng@^21.1.8
```

Angular packages such as `@angular/common`, `@angular/core` and `@angular/forms` should already exist in a normal Angular 21 application.

## Local Validation Before Publish

Until the `beta` dist-tag is opened, the reproducible local beta validation path is:

```bash
pnpm build:libs
pnpm pack:alpha:dist
pnpm beta:consumer-smoke
```

That flow still uses local tarballs under `dist/alpha-tarballs/`, but it validates the intended beta consumer contract from a temporary external Angular app.

Maintainers should use the full beta gate before tagging:

```bash
pnpm release:beta:check
```

## Register Providers

Add `provideArgfitUi` in your application config:

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

If your app renders mobile components directly from `@argfit-ui/mobile`, initialize Ionic Angular in the host app as usual. Adaptive consumers normally do not import Ionic components directly.

## Import Stable-For-Beta Components

Use standalone imports from `@argfit-ui/adaptive` for the recommended application path:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AfButton,
  AfCard,
  AfCardContentDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
  AfInput,
} from '@argfit-ui/adaptive';

@Component({
  selector: 'app-beta-card',
  imports: [AfButton, AfCard, AfCardHeaderDirective, AfCardTitleDirective, AfCardContentDirective, AfInput],
  template: `
    <af-card variant="panel" tone="primary">
      <header afCardHeader>
        <h2 afCardTitle>Session setup</h2>
      </header>

      <div afCardContent>
        <af-input label="Athlete" placeholder="Maria Garcia" />
      </div>

      <af-button>Start test</af-button>
    </af-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetaCardComponent {}
```

## Experimental Opt-In Areas

These public surfaces remain `experimental-in-beta` and should stay behind app-level wrappers if you adopt them early:

- analytics composition;
- data-table APIs;
- expanded form controls;
- feedback orchestration.

See [Beta public API](./public-api.md) and [Migration alpha to beta](./migration-alpha-to-beta.md) for the full classification.

## Recommended Consumer Validation

After setup, validate the host application with:

```bash
pnpm build
```

Recommended follow-up checks for a real consumer app:

1. Run the application test suite.
2. Re-check desktop and mobile layouts after importing adaptive components.
3. Re-test any `experimental-in-beta` APIs on every beta prerelease.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `Cannot find module @argfit-ui/core` | Install all five ArgFit packages on the same prerelease version. |
| Peer dependency warning for `@argfit-ui/*` | Keep every ArgFit package aligned to the exact same beta version. |
| Angular peer mismatch | Use Angular `21.x` for the current beta target. |
| Form component does not bind | Import `ReactiveFormsModule` in the standalone consumer component. |
| Mobile custom elements do not render | Confirm `@ionic/angular` is installed and the app supports custom elements. |
| Chart appears empty in SSR | Charts remain browser-oriented in the current beta scope. |

## Next Reading

- [Beta components](./components.md)
- [Beta theming and adaptive rendering](./theming.md)
- [Beta consumer compatibility](./compatibility.md)
- [Beta package matrix](./package-matrix.md)
- [Migration alpha to beta](./migration-alpha-to-beta.md)
- [Beta known limitations](./known-limitations.md)