import { TestBed } from '@angular/core/testing';
import { ARGFIT_DARK_THEME, AfThemeService, provideArgfitUi } from '@argfit-ui/core';
import { providePrimeNG } from 'primeng/config';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideArgfitUi({ platform: 'desktop', theme: ARGFIT_DARK_THEME }),
        providePrimeNG(),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the showcase shell', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Adaptive enterprise UI');
  });

  it('should toggle the active theme', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const theme = TestBed.inject(AfThemeService);
    expect(theme.isDarkTheme()).toBe(true);

    const toggle = fixture.nativeElement.querySelector('.theme-toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    expect(theme.isLightTheme()).toBe(true);
    expect(document.documentElement.dataset['theme']).toBe('light');
  });
});
