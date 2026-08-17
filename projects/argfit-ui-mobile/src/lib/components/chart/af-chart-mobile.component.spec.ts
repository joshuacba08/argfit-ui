import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfChartMobileComponent } from '../../../../chart/src/lib/af-chart-mobile.component';
import type { AfChartRuntime } from '../../../../chart/src/lib/af-chart-runtime-loader';
import { buildEchartsOption } from '@argfit-ui/chart-runtime';

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

@Component({
  standalone: true,
  imports: [AfChartMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart-mobile
      type="bubble"
      dataTable
      [series]="series()"
      [dataTableHeaders]="{ label: 'Jugador', x: 'Distancia', y: 'HSR', z: 'Sprint' }"
    />
  `,
})
class PointTableHostComponent {
  readonly series = signal([
    {
      name: 'Distancia / HSR / Sprint',
      data: [
        { label: 'Adri Vega', x: 25007, y: 1193, z: 255, value: 1193 },
        { label: 'Kelechi Okoro', x: 17615, y: 616, z: 44, value: 616 },
      ],
    },
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
    await vi.waitFor(() => expect(host.getAttribute('data-state')).toBe('ready'));
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

  it('recovers from a lazy runtime load error', async () => {
    const load = vi
      .fn<() => Promise<AfChartRuntime>>()
      .mockResolvedValue({} as AfChartRuntime);
    const reset = vi.fn();
    const fixture = TestBed.createComponent(AfChartMobileComponent);
    Object.defineProperty(fixture.componentInstance, 'runtimeLoader', {
      value: { load, reset },
    });
    fixture.componentRef.setInput('series', [{ name: 'Carga', data: [1, 2, 3] }]);
    fixture.detectChanges();
    await fixture.whenStable();
    const internal = fixture.componentInstance as unknown as {
      runtimeError: { set(value: boolean): void };
    };
    internal.runtimeError.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-state')).toBe('error');

    (host.querySelector('.af-chart-mobile__retry') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(reset).toHaveBeenCalledOnce();
    expect(load).toHaveBeenCalled();
    await vi.waitFor(() => expect(host.getAttribute('data-state')).toBe('ready'));
  });

  it('preserves every point magnitude in the mobile observation table', async () => {
    const fixture = TestBed.createComponent(PointTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const table = (fixture.nativeElement as HTMLElement).querySelector('table') as HTMLElement;
    const headers = Array.from(table.querySelectorAll('thead th')).map((cell) =>
      cell.textContent?.trim(),
    );
    const firstRow = Array.from(table.querySelectorAll('tbody tr:first-child > *')).map((cell) =>
      cell.textContent?.trim(),
    );

    expect(headers).toEqual(['Jugador', 'Distancia', 'HSR', 'Sprint']);
    expect(firstRow).toEqual(['Adri Vega', '25007', '1193', '255']);
    expect(table.querySelectorAll('tbody tr')).toHaveLength(2);
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
