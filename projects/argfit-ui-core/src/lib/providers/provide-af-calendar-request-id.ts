import { InjectionToken, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';

import { afCalendarDefaultRequestId } from '../calendar/af-calendar-mutation';

/**
 * Fábrica del `requestId` de cada intención de mutación.
 *
 * Se inyecta para que el id sea determinista donde importa: en tests, en
 * snapshots y en render de servidor. `Date.now()` o `crypto.randomUUID()`
 * producirían un valor distinto en cada corrida y toda comparación de payload
 * dejaría de servir.
 */
export const AF_CALENDAR_REQUEST_ID = new InjectionToken<() => string>('AF_CALENDAR_REQUEST_ID', {
  providedIn: 'root',
  factory: () => afCalendarDefaultRequestId,
});

export function provideAfCalendarRequestId(factory: () => string): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: AF_CALENDAR_REQUEST_ID, useValue: factory }]);
}
