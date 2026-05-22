import { Directive } from '@angular/core';

@Directive({
  selector: '[afOrderListActions]',
  host: { class: 'af-order-list__actions-slot' },
})
export class AfOrderListActionsDirective {}

@Directive({
  selector: '[afOrderListEmpty]',
  host: { class: 'af-order-list__empty-slot' },
})
export class AfOrderListEmptyDirective {}

@Directive({
  selector: '[afOrderListLoading]',
  host: { class: 'af-order-list__loading-slot' },
})
export class AfOrderListLoadingDirective {}

export const AF_ORDER_LIST_SLOT_DIRECTIVES = [
  AfOrderListActionsDirective,
  AfOrderListEmptyDirective,
  AfOrderListLoadingDirective,
] as const;
