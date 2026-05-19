import { TestBed } from '@angular/core/testing';

import { AfPlatformService } from './services/platform.service';
import { ARGFIT_DARK_THEME } from './themes/argfit-dark.theme';
import { ARGFIT_LIGHT_THEME } from './themes/argfit-light.theme';
import { AfThemeService } from './themes/theme.service';
import { AF_THEME_TOKEN_NAMES } from './tokens/theme-token-names';

describe('ArgFit core systems', () => {
  it('allows platform preference overrides', () => {
    const platform = TestBed.inject(AfPlatformService);

    platform.setPreference('mobile');
    expect(platform.platform()).toBe('mobile');

    platform.setPreference('desktop');
    expect(platform.platform()).toBe('desktop');
  });

  it('applies the dark theme tokens to the document root', () => {
    const theme = TestBed.inject(AfThemeService);

    theme.applyTheme(ARGFIT_DARK_THEME);

    const root = document.documentElement;
    expect(root.dataset['afTheme']).toBe('argfit-dark');
    expect(root.style.getPropertyValue('--af-bg-main')).toBe('#0A1628');
    expect(root.style.getPropertyValue('--af-primary')).toBe('#2599D5');
    expect(root.style.getPropertyValue('--af-color-accent-400')).toBe('#00D4FF');
    expect(root.style.getPropertyValue('--af-font-display')).toContain('Zalando Sans Expanded');
    expect(root.style.getPropertyValue('--af-duration-normal')).toBe('200ms');
  });

  it('applies the light theme tokens to the document root', () => {
    const theme = TestBed.inject(AfThemeService);

    theme.applyTheme(ARGFIT_LIGHT_THEME);

    const root = document.documentElement;
    expect(root.dataset['afTheme']).toBe('argfit-light');
    expect(root.style.getPropertyValue('--af-bg-main')).toBe('#F0F4F8');
    expect(root.style.getPropertyValue('--af-text-main')).toBe('#102A43');
    expect(root.style.getPropertyValue('--af-primary')).toBe('#2599D5');
  });

  it('declares every token required by the design system contract', () => {
    for (const tokenName of AF_THEME_TOKEN_NAMES) {
      expect(ARGFIT_DARK_THEME.tokens[tokenName]).toBeTruthy();
      expect(ARGFIT_LIGHT_THEME.tokens[tokenName]).toBeTruthy();
    }
  });
});
