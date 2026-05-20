import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfChartMobileComponent } from './af-chart-mobile.component';
import { buildEchartsOption } from './af-chart-echarts';

@Component({
  standalone: true,
  imports: [AfChartMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart-mobile
      data-testid="chart"
      [categories]="categories()"
      [series]="series()"
      ariaLabel="Resumen"
    />
  `,
})
class ChartHostComponent {
  readonly categories = signal<readonly string[]>(['L', 'M', 'X']);
  readonly series = signal<readonly { name: string; data: readonly number[] }[]>([
    { name: 'A', data: [1, 2, 3] },
  ]);
}

describe('AfChartMobileComponent', () => {
  it('renders with compact density by default', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host.getAttribute('data-density')).toBe('compact');
    expect(host.getAttribute('data-state')).toBe('ready');
  });

  it('reports empty state when series are absent', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.componentInstance.series.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host.getAttribute('data-state')).toBe('empty');
  });

  it('builds the required mobile chart presets', () => {
    const base = {
      tone: 'default' as const,
      density: 'compact' as const,
      categories: ['Salto', 'Fuerza', 'RSI'],
      indicators: [
        { name: 'Salto', max: 100 },
        { name: 'Fuerza', max: 100 },
        { name: 'RSI', max: 100 },
      ],
      legend: true,
      showGrid: true,
      interactive: true,
      mobile: true,
    };

    const gauge = buildEchartsOption(
      { ...base, type: 'gauge', series: [{ name: 'Performance Score', data: [78] }] },
      document,
    ) as { series: Array<{ type: string }> };
    expect(gauge.series[0].type).toBe('gauge');

    const donut = buildEchartsOption(
      {
        ...base,
        type: 'donut',
        series: [
          {
            name: 'Tipos',
            data: [
              { label: 'CMJ', value: 42 },
              { label: 'SJ', value: 18 },
            ],
          },
        ],
      },
      document,
    ) as { series: Array<{ type: string }> };
    expect(donut.series[0].type).toBe('pie');

    const area = buildEchartsOption(
      { ...base, type: 'area', series: [{ name: 'Salto', data: [38, 42, 45] }] },
      document,
    ) as { series: Array<{ areaStyle?: unknown; type: string }> };
    expect(area.series[0].type).toBe('line');
    expect(area.series[0].areaStyle).toBeTruthy();

    const horizontalBar = buildEchartsOption(
      { ...base, type: 'horizontal-bar', series: [{ name: 'Ranking', data: [42, 46, 50] }] },
      document,
    ) as { series: Array<{ type: string }>; xAxis: { type: string }; yAxis: { type: string } };
    expect(horizontalBar.series[0].type).toBe('bar');
    expect(horizontalBar.xAxis.type).toBe('value');
    expect(horizontalBar.yAxis.type).toBe('category');

    const radar = buildEchartsOption(
      { ...base, type: 'radar', series: [{ name: 'Maria', data: [82, 70, 74] }] },
      document,
    ) as { radar: unknown };
    expect(radar.radar).toBeTruthy();
  });
});
