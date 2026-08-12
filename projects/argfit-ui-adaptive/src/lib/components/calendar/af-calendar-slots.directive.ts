import { Directive } from '@angular/core';

/**
 * Ranuras de composición de `AfCalendar`.
 *
 * Son directivas marcadoras: la fachada las detecta para saber si el consumidor
 * proyectó algo y, solo en ese caso, baja el template al renderer.
 */

@Directive({
  selector: '[afCalendarToolbar]',
  host: { class: 'af-calendar__toolbar-slot' },
})
export class AfCalendarToolbarDirective {}

@Directive({
  selector: '[afCalendarEmpty]',
  host: { class: 'af-calendar__empty-slot' },
})
export class AfCalendarEmptyDirective {}

@Directive({
  selector: '[afCalendarError]',
  host: { class: 'af-calendar__error-slot' },
})
export class AfCalendarErrorDirective {}

@Directive({
  selector: '[afCalendarFooter]',
  host: { class: 'af-calendar__footer-slot' },
})
export class AfCalendarFooterDirective {}

export const AF_CALENDAR_SLOT_DIRECTIVES = [
  AfCalendarToolbarDirective,
  AfCalendarEmptyDirective,
  AfCalendarErrorDirective,
  AfCalendarFooterDirective,
] as const;
