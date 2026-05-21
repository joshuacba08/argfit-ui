import { TestBed } from '@angular/core/testing';
import { ARGFIT_DARK_THEME, AfPlatformService, AfThemeService, AfToastService, provideArgfitUi } from '@argfit-ui/core';
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
    expect(compiled.querySelector('af-page-shell-desktop')).not.toBeNull();
    expect(compiled.querySelector('h1')?.textContent).toContain('Dashboard');
  });

  it('renders the AfPageShell desktop navigation contract', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('main.af-page-shell-desktop__content')).not.toBeNull();
    expect(compiled.querySelector('nav.af-sidebar-desktop__nav')).not.toBeNull();
    const navItems = compiled.querySelectorAll('.af-sidebar-desktop__item');
    expect(navItems.length).toBeGreaterThanOrEqual(5);
    expect(compiled.querySelector('.af-sidebar-desktop__item--active')?.getAttribute('aria-current')).toBe(
      'page',
    );
    expect(compiled.querySelectorAll('.af-topbar-desktop__breadcrumbs li').length).toBeGreaterThanOrEqual(2);
    expect(compiled.querySelector('.af-topbar-desktop__search input')).not.toBeNull();
    expect(compiled.querySelector('.af-topbar-desktop__notification af-badge-desktop')?.textContent?.trim()).toBe(
      '3',
    );
  });

  it('renders the AfPageShell mobile tabs contract', async () => {
    const platform = TestBed.inject(AfPlatformService);
    platform.setPreference('mobile');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const tabs = compiled.querySelectorAll('.af-bottom-tabs-mobile__item');
    expect(compiled.querySelector('af-page-shell-mobile')).not.toBeNull();
    expect(compiled.querySelector('main.af-page-shell-mobile__content')).not.toBeNull();
    expect(compiled.querySelector('nav.af-bottom-tabs-mobile__nav')).not.toBeNull();
    expect(tabs.length).toBeGreaterThanOrEqual(4);
    expect(compiled.querySelector('.af-bottom-tabs-mobile__item--active')?.getAttribute('aria-current')).toBe(
      'page',
    );
  });

  it('switches local sections without Router navigation', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const athletes = Array.from(compiled.querySelectorAll('button.af-sidebar-desktop__item')).find(
      (button) => button.textContent?.includes('Atletas'),
    ) as HTMLButtonElement;

    athletes.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('.shell-section h2')?.textContent?.trim()).toBe('Atletas');
  });

  it('renders the beta consumer showcase section inside the alpha slot', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance['activeShellSection'].set('alpha');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alpha-view')).not.toBeNull();
    expect(compiled.textContent).toContain('Beta+ consumer kit');
    expect(compiled.textContent).toContain('Beta+ wave 1');
    expect(compiled.querySelector('a[href="docs/beta/quickstart.md"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="docs/beta/components.md"]')).not.toBeNull();
    expect(compiled.querySelector('af-input-desktop')).not.toBeNull();
    expect(compiled.querySelector('af-chart-desktop')).not.toBeNull();
    expect(compiled.querySelectorAll('af-metric-card-desktop').length).toBeGreaterThanOrEqual(2);
    expect(compiled.querySelector('.alpha-dialog-preview af-button-desktop')).not.toBeNull();
    expect(compiled.querySelector('.alpha-wave-grid af-avatar-desktop')).not.toBeNull();
    expect(compiled.querySelectorAll('.alpha-wave-grid af-chip-desktop').length).toBeGreaterThanOrEqual(3);
    expect(compiled.querySelectorAll('.alpha-wave-grid af-progress-desktop').length).toBeGreaterThanOrEqual(3);
    expect(compiled.querySelector('.alpha-wave-grid af-tooltip-desktop')).not.toBeNull();
    expect(compiled.querySelector('.alpha-wave-grid af-popover-desktop')).not.toBeNull();
    expect(compiled.querySelector('af-drawer-desktop')).not.toBeNull();
    expect(compiled.textContent).toContain('Adaptive API');
    expect(compiled.textContent).toContain('Beta+ wave 1');
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

  it('should render the AfBadge vertical slice with tones, dots, tags and icons', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const badges = compiled.querySelectorAll('af-badge-desktop');
    expect(badges.length).toBeGreaterThanOrEqual(10);

    const tones = Array.from(badges).map((badge) => badge.getAttribute('data-tone'));
    expect(tones).toContain('primary');
    expect(tones).toContain('accent');
    expect(tones).toContain('success');
    expect(tones).toContain('warning');
    expect(tones).toContain('danger');
    expect(tones).toContain('neutral');

    const variants = Array.from(badges).map((badge) => badge.getAttribute('data-variant'));
    expect(variants).toContain('solid');
    expect(variants).toContain('tag');

    expect(compiled.querySelector('.af-badge-desktop__dot')).not.toBeNull();
    expect(compiled.querySelector('af-badge-desktop af-icon')).not.toBeNull();
  });

  it('renders the AfMetricCard vertical slice with icons, trends and loading', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const metrics = compiled.querySelectorAll('af-metric-card-desktop');
    expect(metrics.length).toBeGreaterThanOrEqual(8);

    const tones = Array.from(metrics).map((metric) => metric.getAttribute('data-tone'));
    expect(tones).toContain('primary');
    expect(tones).toContain('accent');
    expect(tones).toContain('success');
    expect(tones).toContain('warning');
    expect(tones).toContain('neutral');

    expect(compiled.querySelector('af-metric-card-desktop af-icon')).not.toBeNull();
    expect(compiled.querySelector('af-metric-card-desktop af-badge-desktop[data-tone="success"]')).not.toBeNull();
    expect(compiled.querySelector('af-metric-card-desktop af-badge-desktop[data-tone="danger"]')).not.toBeNull();
    expect(compiled.querySelector('af-metric-card-desktop af-badge-desktop[data-tone="neutral"]')).not.toBeNull();
    expect(compiled.querySelector('af-metric-card-desktop[data-loading]')).not.toBeNull();
  });

  it('renders the AfDataTable showcase with sorting, selection, badges and empty state', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance['activeShellSection'].set('data-table');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('af-data-table-desktop')).not.toBeNull();
    expect(compiled.querySelectorAll('tbody tr[tabindex="0"]').length).toBeGreaterThanOrEqual(8);
    expect(compiled.querySelector('th[aria-sort="descending"]')?.textContent).toContain('Mejor salto');
    expect(compiled.querySelector('.af-data-table-desktop__selection-bar')?.textContent).toContain(
      '2 seleccionados',
    );
    expect(compiled.querySelector('af-data-table-desktop af-badge-desktop')).not.toBeNull();
    expect(compiled.querySelector('.af-data-table-desktop__pagination')?.textContent).toContain(
      'Mostrando 1-8 de 12',
    );
    expect(compiled.querySelector('.athlete-expanded-row')?.textContent).toContain('Santiago Perez');
    expect(compiled.querySelector('.athlete-expanded-row')?.textContent).toContain('Ultimas sesiones');
    expect(compiled.querySelector('.athlete-expanded-row')?.textContent).toContain('Progreso 6 sesiones');
    expect(compiled.querySelector('.athlete-expanded-row')?.textContent).toContain('Exportar datos');

    fixture.componentInstance['updateAthleteTableSearch']('sin-coincidencias');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('.data-table-empty')?.textContent).toContain('Sin atletas encontrados');
  });

  it('renders the AfDataTable mobile list alternative', async () => {
    const platform = TestBed.inject(AfPlatformService);
    platform.setPreference('mobile');

    const fixture = TestBed.createComponent(App);
    fixture.componentInstance['activeShellSection'].set('data-table');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('af-data-table-mobile')).not.toBeNull();
    expect(compiled.querySelector('af-data-table-desktop')).toBeNull();
    expect(compiled.querySelector('af-data-table-mobile table')).toBeNull();
    expect(compiled.querySelectorAll('af-data-table-mobile [role="listitem"]').length).toBeGreaterThanOrEqual(8);
  });

  it('renders the AfAnalyticsCard showcase with charts, slots and states', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance['activeShellSection'].set('analytics');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const analyticsCards = compiled.querySelectorAll('af-analytics-card-desktop');
    expect(analyticsCards.length).toBeGreaterThanOrEqual(7);
    expect(compiled.textContent).toContain('Performance Score');
    expect(compiled.textContent).toContain('Sesiones mensuales');
    expect(compiled.textContent).toContain('Comparacion atletas');
    expect(compiled.querySelector('.analytics-period-control')).not.toBeNull();
    expect(compiled.querySelector('.analytics-metric-strip af-metric-card-desktop')).not.toBeNull();
    expect(compiled.querySelector('.analytics-legend')).not.toBeNull();
    expect(compiled.querySelector('af-analytics-card-desktop[data-state="loading"]')).not.toBeNull();
    expect(compiled.querySelector('af-analytics-card-desktop[data-state="empty"]')?.textContent).toContain(
      'Sin datos de analytics',
    );
    expect(compiled.querySelector('af-analytics-card-desktop[data-state="error"]')?.textContent).toContain(
      'El servicio de analytics no respondio',
    );

    const chartTypes = Array.from(compiled.querySelectorAll('af-chart-desktop')).map((chart) =>
      chart.getAttribute('data-type'),
    );
    expect(chartTypes).toContain('gauge');
    expect(chartTypes).toContain('donut');
    expect(chartTypes).toContain('heatmap');
    expect(chartTypes).toContain('boxplot');
    expect(chartTypes).toContain('parallel');
  });

  it('renders the AfFormControls showcase tabs with reactive forms', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance['activeShellSection'].set('forms');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Controles adaptativos');
    expect(compiled.querySelector('af-segmented-control-desktop')).not.toBeNull();
    expect(compiled.querySelector('af-select-desktop')).not.toBeNull();
    expect(compiled.querySelector('af-textarea-desktop')).not.toBeNull();
    expect(compiled.querySelector('af-toggle-desktop')).not.toBeNull();
    expect(compiled.querySelector('af-radio-group-desktop')).not.toBeNull();
    expect(compiled.querySelector('af-password-desktop')).not.toBeNull();
    expect(compiled.querySelector('af-password-desktop .af-password-desktop__toggle')).not.toBeNull();
    expect(compiled.textContent).toContain('Registro operativo');

    fixture.componentInstance['setFormsTab']('test');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.textContent).toContain('Parametros de sesion');
    expect(compiled.querySelectorAll('af-toggle-desktop').length).toBeGreaterThanOrEqual(3);

    fixture.componentInstance['setFormsTab']('export');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.textContent).toContain('Reporte para staff');
    expect(compiled.querySelectorAll('af-checkbox-desktop').length).toBeGreaterThanOrEqual(3);
  });

  it('renders the AfFormControls mobile showcase alternative', async () => {
    const platform = TestBed.inject(AfPlatformService);
    platform.setPreference('mobile');

    const fixture = TestBed.createComponent(App);
    fixture.componentInstance['activeShellSection'].set('forms');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('af-page-shell-mobile')).not.toBeNull();
    expect(compiled.querySelector('af-select-mobile')).not.toBeNull();
    expect(compiled.querySelector('af-textarea-mobile')).not.toBeNull();
    expect(compiled.querySelector('af-toggle-mobile')).not.toBeNull();
    expect(compiled.querySelector('af-radio-group-mobile')).not.toBeNull();
    expect(compiled.querySelector('af-password-mobile')).not.toBeNull();
    expect(compiled.querySelector('af-password-mobile ion-input-password-toggle')).not.toBeNull();
    expect(compiled.textContent).toContain('Nuevo atleta');
  });

  it('renders the HU-014 feedback toast showcase', async () => {
    const fixture = TestBed.createComponent(App);
    const toastService = TestBed.inject(AfToastService);
    fixture.componentInstance['activeShellSection'].set('feedback');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('af-toast-viewport-desktop')).not.toBeNull();
    expect(compiled.querySelectorAll('af-inline-message-desktop').length).toBeGreaterThanOrEqual(3);
    expect(compiled.querySelector('af-inline-message-desktop[role="status"][aria-live="polite"]')).not.toBeNull();
    expect(compiled.querySelector('af-inline-message-desktop[role="alert"][aria-live="assertive"]')).not.toBeNull();
    expect(compiled.textContent).toContain('Feedback operativo');
    expect(compiled.textContent).toContain('Sesion sincronizada');
    expect(compiled.textContent).toContain('Toast viewport');

    fixture.componentInstance['showFeedbackToast']('success');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('af-toast-desktop')?.textContent).toContain('Sesion guardada');
    expect(compiled.querySelector('af-toast-desktop[role="status"][aria-live="polite"]')).not.toBeNull();
    toastService.clear();
  });

  it('should render the AfInput vertical slice with reactive form binding', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const inputs = compiled.querySelectorAll('af-input-desktop');
    expect(inputs.length).toBeGreaterThanOrEqual(6);

    const heightInput = Array.from(compiled.querySelectorAll('af-input-desktop')).find((host) =>
      host.querySelector('label')?.textContent?.includes('Altura'),
    );
    expect(heightInput).toBeTruthy();

    const nativeInput = heightInput!.querySelector('input') as HTMLInputElement;
    expect(nativeInput.value).toBe('178');

    nativeInput.value = '182';
    nativeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance['heightControl'].value).toBe('182');
  });

  it('opens and closes the AfDialog vertical slice', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.af-dialog-desktop__panel')).toBeNull();

    const triggers = compiled.querySelectorAll('.dialog-trigger-grid af-button-desktop button');
    expect(triggers.length).toBeGreaterThanOrEqual(3);

    const detailsTrigger = Array.from(triggers).find((button) =>
      button.textContent?.includes('Ver dispositivo'),
    ) as HTMLButtonElement;
    detailsTrigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = document.querySelector('.af-dialog-desktop__panel') as HTMLElement;
    expect(panel).not.toBeNull();
    expect(panel.querySelector('.af-dialog-desktop__title')?.textContent?.trim()).toBe(
      'Detalles del dispositivo',
    );

    const close = panel.querySelector('.af-dialog-desktop__close') as HTMLButtonElement;
    close.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('.af-dialog-desktop__panel')).toBeNull();
  });

  it('renders the AfIcon gallery with accessible labels and tokens', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const searchInputIcon = compiled.querySelector(
      'af-input-desktop af-icon',
    ) as HTMLElement | null;
    expect(searchInputIcon).not.toBeNull();

    const settings = Array.from(compiled.querySelectorAll('button.af-sidebar-desktop__item')).find(
      (button) => button.textContent?.includes('Configuracion'),
    ) as HTMLButtonElement;

    settings.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const iconCells = compiled.querySelectorAll('.icon-cell af-icon');
    expect(iconCells.length).toBeGreaterThanOrEqual(12);

    const firstSvg = iconCells[0].querySelector('svg') as SVGElement;
    expect(firstSvg).not.toBeNull();
    expect(firstSvg.getAttribute('role')).toBe('img');
    expect(firstSvg.querySelector('title')?.textContent ?? '').not.toBe('');
  });

  it('renders the AfChart vertical slice with empty and ready states', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const charts = compiled.querySelectorAll('af-chart-desktop');
    expect(charts.length).toBeGreaterThanOrEqual(8);

    const states = Array.from(charts).map((c) => c.getAttribute('data-state'));
    expect(states).toContain('ready');
    expect(states).toContain('empty');

    const types = Array.from(charts).map((c) => c.getAttribute('data-type'));
    expect(types).toContain('gauge');
    expect(types).toContain('donut');
    expect(types).toContain('area');
    expect(types).toContain('stacked-bar');
    expect(types).toContain('horizontal-bar');
    expect(types).toContain('radar');
    expect(types).toContain('sparkline');

    const empty = compiled.querySelector('af-chart-desktop[data-state="empty"]') as HTMLElement;
    expect(empty.querySelector('.af-chart-desktop__empty')?.textContent?.trim()).toContain(
      'Conecta',
    );
  });
});
