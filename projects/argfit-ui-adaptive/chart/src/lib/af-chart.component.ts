import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  AfPlatformService,
  ɵAF_CHART_HOST,
  type AfChartAnnotation,
  type AfChartAxis,
  type AfChartBand,
  type AfChartDateRange,
  type AfChartDensity,
  type AfChartGraph,
  type AfChartTreeNode,
  type AfChartIndicator,
  type AfChartPointEvent,
  type AfChartRegion,
  type AfChartSeries,
  type AfChartSpan,
  type AfChartTableHeaders,
  type AfChartTableLayout,
  type AfChartThreshold,
  type AfChartTone,
  type AfChartToolboxFeature,
  type AfChartType,
} from '@argfit-ui/core';
import { AfChartDesktopComponent } from '@argfit-ui/desktop/chart';
import { AfChartMobileComponent } from '@argfit-ui/mobile/chart';

/**
 * Adaptive chart facade that swaps the desktop or mobile implementation
 * based on the current `AfPlatformService` mode. Consumers only deal with
 * the ArgFit `AfChart*` contract.
 */
@Component({
  selector: 'af-chart',
  providers: [{ provide: ɵAF_CHART_HOST, useExisting: forwardRef(() => AfChartComponent) }],
  standalone: true,
  imports: [AfChartDesktopComponent, AfChartMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (isMobile()) {
      <af-chart-mobile
        #mobileChart
        [type]="type()"
        [tone]="tone()"
        [density]="density()"
        [categories]="categories()"
        [series]="series()"
        [indicators]="indicators()"
        [bands]="bands()"
        [regions]="regions()"
        [thresholds]="thresholds()"
        [xAxis]="xAxis()"
        [yAxis]="yAxis()"
        [secondaryAxis]="secondaryAxis()"
        [toolbox]="toolbox()"
        [showPoints]="showPoints()"
        [annotations]="annotations()"
        [graph]="graph()"
        [tree]="tree()"
        [dateRange]="dateRange()"
        [spans]="spans()"
        [title]="title()"
        [description]="description()"
        [height]="height()"
        [legend]="legend()"
        [showGrid]="showGrid()"
        [interactive]="interactive()"
        [loading]="loading()"
        [emptyMessage]="emptyMessage()"
        [webglMessage]="webglMessage()"
        [renderErrorMessage]="renderErrorMessage()"
        [retryLabel]="retryLabel()"
        [dataTable]="dataTable()"
        [dataTableLabel]="dataTableLabel()"
        [dataTableSeriesHeader]="dataTableSeriesHeader()"
        [dataTableLayout]="dataTableLayout()"
        [dataTableHeaders]="dataTableHeaders()"
        [ariaLabel]="ariaLabel()"
        (pointSelect)="pointSelect.emit($event)"
      />
    } @else {
      <af-chart-desktop
        #desktopChart
        [type]="type()"
        [tone]="tone()"
        [density]="density()"
        [categories]="categories()"
        [series]="series()"
        [indicators]="indicators()"
        [bands]="bands()"
        [regions]="regions()"
        [thresholds]="thresholds()"
        [xAxis]="xAxis()"
        [yAxis]="yAxis()"
        [secondaryAxis]="secondaryAxis()"
        [toolbox]="toolbox()"
        [showPoints]="showPoints()"
        [annotations]="annotations()"
        [graph]="graph()"
        [tree]="tree()"
        [dateRange]="dateRange()"
        [spans]="spans()"
        [title]="title()"
        [description]="description()"
        [height]="height()"
        [legend]="legend()"
        [showGrid]="showGrid()"
        [interactive]="interactive()"
        [loading]="loading()"
        [emptyMessage]="emptyMessage()"
        [webglMessage]="webglMessage()"
        [renderErrorMessage]="renderErrorMessage()"
        [retryLabel]="retryLabel()"
        [dataTable]="dataTable()"
        [dataTableLabel]="dataTableLabel()"
        [dataTableSeriesHeader]="dataTableSeriesHeader()"
        [dataTableLayout]="dataTableLayout()"
        [dataTableHeaders]="dataTableHeaders()"
        [ariaLabel]="ariaLabel()"
        (pointSelect)="pointSelect.emit($event)"
      />
    }
  `,
  host: {
    class: 'af-chart',
  },
})
export class AfChartComponent {
  private readonly platform = inject(AfPlatformService);

  readonly type = input<AfChartType>('line');
  readonly tone = input<AfChartTone>('default');
  readonly density = input<AfChartDensity>('comfortable');
  readonly categories = input<readonly string[]>([]);
  readonly series = input<readonly AfChartSeries[]>([]);
  readonly indicators = input<readonly AfChartIndicator[]>([]);
  /**
   * Bandas de dispersión asociadas a una serie: ±1 DE, intervalo de confianza o rango
   * mínimo–máximo.
   *
   * Se declaran aparte de `series` porque no son mediciones independientes sino la
   * incertidumbre de otra, y no deben contarse como series en la leyenda ni en la tabla.
   */
  readonly bands = input<readonly AfChartBand[]>([]);
  /** Franjas de referencia sombreadas, p. ej. la zona óptima de un ratio. */
  readonly regions = input<readonly AfChartRegion[]>([]);
  /** Líneas de umbral de decisión o de corte clínico. */
  readonly thresholds = input<readonly AfChartThreshold[]>([]);
  readonly xAxis = input<AfChartAxis | undefined>(undefined);
  readonly yAxis = input<AfChartAxis | undefined>(undefined);
  /** Eje derecho con su propia escala, para las series con `axis: 'secondary'`. */
  readonly secondaryAxis = input<AfChartAxis | undefined>(undefined);
  /**
   * Herramientas de exploración sobre el lienzo (zoom por área, tabla de datos, PNG).
   *
   * Vacío por defecto: un gráfico embebido en una tarjeta de resumen no debería
   * ofrecer controles que compiten con la lectura.
   */
  readonly toolbox = input<readonly AfChartToolboxFeature[]>([]);
  /** Superpone las observaciones crudas sobre las cajas de un boxplot. */
  readonly showPoints = input(false, { transform: booleanAttribute });
  /**
   * Marcadores sobre coordenadas concretas: el umbral estimado, el récord, la ruptura.
   *
   * Es distinto de `thresholds`: un umbral es un criterio fijo; una anotación señala un
   * valor observado que el lector debería llevarse aunque no interrogue el gráfico.
   */
  readonly annotations = input<readonly AfChartAnnotation[]>([]);
  /** Nodos y vínculos de los tipos `sankey` y `network`. */
  readonly graph = input<AfChartGraph | undefined>(undefined);
  /** Jerarquía de proporciones del tipo `treemap`. */
  readonly tree = input<readonly AfChartTreeNode[]>([]);
  /**
   * Rango de la cuadrícula del tipo `calendar`.
   *
   * Se declara aparte de los datos para que las celdas sin registro existan igualmente:
   * el hueco —un descanso, una baja— es parte de lo que el calendario muestra.
   */
  readonly dateRange = input<AfChartDateRange | undefined>(undefined);
  /**
   * Bloques con inicio y fin del tipo `gantt`.
   *
   * Se expresan en la unidad del eje —semana de temporada— y no en fechas: la
   * periodización se planifica contra el calendario de competición, que cambia cada año.
   */
  readonly spans = input<readonly AfChartSpan[]>([]);
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly height = input<number | undefined>(undefined);
  readonly legend = input(true, { transform: booleanAttribute });
  readonly showGrid = input(true, { transform: booleanAttribute });
  readonly interactive = input(true, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly emptyMessage = input<string>('Sin datos disponibles');
  /**
   * Aviso cuando un tipo volumétrico no encuentra `echarts-gl`.
   *
   * El paquete es una dependencia opcional: sin él el lienzo queda vacío, y un gráfico
   * vacío se lee como «no hay datos» en lugar de «falta instalar algo».
   */
  readonly webglMessage = input<string>('Este gráfico necesita el paquete opcional echarts-gl.');
  /** Mensaje accesible cuando el runtime diferido no puede descargarse. */
  readonly renderErrorMessage = input<string>('No se pudo cargar el gráfico.');
  /** Etiqueta de la acción que vuelve a solicitar el runtime tras un fallo. */
  readonly retryLabel = input<string>('Reintentar');
  readonly ariaLabel = input<string | undefined>(undefined);
  /**
   * Publica la serie como tabla accesible junto al gráfico.
   *
   * §20 exige resumen textual en todo gráfico. Un lienzo no es navegable por teclado ni
   * legible por tecnología asistiva: esta tabla contiene los mismos datos, no un resumen.
   */
  readonly dataTable = input(false, { transform: booleanAttribute });
  readonly dataTableLabel = input('Datos del gráfico');
  readonly dataTableSeriesHeader = input('Serie');
  /**
   * Disposición de la tabla accesible.
   *
   * Por defecto se decide por la forma de los datos. Una dispersión de burbujas lleva
   * tres magnitudes por observación: en filas por serie, dos de ellas no tendrían dónde
   * aparecer.
   */
  readonly dataTableLayout = input<AfChartTableLayout>('auto');
  /**
   * Encabezados de las columnas en la disposición por puntos.
   *
   * Sin ellos se usan los nombres de los ejes, que describen la escala y no siempre la
   * magnitud que el lector busca en una tabla.
   */
  readonly dataTableHeaders = input<AfChartTableHeaders>({});

  readonly pointSelect = output<AfChartPointEvent>();

  protected readonly isMobile = this.platform.isMobile;

  private readonly desktopChart = viewChild<AfChartDesktopComponent>('desktopChart');
  private readonly mobileChart = viewChild<AfChartMobileComponent>('mobileChart');

  /** Renderer activo según la plataforma. Sólo uno existe en cada momento. */
  private get renderer(): AfChartDesktopComponent | AfChartMobileComponent | undefined {
    return this.desktopChart() ?? this.mobileChart();
  }

  /**
   * Exporta el gráfico como PNG y devuelve una data URL, o `null` si aún no se dibujó.
   *
   * Es imperativo a propósito: la exportación responde a una acción del usuario en un
   * instante concreto, no a un estado que pueda vivir en un input.
   */
  toDataUrl(pixelRatio = 2): string | null {
    return this.renderer?.toDataUrl(pixelRatio) ?? null;
  }

  /** Deshace zoom, filtros de leyenda y cambios de tipo hechos desde el toolbox. */
  resetView(): void {
    this.renderer?.resetView();
  }

  /** Recalcula el tamaño del lienzo tras un cambio de layout del contenedor. */
  refreshSize(): void {
    this.renderer?.refreshSize();
  }
}
