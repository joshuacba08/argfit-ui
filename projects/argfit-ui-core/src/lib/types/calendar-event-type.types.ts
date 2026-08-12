import type { AfCalendarColorToken, AfCalendarEventKind } from './calendar.types';
import type { AfCalendarRecurrenceScope } from './calendar-mutation.types';
import type { AfIconName } from './icon.types';

/**
 * Registro de tipos de evento: el contrato que hace genérico al calendario.
 *
 * La aplicación registra tipos con su esquema de campos y el componente los
 * renderiza sin conocer el dominio. Agregar un tipo no requiere tocar la
 * librería, y un tipo sin campos es válido — da un evento simple de agenda.
 */

export type AfCalendarFieldKind =
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'switch'
  | 'chips';

export interface AfCalendarFieldOption {
  readonly value: string;
  readonly label: string;
}

export interface AfCalendarFieldDef {
  readonly key: string;
  readonly label: string;
  readonly kind: AfCalendarFieldKind;
  readonly placeholder?: string;
  readonly helperText?: string;
  readonly required?: boolean;
  /** Requerido por `select` y `chips`; ignorado por el resto. */
  readonly options?: readonly AfCalendarFieldOption[];
  readonly min?: number;
  readonly max?: number;
}

export interface AfCalendarEventTypeDefinition {
  readonly id: string;
  readonly label: string;
  readonly icon: AfIconName;
  readonly colorToken: AfCalendarColorToken;
  /** Duración propuesta al crear un evento de este tipo. */
  readonly defaultDurationMinutes: number;
  readonly fields: readonly AfCalendarFieldDef[];
}

export type AfCalendarFieldValue = string | number | boolean | readonly string[] | null;

/** Evento propuesto por el editor, antes de que la aplicación lo acepte. */
export interface AfCalendarEventDraft {
  readonly typeId: string;
  readonly title: string;
  readonly date: string;
  readonly start: string;
  /** Fin **exclusivo**. */
  readonly end: string;
  readonly kind: AfCalendarEventKind;
  readonly resourceId?: string;
  /** Valores de los campos del tipo, tipados por el consumidor. */
  readonly values: Readonly<Record<string, AfCalendarFieldValue>>;
}

export interface AfCalendarEventSaveIntent {
  readonly draft: AfCalendarEventDraft;
  /** Ausente al crear. */
  readonly eventId?: string;
  readonly occurrenceId?: string;
  readonly seriesId?: string;
  readonly recurrenceScope?: AfCalendarRecurrenceScope;
  readonly sourceVersion?: string;
}

export interface AfCalendarEventDeleteIntent {
  readonly eventId: string;
  readonly occurrenceId?: string;
  readonly seriesId?: string;
  readonly recurrenceScope?: AfCalendarRecurrenceScope;
}
