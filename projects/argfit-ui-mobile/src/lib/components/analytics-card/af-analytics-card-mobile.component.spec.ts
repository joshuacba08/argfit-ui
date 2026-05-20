import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfAnalyticsCardState } from '@argfit-ui/core';

import { AfAnalyticsCardMobileComponent } from './af-analytics-card-mobile.component';

@Component({
  standalone: true,
  imports: [AfAnalyticsCardMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-analytics-card-mobile
      title="Performance Score"
      subtitle="Resumen mobile"
      tone="accent"
      height="180px"
      [state]="state()"
      emptyTitle="Sin performance"
      errorTitle="Error mobile"
      errorDescription="Sin conexion"
    >
      <div afAnalyticsCardActions class="actions-slot">14 dias</div>
      <div afAnalyticsCardMetrics class="metrics-slot">78 pts</div>
      <div class="chart-slot">Gauge mobile</div>
      <div afAnalyticsCardLegend class="legend-slot">Salto Fuerza RSI</div>
      <div afAnalyticsCardFooter class="footer-slot">Actualizado hoy</div>
    </af-analytics-card-mobile>
  `,
})
class AnalyticsCardMobileHostComponent {
  readonly state = signal<AfAnalyticsCardState>('ready');
}

describe('AfAnalyticsCardMobileComponent', () => {
  it('renders projected content and mobile slots', async () => {
    const fixture = TestBed.createComponent(AnalyticsCardMobileHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-analytics-card-mobile')).not.toBeNull();
    expect(root.textContent).toContain('Performance Score');
    expect(root.querySelector('.actions-slot')?.textContent).toContain('14 dias');
    expect(root.querySelector('.metrics-slot')?.textContent).toContain('78 pts');
    expect(root.querySelector('.chart-slot')?.textContent).toContain('Gauge mobile');
    expect(root.querySelector('.legend-slot')?.textContent).toContain('Salto');
    expect(root.querySelector('.footer-slot')?.textContent).toContain('Actualizado hoy');
  });

  it('renders loading, empty and error states', async () => {
    const fixture = TestBed.createComponent(AnalyticsCardMobileHostComponent);
    const host = fixture.componentInstance;

    host.state.set('loading');
    fixture.detectChanges();
    await fixture.whenStable();
    let root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.af-analytics-card-mobile__skeleton')).not.toBeNull();

    host.state.set('empty');
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Sin performance');

    host.state.set('error');
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('Sin conexion');
  });
});
