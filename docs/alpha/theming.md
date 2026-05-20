# Alpha Theming And Adaptive Rendering

ArgFit UI is token-driven. Consumers configure the runtime once, then use semantic `Af*` components from `@argfit-ui/adaptive`.

## Register A Theme

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

The alpha ships with:

- `ARGFIT_DARK_THEME`
- `ARGFIT_LIGHT_THEME`
- `AF_BASE_THEME_TOKENS`
- `AF_THEME_TOKEN_NAMES`

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

Avoid styling internal PrimeNG or Ionic selectors from application code. If a component needs a missing visual capability, treat it as an ArgFit API request.

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
| `auto` | Uses viewport/media-query detection. |
| `desktop` | Forces desktop renderer components. |
| `mobile` | Forces mobile renderer components. |

## Consumer Rule

Application code should normally import from:

```ts
import { AfButton, AfCard, AfPageShell } from '@argfit-ui/adaptive';
```

Renderer packages are available for advanced cases, but direct app usage of `@argfit-ui/desktop` or `@argfit-ui/mobile` opts into renderer-specific behavior.
