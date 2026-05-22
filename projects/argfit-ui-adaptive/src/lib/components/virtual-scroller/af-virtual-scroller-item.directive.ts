import { Directive, TemplateRef } from '@angular/core';

import type { AfVirtualScrollerItemContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afVirtualScrollerItem]',
})
export class AfVirtualScrollerItemDirective {
  constructor(readonly templateRef: TemplateRef<AfVirtualScrollerItemContext>) {}
}
