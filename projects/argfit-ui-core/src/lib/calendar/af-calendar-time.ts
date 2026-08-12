/**
 * Aritmética de hora de pared para `AfCalendar`.
 *
 * Todas las horas son strings `HH:mm` dentro de la zona declarada por el
 * consumidor. Aquí no hay `Date` ni conversión de zona: 09:30 es 570 minutos
 * desde la medianoche local, y punto.
 */

/** Paso de imantado al arrastrar o redimensionar. */
export const AF_CALENDAR_SNAP_MINUTES = 15;

/** Duración mínima de una ocurrencia temporizada. */
export const AF_CALENDAR_MIN_DURATION_MINUTES = 15;

/** Altura conceptual de una banda de la grilla. */
export const AF_CALENDAR_SLOT_MINUTES = 30;

const MINUTES_PER_DAY = 24 * 60;

/**
 * Convierte `HH:mm` a minutos desde medianoche.
 *
 * `'24:00'` es válido y devuelve 1440: es el fin exclusivo de un día completo.
 */
export function afCalendarToMinutes(time: string): number {
  const [hours, minutes] = time.split(':');
  const parsed = Number(hours) * 60 + Number(minutes);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Convierte minutos desde medianoche a `HH:mm`.
 *
 * 1440 se serializa como `'24:00'` para preservar el fin exclusivo de un día
 * completo; por encima de eso el valor se envuelve al día siguiente.
 */
export function afCalendarToHhMm(minutes: number): string {
  const total = Math.round(minutes);
  if (total === MINUTES_PER_DAY) return '24:00';
  const wrapped = ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(wrapped / 60);
  const rest = wrapped % 60;
  return `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

/** `'1 h 30 min'`, `'45 min'`, `'2 h'`. */
export function afCalendarDurationLabel(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function afCalendarSnap(minutes: number, step: number = AF_CALENDAR_SNAP_MINUTES): number {
  if (step <= 0) return Math.round(minutes);
  return Math.round(minutes / step) * step;
}

export function afCalendarClamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Minutos transcurridos del día actual.
 *
 * `now` se inyecta en los tests; en producción es la hora local del dispositivo,
 * que es exactamente lo que el indicador de "ahora" debe reflejar.
 */
export function afCalendarNowMinutes(now: Date = new Date()): number {
  return now.getHours() * 60 + now.getMinutes();
}
