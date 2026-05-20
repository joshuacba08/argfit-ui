import { ChangeDetectionStrategy, Component } from '@angular/core';
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
