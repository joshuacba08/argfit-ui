import { Directive, TemplateRef } from '@angular/core';

import type { AfTreeNodeContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afTreeNode]',
})
export class AfTreeNodeDirective {
  constructor(readonly templateRef: TemplateRef<AfTreeNodeContext>) {}
}
