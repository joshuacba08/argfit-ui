import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfChartType } from '@argfit-ui/core';

import { AfChartDesktopComponent } from './af-chart-desktop.component';
import { buildEchartsOption } from './af-chart-echarts';

@Component({
  standalone: true,
  imports: [AfChartDesktopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart-desktop
      data-testid="chart"
      [type]="type()"
      [categories]="categories()"
      [series]="series()"
      [loading]="loading()"
      [emptyMessage]="'Nada por aqui'"
      ariaLabel="Saltos por sesion"
    />
  `,
})
class ChartHostComponent {
  readonly type = signal<AfChartType>('line');
  readonly categories = signal<readonly string[]>(['Lun', 'Mar', 'Mie']);
  readonly series = signal<readonly { name: string; data: readonly number[] }[]>([
    { name: 'Sesion', data: [12, 18, 15] },
  ]);
  readonly loading = signal(false);
}

describe('AfChartDesktopComponent', () => {
  it('renders the ready state with a canvas and accessible label', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host).not.toBeNull();
    expect(host.getAttribute('data-state')).toBe('ready');
    expect(host.getAttribute('aria-label')).toBe('Saltos por sesion');
    expect(host.querySelector('.af-chart-desktop__canvas')).not.toBeNull();
  });

  it('shows the empty fallback when no series have data', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.componentInstance.series.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host.getAttribute('data-state')).toBe('empty');
    expect(host.querySelector('.af-chart-desktop__empty')?.textContent?.trim()).toBe(
      'Nada por aqui',
    );
  });

  it('shows the loading skeleton while loading is true', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host.getAttribute('data-state')).toBe('loading');
    expect(host.querySelector('.af-chart-desktop__skeleton')).not.toBeNull();
  });

  it('builds the required desktop chart presets', () => {
    const base = {
      tone: 'default' as const,
      density: 'comfortable' as const,
      categories: ['CMJ', 'SJ', 'DJ'],
      indicators: [
        { name: 'Salto', max: 100 },
        { name: 'Fuerza', max: 100 },
        { name: 'RSI', max: 100 },
      ],
      legend: true,
      showGrid: true,
      interactive: true,
      mobile: false,
    };

    const line = buildEchartsOption(
      { ...base, type: 'line', series: [{ name: 'Salto', data: [42, 45, 48] }] },
      document,
    ) as { series: Array<{ type: string }> };
    expect(line.series[0].type).toBe('line');

    const bar = buildEchartsOption(
      { ...base, type: 'bar', series: [{ name: 'Sesiones', data: [8, 10, 9] }] },
      document,
    ) as { series: Array<{ type: string }> };
    expect(bar.series[0].type).toBe('bar');

    const stacked = buildEchartsOption(
      {
        ...base,
        type: 'stacked-bar',
        series: [
          { name: 'CMJ', data: [8, 10, 9] },
          { name: 'SJ', data: [4, 6, 5] },
        ],
      },
      document,
    ) as { series: Array<{ stack?: string; type: string }> };
    expect(stacked.series[0].type).toBe('bar');
    expect(stacked.series[0].stack).toBe('total');

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

    const radar = buildEchartsOption(
      { ...base, type: 'radar', series: [{ name: 'Maria', data: [82, 70, 74] }] },
      document,
    ) as { radar: unknown; series: Array<{ type: string }> };
    expect(radar.radar).toBeTruthy();
    expect(radar.series[0].type).toBe('radar');
  });
});
