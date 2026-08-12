import type {
    AfCalendarInteractionOrigin,
    AfCalendarInterval,
    AfCalendarMutationKind,
    AfCalendarMutationRequest,
    AfCalendarRecurrenceScope,
} from '../types/calendar-mutation.types';
import type { AfCalendarEvent } from '../types/calendar.types';

/**
 * Construcción de intenciones de mutación.
 *
 * El calendario nunca aplica el cambio: arma esta solicitud en `pointerup` y se
 * la entrega a la aplicación, que decide si acepta, rechaza o encola.
 */

let sequence = 0;

/**
 * Identificador de solicitud por defecto.
 *
 * Es un contador, no un UUID ni un timestamp: así el mismo recorrido produce el
 * mismo id en dos corridas y los snapshots y el render en servidor no cambian
 * en cada ejecución. Un producto que necesite ids globales puede reemplazarlo
 * con `provideAfCalendarRequestId`.
 */
export function afCalendarDefaultRequestId(): string {
  sequence += 1;
  return `req_${String(sequence).padStart(3, '0')}`;
}

export function afCalendarInterval(
  date: string,
  start: string,
  end: string,
  timeZone: string,
): AfCalendarInterval {
  return { kind: 'timed-zoned', start: `${date}T${start}`, end: `${date}T${end}`, timeZone };
}

export interface AfCalendarProposedSlot {
  readonly date: string;
  readonly start: string;
  readonly end: string;
  readonly resourceId?: string;
}

export interface AfCalendarMutationInput {
  readonly kind: AfCalendarMutationKind;
  readonly requestId: string;
  readonly timeZone: string;
  readonly origin: AfCalendarInteractionOrigin;
  /** Ausente en `create`: todavía no hay ocurrencia. */
  readonly event?: AfCalendarEvent;
  readonly proposed: AfCalendarProposedSlot;
  readonly recurrenceScope?: AfCalendarRecurrenceScope;
}

export function afCalendarMutationRequest(
  input: AfCalendarMutationInput,
): AfCalendarMutationRequest {
  const { event, proposed } = input;

  const request: AfCalendarMutationRequest = {
    requestId: input.requestId,
    kind: input.kind,
    // En `create` el id de la solicitud hace de id provisional de cliente: le
    // da a la aplicación con qué correlacionar la respuesta.
    eventId: event?.id ?? input.requestId,
    occurrenceId: event?.occurrenceId,
    seriesId: event?.seriesId,
    previousInterval: event
      ? afCalendarInterval(event.date, event.start, event.end, input.timeZone)
      : null,
    proposedInterval: afCalendarInterval(
      proposed.date,
      proposed.start,
      proposed.end,
      input.timeZone,
    ),
    sourceVersion: event?.sourceVersion,
    origin: input.origin,
  };

  const previousResource = event?.resourceId;
  const proposedResource = proposed.resourceId ?? previousResource;
  if (previousResource !== undefined || proposedResource !== undefined) {
    return {
      ...request,
      previousResourceIds: previousResource ? [previousResource] : [],
      proposedResourceIds: proposedResource ? [proposedResource] : [],
      ...(input.recurrenceScope ? { recurrenceScope: input.recurrenceScope } : {}),
    };
  }

  return input.recurrenceScope
    ? { ...request, recurrenceScope: input.recurrenceScope }
    : request;
}

/**
 * `true` cuando la propuesta cambia de recurso y no solo de horario.
 *
 * Mover entre columnas de recursos es una intención distinta a mover en el
 * tiempo: la aplicación suele validarla contra disponibilidad, no contra agenda.
 */
export function afCalendarIsResourceChange(
  event: AfCalendarEvent | undefined,
  proposed: AfCalendarProposedSlot,
): boolean {
  if (!event?.resourceId || !proposed.resourceId) return false;
  return event.resourceId !== proposed.resourceId;
}
