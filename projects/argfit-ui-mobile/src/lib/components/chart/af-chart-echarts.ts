/// <reference path="../../../echarts-gl.d.ts" />
// La referencia explícita es necesaria: ng-packagr compila desde el punto de entrada y
// sigue sólo lo importado, así que una declaración ambiente suelta en `src` nunca
// entraría al programa y la importación diferida quedaría sin tipos.

import {
  BarChart,
  BoxplotChart,
  CandlestickChart,
  CustomChart,
  FunnelChart,
  GaugeChart,
  GraphChart,
  HeatmapChart,
  LineChart,
  ParallelChart,
  PictorialBarChart,
  PieChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  SunburstChart,
  ThemeRiverChart,
  TreemapChart,
} from 'echarts/charts';
import {
  CalendarComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  ParallelComponent,
  PolarComponent,
  RadarComponent,
  TitleComponent,
  SingleAxisComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import type {
  AfChartAnnotation,
  AfChartAxis,
  AfChartAxisRole,
  AfChartBand,
  AfChartDateRange,
  AfChartDensity,
  AfChartGraph,
  AfChartIndicator,
  AfChartPoint,
  AfChartRegion,
  AfChartSeries,
  AfChartSpan,
  AfChartThreshold,
  AfChartTone,
  AfChartToolboxFeature,
  AfChartTreeNode,
  AfChartType,
  AfChartValue,
} from '@argfit-ui/core';
import type { EChartsCoreOption } from 'echarts/core';

let registered = false;

/**
 * Registers the modular ECharts components used by ArgFit charts. Safe to
 * call multiple times.
 */
export function ensureEchartsRegistered(): void {
  if (registered) {
    return;
  }
  echarts.use([
    LineChart,
    BarChart,
    PieChart,
    GaugeChart,
    RadarChart,
    ScatterChart,
    HeatmapChart,
    BoxplotChart,
    ParallelChart,
    CandlestickChart,
    CustomChart,
    FunnelChart,
    PictorialBarChart,
    SunburstChart,
    ThemeRiverChart,
    SankeyChart,
    TreemapChart,
    GraphChart,
    CalendarComponent,
    SingleAxisComponent,
    GridComponent,
    LegendComponent,
    RadarComponent,
    ParallelComponent,
    PolarComponent,
    VisualMapComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    DataZoomComponent,
    MarkAreaComponent,
    MarkLineComponent,
    MarkPointComponent,
    CanvasRenderer,
  ]);
  registered = true;
}

export interface AfChartBuildContext {
  readonly type: AfChartType;
  readonly tone: AfChartTone;
  readonly density: AfChartDensity;
  readonly categories: readonly string[];
  readonly series: readonly AfChartSeries[];
  readonly indicators: readonly AfChartIndicator[];
  readonly title?: string;
  readonly description?: string;
  readonly legend: boolean;
  readonly showGrid: boolean;
  readonly interactive: boolean;
  readonly mobile?: boolean;
  readonly bands?: readonly AfChartBand[];
  readonly regions?: readonly AfChartRegion[];
  readonly thresholds?: readonly AfChartThreshold[];
  readonly xAxis?: AfChartAxis;
  readonly yAxis?: AfChartAxis;
  readonly secondaryAxis?: AfChartAxis;
  readonly toolbox?: readonly AfChartToolboxFeature[];
  readonly showPoints?: boolean;
  readonly annotations?: readonly AfChartAnnotation[];
  readonly graph?: AfChartGraph;
  readonly tree?: readonly AfChartTreeNode[];
  readonly dateRange?: AfChartDateRange;
  readonly spans?: readonly AfChartSpan[];
  /** Etiquetas del toolbox y de la vista de datos, en el idioma de la aplicación. */
  readonly labels?: AfChartEngineLabels;
}

/**
 * Textos de las herramientas del lienzo.
 *
 * ECharts los pinta dentro del canvas, fuera del alcance del i18n de Angular, así que
 * llegan como datos igual que las series.
 */
export interface AfChartEngineLabels {
  readonly zoom: string;
  readonly zoomBack: string;
  readonly magicLine: string;
  readonly magicBar: string;
  readonly magicStack: string;
  readonly restore: string;
  readonly dataView: string;
  readonly dataViewClose: string;
  readonly dataViewRefresh: string;
  readonly saveImage: string;
}

export const AF_CHART_DEFAULT_LABELS: AfChartEngineLabels = {
  zoom: 'Zoom por área',
  zoomBack: 'Restablecer zoom',
  magicLine: 'Líneas',
  magicBar: 'Barras',
  magicStack: 'Apilado',
  restore: 'Restablecer',
  dataView: 'Ver datos',
  dataViewClose: 'Cerrar',
  dataViewRefresh: 'Aplicar',
  saveImage: 'Descargar PNG',
};

const TONE_VAR: Record<AfChartTone, string> = {
  default: 'var(--af-chart-primary)',
  primary: 'var(--af-chart-primary)',
  success: 'var(--af-chart-success)',
  warning: 'var(--af-chart-warning)',
  danger: 'var(--af-chart-danger)',
};

const PALETTE_VARS = [
  '--af-chart-primary',
  '--af-chart-accent',
  '--af-chart-success',
  '--af-chart-warning',
  '--af-chart-danger',
] as const;

interface ChartTokens {
  readonly accent: string;
  readonly axis: string;
  readonly danger: string;
  readonly fillSoft: string;
  readonly grid: string;
  readonly label: string;
  readonly primary: string;
  readonly success: string;
  readonly tooltipBg: string;
  readonly tooltipBorder: string;
  readonly tooltipText: string;
  readonly track: string;
  readonly warning: string;
  /** Fondo de la superficie que aloja el gráfico; lo necesita la escena WebGL. */
  readonly surface: string;
  /** Rampa secuencial de menor a mayor magnitud, con seis pasos. */
  readonly scale: readonly string[];
  /**
   * Familia tipográfica concreta para el texto del lienzo.
   *
   * Tiene que ser una pila de fuentes real, no `inherit`: el lienzo no hereda nada. Un
   * valor que la propiedad `font` de canvas rechaza deja al motor midiendo con una
   * fuente y dibujando con otra, y las etiquetas se solapan al no coincidir el ancho
   * calculado con el pintado.
   */
  readonly fontFamily: string;
}

const SCALE_FALLBACKS = [
  '#0F1D32',
  '#114569',
  '#17618D',
  '#2599D5',
  '#4DD4FF',
  '#00D4FF',
] as const;

function readTokenColor(name: string, doc: Document, fallback: string): string {
  const computed = doc.defaultView?.getComputedStyle(doc.documentElement);
  const value = computed?.getPropertyValue(name).trim();
  return value || fallback;
}

function readTokens(doc: Document): ChartTokens {
  return {
    accent: readTokenColor('--af-chart-accent', doc, '#00D4FF'),
    axis: readTokenColor('--af-chart-axis', doc, 'rgba(37,153,213,0.22)'),
    danger: readTokenColor('--af-chart-danger', doc, '#FF3D71'),
    fillSoft: readTokenColor('--af-chart-fill-soft', doc, 'rgba(37,153,213,0.16)'),
    grid: readTokenColor('--af-chart-grid', doc, 'rgba(37,153,213,0.10)'),
    label: readTokenColor('--af-chart-label', doc, '#BCCCDC'),
    primary: readTokenColor('--af-chart-primary', doc, '#2599D5'),
    success: readTokenColor('--af-chart-success', doc, '#00C853'),
    tooltipBg: readTokenColor('--af-chart-tooltip-bg', doc, 'rgba(10,22,40,0.95)'),
    tooltipBorder: readTokenColor('--af-chart-tooltip-border', doc, 'rgba(37,153,213,0.18)'),
    tooltipText: readTokenColor('--af-chart-tooltip-text', doc, '#F0F4F8'),
    track: readTokenColor('--af-chart-track', doc, 'rgba(37,153,213,0.12)'),
    warning: readTokenColor('--af-chart-warning', doc, '#FFB300'),
    surface: readTokenColor('--af-card-bg', doc, readTokenColor('--af-bg-surface', doc, '#0F1D32')),
    scale: SCALE_FALLBACKS.map((fallback, step) =>
      readTokenColor(`--af-chart-scale-${step}`, doc, fallback),
    ),
    fontFamily: readTokenColor(
      '--af-font-body',
      doc,
      '"Outfit", system-ui, -apple-system, sans-serif',
    ),
  };
}

/**
 * Convierte un color de token en su versión translúcida.
 *
 * Los rellenos se derivan del color de la serie en vez de usar `opacity`, porque la
 * opacidad de ECharts se aplica también al trazo y al símbolo: bajaríamos el contraste
 * justo de la parte que debe leerse nítida.
 */
function withAlpha(color: string, alpha: number): string {
  const value = color.trim();
  const hexMatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  if (hexMatch) {
    const digits = hexMatch[1];
    const full =
      digits.length === 3
        ? digits
            .split('')
            .map((char) => char + char)
            .join('')
        : digits;
    const numeric = Number.parseInt(full, 16);
    return `rgba(${(numeric >> 16) & 255}, ${(numeric >> 8) & 255}, ${numeric & 255}, ${alpha})`;
  }
  const rgbMatch = /^rgba?\(([^)]+)\)$/i.exec(value);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch[1].split(',').map((part) => part.trim());
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return value;
}

/** Resuelve el color de un adorno (banda, franja, umbral) a partir de tono o color literal. */
function decorationColor(
  decoration: { readonly tone?: AfChartTone; readonly color?: string },
  doc: Document,
  fallback: string,
): string {
  if (decoration.color) {
    return decoration.color;
  }
  return decoration.tone ? resolveToneColor(decoration.tone, doc) : fallback;
}

/**
 * Resolve an ArgFit chart tone to a concrete CSS colour value at runtime.
 *
 * ECharts cannot interpret CSS custom properties directly, so we read the
 * computed value from the document root.
 */
export function resolveToneColor(tone: AfChartTone, doc: Document): string {
  const cssVar = TONE_VAR[tone].replace('var(', '').replace(')', '');
  return readTokenColor(cssVar, doc, '#2599D5');
}

function paletteColor(index: number, doc: Document): string {
  const token = PALETTE_VARS[index % PALETTE_VARS.length];
  const fallback = ['#2599D5', '#00D4FF', '#00C853', '#FFB300', '#FF3D71'][
    index % PALETTE_VARS.length
  ];
  return readTokenColor(token, doc, fallback);
}

function seriesColor(
  series: AfChartSeries,
  index: number,
  ctx: AfChartBuildContext,
  doc: Document,
): string {
  if (series.color) {
    return series.color;
  }
  if (series.tone) {
    return resolveToneColor(series.tone, doc);
  }
  if (ctx.tone !== 'default') {
    return resolveToneColor(ctx.tone, doc);
  }
  return paletteColor(index, doc);
}

function isPoint(value: unknown): value is AfChartPoint {
  return typeof value === 'object' && value !== null && 'value' in value;
}

function pointValue(value: number | AfChartPoint): AfChartValue {
  return isPoint(value) ? value.value : value;
}

/**
 * Valor numérico de un punto, o `null` si no hay medición.
 *
 * El hueco se propaga en vez de colapsar a cero: en una serie de carga, cero afirma que
 * no se entrenó, y eso es una lectura distinta de «no se midió».
 */
function numericValue(value: number | null | AfChartPoint | AfChartValue): number | null {
  const raw = isPoint(value) ? value.value : value;
  if (raw === null || raw === undefined) {
    return null;
  }
  if (Array.isArray(raw)) {
    return raw[0] === undefined ? null : Number(raw[0]);
  }
  return Number(raw);
}

/** Igual que `numericValue`, para los sitios que exigen un número concreto. */
function requiredNumber(value: number | null | AfChartPoint | AfChartValue): number {
  return numericValue(value) ?? 0;
}

/** Descarta los huecos: los agregados no pueden operar sobre ellos. */
function measuredNumbers(values: readonly (number | null)[]): number[] {
  return values.filter((value): value is number => value !== null);
}

function tupleValue(value: number | null | AfChartPoint): readonly number[] {
  if (value === null) {
    return [];
  }
  const raw = pointValue(value);
  return Array.isArray(raw) ? raw.map(Number) : [Number(raw)];
}

function pointLabel(
  value: number | null | AfChartPoint,
  index: number,
  categories: readonly string[],
): string {
  if (value !== null && isPoint(value)) {
    return String(value.label ?? value.x ?? categories[index] ?? index + 1);
  }
  return categories[index] ?? String(index + 1);
}

function categoryLabels(ctx: AfChartBuildContext): readonly string[] {
  if (ctx.categories.length > 0) {
    return ctx.categories;
  }
  const first = ctx.series[0];
  return first?.data.map((item, index) => pointLabel(item, index, ctx.categories)) ?? [];
}

function seriesNumbers(series: AfChartSeries): (number | null)[] {
  return series.data.map((item) => numericValue(item));
}

function animationDuration(ctx: AfChartBuildContext, doc: Document): number {
  const reduce = doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (reduce) {
    return 0;
  }
  return ctx.mobile ? 180 : 240;
}

function tooltipOption(ctx: AfChartBuildContext, tokens: ChartTokens): Record<string, unknown> {
  return {
    show: ctx.interactive,
    trigger: ctx.type === 'donut' || ctx.type === 'gauge' ? 'item' : 'axis',
    backgroundColor: tokens.tooltipBg,
    borderColor: tokens.tooltipBorder,
    borderRadius: 8,
    borderWidth: 1,
    confine: true,
    padding: [6, 10],
    textStyle: {
      color: tokens.tooltipText,
      fontFamily: tokens.fontFamily,
      fontSize: ctx.mobile ? 11 : 12,
    },
    axisPointer: {
      lineStyle: { color: tokens.axis, width: 1 },
      crossStyle: { color: tokens.axis },
    },
  };
}

/**
 * @param names Series que deben aparecer. Se declara explícitamente porque hay series
 * auxiliares —los límites de una banda de dispersión— que no son magnitudes propias y
 * confundirían la leyenda si ECharts las recogiera por su cuenta.
 */
function legendOption(
  ctx: AfChartBuildContext,
  tokens: ChartTokens,
  names?: readonly string[],
): Record<string, unknown> | undefined {
  if (!ctx.legend) {
    return undefined;
  }
  return {
    bottom: 0,
    ...(names ? { data: names.slice() } : {}),
    icon: 'roundRect',
    itemGap: ctx.mobile ? 12 : 16,
    itemHeight: 8,
    itemWidth: 18,
    textStyle: {
      color: tokens.label,
      fontFamily: tokens.fontFamily,
      fontSize: ctx.mobile ? 10 : 11,
    },
  };
}

function axisLabelStyle(ctx: AfChartBuildContext, tokens: ChartTokens): Record<string, unknown> {
  return {
    color: tokens.label,
    fontFamily: tokens.fontFamily,
    fontSize: ctx.mobile ? 10 : 11,
  };
}

function axisNameStyle(ctx: AfChartBuildContext, tokens: ChartTokens): Record<string, unknown> {
  return {
    color: tokens.label,
    fontFamily: tokens.fontFamily,
    fontSize: ctx.mobile ? 9 : 10,
    opacity: 0.8,
  };
}

/** Traslada un `AfChartAxis` a las claves de dominio y escala que entiende ECharts. */
function axisDomain(axis: AfChartAxis | undefined): Record<string, unknown> {
  if (!axis) {
    return {};
  }
  return {
    ...(axis.scale === 'log' ? { type: 'log', logBase: 10 } : {}),
    ...(axis.min !== undefined ? { min: axis.min } : {}),
    ...(axis.max !== undefined ? { max: axis.max } : {}),
    ...(axis.name ? { name: axis.name } : {}),
  };
}

/**
 * Franjas de referencia sombreadas.
 *
 * ECharts las cuelga de una serie, no del gráfico, así que se adjuntan siempre a la
 * primera: pintarlas en todas las repetiría el sombreado y oscurecería la franja.
 */
function markAreaOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): Record<string, unknown> | undefined {
  const regions = ctx.regions ?? [];
  if (regions.length === 0) {
    return undefined;
  }
  return {
    silent: true,
    data: regions.map((region) => {
      const key = region.axis === 'x' ? 'xAxis' : 'yAxis';
      const color = decorationColor(region, doc, tokens.success);
      return [
        {
          [key]: region.from,
          itemStyle: { color: withAlpha(color, 0.08) },
          label: region.label
            ? {
                show: true,
                formatter: region.label,
                position: 'insideTop',
                color: tokens.label,
                fontFamily: tokens.fontFamily,
                fontSize: ctx.mobile ? 9 : 10,
              }
            : { show: false },
        },
        { [key]: region.to },
      ];
    }),
  };
}

/** Líneas de umbral con su etiqueta al borde del área de trazado. */
function markLineOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): Record<string, unknown> | undefined {
  const thresholds = ctx.thresholds ?? [];
  if (thresholds.length === 0) {
    return undefined;
  }
  return {
    silent: true,
    symbol: 'none',
    data: thresholds.map((threshold) => {
      const key = threshold.axis === 'x' ? 'xAxis' : 'yAxis';
      const color = decorationColor(threshold, doc, tokens.warning);
      return {
        [key]: threshold.value,
        lineStyle: { color: withAlpha(color, 0.65), type: 'dashed', width: 1 },
        label: {
          show: Boolean(threshold.label),
          formatter: threshold.label ?? '',
          color: tokens.label,
          fontFamily: tokens.fontFamily,
          fontSize: ctx.mobile ? 9 : 10,
          position: 'insideEndTop',
        },
      };
    }),
  };
}

/**
 * Series auxiliares que dibujan una banda de dispersión.
 *
 * Se emite un par apilado: el límite inferior invisible y, sobre él, el grosor de la
 * banda con relleno. Apilar el grosor —y no el límite superior— es lo que hace que el
 * área quede acotada entre ambos límites y no se derrame hasta el eje.
 */
function bandSeries(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
  hasSecondaryAxis: boolean,
): Record<string, unknown>[] {
  const bands = ctx.bands ?? [];
  return bands.flatMap((band, index) => {
    const color = decorationColor(band, doc, tokens.primary);
    const axisIndex = hasSecondaryAxis && band.axis === 'secondary' ? 1 : 0;
    // Un tramo sin límites no produce banda. ECharts corta el apilado en `null`, que es
    // justo lo que se necesita para que un intervalo de confianza empiece en el
    // horizonte de la proyección y no cubra lo ya observado.
    const thickness = band.upper.map((value, position) => {
      const lower = band.lower[position];
      if (value === null || value === undefined || lower === null || lower === undefined) {
        return null;
      }
      return Number((value - lower).toFixed(4));
    });
    const shared = {
      type: 'line' as const,
      stack: `af-band-${index}`,
      yAxisIndex: axisIndex,
      // La banda comparte la interpolación de la serie que envuelve; con un borde
      // anguloso contra una media suavizada, el contorno parecería otra medición.
      smooth: true,
      symbol: 'none',
      silent: true,
      legendHoverLink: false,
      lineStyle: { opacity: 0 },
      tooltip: { show: false },
      z: 1,
    };
    return [
      { ...shared, name: `${band.name} (inferior)`, data: band.lower.slice() },
      {
        ...shared,
        name: band.name,
        data: thickness,
        areaStyle: { color: withAlpha(color, 0.16) },
      },
    ];
  });
}

const TOOLBOX_ICON_SIZE = 13;

/**
 * Herramientas del lienzo.
 *
 * Devuelve `undefined` cuando no hay ninguna activa para no reservar el espacio
 * superior del gráfico.
 */
function toolboxOption(
  ctx: AfChartBuildContext,
  tokens: ChartTokens,
): Record<string, unknown> | undefined {
  const features = ctx.toolbox ?? [];
  if (features.length === 0 || !ctx.interactive) {
    return undefined;
  }
  const labels = ctx.labels ?? AF_CHART_DEFAULT_LABELS;
  const feature: Record<string, unknown> = {};

  if (features.includes('zoom')) {
    feature['dataZoom'] = {
      yAxisIndex: 'none',
      title: { zoom: labels.zoom, back: labels.zoomBack },
      brushStyle: { borderColor: tokens.accent, color: withAlpha(tokens.accent, 0.12) },
    };
  }
  if (features.includes('magic')) {
    feature['magicType'] = {
      type: ['line', 'bar', 'stack'],
      title: { line: labels.magicLine, bar: labels.magicBar, stack: labels.magicStack },
    };
  }
  if (features.includes('restore')) {
    feature['restore'] = { title: labels.restore };
  }
  if (features.includes('data-view')) {
    feature['dataView'] = {
      title: labels.dataView,
      readOnly: true,
      lang: [labels.dataView, labels.dataViewClose, labels.dataViewRefresh],
      backgroundColor: tokens.tooltipBg,
      textareaColor: tokens.tooltipBg,
      textareaBorderColor: tokens.tooltipBorder,
      textColor: tokens.tooltipText,
      buttonColor: tokens.primary,
      buttonTextColor: tokens.tooltipText,
    };
  }
  if (features.includes('save-image')) {
    feature['saveAsImage'] = {
      title: labels.saveImage,
      name: 'argfit-chart',
      pixelRatio: 2,
      excludeComponents: ['toolbox'],
    };
  }

  return {
    show: true,
    right: 0,
    top: 0,
    itemSize: TOOLBOX_ICON_SIZE,
    itemGap: ctx.mobile ? 12 : 10,
    showTitle: true,
    iconStyle: { borderColor: tokens.label, borderWidth: 1.4 },
    emphasis: { iconStyle: { borderColor: tokens.accent } },
    tooltip: {
      show: true,
      backgroundColor: tokens.tooltipBg,
      borderColor: tokens.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tokens.tooltipText, fontFamily: tokens.fontFamily, fontSize: 11 },
      extraCssText: 'border-radius:6px;padding:4px 8px',
    },
    feature,
  };
}

/**
 * Marcadores de hallazgo sobre coordenadas concretas.
 *
 * Se dibujan como alfiler con la etiqueta dentro para que el valor se lea sin
 * interrogar el gráfico: una anotación que exige pasar el puntero por encima no cumple
 * su función en una captura ni en un informe impreso.
 */
function markPointOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): Record<string, unknown> | undefined {
  const annotations = ctx.annotations ?? [];
  if (annotations.length === 0) {
    return undefined;
  }
  return {
    silent: true,
    symbol: 'pin',
    // El alfiler aloja el valor dentro de su cabeza: con menos radio, una cifra de
    // cuatro caracteres se sale del área redonda.
    symbolSize: ctx.mobile ? 34 : 38,
    data: annotations.map((annotation) => ({
      coord: [annotation.x, annotation.y],
      itemStyle: { color: withAlpha(decorationColor(annotation, doc, tokens.warning), 0.9) },
      label: {
        show: Boolean(annotation.label),
        formatter: annotation.label ?? '',
        color: tokens.tooltipBg,
        fontFamily: tokens.fontFamily,
        fontSize: 9,
        fontWeight: 700,
      },
    })),
  };
}

/**
 * Adjunta franjas y umbrales al gráfico.
 *
 * ECharts los cuelga de una serie y los dibuja contra los ejes de esa serie, así que el
 * anclaje se elige por el eje que declara el adorno: una franja del eje derecho colgada
 * de una serie del izquierdo se dibujaría en la escala equivocada.
 *
 * Muta la lista recibida por comodidad de los constructores, que ya la tienen en la mano.
 */
function attachDecorations(
  series: Record<string, unknown>[],
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): void {
  const bySecondary = (decorations: readonly { readonly role?: AfChartAxisRole }[]): boolean =>
    decorations.some((decoration) => decoration.role === 'secondary');

  const anchor = (secondary: boolean): Record<string, unknown> | undefined => {
    if (!secondary) {
      return series[0];
    }
    return series.find((candidate) => candidate['yAxisIndex'] === 1) ?? series[0];
  };

  const regions = ctx.regions ?? [];
  const thresholds = ctx.thresholds ?? [];
  const markArea = markAreaOption(ctx, doc, tokens);
  const markLine = markLineOption(ctx, doc, tokens);
  const markPoint = markPointOption(ctx, doc, tokens);

  if (markArea) {
    const target = anchor(bySecondary(regions));
    if (target) {
      target['markArea'] = markArea;
    }
  }
  if (markLine) {
    const target = anchor(bySecondary(thresholds));
    if (target) {
      target['markLine'] = markLine;
    }
  }
  if (markPoint && series[0]) {
    series[0]['markPoint'] = markPoint;
  }
}

/** Reserva vertical necesaria para el toolbox, que se dibuja dentro del lienzo. */
function toolboxOffset(ctx: AfChartBuildContext): number {
  return (ctx.toolbox?.length ?? 0) > 0 && ctx.interactive ? 24 : 0;
}

/**
 * Reserva adicional cuando el título y el nombre de un eje comparten esquina.
 *
 * ECharts dibuja el nombre del eje por encima del área de trazado, que es exactamente
 * donde vive el título: sin este margen, «UA» se imprime sobre el título.
 */
function axisNameOffset(ctx: AfChartBuildContext): number {
  const hasAxisName = Boolean(ctx.yAxis?.name ?? ctx.secondaryAxis?.name ?? ctx.xAxis?.name);
  return ctx.title && hasAxisName ? 16 : 0;
}

/** Traduce el trazo declarado al vocabulario de ECharts. */
function lineDash(style: AfChartSeries['lineStyle'], fallback: 'solid' | 'dashed' = 'solid') {
  return style ?? fallback;
}

/** Tipo efectivo de cada serie: en `combo` lo decide la serie; en el resto, el gráfico. */
function effectiveKind(serie: AfChartSeries, ctx: AfChartBuildContext): 'bar' | 'line' {
  if (ctx.type !== 'combo') {
    return ctx.type === 'bar' ||
      ctx.type === 'stacked-bar' ||
      ctx.type === 'horizontal-bar' ||
      ctx.type === 'stacked-horizontal-bar'
      ? 'bar'
      : 'line';
  }
  return serie.kind === 'bar' ? 'bar' : 'line';
}

function buildCartesianOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const isArea = ctx.type === 'area';
  const isStackedArea = ctx.type === 'stacked-area';
  const isCombo = ctx.type === 'combo';
  const isStackedHorizontal = ctx.type === 'stacked-horizontal-bar';
  const isBar =
    ctx.type === 'bar' ||
    ctx.type === 'stacked-bar' ||
    ctx.type === 'horizontal-bar' ||
    isStackedHorizontal;
  const isHorizontal = ctx.type === 'horizontal-bar' || isStackedHorizontal;
  const isSparkline = ctx.type === 'sparkline';
  const categories = categoryLabels(ctx);
  const axisLabel = axisLabelStyle(ctx, tokens);

  // El eje secundario sólo existe si alguien lo pide: añadirlo «por si acaso» dejaría un
  // eje sin datos ocupando el margen derecho.
  const hasSecondaryAxis =
    !isHorizontal &&
    (ctx.series.some((serie) => serie.axis === 'secondary') ||
      (ctx.bands ?? []).some((band) => band.axis === 'secondary'));

  const series: Record<string, unknown>[] = ctx.series.map((s, index) => {
    // En un área apilada el color no distingue categorías sino tramos de un mismo total,
    // así que la rampa secuencial dice la verdad y la paleta semántica miente: sus
    // verdes y rojos se leerían como estado, no como contenido del entrenamiento.
    const color =
      isStackedArea && !s.color && !s.tone && ctx.tone === 'default'
        ? tokens.scale[Math.min(index + 1, tokens.scale.length - 1)]
        : seriesColor(s, index, ctx, doc);
    const axisIndex = hasSecondaryAxis && s.axis === 'secondary' ? 1 : 0;
    const kind = effectiveKind(s, ctx);
    const base = {
      name: s.name,
      data: seriesNumbers(s),
      emphasis: { focus: 'series' as const },
      itemStyle: { color },
      ...(isHorizontal ? {} : { yAxisIndex: axisIndex }),
      z: 3,
    };

    if (kind === 'bar') {
      return {
        ...base,
        type: 'bar' as const,
        barMaxWidth: ctx.mobile ? 18 : 28,
        stack: ctx.type === 'stacked-bar' || isStackedHorizontal ? 'total' : undefined,
        itemStyle: {
          color,
          // Los segmentos de un apilado no se redondean: el radio abriría huecos entre
          // tramos contiguos y rompería la lectura del total como una barra entera.
          borderRadius: isStackedHorizontal
            ? 0
            : isHorizontal
              ? ([0, 4, 4, 0] as [number, number, number, number])
              : ([4, 4, 0, 0] as [number, number, number, number]),
        },
        label: isStackedHorizontal
          ? {
              show: true,
              color: tokens.tooltipText,
              fontFamily: tokens.fontFamily,
              fontSize: 9,
              // Los tramos estrechos se dejan sin rótulo: una cifra que no cabe en su
              // segmento se desborda sobre el vecino y se le atribuye a él.
              formatter: (params: { readonly value: number }) =>
                params.value >= 6 ? String(params.value) : '',
            }
          : undefined,
      };
    }

    const filled = s.area ?? (isArea || isStackedArea);
    return {
      ...base,
      type: 'line' as const,
      smooth: s.smooth ?? true,
      stack: isStackedArea ? 'total' : undefined,
      showSymbol: s.showSymbol ?? (!isSparkline && !isStackedArea),
      symbolSize: isSparkline ? 0 : ctx.mobile ? 5 : 6,
      lineStyle: {
        color,
        // En un área apilada el contorno estorba: son bandas de superficie, no trazos.
        width: isStackedArea ? 0 : isSparkline ? 2 : ctx.mobile ? 2.5 : 2,
        type: lineDash(s.lineStyle),
      },
      areaStyle: filled
        ? { color: isStackedArea ? withAlpha(color, 0.85) : withAlpha(color, 0.18) }
        : undefined,
    };
  });

  if (isSparkline) {
    return {
      animationDuration: animationDuration(ctx, doc),
      backgroundColor: 'transparent',
      grid: { top: 4, right: 4, bottom: 4, left: 4, containLabel: false },
      tooltip: { show: false },
      xAxis: { type: 'category', show: false, data: categories.slice() },
      yAxis: { type: 'value', show: false, scale: true },
      series,
    } satisfies EChartsCoreOption;
  }

  series.push(...bandSeries(ctx, doc, tokens, hasSecondaryAxis));
  attachDecorations(series, ctx, doc, tokens);

  const nameTextStyle = axisNameStyle(ctx, tokens);
  const valueAxis = {
    type: 'value',
    scale: !isBar && !isStackedArea,
    splitLine: {
      show: (ctx.yAxis?.splitLine ?? ctx.showGrid) && ctx.showGrid,
      lineStyle: { color: tokens.grid, type: 'dashed' },
    },
    axisLabel,
    axisLine: { show: false },
    axisTick: { show: false },
    nameLocation: 'end',
    nameGap: 12,
    nameTextStyle: { ...nameTextStyle, align: 'left' },
    ...axisDomain(isHorizontal ? ctx.xAxis : ctx.yAxis),
  };
  const secondaryValueAxis = {
    ...valueAxis,
    // La grilla del eje derecho se apaga: dos rejillas con escalas distintas se cruzan y
    // sugieren coincidencias entre series que no existen.
    splitLine: { show: false },
    nameTextStyle: { ...nameTextStyle, align: 'right' },
    ...axisDomain(ctx.secondaryAxis),
  };
  const categoryAxis = {
    type: 'category',
    data: categories.slice(),
    boundaryGap: isBar || isCombo,
    splitLine: { show: false },
    axisLine: { lineStyle: { color: tokens.axis } },
    axisTick: { show: false },
    axisLabel,
    nameLocation: 'middle',
    nameGap: 28,
    nameTextStyle,
    ...(isHorizontal ? {} : ctx.xAxis?.name ? { name: ctx.xAxis.name } : {}),
  };

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: {
      top: (ctx.title ? 34 : 12) + toolboxOffset(ctx) + axisNameOffset(ctx),
      right: hasSecondaryAxis ? (ctx.mobile ? 34 : 44) : isHorizontal ? 18 : 12,
      // El nombre del eje de categorías se dibuja centrado bajo las etiquetas, en la
      // misma franja que la leyenda: sin esta reserva ambos textos se imprimen encima.
      bottom:
        (ctx.legend ? 36 : ctx.mobile ? 28 : 24) + (!isHorizontal && ctx.xAxis?.name ? 18 : 0),
      left: isHorizontal ? 72 : ctx.mobile ? 32 : 40,
      containLabel: false,
    },
    legend: legendOption(ctx, tokens, ctx.series.map((serie) => serie.name)),
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: tooltipOption(ctx, tokens),
    xAxis: isHorizontal ? valueAxis : categoryAxis,
    yAxis: isHorizontal
      ? categoryAxis
      : hasSecondaryAxis
        ? [valueAxis, secondaryValueAxis]
        : valueAxis,
    series,
  } satisfies EChartsCoreOption;
}

function titleOption(
  ctx: AfChartBuildContext,
  tokens: ChartTokens,
): Record<string, unknown> | undefined {
  if (!ctx.title) {
    return undefined;
  }
  return {
    text: ctx.title,
    subtext: ctx.description,
    left: 0,
    top: 0,
    textStyle: {
      color: tokens.label,
      fontFamily: tokens.fontFamily,
      fontSize: ctx.mobile ? 12 : 13,
      fontWeight: 600,
    },
    subtextStyle: {
      color: tokens.label,
      fontFamily: tokens.fontFamily,
      fontSize: ctx.mobile ? 10 : 11,
      opacity: 0.75,
    },
  };
}

function buildDonutOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const source = ctx.series[0];
  const categories = categoryLabels(ctx);
  const data =
    source?.data.map((item, index) => ({
      name: pointLabel(item, index, categories),
      value: requiredNumber(item),
      itemStyle: { color: paletteColor(index, doc) },
    })) ?? [];

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    color: data.map((item) => item.itemStyle.color),
    legend: ctx.legend
      ? {
          bottom: 0,
          icon: 'roundRect',
          itemGap: ctx.mobile ? 10 : 14,
          itemHeight: 8,
          itemWidth: 10,
          textStyle: { color: tokens.label, fontFamily: tokens.fontFamily, fontSize: ctx.mobile ? 11 : 12 },
        }
      : undefined,
    title: titleOption(ctx, tokens),
    tooltip: tooltipOption(ctx, tokens),
    series: [
      {
        name: source?.name ?? ctx.title ?? 'Distribucion',
        type: 'pie',
        radius: ctx.mobile ? ['50%', '72%'] : ['54%', '76%'],
        center: ctx.mobile ? ['50%', '44%'] : ['50%', '46%'],
        avoidLabelOverlap: true,
        padAngle: 4,
        itemStyle: {
          borderColor: readTokenColor('--af-bg-elevated', doc, '#0F1D32'),
          borderRadius: 4,
          borderWidth: 3,
        },
        label: { show: false },
        labelLine: { show: false },
        data,
      },
    ],
  } satisfies EChartsCoreOption;
}

function buildGaugeOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const firstSeries = ctx.series[0];
  const value = requiredNumber(firstSeries?.data[0] ?? 0);
  const min = ctx.indicators[0]?.min ?? 0;
  const max = ctx.indicators[0]?.max ?? 100;
  const color = seriesColor(
    firstSeries ?? { name: 'Score', data: [value], tone: ctx.tone },
    0,
    ctx,
    doc,
  );

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    tooltip: tooltipOption(ctx, tokens),
    series: [
      {
        type: 'gauge',
        min,
        max,
        startAngle: 180,
        endAngle: 0,
        center: ['50%', ctx.mobile ? '64%' : '66%'],
        radius: ctx.mobile ? '92%' : '88%',
        progress: {
          show: true,
          roundCap: true,
          width: ctx.mobile ? 16 : 14,
          itemStyle: { color },
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            color: [[1, tokens.track]],
            width: ctx.mobile ? 16 : 14,
          },
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          color: tokens.tooltipText,
          fontFamily: tokens.fontFamily,
          fontSize: ctx.mobile ? 40 : 38,
          fontWeight: 800,
          offsetCenter: [0, '-8%'],
          valueAnimation: ctx.interactive,
          formatter: '{value}',
        },
        title: {
          color: tokens.label,
          fontFamily: tokens.fontFamily,
          fontSize: ctx.mobile ? 12 : 13,
          offsetCenter: [0, '18%'],
        },
        data: [{ value, name: firstSeries?.name ?? ctx.title ?? 'Score' }],
      },
    ],
  } satisfies EChartsCoreOption;
}

function buildRadarOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const categories = categoryLabels(ctx);
  const valuesBySeries = ctx.series.map((s) => seriesNumbers(s));
  const maxByIndex = categories.map((_, index) =>
    Math.max(1, ...valuesBySeries.map((values) => values[index] ?? 0)),
  );
  const indicators =
    ctx.indicators.length > 0
      ? ctx.indicators.map((indicator) => ({ ...indicator }))
      : categories.map((name, index) => ({
          name,
          min: 0,
          max: Math.ceil(maxByIndex[index] * 1.18),
        }));

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    color: ctx.series.map((s, index) => seriesColor(s, index, ctx, doc)),
    legend: legendOption(ctx, tokens),
    title: titleOption(ctx, tokens),
    tooltip: tooltipOption(ctx, tokens),
    radar: {
      indicator: indicators,
      radius: ctx.mobile ? '58%' : '62%',
      center: ['50%', ctx.legend ? '45%' : '50%'],
      axisName: {
        color: tokens.label,
        fontFamily: tokens.fontFamily,
        fontSize: ctx.mobile ? 10 : 11,
      },
      axisLine: { lineStyle: { color: tokens.axis } },
      splitLine: { lineStyle: { color: tokens.grid } },
      splitArea: {
        areaStyle: {
          color: ['transparent', tokens.fillSoft],
          opacity: 0.3,
        },
      },
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: ctx.mobile ? 5 : 6,
        data: ctx.series.map((s, index) => {
          const color = seriesColor(s, index, ctx, doc);
          return {
            name: s.name,
            value: seriesNumbers(s),
            lineStyle: { color, width: 2 },
            itemStyle: { color },
            areaStyle: { color, opacity: 0.16 },
          };
        }),
      },
    ],
  } satisfies EChartsCoreOption;
}

function buildHeatmapOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const xLabels = categoryLabels(ctx);
  const yLabels = ctx.series.map((s) => s.name);
  const values = ctx.series.flatMap((s, y) =>
    seriesNumbers(s).map((value, x) => [x, y, value] as [number, number, number]),
  );
  const max = Math.max(1, ...values.map((value) => value[2]));

  // Una matriz de correlación se lee por signo además de por magnitud, así que usa una
  // escala divergente fija en [-1, 1] y rotula cada celda: el coeficiente exacto importa
  // tanto como el patrón, y a este tamaño de celda el color solo no lo transmite.
  const isCorrelation = ctx.type === 'correlation';

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: {
      top: (ctx.title ? 34 : 12) + toolboxOffset(ctx),
      right: 12,
      // La escala de color se dibuja bajo el área de trazado, en la misma banda que las
      // etiquetas del eje: sin este margen se superponen a media altura.
      bottom: ctx.legend ? 64 : 24,
      left: 58,
    },
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: tooltipOption(ctx, tokens),
    visualMap: {
      show: ctx.legend,
      min: isCorrelation ? -1 : 0,
      max: isCorrelation ? 1 : max,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      // En un `visualMap` continuo, `itemWidth` es el grosor de la barra y `itemHeight`
      // su longitud, también en horizontal: invertirlos la deja vertical y diminuta.
      itemWidth: 10,
      itemHeight: 90,
      // Los extremos se rotulan: una rampa sin números dice que hay más y menos, pero no
      // cuánto, y en una matriz de correlación el signo y la magnitud son el dato.
      text: isCorrelation ? ['+1', '−1'] : [String(max), '0'],
      inRange: {
        color: isCorrelation
          ? [tokens.danger, tokens.scale[0], tokens.accent]
          : tokens.scale.slice(),
      },
      textStyle: { color: tokens.label, fontFamily: tokens.fontFamily, fontSize: 10 },
    },
    xAxis: {
      type: 'category',
      data: xLabels.slice(),
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
      splitArea: { show: true, areaStyle: { color: ['transparent', tokens.fillSoft] } },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
      splitArea: { show: true, areaStyle: { color: ['transparent', tokens.fillSoft] } },
    },
    series: [
      {
        type: 'heatmap',
        data: values,
        label: isCorrelation
          ? {
              show: true,
              color: tokens.tooltipText,
              fontFamily: tokens.fontFamily,
              fontSize: ctx.mobile ? 8 : 9,
              formatter: (params: { readonly value: readonly number[] }) => String(params.value[2]),
            }
          : { show: false },
        itemStyle: { borderColor: tokens.tooltipBg, borderWidth: 2, borderRadius: 2 },
        emphasis: { itemStyle: { borderColor: tokens.accent } },
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Barras apiladas en coordenadas polares.
 *
 * Cada categoría es una rama angular y cada serie un anillo acumulado. Sirve para
 * composiciones cíclicas —un microciclo semanal— donde la forma del conjunto se compara
 * de un vistazo; para comparar valores concretos entre categorías, las barras
 * cartesianas siguen siendo más precisas.
 */
function buildPolarStackedOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const categories = categoryLabels(ctx);
  const axisLabel = axisLabelStyle(ctx, tokens);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    legend: legendOption(ctx, tokens),
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    polar: { center: ['50%', ctx.legend ? '46%' : '50%'], radius: ['14%', '70%'] },
    angleAxis: {
      type: 'category',
      data: categories.slice(),
      axisLine: { lineStyle: { color: tokens.grid } },
      axisTick: { show: false },
      axisLabel,
    },
    radiusAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
    },
    series: ctx.series.map((serie, index) => ({
      name: serie.name,
      type: 'bar',
      coordinateSystem: 'polar',
      stack: 'total',
      data: seriesNumbers(serie),
      itemStyle: {
        // La rampa secuencial ordena los anillos de dentro hacia fuera; las zonas de
        // velocidad, la carga por contenido y demás apilados son magnitudes ordenadas,
        // no categorías sueltas.
        color: serie.color ?? tokens.scale[Math.min(index + 1, tokens.scale.length - 1)],
      },
    })),
  } satisfies EChartsCoreOption;
}

function quantile(sorted: readonly number[], q: number): number {
  if (sorted.length === 0) {
    return 0;
  }
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] === undefined
    ? sorted[base]
    : sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}

function boxData(values: readonly number[]): [number, number, number, number, number] {
  const sorted = [...values].sort((a, b) => a - b);
  return [
    sorted[0] ?? 0,
    quantile(sorted, 0.25),
    quantile(sorted, 0.5),
    quantile(sorted, 0.75),
    sorted[sorted.length - 1] ?? 0,
  ];
}

function buildBoxplotOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const color = resolveToneColor(ctx.tone, doc);
  const series: Record<string, unknown>[] = [
    {
      type: 'boxplot',
      data: ctx.series.map((s) => boxData(measuredNumbers(seriesNumbers(s)))),
      boxWidth: ['24%', '40%'],
      itemStyle: {
        borderColor: color,
        borderWidth: 1.4,
        color: tokens.fillSoft,
      },
      emphasis: { itemStyle: { borderColor: tokens.accent } },
    },
  ];

  if (ctx.showPoints) {
    // Las observaciones crudas detrás de la caja revelan lo que los cinco resúmenes
    // ocultan: bimodalidad, huecos o un n tan pequeño que los cuartiles no significan nada.
    series.push({
      type: 'scatter',
      symbolSize: ctx.mobile ? 3 : 4,
      z: 1,
      data: ctx.series.flatMap((serie, index) =>
        measuredNumbers(seriesNumbers(serie)).map((value) => [index, value] as [number, number]),
      ),
      itemStyle: { color: withAlpha(tokens.label, 0.45) },
    });
  }

  attachDecorations(series, ctx, doc, tokens);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: {
      top: (ctx.title ? 34 : 12) + toolboxOffset(ctx) + axisNameOffset(ctx),
      right: 12,
      bottom: 28,
      left: 42,
    },
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: tooltipOption(ctx, tokens),
    xAxis: {
      type: 'category',
      data: ctx.series.map((s) => s.name),
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { lineStyle: { color: tokens.axis } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      // El eje se ajusta al rango observado: forzar el cero en una distribución de
      // potencias entre 30 y 55 W·kg⁻¹ apretaría todas las cajas contra el borde
      // superior y volvería invisible la diferencia entre posiciones.
      scale: ctx.yAxis?.min === undefined,
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
      nameLocation: 'end',
      nameGap: 12,
      nameTextStyle: { ...axisNameStyle(ctx, tokens), align: 'left' },
      ...axisDomain(ctx.yAxis),
    },
    series,
  } satisfies EChartsCoreOption;
}

/**
 * Dispersión y burbujas.
 *
 * Ambos comparten ejes continuos; `bubble` añade el tamaño como tercera variable. El radio
 * se escala por raíz cuadrada del valor porque la percepción compara áreas: escalar el
 * radio linealmente hace que un valor doble parezca cuatro veces mayor.
 */
function buildScatterOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const isBubble = ctx.type === 'bubble';
  const magnitudes = ctx.series.flatMap((s) =>
    s.data.map((point) => (point === null || typeof point === 'number' ? 0 : Number(point.z ?? 0))),
  );
  const maxMagnitude = Math.max(1, ...magnitudes);
  const nameTextStyle = axisNameStyle(ctx, tokens);
  const hasSecondaryAxis = ctx.series.some((serie) => serie.axis === 'secondary');

  const series: Record<string, unknown>[] = ctx.series.map((serie, index) => {
    const color = seriesColor(serie, index, ctx, doc);
    const axisIndex = hasSecondaryAxis && serie.axis === 'secondary' ? 1 : 0;
    const data = serie.data.map((point, pointIndex) => {
      // Un hueco se propaga como tupla nula: ECharts corta el trazo en vez de bajarlo a
      // cero, que en una serie medida sería una afirmación distinta.
      if (point === null) {
        return [null, null, null];
      }
      if (typeof point === 'number') {
        return [pointIndex, point, 0];
      }
      const x = Number(point.x ?? pointIndex);
      const y = Number(point.y ?? (Array.isArray(point.value) ? point.value[0] : point.value));
      const z = Number(point.z ?? 0);
      return [x, y, z];
    });

    // Barras sobre un eje continuo: las columnas de un histograma se apoyan en el centro
    // de su intervalo, no en una categoría, porque la distancia entre intervalos es
    // información —un hueco significa que ahí no cayó ninguna observación—.
    if (serie.kind === 'bar') {
      return {
        name: serie.name,
        type: 'bar',
        data,
        yAxisIndex: axisIndex,
        barWidth: '96%',
        itemStyle: {
          color: withAlpha(color, 0.6),
          borderColor: withAlpha(color, 0.9),
          borderWidth: 0.6,
        },
        z: 1,
      };
    }

    // Una serie declarada como línea sobre ejes continuos es la recta de ajuste o la
    // asíntota del modelo: comparte el sistema de coordenadas de la nube de puntos, pero
    // no es una observación y por eso se dibuja sin símbolo y, normalmente, discontinua.
    if (serie.kind === 'line') {
      return {
        name: serie.name,
        type: 'line',
        data,
        yAxisIndex: axisIndex,
        showSymbol: serie.showSymbol ?? false,
        smooth: serie.smooth ?? false,
        symbolSize: ctx.mobile ? 6 : 7,
        lineStyle: {
          color,
          width: serie.lineStyle === 'solid' ? 2.2 : 1.6,
          type: lineDash(serie.lineStyle, 'dashed'),
        },
        itemStyle: { color },
        areaStyle: serie.area ? { color: withAlpha(color, 0.16) } : undefined,
        z: 2,
      };
    }

    return {
      name: serie.name,
      type: 'scatter',
      data,
      yAxisIndex: axisIndex,
      symbolSize: isBubble
        ? (value: readonly number[]) => 8 + Math.sqrt(Number(value[2] ?? 0) / maxMagnitude) * 28
        : ctx.mobile
          ? 9
          : 10,
      itemStyle: {
        color,
        opacity: isBubble ? 0.7 : 0.9,
      },
      z: 3,
    };
  });

  attachDecorations(series, ctx, doc, tokens);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: {
      top: (ctx.title ? 34 : 12) + toolboxOffset(ctx) + axisNameOffset(ctx),
      right: hasSecondaryAxis ? (ctx.mobile ? 34 : 48) : 16,
      bottom: (ctx.legend ? 44 : 32) + (ctx.xAxis?.name ? 18 : 0),
      left: 46,
    },
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    legend: legendOption(ctx, tokens),
    xAxis: {
      type: 'value',
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { lineStyle: { color: tokens.axis } },
      axisTick: { show: false },
      // Centrado bajo el eje, como en los gráficos de categorías: al final del eje, el
      // nombre se cuela dentro del área de trazado y compite con las etiquetas de los
      // umbrales, que también se anclan al borde derecho.
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { ...nameTextStyle, align: 'center' },
      ...axisDomain(ctx.xAxis),
    },
    yAxis: hasSecondaryAxis
      ? [
          continuousValueAxis(ctx, tokens, nameTextStyle, ctx.yAxis, 'left'),
          {
            ...continuousValueAxis(ctx, tokens, nameTextStyle, ctx.secondaryAxis, 'right'),
            splitLine: { show: false },
          },
        ]
      : continuousValueAxis(ctx, tokens, nameTextStyle, ctx.yAxis, 'left'),
    series,
  } satisfies EChartsCoreOption;
}

/** Eje de valores de un sistema de coordenadas continuo. */
function continuousValueAxis(
  ctx: AfChartBuildContext,
  tokens: ChartTokens,
  nameTextStyle: Record<string, unknown>,
  axis: AfChartAxis | undefined,
  align: 'left' | 'right',
): Record<string, unknown> {
  return {
    type: 'value',
    splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
    axisLabel: axisLabelStyle(ctx, tokens),
    axisLine: { show: false },
    axisTick: { show: false },
    nameLocation: 'end',
    nameGap: 12,
    nameTextStyle: { ...nameTextStyle, align },
    ...axisDomain(axis),
  };
}

function buildParallelOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const source = ctx.series[0];
  const data = source?.data.map((point) => tupleValue(point)) ?? [];
  const dimensions =
    ctx.indicators.length > 0
      ? ctx.indicators
      : (ctx.categories.length > 0
          ? ctx.categories
          : (data[0]?.map((_, index) => `M${index + 1}`) ?? [])
        ).map((name) => ({ name: String(name), min: 0, max: undefined }));

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    tooltip: tooltipOption(ctx, tokens),
    parallel: {
      top: ctx.title ? 42 : 18,
      bottom: 24,
      left: 42,
      right: 42,
      parallelAxisDefault: {
        type: 'value',
        nameTextStyle: { color: tokens.label, fontFamily: tokens.fontFamily, fontSize: 11 },
        axisLine: { lineStyle: { color: tokens.axis } },
        axisLabel: axisLabelStyle(ctx, tokens),
        splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid } },
      },
    },
    parallelAxis: dimensions.map((dimension, index) => ({
      dim: index,
      name: dimension.name,
      min: dimension.min,
      max: dimension.max,
    })),
    series: [
      {
        type: 'parallel',
        lineStyle: {
          color: resolveToneColor(ctx.tone, doc),
          opacity: 0.72,
          width: 2,
        },
        data,
      },
    ],
  } satisfies EChartsCoreOption;
}

/** Eje de categorías vertical, compartido por bullet, dumbbell, divergentes y gantt. */
function rowAxis(
  ctx: AfChartBuildContext,
  tokens: ChartTokens,
  labels: readonly string[],
): Record<string, unknown> {
  return {
    type: 'category',
    // De arriba abajo: una lista de indicadores o de jugadores se lee en el orden en que
    // se escribió, y el origen abajo de un eje cartesiano la invertiría.
    inverse: true,
    data: labels.slice(),
    splitLine: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: tokens.label, fontFamily: tokens.fontFamily, fontSize: ctx.mobile ? 10 : 11 },
  };
}

/** Rejilla de una vista por filas con etiquetas a la izquierda. */
function rowGrid(ctx: AfChartBuildContext, right: number): Record<string, unknown> {
  return {
    left: 8,
    right,
    top: (ctx.title ? 34 : 12) + toolboxOffset(ctx) + axisNameOffset(ctx),
    bottom: (ctx.legend ? 40 : 24) + (ctx.xAxis?.name ? 18 : 0),
    containLabel: true,
  };
}

/**
 * Valor observado contra su objetivo.
 *
 * Espera dos series: la medida y el objetivo, con las mismas categorías. El objetivo se
 * dibuja como marca de referencia y no como barra, porque dos barras invitan a comparar
 * su diferencia en vez de leer el cumplimiento.
 */
function buildBulletOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const [measure, target] = ctx.series;
  const measured = measure ? measuredNumbers(seriesNumbers(measure)) : [];
  const targets = target ? measuredNumbers(seriesNumbers(target)) : [];
  const ratios = measured.map((value, index) =>
    Number(((value / (targets[index] || value || 1)) * 100).toFixed(1)),
  );
  const max = ctx.xAxis?.max ?? Math.max(130, ...ratios.map((value) => value + 10));

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: rowGrid(ctx, ctx.mobile ? 40 : 64),
    legend: legendOption(ctx, tokens, [measure?.name ?? '', target?.name ?? ''].filter(Boolean)),
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'axis' },
    xAxis: {
      type: 'value',
      max,
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: axisNameStyle(ctx, tokens),
      ...(ctx.xAxis?.name ? { name: ctx.xAxis.name } : {}),
    },
    yAxis: rowAxis(ctx, tokens, categoryLabels(ctx)),
    series: [
      {
        // Canal de fondo: da la escala completa del indicador, de modo que una barra
        // corta se lea como «lejos del objetivo» y no como «poco dato».
        name: 'rango',
        type: 'bar',
        barWidth: 20,
        silent: true,
        data: ratios.map(() => max),
        itemStyle: { color: tokens.track },
        tooltip: { show: false },
        z: 1,
      },
      {
        name: measure?.name ?? 'Observado',
        type: 'bar',
        barWidth: 10,
        barGap: '-75%',
        // Color de serie además del de cada punto: la leyenda toma el de la serie, y sin
        // él ECharts pinta la muestra con un color de paleta que no aparece en el gráfico.
        itemStyle: { color: tokens.accent },
        data: ratios.map((value) => ({
          value,
          itemStyle: {
            color: value >= 100 ? tokens.success : tokens.accent,
            borderRadius: [0, 2, 2, 0] as [number, number, number, number],
          },
        })),
        label: {
          show: true,
          position: 'right',
          color: tokens.label,
          fontFamily: tokens.fontFamily,
          fontSize: 10,
          formatter: '{c}%',
        },
        z: 3,
      },
      {
        name: target?.name ?? 'Objetivo',
        type: 'scatter',
        symbol: 'rect',
        symbolSize: [2, 20],
        data: ratios.map(() => 100),
        itemStyle: { color: tokens.tooltipText },
        z: 4,
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Descomposición de un cambio en contribuciones sucesivas.
 *
 * Se apila una serie auxiliar transparente que levanta cada columna hasta donde quedó la
 * anterior; los puntos marcados como total se apoyan en el eje.
 */
function buildWaterfallOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const source = ctx.series[0];
  const points = source?.data ?? [];
  const support: (number | string)[] = [];
  const gains: (number | string)[] = [];
  const losses: (number | string)[] = [];
  const totals: (number | string)[] = [];
  let running = 0;

  points.forEach((point) => {
    const value = requiredNumber(point);
    const isTotal = point !== null && typeof point !== 'number' && point.total === true;
    if (isTotal) {
      support.push(0);
      gains.push('-');
      losses.push('-');
      totals.push(value);
      running = value;
      return;
    }
    support.push(value > 0 ? running : running + value);
    gains.push(value > 0 ? value : '-');
    losses.push(value < 0 ? -value : '-');
    totals.push('-');
    running += value;
  });

  const labelBase = {
    show: true,
    fontFamily: tokens.fontFamily,
    fontSize: 9,
  };

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: {
      top: (ctx.title ? 34 : 12) + toolboxOffset(ctx) + axisNameOffset(ctx),
      right: 16,
      bottom: (ctx.legend ? 56 : 44) + (ctx.xAxis?.name ? 18 : 0),
      left: 46,
    },
    legend: legendOption(ctx, tokens, ['Incremento', 'Reducción', 'Total']),
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: categoryLabels(ctx).slice(),
      axisLabel: { ...axisLabelStyle(ctx, tokens), interval: 0, rotate: ctx.mobile ? 40 : 28 },
      axisLine: { lineStyle: { color: tokens.axis } },
      axisTick: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
      nameLocation: 'end',
      nameGap: 12,
      nameTextStyle: { ...axisNameStyle(ctx, tokens), align: 'left' },
      ...axisDomain(ctx.yAxis),
    },
    series: [
      {
        name: 'soporte',
        type: 'bar',
        stack: 'waterfall',
        silent: true,
        itemStyle: { color: 'transparent' },
        tooltip: { show: false },
        data: support,
      },
      {
        name: 'Incremento',
        type: 'bar',
        stack: 'waterfall',
        barWidth: '46%',
        data: gains,
        itemStyle: {
          color: withAlpha(tokens.accent, 0.85),
          borderRadius: [2, 2, 0, 0] as [number, number, number, number],
        },
        label: {
          ...labelBase,
          position: 'top',
          color: tokens.accent,
          formatter: (params: { readonly value: number | string }) =>
            params.value === '-' ? '' : `+${params.value}`,
        },
      },
      {
        name: 'Reducción',
        type: 'bar',
        stack: 'waterfall',
        barWidth: '46%',
        data: losses,
        itemStyle: {
          color: withAlpha(tokens.danger, 0.75),
          borderRadius: [2, 2, 0, 0] as [number, number, number, number],
        },
        label: {
          ...labelBase,
          position: 'bottom',
          color: tokens.danger,
          formatter: (params: { readonly value: number | string }) =>
            params.value === '-' ? '' : `−${params.value}`,
        },
      },
      {
        name: 'Total',
        type: 'bar',
        stack: 'waterfall',
        barWidth: '46%',
        data: totals,
        itemStyle: {
          color: withAlpha(tokens.primary, 0.9),
          borderRadius: [2, 2, 0, 0] as [number, number, number, number],
        },
        label: {
          ...labelBase,
          position: 'top',
          color: tokens.tooltipText,
          fontSize: 10,
          fontWeight: 600,
          formatter: (params: { readonly value: number | string }) =>
            params.value === '-' ? '' : String(params.value),
        },
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Barras a ambos lados de un cero central.
 *
 * El color codifica el signo porque la pregunta es de qué lado de la referencia cae cada
 * fila; usar un color por categoría contestaría otra cosa.
 */
function buildDivergingBarOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const source = ctx.series[0];
  const values = source ? measuredNumbers(seriesNumbers(source)) : [];
  const reach = Math.max(1, ...values.map((value) => Math.abs(value)));

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: rowGrid(ctx, ctx.mobile ? 36 : 56),
    legend: undefined,
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'axis' },
    xAxis: {
      type: 'value',
      min: ctx.xAxis?.min ?? -Number((reach * 1.15).toFixed(2)),
      max: ctx.xAxis?.max ?? Number((reach * 1.15).toFixed(2)),
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: axisNameStyle(ctx, tokens),
      ...(ctx.xAxis?.name ? { name: ctx.xAxis.name } : {}),
    },
    yAxis: rowAxis(ctx, tokens, categoryLabels(ctx)),
    series: [
      {
        type: 'bar',
        barWidth: ctx.mobile ? 9 : 11,
        data: values.map((value) => ({
          value,
          itemStyle: {
            color: withAlpha(value >= 0 ? tokens.accent : tokens.warning, 0.8),
            borderRadius: (value >= 0 ? [0, 2, 2, 0] : [2, 0, 0, 2]) as [
              number,
              number,
              number,
              number,
            ],
          },
        })),
        label: {
          show: true,
          // La etiqueta se aparta hacia el lado en que crece la barra; centrada, quedaría
          // encima del cero y se leería como si perteneciera a la fila contraria.
          position: (params: { readonly value: number }) =>
            params.value >= 0 ? 'right' : 'left',
          color: tokens.label,
          fontFamily: tokens.fontFamily,
          fontSize: 9,
          formatter: (params: { readonly value: number }) =>
            `${params.value > 0 ? '+' : ''}${params.value}`,
        },
        markLine: {
          silent: true,
          symbol: 'none',
          label: { show: false },
          lineStyle: { color: withAlpha(tokens.tooltipText, 0.3) },
          data: [{ xAxis: 0 }],
        },
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Dos momentos por categoría unidos por un segmento.
 *
 * El segmento es el mensaje: convierte el cambio en una longitud legible, en vez de
 * pedir que se resten dos alturas.
 */
function buildDumbbellOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const [before, after] = ctx.series;
  const beforeValues = before ? measuredNumbers(seriesNumbers(before)) : [];
  const afterValues = after ? measuredNumbers(seriesNumbers(after)) : [];
  const labels = categoryLabels(ctx);
  const connectorColor = withAlpha(tokens.label, 0.45);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: rowGrid(ctx, ctx.mobile ? 44 : 68),
    legend: legendOption(ctx, tokens, [before?.name ?? '', after?.name ?? ''].filter(Boolean)),
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    xAxis: {
      type: 'value',
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: axisNameStyle(ctx, tokens),
      ...axisDomain(ctx.xAxis),
    },
    yAxis: rowAxis(ctx, tokens, labels),
    series: [
      {
        // El conector se dibuja como una serie de líneas independientes, una por fila,
        // separadas por un hueco: una sola polilínea uniría también filas contiguas.
        name: 'conector',
        type: 'line',
        silent: true,
        tooltip: { show: false },
        symbol: 'none',
        lineStyle: { color: connectorColor, width: 2 },
        z: 1,
        data: labels.flatMap((_, index) => [
          [beforeValues[index], index],
          [afterValues[index], index],
          [null, null],
        ]),
      },
      {
        name: before?.name ?? 'Antes',
        type: 'scatter',
        symbolSize: ctx.mobile ? 10 : 11,
        data: beforeValues.map((value, index) => [value, index]),
        itemStyle: {
          color: tokens.tooltipBg,
          borderColor: tokens.label,
          borderWidth: 2,
        },
        z: 2,
      },
      {
        name: after?.name ?? 'Después',
        type: 'scatter',
        symbolSize: ctx.mobile ? 10 : 11,
        data: afterValues.map((value, index) => [value, index]),
        itemStyle: { color: tokens.accent, borderColor: tokens.accent, borderWidth: 2 },
        label: {
          show: true,
          position: 'right',
          color: tokens.label,
          fontFamily: tokens.fontFamily,
          fontSize: 9,
          formatter: (params: { readonly dataIndex: number }) => {
            const start = beforeValues[params.dataIndex];
            const end = afterValues[params.dataIndex];
            if (start === undefined || end === undefined || start === 0) {
              return '';
            }
            const change = ((end - start) / start) * 100;
            return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
          },
        },
        z: 3,
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Rejilla de paneles pequeños con escala compartida.
 *
 * Cada serie ocupa su propio sistema de coordenadas. Compartir el dominio vertical es lo
 * que hace comparable la rejilla: con autoescalado por panel, nueve trayectorias muy
 * distintas se dibujarían idénticas.
 */
function buildSmallMultiplesOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const columns = ctx.mobile ? 2 : 3;
  const total = ctx.series.length;
  const rows = Math.max(1, Math.ceil(total / columns));
  const cellWidth = (100 - 8) / columns;
  const cellHeight = (100 - 24) / rows;
  const categories = categoryLabels(ctx).slice();
  const sharedMax =
    ctx.yAxis?.max ??
    Math.ceil(
      Math.max(1, ...ctx.series.flatMap((serie) => measuredNumbers(seriesNumbers(serie)))) * 1.1,
    );

  const grids: Record<string, unknown>[] = [];
  const xAxes: Record<string, unknown>[] = [];
  const yAxes: Record<string, unknown>[] = [];
  const series: Record<string, unknown>[] = [];
  const titles: Record<string, unknown>[] = [];

  ctx.series.forEach((serie, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const left = 4 + column * cellWidth;
    const top = 16 + row * cellHeight;

    grids.push({
      left: `${left}%`,
      top: `${top}%`,
      width: `${cellWidth - 5}%`,
      height: `${cellHeight - 9}%`,
    });
    xAxes.push({
      gridIndex: index,
      type: 'category',
      data: categories.length > 0 ? categories : seriesNumbers(serie).map((_, i) => String(i + 1)),
      axisLine: { lineStyle: { color: tokens.grid } },
      axisTick: { show: false },
      axisLabel: { show: false },
    });
    yAxes.push({
      gridIndex: index,
      type: 'value',
      max: sharedMax,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
      // Sólo la primera columna rotula: repetir la misma escala nueve veces gasta ancho
      // sin añadir información.
      axisLabel: {
        show: column === 0,
        color: tokens.label,
        fontFamily: tokens.fontFamily,
        fontSize: 8,
      },
    });
    series.push({
      name: serie.name,
      type: 'line',
      xAxisIndex: index,
      yAxisIndex: index,
      data: seriesNumbers(serie),
      smooth: true,
      symbol: 'none',
      lineStyle: { color: seriesColor(serie, 0, ctx, doc), width: 1.6 },
      areaStyle: { color: withAlpha(seriesColor(serie, 0, ctx, doc), 0.16) },
      // El umbral se repite en cada panel: es el criterio contra el que se lee la
      // rejilla, y dibujarlo sólo en el primero obligaría a trasladarlo con la vista.
      markLine:
        (ctx.thresholds?.length ?? 0) > 0
          ? {
              silent: true,
              symbol: 'none',
              label: { show: false },
              lineStyle: {
                color: withAlpha(
                  decorationColor(ctx.thresholds?.[0] ?? {}, doc, tokens.warning),
                  0.45,
                ),
                type: 'dashed',
              },
              data: (ctx.thresholds ?? []).map((threshold) => ({ yAxis: threshold.value })),
            }
          : undefined,
    });
    titles.push({
      text: serie.name.toUpperCase(),
      left: `${left}%`,
      // La posición va en porcentaje del lienzo: `top` no admite `calc()`, y un valor que
      // ECharts no entiende manda los nueve títulos al borde superior, uno sobre otro.
      top: `${Math.max(0, top - 5)}%`,
      textStyle: {
        color: tokens.label,
        fontFamily: tokens.fontFamily,
        fontSize: 10,
        fontWeight: 400,
      },
    });
  });

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series,
    title: ctx.title
      ? [{ ...(titleOption(ctx, tokens) as Record<string, unknown>) }, ...titles]
      : titles,
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'axis' },
  } satisfies EChartsCoreOption;
}

/**
 * Dispersión con la distribución de cada variable en su margen.
 *
 * Los histogramas los deriva el gráfico de los mismos puntos: pedirlos por separado
 * permitiría que dejaran de coincidir con la nube que acompañan.
 */
function buildScatterMarginalOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const source = ctx.series[0];
  const points =
    source?.data.flatMap((point, index) => {
      if (point === null) {
        return [];
      }
      if (typeof point === 'number') {
        return [[index, point]];
      }
      return [[Number(point.x ?? index), Number(point.y ?? requiredNumber(point))]];
    }) ?? [];

  const bins = (values: readonly number[], count: number, low: number, high: number): number[] => {
    const buckets = Array.from({ length: count }, () => 0);
    values.forEach((value) => {
      const index = Math.min(
        count - 1,
        Math.max(0, Math.floor(((value - low) / (high - low)) * count)),
      );
      buckets[index] += 1;
    });
    return buckets;
  };

  const xValues = points.map((point) => point[0]);
  const yValues = points.map((point) => point[1]);
  const xLow = ctx.xAxis?.min ?? Math.min(...xValues);
  const xHigh = ctx.xAxis?.max ?? Math.max(...xValues);
  const yLow = ctx.yAxis?.min ?? Math.min(...yValues);
  const yHigh = ctx.yAxis?.max ?? Math.max(...yValues);
  const xBins = bins(xValues, 12, xLow, xHigh);
  const yBins = bins(yValues, 10, yLow, yHigh);
  const marginalColor = withAlpha(tokens.primary, 0.55);
  const top = (ctx.title ? 34 : 12) + toolboxOffset(ctx);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    legend: undefined,
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    grid: [
      { left: 56, right: 96, top: top + 44, bottom: 60 },
      { left: 56, right: 96, top, height: 28 },
      { right: 24, width: 60, top: top + 44, bottom: 60 },
    ],
    xAxis: [
      {
        gridIndex: 0,
        type: 'value',
        min: xLow,
        max: xHigh,
        splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
        axisLabel: axisLabelStyle(ctx, tokens),
        axisLine: { lineStyle: { color: tokens.axis } },
        axisTick: { show: false },
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: axisNameStyle(ctx, tokens),
        ...(ctx.xAxis?.name ? { name: ctx.xAxis.name } : {}),
      },
      { gridIndex: 1, type: 'category', data: xBins.map((_, index) => index), show: false },
      { gridIndex: 2, type: 'value', show: false },
    ],
    yAxis: [
      {
        gridIndex: 0,
        type: 'value',
        min: yLow,
        max: yHigh,
        splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
        axisLabel: axisLabelStyle(ctx, tokens),
        axisLine: { show: false },
        axisTick: { show: false },
        nameLocation: 'end',
        nameGap: 12,
        nameTextStyle: { ...axisNameStyle(ctx, tokens), align: 'left' },
        ...(ctx.yAxis?.name ? { name: ctx.yAxis.name } : {}),
      },
      { gridIndex: 1, type: 'value', show: false },
      { gridIndex: 2, type: 'category', data: yBins.map((_, index) => index), show: false },
    ],
    series: [
      {
        type: 'scatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbolSize: 8,
        data: points,
        itemStyle: {
          color: withAlpha(seriesColor(source ?? { name: '', data: [] }, 0, ctx, doc), 0.6),
          borderColor: seriesColor(source ?? { name: '', data: [] }, 0, ctx, doc),
          borderWidth: 0.8,
        },
      },
      {
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: xBins,
        barWidth: '82%',
        itemStyle: { color: marginalColor },
        silent: true,
      },
      {
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: yBins,
        barWidth: '82%',
        itemStyle: { color: marginalColor },
        silent: true,
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Bloques con inicio y fin sobre carriles.
 *
 * Se dibuja con `custom` porque ninguna serie estándar de ECharts admite un rectángulo
 * definido por dos coordenadas del mismo eje.
 */
function buildGanttOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const lanes = categoryLabels(ctx);
  const spans = ctx.spans ?? [];

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: rowGrid(ctx, ctx.mobile ? 16 : 24),
    legend: undefined,
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    xAxis: {
      type: 'value',
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: axisNameStyle(ctx, tokens),
      ...axisDomain(ctx.xAxis),
    },
    yAxis: rowAxis(ctx, tokens, lanes),
    series: [
      {
        type: 'custom',
        renderItem: (
          _params: unknown,
          api: {
            value(index: number): number;
            coord(point: readonly number[]): number[];
            size(range: readonly number[]): number[];
            visual(key: string): string;
          },
        ) => {
          const lane = api.value(0);
          const centre = api.coord([0, lane])[1];
          const height = api.size([0, 1])[1] * 0.46;
          const start = api.coord([api.value(1), lane])[0];
          const end = api.coord([api.value(2), lane])[0];
          return {
            type: 'rect',
            shape: { x: start, y: centre - height / 2, width: end - start, height, r: 3 },
            style: { fill: api.visual('color'), opacity: 0.85 },
          };
        },
        encode: { x: [1, 2], y: 0 },
        data: spans.map((span) => ({
          name: span.label ?? span.lane,
          value: [Math.max(0, lanes.indexOf(span.lane)), span.from, span.to],
          itemStyle: { color: decorationColor(span, doc, tokens.primary) },
        })),
        markLine:
          (ctx.thresholds?.length ?? 0) > 0
            ? {
                silent: true,
                symbol: 'none',
                data: (ctx.thresholds ?? []).map((threshold) => ({
                  xAxis: threshold.value,
                  lineStyle: {
                    color: withAlpha(decorationColor(threshold, doc, tokens.danger), 0.55),
                  },
                  label: {
                    show: Boolean(threshold.label),
                    formatter: threshold.label ?? '',
                    color: tokens.label,
                    fontFamily: tokens.fontFamily,
                    fontSize: 9,
                  },
                })),
              }
            : undefined,
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Rango por periodo dibujado como vela.
 *
 * Cada punto es `[apertura, cierre, mínimo, máximo]`. El color codifica la dirección del
 * periodo, no su magnitud, y por eso usa los tonos de éxito y peligro del tema: son los
 * únicos dos estados posibles.
 */
function buildCandlestickOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const source = ctx.series[0];
  const nameTextStyle = axisNameStyle(ctx, tokens);
  const series: Record<string, unknown>[] = [
    {
      type: 'candlestick',
      barWidth: ctx.mobile ? '58%' : '46%',
      data: source?.data.map((point) => tupleValue(point).slice()) ?? [],
      itemStyle: {
        color: withAlpha(tokens.success, 0.35),
        color0: withAlpha(tokens.danger, 0.3),
        borderColor: tokens.success,
        borderColor0: tokens.danger,
        borderWidth: 1.2,
      },
    },
  ];
  attachDecorations(series, ctx, doc, tokens);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: {
      top: (ctx.title ? 34 : 12) + toolboxOffset(ctx) + axisNameOffset(ctx),
      right: 12,
      bottom: 28,
      left: 46,
    },
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    xAxis: {
      type: 'category',
      data: categoryLabels(ctx).slice(),
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { lineStyle: { color: tokens.axis } },
      axisTick: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      // Una serie de pesos corporales oscila en torno a un valor alto: anclar el eje al
      // cero dejaría todas las velas aplastadas en una franja de pocos píxeles.
      scale: ctx.yAxis?.min === undefined,
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
      nameLocation: 'end',
      nameGap: 12,
      nameTextStyle: { ...nameTextStyle, align: 'left' },
      ...axisDomain(ctx.yAxis),
    },
    series,
  } satisfies EChartsCoreOption;
}

/**
 * Heatmap sobre la cuadrícula real del calendario.
 *
 * Los datos llegan como puntos con `x` en formato ISO. El rango se declara aparte para
 * que las celdas sin dato existan igualmente: el hueco es información —un descanso, una
 * baja— y deducir el rango de las observaciones lo borraría.
 */
function buildCalendarOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const source = ctx.series[0];
  const values =
    source?.data.map((point) =>
      point === null
        ? ['', null]
        : typeof point === 'number'
          ? ['', point]
          : [String(point.x ?? ''), requiredNumber(point)],
    ) ?? [];
  const max = Math.max(1, ...values.map((entry) => Number(entry[1])));

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    visualMap: {
      show: ctx.legend,
      min: 0,
      max: ctx.yAxis?.max ?? max,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      itemWidth: 10,
      itemHeight: 110,
      text: [String(ctx.yAxis?.max ?? max), '0'],
      inRange: { color: tokens.scale.slice() },
      textStyle: { color: tokens.label, fontFamily: tokens.fontFamily, fontSize: 10 },
    },
    calendar: {
      top: (ctx.title ? 58 : 32) + toolboxOffset(ctx),
      left: 44,
      right: 24,
      bottom: ctx.legend ? 44 : 16,
      cellSize: ['auto', ctx.mobile ? 14 : 22],
      range: ctx.dateRange ? [ctx.dateRange.from, ctx.dateRange.to] : undefined,
      splitLine: { show: true, lineStyle: { color: tokens.axis, width: 1 } },
      itemStyle: { color: 'transparent', borderColor: tokens.tooltipBg, borderWidth: 2 },
      dayLabel: {
        color: tokens.label,
        fontFamily: tokens.fontFamily,
        fontSize: 9,
        nameMap: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      },
      monthLabel: {
        color: tokens.label,
        fontFamily: tokens.fontFamily,
        fontSize: 10,
        nameMap: [
          'ENE',
          'FEB',
          'MAR',
          'ABR',
          'MAY',
          'JUN',
          'JUL',
          'AGO',
          'SEP',
          'OCT',
          'NOV',
          'DIC',
        ],
      },
      yearLabel: { show: false },
    },
    series: [{ type: 'heatmap', coordinateSystem: 'calendar', data: values }],
  } satisfies EChartsCoreOption;
}

/** Nombre visible de un nodo; los vínculos siempre se resuelven por `id`. */
function nodeLabel(node: { readonly id: string; readonly label?: string }): string {
  return node.label ?? node.id;
}

/**
 * Flujo de cantidades entre estados sucesivos.
 *
 * ECharts identifica nodos y vínculos por nombre, así que las etiquetas visibles se usan
 * como identidad; un `id` duplicado fusionaría dos estados distintos en uno.
 */
function buildSankeyOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const graph = ctx.graph ?? { nodes: [], links: [] };

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item', triggerOn: 'mousemove' },
    series: [
      {
        type: 'sankey',
        left: 8,
        // El margen derecho aloja la etiqueta del último nivel, que se dibuja fuera del
        // nodo: sin él, los estados terminales quedan recortados por el borde.
        right: ctx.mobile ? 76 : 110,
        top: (ctx.title ? 48 : 20) + toolboxOffset(ctx),
        bottom: 16,
        nodeWidth: 10,
        nodeGap: 12,
        data: graph.nodes.map((node) => ({
          name: nodeLabel(node),
          itemStyle: {
            color: node.color ?? (node.tone ? resolveToneColor(node.tone, doc) : tokens.primary),
            borderColor: 'transparent',
          },
        })),
        links: graph.links.map((link) => {
          const from = graph.nodes.find((node) => node.id === link.from);
          const to = graph.nodes.find((node) => node.id === link.to);
          return {
            source: from ? nodeLabel(from) : link.from,
            target: to ? nodeLabel(to) : link.to,
            value: link.value,
          };
        }),
        label: { color: tokens.label, fontFamily: tokens.fontFamily, fontSize: ctx.mobile ? 9 : 10 },
        lineStyle: { color: 'gradient', opacity: 0.28, curveness: 0.5 },
        emphasis: { focus: 'adjacency', lineStyle: { opacity: 0.5 } },
      },
    ],
  } satisfies EChartsCoreOption;
}

/** Jerarquía de proporciones anidadas. */
function buildTreemapOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  /**
   * @param inherited Color de la rama padre. Las hojas lo heredan salvo que declaren el
   * suyo: si cada hoja tomara un color por su posición, el orden dentro del grupo se
   * leería como magnitud y contradiría al área, que es lo que de verdad la codifica.
   */
  const toNode = (
    node: AfChartTreeNode,
    index: number,
    inherited?: string,
  ): Record<string, unknown> => {
    const color =
      node.color ??
      (node.tone ? resolveToneColor(node.tone, doc) : undefined) ??
      inherited ??
      tokens.scale[Math.min(index + 1, tokens.scale.length - 1)];

    return {
      name: node.name,
      ...(node.value !== undefined ? { value: node.value } : {}),
      ...(node.children
        ? { children: node.children.map((child, childIndex) => toNode(child, childIndex, color)) }
        : {}),
      itemStyle: { color },
    };
  };

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    series: [
      {
        type: 'treemap',
        top: (ctx.title ? 46 : 16) + toolboxOffset(ctx),
        left: 4,
        right: 4,
        bottom: 6,
        roam: false,
        nodeClick: ctx.interactive ? 'zoomToNode' : false,
        breadcrumb: { show: false },
        itemStyle: { borderColor: tokens.tooltipBg, borderWidth: 2, gapWidth: 2 },
        label: {
          color: tokens.tooltipText,
          fontFamily: tokens.fontFamily,
          fontSize: ctx.mobile ? 10 : 11,
          fontWeight: 500,
        },
        upperLabel: {
          show: true,
          height: 20,
          color: tokens.label,
          fontFamily: tokens.fontFamily,
          fontSize: 10,
        },
        // Las hojas heredan el color de su rama y se separan por el hueco, no por el
        // tono. Variar la saturación dentro del grupo introduce un segundo codificado
        // que compite con el área —que es la magnitud real— y además arrastra la
        // etiqueta a extremos donde deja de contrastar con su propia celda.
        levels: [
          { itemStyle: { gapWidth: 3, borderWidth: 0 } },
          { itemStyle: { borderWidth: 2, gapWidth: 2 } },
        ],
        data: (ctx.tree ?? []).map((node, index) => toNode(node, index)),
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Red de nodos con posiciones declaradas.
 *
 * Usa `layout: 'none'` a propósito: cuando las coordenadas significan algo —la posición
 * media de cada puesto en el campo—, un layout automático las destruiría y con ellas la
 * mitad del mensaje del gráfico.
 */
function buildNetworkOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const graph = ctx.graph ?? { nodes: [], links: [] };
  const linkWeight = (id: string): number =>
    graph.links
      .filter((link) => link.from === id || link.to === id)
      .reduce((total, link) => total + link.value, 0);
  const maxLinkValue = Math.max(1, ...graph.links.map((link) => link.value));

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    series: [
      {
        type: 'graph',
        layout: 'none',
        top: (ctx.title ? 46 : 16) + toolboxOffset(ctx),
        bottom: 12,
        roam: false,
        data: graph.nodes.map((node) => ({
          name: nodeLabel(node),
          x: node.x,
          y: node.y,
          // El tamaño resume el protagonismo del nodo en la red; sin un `value` propio se
          // deduce del volumen que pasa por él.
          symbolSize: Math.max(20, 16 + (node.value ?? linkWeight(node.id)) * 0.32),
          itemStyle: {
            color: withAlpha(
              node.color ?? (node.tone ? resolveToneColor(node.tone, doc) : tokens.accent),
              0.22,
            ),
            borderColor: node.color ?? tokens.accent,
            borderWidth: 1.4,
          },
          label: {
            show: true,
            color: tokens.tooltipText,
            fontFamily: tokens.fontFamily,
            fontSize: 9,
          },
        })),
        links: graph.links.map((link) => {
          const from = graph.nodes.find((node) => node.id === link.from);
          const to = graph.nodes.find((node) => node.id === link.to);
          return {
            source: from ? nodeLabel(from) : link.from,
            target: to ? nodeLabel(to) : link.to,
            value: link.value,
            lineStyle: {
              width: 0.6 + (link.value / maxLinkValue) * 4,
              color: withAlpha(tokens.primary, 0.5),
              curveness: 0.08,
            },
          };
        }),
        emphasis: {
          focus: 'adjacency',
          itemStyle: { color: withAlpha(tokens.accent, 0.5) },
          lineStyle: { color: tokens.accent, opacity: 0.9 },
        },
      },
    ],
  } satisfies EChartsCoreOption;
}

/** Jerarquía radial navegable por niveles. Comparte los datos de `treemap`. */
function buildSunburstOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const toNode = (
    node: AfChartTreeNode,
    index: number,
    inherited?: string,
  ): Record<string, unknown> => {
    const color =
      node.color ??
      (node.tone ? resolveToneColor(node.tone, doc) : undefined) ??
      inherited ??
      tokens.scale[Math.min(index + 1, tokens.scale.length - 1)];
    return {
      name: node.name,
      ...(node.value !== undefined ? { value: node.value } : {}),
      ...(node.children
        ? { children: node.children.map((child, childIndex) => toNode(child, childIndex, color)) }
        : {}),
      itemStyle: { color },
    };
  };

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    series: [
      {
        type: 'sunburst',
        radius: ['16%', '92%'],
        center: ['50%', ctx.title ? '54%' : '50%'],
        // Sin ordenar: el orden declarado es el del plan de entrenamiento, y reordenar
        // por magnitud rompería la correspondencia con cómo se escribió.
        sort: null,
        nodeClick: ctx.interactive ? 'rootToNode' : false,
        emphasis: { focus: 'ancestor' },
        itemStyle: { borderColor: tokens.tooltipBg, borderWidth: 2 },
        levels: [
          {},
          {
            r0: '16%',
            r: '42%',
            label: {
              rotate: 0,
              // Texto claro: los anillos interiores toman tonos medios de la rampa, y un
              // color oscuro sobre ellos queda por debajo del contraste legible.
              color: tokens.tooltipText,
              fontFamily: tokens.fontFamily,
              fontSize: 11,
              fontWeight: 600,
            },
            itemStyle: { borderWidth: 3 },
          },
          {
            r0: '43%',
            r: '70%',
            label: { align: 'right', color: tokens.tooltipText, fontFamily: tokens.fontFamily, fontSize: 10 },
          },
          {
            r0: '71%',
            r: '90%',
            label: {
              position: 'outside',
              color: tokens.label,
              fontFamily: tokens.fontFamily,
              fontSize: 9,
            },
          },
        ],
        data: (ctx.tree ?? []).map((node, index) => toNode(node, index)),
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Corrientes apiladas sin línea base fija.
 *
 * Se arma a partir de las mismas series y categorías que un área apilada: cada serie es
 * una corriente y cada categoría un instante.
 */
function buildThemeRiverOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const categories = categoryLabels(ctx);
  const data = ctx.series.flatMap((serie) =>
    seriesNumbers(serie).flatMap((value, index) =>
      value === null ? [] : [[categories[index] ?? String(index + 1), value, serie.name]],
    ),
  );

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    legend: legendOption(ctx, tokens, ctx.series.map((serie) => serie.name)),
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'axis' },
    singleAxis: {
      top: (ctx.title ? 46 : 24) + toolboxOffset(ctx),
      bottom: ctx.legend ? 56 : 32,
      left: 52,
      right: 24,
      type: 'category',
      data: categories.slice(),
      axisLine: { lineStyle: { color: tokens.axis } },
      axisTick: { lineStyle: { color: tokens.axis } },
      axisLabel: axisLabelStyle(ctx, tokens),
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
    },
    series: [
      {
        type: 'themeRiver',
        singleAxisIndex: 0,
        data,
        emphasis: { focus: 'series' },
        label: { color: tokens.label, fontFamily: tokens.fontFamily, fontSize: 10 },
        itemStyle: { borderColor: tokens.tooltipBg, borderWidth: 1 },
        color: ctx.series.map(
          (serie, index) =>
            serie.color ??
            (serie.tone ? resolveToneColor(serie.tone, doc) : undefined) ??
            tokens.scale[Math.min(index + 1, tokens.scale.length - 1)],
        ),
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Intercambios entre nodos dispuestos en círculo.
 *
 * Comparte el contrato de `network`, pero el círculo fija la posición: aquí lo que se
 * lee es el grosor de cada cuerda, no dónde cae el nodo.
 */
function buildChordOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const graph = ctx.graph ?? { nodes: [], links: [] };
  const degree = (id: string): number =>
    graph.links
      .filter((link) => link.from === id || link.to === id)
      .reduce((total, link) => total + link.value, 0);
  const maxLinkValue = Math.max(1, ...graph.links.map((link) => link.value));

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    series: [
      {
        type: 'graph',
        layout: 'circular',
        circular: { rotateLabel: true },
        top: (ctx.title ? 52 : 28) + toolboxOffset(ctx),
        bottom: 26,
        left: ctx.mobile ? 56 : 80,
        right: ctx.mobile ? 56 : 80,
        data: graph.nodes.map((node, index) => ({
          name: nodeLabel(node),
          // El tamaño resume la participación total del nodo: sin él, el círculo trata
          // por igual a quien toca todos los balones y a quien apenas participa.
          symbolSize: 16 + (node.value ?? degree(node.id)) * 0.11,
          itemStyle: {
            color:
              node.color ??
              (node.tone ? resolveToneColor(node.tone, doc) : undefined) ??
              tokens.scale[Math.min(index + 1, tokens.scale.length - 1)],
            borderColor: tokens.tooltipBg,
            borderWidth: 2,
          },
          label: { color: tokens.label, fontFamily: tokens.fontFamily, fontSize: 11 },
        })),
        links: graph.links.map((link) => {
          const from = graph.nodes.find((node) => node.id === link.from);
          const to = graph.nodes.find((node) => node.id === link.to);
          return {
            source: from ? nodeLabel(from) : link.from,
            target: to ? nodeLabel(to) : link.to,
            value: link.value,
            lineStyle: {
              width: 1 + (link.value / maxLinkValue) * 6,
              color: 'source',
              opacity: 0.42,
              curveness: 0.32,
            },
          };
        }),
        emphasis: { focus: 'adjacency', lineStyle: { opacity: 0.9 } },
        label: { show: true, position: 'right' },
      },
    ],
  } satisfies EChartsCoreOption;
}

/** Conversión a través de etapas sucesivas. */
function buildFunnelOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const source = ctx.series[0];
  const categories = categoryLabels(ctx);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    series: [
      {
        type: 'funnel',
        top: (ctx.title ? 52 : 28) + toolboxOffset(ctx),
        bottom: 26,
        left: '12%',
        width: '76%',
        minSize: '22%',
        maxSize: '100%',
        gap: 3,
        sort: 'descending',
        funnelAlign: 'center',
        label: {
          position: 'inside',
          color: tokens.tooltipBg,
          fontFamily: tokens.fontFamily,
          fontSize: 11,
          fontWeight: 600,
          formatter: '{b}  {c}',
        },
        labelLine: { show: false },
        itemStyle: { borderColor: tokens.tooltipBg, borderWidth: 2 },
        data:
          source?.data.map((point, index) => ({
            name: pointLabel(point, index, categories),
            value: requiredNumber(point),
            itemStyle: {
              // La rampa ordena las etapas de entrada a salida: el color acompaña al
              // estrechamiento en vez de repartir tonos categóricos entre pasos que son
              // el mismo flujo.
              color: tokens.scale[Math.min(index + 1, tokens.scale.length - 1)],
            },
          })) ?? [],
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Densidades apiladas con desplazamiento vertical.
 *
 * El desplazamiento lo calcula el gráfico a partir de la altura máxima observada: si lo
 * fijara el consumidor, cambiar los datos solaparía las curvas o abriría huecos.
 */
function buildRidgelineOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const groups = ctx.series;
  const densities = groups.map((serie) =>
    serie.data.map((point, index) => {
      const x =
        point !== null && typeof point !== 'number' ? Number(point.x ?? index) : Number(index);
      return { x, y: requiredNumber(point) };
    }),
  );
  const peak = Math.max(1, ...densities.flat().map((entry) => entry.y));
  const offset = Number((peak * 0.78).toFixed(2));
  const names = groups.map((serie) => serie.name);

  const series = groups.map((serie, index) => {
    const color =
      serie.color ??
      (serie.tone ? resolveToneColor(serie.tone, doc) : undefined) ??
      tokens.scale[Math.max(1, tokens.scale.length - 1 - index)];
    return {
      name: serie.name,
      type: 'line',
      data: densities[index].map((entry) => [entry.x, Number((entry.y + index * offset).toFixed(2))]),
      smooth: true,
      symbol: 'none',
      // Las crestas delanteras tapan a las de atrás: el orden de pintado sigue al de
      // declaración para que la superposición sea la esperada.
      z: groups.length - index,
      lineStyle: { color, width: 1.8 },
      areaStyle: { origin: 'start', color: withAlpha(color, 0.3), opacity: 1 },
      markLine: {
        silent: true,
        symbol: 'none',
        label: { show: false },
        lineStyle: { color: withAlpha(tokens.label, 0.18) },
        data: [{ yAxis: index * offset }],
      },
    };
  });

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    legend: undefined,
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { show: false },
    grid: {
      left: ctx.mobile ? 72 : 96,
      right: 28,
      top: (ctx.title ? 44 : 20) + toolboxOffset(ctx),
      bottom: 60,
    },
    xAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { lineStyle: { color: tokens.axis } },
      axisTick: { show: false },
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: axisNameStyle(ctx, tokens),
      ...axisDomain(ctx.xAxis),
    },
    yAxis: {
      type: 'value',
      min: -offset * 0.2,
      max: (groups.length - 1) * offset + peak * 1.1,
      interval: offset,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: tokens.label,
        fontFamily: tokens.fontFamily,
        fontSize: ctx.mobile ? 10 : 11,
        // Se resuelve por posición y no por igualdad: el desplazamiento es decimal y el
        // valor de la marca nunca coincide exactamente con la clave calculada.
        formatter: (value: number) => names[Math.round(value / offset)] ?? '',
      },
    },
    series,
  } satisfies EChartsCoreOption;
}

/**
 * Observaciones individuales por categoría, separadas lateralmente.
 *
 * El desplazamiento es determinista —depende de la posición dentro del grupo, no del
 * azar—: con un generador aleatorio, cada render movería los puntos y una captura
 * dejaría de ser comparable con la siguiente.
 */
function buildBeeswarmOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const groups = ctx.series;
  const points = groups.flatMap((serie, groupIndex) => {
    const values = measuredNumbers(seriesNumbers(serie));
    return values.map((value, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const step = Math.ceil((index + 1) / 2);
      const spread = Math.min(0.34, step * 0.075);
      return {
        value: [groupIndex + side * spread, value, serie.name],
        itemStyle: {
          color: withAlpha(
            serie.color ??
              (serie.tone ? resolveToneColor(serie.tone, doc) : undefined) ??
              tokens.scale[Math.min(groupIndex + 1, tokens.scale.length - 1)],
            0.75,
          ),
          borderColor: withAlpha(tokens.tooltipBg, 0.7),
          borderWidth: 1,
        },
      };
    });
  });
  const names = groups.map((serie) => serie.name);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    legend: undefined,
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    grid: {
      left: 46,
      right: 24,
      top: (ctx.title ? 34 : 12) + toolboxOffset(ctx) + axisNameOffset(ctx),
      bottom: 40,
    },
    xAxis: {
      type: 'value',
      min: -0.6,
      max: groups.length - 0.4,
      interval: 1,
      splitLine: { show: false },
      axisLine: { lineStyle: { color: tokens.axis } },
      axisTick: { show: false },
      axisLabel: {
        color: tokens.label,
        fontFamily: tokens.fontFamily,
        fontSize: ctx.mobile ? 9 : 10,
        formatter: (value: number) => names[value] ?? '',
      },
    },
    yAxis: {
      type: 'value',
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid, type: 'dashed' } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
      nameLocation: 'end',
      nameGap: 12,
      nameTextStyle: { ...axisNameStyle(ctx, tokens), align: 'left' },
      ...axisDomain(ctx.yAxis),
    },
    series: [
      {
        type: 'scatter',
        symbolSize: ctx.mobile ? 12 : 14,
        data: points,
        emphasis: { itemStyle: { color: tokens.accent } },
        markLine: {
          silent: true,
          symbol: 'none',
          label: { show: false },
          lineStyle: { color: withAlpha(tokens.label, 0.15), type: 'dashed' },
          data: groups.map((_, index) => ({ xAxis: index })),
        },
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Conteo representado con unidades repetidas.
 *
 * El total planificado sale del máximo del eje: es lo que convierte «6 sesiones» en «6
 * de 9», que es la lectura que interesa.
 */
function buildPictorialOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const source = ctx.series[0];
  const values = source ? measuredNumbers(seriesNumbers(source)) : [];
  const planned = ctx.xAxis?.max ?? Math.max(1, ...values);
  const unit = { symbol: 'roundRect', symbolSize: [13, 20], symbolRepeat: true, symbolMargin: 5 };

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    legend: undefined,
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    grid: rowGrid(ctx, ctx.mobile ? 40 : 52),
    xAxis: {
      type: 'value',
      max: planned,
      splitLine: { show: false },
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      nameLocation: 'middle',
      nameGap: 24,
      nameTextStyle: axisNameStyle(ctx, tokens),
      ...(ctx.xAxis?.name ? { name: ctx.xAxis.name } : {}),
    },
    yAxis: rowAxis(ctx, tokens, categoryLabels(ctx)),
    series: [
      {
        // Fondo con las unidades pendientes: sin él, una barra corta no distingue «pocas
        // sesiones planificadas» de «muchas sin completar».
        type: 'pictorialBar',
        ...unit,
        symbolClip: false,
        data: values.map(() => planned),
        animation: false,
        silent: true,
        itemStyle: {
          color: 'transparent',
          borderColor: withAlpha(tokens.label, 0.35),
          borderWidth: 1,
        },
        z: 1,
      },
      {
        type: 'pictorialBar',
        ...unit,
        symbolClip: true,
        data: values,
        z: 2,
        itemStyle: { color: tokens.primary },
        label: {
          show: true,
          position: 'right',
          offset: [12, 0],
          color: tokens.label,
          fontFamily: tokens.fontFamily,
          fontSize: 11,
          formatter: (params: { readonly value: number }) => `${params.value}/${planned}`,
        },
      },
    ],
  } satisfies EChartsCoreOption;
}

/** Sectores de ángulo constante y radio proporcional a la magnitud. */
function buildRoseOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const source = ctx.series[0];
  const categories = categoryLabels(ctx);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    legend: legendOption(ctx, tokens),
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    series: [
      {
        type: 'pie',
        // `area` hace el área proporcional al valor; `radius` escalaría el radio y, como
        // el área crece con su cuadrado, exageraría las diferencias.
        roseType: 'area',
        radius: ['14%', ctx.mobile ? '74%' : '82%'],
        center: ['50%', ctx.legend ? '48%' : '54%'],
        itemStyle: { borderColor: tokens.tooltipBg, borderWidth: 2, borderRadius: 3 },
        label: {
          color: tokens.label,
          fontFamily: tokens.fontFamily,
          fontSize: 10,
          formatter: '{b}\n{c}',
        },
        labelLine: { lineStyle: { color: withAlpha(tokens.primary, 0.4) }, length: 6, length2: 8 },
        data:
          source?.data.map((point, index) => ({
            name: pointLabel(point, index, categories),
            value: requiredNumber(point),
            itemStyle: {
              color: tokens.scale[1 + (index % (tokens.scale.length - 1))],
            },
          })) ?? [],
      },
    ],
  } satisfies EChartsCoreOption;
}

/* ── Volumétricos (echarts-gl) ─────────────────────────────────────── */

let glRegistration: Promise<boolean> | null = null;

/**
 * Carga `echarts-gl` bajo demanda y avisa si no está disponible.
 *
 * Es una dependencia opcional: pesa cerca de 700 KB con `claygl` y sólo la necesitan
 * cuatro tipos de gráfico, así que quien no dibuje en volumen no debería pagarla ni al
 * instalar ni al empaquetar. El resultado se memoriza —incluido el fallo— para no
 * reintentar la importación en cada render.
 */
export function ensureEchartsGlRegistered(): Promise<boolean> {
  // Consume the prebuilt distribution instead of the package's ESM entrypoint.
  // echarts-gl 2.1 still publishes extensionless internal imports; Angular's
  // esbuild resolver correctly rejects those imports against ECharts 6.
  glRegistration ??= import('echarts-gl/dist/echarts-gl.js')
    .then(() => true)
    .catch(() => false);
  return glRegistration;
}

/** Estilo compartido de los tres ejes de un sistema tridimensional. */
function axis3d(
  tokens: ChartTokens,
  name: string,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    name,
    type: 'value',
    nameTextStyle: { color: tokens.label, fontSize: 11, fontFamily: tokens.fontFamily },
    axisLine: { lineStyle: { color: withAlpha(tokens.primary, 0.45), width: 1 } },
    axisTick: { lineStyle: { color: withAlpha(tokens.primary, 0.3) } },
    axisLabel: { color: tokens.label, fontSize: 10, fontFamily: tokens.fontFamily },
    splitLine: { lineStyle: { color: withAlpha(tokens.primary, 0.14) } },
    axisPointer: { lineStyle: { color: tokens.accent } },
    ...extra,
  };
}

/** Caja, cámara e iluminación del sistema tridimensional. */
function grid3d(
  ctx: AfChartBuildContext,
  tokens: ChartTokens,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    top: (ctx.title ? 26 : 8) + toolboxOffset(ctx),
    bottom: ctx.legend ? 52 : 16,
    boxWidth: 100,
    boxDepth: 80,
    boxHeight: 70,
    viewControl: {
      alpha: 22,
      beta: 38,
      distance: ctx.mobile ? 190 : 175,
      autoRotate: false,
      damping: 0.86,
      // Más sensibilidad al gesto en pantallas táctiles: el arrastre disponible es el
      // ancho del pulgar, no el de un escritorio.
      rotateSensitivity: ctx.mobile ? 1.6 : 1.2,
      zoomSensitivity: ctx.mobile ? 1.4 : 1.1,
    },
    // La escena se pinta del color de la superficie y no en transparente: la capa WebGL
    // no hereda el fondo del documento y, dejada a su valor propio, recorta un
    // rectángulo negro dentro de la tarjeta.
    environment: tokens.surface,
    axisPointer: {
      lineStyle: { color: tokens.accent },
      label: { color: tokens.tooltipText, fontFamily: tokens.fontFamily, fontSize: 10 },
    },
    splitLine: { lineStyle: { color: withAlpha(tokens.primary, 0.12) } },
    light: {
      main: { intensity: 1.15, shadow: true, shadowQuality: 'medium', alpha: 36, beta: 52 },
      ambient: { intensity: 0.42 },
    },
    ...extra,
  };
}

/** Escala de color compartida por los volumétricos. */
function visualMap3d(
  ctx: AfChartBuildContext,
  tokens: ChartTokens,
  min: number,
  max: number,
  dimension?: number,
): Record<string, unknown> {
  return {
    show: ctx.legend,
    min,
    max,
    text: [String(Math.round(max)), String(Math.round(min))],
    ...(dimension === undefined ? {} : { dimension }),
    calculable: false,
    orient: 'horizontal',
    left: 'center',
    bottom: 0,
    itemWidth: 10,
    itemHeight: 120,
    textStyle: { color: tokens.label, fontSize: 10, fontFamily: tokens.fontFamily },
    inRange: { color: tokens.scale.slice(1) },
  };
}

/** Coordenadas de un punto en volumen; el cuarto elemento colorea la relación. */
function points3d(serie: AfChartSeries | undefined): number[][] {
  return (
    serie?.data.flatMap((point, index) => {
      if (point === null) {
        return [];
      }
      if (typeof point === 'number') {
        return [[index, 0, point, point]];
      }
      const x = Number(point.x ?? index);
      const y = Number(point.y ?? 0);
      const z = Number(point.z ?? requiredNumber(point));
      return [[x, y, z, requiredNumber(point)]];
    }) ?? []
  );
}

function buildScatter3dOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const data = points3d(ctx.series[0]);
  const shades = data.map((point) => point[3]);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    // El rango de color sale de los propios valores: tomarlo del eje Y mezclaría dos
    // magnitudes distintas —la que posiciona el punto y la que lo colorea—.
    visualMap: visualMap3d(ctx, tokens, Math.min(...shades, 0), Math.max(...shades, 1), 3),
    xAxis3D: axis3d(tokens, ctx.xAxis?.name ?? '', axisDomain(ctx.xAxis)),
    yAxis3D: axis3d(tokens, ctx.yAxis?.name ?? ''),
    zAxis3D: axis3d(tokens, ctx.secondaryAxis?.name ?? '', axisDomain(ctx.secondaryAxis)),
    grid3D: grid3d(ctx, tokens),
    series: [
      {
        type: 'scatter3D',
        symbolSize: ctx.mobile ? 6 : 7,
        data,
        itemStyle: {
          opacity: 0.85,
          borderWidth: 0.6,
          borderColor: withAlpha(tokens.tooltipBg, 0.6),
        },
        emphasis: { itemStyle: { color: tokens.accent } },
      },
    ],
  } satisfies EChartsCoreOption;
}

/**
 * Superficie de respuesta sobre una rejilla de puntos.
 *
 * Se reciben los valores ya calculados en vez de una ecuación: el modelo es del análisis
 * —quién ajusta qué y con qué supuestos—, no de la capa de presentación.
 */
function buildSurfaceOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const data = points3d(ctx.series[0]).map((point) => [point[0], point[1], point[2]]);
  const heights = data.map((point) => point[2]);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { show: false },
    visualMap: visualMap3d(
      ctx,
      tokens,
      ctx.secondaryAxis?.min ?? Math.min(...heights, 0),
      ctx.secondaryAxis?.max ?? Math.max(...heights, 1),
    ),
    xAxis3D: axis3d(tokens, ctx.xAxis?.name ?? '', axisDomain(ctx.xAxis)),
    yAxis3D: axis3d(tokens, ctx.yAxis?.name ?? '', axisDomain(ctx.yAxis)),
    zAxis3D: axis3d(tokens, ctx.secondaryAxis?.name ?? '', axisDomain(ctx.secondaryAxis)),
    grid3D: grid3d(ctx, tokens, { boxHeight: 60 }),
    series: [
      {
        type: 'surface',
        data,
        wireframe: { show: true, lineStyle: { color: withAlpha(tokens.tooltipBg, 0.35), width: 1 } },
        shading: 'realistic',
        realisticMaterial: { roughness: 0.5, metalness: 0 },
      },
    ],
  } satisfies EChartsCoreOption;
}

function buildBar3dOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const columns = categoryLabels(ctx);
  const rows = ctx.series.map((serie) => serie.name);
  const data = ctx.series.flatMap((serie, y) =>
    seriesNumbers(serie).flatMap((value, x) => (value === null ? [] : [[x, y, value]])),
  );
  const magnitudes = data.map((entry) => entry[2]);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    visualMap: visualMap3d(
      ctx,
      tokens,
      Math.min(...magnitudes, 0),
      Math.max(...magnitudes, 1),
    ),
    xAxis3D: axis3d(tokens, '', { type: 'category', data: columns.slice() }),
    yAxis3D: axis3d(tokens, '', { type: 'category', data: rows }),
    zAxis3D: axis3d(tokens, ctx.yAxis?.name ?? ''),
    grid3D: grid3d(ctx, tokens, { boxWidth: 110, boxDepth: 90, boxHeight: 60 }),
    series: [
      {
        type: 'bar3D',
        data,
        shading: 'lambert',
        barSize: 5.2,
        bevelSize: 0.28,
        bevelSmoothness: 2,
        itemStyle: { opacity: 0.94 },
        emphasis: { label: { show: false }, itemStyle: { color: tokens.accent } },
      },
    ],
  } satisfies EChartsCoreOption;
}

function buildLine3dOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const data = points3d(ctx.series[0]).map((point) => [point[0], point[1], point[2]]);
  const heights = data.map((point) => point[2]);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    title: titleOption(ctx, tokens),
    toolbox: toolboxOption(ctx, tokens),
    tooltip: { show: false },
    visualMap: {
      ...visualMap3d(
        ctx,
        tokens,
        ctx.secondaryAxis?.min ?? Math.min(...heights, 0),
        ctx.secondaryAxis?.max ?? Math.max(...heights, 1),
        2,
      ),
      inRange: { color: tokens.scale.slice(2) },
    },
    xAxis3D: axis3d(tokens, ctx.xAxis?.name ?? '', axisDomain(ctx.xAxis)),
    yAxis3D: axis3d(tokens, ctx.yAxis?.name ?? '', axisDomain(ctx.yAxis)),
    zAxis3D: axis3d(tokens, ctx.secondaryAxis?.name ?? ''),
    grid3D: grid3d(ctx, tokens, { boxHeight: 55 }),
    series: [{ type: 'line3D', data, lineStyle: { width: 4 } }],
  } satisfies EChartsCoreOption;
}

/**
 * Build an `EChartsCoreOption` for the given ArgFit chart context.
 *
 * The output sticks to ArgFit tokens (no ECharts default palette) and stays
 * intentionally sober so it fits inside cards and dashboards.
 */
export function buildEchartsOption(ctx: AfChartBuildContext, doc: Document): EChartsCoreOption {
  ensureEchartsRegistered();

  const tokens = readTokens(doc);

  switch (ctx.type) {
    case 'donut':
      return buildDonutOption(ctx, doc, tokens);
    case 'gauge':
      return buildGaugeOption(ctx, doc, tokens);
    case 'radar':
      return buildRadarOption(ctx, doc, tokens);
    case 'heatmap':
    case 'correlation':
      return buildHeatmapOption(ctx, doc, tokens);
    case 'boxplot':
      return buildBoxplotOption(ctx, doc, tokens);
    case 'parallel':
      return buildParallelOption(ctx, doc, tokens);
    case 'polar-stacked':
      return buildPolarStackedOption(ctx, doc, tokens);
    case 'candlestick':
      return buildCandlestickOption(ctx, doc, tokens);
    case 'calendar':
      return buildCalendarOption(ctx, doc, tokens);
    case 'sankey':
      return buildSankeyOption(ctx, doc, tokens);
    case 'treemap':
      return buildTreemapOption(ctx, doc, tokens);
    case 'network':
      return buildNetworkOption(ctx, doc, tokens);
    case 'bullet':
      return buildBulletOption(ctx, doc, tokens);
    case 'waterfall':
      return buildWaterfallOption(ctx, doc, tokens);
    case 'diverging-bar':
      return buildDivergingBarOption(ctx, doc, tokens);
    case 'dumbbell':
      return buildDumbbellOption(ctx, doc, tokens);
    case 'small-multiples':
      return buildSmallMultiplesOption(ctx, doc, tokens);
    case 'scatter-marginal':
      return buildScatterMarginalOption(ctx, doc, tokens);
    case 'gantt':
      return buildGanttOption(ctx, doc, tokens);
    case 'sunburst':
      return buildSunburstOption(ctx, doc, tokens);
    case 'themeriver':
      return buildThemeRiverOption(ctx, doc, tokens);
    case 'chord':
      return buildChordOption(ctx, doc, tokens);
    case 'funnel':
      return buildFunnelOption(ctx, doc, tokens);
    case 'ridgeline':
      return buildRidgelineOption(ctx, doc, tokens);
    case 'beeswarm':
      return buildBeeswarmOption(ctx, doc, tokens);
    case 'pictorial':
      return buildPictorialOption(ctx, doc, tokens);
    case 'rose':
      return buildRoseOption(ctx, doc, tokens);
    case 'scatter3d':
      return buildScatter3dOption(ctx, doc, tokens);
    case 'surface':
      return buildSurfaceOption(ctx, doc, tokens);
    case 'bar3d':
      return buildBar3dOption(ctx, doc, tokens);
    case 'line3d':
      return buildLine3dOption(ctx, doc, tokens);
    case 'scatter':
    case 'bubble':
    // El histograma comparte constructor: son barras sobre ejes continuos, apoyadas en
    // el centro de su intervalo, más la curva del ajuste como serie de línea.
    case 'histogram':
      return buildScatterOption(ctx, doc, tokens);
    case 'area':
    case 'bar':
    case 'combo':
    case 'horizontal-bar':
    case 'line':
    case 'sparkline':
    case 'stacked-area':
    case 'stacked-bar':
    case 'stacked-horizontal-bar':
      return buildCartesianOption(ctx, doc, tokens);
  }
}

export { echarts };
