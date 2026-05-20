import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import type { EChartsCoreOption } from 'echarts/core';
import type {
    AfChartDensity,
    AfChartSeries,
    AfChartTone,
    AfChartType,
} from '@argfit-ui/core';

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
    GridComponent,
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
  readonly title?: string;
  readonly compact?: boolean;
  readonly mobile?: boolean;
}

const TONE_VAR: Record<AfChartTone, string> = {
  default: 'var(--af-chart-primary)',
  primary: 'var(--af-chart-primary)',
  success: 'var(--af-chart-success)',
  warning: 'var(--af-chart-warning)',
  danger: 'var(--af-chart-danger)',
};

/**
 * Resolve an ArgFit chart tone to a concrete CSS colour value at runtime.
 *
 * ECharts cannot interpret CSS custom properties directly, so we read the
 * computed value from the document root.
 */
export function resolveToneColor(tone: AfChartTone, doc: Document): string {
  const cssVar = TONE_VAR[tone].replace('var(', '').replace(')', '');
  const computed = doc.defaultView?.getComputedStyle(doc.documentElement);
  const value = computed?.getPropertyValue(cssVar).trim();
  return value || '#2599D5';
}

function readTokenColor(name: string, doc: Document, fallback: string): string {
  const computed = doc.defaultView?.getComputedStyle(doc.documentElement);
  const value = computed?.getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Build an `EChartsCoreOption` for the given ArgFit chart context.
 *
 * The output sticks to ArgFit tokens (no ECharts default palette) and stays
 * intentionally sober so it fits inside cards and dashboards.
 */
export function buildEchartsOption(
  ctx: AfChartBuildContext,
  doc: Document,
): EChartsCoreOption {
  ensureEchartsRegistered();

  const isSparkline = ctx.type === 'sparkline';
  const isArea = ctx.type === 'area';
  const isBar = ctx.type === 'bar';

  const gridColor = readTokenColor('--af-chart-grid', doc, 'rgba(255,255,255,0.06)');
  const axisColor = readTokenColor('--af-chart-axis', doc, 'rgba(255,255,255,0.12)');
  const labelColor = readTokenColor('--af-chart-label', doc, '#BCCCDC');
  const tooltipBg = readTokenColor('--af-chart-tooltip-bg', doc, 'rgba(10,22,40,0.95)');
  const tooltipText = readTokenColor('--af-chart-tooltip-text', doc, '#F0F4F8');

  const series = ctx.series.map((s) => {
    const color = resolveToneColor(s.tone ?? ctx.tone, doc);
    const base = {
      name: s.name,
      data: [...s.data],
      itemStyle: { color },
      emphasis: { focus: 'series' as const },
    };

    if (isBar) {
      return {
        ...base,
        type: 'bar' as const,
        barMaxWidth: ctx.mobile ? 18 : 28,
        itemStyle: {
          color,
          borderRadius: [4, 4, 0, 0] as [number, number, number, number],
        },
      };
    }

    return {
      ...base,
      type: 'line' as const,
      smooth: !isSparkline,
      showSymbol: !isSparkline,
      symbolSize: isSparkline ? 0 : ctx.mobile ? 4 : 5,
      lineStyle: { color, width: isSparkline ? 2 : ctx.mobile ? 2.5 : 2 },
      areaStyle: isArea
        ? {
            color,
            opacity: 0.18,
          }
        : undefined,
    };
  });

  if (isSparkline) {
    return {
      backgroundColor: 'transparent',
      grid: { top: 4, right: 4, bottom: 4, left: 4, containLabel: false },
      xAxis: { type: 'category', show: false, data: ctx.categories.slice() },
      yAxis: { type: 'value', show: false, scale: true },
      tooltip: { show: false },
      animationDuration: 200,
      series,
    } satisfies EChartsCoreOption;
  }

  const axisLabelStyle = {
    color: labelColor,
    fontSize: ctx.mobile ? 10 : 11,
    fontFamily: 'inherit',
  };

  return {
    backgroundColor: 'transparent',
    animationDuration: 240,
    title: ctx.title
      ? {
          text: ctx.title,
          left: 0,
          top: 0,
          textStyle: {
            color: labelColor,
            fontSize: ctx.mobile ? 12 : 13,
            fontWeight: 600,
          },
        }
      : undefined,
    grid: {
      top: ctx.title ? 32 : 12,
      right: 12,
      bottom: ctx.mobile ? 28 : 24,
      left: ctx.mobile ? 32 : 40,
      containLabel: false,
    },
    tooltip: {
      trigger: isBar ? 'axis' : 'axis',
      backgroundColor: tooltipBg,
      borderColor: 'transparent',
      borderRadius: 8,
      padding: [6, 10],
      textStyle: { color: tooltipText, fontSize: 12, fontFamily: 'inherit' },
      axisPointer: {
        lineStyle: { color: axisColor, width: 1 },
        crossStyle: { color: axisColor },
      },
    },
    xAxis: {
      type: 'category',
      data: ctx.categories.slice(),
      boundaryGap: isBar,
      axisLine: { lineStyle: { color: axisColor } },
      axisTick: { show: false },
      axisLabel: axisLabelStyle,
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: gridColor } },
      axisLabel: axisLabelStyle,
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series,
  } satisfies EChartsCoreOption;
}

export { echarts };
