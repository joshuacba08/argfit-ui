import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { AF_UI_CONFIG } from '../config/argfit-ui.config';
import { ARGFIT_DARK_THEME } from './argfit-dark.theme';
import { ARGFIT_LIGHT_THEME } from './argfit-light.theme';
import type { AfThemeDefinition } from './theme.types';

/**
 * Runtime API for applying ArgFit themes.
 *
 * Themes are CSS-custom-property maps; this service writes them onto
 * `document.documentElement` along with `data-af-theme` and `data-theme`
 * attributes so styles and external tooling can react to the active theme.
 */
@Injectable({
  providedIn: 'root',
})
export class AfThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config = inject(AF_UI_CONFIG);
  private readonly currentThemeSignal = signal<AfThemeDefinition>(
    this.config.theme ?? ARGFIT_DARK_THEME,
  );

  readonly currentTheme = this.currentThemeSignal.asReadonly();
  readonly currentThemeName = computed(() => this.currentThemeSignal().name);
  readonly currentThemeKind = computed(() => this.currentThemeSignal().kind);
  readonly isDarkTheme = computed(() => this.currentThemeSignal().kind === 'dark');
  readonly isLightTheme = computed(() => this.currentThemeSignal().kind === 'light');

  constructor() {
    this.applyTheme(this.currentThemeSignal());
  }

  applyDefaultTheme(): void {
    this.applyTheme(ARGFIT_DARK_THEME);
  }

  applyDarkTheme(): void {
    this.applyTheme(ARGFIT_DARK_THEME);
  }

  applyLightTheme(): void {
    this.applyTheme(ARGFIT_LIGHT_THEME);
  }

  toggleTheme(): void {
    this.applyTheme(this.isDarkTheme() ? ARGFIT_LIGHT_THEME : ARGFIT_DARK_THEME);
  }

  applyTheme(theme: AfThemeDefinition): void {
    this.currentThemeSignal.set(theme);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;
    root.dataset['afTheme'] = theme.name;
    root.dataset['theme'] = theme.kind;
    root.style.colorScheme = theme.kind;

    for (const [tokenName, tokenValue] of Object.entries(theme.tokens)) {
      root.style.setProperty(tokenName, tokenValue);
    }
  }
}
