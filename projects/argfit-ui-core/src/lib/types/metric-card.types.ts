import type { AfIconName } from './icon.types';

export type AfMetricCardTone =
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

export type AfMetricCardSize = 'sm' | 'md' | 'lg';

export type AfMetricCardDensity = 'compact' | 'comfortable';

export type AfMetricCardVariant = 'surface' | 'elevated' | 'outline';

export type AfMetricTrendDirection = 'up' | 'down' | 'flat';

export type AfMetricCardIconName = AfIconName;

/**
 * Lifecycle of the value shown by an `AfMetricCard`.
 *
 * Mirrors `AfAnalyticsCardState` on purpose: both cards represent a measurement, so
 * a consumer should not have to learn two different ways of saying "there is nothing
 * to show yet".
 *
 * `empty` is not a styling variant — it is a statement about the data. A metric with no
 * sample must render its empty text, never `0`, because a zero is itself a valid
 * measurement and conflating the two misreports the underlying data.
 */
export type AfMetricCardState = 'ready' | 'loading' | 'empty' | 'error';

/**
 * Sample behind an aggregate metric.
 *
 * Publishing the numerator and denominator lets a reader judge how much the number is
 * worth: `1 / 1` and `240 / 240` both render as 100 %, and they do not mean the same thing.
 */
export interface AfMetricSample {
  readonly numerator: number;
  readonly denominator: number;
}

/**
 * Where a metric's value came from.
 *
 * A value that was typed by a coach, one derived from captured events and one inferred by
 * a model carry different weight. Surfacing the difference is what keeps a dashboard
 * honest, so it belongs in the component contract rather than in each product's markup.
 */
export type AfMetricProvenance =
  | 'observed'
  | 'imported'
  | 'calculated'
  | 'estimated'
  | 'needs-validation';

/** Default Spanish labels for `AfMetricProvenance`. Override per card when needed. */
export const AF_METRIC_PROVENANCE_LABEL: Readonly<Record<AfMetricProvenance, string>> = {
  observed: 'Observado',
  imported: 'Importado',
  calculated: 'Calculado',
  estimated: 'Estimado',
  'needs-validation': 'Requiere validación',
};
