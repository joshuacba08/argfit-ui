# Alpha Quickstart

This guide shows how to try ArgFit UI `0.1.0-alpha.0` from an Angular application.

The recommended consumer surface is `@argfit-ui/adaptive`. Desktop and mobile packages are installed as renderer peers, but most application code should import adaptive components.

## Requirements

| Requirement | Alpha target |
| --- | --- |
| Angular | `21.x` standalone app |
| TypeScript | `5.9.x` |
| Package manager | pnpm, npm or another npm-compatible client |
| Rendering | Browser app for the full component catalog |

## Install From npm

Install ArgFit packages from the public npm registry in dependency order:

```bash
pnpm add @argfit-ui/core@0.1.0-alpha.0
pnpm add @argfit-ui/primitives@0.1.0-alpha.0
pnpm add @argfit-ui/desktop@0.1.0-alpha.0 @argfit-ui/mobile@0.1.0-alpha.0
pnpm add @argfit-ui/adaptive@0.1.0-alpha.0
```

Install the external peers required by the current alpha stack:

```bash
pnpm add @angular/cdk@^21.2.0 @ionic/angular@^8.8.7 @lucide/angular@^1.16.0 echarts@^6.1.0 primeng@^21.1.8
```

Angular packages should already be present in a normal Angular 21 app: `@angular/common`, `@angular/core`, `@angular/forms` and related framework packages.

## Install From Local Tarballs

When testing an unpublished local change or validating artifacts before release, generate tarballs first:

```bash
pnpm pack:alpha
```

Then install the generated artifacts from `dist/alpha-tarballs` in this order:

```bash
pnpm add ./dist/alpha-tarballs/argfit-ui-core-0.1.0-alpha.0.tgz
pnpm add ./dist/alpha-tarballs/argfit-ui-primitives-0.1.0-alpha.0.tgz
pnpm add ./dist/alpha-tarballs/argfit-ui-desktop-0.1.0-alpha.0.tgz ./dist/alpha-tarballs/argfit-ui-mobile-0.1.0-alpha.0.tgz
pnpm add ./dist/alpha-tarballs/argfit-ui-adaptive-0.1.0-alpha.0.tgz
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

If your app renders mobile components directly, initialize Ionic in the host app as usual for Ionic Angular. Adaptive consumers normally do not import Ionic components directly.

## Import Adaptive Components

Use standalone imports from `@argfit-ui/adaptive`:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AfButton, AfCard, AfCardContentDirective, AfCardHeaderDirective, AfCardTitleDirective, AfInput } from '@argfit-ui/adaptive';

@Component({
  selector: 'app-alpha-card',
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
export class AlphaCardComponent {}
```

## Smoke Test

After setup, run the consumer build:

```bash
pnpm build
```

The app should compile without importing PrimeNG, Ionic or ECharts from application components. Those dependencies are renderer implementation details behind ArgFit packages.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `Cannot find module @argfit-ui/core` | Install all five ArgFit packages from npm, or local tarballs in dependency order. |
| Peer dependency warning for `@argfit-ui/*` | Make sure every ArgFit package is exactly `0.1.0-alpha.0`. |
| Angular peer mismatch | Use Angular 21.x for this alpha. Older Angular versions are not supported. |
| Form component does not bind | Import `ReactiveFormsModule` in the standalone consumer component. |
| Mobile custom elements do not render | Confirm `@ionic/angular` is installed and the app supports custom elements. |
| Chart appears empty in SSR | Chart rendering is browser-oriented in the alpha; validate in a browser build. |

## Next Reading

- [Theming and platform](./theming.md)
- [Alpha components](./components.md)
- [Known limitations](./known-limitations.md)
- [Publish alpha procedure](./publish-alpha.md)
