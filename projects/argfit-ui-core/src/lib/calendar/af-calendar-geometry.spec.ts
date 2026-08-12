import { describe, expect, it } from 'vitest';

import {
    AF_CALENDAR_SLOT_HEIGHT_PX,
    afCalendarMinutesToPixels,
    afCalendarPixelsToMinutes,
    afCalendarSlotHeight,
} from './af-calendar-geometry';

describe('af-calendar-geometry', () => {
  it('mirrors the density tokens', () => {
    expect(afCalendarSlotHeight('compact')).toBe(24);
    expect(afCalendarSlotHeight('comfortable')).toBe(32);
    expect(afCalendarSlotHeight('touch')).toBe(44);
    expect(Object.keys(AF_CALENDAR_SLOT_HEIGHT_PX)).toHaveLength(3);
  });

  it('converts minutes to pixels against the 30 minute slot', () => {
    expect(afCalendarMinutesToPixels(30, 32)).toBe(32);
    expect(afCalendarMinutesToPixels(90, 32)).toBe(96);
    expect(afCalendarMinutesToPixels(15, 44)).toBe(22);
  });

  it('round-trips pixels back to minutes', () => {
    expect(afCalendarPixelsToMinutes(96, 32)).toBe(90);
    expect(afCalendarPixelsToMinutes(afCalendarMinutesToPixels(75, 24), 24)).toBe(75);
  });

  it('returns zero minutes rather than dividing by a zero slot height', () => {
    expect(afCalendarPixelsToMinutes(100, 0)).toBe(0);
  });
});
