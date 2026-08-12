import { describe, expect, it } from 'vitest';

import type { AfCalendarEvent } from '../types/calendar.types';

import {
    afCalendarMinutesUntil,
    afCalendarMoment,
    afCalendarTimelineSegments,
    afCalendarUpcomingEvents,
} from './af-calendar-widgets';

const event = (
  id: string,
  date: string,
  start: string,
  end: string,
  over: Partial<AfCalendarEvent> = {},
): AfCalendarEvent => ({
  id,
  date,
  start,
  end,
  kind: 'timed',
  title: id,
  colorToken: 'training',
  ...over,
});

const NOW = afCalendarMoment('2026-08-12T10:00');

describe('afCalendarMoment', () => {
  it('parses a wall-clock reference', () => {
    expect(afCalendarMoment('2026-08-12T09:30')).toEqual({ date: '2026-08-12', minutes: 570 });
  });

  it('falls back to the device clock', () => {
    expect(afCalendarMoment(undefined, new Date(2026, 7, 12, 9, 30))).toEqual({
      date: '2026-08-12',
      minutes: 570,
    });
  });
});

describe('afCalendarUpcomingEvents', () => {
  const events = [
    event('past', '2026-08-12', '08:00', '09:00'),
    event('running', '2026-08-12', '09:30', '11:00'),
    event('later', '2026-08-12', '15:00', '16:00'),
    event('tomorrow', '2026-08-13', '07:00', '08:00'),
    event('allday', '2026-08-12', '00:00', '24:00', { kind: 'all-day' }),
    event('yesterday', '2026-08-11', '18:00', '19:00'),
  ];

  it('keeps an activity that is already running', () => {
    expect(afCalendarUpcomingEvents(events, NOW).map((item) => item.id)).toEqual([
      'running',
      'later',
      'tomorrow',
    ]);
  });

  it('drops finished activities and all-day entries', () => {
    const ids = afCalendarUpcomingEvents(events, NOW).map((item) => item.id);
    expect(ids).not.toContain('past');
    expect(ids).not.toContain('yesterday');
    expect(ids).not.toContain('allday');
  });

  it('sorts by day and then by start time', () => {
    const shuffled = [events[3], events[2], events[1]];
    expect(afCalendarUpcomingEvents(shuffled, NOW).map((item) => item.id)).toEqual([
      'running',
      'later',
      'tomorrow',
    ]);
  });

  it('honours the limit', () => {
    expect(afCalendarUpcomingEvents(events, NOW, 2)).toHaveLength(2);
  });
});

describe('afCalendarMinutesUntil', () => {
  it('counts the minutes to an activity later today', () => {
    expect(afCalendarMinutesUntil(event('a', '2026-08-12', '11:30', '12:00'), NOW)).toBe(90);
  });

  it('returns null once it has started or on another day', () => {
    expect(afCalendarMinutesUntil(event('a', '2026-08-12', '09:30', '11:00'), NOW)).toBeNull();
    expect(afCalendarMinutesUntil(event('a', '2026-08-13', '09:30', '11:00'), NOW)).toBeNull();
  });
});

describe('afCalendarTimelineSegments', () => {
  const bounds = { minMinutes: 420, maxMinutes: 1260 };

  it('positions an event as a fraction of the band', () => {
    const [segment] = afCalendarTimelineSegments(
      [event('a', '2026-08-12', '07:00', '08:24')],
      '2026-08-12',
      bounds,
    );

    expect(segment.offset).toBe(0);
    expect(segment.length).toBeCloseTo(0.1, 5);
  });

  it('clips an event that overflows the band', () => {
    const [segment] = afCalendarTimelineSegments(
      [event('a', '2026-08-12', '05:00', '08:00')],
      '2026-08-12',
      bounds,
    );

    expect(segment.offset).toBe(0);
    expect(segment.length).toBeCloseTo(60 / 840, 5);
  });

  it('drops events outside the band, other days and all-day entries', () => {
    const segments = afCalendarTimelineSegments(
      [
        event('early', '2026-08-12', '05:00', '06:00'),
        event('other', '2026-08-13', '09:00', '10:00'),
        event('allday', '2026-08-12', '00:00', '24:00', { kind: 'all-day' }),
        event('inside', '2026-08-12', '09:00', '10:00'),
      ],
      '2026-08-12',
      bounds,
    );

    expect(segments.map((segment) => segment.event.id)).toEqual(['inside']);
  });

  it('keeps a sliver of width so a short event stays visible', () => {
    const [segment] = afCalendarTimelineSegments(
      [event('a', '2026-08-12', '09:00', '09:01')],
      '2026-08-12',
      bounds,
    );

    expect(segment.length).toBeGreaterThan(0);
  });
});
