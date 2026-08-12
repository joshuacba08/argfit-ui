import { describe, expect, it } from 'vitest';

import type { AfCalendarEvent } from '../types/calendar.types';

import {
  afCalendarInterval,
  afCalendarIsResourceChange,
  afCalendarMutationRequest,
  afCalendarValidateMutation,
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
    if (interval.kind !== 'timed-zoned') throw new Error('Expected timed interval');
    expect(interval.start).not.toContain('Z');
    expect(interval.start).not.toContain('+');
  });
});

describe('afCalendarMutationRequest', () => {
  it('uses civil exclusive dates for an all-day mutation', () => {
    const request = afCalendarMutationRequest({
      kind: 'move',
      requestId: 'req_all_day',
      timeZone: TIME_ZONE,
      origin: 'pen',
      event: event({ kind: 'all-day', endDate: '2026-08-15' }),
      proposed: {
        kind: 'all-day',
        date: '2026-08-14',
        endDate: '2026-08-17',
        start: '00:00',
        end: '24:00',
      },
    });

    expect(request.previousInterval).toEqual({
      kind: 'all-day',
      startDate: '2026-08-12',
      endDate: '2026-08-15',
    });
    expect(request.proposedInterval).toEqual({
      kind: 'all-day',
      startDate: '2026-08-14',
      endDate: '2026-08-17',
    });
    expect(request.origin).toBe('pen');
  });

  it('lets an explicit proposed kind convert between timed and all-day', () => {
    const toTimed = afCalendarMutationRequest({
      kind: 'all-day-to-timed',
      requestId: 'req_to_timed',
      timeZone: TIME_ZONE,
      origin: 'keyboard',
      event: event({ kind: 'all-day', endDate: '2026-08-13' }),
      proposed: {
        kind: 'timed',
        date: '2026-08-14',
        start: '09:00',
        end: '10:00',
      },
    });
    const toAllDay = afCalendarMutationRequest({
      kind: 'timed-to-all-day',
      requestId: 'req_to_all_day',
      timeZone: TIME_ZONE,
      origin: 'keyboard',
      event: event(),
      proposed: {
        kind: 'all-day',
        date: '2026-08-14',
        endDate: '2026-08-15',
        start: '00:00',
        end: '24:00',
      },
    });

    expect(toTimed.proposedInterval.kind).toBe('timed-zoned');
    expect(toAllDay.proposedInterval.kind).toBe('all-day');
  });

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
    expect(request.previousInterval?.kind).toBe('timed-zoned');
    expect(request.proposedInterval.kind).toBe('timed-zoned');
    expect(
      request.previousInterval?.kind === 'timed-zoned' ? request.previousInterval.start : null,
    ).toBe('2026-08-12T09:00');
    expect(
      request.proposedInterval.kind === 'timed-zoned' ? request.proposedInterval.start : null,
    ).toBe('2026-08-13T11:00');
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

describe('afCalendarValidateMutation', () => {
  const request = afCalendarMutationRequest({
    kind: 'move',
    requestId: 'req_validation',
    timeZone: TIME_ZONE,
    origin: 'mouse',
    event: event(),
    proposed: { date: '2026-08-12', start: '10:00', end: '11:30' },
  });

  it('allows by default and normalises boolean rules', () => {
    expect(afCalendarValidateMutation(request)).toEqual({ allowed: true });
    expect(afCalendarValidateMutation(request, () => false)).toEqual({ allowed: false });
  });

  it('preserves a descriptive product rejection', () => {
    expect(
      afCalendarValidateMutation(request, () => ({
        allowed: false,
        reasonCode: 'overlap',
        message: 'El deportista ya tiene otra actividad',
        severity: 'error',
      })),
    ).toEqual({
      allowed: false,
      reasonCode: 'overlap',
      message: 'El deportista ya tiene otra actividad',
      severity: 'error',
    });
  });
});
