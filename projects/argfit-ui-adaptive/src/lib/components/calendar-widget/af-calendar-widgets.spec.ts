import type { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfCalendarEvent } from '@argfit-ui/core';

import { AfCalendarDayTimelineComponent } from '../calendar-day-timeline/af-calendar-day-timeline.component';
import { AfCalendarMiniMonthComponent } from '../calendar-mini-month/af-calendar-mini-month.component';
import { AfCalendarNextSessionComponent } from '../calendar-next-session/af-calendar-next-session.component';
import { AfCalendarStripAgendaComponent } from '../calendar-strip-agenda/af-calendar-strip-agenda.component';
import { AfCalendarUpcomingComponent } from '../calendar-upcoming/af-calendar-upcoming.component';
import { AfCalendarWeekLoadComponent } from '../calendar-week-load/af-calendar-week-load.component';

import { AF_CALENDAR_WIDGET_EVENTS, AF_CALENDAR_WIDGET_NOW } from './af-calendar-widget.fixtures';

const TIME_ZONE = 'America/Argentina/Buenos_Aires';

async function render<T>(component: Type<T>, inputs: Record<string, unknown>) {
  // Varias pruebas comparan dos configuraciones del mismo widget en una sola
  // aserción; sin el reset, el segundo render choca con el módulo ya creado.
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({ imports: [component] }).compileComponents();

  const fixture = TestBed.createComponent(component);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, host: fixture.nativeElement as HTMLElement };
}

const BASE = { events: AF_CALENDAR_WIDGET_EVENTS, now: AF_CALENDAR_WIDGET_NOW };

describe('AfCalendarUpcomingComponent', () => {
  it('lists the next activities from the reference moment', async () => {
    const { host } = await render(AfCalendarUpcomingComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
    });

    const titles = Array.from(host.querySelectorAll('.af-calendar-upcoming__title')).map((node) =>
      node.textContent?.trim(),
    );
    // 10:00 del miércoles: el test de salto de 08:30 ya terminó.
    expect(titles[0]).toBe('Entrenamiento integrado');
    expect(titles).not.toContain('Test de salto');
  });

  it('marks activities happening today', async () => {
    const { host } = await render(AfCalendarUpcomingComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
    });

    expect(host.querySelector('.af-calendar-upcoming__day--today')?.textContent?.trim()).toBe(
      'Hoy',
    );
  });

  it('honours the limit and shows an empty state', async () => {
    const { host } = await render(AfCalendarUpcomingComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
      limit: 2,
    });
    expect(host.querySelectorAll('.af-calendar-upcoming__item')).toHaveLength(2);

    const empty = await render(AfCalendarUpcomingComponent, {
      events: [],
      timeZone: TIME_ZONE,
      now: AF_CALENDAR_WIDGET_NOW,
    });
    expect(empty.host.querySelector('.af-calendar-upcoming__empty')).not.toBeNull();
  });

  it('emits the activated event', async () => {
    const { fixture, host } = await render(AfCalendarUpcomingComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
    });
    const activated: AfCalendarEvent[] = [];
    fixture.componentInstance.eventActivate.subscribe((value) => activated.push(value));

    (host.querySelector('.af-calendar-upcoming__item') as HTMLButtonElement).click();

    expect(activated[0].id).toBe('w2');
  });
});

describe('AfCalendarNextSessionComponent', () => {
  it('shows the next activity with its schedule', async () => {
    const { host } = await render(AfCalendarNextSessionComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
    });

    expect(host.querySelector('.af-calendar-next-session__title')?.textContent).toContain(
      'Entrenamiento integrado',
    );
    expect(host.textContent).toContain('10:00 – 12:00');
  });

  it('counts down only before the activity starts', async () => {
    // 09:20: el test de salto ya terminó, así que la próxima es a las 10:00.
    const before = await render(AfCalendarNextSessionComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
      now: '2026-08-12T09:20',
    });
    expect(before.host.textContent).toContain('en 40 min');

    const during = await render(AfCalendarNextSessionComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
      now: '2026-08-12T10:30',
    });
    expect(during.host.textContent).not.toContain('en ');
  });

  it('falls back to an empty state', async () => {
    const { host } = await render(AfCalendarNextSessionComponent, {
      events: [],
      timeZone: TIME_ZONE,
      now: AF_CALENDAR_WIDGET_NOW,
    });

    expect(host.querySelector('.af-calendar-next-session__empty')).not.toBeNull();
  });
});

describe('AfCalendarMiniMonthComponent', () => {
  it('renders six weeks and marks the days with activity', async () => {
    const { host } = await render(AfCalendarMiniMonthComponent, {
      ...BASE,
      selectedDate: '2026-08-12',
    });

    expect(host.querySelectorAll('.af-calendar-mini-month__day')).toHaveLength(42);
    expect(host.querySelectorAll('.af-calendar-mini-month__mark').length).toBeGreaterThan(0);
  });

  it('highlights the visible range of the main calendar', async () => {
    const { host } = await render(AfCalendarMiniMonthComponent, {
      ...BASE,
      selectedDate: '2026-08-12',
      rangeStart: '2026-08-10',
      rangeEnd: '2026-08-17',
    });

    expect(host.querySelectorAll('.af-calendar-mini-month__day--range')).toHaveLength(7);
  });

  it('moves the month without touching the selected date', async () => {
    const { fixture, host } = await render(AfCalendarMiniMonthComponent, {
      ...BASE,
      selectedDate: '2026-08-12',
    });
    const months: string[] = [];
    const dates: string[] = [];
    fixture.componentInstance.monthChange.subscribe((value) => months.push(value));
    fixture.componentInstance.dateSelect.subscribe((value) => dates.push(value));

    const [, next] = Array.from(
      host.querySelectorAll<HTMLButtonElement>('.af-calendar-mini-month__nav'),
    );
    next.click();
    fixture.detectChanges();

    expect(months).toEqual(['2026-09-01']);
    expect(dates).toEqual([]);
    expect(host.querySelector('.af-calendar-mini-month__month')?.textContent).toContain(
      'Septiembre',
    );
  });

  it('lists the agenda of the selected day', async () => {
    const { host } = await render(AfCalendarMiniMonthComponent, {
      ...BASE,
      selectedDate: '2026-08-12',
    });

    expect(host.querySelectorAll('.af-calendar-mini-month__item')).toHaveLength(4);
  });
});

describe('AfCalendarDayTimelineComponent', () => {
  it('positions each activity as a percentage of the band', async () => {
    const { host } = await render(AfCalendarDayTimelineComponent, {
      ...BASE,
      date: '2026-08-12',
      minTime: '07:00',
      maxTime: '21:00',
    });

    const block = host.querySelector('.af-calendar-day-timeline__block') as HTMLElement;
    // 08:30 sobre una franja de 14 h que empieza a las 07:00: 90/840.
    expect(Number.parseFloat(block.style.left)).toBeCloseTo(10.714, 2);
  });

  it('shows the now marker only on the reference day', async () => {
    const today = await render(AfCalendarDayTimelineComponent, { ...BASE, date: '2026-08-12' });
    expect(today.host.querySelector('.af-calendar-day-timeline__now')).not.toBeNull();

    const other = await render(AfCalendarDayTimelineComponent, { ...BASE, date: '2026-08-14' });
    expect(other.host.querySelector('.af-calendar-day-timeline__now')).toBeNull();
  });

  it('summarises the planned load', async () => {
    const { host } = await render(AfCalendarDayTimelineComponent, {
      ...BASE,
      date: '2026-08-12',
    });

    expect(host.querySelector('.af-calendar-day-timeline__summary')?.textContent).toContain(
      '4 actividades',
    );
  });
});

describe('AfCalendarWeekLoadComponent', () => {
  it('draws one bar per day with its numeric value', async () => {
    const { host } = await render(AfCalendarWeekLoadComponent, {
      ...BASE,
      anchorDate: '2026-08-12',
    });

    const values = Array.from(host.querySelectorAll('.af-calendar-week-load__value')).map((node) =>
      node.textContent?.trim(),
    );
    expect(values).toHaveLength(7);
    // El lunes tiene una sola sesión de una hora.
    expect(values[0]).toBe('1h');
  });

  it('flags the peak day', async () => {
    const { host } = await render(AfCalendarWeekLoadComponent, {
      ...BASE,
      anchorDate: '2026-08-12',
    });

    expect(host.querySelectorAll('.af-calendar-week-load__bar--peak').length).toBeGreaterThan(0);
  });

  it('shows a dash instead of a zero for an empty day', async () => {
    const { host } = await render(AfCalendarWeekLoadComponent, {
      events: [],
      now: AF_CALENDAR_WIDGET_NOW,
      anchorDate: '2026-08-12',
    });

    const values = Array.from(host.querySelectorAll('.af-calendar-week-load__value')).map((node) =>
      node.textContent?.trim(),
    );
    expect(values.every((value) => value === '–')).toBe(true);
  });

  it('emits the selected day', async () => {
    const { fixture, host } = await render(AfCalendarWeekLoadComponent, {
      ...BASE,
      anchorDate: '2026-08-12',
    });
    const days: string[] = [];
    fixture.componentInstance.daySelect.subscribe((value) => days.push(value));

    (host.querySelector('.af-calendar-week-load__column') as HTMLButtonElement).click();

    expect(days).toEqual(['2026-08-10']);
  });
});

describe('AfCalendarStripAgendaComponent', () => {
  it('shows the week strip with the selected day pressed', async () => {
    const { host } = await render(AfCalendarStripAgendaComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
      selectedDate: '2026-08-12',
    });

    const days = host.querySelectorAll<HTMLButtonElement>('.af-calendar-strip-agenda__day');
    expect(days).toHaveLength(7);
    expect(days[2].getAttribute('aria-pressed')).toBe('true');
  });

  it('lists the agenda of the selected day, sorted', async () => {
    const { host } = await render(AfCalendarStripAgendaComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
      selectedDate: '2026-08-12',
    });

    const titles = Array.from(host.querySelectorAll('.af-calendar-strip-agenda__title')).map(
      (node) => node.textContent?.trim(),
    );
    expect(titles).toEqual([
      'Test de salto',
      'Entrenamiento integrado',
      'Reunión de rendimiento',
      'Kinesiología',
    ]);
  });

  it('emits the tapped day instead of navigating on its own', async () => {
    const { fixture, host } = await render(AfCalendarStripAgendaComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
      selectedDate: '2026-08-12',
    });
    const dates: string[] = [];
    fixture.componentInstance.dateSelect.subscribe((value) => dates.push(value));

    host.querySelectorAll<HTMLButtonElement>('.af-calendar-strip-agenda__day')[4].click();
    fixture.detectChanges();

    expect(dates).toEqual(['2026-08-14']);
    // Sigue mostrando el día que le dio el consumidor.
    expect(host.querySelectorAll('.af-calendar-strip-agenda__day')[2].getAttribute('aria-pressed'))
      .toBe('true');
  });

  it('carries the selected day in the create intent', async () => {
    const { fixture, host } = await render(AfCalendarStripAgendaComponent, {
      ...BASE,
      timeZone: TIME_ZONE,
      selectedDate: '2026-08-12',
      createButton: true,
    });
    const created: string[] = [];
    fixture.componentInstance.createPressed.subscribe((value) => created.push(value));

    (host.querySelector('.af-calendar-strip-agenda__create') as HTMLButtonElement).click();

    expect(created).toEqual(['2026-08-12']);
  });
});
