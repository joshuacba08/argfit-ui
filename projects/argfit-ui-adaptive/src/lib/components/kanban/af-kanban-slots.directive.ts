import { Directive, TemplateRef, inject } from '@angular/core';

import type { AfKanbanCardFooterContext, AfKanbanColumnHeaderContext, AfKanbanEmptyContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afKanbanColumnHeader]',
})
export class AfKanbanColumnHeaderDirective {
  readonly templateRef = inject<TemplateRef<AfKanbanColumnHeaderContext>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[afKanbanEmpty]',
})
export class AfKanbanEmptyDirective {
  readonly templateRef = inject<TemplateRef<AfKanbanEmptyContext>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[afKanbanCardFooter]',
})
export class AfKanbanCardFooterDirective {
  readonly templateRef = inject<TemplateRef<AfKanbanCardFooterContext>>(TemplateRef);
}

export const AF_KANBAN_SLOT_DIRECTIVES = [
  AfKanbanColumnHeaderDirective,
  AfKanbanEmptyDirective,
  AfKanbanCardFooterDirective,
] as const;
