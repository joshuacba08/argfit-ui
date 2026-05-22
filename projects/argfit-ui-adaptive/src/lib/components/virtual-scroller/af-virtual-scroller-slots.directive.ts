import { Directive } from '@angular/core';

@Directive({
  selector: '[afVirtualScrollerActions]',
  host: { class: 'af-virtual-scroller__actions-slot' },
})
export class AfVirtualScrollerActionsDirective {}

@Directive({
  selector: '[afVirtualScrollerEmpty]',
  host: { class: 'af-virtual-scroller__empty-slot' },
})
export class AfVirtualScrollerEmptyDirective {}

@Directive({
  selector: '[afVirtualScrollerLoading]',
  host: { class: 'af-virtual-scroller__loading-slot' },
})
export class AfVirtualScrollerLoadingDirective {}

export const AF_VIRTUAL_SCROLLER_SLOT_DIRECTIVES = [
  AfVirtualScrollerActionsDirective,
  AfVirtualScrollerEmptyDirective,
  AfVirtualScrollerLoadingDirective,
] as const;
