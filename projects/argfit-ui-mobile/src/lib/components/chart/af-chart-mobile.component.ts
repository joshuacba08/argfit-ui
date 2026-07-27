import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import type {
  AfChartDensity,
  AfChartIndicator,
  AfChartPoint,
  AfChartPointEvent,
  AfChartSeries,
  AfChartTone,
  AfChartType,
  AfChartValue,
} from '@argfit-ui/core';

import { buildEchartsOption, echarts, ensureEchartsRegistered } from './af-chart-echarts';

interface EchartsClickParams {
  readonly data?: number | AfChartPoint;
  readonly seriesName: string;
  readonly dataIndex: number;
  readonly value: AfChartValue;
  readonly name: string;
}

interface EchartsInstance {
  setOption(opt: unknown, notMerge?: boolean): void;
  resize(): void;
  dispose(): void;
  on(event: 'click', handler: (params: EchartsClickParams) => void): void;
}

@Component({
  selector: 'af-chart-mobile',
  standalone: true,
  templateUrl: './af-chart-mobile.component.html',
  styleUrl: './af-chart-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-chart-mobile',
    '[attr.data-type]': 'type()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
    '[attr.data-interactive]': 'interactive() ? "" : null',
    '[attr.role]': 'ariaLabel() ? "img" : null',
    '[attr.aria-label]': 'ariaLabel()',
    '[style.--af-chart-height.px]': 'resolvedHeight()',
  },
})
export class AfChartMobileComponent implements AfterViewInit, OnDestroy {
  readonly type = input<AfChartType>('line');
  readonly tone = input<AfChartTone>('default');
  readonly density = input<AfChartDensity>('compact');
  readonly categories = input<readonly string[]>([]);
  readonly series = input<readonly AfChartSeries[]>([]);
  readonly indicators = input<readonly AfChartIndicator[]>([]);
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly height = input<number | undefined>(undefined);
  readonly legend = input(true, { transform: booleanAttribute });
  readonly showGrid = input(true, { transform: booleanAttribute });
  readonly interactive = input(true, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly emptyMessage = input<string>('Sin datos disponibles');
  readonly ariaLabel = input<string | undefined>(undefined);
  /**
   * Publica la serie como tabla accesible junto al gráfico.
   *
   * §20 exige que todo gráfico tenga resumen textual. Un lienzo no es navegable ni
   * legible para tecnología asistiva, así que esta tabla es la representación real de
   * los mismos datos, no un adorno.
   */
  readonly dataTable = input(false, { transform: booleanAttribute });
  readonly dataTableLabel = input('Datos del gráfico');
  readonly dataTableSeriesHeader = input('Serie');

  readonly pointSelect = output<AfChartPointEvent>();

  /** Etiquetas de las columnas: categorías declaradas o índice de punto. */
  protected readonly tableColumns = computed<readonly string[]>(() => {
    if (this.categories().length > 0) {
      return this.categories();
    }
    const longest = Math.max(0, ...this.series().map((serie) => serie.data.length));
    return Array.from({ length: longest }, (_, index) => String(index + 1));
  });

  protected tableCell(seriesIndex: number, columnIndex: number): string {
    const point = this.series()[seriesIndex]?.data[columnIndex];
    if (point === undefined) {
      return '—';
    }
    if (typeof point === 'number') {
      return String(point);
    }
    const value = point.value;
    return Array.isArray(value) ? value.join(' / ') : String(value);
  }

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly canvasRef = viewChild<ElementRef<HTMLDivElement>>('canvas');

  private chart: EchartsInstance | null = null;
  private resizeObserver: ResizeObserver | null = null;

  protected readonly isEmpty = computed<boolean>(() => {
    const series = this.series();
    if (series.length === 0) {
      return true;
    }
    return series.every((s) => s.data.length === 0);
  });

  protected readonly state = computed<'loading' | 'empty' | 'ready'>(() => {
    if (this.loading()) {
      return 'loading';
    }
    return this.isEmpty() ? 'empty' : 'ready';
  });

  protected readonly resolvedHeight = computed<number>(() => {
    const explicitHeight = this.height();
    if (explicitHeight !== undefined) {
      return explicitHeight;
    }
    if (this.type() === 'sparkline') {
      return 64;
    }
    if (this.type() === 'gauge') {
      return 260;
    }
    if (this.type() === 'donut' || this.type() === 'radar') {
      return 240;
    }
    return this.density() === 'compact' ? 160 : 220;
  });

  constructor() {
    effect(() => {
      this.type();
      this.tone();
      this.density();
      this.categories();
      this.series();
      this.indicators();
      this.title();
      this.description();
      this.resolvedHeight();
      this.legend();
      this.showGrid();
      this.interactive();
      this.state();
      this.render();
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.render();
    this.observeResize();
    this.destroyRef.onDestroy(() => this.disposeChart());
  }

  ngOnDestroy(): void {
    this.disposeChart();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.chart?.resize();
  }

  private render(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      return;
    }
    if (this.state() !== 'ready') {
      this.disposeChart();
      return;
    }

    if (!this.canRenderCanvas()) {
      return;
    }

    if (!this.chart) {
      ensureEchartsRegistered();
      this.chart = echarts.init(canvas, undefined, {
        renderer: 'canvas',
      }) as unknown as EchartsInstance;
      this.chart.on('click', (params) => {
        this.pointSelect.emit({
          seriesName: params.seriesName,
          dataIndex: params.dataIndex,
          value: Array.isArray(params.value) ? params.value.map(Number) : Number(params.value),
          category: params.name,
          point: typeof params.data === 'object' ? params.data : undefined,
        });
      });
    }

    const option = buildEchartsOption(
      {
        type: this.type(),
        tone: this.tone(),
        density: this.density(),
        categories: this.categories(),
        series: this.series(),
        indicators: this.indicators(),
        title: this.title(),
        description: this.description(),
        legend: this.legend(),
        showGrid: this.showGrid(),
        interactive: this.interactive(),
        mobile: true,
      },
      this.document,
    );
    this.chart.setOption(option, true);
    queueMicrotask(() => this.chart?.resize());
  }

  private disposeChart(): void {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private canRenderCanvas(): boolean {
    if (this.document.defaultView?.navigator.userAgent.includes('jsdom')) {
      return false;
    }
    try {
      const probe = this.document.createElement('canvas');
      return Boolean(probe.getContext?.('2d'));
    } catch {
      return false;
    }
  }

  private observeResize(): void {
    const win = this.document.defaultView;
    if (!win?.ResizeObserver) {
      return;
    }
    this.resizeObserver = new win.ResizeObserver(() => this.chart?.resize());
    this.resizeObserver.observe(this.hostRef.nativeElement);
  }
}
