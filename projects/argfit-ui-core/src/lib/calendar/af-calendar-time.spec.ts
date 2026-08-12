import { describe, expect, it } from 'vitest';

import {
    afCalendarClamp,
    afCalendarDurationLabel,
    afCalendarNowMinutes,
    afCalendarSnap,
    afCalendarToHhMm,
    afCalendarToMinutes,
} from './af-calendar-time';

describe('af-calendar-time', () => {
  it('converts HH:mm to minutes and back', () => {
    expect(afCalendarToMinutes('09:30')).toBe(570);
    expect(afCalendarToMinutes('00:00')).toBe(0);
    expect(afCalendarToHhMm(570)).toBe('09:30');
    expect(afCalendarToHhMm(0)).toBe('00:00');
  });

  it('preserves 24:00 as the exclusive end of a full day', () => {
    expect(afCalendarToMinutes('24:00')).toBe(1440);
    expect(afCalendarToHhMm(1440)).toBe('24:00');
  });

  it('wraps past midnight instead of rendering 25:00', () => {
    expect(afCalendarToHhMm(1500)).toBe('01:00');
    expect(afCalendarToHhMm(-60)).toBe('23:00');
  });

  it('labels durations in hours and minutes', () => {
    expect(afCalendarDurationLabel(45)).toBe('45 min');
    expect(afCalendarDurationLabel(60)).toBe('1 h');
    expect(afCalendarDurationLabel(90)).toBe('1 h 30 min');
    expect(afCalendarDurationLabel(0)).toBe('0 min');
  });

  it('snaps to the 15 minute step by default', () => {
    expect(afCalendarSnap(7)).toBe(0);
    expect(afCalendarSnap(8)).toBe(15);
    expect(afCalendarSnap(53)).toBe(60);
    expect(afCalendarSnap(53, 30)).toBe(60);
  });

  it('clamps into bounds', () => {
    expect(afCalendarClamp(5, 10, 20)).toBe(10);
    expect(afCalendarClamp(25, 10, 20)).toBe(20);
    expect(afCalendarClamp(15, 10, 20)).toBe(15);
  });

  it('reads the current minute from the injected clock', () => {
    expect(afCalendarNowMinutes(new Date(2026, 7, 12, 14, 25))).toBe(865);
  });
});
