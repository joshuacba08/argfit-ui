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
  signal,
  viewChild,
} from '@angular/core';

import { AF_CHART_3D_TYPES } from '@argfit-ui/core';
import type {
  AfChartAnnotation,
  AfChartAxis,
  AfChartBand,
  AfChartDateRange,
  AfChartDensity,
  AfChartGraph,
  AfChartTreeNode,
  AfChartIndicator,
  AfChartPoint,
  AfChartPointEvent,
  AfChartRegion,
  AfChartSeries,
  AfChartSpan,
  AfChartTableHeaders,
  AfChartTableLayout,
  AfChartThreshold,
  AfChartTone,
  AfChartToolboxFeature,
  AfChartType,
  AfChartValue,
} from '@argfit-ui/core';

import {
  AF_CHART_RUNTIME_LOADER,
  type AfChartRuntime,
} from './af-chart-runtime-loader';

/** Lee un token de color del documento; ECharts no interpreta variables CSS. */
function readCssColor(doc: Document, token: string, fallback: string): string {
  const computed = doc.defaultView?.getComputedStyle(doc.documentElement);
  return computed?.getPropertyValue(token).trim() || fallback;
}

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
  getDataURL(opts: {
    type: 'png';
    pixelRatio: number;
    backgroundColor: string;
    excludeComponents: readonly string[];
  }): string;
  dispatchAction(payload: { type: string }): void;
}

@Component({
  selector: 'af-chart-desktop',
  standalone: true,
  templateUrl: './af-chart-desktop.component.html',
  styleUrl: './af-chart-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-chart-desktop',
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
export class AfChartDesktopComponent implements AfterViewInit, OnDestroy {
  readonly type = input<AfChartType>('line');
  readonly tone = input<AfChartTone>('default');
  readonly density = input<AfChartDensity>('comfortable');
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
  /**
   * Aviso cuando falta `echarts-gl`.
   *
   * Los tipos volumétricos dependen de un paquete opcional. Sin él el lienzo queda en
   * blanco sin explicación, y un gráfico vacío se lee como «no hay datos» en vez de
   * «falta una dependencia».
   */
  readonly webglMessage = input<string>('Este gráfico necesita el paquete opcional echarts-gl.');
  readonly renderErrorMessage = input<string>('No se pudo cargar el gráfico.');
  readonly retryLabel = input<string>('Reintentar');
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Bandas de dispersión asociadas a las series (±1 DE, intervalos de confianza). */
  readonly bands = input<readonly AfChartBand[]>([]);
  /** Franjas de referencia sombreadas sobre el área de trazado. */
  readonly regions = input<readonly AfChartRegion[]>([]);
  /** Líneas de umbral de decisión o de corte clínico. */
  readonly thresholds = input<readonly AfChartThreshold[]>([]);
  readonly xAxis = input<AfChartAxis | undefined>(undefined);
  readonly yAxis = input<AfChartAxis | undefined>(undefined);
  /** Eje derecho, para series con `axis: 'secondary'`. */
  readonly secondaryAxis = input<AfChartAxis | undefined>(undefined);
  /** Herramientas de exploración sobre el lienzo. Vacío por defecto. */
  readonly toolbox = input<readonly AfChartToolboxFeature[]>([]);
  /** Superpone las observaciones crudas sobre las cajas de un boxplot. */
  readonly showPoints = input(false, { transform: booleanAttribute });
  /** Marcadores puntuales sobre coordenadas concretas del gráfico. */
  readonly annotations = input<readonly AfChartAnnotation[]>([]);
  /** Nodos y vínculos de los tipos `sankey` y `network`. */
  readonly graph = input<AfChartGraph | undefined>(undefined);
  /** Jerarquía de proporciones del tipo `treemap`. */
  readonly tree = input<readonly AfChartTreeNode[]>([]);
  /** Bloques con inicio y fin del tipo `gantt`. */
  readonly spans = input<readonly AfChartSpan[]>([]);
  /** Rango de la cuadrícula del tipo `calendar`. */
  readonly dateRange = input<AfChartDateRange | undefined>(undefined);
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
  /**
   * Disposición de la tabla accesible.
   *
   * Por defecto se decide por la forma de los datos: una serie de puntos con varias
   * magnitudes por observación es ilegible en filas por serie, porque cada celda sólo
   * puede mostrar una de ellas.
   */
  readonly dataTableLayout = input<AfChartTableLayout>('auto');
  /** Encabezados de las columnas en la disposición por puntos. */
  readonly dataTableHeaders = input<AfChartTableHeaders>({});

  readonly pointSelect = output<AfChartPointEvent>();

  /** Disposición efectiva de la tabla. */
  protected readonly tableLayout = computed<'series' | 'points'>(() => {
    const declared = this.dataTableLayout();
    if (declared !== 'auto') {
      return declared;
    }
    // Se opta por puntos en cuanto alguna observación trae coordenada propia: eso
    // significa que la fila tiene más de un número que contar.
    const carriesCoordinates = this.series().some((serie) =>
      serie.data.some(
        (point) => point !== null && typeof point === 'object' && point.x !== undefined,
      ),
    );
    return carriesCoordinates ? 'points' : 'series';
  });

  /** `true` cuando alguna observación trae la tercera magnitud. */
  private readonly hasMagnitude = computed<boolean>(() =>
    this.series().some((serie) =>
      serie.data.some(
        (point) => point !== null && typeof point === 'object' && point.z !== undefined,
      ),
    ),
  );

  /** Encabezados de la tabla en disposición por puntos. */
  protected readonly pointColumns = computed<readonly string[]>(() => {
    const headers = this.dataTableHeaders();
    const columns = this.series().length > 1 ? [this.dataTableSeriesHeader()] : [];
    columns.push(headers.label ?? 'Observación');
    columns.push(headers.x ?? this.xAxis()?.name ?? 'X');
    columns.push(headers.y ?? this.yAxis()?.name ?? 'Valor');
    if (this.hasMagnitude()) {
      columns.push(headers.z ?? 'Magnitud');
    }
    return columns;
  });

  /** Una fila por observación, en el mismo orden en que se declararon. */
  protected readonly pointRows = computed<readonly (readonly string[])[]>(() => {
    const withSeries = this.series().length > 1;
    const withMagnitude = this.hasMagnitude();
    const categories = this.categories();

    return this.series().flatMap((serie) =>
      serie.data.map((point, index) => {
        const cells = withSeries ? [serie.name] : [];
        if (point === null) {
          cells.push(categories[index] ?? String(index + 1), '—', '—');
          if (withMagnitude) {
            cells.push('—');
          }
          return cells;
        }
        if (typeof point === 'number') {
          cells.push(categories[index] ?? String(index + 1), '—', String(point));
          if (withMagnitude) {
            cells.push('—');
          }
          return cells;
        }
        cells.push(
          String(point.label ?? categories[index] ?? index + 1),
          point.x === undefined ? '—' : String(point.x),
          String(point.y ?? (Array.isArray(point.value) ? point.value.join(' / ') : point.value)),
        );
        if (withMagnitude) {
          cells.push(point.z === undefined ? '—' : String(point.z));
        }
        return cells;
      }),
    );
  });

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
    // El guion cubre tanto la columna que no existe como el hueco declarado: en la
    // tabla accesible ambos significan que no hay medición que leer.
    if (point === undefined || point === null) {
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
  private readonly runtimeLoader = inject(AF_CHART_RUNTIME_LOADER);

  protected readonly canvasRef = viewChild<ElementRef<HTMLDivElement>>('canvas');

  private chart: EchartsInstance | null = null;
  private runtime: AfChartRuntime | null = null;
  private renderRevision = 0;
  protected readonly runtimeLoading = signal(false);
  protected readonly runtimeError = signal(false);
  /** `true` sólo cuando se pidió un tipo volumétrico y el paquete no está instalado. */
  protected readonly webglMissing = signal(false);
  private resizeObserver: ResizeObserver | null = null;

  protected readonly isEmpty = computed<boolean>(() => {
    // Sankey, red y treemap no publican series: sus datos viven en `graph` y `tree`, así
    // que juzgarlos por `series` los declararía vacíos siempre.
    if (this.type() === 'sankey' || this.type() === 'network' || this.type() === 'chord') {
      return (this.graph()?.nodes.length ?? 0) === 0;
    }
    if (this.type() === 'gantt') {
      return this.spans().length === 0;
    }
    if (this.type() === 'treemap' || this.type() === 'sunburst') {
      return this.tree().length === 0;
    }
    const series = this.series();
    if (series.length === 0) {
      return true;
    }
    return series.every((s) => s.data.length === 0);
  });

  protected readonly state = computed<'loading' | 'empty' | 'error' | 'ready'>(() => {
    if (this.loading() || this.runtimeLoading()) {
      return 'loading';
    }
    if (this.isEmpty()) {
      return 'empty';
    }
    return this.runtimeError() ? 'error' : 'ready';
  });

  protected readonly showDataTable = computed(
    () => this.dataTable() && !this.loading() && !this.isEmpty(),
  );

  protected readonly resolvedHeight = computed<number>(() => {
    const explicitHeight = this.height();
    if (explicitHeight !== undefined) {
      return explicitHeight;
    }
    if (this.type() === 'sparkline') {
      return 56;
    }
    if (this.type() === 'gauge' || this.type() === 'donut' || this.type() === 'radar') {
      return 240;
    }
    // Estos tipos reparten el espacio en dos dimensiones: comprimidos a la altura de una
    // serie temporal, sus etiquetas se solapan y el gráfico deja de leerse.
    if (
      this.type() === 'sankey' ||
      this.type() === 'network' ||
      this.type() === 'treemap' ||
      this.type() === 'calendar' ||
      this.type() === 'small-multiples' ||
      this.type() === 'scatter-marginal' ||
      this.type() === 'gantt'
    ) {
      return 360;
    }
    return this.density() === 'compact' ? 120 : 220;
  });

  constructor() {
    effect(() => {
      // Re-evaluate option whenever any input or state changes.
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
      this.bands();
      this.regions();
      this.thresholds();
      this.xAxis();
      this.yAxis();
      this.secondaryAxis();
      this.toolbox();
      this.showPoints();
      this.annotations();
      this.graph();
      this.tree();
      this.dateRange();
      this.spans();
      this.loading();
      this.isEmpty();
      void this.render();
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    void this.render();
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

  private async render(): Promise<void> {
    const revision = ++this.renderRevision;
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      return;
    }
    if (this.loading() || this.isEmpty()) {
      this.disposeChart();
      return;
    }

    let runtime = this.runtime;
    if (!runtime) {
      this.runtimeLoading.set(true);
      this.runtimeError.set(false);
      try {
        runtime = await this.runtimeLoader.load();
        this.runtime = runtime;
      } catch {
        if (revision === this.renderRevision) {
          this.runtimeError.set(true);
          this.runtimeLoading.set(false);
          this.disposeChart();
        }
        return;
      }
      if (revision !== this.renderRevision) {
        return;
      }
      this.runtimeLoading.set(false);
    }

    if (!this.canRenderCanvas()) {
      return;
    }

    // Los volumétricos esperan a su módulo antes de dibujar: `setOption` con una serie
    // 3D sin registrar deja el lienzo en blanco y sin ningún error.
    if ((AF_CHART_3D_TYPES as readonly string[]).includes(this.type())) {
      const available = await runtime.ensureEchartsGlRegistered();
      this.webglMissing.set(!available);
      if (!available) {
        this.disposeChart();
        return;
      }
    } else if (this.webglMissing()) {
      this.webglMissing.set(false);
    }

    if (!this.chart) {
      runtime.ensureEchartsRegistered();
      this.chart = runtime.echarts.init(canvas, undefined, {
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

    const option = runtime.buildEchartsOption(
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
        mobile: false,
        bands: this.bands(),
        regions: this.regions(),
        thresholds: this.thresholds(),
        xAxis: this.xAxis(),
        yAxis: this.yAxis(),
        secondaryAxis: this.secondaryAxis(),
        toolbox: this.toolbox(),
        showPoints: this.showPoints(),
        annotations: this.annotations(),
        graph: this.graph(),
        tree: this.tree(),
        dateRange: this.dateRange(),
        spans: this.spans(),
      },
      this.document,
    );
    this.chart.setOption(option, true);
    queueMicrotask(() => this.chart?.resize());
  }

  /**
   * Exporta el lienzo como PNG y devuelve una data URL, o `null` si el gráfico todavía
   * no se ha dibujado.
   *
   * El fondo se rellena de forma explícita porque el lienzo es transparente: sin esto,
   * el PNG llegaría con texto claro sobre nada al visor de imágenes del sistema.
   */
  toDataUrl(pixelRatio = 2): string | null {
    if (!this.chart) {
      return null;
    }
    return this.chart.getDataURL({
      type: 'png',
      pixelRatio,
      backgroundColor: readCssColor(this.document, '--af-bg-surface', '#0F1D32'),
      excludeComponents: ['toolbox'],
    });
  }

  /** Deshace zoom, filtros de leyenda y cambios de tipo hechos desde el toolbox. */
  resetView(): void {
    this.chart?.dispatchAction({ type: 'restore' });
    this.chart?.resize();
  }

  /** Recalcula el tamaño del lienzo tras un cambio de layout del contenedor. */
  refreshSize(): void {
    this.chart?.resize();
  }

  protected retryRuntime(): void {
    this.runtimeLoader.reset();
    this.runtime = null;
    this.runtimeError.set(false);
    void this.render();
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
