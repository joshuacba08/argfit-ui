import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { AF_UI_CONFIG } from '../config/argfit-ui.config';
import { ARGFIT_DARK_THEME } from './argfit-dark.theme';
import type { AfThemeDefinition } from './theme.types';

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

  constructor() {
    this.applyTheme(this.currentThemeSignal());
  }

  applyDefaultTheme(): void {
    this.applyTheme(ARGFIT_DARK_THEME);
  }

  applyTheme(theme: AfThemeDefinition): void {
    this.currentThemeSignal.set(theme);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;
    root.dataset['afTheme'] = theme.name;

    for (const [tokenName, tokenValue] of Object.entries(theme.tokens)) {
      root.style.setProperty(tokenName, tokenValue);
    }
  }
}
