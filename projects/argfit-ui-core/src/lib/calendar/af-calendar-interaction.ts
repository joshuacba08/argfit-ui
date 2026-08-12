import type { AfCalendarInteractionOrigin } from '../types/calendar-mutation.types';
import type { AfCalendarLabels } from '../types/calendar.types';

import { afCalendarAddDays, afCalendarLongDate } from './af-calendar-date';
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
  readonly kind: 'timed' | 'all-day';
  readonly endDate?: string;
  readonly anchorEndDate?: string;
  readonly durationDays: number;
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
  readonly kind?: 'timed' | 'all-day';
  readonly endDate?: string;
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
  readonly days?: number;
}

/** Reglas públicas y vendor-neutral compartidas por puntero y teclado. */
export interface AfCalendarInteractionConstraints {
  readonly snapMinutes?: number;
  readonly minDurationMinutes?: number;
  readonly maxDurationMinutes?: number;
}

export function afCalendarBeginInteraction(
  source: AfCalendarInteractionSource,
): AfCalendarInteractionState {
  const kind = source.kind ?? 'timed';
  const endDate =
    kind === 'all-day' ? (source.endDate ?? afCalendarAddDays(source.date, 1)) : undefined;
  return {
    mode: source.mode,
    origin: source.origin,
    eventId: source.eventId ?? null,
    date: source.date,
    startMinutes: source.startMinutes,
    endMinutes: source.endMinutes,
    resourceId: source.resourceId,
    kind,
    endDate,
    anchorEndDate: endDate,
    durationDays: endDate ? dayDistance(source.date, endDate) : 0,
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

export interface AfCalendarInteractionConversion {
  readonly kind: 'timed' | 'all-day';
  readonly date: string;
  readonly startMinutes?: number;
  readonly durationMinutes?: number;
  readonly durationDays?: number;
}

/**
 * Cambia de lane usando fecha civil y geometría absoluta.
 *
 * Se llama en cada frame mientras el puntero cruza el límite, por lo que no
 * acumula deltas ni produce saltos al volver a la grilla horaria.
 */
export function afCalendarConvertInteraction(
  state: AfCalendarInteractionState,
  conversion: AfCalendarInteractionConversion,
): AfCalendarInteractionState {
  if (conversion.kind === 'all-day') {
    const durationDays = Math.max(1, conversion.durationDays ?? (state.durationDays || 1));
    return {
      ...state,
      kind: 'all-day',
      date: conversion.date,
      endDate: afCalendarAddDays(conversion.date, durationDays),
      durationDays,
      startMinutes: 0,
      endMinutes: 24 * 60,
    };
  }

  const durationMinutes = Math.max(
    AF_CALENDAR_MIN_DURATION_MINUTES,
    conversion.durationMinutes ?? (state.durationMinutes || 60),
  );
  const startMinutes = conversion.startMinutes ?? state.startMinutes;
  return {
    ...state,
    kind: 'timed',
    date: conversion.date,
    startMinutes,
    endMinutes: startMinutes + durationMinutes,
    durationMinutes,
    durationDays: 0,
    endDate: undefined,
  };
}

export function afCalendarApplyDelta(
  state: AfCalendarInteractionState,
  delta: AfCalendarInteractionDelta,
  bounds: AfCalendarLayoutBounds,
  constraints: AfCalendarInteractionConstraints = {},
): AfCalendarInteractionState {
  const snapMinutes = Math.max(1, constraints.snapMinutes ?? AF_CALENDAR_SNAP_MINUTES);
  const minDuration = Math.max(
    1,
    constraints.minDurationMinutes ?? AF_CALENDAR_MIN_DURATION_MINUTES,
  );
  const maxDuration = Math.max(
    minDuration,
    constraints.maxDurationMinutes ?? bounds.maxMinutes - bounds.minMinutes,
  );
  const minutes = afCalendarSnap(delta.minutes, snapMinutes);
  const min = bounds.minMinutes;
  const max = bounds.maxMinutes;

  if (state.kind === 'all-day') {
    const days = delta.days ?? 0;
    if (state.mode === 'resize-start') {
      const candidate = afCalendarAddDays(state.anchorDate, days);
      const latest = afCalendarAddDays(state.anchorEndDate!, -1);
      const date = candidate < latest ? candidate : latest;
      return { ...state, date, durationDays: dayDistance(date, state.anchorEndDate!) };
    }
    if (state.mode === 'resize-end') {
      const candidate = afCalendarAddDays(state.anchorEndDate!, days);
      const earliest = afCalendarAddDays(state.anchorDate, 1);
      const endDate = candidate > earliest ? candidate : earliest;
      return { ...state, endDate, durationDays: dayDistance(state.anchorDate, endDate) };
    }
    const date = delta.date ?? afCalendarAddDays(state.anchorDate, days);
    return {
      ...state,
      date,
      endDate: afCalendarAddDays(date, state.durationDays),
    };
  }

  if (state.mode === 'resize-start') {
    const startMinutes = afCalendarClamp(
      state.anchorStartMinutes + minutes,
      Math.max(min, state.anchorEndMinutes - maxDuration),
      state.anchorEndMinutes - minDuration,
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
      state.anchorStartMinutes + minDuration,
      Math.min(max, state.anchorStartMinutes + maxDuration),
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
    if (endMinutes - startMinutes < minDuration) {
      endMinutes = startMinutes + minDuration;
    }
    if (endMinutes - startMinutes > maxDuration) {
      endMinutes = startMinutes + maxDuration;
    }
    startMinutes = afCalendarClamp(startMinutes, min, max - minDuration);
    endMinutes = afCalendarClamp(endMinutes, startMinutes + minDuration, max);
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
  kind?: 'timed' | 'all-day';
  endDate?: string;
} {
  return {
    date: state.date,
    start: afCalendarToHhMm(state.startMinutes),
    end: afCalendarToHhMm(state.endMinutes),
    resourceId: state.resourceId,
    kind: state.kind,
    endDate: state.endDate,
  };
}

function dayDistance(start: string, end: string): number {
  const [startYear, startMonth, startDay] = start.split('-').map(Number);
  const [endYear, endMonth, endDay] = end.split('-').map(Number);
  return Math.max(
    1,
    Math.round(
      (Date.UTC(endYear, endMonth - 1, endDay) - Date.UTC(startYear, startMonth - 1, startDay)) /
        86_400_000,
    ),
  );
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
