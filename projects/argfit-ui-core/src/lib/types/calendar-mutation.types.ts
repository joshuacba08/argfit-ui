/**
 * Intenciones de mutación de `AfCalendar`.
 *
 * El calendario nunca aplica un cambio por su cuenta: muestra una vista previa
 * optimista, emite una intención tipada en `pointerup` (nunca en `pointerdown`)
 * y espera que la aplicación actualice los datos o revierta.
 */

export type AfCalendarMutationKind = 'move' | 'resize' | 'create' | 'reassign';

export type AfCalendarInteractionOrigin = 'mouse' | 'keyboard' | 'touch';

export type AfCalendarRecurrenceScope = 'this' | 'this-and-following' | 'all';

/**
 * Intervalo de hora de pared con zona declarada.
 *
 * `start` y `end` son `YYYY-MM-DDTHH:mm` **sin offset**: describen la hora que
 * el usuario ve, no un instante UTC. La zona viaja aparte, como string IANA
 * opaco, para que la resuelva el consumidor con sus propias reglas.
 */
export interface AfCalendarInterval {
  readonly kind: 'timed-zoned';
  readonly start: string;
  /** Fin **exclusivo**. */
  readonly end: string;
  readonly timeZone: string;
}

export interface AfCalendarMutationRequest {
  readonly requestId: string;
  readonly kind: AfCalendarMutationKind;
  readonly eventId: string;
  readonly occurrenceId?: string;
  readonly seriesId?: string;
  /** `null` únicamente cuando `kind` es `'create'`. */
  readonly previousInterval: AfCalendarInterval | null;
  readonly proposedInterval: AfCalendarInterval;
  readonly previousResourceIds?: readonly string[];
  readonly proposedResourceIds?: readonly string[];
  readonly recurrenceScope?: AfCalendarRecurrenceScope;
  readonly sourceVersion?: string;
  readonly origin: AfCalendarInteractionOrigin;
}

/**
 * Pedido de alcance antes de mutar una ocurrencia de serie. El componente no
 * decide el alcance: lo pregunta y espera que la aplicación lo resuelva.
 */
export interface AfCalendarRecurrenceScopeRequest {
  readonly request: AfCalendarMutationRequest;
  readonly scopes: readonly AfCalendarRecurrenceScope[];
}

export type AfCalendarCancelReason =
  | 'escape'
  | 'pointer-cancel'
  | 'invalid-target'
  | 'blur'
  | 'scope-dismissed';

export interface AfCalendarInteractionCancel {
  readonly reason: AfCalendarCancelReason;
  readonly requestId?: string;
  readonly eventId?: string;
}
