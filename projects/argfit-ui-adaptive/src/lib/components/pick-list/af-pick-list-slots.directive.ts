import { Directive } from '@angular/core';

@Directive({
  selector: '[afPickListActions]',
  host: { class: 'af-pick-list__actions-slot' },
})
export class AfPickListActionsDirective {}

@Directive({
  selector: '[afPickListSourceEmpty]',
  host: { class: 'af-pick-list__source-empty-slot' },
})
export class AfPickListSourceEmptyDirective {}

@Directive({
  selector: '[afPickListTargetEmpty]',
  host: { class: 'af-pick-list__target-empty-slot' },
})
export class AfPickListTargetEmptyDirective {}

@Directive({
  selector: '[afPickListLoading]',
  host: { class: 'af-pick-list__loading-slot' },
})
export class AfPickListLoadingDirective {}

export const AF_PICK_LIST_SLOT_DIRECTIVES = [
  AfPickListActionsDirective,
  AfPickListSourceEmptyDirective,
  AfPickListTargetEmptyDirective,
  AfPickListLoadingDirective,
] as const;
