import type { AfCalendarEvent } from '../types/calendar.types';

import { afCalendarClamp, afCalendarToMinutes } from './af-calendar-time';

/**
 * Layout de solapamientos: columnas deterministas, independiente del DOM.
 *
 * Las ocurrencias se agrupan en clusters de eventos que se pisan entre sí, y
 * dentro de cada cluster se empaquetan en la primera columna libre. El resultado
 * es el mismo en servidor y en navegador, y no depende de medir nada.
 */

export interface AfCalendarLayoutBounds {
  readonly minMinutes: number;
  readonly maxMinutes: number;
}

export interface AfCalendarLaidOutEvent {
  readonly event: AfCalendarEvent;
  /** Índice de columna dentro del cluster, base 0. */
  readonly column: number;
  /** Cantidad de columnas del cluster. */
  readonly columns: number;
  /** Inicio recortado a los límites de la grilla, en minutos desde medianoche. */
  readonly topMinutes: number;
  /** Duración visible tras el recorte. */
  readonly durationMinutes: number;
}

interface Placed {
  readonly event: AfCalendarEvent;
  readonly start: number;
  readonly end: number;
  column: number;
}

/**
 * Empaqueta las ocurrencias temporizadas de un día en columnas.
 *
 * Los eventos que caen enteramente fuera de `bounds` se descartan; los que
 * cruzan un borde se recortan conservando al menos un minuto de alto para que
 * sigan siendo alcanzables por teclado.
 */
export function afCalendarLayoutDay(
  events: readonly AfCalendarEvent[],
  bounds: AfCalendarLayoutBounds,
): readonly AfCalendarLaidOutEvent[] {
  const timed = events
    .filter((event) => event.kind !== 'all-day')
    .map<Placed>((event) => ({
      event,
      start: afCalendarToMinutes(event.start),
      end: afCalendarToMinutes(event.end),
      column: 0,
    }))
    .filter((item) => item.end > bounds.minMinutes && item.start < bounds.maxMinutes)
    .sort(
      (a, b) => a.start - b.start || b.end - a.end || a.event.id.localeCompare(b.event.id),
    );

  const out: AfCalendarLaidOutEvent[] = [];
  let cluster: Placed[] = [];
  let clusterEnd = -1;

  const flush = (): void => {
    if (cluster.length === 0) return;
    const columns: Placed[][] = [];
    for (const item of cluster) {
      let index = columns.findIndex((column) => column[column.length - 1].end <= item.start);
      if (index === -1) {
        columns.push([item]);
        index = columns.length - 1;
      } else {
        columns[index].push(item);
      }
      item.column = index;
    }
    for (const item of cluster) {
      const top = afCalendarClamp(item.start, bounds.minMinutes, bounds.maxMinutes);
      const bottom = afCalendarClamp(item.end, bounds.minMinutes, bounds.maxMinutes);
      out.push({
        event: item.event,
        column: item.column,
        columns: columns.length,
        topMinutes: top,
        durationMinutes: Math.max(1, bottom - top),
      });
    }
    cluster = [];
    clusterEnd = -1;
  };

  for (const item of timed) {
    if (cluster.length > 0 && item.start >= clusterEnd) flush();
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, item.end);
  }
  flush();

  return out;
}

export interface AfCalendarMonthCellEvents {
  readonly visible: readonly AfCalendarEvent[];
  readonly overflowCount: number;
}

/**
 * Reparte las ocurrencias de una celda de mes entre visibles y overflow.
 *
 * Los eventos de todo el día van primero; la celda nunca crece, así que el
 * excedente se comunica de forma explícita con `+N más`.
 */
export function afCalendarMonthOverflow(
  events: readonly AfCalendarEvent[],
  visibleCount: number,
): AfCalendarMonthCellEvents {
  const ordered = [...events].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'all-day' ? -1 : 1;
    if (a.kind === 'all-day') return a.title.localeCompare(b.title);
    return afCalendarToMinutes(a.start) - afCalendarToMinutes(b.start);
  });
  if (ordered.length <= visibleCount) {
    return { visible: ordered, overflowCount: 0 };
  }
  // Se reserva un lugar para el enlace de overflow: mostrar N y ocultar 1 sería
  // peor que mostrar N-1 y decir "+2 más".
  const keep = Math.max(0, visibleCount - 1);
  return { visible: ordered.slice(0, keep), overflowCount: ordered.length - keep };
}
