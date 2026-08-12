import type { AfCalendarLabels, AfCalendarWeekday } from '../types/calendar.types';

/**
 * Aritmética de fecha civil para `AfCalendar`.
 *
 * Todas las funciones operan sobre strings `YYYY-MM-DD` y usan `Date` solo como
 * calculadora de calendario en horario local, nunca como instante. `toISOString`
 * está prohibido en este módulo: convierte a UTC y desplaza el día para la mitad
 * del planeta.
 */

function toParts(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

/**
 * Serializa un `Date` como fecha civil `YYYY-MM-DD`.
 *
 * Lee los componentes locales a propósito: `toISOString()` convierte a UTC y
 * desplaza el día para media humanidad.
 */
export function afCalendarCivilDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Interpreta una fecha civil `YYYY-MM-DD` como `Date` a medianoche local.
 *
 * Devuelve `null` ante un formato inválido o una fecha que no existe — el 31 de
 * febrero se serializa sin quejarse en `new Date()` y aparece como 3 de marzo.
 */
export function afCalendarParseCivilDate(value: string | undefined | null): Date | null {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, rawYear, rawMonth, rawDay] = match;
  const year = Number(rawYear);
  const month = Number(rawMonth);
  const day = Number(rawDay);
  const parsed = new Date(year, month - 1, day);

  const rolledOver =
    parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day;

  return Number.isNaN(parsed.getTime()) || rolledOver ? null : parsed;
}

function toDate(date: string): Date {
  const { year, month, day } = toParts(date);
  return new Date(year, month - 1, day);
}

/** Fecha civil de hoy en la zona del dispositivo. */
export function afCalendarToday(now: Date = new Date()): string {
  return afCalendarCivilDate(now);
}

export function afCalendarAddDays(date: string, days: number): string {
  const value = toDate(date);
  value.setDate(value.getDate() + days);
  return afCalendarCivilDate(value);
}

/** 0 = domingo, misma convención que `Date#getDay`. */
export function afCalendarDayOfWeek(date: string): AfCalendarWeekday {
  return toDate(date).getDay() as AfCalendarWeekday;
}

export function afCalendarStartOfWeek(date: string, firstDay: AfCalendarWeekday = 1): string {
  const offset = (afCalendarDayOfWeek(date) - firstDay + 7) % 7;
  return afCalendarAddDays(date, -offset);
}

export function afCalendarStartOfMonth(date: string): string {
  const { year, month } = toParts(date);
  return `${year}-${String(month).padStart(2, '0')}-01`;
}

export function afCalendarAddMonths(date: string, months: number): string {
  const { year, month, day } = toParts(date);
  const value = new Date(year, month - 1 + months, 1);
  // Encajar el día dentro del mes destino: 31 de enero + 1 mes es 28/29 de febrero.
  const lastDay = new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();
  value.setDate(Math.min(day, lastDay));
  return afCalendarCivilDate(value);
}

export function afCalendarIsSameMonth(a: string, b: string): boolean {
  return a.slice(0, 7) === b.slice(0, 7);
}

/**
 * Días civiles entre dos fechas (`b - a`).
 *
 * Se calcula sobre mediodía UTC para que un cambio de horario de verano en el
 * medio no produzca un día de 23 o 25 horas y arruine la división.
 */
export function afCalendarDiffDays(a: string, b: string): number {
  const first = toParts(a);
  const second = toParts(b);
  const from = Date.UTC(first.year, first.month - 1, first.day, 12);
  const to = Date.UTC(second.year, second.month - 1, second.day, 12);
  return Math.round((to - from) / 86_400_000);
}

/** `'Lun 12 de agosto'`. */
export function afCalendarLongDate(date: string, labels: AfCalendarLabels): string {
  const { month, day } = toParts(date);
  const weekday = labels.weekdaysShort[afCalendarDayOfWeek(date)];
  return `${weekday} ${day} de ${labels.months[month - 1].toLowerCase()}`;
}

export function afCalendarIsWeekend(date: string): boolean {
  const dow = afCalendarDayOfWeek(date);
  return dow === 0 || dow === 6;
}
