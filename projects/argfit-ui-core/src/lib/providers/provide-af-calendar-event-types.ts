import { InjectionToken, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';

import type { AfCalendarEventTypeDefinition } from '../types/calendar-event-type.types';

/**
 * Registro de tipos de evento de la aplicación.
 *
 * Es el contrato que hace genérico al calendario: la aplicación declara sus
 * tipos con el esquema de campos de cada uno, y el editor y el detalle los
 * renderizan sin conocer el dominio. Agregar un tipo no toca la librería.
 *
 * Se resuelve por inyección para que el registro se declare una vez por
 * aplicación en lugar de repetirse en cada uso del calendario; el input
 * `eventTypes` de cada componente lo pisa cuando una pantalla necesita un
 * subconjunto distinto.
 */
export const AF_CALENDAR_EVENT_TYPES = new InjectionToken<
  readonly AfCalendarEventTypeDefinition[]
>('AF_CALENDAR_EVENT_TYPES', {
  providedIn: 'root',
  factory: () => [],
});

export function provideAfCalendarEventTypes(
  definitions: readonly AfCalendarEventTypeDefinition[],
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: AF_CALENDAR_EVENT_TYPES, useValue: definitions },
  ]);
}
