import {
  BarChart,
  BoxplotChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  ParallelChart,
  PieChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  ParallelComponent,
  RadarComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import type {
  AfChartDensity,
  AfChartIndicator,
  AfChartPoint,
  AfChartSeries,
  AfChartTone,
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
    GridComponent,
    LegendComponent,
    RadarComponent,
    ParallelComponent,
    VisualMapComponent,
    TitleComponent,
    TooltipComponent,
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
}

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
}

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
  };
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

function numericValue(value: number | AfChartPoint | AfChartValue): number {
  const raw = isPoint(value) ? value.value : value;
  if (Array.isArray(raw)) {
    return Number(raw[0] ?? 0);
  }
  return Number(raw);
}

function tupleValue(value: number | AfChartPoint): readonly number[] {
  const raw = pointValue(value);
  return Array.isArray(raw) ? raw.map(Number) : [Number(raw)];
}

function pointLabel(
  value: number | AfChartPoint,
  index: number,
  categories: readonly string[],
): string {
  if (isPoint(value)) {
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

function seriesNumbers(series: AfChartSeries): number[] {
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
      fontFamily: 'inherit',
      fontSize: ctx.mobile ? 11 : 12,
    },
    axisPointer: {
      lineStyle: { color: tokens.axis, width: 1 },
      crossStyle: { color: tokens.axis },
    },
  };
}

function legendOption(
  ctx: AfChartBuildContext,
  tokens: ChartTokens,
): Record<string, unknown> | undefined {
  if (!ctx.legend) {
    return undefined;
  }
  return {
    bottom: 0,
    icon: 'roundRect',
    itemGap: ctx.mobile ? 10 : 14,
    itemHeight: 8,
    itemWidth: 18,
    textStyle: {
      color: tokens.label,
      fontFamily: 'inherit',
      fontSize: ctx.mobile ? 10 : 11,
    },
  };
}

function axisLabelStyle(ctx: AfChartBuildContext, tokens: ChartTokens): Record<string, unknown> {
  return {
    color: tokens.label,
    fontFamily: 'inherit',
    fontSize: ctx.mobile ? 10 : 11,
  };
}

function buildCartesianOption(
  ctx: AfChartBuildContext,
  doc: Document,
  tokens: ChartTokens,
): EChartsCoreOption {
  const isArea = ctx.type === 'area';
  const isBar = ctx.type === 'bar' || ctx.type === 'stacked-bar' || ctx.type === 'horizontal-bar';
  const isHorizontal = ctx.type === 'horizontal-bar';
  const isSparkline = ctx.type === 'sparkline';
  const categories = categoryLabels(ctx);
  const axisLabel = axisLabelStyle(ctx, tokens);

  const series = ctx.series.map((s, index) => {
    const color = seriesColor(s, index, ctx, doc);
    const base = {
      name: s.name,
      data: seriesNumbers(s),
      emphasis: { focus: 'series' as const },
      itemStyle: { color },
    };

    if (isBar) {
      return {
        ...base,
        type: 'bar' as const,
        barMaxWidth: ctx.mobile ? 18 : 28,
        stack: ctx.type === 'stacked-bar' ? 'total' : undefined,
        itemStyle: {
          color,
          borderRadius: isHorizontal
            ? ([0, 4, 4, 0] as [number, number, number, number])
            : ([4, 4, 0, 0] as [number, number, number, number]),
        },
      };
    }

    return {
      ...base,
      type: 'line' as const,
      smooth: true,
      showSymbol: !isSparkline,
      symbolSize: isSparkline ? 0 : ctx.mobile ? 5 : 6,
      lineStyle: { color, width: isSparkline ? 2 : ctx.mobile ? 2.5 : 2 },
      areaStyle: isArea ? { color, opacity: 0.18 } : undefined,
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

  const valueAxis = {
    type: 'value',
    scale: !isBar,
    splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid } },
    axisLabel,
    axisLine: { show: false },
    axisTick: { show: false },
  };
  const categoryAxis = {
    type: 'category',
    data: categories.slice(),
    boundaryGap: isBar,
    splitLine: { show: false },
    axisLine: { lineStyle: { color: tokens.axis } },
    axisTick: { show: false },
    axisLabel,
  };

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: {
      top: ctx.title ? 34 : 12,
      right: isHorizontal ? 18 : 12,
      bottom: ctx.legend ? 36 : ctx.mobile ? 28 : 24,
      left: isHorizontal ? 72 : ctx.mobile ? 32 : 40,
      containLabel: false,
    },
    legend: legendOption(ctx, tokens),
    title: titleOption(ctx, tokens),
    tooltip: tooltipOption(ctx, tokens),
    xAxis: isHorizontal ? valueAxis : categoryAxis,
    yAxis: isHorizontal ? categoryAxis : valueAxis,
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
      fontFamily: 'inherit',
      fontSize: ctx.mobile ? 12 : 13,
      fontWeight: 600,
    },
    subtextStyle: {
      color: tokens.label,
      fontFamily: 'inherit',
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
      value: numericValue(item),
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
          textStyle: { color: tokens.label, fontFamily: 'inherit', fontSize: ctx.mobile ? 11 : 12 },
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
  const value = numericValue(firstSeries?.data[0] ?? 0);
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
          fontFamily: 'inherit',
          fontSize: ctx.mobile ? 40 : 38,
          fontWeight: 800,
          offsetCenter: [0, '-8%'],
          valueAnimation: ctx.interactive,
          formatter: '{value}',
        },
        title: {
          color: tokens.label,
          fontFamily: 'inherit',
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
        fontFamily: 'inherit',
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

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: { top: ctx.title ? 34 : 12, right: 12, bottom: ctx.legend ? 48 : 24, left: 58 },
    title: titleOption(ctx, tokens),
    tooltip: tooltipOption(ctx, tokens),
    visualMap: {
      show: ctx.legend,
      min: 0,
      max,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 4,
      inRange: { color: [tokens.track, tokens.primary, tokens.accent] },
      textStyle: { color: tokens.label, fontFamily: 'inherit', fontSize: 10 },
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
      { type: 'heatmap', data: values, emphasis: { itemStyle: { borderColor: tokens.accent } } },
    ],
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
  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: { top: ctx.title ? 34 : 12, right: 12, bottom: 28, left: 42 },
    title: titleOption(ctx, tokens),
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
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'boxplot',
        data: ctx.series.map((s) => boxData(seriesNumbers(s))),
        itemStyle: {
          borderColor: color,
          color: tokens.fillSoft,
        },
      },
    ],
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
    s.data.map((point) => (typeof point === 'number' ? 0 : Number(point.z ?? 0))),
  );
  const maxMagnitude = Math.max(1, ...magnitudes);

  return {
    animationDuration: animationDuration(ctx, doc),
    backgroundColor: 'transparent',
    grid: { top: ctx.title ? 34 : 12, right: 16, bottom: 32, left: 46 },
    title: titleOption(ctx, tokens),
    tooltip: { ...tooltipOption(ctx, tokens), trigger: 'item' },
    legend: legendOption(ctx, tokens),
    xAxis: {
      type: 'value',
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { lineStyle: { color: tokens.axis } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { show: ctx.showGrid, lineStyle: { color: tokens.grid } },
      axisLabel: axisLabelStyle(ctx, tokens),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: ctx.series.map((serie, index) => ({
      name: serie.name,
      type: 'scatter',
      data: serie.data.map((point, pointIndex) => {
        if (typeof point === 'number') {
          return [pointIndex, point, 0];
        }
        const x = Number(point.x ?? pointIndex);
        const y = Number(point.y ?? (Array.isArray(point.value) ? point.value[0] : point.value));
        const z = Number(point.z ?? 0);
        return [x, y, z];
      }),
      symbolSize: isBubble
        ? (value: readonly number[]) => 8 + Math.sqrt(Number(value[2] ?? 0) / maxMagnitude) * 28
        : 10,
      itemStyle: {
        color: seriesColor(serie, index, ctx, doc),
        opacity: isBubble ? 0.7 : 0.9,
      },
    })),
  } satisfies EChartsCoreOption;
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
        nameTextStyle: { color: tokens.label, fontFamily: 'inherit', fontSize: 11 },
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
      return buildHeatmapOption(ctx, doc, tokens);
    case 'boxplot':
      return buildBoxplotOption(ctx, doc, tokens);
    case 'parallel':
      return buildParallelOption(ctx, doc, tokens);
    case 'scatter':
    case 'bubble':
      return buildScatterOption(ctx, doc, tokens);
    case 'area':
    case 'bar':
    case 'horizontal-bar':
    case 'line':
    case 'sparkline':
    case 'stacked-bar':
      return buildCartesianOption(ctx, doc, tokens);
  }
}

export { echarts };
