import { ChangeDetectionStrategy, Component, PLATFORM_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfChartType } from '@argfit-ui/core';

import { AfChartDesktopComponent } from '../../../../chart/src/lib/af-chart-desktop.component';
import type { AfChartRuntime } from '../../../../chart/src/lib/af-chart-runtime-loader';
import { buildEchartsOption } from '@argfit-ui/chart-runtime';

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

@Component({
  standalone: true,
  imports: [AfChartDesktopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart-desktop
      data-testid="chart"
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

@Component({
  standalone: true,
  imports: [AfChartDesktopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart-desktop data-testid="chart" type="sankey" [graph]="graph()" [series]="[]" />
  `,
})
class GraphChartHostComponent {
  readonly graph = signal<
    { nodes: readonly { id: string }[]; links: readonly { from: string; to: string; value: number }[] } | undefined
  >(undefined);
}

describe('AfChartDesktopComponent', () => {
  it('keeps the imperative API safe before the runtime is ready', () => {
    const fixture = TestBed.createComponent(AfChartDesktopComponent);

    expect(fixture.componentInstance.toDataUrl()).toBeNull();
    expect(() => fixture.componentInstance.resetView()).not.toThrow();
    expect(() => fixture.componentInstance.refreshSize()).not.toThrow();
  });

  it('does not request the runtime during server-side rendering', async () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    const load = vi.fn<() => Promise<AfChartRuntime>>();
    const fixture = TestBed.createComponent(AfChartDesktopComponent);
    Object.defineProperty(fixture.componentInstance, 'runtimeLoader', {
      value: { load, reset: vi.fn() },
    });
    fixture.componentRef.setInput('series', [{ name: 'SSR', data: [1] }]);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(load).not.toHaveBeenCalled();
  });

  it('renders the ready state with a canvas and accessible label', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host).not.toBeNull();
    await vi.waitFor(() => expect(host.getAttribute('data-state')).toBe('ready'));
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

  it('shows an accessible runtime error, keeps the data table and retries', async () => {
    const load = vi
      .fn<() => Promise<AfChartRuntime>>()
      .mockResolvedValue({} as AfChartRuntime);
    const reset = vi.fn();
    const fixture = TestBed.createComponent(AfChartDesktopComponent);
    Object.defineProperty(fixture.componentInstance, 'runtimeLoader', {
      value: { load, reset },
    });
    fixture.componentRef.setInput('dataTable', true);
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
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('No se pudo cargar');
    expect(host.querySelector('table')).not.toBeNull();

    (host.querySelector('.af-chart-desktop__retry') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(reset).toHaveBeenCalledOnce();
    expect(load).toHaveBeenCalled();
    await vi.waitFor(() => expect(host.getAttribute('data-state')).toBe('ready'));
  });

  it('judges graph charts by their nodes, not by their series', async () => {
    const fixture = TestBed.createComponent(GraphChartHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host.getAttribute('data-state')).toBe('empty');

    // Sankey y red no publican series: juzgarlas por `series` las declararía vacías
    // incluso con un grafo completo.
    fixture.componentInstance.graph.set({
      nodes: [{ id: 'plantel' }, { id: 'disponible' }],
      links: [{ from: 'plantel', to: 'disponible', value: 24 }],
    });
    fixture.detectChanges();
    await fixture.whenStable();

    await vi.waitFor(() => expect(host.getAttribute('data-state')).toBe('ready'));
  });

  it('tabulates points by observation when each one carries several magnitudes', async () => {
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

    // En filas por serie sólo cabría una de las tres magnitudes; las otras dos
    // desaparecerían del resumen textual que exige la accesibilidad.
    expect(headers).toEqual(['Jugador', 'Distancia', 'HSR', 'Sprint']);
    expect(firstRow).toEqual(['Adri Vega', '25007', '1193', '255']);
    expect(table.querySelectorAll('tbody tr')).toHaveLength(2);
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

  describe('scientific presets', () => {
    const base = {
      tone: 'default' as const,
      density: 'comfortable' as const,
      categories: ['S1', 'S2', 'S3'],
      indicators: [],
      legend: true,
      showGrid: true,
      interactive: true,
      mobile: false,
    };

    it('binds combo series to their own value axis', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'combo',
          series: [
            { name: 'Carga', kind: 'bar', data: [3120, 3480, 2960] },
            { name: 'ACWR', kind: 'line', axis: 'secondary', data: [0.92, 1.02, 0.86] },
          ],
          secondaryAxis: { min: 0.4, max: 1.8 },
        },
        document,
      ) as { yAxis: Array<{ min?: number }>; series: Array<{ type: string; yAxisIndex: number }> };

      expect(Array.isArray(option.yAxis)).toBe(true);
      expect(option.yAxis[1].min).toBe(0.4);
      expect(option.series[0].type).toBe('bar');
      expect(option.series[0].yAxisIndex).toBe(0);
      expect(option.series[1].type).toBe('line');
      expect(option.series[1].yAxisIndex).toBe(1);
    });

    it('anchors a secondary-axis region to a series on that axis', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'combo',
          series: [
            { name: 'Carga', kind: 'bar', data: [3120, 3480, 2960] },
            { name: 'ACWR', kind: 'line', axis: 'secondary', data: [0.92, 1.02, 0.86] },
          ],
          regions: [{ from: 0.8, to: 1.3, role: 'secondary' }],
        },
        document,
      ) as { series: Array<{ markArea?: unknown; yAxisIndex: number }> };

      // Colgada de la serie del eje izquierdo, la franja se dibujaría entre 0.8 y 1.3 UA.
      expect(option.series[0].markArea).toBeUndefined();
      expect(option.series[1].markArea).toBeTruthy();
    });

    it('emits a stacked pair per dispersion band and keeps it out of the legend', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'line',
          series: [{ name: 'rMSSD', data: [68, 72, 70] }],
          bands: [{ name: '±1 DE', lower: [62, 66, 64], upper: [74, 78, 76] }],
        },
        document,
      ) as {
        legend: { data: string[] };
        series: Array<{ name: string; stack?: string; data: number[] }>;
      };

      expect(option.legend.data).toEqual(['rMSSD']);
      expect(option.series).toHaveLength(3);
      expect(option.series[1].stack).toBe('af-band-0');
      // La segunda serie apila el grosor, no el límite superior: así el área queda
      // acotada entre ambos límites en vez de derramarse hasta el eje.
      expect(option.series[2].data).toEqual([12, 12, 12]);
    });

    it('applies a logarithmic domain when the axis asks for it', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'scatter',
          series: [{ name: 'Potencia', kind: 'line', data: [{ x: 1, y: 1400, value: 1400 }] }],
          xAxis: { scale: 'log' },
        },
        document,
      ) as { xAxis: { type: string }; series: Array<{ type: string }> };

      expect(option.xAxis.type).toBe('log');
      expect(option.series[0].type).toBe('line');
    });

    it('labels correlation cells and centres the scale on zero', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'correlation',
          categories: ['Carga', 'Sueño'],
          series: [
            { name: 'Carga', data: [1, 0.12] },
            { name: 'Sueño', data: [0.12, 1] },
          ],
        },
        document,
      ) as {
        visualMap: { min: number; max: number };
        series: Array<{ type: string; label: { show: boolean } }>;
      };

      expect(option.visualMap.min).toBe(-1);
      expect(option.visualMap.max).toBe(1);
      expect(option.series[0].type).toBe('heatmap');
      expect(option.series[0].label.show).toBe(true);
    });

    it('overlays raw observations on a boxplot only when asked', () => {
      const series = [{ name: 'Volante', data: [40, 42, 45, 48] }];

      const plain = buildEchartsOption(
        { ...base, type: 'boxplot', series },
        document,
      ) as { series: unknown[] };
      expect(plain.series).toHaveLength(1);

      const withPoints = buildEchartsOption(
        { ...base, type: 'boxplot', series, showPoints: true },
        document,
      ) as { series: Array<{ type: string }> };
      expect(withPoints.series).toHaveLength(2);
      expect(withPoints.series[1].type).toBe('scatter');
    });

    it('stacks polar bars over a category angle axis', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'polar-stacked',
          series: [
            { name: 'Z1', data: [120, 140, 130] },
            { name: 'Z2', data: [90, 80, 95] },
          ],
        },
        document,
      ) as {
        polar: unknown;
        angleAxis: { data: string[] };
        series: Array<{ coordinateSystem: string; stack: string }>;
      };

      expect(option.polar).toBeTruthy();
      expect(option.angleAxis.data).toEqual(['S1', 'S2', 'S3']);
      expect(option.series[0].coordinateSystem).toBe('polar');
      expect(option.series[1].stack).toBe('total');
    });

    it('binds a secondary axis on continuous coordinates', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'scatter',
          series: [
            { name: 'Lactato', kind: 'line', data: [{ x: 8, y: 0.9, value: 0.9 }] },
            { name: 'FC', kind: 'line', axis: 'secondary', data: [{ x: 8, y: 128, value: 128 }] },
          ],
          secondaryAxis: { min: 110, max: 200 },
        },
        document,
      ) as { yAxis: Array<{ min?: number }>; series: Array<{ yAxisIndex: number }> };

      expect(Array.isArray(option.yAxis)).toBe(true);
      expect(option.yAxis[1].min).toBe(110);
      expect(option.series[1].yAxisIndex).toBe(1);
    });

    it('pins annotations to their coordinates', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'scatter',
          series: [{ name: 'Lactato', data: [{ x: 8, y: 0.9, value: 0.9 }] }],
          annotations: [{ x: 18.4, y: 4, label: '18.4' }],
        },
        document,
      ) as { series: Array<{ markPoint?: { data: Array<{ coord: unknown[] }> } }> };

      expect(option.series[0].markPoint?.data[0].coord).toEqual([18.4, 4]);
    });

    it('builds candlesticks from four-number tuples', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'candlestick',
          series: [{ name: 'Masa corporal', data: [{ value: [78.4, 78.1, 77.8, 78.6] }] }],
        },
        document,
      ) as { series: Array<{ type: string; data: number[][] }> };

      expect(option.series[0].type).toBe('candlestick');
      expect(option.series[0].data[0]).toEqual([78.4, 78.1, 77.8, 78.6]);
    });

    it('lays the calendar over the declared range, not over the observed days', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'calendar',
          series: [{ name: 'Carga', data: [{ x: '2026-03-04', value: 480 }] }],
          dateRange: { from: '2026-01', to: '2026-09' },
        },
        document,
      ) as {
        calendar: { range: string[] };
        series: Array<{ coordinateSystem: string; data: unknown[][] }>;
      };

      // El rango declarado es lo que hace existir las celdas sin registro, y el hueco de
      // un descanso o una baja es parte de lo que el calendario muestra.
      expect(option.calendar.range).toEqual(['2026-01', '2026-09']);
      expect(option.series[0].coordinateSystem).toBe('calendar');
      expect(option.series[0].data[0]).toEqual(['2026-03-04', 480]);
    });

    it('resolves sankey links through node ids while showing their labels', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'sankey',
          series: [],
          graph: {
            nodes: [
              { id: 'plantel', label: 'Plantel (32)' },
              { id: 'disponible', label: 'Disponible' },
            ],
            links: [{ from: 'plantel', to: 'disponible', value: 24 }],
          },
        },
        document,
      ) as {
        series: Array<{
          type: string;
          data: Array<{ name: string }>;
          links: Array<{ source: string; target: string; value: number }>;
        }>;
      };

      expect(option.series[0].type).toBe('sankey');
      expect(option.series[0].data.map((node) => node.name)).toEqual([
        'Plantel (32)',
        'Disponible',
      ]);
      expect(option.series[0].links[0]).toMatchObject({
        source: 'Plantel (32)',
        target: 'Disponible',
        value: 24,
      });
    });

    it('nests treemap children under their branch', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'treemap',
          series: [],
          tree: [
            {
              name: 'Tren inferior',
              children: [{ name: 'Cuádriceps', value: 820 }],
            },
          ],
        },
        document,
      ) as {
        series: Array<{ type: string; data: Array<{ name: string; children: unknown[] }> }>;
      };

      expect(option.series[0].type).toBe('treemap');
      expect(option.series[0].data[0].name).toBe('Tren inferior');
      expect(option.series[0].data[0].children).toHaveLength(1);
    });

    it('keeps declared node positions in a network', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'network',
          series: [],
          graph: {
            nodes: [
              { id: 'GK', x: 50, y: 88 },
              { id: 'CB1', x: 38, y: 74 },
            ],
            links: [{ from: 'GK', to: 'CB1', value: 9 }],
          },
        },
        document,
      ) as {
        series: Array<{
          type: string;
          layout: string;
          data: Array<{ name: string; x: number; y: number }>;
        }>;
      };

      expect(option.series[0].type).toBe('graph');
      // Las coordenadas son el dato: un layout automático las reordenaría y el grafo
      // dejaría de decir dónde juega cada puesto.
      expect(option.series[0].layout).toBe('none');
      expect(option.series[0].data[0]).toMatchObject({ name: 'GK', x: 50, y: 88 });
    });

    it('draws the bullet target as a reference mark, not a second bar', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'bullet',
          categories: ['Distancia total'],
          series: [
            { name: 'Valor observado', data: [9420] },
            { name: 'Objetivo', data: [9000] },
          ],
        },
        document,
      ) as { series: Array<{ type: string; data: unknown[] }> };

      // Fondo, medida y marca. Dos barras invitarían a comparar su diferencia en vez de
      // leer el cumplimiento, que es la pregunta del indicador.
      expect(option.series.map((serie) => serie.type)).toEqual(['bar', 'bar', 'scatter']);
      expect((option.series[1].data[0] as { value: number }).value).toBeCloseTo(104.7, 1);
      expect(option.series[2].data[0]).toBe(100);
    });

    it('floats waterfall steps on an invisible support and rests totals on the axis', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'waterfall',
          categories: ['Previa', 'Fuerza', 'Actual'],
          series: [
            {
              name: 'Carga',
              data: [{ value: 3980, total: true }, { value: 420 }, { value: 4400, total: true }],
            },
          ],
        },
        document,
      ) as { series: Array<{ name: string; data: (number | string)[] }> };

      const [support, gains, losses, totals] = option.series;
      expect(support.data).toEqual([0, 3980, 0]);
      expect(gains.data).toEqual(['-', 420, '-']);
      expect(losses.data).toEqual(['-', '-', '-']);
      expect(totals.data).toEqual([3980, '-', 4400]);
    });

    it('colours diverging bars by sign and anchors them to zero', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'diverging-bar',
          categories: ['Ríos', 'Godoy'],
          series: [{ name: 'Desvío', data: [1.4, -0.8] }],
        },
        document,
      ) as {
        series: Array<{
          data: Array<{ value: number; itemStyle: { color: string } }>;
          markLine: { data: Array<{ xAxis: number }> };
        }>;
      };

      const [positive, negative] = option.series[0].data;
      expect(positive.itemStyle.color).not.toBe(negative.itemStyle.color);
      expect(option.series[0].markLine.data[0].xAxis).toBe(0);
    });

    it('breaks the dumbbell connector between rows', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'dumbbell',
          categories: ['CMJ', 'Sprint'],
          series: [
            { name: 'Pretemporada', data: [90, 96] },
            { name: 'Cierre', data: [100, 98] },
          ],
        },
        document,
      ) as { series: Array<{ name: string; data: unknown[] }> };

      // El hueco entre pares evita que una sola polilínea una también filas contiguas.
      expect(option.series[0].data).toEqual([
        [90, 0],
        [100, 0],
        [null, null],
        [96, 1],
        [98, 1],
        [null, null],
      ]);
    });

    it('gives every small multiple its own grid and a shared vertical domain', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'small-multiples',
          categories: ['D1', 'D2'],
          series: [
            { name: 'Ríos', data: [300, 900] },
            { name: 'Godoy', data: [280, 320] },
          ],
          yAxis: { max: 1000 },
        },
        document,
      ) as {
        grid: unknown[];
        yAxis: Array<{ max: number }>;
        series: Array<{ xAxisIndex: number; yAxisIndex: number }>;
      };

      expect(option.grid).toHaveLength(2);
      // La escala común es lo que hace comparable la rejilla; autoescalada, una carga de
      // 320 UA se dibujaría igual que una de 900.
      expect(option.yAxis.map((axis) => axis.max)).toEqual([1000, 1000]);
      expect(option.series[1]).toMatchObject({ xAxisIndex: 1, yAxisIndex: 1 });
    });

    it('derives the marginal histograms from the plotted points', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'scatter-marginal',
          series: [
            {
              name: 'Jugadores',
              data: [
                { x: 4, y: 60, value: 60 },
                { x: 4.5, y: 55, value: 55 },
              ],
            },
          ],
          xAxis: { min: 3.9, max: 5 },
          yAxis: { min: 40, max: 80 },
        },
        document,
      ) as { grid: unknown[]; series: Array<{ type: string; data: number[] }> };

      expect(option.grid).toHaveLength(3);
      expect(option.series[0].type).toBe('scatter');
      expect(option.series[1].data.reduce((total, count) => total + count, 0)).toBe(2);
      expect(option.series[2].data.reduce((total, count) => total + count, 0)).toBe(2);
    });

    it('maps gantt spans onto their lane index', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'gantt',
          categories: ['Pretemporada', 'Competencia'],
          series: [],
          spans: [{ lane: 'Competencia', from: 30, to: 100 }],
        },
        document,
      ) as { series: Array<{ type: string; data: Array<{ value: number[] }> }> };

      expect(option.series[0].type).toBe('custom');
      expect(option.series[0].data[0].value).toEqual([1, 30, 100]);
    });

    it('stacks horizontal shares without rounding the segments', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'stacked-horizontal-bar',
          categories: ['Defensor'],
          series: [
            { name: 'Baja', data: [60] },
            { name: 'Alta', data: [40] },
          ],
        },
        document,
      ) as {
        xAxis: { type: string };
        yAxis: { type: string };
        series: Array<{ stack?: string; itemStyle: { borderRadius: number } }>;
      };

      expect(option.xAxis.type).toBe('value');
      expect(option.yAxis.type).toBe('category');
      expect(option.series[0].stack).toBe('total');
      // Redondear los tramos abriría huecos entre segmentos contiguos y rompería la
      // lectura del total como una barra entera.
      expect(option.series[0].itemStyle.borderRadius).toBe(0);
    });

    it('leaves a confidence band out of the observed stretch', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'line',
          categories: ['S1', 'S2', 'S3'],
          series: [{ name: 'Carga', data: [3000, 3100, 3200] }],
          bands: [
            { name: 'IC 95%', lower: [null, 3050, 3100], upper: [null, 3150, 3300] },
          ],
        },
        document,
      ) as { series: Array<{ data: (number | null)[] }> };

      // El tramo sin límites no produce banda: dibujarla sobre lo ya medido sugeriría
      // incertidumbre en datos que se registraron.
      expect(option.series[1].data).toEqual([null, 3050, 3100]);
      expect(option.series[2].data).toEqual([null, 100, 200]);
    });

    it('keeps a gap in the series instead of collapsing it to zero', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'line',
          categories: ['S1', 'S2', 'S3'],
          series: [{ name: 'Carga observada', data: [3120, null, 3480] }],
        },
        document,
      ) as { series: Array<{ data: (number | null)[] }> };

      // Cero afirmaría que no se entrenó esa semana, que es una lectura distinta de que
      // no se registró.
      expect(option.series[0].data).toEqual([3120, null, 3480]);
    });

    it('keeps the declared order of a sunburst instead of ranking by size', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'sunburst',
          series: [],
          tree: [
            { name: 'Físico', children: [{ name: 'Fuerza', value: 220 }] },
            { name: 'Regeneración', children: [{ name: 'Movilidad', value: 120 }] },
          ],
        },
        document,
      ) as { series: Array<{ type: string; sort: null; data: Array<{ name: string }> }> };

      expect(option.series[0].type).toBe('sunburst');
      // El orden declarado es el del plan de entrenamiento; reordenar por magnitud
      // rompería la correspondencia con cómo se escribió.
      expect(option.series[0].sort).toBeNull();
      expect(option.series[0].data.map((node) => node.name)).toEqual(['Físico', 'Regeneración']);
    });

    it('builds theme river triples from series and categories', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'themeriver',
          categories: ['S1', 'S2'],
          series: [
            { name: 'Fuerza', data: [70, 90] },
            { name: 'Aeróbico', data: [84, 60] },
          ],
        },
        document,
      ) as { series: Array<{ type: string; data: unknown[][] }> };

      expect(option.series[0].type).toBe('themeRiver');
      expect(option.series[0].data).toEqual([
        ['S1', 70, 'Fuerza'],
        ['S2', 90, 'Fuerza'],
        ['S1', 84, 'Aeróbico'],
        ['S2', 60, 'Aeróbico'],
      ]);
    });

    it('lays a chord on a circle and sizes nodes by their traffic', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'chord',
          series: [],
          graph: {
            nodes: [{ id: 'Zaga' }, { id: 'Punta' }],
            links: [{ from: 'Zaga', to: 'Punta', value: 40 }],
          },
        },
        document,
      ) as {
        series: Array<{ layout: string; data: Array<{ symbolSize: number }> }>;
      };

      expect(option.series[0].layout).toBe('circular');
      // Sin tamaño por participación, el círculo trataría igual a quien toca todos los
      // balones y a quien apenas aparece.
      expect(option.series[0].data[0].symbolSize).toBeCloseTo(16 + 40 * 0.11, 5);
    });

    it('offsets each ridgeline above the previous one', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'ridgeline',
          series: [
            { name: 'Delantero', data: [{ x: 0, value: 10 }] },
            { name: 'Arquero', data: [{ x: 0, value: 4 }] },
          ],
        },
        document,
      ) as { series: Array<{ data: number[][] }> };

      const [first, second] = option.series;
      expect(first.data[0][1]).toBe(10);
      // La segunda curva se levanta sobre la primera; sin desplazamiento se solaparían
      // en la misma línea base y dejarían de ser comparables.
      expect(second.data[0][1]).toBeGreaterThan(4);
    });

    it('spreads beeswarm points deterministically around their category', () => {
      const build = () =>
        buildEchartsOption(
          {
            ...base,
            type: 'beeswarm',
            series: [{ name: 'Volante', data: [8.1, 8.4, 8.9] }],
          },
          document,
        ) as { series: Array<{ data: Array<{ value: [number, number, string] }> }> };

      const first = build().series[0].data.map((point) => point.value[0]);
      const second = build().series[0].data.map((point) => point.value[0]);

      // Determinista: con dispersión aleatoria, cada render movería los puntos y una
      // captura dejaría de ser comparable con la siguiente.
      expect(first).toEqual(second);
      expect(new Set(first).size).toBe(first.length);
    });

    it('draws the pending units behind a pictogram', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'pictorial',
          categories: ['Ríos'],
          series: [{ name: 'Completadas', data: [6] }],
          xAxis: { max: 9 },
        },
        document,
      ) as { series: Array<{ type: string; data: number[]; symbolClip: boolean }> };

      // El fondo es lo que convierte «6 sesiones» en «6 de 9».
      expect(option.series[0].data).toEqual([9]);
      expect(option.series[0].symbolClip).toBe(false);
      expect(option.series[1].data).toEqual([6]);
      expect(option.series[1].symbolClip).toBe(true);
    });

    it('scales a rose by area rather than by radius', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'rose',
          categories: ['Zona 1', 'Zona 2'],
          series: [{ name: 'Acciones', data: [42, 148] }],
        },
        document,
      ) as { series: Array<{ type: string; roseType: string }> };

      expect(option.series[0].type).toBe('pie');
      // Con `radius`, el área crecería con el cuadrado del valor y exageraría la
      // diferencia entre sectores.
      expect(option.series[0].roseType).toBe('area');
    });

    it('maps volumetric points to their four coordinates', () => {
      const option = buildEchartsOption(
        {
          ...base,
          type: 'scatter3d',
          series: [{ name: 'Jugador-día', data: [{ x: 3200, y: 68, z: 74, value: 74 }] }],
        },
        document,
      ) as { series: Array<{ type: string; data: number[][] }>; grid3D: unknown };

      expect(option.series[0].type).toBe('scatter3D');
      expect(option.series[0].data[0]).toEqual([3200, 68, 74, 74]);
      expect(option.grid3D).toBeTruthy();
    });

    it('only builds the toolbox for the requested features', () => {
      const bare = buildEchartsOption(
        { ...base, type: 'line', series: [{ name: 'Carga', data: [1, 2, 3] }] },
        document,
      ) as { toolbox?: unknown };
      expect(bare.toolbox).toBeUndefined();

      const withTools = buildEchartsOption(
        {
          ...base,
          type: 'line',
          series: [{ name: 'Carga', data: [1, 2, 3] }],
          toolbox: ['zoom', 'save-image'],
        },
        document,
      ) as { toolbox: { feature: Record<string, unknown> } };
      expect(Object.keys(withTools.toolbox.feature)).toEqual(['dataZoom', 'saveAsImage']);
    });
  });
});
