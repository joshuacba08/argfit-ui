import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfAnalyticsCardState } from '@argfit-ui/core';

import { AfAnalyticsCardDesktopComponent } from './af-analytics-card-desktop.component';

@Component({
  standalone: true,
  imports: [AfAnalyticsCardDesktopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-analytics-card-desktop
      title="Sesiones mensuales"
      subtitle="Distribucion por tipo de test"
      tone="primary"
      variant="outline"
      height="220px"
      [state]="state()"
      emptyTitle="Sin sesiones"
      emptyDescription="Conecta un dispositivo"
      errorTitle="No se pudo cargar"
      errorDescription="Timeout de API"
    >
      <div afAnalyticsCardActions class="actions-slot">3M</div>
      <div afAnalyticsCardMetrics class="metrics-slot">+8.2%</div>
      <div class="chart-slot">Chart proyectado</div>
      <div afAnalyticsCardLegend class="legend-slot">CMJ SJ DJ</div>
      <div afAnalyticsCardFooter class="footer-slot">12 sesiones</div>
    </af-analytics-card-desktop>
  `,
})
class AnalyticsCardDesktopHostComponent {
  readonly state = signal<AfAnalyticsCardState>('ready');
}

describe('AfAnalyticsCardDesktopComponent', () => {
  it('renders title, subtitle, actions, metrics, content, legend and footer', async () => {
    const fixture = TestBed.createComponent(AnalyticsCardDesktopHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const card = root.querySelector('af-analytics-card-desktop') as HTMLElement;
    expect(card).not.toBeNull();
    expect(card.getAttribute('data-tone')).toBe('primary');
    expect(card.getAttribute('data-variant')).toBe('outline');
    expect(root.textContent).toContain('Sesiones mensuales');
    expect(root.textContent).toContain('Distribucion por tipo de test');
    expect(root.querySelector('.actions-slot')?.textContent).toContain('3M');
    expect(root.querySelector('.metrics-slot')?.textContent).toContain('+8.2%');
    expect(root.querySelector('.chart-slot')?.textContent).toContain('Chart proyectado');
    expect(root.querySelector('.legend-slot')?.textContent).toContain('CMJ');
    expect(root.querySelector('.footer-slot')?.textContent).toContain('12 sesiones');
  });

  it('renders loading, empty and error states', async () => {
    const fixture = TestBed.createComponent(AnalyticsCardDesktopHostComponent);
    const host = fixture.componentInstance;

    host.state.set('loading');
    fixture.detectChanges();
    await fixture.whenStable();
    let root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.af-analytics-card-desktop__skeleton')).not.toBeNull();
    expect(root.querySelector('af-analytics-card-desktop')?.getAttribute('aria-busy')).toBe('true');

    host.state.set('empty');
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Sin sesiones');
    expect(root.textContent).toContain('Conecta un dispositivo');

    host.state.set('error');
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('Timeout de API');
  });
});
