import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[afToolbarStart]',
})
export class AfToolbarStartDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[afToolbarCenter]',
})
export class AfToolbarCenterDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[afToolbarEnd]',
})
export class AfToolbarEndDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

export const AF_TOOLBAR_SLOT_DIRECTIVES = [
  AfToolbarStartDirective,
  AfToolbarCenterDirective,
  AfToolbarEndDirective,
] as const;
