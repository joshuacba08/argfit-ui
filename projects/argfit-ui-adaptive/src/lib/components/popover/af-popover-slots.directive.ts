import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[afPopoverTrigger]',
})
export class AfPopoverTriggerDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[afPopoverContent]',
})
export class AfPopoverContentDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

export const AF_POPOVER_SLOT_DIRECTIVES = [AfPopoverTriggerDirective, AfPopoverContentDirective] as const;
