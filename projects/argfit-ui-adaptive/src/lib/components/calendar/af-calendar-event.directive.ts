import { Directive, TemplateRef } from '@angular/core';

import type { AfCalendarDayHeaderContext, AfCalendarEventContext } from '@argfit-ui/core';

/**
 * Templates tipados de `AfCalendar`.
 *
 * El contexto viaja tipado para que el consumidor no tenga que castear en el
 * template: `let-event` ya es un `AfCalendarEvent`.
 */

@Directive({
  selector: 'ng-template[afCalendarEvent]',
})
export class AfCalendarEventDirective {
  constructor(readonly templateRef: TemplateRef<AfCalendarEventContext>) {}
}

@Directive({
  selector: 'ng-template[afCalendarDayHeader]',
})
export class AfCalendarDayHeaderDirective {
  constructor(readonly templateRef: TemplateRef<AfCalendarDayHeaderContext>) {}
}

export const AF_CALENDAR_TEMPLATE_DIRECTIVES = [
  AfCalendarEventDirective,
  AfCalendarDayHeaderDirective,
] as const;
