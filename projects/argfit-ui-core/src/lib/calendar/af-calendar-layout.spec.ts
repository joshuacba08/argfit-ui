import { describe, expect, it } from 'vitest';

import type { AfCalendarEvent } from '../types/calendar.types';

import { afCalendarLayoutDay, afCalendarMonthOverflow } from './af-calendar-layout';

const bounds = { minMinutes: 420, maxMinutes: 1320 };

const event = (id: string, start: string, end: string, over: Partial<AfCalendarEvent> = {}): AfCalendarEvent => ({
  id,
  date: '2026-08-12',
  start,
  end,
  kind: 'timed',
  title: id,
  colorToken: 'training',
  ...over,
});

describe('afCalendarLayoutDay', () => {
  it('gives a lone event the full width', () => {
    const [laid] = afCalendarLayoutDay([event('a', '09:00', '10:00')], bounds);
    expect(laid.column).toBe(0);
    expect(laid.columns).toBe(1);
    expect(laid.topMinutes).toBe(540);
    expect(laid.durationMinutes).toBe(60);
  });

  it('splits overlapping events into columns', () => {
    const laid = afCalendarLayoutDay(
      [event('a', '09:00', '11:00'), event('b', '10:00', '12:00')],
      bounds,
    );
    expect(laid.map((item) => item.column)).toEqual([0, 1]);
    expect(laid.every((item) => item.columns === 2)).toBe(true);
  });

  it('reuses a column once the previous event has ended', () => {
    const laid = afCalendarLayoutDay(
      [
        event('a', '09:00', '10:00'),
        event('b', '09:30', '11:00'),
        event('c', '10:00', '11:00'),
      ],
      bounds,
    );
    // a and c share column 0 because a ends exactly when c starts (exclusive end).
    expect(laid.find((item) => item.event.id === 'c')?.column).toBe(0);
    expect(laid.every((item) => item.columns === 2)).toBe(true);
  });

  it('starts a new cluster when there is no overlap, so width is not wasted', () => {
    const laid = afCalendarLayoutDay(
      [event('a', '09:00', '10:00'), event('b', '10:00', '11:00'), event('c', '10:15', '11:00')],
      bounds,
    );
    expect(laid.find((item) => item.event.id === 'a')?.columns).toBe(1);
    expect(laid.find((item) => item.event.id === 'b')?.columns).toBe(2);
  });

  it('is deterministic for identical intervals', () => {
    const input = [event('b', '09:00', '10:00'), event('a', '09:00', '10:00')];
    const first = afCalendarLayoutDay(input, bounds).map((item) => item.event.id);
    const second = afCalendarLayoutDay([...input].reverse(), bounds).map((item) => item.event.id);
    expect(first).toEqual(['a', 'b']);
    expect(second).toEqual(first);
  });

  it('drops all-day events and events outside the bounds', () => {
    const laid = afCalendarLayoutDay(
      [
        event('allday', '00:00', '00:00', { kind: 'all-day' }),
        event('early', '05:00', '06:00'),
        event('late', '23:00', '24:00'),
        event('inside', '09:00', '10:00'),
      ],
      bounds,
    );
    expect(laid.map((item) => item.event.id)).toEqual(['inside']);
  });

  it('clips events that cross a bound but keeps them reachable', () => {
    const [laid] = afCalendarLayoutDay([event('a', '06:00', '08:00')], bounds);
    expect(laid.topMinutes).toBe(420);
    expect(laid.durationMinutes).toBe(60);
  });
});

describe('afCalendarMonthOverflow', () => {
  it('shows everything when it fits', () => {
    const result = afCalendarMonthOverflow([event('a', '09:00', '10:00')], 3);
    expect(result.visible).toHaveLength(1);
    expect(result.overflowCount).toBe(0);
  });

  it('reserves a slot for the overflow link', () => {
    const events = ['a', 'b', 'c', 'd', 'e'].map((id, index) =>
      event(id, `0${index + 8}:00`, `0${index + 9}:00`),
    );
    const result = afCalendarMonthOverflow(events, 3);
    expect(result.visible.map((e) => e.id)).toEqual(['a', 'b']);
    expect(result.overflowCount).toBe(3);
  });

  it('orders all-day events before timed ones', () => {
    const result = afCalendarMonthOverflow(
      [event('timed', '09:00', '10:00'), event('allday', '00:00', '00:00', { kind: 'all-day' })],
      3,
    );
    expect(result.visible.map((e) => e.id)).toEqual(['allday', 'timed']);
  });
});
