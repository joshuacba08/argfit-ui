import { InjectionToken, type Signal } from '@angular/core';

import type { AfChartSeries } from '../types/chart.types';

/** @internal Imperative surface used by AfChartCard without retaining AfChart itself. */
export interface ɵAfChartHost {
  readonly categories: Signal<readonly string[]>;
  readonly series: Signal<readonly AfChartSeries[]>;
  refreshSize(): void;
  resetView(): void;
  toDataUrl(): string | null;
}

/** @internal Content-query token that keeps ChartCard independent of the chart entry point. */
export const ɵAF_CHART_HOST = new InjectionToken<ɵAfChartHost>('ARGFIT_AF_CHART_HOST');
