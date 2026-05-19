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

  it('should render the AfCard vertical slice with all variants', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('af-card-desktop');
    expect(cards.length).toBeGreaterThanOrEqual(4);

    const variants = Array.from(cards).map((card) => card.getAttribute('data-variant'));
    expect(variants).toContain('surface');
    expect(variants).toContain('metric');
    expect(variants).toContain('device');
    expect(variants).toContain('panel');

    const interactiveCard = compiled.querySelector(
      'af-card-desktop[data-interactive]',
    ) as HTMLElement | null;
    expect(interactiveCard).not.toBeNull();
  });

  it('should render the AfInput vertical slice with reactive form binding', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const inputs = compiled.querySelectorAll('af-input-desktop');
    expect(inputs.length).toBeGreaterThanOrEqual(6);

    const heightInput = Array.from(
      compiled.querySelectorAll('af-input-desktop'),
    ).find((host) => host.querySelector('label')?.textContent?.includes('Altura'));
    expect(heightInput).toBeTruthy();

    const nativeInput = heightInput!.querySelector('input') as HTMLInputElement;
    expect(nativeInput.value).toBe('178');

    nativeInput.value = '182';
    nativeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance['heightControl'].value).toBe('182');
  });
});
