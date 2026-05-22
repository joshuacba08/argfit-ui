import { Directive, TemplateRef } from '@angular/core';

import type { AfDataViewItemContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afDataViewItem]',
})
export class AfDataViewItemDirective {
  constructor(readonly templateRef: TemplateRef<AfDataViewItemContext>) {}
}
