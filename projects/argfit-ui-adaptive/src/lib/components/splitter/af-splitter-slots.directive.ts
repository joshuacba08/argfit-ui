import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[afSplitterPrimary]',
})
export class AfSplitterPrimaryDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[afSplitterSecondary]',
})
export class AfSplitterSecondaryDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

export const AF_SPLITTER_SLOT_DIRECTIVES = [AfSplitterPrimaryDirective, AfSplitterSecondaryDirective] as const;
