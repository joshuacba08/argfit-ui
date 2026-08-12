import { describe, expect, it } from 'vitest';

import type { AfCalendarEvent } from '../types/calendar.types';

import {
    afCalendarInterval,
    afCalendarIsResourceChange,
    afCalendarMutationRequest,
} from './af-calendar-mutation';

const TIME_ZONE = 'America/Argentina/Buenos_Aires';

const event = (over: Partial<AfCalendarEvent> = {}): AfCalendarEvent => ({
  id: 'e1',
  date: '2026-08-12',
  start: '09:00',
  end: '10:30',
  kind: 'timed',
  title: 'Entrenamiento',
  colorToken: 'training',
  ...over,
});

describe('afCalendarInterval', () => {
  it('serialises wall-clock times without an offset', () => {
    const interval = afCalendarInterval('2026-08-12', '09:00', '10:30', TIME_ZONE);

    expect(interval).toEqual({
      kind: 'timed-zoned',
      start: '2026-08-12T09:00',
      end: '2026-08-12T10:30',
      timeZone: TIME_ZONE,
    });
    // Sin sufijo Z ni offset: no es un instante, es la hora que ve el usuario.
    expect(interval.start).not.toContain('Z');
    expect(interval.start).not.toContain('+');
  });
});

describe('afCalendarMutationRequest', () => {
  it('carries the previous and proposed intervals of a move', () => {
    const request = afCalendarMutationRequest({
      kind: 'move',
      requestId: 'req_001',
      timeZone: TIME_ZONE,
      origin: 'mouse',
      event: event(),
      proposed: { date: '2026-08-13', start: '11:00', end: '12:30' },
    });

    expect(request.kind).toBe('move');
    expect(request.eventId).toBe('e1');
    expect(request.previousInterval?.start).toBe('2026-08-12T09:00');
    expect(request.proposedInterval.start).toBe('2026-08-13T11:00');
    expect(request.origin).toBe('mouse');
  });

  it('propagates series identity and version for conflict detection', () => {
    const request = afCalendarMutationRequest({
      kind: 'move',
      requestId: 'req_002',
      timeZone: TIME_ZONE,
      origin: 'keyboard',
      event: event({ seriesId: 's1', occurrenceId: 'o1', sourceVersion: '7' }),
      proposed: { date: '2026-08-12', start: '10:00', end: '11:30' },
      recurrenceScope: 'this-and-following',
    });

    expect(request.seriesId).toBe('s1');
    expect(request.occurrenceId).toBe('o1');
    expect(request.sourceVersion).toBe('7');
    expect(request.recurrenceScope).toBe('this-and-following');
  });

  it('leaves previousInterval null on create and uses the request id as provisional id', () => {
    const request = afCalendarMutationRequest({
      kind: 'create',
      requestId: 'req_003',
      timeZone: TIME_ZONE,
      origin: 'mouse',
      proposed: { date: '2026-08-12', start: '15:00', end: '16:00' },
    });

    expect(request.previousInterval).toBeNull();
    expect(request.eventId).toBe('req_003');
  });

  it('reports both resources when the event is assigned to one', () => {
    const request = afCalendarMutationRequest({
      kind: 'reassign',
      requestId: 'req_004',
      timeZone: TIME_ZONE,
      origin: 'mouse',
      event: event({ resourceId: 'r1' }),
      proposed: { date: '2026-08-12', start: '09:00', end: '10:30', resourceId: 'r2' },
    });

    expect(request.previousResourceIds).toEqual(['r1']);
    expect(request.proposedResourceIds).toEqual(['r2']);
  });

  it('omits resource ids entirely when no resource is involved', () => {
    const request = afCalendarMutationRequest({
      kind: 'move',
      requestId: 'req_005',
      timeZone: TIME_ZONE,
      origin: 'mouse',
      event: event(),
      proposed: { date: '2026-08-12', start: '09:00', end: '10:30' },
    });

    expect(request.previousResourceIds).toBeUndefined();
    expect(request.proposedResourceIds).toBeUndefined();
  });
});

describe('afCalendarIsResourceChange', () => {
  it('only reports a change when the resource actually differs', () => {
    expect(
      afCalendarIsResourceChange(event({ resourceId: 'r1' }), {
        date: '2026-08-12',
        start: '09:00',
        end: '10:30',
        resourceId: 'r2',
      }),
    ).toBe(true);
    expect(
      afCalendarIsResourceChange(event({ resourceId: 'r1' }), {
        date: '2026-08-12',
        start: '09:00',
        end: '10:30',
        resourceId: 'r1',
      }),
    ).toBe(false);
    expect(
      afCalendarIsResourceChange(event(), { date: '2026-08-12', start: '09:00', end: '10:30' }),
    ).toBe(false);
  });
});
