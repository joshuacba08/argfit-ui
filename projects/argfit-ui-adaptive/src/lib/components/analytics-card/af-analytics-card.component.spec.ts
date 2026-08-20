import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';

import {
    AfAnalyticsCardActionsDirective,
    AfAnalyticsCardFooterDirective,
    AfAnalyticsCardLegendDirective,
    AfAnalyticsCardMetricsDirective,
} from './af-analytics-card-slots.directive';
import { AfAnalyticsCardComponent } from './af-analytics-card.component';

@Component({
  standalone: true,
  imports: [
    AfAnalyticsCardComponent,
    AfAnalyticsCardActionsDirective,
    AfAnalyticsCardMetricsDirective,
    AfAnalyticsCardLegendDirective,
    AfAnalyticsCardFooterDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-analytics-card title="Comparacion atletas" subtitle="Perfil radar" tone="accent">
      <div afAnalyticsCardActions class="actions-slot">Selector</div>
      <div afAnalyticsCardMetrics class="metrics-slot">Delta +12%</div>
      <div class="content-slot">Radar proyectado</div>
      <div afAnalyticsCardLegend class="legend-slot">Maria Santiago</div>
      <div afAnalyticsCardFooter class="footer-slot">2 atletas</div>
    </af-analytics-card>
  `,
})
class AdaptiveAnalyticsCardHostComponent {}

/**
 * Dos tarjetas de contenido desigual en una grilla: el caso en que la superficie se
 * quedaba en su altura intrínseca y dejaba la fila descuadrada.
 */
@Component({
  imports: [AfAnalyticsCardComponent],
  template: `
    <div style="display: grid; grid-template-columns: 1fr 1fr">
      <af-analytics-card title="Comparación de atletas" subtitle="Perfil radar completo" [fill]="fill()">
        <div class="content-slot">Radar proyectado con leyenda extensa</div>
      </af-analytics-card>
      <af-analytics-card title="Resumen" [fill]="fill()">
        <div class="content-slot">Corto</div>
      </af-analytics-card>
    </div>
  `,
})
class AnalyticsCardFillHostComponent {
  readonly fill = signal(false);
}

describe('AfAnalyticsCardComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop and projects all analytics slots', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveAnalyticsCardHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveAnalyticsCardHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-analytics-card-desktop')).not.toBeNull();
    expect(root.querySelector('af-analytics-card-mobile')).toBeNull();
    expect(root.querySelector('.actions-slot')?.textContent).toContain('Selector');
    expect(root.querySelector('.metrics-slot')?.textContent).toContain('Delta');
    expect(root.querySelector('.content-slot')?.textContent).toContain('Radar proyectado');
    expect(root.querySelector('.legend-slot')?.textContent).toContain('Maria');
    expect(root.querySelector('.footer-slot')?.textContent).toContain('2 atletas');
  });

  it('renders mobile using the same public API', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveAnalyticsCardHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveAnalyticsCardHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-analytics-card-mobile')).not.toBeNull();
    expect(root.querySelector('af-analytics-card-desktop')).toBeNull();
    expect(root.querySelector('.content-slot')?.textContent).toContain('Radar proyectado');
  });
});

/**
 * jsdom no calcula layout — `offsetHeight` siempre es 0 — así que acá se verifica el
 * contrato que produce la altura, no la altura resultante.
 */
describe('AfAnalyticsCardComponent — contrato de altura', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  async function setupFill(platform: 'desktop' | 'mobile' = 'desktop') {
    await TestBed.configureTestingModule({
      imports: [AnalyticsCardFillHostComponent],
      providers: [provideArgfitUi({ platform })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AnalyticsCardFillHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('deja que la superficie mida lo que mide el host', async () => {
    const fixture = await setupFill();
    const hosts = fixture.nativeElement.querySelectorAll('af-analytics-card') as NodeListOf<HTMLElement>;

    expect(hosts).toHaveLength(2);

    for (const host of hosts) {
      expect(getComputedStyle(host).display).toBe('flex');

      const renderer = host.querySelector('af-analytics-card-desktop') as HTMLElement;
      const surface = renderer.querySelector('.af-analytics-card-desktop__surface') as HTMLElement;

      expect(renderer.parentElement).toBe(host);
      expect(getComputedStyle(renderer).display).toBe('flex');
      expect(getComputedStyle(surface).flexGrow).toBe('1');
    }
  });

  it('no marca `fill` cuando nadie lo pidió', async () => {
    const fixture = await setupFill();
    const host = fixture.nativeElement.querySelector('af-analytics-card') as HTMLElement;
    const renderer = host.querySelector('af-analytics-card-desktop') as HTMLElement;

    expect(host.getAttribute('data-fill')).toBeNull();
    expect(renderer.getAttribute('data-fill')).toBeNull();
  });

  it('propaga `fill` al host y al renderer', async () => {
    const fixture = await setupFill();
    fixture.componentInstance.fill.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('af-analytics-card') as HTMLElement;
    const renderer = host.querySelector('af-analytics-card-desktop') as HTMLElement;

    expect(host.getAttribute('data-fill')).toBe('');
    expect(renderer.getAttribute('data-fill')).toBe('');
    expect(renderer.className).toContain('af-analytics-card-desktop--fill');
    expect(getComputedStyle(renderer).blockSize).toBe('100%');
  });

  it('aplica el mismo contrato en móvil', async () => {
    const fixture = await setupFill('mobile');
    fixture.componentInstance.fill.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('af-analytics-card') as HTMLElement;
    const renderer = host.querySelector('af-analytics-card-mobile') as HTMLElement;
    const surface = renderer.querySelector('.af-analytics-card-mobile__surface') as HTMLElement;

    expect(renderer.parentElement).toBe(host);
    expect(renderer.getAttribute('data-fill')).toBe('');
    expect(getComputedStyle(surface).flexGrow).toBe('1');
  });
});
