import { Directive } from '@angular/core';

@Directive({
  selector: '[afAnalyticsCardActions]',
  host: { class: 'af-analytics-card__actions-slot' },
})
export class AfAnalyticsCardActionsDirective {}

@Directive({
  selector: '[afAnalyticsCardMetrics]',
  host: { class: 'af-analytics-card__metrics-slot' },
})
export class AfAnalyticsCardMetricsDirective {}

@Directive({
  selector: '[afAnalyticsCardLegend]',
  host: { class: 'af-analytics-card__legend-slot' },
})
export class AfAnalyticsCardLegendDirective {}

@Directive({
  selector: '[afAnalyticsCardFooter]',
  host: { class: 'af-analytics-card__footer-slot' },
})
export class AfAnalyticsCardFooterDirective {}

export const AF_ANALYTICS_CARD_SLOT_DIRECTIVES = [
  AfAnalyticsCardActionsDirective,
  AfAnalyticsCardMetricsDirective,
  AfAnalyticsCardLegendDirective,
  AfAnalyticsCardFooterDirective,
] as const;
