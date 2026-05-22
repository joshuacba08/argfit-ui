import { Directive, input, TemplateRef } from '@angular/core';

import type { AfTreeTableCellContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afTreeTableCell]',
})
export class AfTreeTableCellDirective {
  readonly columnKey = input.required<string>({ alias: 'afTreeTableCell' });

  constructor(readonly templateRef: TemplateRef<AfTreeTableCellContext>) {}
}
