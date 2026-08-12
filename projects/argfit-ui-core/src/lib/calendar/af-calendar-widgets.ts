import type { AfCalendarTimelineSegment } from '../types/calendar-widget.types';
import type { AfCalendarEvent } from '../types/calendar.types';

import { afCalendarToday } from './af-calendar-date';
import type { AfCalendarLayoutBounds } from './af-calendar-layout';
import { afCalendarEventsOn } from './af-calendar-range';
import { afCalendarClamp, afCalendarNowMinutes, afCalendarToMinutes } from './af-calendar-time';

/**
 * Selección temporal para los widgets de solo lectura.
 *
 * Los widgets del dashboard responden a «qué sigue», y eso depende del reloj.
 * Un reloj implícito haría que cada captura de la puerta visual comparase un
 * momento distinto, así que el instante de referencia se pasa como dato.
 */

/** Instante de referencia en hora de pared. */
export interface AfCalendarMoment {
  readonly date: string;
  readonly minutes: number;
}

/**
 * Convierte `YYYY-MM-DDTHH:mm` en un instante de referencia.
 *
 * Sin valor devuelve el reloj del dispositivo, que es lo correcto en
 * producción; las historias y los tests pasan uno fijo.
 */
export function afCalendarMoment(value?: string, now: Date = new Date()): AfCalendarMoment {
  if (!value) {
    return { date: afCalendarToday(now), minutes: afCalendarNowMinutes(now) };
  }
  const [date, time] = value.split('T');
  return { date, minutes: afCalendarToMinutes(time ?? '00:00') };
}

/**
 * Próximas ocurrencias temporizadas, ordenadas.
 *
 * Una actividad en curso sigue siendo «próxima» hasta que termina: sacarla de
 * la lista en el minuto en que empieza es exactamente cuando el usuario más la
 * está mirando.
 */
export function afCalendarUpcomingEvents(
  events: readonly AfCalendarEvent[],
  from: AfCalendarMoment,
  limit = 5,
): readonly AfCalendarEvent[] {
  return events
    .filter((event) => {
      if (event.kind === 'all-day') return false;
      if (event.date > from.date) return true;
      return event.date === from.date && afCalendarToMinutes(event.end) >= from.minutes;
    })
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || afCalendarToMinutes(a.start) - afCalendarToMinutes(b.start),
    )
    .slice(0, limit);
}

/**
 * Minutos que faltan para una ocurrencia. `null` si ya empezó o no es hoy.
 */
export function afCalendarMinutesUntil(
  event: AfCalendarEvent,
  from: AfCalendarMoment,
): number | null {
  if (event.date !== from.date) return null;
  const delta = afCalendarToMinutes(event.start) - from.minutes;
  return delta > 0 ? delta : null;
}

/**
 * Posiciona las ocurrencias de un día dentro de una franja horizontal.
 *
 * `offset` y `length` son relativos (0 a 1) para que el widget solo tenga que
 * multiplicar por 100 y ponerlos en porcentaje: la franja se adapta al ancho
 * disponible sin medir nada.
 */
export function afCalendarTimelineSegments(
  events: readonly AfCalendarEvent[],
  date: string,
  bounds: AfCalendarLayoutBounds,
): readonly AfCalendarTimelineSegment[] {
  const span = bounds.maxMinutes - bounds.minMinutes;
  if (span <= 0) return [];

  return afCalendarEventsOn(events, date)
    .filter((event) => event.kind !== 'all-day')
    .filter(
      (event) =>
        afCalendarToMinutes(event.end) > bounds.minMinutes &&
        afCalendarToMinutes(event.start) < bounds.maxMinutes,
    )
    .sort((a, b) => afCalendarToMinutes(a.start) - afCalendarToMinutes(b.start))
    .map((event) => {
      const start = afCalendarClamp(
        afCalendarToMinutes(event.start),
        bounds.minMinutes,
        bounds.maxMinutes,
      );
      const end = afCalendarClamp(
        afCalendarToMinutes(event.end),
        bounds.minMinutes,
        bounds.maxMinutes,
      );
      return {
        event,
        offset: (start - bounds.minMinutes) / span,
        length: Math.max((end - start) / span, 0.01),
      };
    });
}
