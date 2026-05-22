import { Directive, TemplateRef, inject } from '@angular/core';

import type { AfKanbanCardContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afKanbanCard]',
})
export class AfKanbanCardDirective {
  readonly templateRef = inject<TemplateRef<AfKanbanCardContext>>(TemplateRef);
}
