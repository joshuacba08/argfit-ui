import { Directive, input, TemplateRef } from '@angular/core';

import type { AfDataTableCellContext, AfDataTableExpandedRowContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afDataTableCell]',
})
export class AfDataTableCellDirective<TRow = unknown> {
  readonly columnKey = input.required<string>({ alias: 'afDataTableCell' });

  constructor(readonly templateRef: TemplateRef<AfDataTableCellContext<TRow>>) {}
}

@Directive({
  selector: 'ng-template[afDataTableExpandedRow]',
})
export class AfDataTableExpandedRowDirective<TRow = unknown> {
  constructor(readonly templateRef: TemplateRef<AfDataTableExpandedRowContext<TRow>>) {}
}
