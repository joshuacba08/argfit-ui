import { Directive } from '@angular/core';

@Directive({
  selector: '[afOrganizationChartActions]',
  host: { class: 'af-organization-chart__actions-slot' },
})
export class AfOrganizationChartActionsDirective {}

@Directive({
  selector: '[afOrganizationChartEmpty]',
  host: { class: 'af-organization-chart__empty-slot' },
})
export class AfOrganizationChartEmptyDirective {}

@Directive({
  selector: '[afOrganizationChartLoading]',
  host: { class: 'af-organization-chart__loading-slot' },
})
export class AfOrganizationChartLoadingDirective {}

export const AF_ORGANIZATION_CHART_SLOT_DIRECTIVES = [
  AfOrganizationChartActionsDirective,
  AfOrganizationChartEmptyDirective,
  AfOrganizationChartLoadingDirective,
] as const;