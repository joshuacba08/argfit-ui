import { Directive, TemplateRef } from '@angular/core';

import type { AfOrderListItemContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afOrderListItem]',
})
export class AfOrderListItemDirective {
  constructor(readonly templateRef: TemplateRef<AfOrderListItemContext>) {}
}
