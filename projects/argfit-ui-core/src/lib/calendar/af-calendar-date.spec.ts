import { describe, expect, it } from 'vitest';

import { AF_CALENDAR_DEFAULT_LABELS } from './af-calendar-labels';
import {
    afCalendarAddDays,
    afCalendarCivilDate,
    afCalendarParseCivilDate,
    afCalendarAddMonths,
    afCalendarDayOfWeek,
    afCalendarDiffDays,
    afCalendarIsSameMonth,
    afCalendarIsWeekend,
    afCalendarLongDate,
    afCalendarStartOfMonth,
    afCalendarStartOfWeek,
    afCalendarToday,
} from './af-calendar-date';

describe('af-calendar-date', () => {
  it('reads today from the injected clock without shifting to UTC', () => {
    // 23:30 local on the 12th is still the 12th; toISOString() would say the 13th
    // for any timezone west of UTC.
    expect(afCalendarToday(new Date(2026, 7, 12, 23, 30))).toBe('2026-08-12');
  });

  it('adds days across month and year boundaries', () => {
    expect(afCalendarAddDays('2026-08-12', 1)).toBe('2026-08-13');
    expect(afCalendarAddDays('2026-08-31', 1)).toBe('2026-09-01');
    expect(afCalendarAddDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(afCalendarAddDays('2028-02-28', 1)).toBe('2028-02-29');
  });

  it('resolves the weekday with Sunday as 0', () => {
    expect(afCalendarDayOfWeek('2026-08-12')).toBe(3);
    expect(afCalendarDayOfWeek('2026-08-16')).toBe(0);
  });

  it('starts the week on the configured day', () => {
    expect(afCalendarStartOfWeek('2026-08-12', 1)).toBe('2026-08-10');
    expect(afCalendarStartOfWeek('2026-08-12', 0)).toBe('2026-08-09');
    expect(afCalendarStartOfWeek('2026-08-10', 1)).toBe('2026-08-10');
  });

  it('starts the month', () => {
    expect(afCalendarStartOfMonth('2026-08-12')).toBe('2026-08-01');
  });

  it('clamps the day when adding months', () => {
    expect(afCalendarAddMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(afCalendarAddMonths('2026-08-12', -1)).toBe('2026-07-12');
    expect(afCalendarAddMonths('2026-12-15', 1)).toBe('2027-01-15');
  });

  it('compares months', () => {
    expect(afCalendarIsSameMonth('2026-08-01', '2026-08-31')).toBe(true);
    expect(afCalendarIsSameMonth('2026-08-31', '2026-09-01')).toBe(false);
  });

  it('counts civil days across a DST boundary', () => {
    expect(afCalendarDiffDays('2026-08-10', '2026-08-16')).toBe(6);
    expect(afCalendarDiffDays('2026-08-16', '2026-08-10')).toBe(-6);
    // Northern-hemisphere DST switch; a naive ms/86400000 would give 30.96.
    expect(afCalendarDiffDays('2026-03-01', '2026-04-01')).toBe(31);
    expect(afCalendarDiffDays('2026-10-01', '2026-11-01')).toBe(31);
  });

  it('formats a long civil date', () => {
    expect(afCalendarLongDate('2026-08-12', AF_CALENDAR_DEFAULT_LABELS)).toBe('Mié 12 de agosto');
  });

  it('serialises a Date as a civil date from its local parts', () => {
    expect(afCalendarCivilDate(new Date(2026, 7, 12, 23, 30))).toBe('2026-08-12');
    expect(afCalendarCivilDate(new Date(2026, 0, 1))).toBe('2026-01-01');
  });

  it('parses a civil date to local midnight', () => {
    const parsed = afCalendarParseCivilDate('2026-08-12');

    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(7);
    expect(parsed?.getDate()).toBe(12);
    expect(parsed?.getHours()).toBe(0);
  });

  it('rejects malformed input and dates that do not exist', () => {
    expect(afCalendarParseCivilDate(undefined)).toBeNull();
    expect(afCalendarParseCivilDate('')).toBeNull();
    expect(afCalendarParseCivilDate('12/08/2026')).toBeNull();
    expect(afCalendarParseCivilDate('2026-08-12T09:00')).toBeNull();
    // new Date() aceptaría esto y lo movería al 3 de marzo sin avisar.
    expect(afCalendarParseCivilDate('2026-02-31')).toBeNull();
    expect(afCalendarParseCivilDate('2026-13-01')).toBeNull();
  });

  it('round-trips between the two representations', () => {
    const parsed = afCalendarParseCivilDate('2026-02-29');
    expect(parsed).toBeNull();
    expect(afCalendarCivilDate(afCalendarParseCivilDate('2028-02-29') as Date)).toBe('2028-02-29');
  });

  it('flags weekends', () => {
    expect(afCalendarIsWeekend('2026-08-15')).toBe(true);
    expect(afCalendarIsWeekend('2026-08-16')).toBe(true);
    expect(afCalendarIsWeekend('2026-08-12')).toBe(false);
  });
});
