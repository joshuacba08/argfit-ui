import { describe, expect, it } from 'vitest';

import type { AfCalendarEvent } from '../types/calendar.types';

import { AF_CALENDAR_DEFAULT_LABELS } from './af-calendar-labels';
import {
    afCalendarEventDuration,
    afCalendarEventsOn,
    afCalendarMonthCells,
    afCalendarNavigate,
    afCalendarVisibleRange,
    afCalendarWeekLoad,
    type AfCalendarRangeOptions,
} from './af-calendar-range';

const options: AfCalendarRangeOptions = {
  firstDay: 1,
  hiddenDays: [],
  labels: AF_CALENDAR_DEFAULT_LABELS,
  timeZone: 'America/Argentina/Buenos_Aires',
};

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

describe('afCalendarVisibleRange', () => {
  it('spans a single day', () => {
    const range = afCalendarVisibleRange('day', '2026-08-12', options);
    expect(range.days).toEqual(['2026-08-12']);
    expect(range.start).toBe('2026-08-12');
    expect(range.end).toBe('2026-08-13');
  });

  it('spans three days from the anchor, not from the week start', () => {
    const range = afCalendarVisibleRange('three-day', '2026-08-12', options);
    expect(range.days).toEqual(['2026-08-12', '2026-08-13', '2026-08-14']);
  });

  it('snaps the week to the configured first day', () => {
    const range = afCalendarVisibleRange('week', '2026-08-12', options);
    expect(range.days).toHaveLength(7);
    expect(range.days[0]).toBe('2026-08-10');
    expect(range.end).toBe('2026-08-17');
  });

  it('treats work-week as week plus implicit hidden days', () => {
    const range = afCalendarVisibleRange('work-week', '2026-08-12', options);
    expect(range.days).toEqual([
      '2026-08-10',
      '2026-08-11',
      '2026-08-12',
      '2026-08-13',
      '2026-08-14',
    ]);
    // The loading window still covers the full week — only rendering shrinks.
    expect(range.end).toBe('2026-08-17');
  });

  it('honours consumer hidden days on any view', () => {
    const range = afCalendarVisibleRange('week', '2026-08-12', { ...options, hiddenDays: [3] });
    expect(range.days).not.toContain('2026-08-12');
    expect(range.days).toHaveLength(6);
  });

  it('covers 42 cells in month view', () => {
    const range = afCalendarVisibleRange('month', '2026-08-12', options);
    expect(range.days).toHaveLength(42);
    expect(range.days[0]).toBe('2026-07-27');
  });

  it('carries the declared time zone through untouched', () => {
    expect(afCalendarVisibleRange('day', '2026-08-12', options).timeZone).toBe(
      'America/Argentina/Buenos_Aires',
    );
  });

  it('titles the range', () => {
    expect(afCalendarVisibleRange('day', '2026-08-12', options).title).toBe('Mié 12 Agosto 2026');
    expect(afCalendarVisibleRange('week', '2026-08-12', options).title).toBe('10–16 Agosto 2026');
    expect(afCalendarVisibleRange('month', '2026-08-12', options).title).toBe('Agosto 2026');
    expect(afCalendarVisibleRange('week', '2026-08-31', options).title).toBe(
      '31 Ago – 6 Sep 2026',
    );
  });
});

describe('afCalendarNavigate', () => {
  it('steps by the view span', () => {
    expect(afCalendarNavigate('day', '2026-08-12', 1, options)).toBe('2026-08-13');
    expect(afCalendarNavigate('three-day', '2026-08-12', 1, options)).toBe('2026-08-15');
    expect(afCalendarNavigate('week', '2026-08-12', -1, options)).toBe('2026-08-05');
    expect(afCalendarNavigate('work-week', '2026-08-12', 1, options)).toBe('2026-08-19');
    expect(afCalendarNavigate('month', '2026-08-12', 1, options)).toBe('2026-09-12');
  });
});

describe('afCalendarMonthCells', () => {
  it('returns six full weeks starting on the configured first day', () => {
    const cells = afCalendarMonthCells('2026-08-12', 1);
    expect(cells).toHaveLength(42);
    expect(cells[0]).toBe('2026-07-27');
    expect(cells[41]).toBe('2026-09-06');
  });
});

describe('event helpers', () => {
  it('filters by date and optionally by resource', () => {
    const events = [
      event({ id: 'a', resourceId: 'r1' }),
      event({ id: 'b', resourceId: 'r2' }),
      event({ id: 'c', date: '2026-08-13' }),
    ];
    expect(afCalendarEventsOn(events, '2026-08-12').map((e) => e.id)).toEqual(['a', 'b']);
    expect(afCalendarEventsOn(events, '2026-08-12', 'r2').map((e) => e.id)).toEqual(['b']);
  });

  it('measures duration and treats all-day as zero', () => {
    expect(afCalendarEventDuration(event())).toBe(90);
    expect(afCalendarEventDuration(event({ kind: 'all-day' }))).toBe(0);
  });

  it('sums minutes per day and normalises against the peak', () => {
    const load = afCalendarWeekLoad(
      [
        event({ id: 'a', date: '2026-08-10', start: '09:00', end: '11:00' }),
        event({ id: 'b', date: '2026-08-11', start: '09:00', end: '10:00' }),
        event({ id: 'c', date: '2026-08-11', kind: 'all-day' }),
      ],
      ['2026-08-10', '2026-08-11', '2026-08-12'],
    );
    expect(load.map((day) => day.minutes)).toEqual([120, 60, 0]);
    expect(load.map((day) => day.eventCount)).toEqual([1, 1, 0]);
    expect(load[0].intensity).toBe(1);
    expect(load[1].intensity).toBe(0.5);
  });
});
