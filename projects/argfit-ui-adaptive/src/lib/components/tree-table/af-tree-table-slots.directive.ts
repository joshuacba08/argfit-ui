import { Directive } from '@angular/core';

@Directive({
  selector: '[afTreeTableActions]',
  host: { class: 'af-tree-table__actions-slot' },
})
export class AfTreeTableActionsDirective {}

@Directive({
  selector: '[afTreeTableEmpty]',
  host: { class: 'af-tree-table__empty-slot' },
})
export class AfTreeTableEmptyDirective {}

@Directive({
  selector: '[afTreeTableLoading]',
  host: { class: 'af-tree-table__loading-slot' },
})
export class AfTreeTableLoadingDirective {}

export const AF_TREE_TABLE_SLOT_DIRECTIVES = [
  AfTreeTableActionsDirective,
  AfTreeTableEmptyDirective,
  AfTreeTableLoadingDirective,
] as const;
