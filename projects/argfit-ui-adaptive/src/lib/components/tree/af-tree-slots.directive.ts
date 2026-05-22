import { Directive } from '@angular/core';

@Directive({
  selector: '[afTreeActions]',
  host: { class: 'af-tree__actions-slot' },
})
export class AfTreeActionsDirective {}

@Directive({
  selector: '[afTreeEmpty]',
  host: { class: 'af-tree__empty-slot' },
})
export class AfTreeEmptyDirective {}

@Directive({
  selector: '[afTreeLoading]',
  host: { class: 'af-tree__loading-slot' },
})
export class AfTreeLoadingDirective {}

export const AF_TREE_SLOT_DIRECTIVES = [
  AfTreeActionsDirective,
  AfTreeEmptyDirective,
  AfTreeLoadingDirective,
] as const;
