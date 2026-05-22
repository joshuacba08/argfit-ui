import { Directive, input, TemplateRef } from '@angular/core';

import type { AfAccordionPanelContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afAccordionPanel]',
})
export class AfAccordionPanelDirective {
  readonly itemId = input.required<string>({ alias: 'afAccordionPanel' });

  constructor(readonly templateRef: TemplateRef<AfAccordionPanelContext>) {}
}