import { InjectionToken } from '@angular/core';
import { ɵcreateSharedLazyLoader } from '@argfit-ui/core';

export type AfChartRuntime = typeof import('@argfit-ui/chart-runtime');
export interface AfChartRuntimeLoader {
  load(): Promise<AfChartRuntime>;
  reset(): void;
}

const RUNTIME_KEY = '@argfit-ui/chart-runtime';

export function createAfChartRuntimeLoader(
  importer: () => Promise<AfChartRuntime> = () => import('@argfit-ui/chart-runtime'),
): AfChartRuntimeLoader {
  return ɵcreateSharedLazyLoader(RUNTIME_KEY, importer);
}

export const AF_CHART_RUNTIME_LOADER = new InjectionToken<AfChartRuntimeLoader>(
  'AF_CHART_RUNTIME_LOADER_MOBILE',
  {
    factory: () => createAfChartRuntimeLoader(),
  },
);
