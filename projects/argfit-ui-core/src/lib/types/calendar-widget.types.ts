import type { AfCalendarEvent } from './calendar.types';

/**
 * Tipos compartidos por los widgets de calendario (`AfCalendarUpcoming`,
 * `AfCalendarWeekLoad`, `AfCalendarDayTimeline`, …).
 *
 * Los widgets son superficies de solo lectura sobre el mismo modelo de
 * ocurrencias: no cargan el motor de interacción del calendario completo.
 */

/** Minutos planificados en un día del rango. */
export interface AfCalendarDayLoad {
  readonly date: string;
  readonly minutes: number;
  readonly eventCount: number;
  /** `minutes` normalizado contra el pico del rango, entre 0 y 1. */
  readonly intensity: number;
}

/** Ocurrencia posicionada dentro de una franja horizontal de tiempo. */
export interface AfCalendarTimelineSegment {
  readonly event: AfCalendarEvent;
  /** Desplazamiento desde el inicio de la franja, entre 0 y 1. */
  readonly offset: number;
  /** Ancho relativo dentro de la franja, entre 0 y 1. */
  readonly length: number;
}
