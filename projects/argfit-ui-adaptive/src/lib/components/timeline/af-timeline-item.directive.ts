import { Directive, TemplateRef } from '@angular/core';

import type { AfTimelineItemContext } from '@argfit-ui/core';

@Directive({
  selector: 'ng-template[afTimelineItem]',
})
export class AfTimelineItemDirective {
  constructor(readonly templateRef: TemplateRef<AfTimelineItemContext>) {}
}