import { describe, expect, it } from 'vitest';

import { buildEchartsOption, ensureEchartsRegistered } from './af-chart-echarts';

describe('ArgFit chart runtime', () => {
  it('builds vendor options without requiring an Angular renderer', () => {
    const option = buildEchartsOption(
      {
        type: 'line',
        tone: 'default',
        density: 'comfortable',
        categories: ['L', 'M', 'X'],
        series: [{ name: 'Carga', data: [520, 610, 570] }],
        indicators: [],
        legend: true,
        showGrid: true,
        interactive: true,
        mobile: false,
      },
      document,
    ) as { series: readonly { type: string }[] };

    expect(option.series[0]?.type).toBe('line');
  });

  it('registers the modular ECharts surface idempotently', () => {
    expect(() => {
      ensureEchartsRegistered();
      ensureEchartsRegistered();
    }).not.toThrow();
  });
});
