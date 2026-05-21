# Beta Theming And Adaptive Rendering

ArgFit UI beta remains token-driven. Consumers configure the runtime once, then use semantic `Af*` components from `@argfit-ui/adaptive`.

## Bootstrap The Theme Runtime

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

The current beta contract ships with:

- `ARGFIT_DARK_THEME`
- `ARGFIT_LIGHT_THEME`
- `AF_BASE_THEME_TOKENS`
- `AF_THEME_TOKEN_NAMES`
- `AfThemeService`

## Switch Themes At Runtime

```ts
import { Component, inject } from '@angular/core';
import { ARGFIT_DARK_THEME, ARGFIT_LIGHT_THEME, AfThemeService } from '@argfit-ui/core';

@Component({
  selector: 'app-theme-toggle',
  template: `<button type="button" (click)="toggleTheme()">Theme</button>`,
})
export class ThemeToggleComponent {
  private readonly theme = inject(AfThemeService);

  toggleTheme(): void {
    this.theme.applyTheme(this.theme.isDarkTheme() ? ARGFIT_LIGHT_THEME : ARGFIT_DARK_THEME);
  }
}
```

## Token Contract

Visual values should come from `--af-*` custom properties. Consumer CSS can reference tokens for app-level layout without depending on PrimeNG or Ionic classes:

```css
.dashboard-panel {
  background: var(--af-bg-surface);
  border: 1px solid var(--af-border-soft);
  border-radius: var(--af-radius-lg);
  color: var(--af-text-main);
  padding: var(--af-space-4);
}
```

If you need to build token-aware utilities, import the token names from `@argfit-ui/core` instead of hardcoding vendor selectors or copying renderer internals.

## Adaptive Platform Preference

ArgFit chooses a renderer through `AfPlatformService`.

```ts
import { Component, inject } from '@angular/core';
import { AfPlatformService } from '@argfit-ui/core';

@Component({
  selector: 'app-platform-preview',
  template: `
    <button type="button" (click)="platform.setPreference('desktop')">Desktop</button>
    <button type="button" (click)="platform.setPreference('mobile')">Mobile</button>
    <button type="button" (click)="platform.setPreference('auto')">Auto</button>
  `,
})
export class PlatformPreviewComponent {
  protected readonly platform = inject(AfPlatformService);
}
```

Supported preferences:

| Preference | Behavior |
| --- | --- |
| `auto` | Uses viewport and media-query detection. |
| `desktop` | Forces desktop renderer components. |
| `mobile` | Forces mobile renderer components. |

## Consumer Theming Rules

- Prefer `@argfit-ui/adaptive` in application code.
- Treat PrimeNG and Ionic classes as internal implementation details.
- Override tokens or build app-level wrappers instead of styling renderer internals.
- Keep `experimental-in-beta` components behind app-level wrappers if your design system depends on them.
- Use the showcase as the visual reference for the current beta contract.

## Related Docs

- [Beta quickstart](./quickstart.md)
- [Beta public API](./public-api.md)
- [Beta package matrix](./package-matrix.md)
- [Beta component engine map](./component-engine-map.md)
- [Beta known limitations](./known-limitations.md)