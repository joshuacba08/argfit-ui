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
 * Contrato de altura de una `AfMetricCard`.
 *
 * La superficie de la tarjeta rellena siempre su host: la altura la decide el layout que
 * la contiene, no el largo de su contenido. Sin eso, una fila de grilla estira el host y
 * deja tarjetas de alturas distintas, que es un defecto del componente y no algo que el
 * consumidor deba parchear.
 *
 * El input `fill` cubre el caso restante: cuando es el propio host el que no recibe altura
 * (un flex con `align-items` distinto de `stretch`, un padre con altura fija), `fill` hace
 * que la reclame. Es una afirmación sobre el layout, no sobre el dato, y por eso es un
 * booleano y no una variante de `AfMetricCardSize`: no cambia la escala tipográfica ni el
 * `min-height` que sigue siendo el piso de la tarjeta.
 */

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
