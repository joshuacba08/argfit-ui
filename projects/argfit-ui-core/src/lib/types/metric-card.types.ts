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
