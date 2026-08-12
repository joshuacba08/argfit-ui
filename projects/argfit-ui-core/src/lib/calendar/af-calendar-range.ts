import type { AfCalendarDayLoad } from '../types/calendar-widget.types';
import type {
  AfCalendarEvent,
  AfCalendarLabels,
  AfCalendarView,
  AfCalendarVisibleRange,
  AfCalendarWeekday,
} from '../types/calendar.types';

import {
  afCalendarAddDays,
  afCalendarAddMonths,
  afCalendarDayOfWeek,
  afCalendarStartOfMonth,
  afCalendarStartOfWeek,
} from './af-calendar-date';
import { afCalendarToMinutes } from './af-calendar-time';

/**
 * Resolución del rango visible y navegación entre rangos.
 *
 * La semana laboral no es un motor aparte: es la vista `week` con `hiddenDays`.
 * `resources` tampoco lo es: es un día con columnas por recurso.
 */

export interface AfCalendarRangeOptions {
  readonly firstDay: AfCalendarWeekday;
  readonly hiddenDays: readonly AfCalendarWeekday[];
  readonly labels: AfCalendarLabels;
  readonly timeZone: string;
}

/** Días que cada vista abarca antes de descontar los ocultos. */
const VIEW_SPAN: Readonly<Record<AfCalendarView, number>> = {
  day: 1,
  'three-day': 3,
  week: 7,
  'work-week': 7,
  month: 42,
  agenda: 7,
  resources: 1,
};

/** Días ocultos implícitos de cada vista, sumados a los del consumidor. */
const VIEW_HIDDEN_DAYS: Partial<Record<AfCalendarView, readonly AfCalendarWeekday[]>> = {
  'work-week': [0, 6],
};

function rangeStart(view: AfCalendarView, anchorDate: string, firstDay: AfCalendarWeekday): string {
  if (view === 'week' || view === 'work-week') return afCalendarStartOfWeek(anchorDate, firstDay);
  if (view === 'month') return afCalendarStartOfWeek(afCalendarStartOfMonth(anchorDate), firstDay);
  return anchorDate;
}

function hiddenDaysFor(
  view: AfCalendarView,
  hiddenDays: readonly AfCalendarWeekday[],
): ReadonlySet<AfCalendarWeekday> {
  return new Set([...(VIEW_HIDDEN_DAYS[view] ?? []), ...hiddenDays]);
}

/** Los 42 días de la grilla de mes, incluidos los de relleno. */
export function afCalendarMonthCells(
  anchorDate: string,
  firstDay: AfCalendarWeekday = 1,
): readonly string[] {
  const start = afCalendarStartOfWeek(afCalendarStartOfMonth(anchorDate), firstDay);
  return Array.from({ length: 42 }, (_, index) => afCalendarAddDays(start, index));
}

function rangeTitle(
  view: AfCalendarView,
  anchorDate: string,
  days: readonly string[],
  labels: AfCalendarLabels,
): string {
  const monthIndex = (date: string): number => Number(date.slice(5, 7)) - 1;
  const dayNumber = (date: string): number => Number(date.slice(8, 10));
  const year = (date: string): string => date.slice(0, 4);

  if (view === 'month') {
    return `${labels.months[monthIndex(anchorDate)]} ${year(anchorDate)}`;
  }

  const first = days[0] ?? anchorDate;
  const last = days[days.length - 1] ?? first;

  if (first === last) {
    const weekday = labels.weekdaysShort[afCalendarDayOfWeek(first)];
    return `${weekday} ${dayNumber(first)} ${labels.months[monthIndex(first)]} ${year(first)}`;
  }
  if (first.slice(0, 7) === last.slice(0, 7)) {
    return `${dayNumber(first)}–${dayNumber(last)} ${labels.months[monthIndex(first)]} ${year(first)}`;
  }
  return (
    `${dayNumber(first)} ${labels.monthsShort[monthIndex(first)]} – ` +
    `${dayNumber(last)} ${labels.monthsShort[monthIndex(last)]} ${year(last)}`
  );
}

/**
 * Ventana visible de la vista.
 *
 * `days` ya excluye los días ocultos; `start` y `end` describen el rango
 * completo que la aplicación debe cargar, con `end` exclusivo.
 */
export function afCalendarVisibleRange(
  view: AfCalendarView,
  anchorDate: string,
  options: AfCalendarRangeOptions,
): AfCalendarVisibleRange {
  const start = rangeStart(view, anchorDate, options.firstDay);
  const span = VIEW_SPAN[view];
  const hidden = hiddenDaysFor(view, options.hiddenDays);

  const all = Array.from({ length: span }, (_, index) => afCalendarAddDays(start, index));
  const days = all.filter((date) => !hidden.has(afCalendarDayOfWeek(date)));

  return {
    view,
    anchorDate,
    start,
    end: afCalendarAddDays(start, span),
    days,
    title: rangeTitle(view, anchorDate, days, options.labels),
    timeZone: options.timeZone,
  };
}

/**
 * Nueva fecha ancla al navegar.
 *
 * `direction` 0 no es un no-op: significa "volver a hoy" y lo resuelve el
 * llamador pasando la fecha de hoy como ancla.
 */
export function afCalendarNavigate(
  view: AfCalendarView,
  anchorDate: string,
  direction: -1 | 1,
  options: AfCalendarRangeOptions,
): string {
  if (view === 'month') return afCalendarAddMonths(anchorDate, direction);
  const step = view === 'week' || view === 'work-week' || view === 'agenda' ? 7 : VIEW_SPAN[view];
  return afCalendarAddDays(anchorDate, step * direction);
}

export function afCalendarEventsOn(
  events: readonly AfCalendarEvent[],
  date: string,
  resourceId?: string,
): readonly AfCalendarEvent[] {
  return events.filter((event) => {
    const occurs =
      event.kind === 'all-day'
        ? event.date <= date && date < (event.endDate ?? afCalendarAddDays(event.date, 1))
        : event.date === date;
    return occurs && (resourceId === undefined || event.resourceId === resourceId);
  });
}

export function afCalendarEventDuration(event: AfCalendarEvent): number {
  if (event.kind === 'all-day') return 0;
  return Math.max(0, afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start));
}

/** Minutos planificados por día, normalizados contra el pico del rango. */
export function afCalendarWeekLoad(
  events: readonly AfCalendarEvent[],
  days: readonly string[],
): readonly AfCalendarDayLoad[] {
  const perDay = days.map((date) => {
    const timed = afCalendarEventsOn(events, date).filter((event) => event.kind !== 'all-day');
    return {
      date,
      minutes: timed.reduce((total, event) => total + afCalendarEventDuration(event), 0),
      eventCount: timed.length,
    };
  });
  const peak = Math.max(1, ...perDay.map((day) => day.minutes));
  return perDay.map((day) => ({ ...day, intensity: day.minutes / peak }));
}
