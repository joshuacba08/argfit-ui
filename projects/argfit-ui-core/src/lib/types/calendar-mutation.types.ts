/**
 * Intenciones de mutación de `AfCalendar`.
 *
 * El calendario nunca aplica un cambio por su cuenta: muestra una vista previa
 * optimista, emite una intención tipada en `pointerup` (nunca en `pointerdown`)
 * y espera que la aplicación actualice los datos o revierta.
 */

export type AfCalendarMutationKind =
  | 'move'
  | 'resize'
  | 'create'
  | 'reassign'
  | 'timed-to-all-day'
  | 'all-day-to-timed';

export type AfCalendarInteractionOrigin = 'mouse' | 'keyboard' | 'touch' | 'pen';

export type AfCalendarRecurrenceScope = 'this' | 'this-and-following' | 'all';

/**
 * Intervalo de hora de pared con zona declarada.
 *
 * `start` y `end` son `YYYY-MM-DDTHH:mm` **sin offset**: describen la hora que
 * el usuario ve, no un instante UTC. La zona viaja aparte, como string IANA
 * opaco, para que la resuelva el consumidor con sus propias reglas.
 */
export interface AfCalendarTimedInterval {
  readonly kind: 'timed-zoned';
  readonly start: string;
  /** Fin **exclusivo**. */
  readonly end: string;
  readonly timeZone: string;
}

export interface AfCalendarAllDayInterval {
  readonly kind: 'all-day';
  readonly startDate: string;
  /** Fin civil exclusivo. */
  readonly endDate: string;
}

export type AfCalendarInterval = AfCalendarTimedInterval | AfCalendarAllDayInterval;

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

/** Resultado síncrono de las reglas del producto antes de mostrar el preview optimista. */
export interface AfCalendarMutationValidation {
  readonly allowed: boolean;
  readonly reasonCode?: string;
  readonly message?: string;
  readonly severity?: 'info' | 'warning' | 'error';
}

/**
 * Regla vendor-neutral ejecutada antes de emitir una intención.
 *
 * Debe ser síncrona y libre de efectos laterales. Las validaciones remotas se
 * resuelven después mediante `resolveMutation` en la fachada adaptativa.
 */
export type AfCalendarAllowMutation = (
  request: AfCalendarMutationRequest,
) => boolean | AfCalendarMutationValidation;

export type AfCalendarMutationDecisionStatus =
  | 'accepted'
  | 'queued'
  | 'rejected'
  | 'conflict';

/** Respuesta controlada de la aplicación para una intención ya emitida. */
export interface AfCalendarMutationDecision {
  readonly requestId: string;
  readonly status: AfCalendarMutationDecisionStatus;
  readonly message?: string;
  /** Token opaco que la aplicación entiende y puede deshacer. */
  readonly undoToken?: string;
}

/** Solicitud de deshacer emitida por una acción accesible del consumidor. */
export interface AfCalendarMutationUndoRequest {
  readonly undoToken: string;
  readonly request?: AfCalendarMutationRequest;
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
  | 'rejected'
  | 'conflict'
  | 'timeout'
  | 'context-change'
  | 'blur'
  | 'scope-dismissed';

export interface AfCalendarInteractionCancel {
  readonly reason: AfCalendarCancelReason;
  readonly requestId?: string;
  readonly eventId?: string;
}
