/**
 * Public chart kinds supported by `<af-chart>`. Internal engines may map each
 * kind to a richer ECharts configuration, but the contract stays vendor-
 * agnostic.
 */
export type AfChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'stacked-bar'
  | 'horizontal-bar'
  | 'sparkline'
  | 'donut'
  | 'gauge'
  | 'radar'
  | 'heatmap'
  | 'boxplot'
  | 'parallel';

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
 * Stability marker used by demos and future advanced chart presets.
 */
export type AfChartStatus = 'stable' | 'planned' | 'experimental';

export type AfChartValue = number | readonly number[];

/**
 * Rich point shape for charts that need labels, tuple values or metadata.
 */
export interface AfChartPoint {
  readonly x?: string | number;
  readonly y?: string | number;
  readonly z?: string | number;
  readonly value: AfChartValue;
  readonly label?: string;
  readonly meta?: string;
  readonly status?: AfChartStatus;
}

/**
 * Radar axis metadata. Kept generic so consumers can describe athlete
 * comparison axes without importing ECharts types.
 */
export interface AfChartIndicator {
  readonly name: string;
  readonly max: number;
  readonly min?: number;
}

/**
 * A single data series of an `AfChart`.
 */
export interface AfChartSeries {
  readonly name: string;
  readonly data: readonly (number | AfChartPoint)[];
  readonly tone?: AfChartTone;
  readonly color?: string;
  readonly kind?: AfChartType;
  readonly status?: AfChartStatus;
}

/**
 * Payload emitted when the consumer selects a point/bar/segment on a chart.
 */
export interface AfChartPointEvent {
  readonly seriesName: string;
  readonly dataIndex: number;
  readonly value: AfChartValue;
  readonly category?: string;
  readonly point?: AfChartPoint;
}
