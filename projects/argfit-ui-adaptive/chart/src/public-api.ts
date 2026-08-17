/** Lazy-friendly secondary entry point for the Chart family. */
export {
  AfChartComponent as AfChart,
  AfChartComponent,
} from './lib/af-chart.component';

// ChartCard remains available from the root barrel, but is also exposed here so a
// chart surface can use one coherent import path.
export {
  AfChartCard,
  AfChartCardComponent,
} from '@argfit-ui/adaptive';
