import { Directive, input, TemplateRef } from '@angular/core';

import type { AfTabPanelContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afTabPanel]',
})
export class AfTabPanelDirective {
  readonly tabId = input.required<string>({ alias: 'afTabPanel' });

  constructor(readonly templateRef: TemplateRef<AfTabPanelContext>) {}
}