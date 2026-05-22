import { Directive } from '@angular/core';

@Directive({
  selector: '[afDataViewActions]',
  host: { class: 'af-data-view__actions-slot' },
})
export class AfDataViewActionsDirective {}

@Directive({
  selector: '[afDataViewEmpty]',
  host: { class: 'af-data-view__empty-slot' },
})
export class AfDataViewEmptyDirective {}

@Directive({
  selector: '[afDataViewLoading]',
  host: { class: 'af-data-view__loading-slot' },
})
export class AfDataViewLoadingDirective {}

export const AF_DATA_VIEW_SLOT_DIRECTIVES = [
  AfDataViewActionsDirective,
  AfDataViewEmptyDirective,
  AfDataViewLoadingDirective,
] as const;