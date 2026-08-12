import type { TemplateRef } from '@angular/core';

import type { AfIconName } from './icon.types';

/**
 * Contrato público de `AfCalendar`.
 *
 * El calendario es una superficie de presentación: recibe ocurrencias ya
 * resueltas por la aplicación y emite intenciones tipadas. No expande series,
 * no persiste, no convierte zonas horarias y no infiere la zona del navegador.
 *
 * Todas las fechas son civiles (`YYYY-MM-DD`) y todas las horas son de pared
 * (`HH:mm`) dentro de la zona declarada por el consumidor. El fin de un
 * intervalo es **exclusivo**.
 */

export type AfCalendarView =
  | 'day'
  | 'three-day'
  | 'week'
  | 'work-week'
  | 'month'
  | 'agenda'
  | 'resources';

/** Altura de slot: 24 px, 32 px y 44 px respectivamente. */
export type AfCalendarDensity = 'compact' | 'comfortable' | 'touch';

export type AfCalendarEventKind = 'timed' | 'all-day';

/**
 * Estado de sincronización o disponibilidad de una ocurrencia.
 *
 * El renderer nunca comunica el estado solo con color: siempre lo acompaña con
 * icono, trama o texto.
 */
export type AfCalendarEventState =
  | 'normal'
  | 'tentative'
  | 'pending'
  | 'syncing'
  | 'conflict'
  | 'cancelled'
  | 'readonly'
  | 'error';

/**
 * Token semántico de color de evento. El consumidor pasa un token, nunca CSS
 * arbitrario: cada valor resuelve a `--af-event-<token>-{accent,bg,border}`.
 */
export type AfCalendarColorToken = 'training' | 'match' | 'gym' | 'video' | 'medical' | 'neutral';

/** Día de la semana, 0 = domingo (misma convención que `Date#getDay`). */
export type AfCalendarWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface AfCalendarEvent {
  readonly id: string;
  /** Fecha civil `YYYY-MM-DD`. */
  readonly date: string;
  /** Hora de pared `HH:mm`. Ignorada cuando `kind` es `all-day`. */
  readonly start: string;
  /** Hora de pared `HH:mm`, **exclusiva**. Ignorada cuando `kind` es `all-day`. */
  readonly end: string;
  readonly kind: AfCalendarEventKind;
  /** Fin civil exclusivo de un evento all-day. Por defecto, `date + 1 día`. */
  readonly endDate?: string;
  readonly title: string;
  readonly colorToken: AfCalendarColorToken;
  /** Identidad de la ocurrencia dentro de una serie. */
  readonly occurrenceId?: string;
  /** Identidad de la serie. La expansión la resuelve la aplicación. */
  readonly seriesId?: string;
  readonly subtitle?: string;
  /** `AfCalendarEventTypeDefinition['id']` cuando hay registro de tipos. */
  readonly type?: string;
  readonly state?: AfCalendarEventState;
  readonly resourceId?: string;
  /** Versión opaca para detectar conflictos; viaja en la intención. */
  readonly sourceVersion?: string;
  /** Campos propios del tipo. El componente no los interpreta. */
  readonly meta?: Readonly<Record<string, unknown>>;
}

export interface AfCalendarResource {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly colorToken?: AfCalendarColorToken;
  readonly icon?: AfIconName;
}

/**
 * Ventana visible tras aplicar vista, ancla y días ocultos. Es lo que dispara
 * la carga de datos en la aplicación.
 */
export interface AfCalendarVisibleRange {
  readonly view: AfCalendarView;
  readonly anchorDate: string;
  /** Primer día del rango, inclusivo. */
  readonly start: string;
  /** Último día del rango + 1, **exclusivo**. */
  readonly end: string;
  /** Días efectivamente renderizados, ya sin `hiddenDays`. */
  readonly days: readonly string[];
  /** Título humano del rango, listo para la toolbar. */
  readonly title: string;
  readonly timeZone: string;
}

/**
 * Textos del calendario. Se exponen como input para que el producto controle
 * idioma y terminología sin que la librería tome una dependencia de i18n.
 */
export interface AfCalendarLabels {
  /** Longitud 7, índice 0 = domingo. */
  readonly weekdaysLong: readonly string[];
  /** Longitud 7, índice 0 = domingo. */
  readonly weekdaysShort: readonly string[];
  /** Longitud 12, índice 0 = enero. */
  readonly months: readonly string[];
  /** Longitud 12, índice 0 = enero. Abreviaturas para rangos entre meses. */
  readonly monthsShort: readonly string[];
  readonly today: string;
  readonly previous: string;
  readonly next: string;
  readonly allDay: string;
  readonly noEvents: string;
  /** Plantilla de overflow de mes; `{count}` se reemplaza por el número. */
  readonly moreTemplate: string;
  readonly nowIndicator: string;
  readonly moveMode: string;
  /** `{title}`, `{day}` y `{start}` se reemplazan al anunciar un movimiento. */
  readonly moveAnnouncement: string;
  readonly loading: string;
  readonly offline: string;
  readonly partial: string;
  readonly retry: string;
  readonly create: string;
  readonly viewLabels: Readonly<Record<AfCalendarView, string>>;
  readonly stateLabels: Readonly<Record<AfCalendarEventState, string>>;
}

/** Franja temporal propuesta, antes de convertirse en intención. */
export interface AfCalendarTimeSelection {
  readonly date: string;
  readonly start: string;
  readonly end: string;
  readonly resourceId?: string;
}

export interface AfCalendarEventContext<TEvent extends AfCalendarEvent = AfCalendarEvent> {
  readonly $implicit: TEvent;
  readonly event: TEvent;
  /** `true` cuando el bloque es demasiado bajo para mostrar subtítulo. */
  readonly compact: boolean;
  readonly selected: boolean;
  readonly durationMinutes: number;
}

export type AfCalendarEventTemplate<TEvent extends AfCalendarEvent = AfCalendarEvent> = TemplateRef<
  AfCalendarEventContext<TEvent>
>;

export interface AfCalendarDayHeaderContext {
  readonly $implicit: string;
  readonly date: string;
  readonly isToday: boolean;
  readonly isWeekend: boolean;
  readonly eventCount: number;
}

export type AfCalendarDayHeaderTemplate = TemplateRef<AfCalendarDayHeaderContext>;
