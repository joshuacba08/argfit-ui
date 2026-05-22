import { Directive, TemplateRef } from '@angular/core';

import type { AfPickListItemContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afPickListItem]',
})
export class AfPickListItemDirective {
  constructor(readonly templateRef: TemplateRef<AfPickListItemContext>) {}
}
