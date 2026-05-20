/**
 * Public chart kinds supported by `<af-chart>`. Internal engines may map each
 * to a richer ECharts configuration but the contract here stays vendor-
 * agnostic.
 */
export type AfChartType = 'line' | 'bar' | 'area' | 'sparkline';

/**
 * Semantic colour tone for a chart series.
 */
export type AfChartTone = 'default' | 'primary' | 'success' | 'warning' | 'danger';

/**
 * Visual density of a chart. `compact` is meant for cards/sparklines,
 * `comfortable` for full panels and dashboards.
 */
export type AfChartDensity = 'compact' | 'comfortable';

/**
 * A single data series of an `AfChart`.
 */
export interface AfChartSeries {
  readonly name: string;
  readonly data: readonly number[];
  readonly tone?: AfChartTone;
}

/**
 * Payload emitted when the consumer selects a point/bar/segment on a chart.
 */
export interface AfChartPointEvent {
  readonly seriesName: string;
  readonly dataIndex: number;
  readonly value: number;
  readonly category?: string;
}
