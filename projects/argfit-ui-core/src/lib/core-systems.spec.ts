import { TestBed } from '@angular/core/testing';

import { AfPlatformService } from './services/platform.service';
import { AfThemeService } from './themes/theme.service';

describe('ArgFit core systems', () => {
  it('allows platform preference overrides', () => {
    const platform = TestBed.inject(AfPlatformService);

    platform.setPreference('mobile');
    expect(platform.platform()).toBe('mobile');

    platform.setPreference('desktop');
    expect(platform.platform()).toBe('desktop');
  });

  it('applies the default theme tokens to the document root', () => {
    const theme = TestBed.inject(AfThemeService);

    theme.applyDefaultTheme();

    expect(document.documentElement.dataset['afTheme']).toBe('argfit-dark');
    expect(document.documentElement.style.getPropertyValue('--af-primary')).toBe('#38bdf8');
  });
});
