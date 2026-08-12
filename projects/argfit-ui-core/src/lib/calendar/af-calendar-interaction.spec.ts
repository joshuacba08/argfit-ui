import { describe, expect, it } from 'vitest';

import { AF_CALENDAR_DEFAULT_LABELS } from './af-calendar-labels';
import {
  afCalendarActivateInteraction,
  afCalendarApplyDelta,
  afCalendarBeginInteraction,
  afCalendarConvertInteraction,
  afCalendarInteractionAnnouncement,
  afCalendarKeyboardDelta,
  afCalendarProposedInterval,
  type AfCalendarInteractionSource,
} from './af-calendar-interaction';

const bounds = { minMinutes: 420, maxMinutes: 1320 };

const source = (over: Partial<AfCalendarInteractionSource> = {}): AfCalendarInteractionSource => ({
  mode: 'move',
  origin: 'mouse',
  eventId: 'e1',
  date: '2026-08-12',
  startMinutes: 570,
  endMinutes: 660,
  ...over,
});

describe('afCalendarBeginInteraction', () => {
  it('starts inactive so a click is not a drag', () => {
    const state = afCalendarBeginInteraction(source());

    expect(state.active).toBe(false);
    expect(afCalendarActivateInteraction(state).active).toBe(true);
  });

  it('captures the anchor so deltas are absolute, not cumulative', () => {
    const state = afCalendarBeginInteraction(source());
    const once = afCalendarApplyDelta(state, { minutes: 30 }, bounds);
    const again = afCalendarApplyDelta(state, { minutes: 30 }, bounds);

    expect(once.startMinutes).toBe(600);
    expect(again.startMinutes).toBe(600);
  });
});

describe('move', () => {
  it('snaps to the 15 minute step', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(source()),
      { minutes: 8 },
      bounds,
    );

    expect(state.startMinutes).toBe(585);
    expect(state.endMinutes).toBe(675);
  });

  it('preserves the wall-clock duration when changing day', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(source()),
      { minutes: 0, date: '2026-08-14' },
      bounds,
    );

    expect(state.date).toBe('2026-08-14');
    expect(state.endMinutes - state.startMinutes).toBe(90);
  });

  it('keeps the whole event inside the grid instead of clipping its tail', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(source()),
      { minutes: 900 },
      bounds,
    );

    expect(state.endMinutes).toBe(bounds.maxMinutes);
    expect(state.endMinutes - state.startMinutes).toBe(90);
  });

  it('clamps against the upper bound too', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(source()),
      { minutes: -600 },
      bounds,
    );

    expect(state.startMinutes).toBe(bounds.minMinutes);
    expect(state.endMinutes - state.startMinutes).toBe(90);
  });

  it('carries the target resource when the column axis is resources', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(source({ resourceId: 'r1' })),
      { minutes: 15, resourceId: 'r3' },
      bounds,
    );

    expect(state.resourceId).toBe('r3');
    expect(state.anchorResourceId).toBe('r1');
  });
});

describe('resize', () => {
  it('moves the start edge and leaves the end alone', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(source({ mode: 'resize-start' })),
      { minutes: -30 },
      bounds,
    );

    expect(state.startMinutes).toBe(540);
    expect(state.endMinutes).toBe(660);
    expect(state.durationMinutes).toBe(120);
  });

  it('moves the end edge and leaves the start alone', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(source({ mode: 'resize-end' })),
      { minutes: 30 },
      bounds,
    );

    expect(state.startMinutes).toBe(570);
    expect(state.endMinutes).toBe(690);
  });

  it('never collapses below the 15 minute minimum', () => {
    const fromStart = afCalendarApplyDelta(
      afCalendarBeginInteraction(source({ mode: 'resize-start' })),
      { minutes: 600 },
      bounds,
    );
    const fromEnd = afCalendarApplyDelta(
      afCalendarBeginInteraction(source({ mode: 'resize-end' })),
      { minutes: -600 },
      bounds,
    );

    expect(fromStart.endMinutes - fromStart.startMinutes).toBe(15);
    expect(fromEnd.endMinutes - fromEnd.startMinutes).toBe(15);
  });
});

describe('create', () => {
  const create = source({ mode: 'create', eventId: undefined, endMinutes: 570 });

  it('grows downwards from the pressed minute', () => {
    const state = afCalendarApplyDelta(afCalendarBeginInteraction(create), { minutes: 90 }, bounds);

    expect(state.startMinutes).toBe(570);
    expect(state.endMinutes).toBe(660);
    expect(state.eventId).toBeNull();
  });

  it('grows upwards when dragged backwards', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(create),
      { minutes: -60 },
      bounds,
    );

    expect(state.startMinutes).toBe(510);
    expect(state.endMinutes).toBe(570);
  });

  it('gives a bare click the minimum duration instead of a zero-height range', () => {
    const state = afCalendarApplyDelta(afCalendarBeginInteraction(create), { minutes: 0 }, bounds);

    expect(state.endMinutes - state.startMinutes).toBe(15);
  });
});

describe('afCalendarKeyboardDelta', () => {
  it('steps 15 minutes with the arrows and an hour with shift', () => {
    expect(afCalendarKeyboardDelta('ArrowDown')).toEqual({ minutes: 15, columns: 0 });
    expect(afCalendarKeyboardDelta('ArrowUp')).toEqual({ minutes: -15, columns: 0 });
    expect(afCalendarKeyboardDelta('ArrowDown', true)).toEqual({ minutes: 60, columns: 0 });
    expect(afCalendarKeyboardDelta('ArrowUp', true)).toEqual({ minutes: -60, columns: 0 });
  });

  it('steps a column sideways', () => {
    expect(afCalendarKeyboardDelta('ArrowLeft')).toEqual({ minutes: 0, columns: -1 });
    expect(afCalendarKeyboardDelta('ArrowRight')).toEqual({ minutes: 0, columns: 1 });
  });

  it('ignores keys it does not own', () => {
    expect(afCalendarKeyboardDelta('Tab')).toBeNull();
    expect(afCalendarKeyboardDelta('a')).toBeNull();
  });
});

describe('output helpers', () => {
  it('serialises the proposal as wall-clock strings', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(source()),
      { minutes: 15 },
      bounds,
    );

    expect(afCalendarProposedInterval(state)).toEqual({
      date: '2026-08-12',
      start: '09:45',
      end: '11:15',
      resourceId: undefined,
      kind: 'timed',
      endDate: undefined,
    });
  });

  it('announces the move with title, day and time', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(source()),
      { minutes: 15 },
      bounds,
    );

    expect(
      afCalendarInteractionAnnouncement('Entrenamiento', state, AF_CALENDAR_DEFAULT_LABELS),
    ).toBe('Entrenamiento movido a Mié 12 de agosto 09:45');
  });
});

describe('all-day and configurable constraints', () => {
  it('converts between lanes without losing civil dates or the timed duration', () => {
    const timed = afCalendarActivateInteraction(afCalendarBeginInteraction(source()));
    const allDay = afCalendarConvertInteraction(timed, {
      kind: 'all-day',
      date: '2026-08-14',
    });
    const backToTimed = afCalendarConvertInteraction(allDay, {
      kind: 'timed',
      date: '2026-08-15',
      startMinutes: 600,
      durationMinutes: timed.durationMinutes,
    });

    expect(allDay.kind).toBe('all-day');
    expect(allDay.endDate).toBe('2026-08-15');
    expect(backToTimed.kind).toBe('timed');
    expect(backToTimed.date).toBe('2026-08-15');
    expect(backToTimed.startMinutes).toBe(600);
    expect(backToTimed.endMinutes).toBe(690);
  });

  it('moves a multi-day interval with an exclusive civil end', () => {
    const state = afCalendarApplyDelta(
      afCalendarBeginInteraction(
        source({ kind: 'all-day', date: '2026-08-12', endDate: '2026-08-15' }),
      ),
      { minutes: 0, date: '2026-08-14', days: 2 },
      bounds,
    );

    expect(state.date).toBe('2026-08-14');
    expect(state.endDate).toBe('2026-08-17');
  });

  it('resizes both civil edges without allowing a zero-day event', () => {
    const base = source({ kind: 'all-day', date: '2026-08-12', endDate: '2026-08-15' });
    const start = afCalendarApplyDelta(
      afCalendarBeginInteraction({ ...base, mode: 'resize-start' }),
      { minutes: 0, days: 1 },
      bounds,
    );
    const end = afCalendarApplyDelta(
      afCalendarBeginInteraction({ ...base, mode: 'resize-end' }),
      { minutes: 0, days: -20 },
      bounds,
    );

    expect(start.date).toBe('2026-08-13');
    expect(start.endDate).toBe('2026-08-15');
    expect(end.endDate).toBe('2026-08-13');
  });

  it('honours custom minimum and maximum durations', () => {
    const start = afCalendarBeginInteraction(source({ mode: 'resize-end' }));
    expect(
      afCalendarApplyDelta(start, { minutes: -500 }, bounds, { minDurationMinutes: 30 })
        .durationMinutes,
    ).toBe(30);
    expect(
      afCalendarApplyDelta(start, { minutes: 500 }, bounds, { maxDurationMinutes: 120 })
        .durationMinutes,
    ).toBe(120);
  });
});
