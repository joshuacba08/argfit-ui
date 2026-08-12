import type { AfCalendarInteractionOrigin } from '../types/calendar-mutation.types';
import type { AfCalendarLabels } from '../types/calendar.types';

import { afCalendarLongDate } from './af-calendar-date';
import type { AfCalendarLayoutBounds } from './af-calendar-layout';
import {
    AF_CALENDAR_MIN_DURATION_MINUTES,
    AF_CALENDAR_SNAP_MINUTES,
    afCalendarClamp,
    afCalendarSnap,
    afCalendarToHhMm,
} from './af-calendar-time';

/**
 * Máquina de estados headless de arrastre, resize y creación por rango.
 *
 * Vive en core y no toca el DOM: los dos renderers comparten exactamente las
 * mismas reglas de imantado, mínimo y recorte, y esas reglas se pueden testear
 * sin puntero ni navegador — que es la única forma realista de probarlas.
 */

export type AfCalendarInteractionMode = 'move' | 'resize-start' | 'resize-end' | 'create';

export interface AfCalendarInteractionState {
  readonly mode: AfCalendarInteractionMode;
  readonly origin: AfCalendarInteractionOrigin;
  /** `null` mientras se dibuja un rango nuevo: todavía no hay evento. */
  readonly eventId: string | null;
  readonly date: string;
  readonly startMinutes: number;
  readonly endMinutes: number;
  readonly resourceId?: string;
  /**
   * Duración de pared del evento al empezar.
   *
   * Se conserva al cambiar de día: mover un entrenamiento de 90 minutos al
   * jueves lo deja de 90 minutos, no de 90 minutos menos lo que se recortó
   * contra el borde de la grilla.
   */
  readonly durationMinutes: number;
  /** Valores originales: cada delta se aplica sobre el ancla, no acumulativo. */
  readonly anchorDate: string;
  readonly anchorStartMinutes: number;
  readonly anchorEndMinutes: number;
  readonly anchorResourceId?: string;
  /** `false` hasta superar el umbral: un click no es un arrastre. */
  readonly active: boolean;
}

export interface AfCalendarInteractionSource {
  readonly mode: AfCalendarInteractionMode;
  readonly origin: AfCalendarInteractionOrigin;
  readonly eventId?: string;
  readonly date: string;
  readonly startMinutes: number;
  readonly endMinutes: number;
  readonly resourceId?: string;
}

/**
 * Delta a aplicar sobre el ancla.
 *
 * La columna llega ya resuelta: solo el renderer sabe si el eje horizontal son
 * días o recursos, y el motor no tiene por qué enterarse.
 */
export interface AfCalendarInteractionDelta {
  readonly minutes: number;
  readonly date?: string;
  readonly resourceId?: string;
}

export function afCalendarBeginInteraction(
  source: AfCalendarInteractionSource,
): AfCalendarInteractionState {
  return {
    mode: source.mode,
    origin: source.origin,
    eventId: source.eventId ?? null,
    date: source.date,
    startMinutes: source.startMinutes,
    endMinutes: source.endMinutes,
    resourceId: source.resourceId,
    durationMinutes: source.endMinutes - source.startMinutes,
    anchorDate: source.date,
    anchorStartMinutes: source.startMinutes,
    anchorEndMinutes: source.endMinutes,
    anchorResourceId: source.resourceId,
    active: false,
  };
}

/** Marca la interacción como real una vez superado el umbral de arrastre. */
export function afCalendarActivateInteraction(
  state: AfCalendarInteractionState,
): AfCalendarInteractionState {
  return state.active ? state : { ...state, active: true };
}

export function afCalendarApplyDelta(
  state: AfCalendarInteractionState,
  delta: AfCalendarInteractionDelta,
  bounds: AfCalendarLayoutBounds,
): AfCalendarInteractionState {
  const minutes = afCalendarSnap(delta.minutes, AF_CALENDAR_SNAP_MINUTES);
  const min = bounds.minMinutes;
  const max = bounds.maxMinutes;

  if (state.mode === 'resize-start') {
    const startMinutes = afCalendarClamp(
      state.anchorStartMinutes + minutes,
      min,
      state.anchorEndMinutes - AF_CALENDAR_MIN_DURATION_MINUTES,
    );
    return {
      ...state,
      startMinutes,
      endMinutes: state.anchorEndMinutes,
      durationMinutes: state.anchorEndMinutes - startMinutes,
    };
  }

  if (state.mode === 'resize-end') {
    const endMinutes = afCalendarClamp(
      state.anchorEndMinutes + minutes,
      state.anchorStartMinutes + AF_CALENDAR_MIN_DURATION_MINUTES,
      max,
    );
    return {
      ...state,
      startMinutes: state.anchorStartMinutes,
      endMinutes,
      durationMinutes: endMinutes - state.anchorStartMinutes,
    };
  }

  if (state.mode === 'create') {
    const edge = state.anchorStartMinutes + minutes;
    let startMinutes = Math.min(state.anchorStartMinutes, edge);
    let endMinutes = Math.max(state.anchorStartMinutes, edge);
    if (endMinutes - startMinutes < AF_CALENDAR_MIN_DURATION_MINUTES) {
      endMinutes = startMinutes + AF_CALENDAR_MIN_DURATION_MINUTES;
    }
    startMinutes = afCalendarClamp(startMinutes, min, max - AF_CALENDAR_MIN_DURATION_MINUTES);
    endMinutes = afCalendarClamp(
      endMinutes,
      startMinutes + AF_CALENDAR_MIN_DURATION_MINUTES,
      max,
    );
    return {
      ...state,
      date: delta.date ?? state.date,
      resourceId: delta.resourceId ?? state.resourceId,
      startMinutes,
      endMinutes,
      durationMinutes: endMinutes - startMinutes,
    };
  }

  const startMinutes = afCalendarClamp(
    state.anchorStartMinutes + minutes,
    min,
    max - state.durationMinutes,
  );
  return {
    ...state,
    date: delta.date ?? state.date,
    resourceId: delta.resourceId ?? state.resourceId,
    startMinutes,
    endMinutes: startMinutes + state.durationMinutes,
  };
}

export interface AfCalendarKeyboardDelta {
  /** Minutos a sumar sobre el estado actual. */
  readonly minutes: number;
  /** Columnas a desplazar; el renderer resuelve a qué día o recurso equivalen. */
  readonly columns: number;
}

/**
 * Traduce una tecla a un desplazamiento.
 *
 * Es la contraparte del arrastre: toda intención disponible con el mouse tiene
 * un camino equivalente sin arrastre, o la release no se acepta.
 */
export function afCalendarKeyboardDelta(
  key: string,
  shiftKey = false,
): AfCalendarKeyboardDelta | null {
  const step = shiftKey ? 60 : AF_CALENDAR_SNAP_MINUTES;
  switch (key) {
    case 'ArrowUp':
      return { minutes: -step, columns: 0 };
    case 'ArrowDown':
      return { minutes: step, columns: 0 };
    case 'ArrowLeft':
      return { minutes: 0, columns: -1 };
    case 'ArrowRight':
      return { minutes: 0, columns: 1 };
    default:
      return null;
  }
}

/** Estado propuesto en la forma que consume el constructor de intenciones. */
export function afCalendarProposedInterval(state: AfCalendarInteractionState): {
  date: string;
  start: string;
  end: string;
  resourceId?: string;
} {
  return {
    date: state.date,
    start: afCalendarToHhMm(state.startMinutes),
    end: afCalendarToHhMm(state.endMinutes),
    resourceId: state.resourceId,
  };
}

/**
 * Texto para la live region.
 *
 * Cada paso del modo mover se anuncia: sin esto, quien navega con lector no
 * tiene forma de saber dónde quedó el evento que está moviendo.
 */
export function afCalendarInteractionAnnouncement(
  title: string,
  state: AfCalendarInteractionState,
  labels: AfCalendarLabels,
): string {
  return labels.moveAnnouncement
    .replace('{title}', title)
    .replace('{day}', afCalendarLongDate(state.date, labels))
    .replace('{start}', afCalendarToHhMm(state.startMinutes))
    .replace('{end}', afCalendarToHhMm(state.endMinutes));
}
