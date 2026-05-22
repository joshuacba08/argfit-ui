import { Directive, TemplateRef } from '@angular/core';

import type { AfOrganizationChartNodeContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afOrganizationChartNode]',
})
export class AfOrganizationChartNodeDirective {
  constructor(readonly templateRef: TemplateRef<AfOrganizationChartNodeContext>) {}
}