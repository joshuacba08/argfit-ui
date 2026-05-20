import { Directive } from '@angular/core';

@Directive({
  selector: '[afDataTableToolbar]',
  host: { class: 'af-data-table__toolbar-slot' },
})
export class AfDataTableToolbarDirective {}

@Directive({
  selector: '[afDataTableEmpty]',
  host: { class: 'af-data-table__empty-slot' },
})
export class AfDataTableEmptyDirective {}

export const AF_DATA_TABLE_SLOT_DIRECTIVES = [
  AfDataTableToolbarDirective,
  AfDataTableEmptyDirective,
] as const;
