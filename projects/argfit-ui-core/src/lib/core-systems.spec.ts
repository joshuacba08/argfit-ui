import { TestBed } from '@angular/core/testing';

import type { AfBadgeShape, AfBadgeSize, AfBadgeTone, AfBadgeVariant } from '../public-api';
import { provideArgfitUi } from './providers/provide-argfit-ui';
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

    theme.applyDarkTheme();

    const root = document.documentElement;
    expect(root.dataset['afTheme']).toBe('argfit-dark');
    expect(root.dataset['theme']).toBe('dark');
    expect(theme.currentThemeName()).toBe('argfit-dark');
    expect(theme.isDarkTheme()).toBe(true);
    expect(theme.isLightTheme()).toBe(false);
    expect(root.style.getPropertyValue('--af-bg-main')).toBe('#0A1628');
    expect(root.style.getPropertyValue('--af-primary')).toBe('#2599D5');
    expect(root.style.getPropertyValue('--af-color-accent-400')).toBe('#00D4FF');
    expect(root.style.getPropertyValue('--af-font-display')).toContain('Zalando Sans Expanded');
    expect(root.style.getPropertyValue('--af-duration-normal')).toBe('200ms');
  });

  it('applies the light theme tokens to the document root', () => {
    const theme = TestBed.inject(AfThemeService);

    theme.applyLightTheme();

    const root = document.documentElement;
    expect(root.dataset['afTheme']).toBe('argfit-light');
    expect(root.dataset['theme']).toBe('light');
    expect(theme.isLightTheme()).toBe(true);
    expect(theme.isDarkTheme()).toBe(false);
    expect(root.style.getPropertyValue('--af-bg-main')).toBe('#F0F4F8');
    expect(root.style.getPropertyValue('--af-text-main')).toBe('#102A43');
    expect(root.style.getPropertyValue('--af-primary')).toBe('#2599D5');
  });

  it('toggles between dark and light themes', () => {
    const theme = TestBed.inject(AfThemeService);

    theme.applyDarkTheme();
    expect(theme.isDarkTheme()).toBe(true);

    theme.toggleTheme();
    expect(theme.currentThemeName()).toBe('argfit-light');
    expect(theme.isLightTheme()).toBe(true);
    expect(document.documentElement.dataset['theme']).toBe('light');

    theme.toggleTheme();
    expect(theme.currentThemeName()).toBe('argfit-dark');
    expect(theme.isDarkTheme()).toBe(true);
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('honours the theme passed to provideArgfitUi', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideArgfitUi({ theme: ARGFIT_LIGHT_THEME })],
    });

    const theme = TestBed.inject(AfThemeService);

    expect(theme.currentThemeName()).toBe('argfit-light');
    expect(theme.isLightTheme()).toBe(true);
    expect(document.documentElement.dataset['afTheme']).toBe('argfit-light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('declares every token required by the design system contract', () => {
    for (const tokenName of AF_THEME_TOKEN_NAMES) {
      expect(ARGFIT_DARK_THEME.tokens[tokenName]).toBeTruthy();
      expect(ARGFIT_LIGHT_THEME.tokens[tokenName]).toBeTruthy();
    }
  });

  it('exports the badge contract through the public API', () => {
    const contract: {
      tone: AfBadgeTone;
      variant: AfBadgeVariant;
      size: AfBadgeSize;
      shape: AfBadgeShape;
    } = {
      tone: 'success',
      variant: 'soft',
      size: 'sm',
      shape: 'pill',
    };

    expect(contract).toEqual({
      tone: 'success',
      variant: 'soft',
      size: 'sm',
      shape: 'pill',
    });
  });
});
