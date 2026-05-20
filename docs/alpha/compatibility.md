# Alpha Compatibility Checklist

This document defines the minimum compatibility target for `0.1.0-alpha.0`.

The alpha is intended for real Angular validation, but not for long-term production stability. Breaking changes are allowed between alpha prereleases.

## Runtime And Tooling Target

| Area | Alpha target |
| --- | --- |
| Angular | Angular 21.x standalone applications |
| TypeScript | TypeScript 5.9.x |
| Package manager | pnpm 10.x in this workspace |
| Change detection | Components use OnPush |
| Angular patterns | Standalone components, signals and `inject()` |
| Styling | CSS custom properties with `--af-*` tokens |
| Forms | Reactive Forms and ControlValueAccessor for form controls that accept values |

## Package Compatibility

Consumers of `@argfit-ui/adaptive`, `@argfit-ui/core` and `@argfit-ui/primitives` should not need to import PrimeNG, Ionic or ECharts symbols in application code.

Renderer packages have implementation dependencies:

- `@argfit-ui/desktop` uses PrimeNG internally for selected desktop controls.
- `@argfit-ui/mobile` uses Ionic Angular/custom elements internally for selected mobile controls.
- Chart components use ECharts internally.
- Icon primitives use Lucide internally.

These providers are implementation details unless a consumer intentionally imports renderer packages directly.

## Minimum Consumer Smoke Checklist

A consumer app is compatible with the alpha when it can:

1. Install the selected ArgFit packages and matching Angular peer dependencies.
2. Register the runtime provider:

```ts
import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';

export const appConfig = {
  providers: [
    provideArgfitUi({
      theme: ARGFIT_DARK_THEME,
      platform: 'auto',
    }),
  ],
};
```

3. Import adaptive components in a standalone component:

```ts
import { AfButton, AfCard, AfInput } from '@argfit-ui/adaptive';
```

4. Render at least one adaptive component without importing PrimeNG, Ionic or ECharts in the application component.
5. Build the consumer app with Angular production build.
6. Use `formControl` or `formControlName` with `AfInput` and experimental form controls that implement CVA.
7. Toggle dark/light theme through `AfThemeService` without direct DOM manipulation by the consumer.

## Browser And Rendering Notes

- Target browsers are modern evergreen browsers that support CSS custom properties, modern flex/grid layout and custom elements.
- Mobile rendering expects a browser/runtime capable of Ionic custom elements.
- Chart components require browser DOM dimensions. Server-side rendering of charts is not guaranteed in the alpha.
- The theme runtime avoids direct DOM work outside the browser where applicable, but the full component catalog is validated primarily in browser-like Angular test environments.

## Vendor Independence Checklist

Before publishing an alpha prerelease, verify:

- `@argfit-ui/core` does not import PrimeNG, Ionic, desktop, mobile or adaptive packages.
- `@argfit-ui/primitives` does not import PrimeNG, Ionic, desktop, mobile or adaptive packages.
- `@argfit-ui/adaptive` does not import PrimeNG, Ionic or ECharts directly.
- Public adaptive exports use `Af*` names and ArgFit-owned types.
- `dist/argfit-ui-adaptive` declaration files do not expose PrimeNG, Ionic or ECharts types.
- Desktop/mobile renderer declarations do not expose vendor component classes as public input/output types.

## Validation Commands

Run these before considering HU-015 complete:

```bash
pnpm guard:architecture
pnpm build:libs
```

Recommended broader check before a publish candidate:

```bash
pnpm test:all
```

After `pnpm build:libs`, manually review the package entry declarations under `dist/argfit-ui-*/` and confirm they match `docs/alpha/public-api.md`.

## Known Alpha Limits

- No npm publish is performed by HU-015.
- Package versions and changelog are handled by later HUs.
- No compatibility promise is made for Angular versions older than 21.
- No SSR guarantee is made for chart rendering.
- Experimental components can change shape or move status in later alpha prereleases.
