import { Directive, input, TemplateRef } from '@angular/core';

import type { AfStepPanelContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afStepPanel]',
})
export class AfStepPanelDirective {
  readonly stepId = input.required<string>({ alias: 'afStepPanel' });

  constructor(readonly templateRef: TemplateRef<AfStepPanelContext>) {}
}
