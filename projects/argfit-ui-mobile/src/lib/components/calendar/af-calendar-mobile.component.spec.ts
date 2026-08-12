import { TestBed } from '@angular/core/testing';

import type { AfCalendarEvent } from '@argfit-ui/core';

import { AfCalendarMobileComponent } from './af-calendar-mobile.component';

const TIME_ZONE = 'America/Argentina/Buenos_Aires';

const event = (over: Partial<AfCalendarEvent> = {}): AfCalendarEvent => ({
  id: 'e1',
  date: '2026-08-12',
  start: '09:00',
  end: '10:30',
  kind: 'timed',
  title: 'Entrenamiento de campo',
  subtitle: 'Cancha 1',
  colorToken: 'training',
  ...over,
});

async function render(inputs: Record<string, unknown> = {}) {
  await TestBed.configureTestingModule({
    imports: [AfCalendarMobileComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(AfCalendarMobileComponent);
  fixture.componentRef.setInput('timeZone', TIME_ZONE);
  fixture.componentRef.setInput('anchorDate', '2026-08-12');
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, host: fixture.nativeElement as HTMLElement };
}

describe('AfCalendarMobileComponent', () => {
  it('shows the week strip with the anchor day selected', async () => {
    const { host } = await render({ events: [event()] });

    const days = host.querySelectorAll<HTMLButtonElement>('.af-calendar-mobile__day');
    expect(days).toHaveLength(7);
    expect(days[2].getAttribute('aria-pressed')).toBe('true');
    expect(days[2].getAttribute('aria-label')).toBe('Mié 12 de agosto');
  });

  it('marks the days that have activity', async () => {
    const { host } = await render({ events: [event()] });

    expect(host.querySelectorAll('.af-calendar-mobile__mark--on')).toHaveLength(1);
  });

  it('emits the tapped day instead of moving on its own', async () => {
    const { fixture, host } = await render({ events: [event()] });
    const selected: string[] = [];
    fixture.componentInstance.dateSelect.subscribe((value) => selected.push(value));

    host.querySelectorAll<HTMLButtonElement>('.af-calendar-mobile__day')[4].click();

    expect(selected).toEqual(['2026-08-14']);
  });

  it('lists the agenda of the selected day', async () => {
    const { host } = await render({
      events: [event(), event({ id: 'e2', date: '2026-08-13', title: 'Otro día' })],
    });

    const rows = host.querySelectorAll('.af-calendar-mobile__row');
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain('Entrenamiento de campo');
  });

  it('collapses week into a three-day range rather than shrinking the desktop grid', async () => {
    const { host } = await render({ view: 'week', events: [event()] });

    expect(host.getAttribute('data-view')).toBe('three-day');
    expect(host.querySelectorAll('.af-calendar-mobile__col')).toHaveLength(3);
  });

  it('resolves month to agenda and leaves the month grid to AfCalendarMiniMonth', async () => {
    const { host } = await render({ view: 'month', events: [event()] });

    expect(host.getAttribute('data-view')).toBe('agenda');
  });

  it('always renders at touch density regardless of the requested one', async () => {
    const { host } = await render({ view: 'day', density: 'compact', events: [event()] });

    expect(host.getAttribute('data-density')).toBe('touch');
    const block = host.querySelector('.af-calendar-mobile__event') as HTMLElement;
    // 90 min at a 44px touch slot -> 3 slots.
    expect(block.style.height).toBe('132px');
  });

  it('keeps every control at or above the 44px touch target', async () => {
    const { host } = await render({ events: [event()] });

    const row = host.querySelector('.af-calendar-mobile__row') as HTMLElement;
    expect(getComputedStyle(row).minHeight).toBe('64px');
    const day = host.querySelector('.af-calendar-mobile__day') as HTMLElement;
    expect(getComputedStyle(day).minHeight).toBe('56px');
  });

  it('names events with time, date and state for screen readers', async () => {
    const { host } = await render({ events: [event({ state: 'pending' })] });

    expect(host.querySelector('.af-calendar-mobile__row')?.getAttribute('aria-label')).toBe(
      'Entrenamiento de campo, 09:00 – 10:30, Mié 12 de agosto, Cancha 1, Pendiente',
    );
  });

  it('emits the activated event', async () => {
    const { fixture, host } = await render({ events: [event()] });
    const activated: AfCalendarEvent[] = [];
    fixture.componentInstance.eventActivate.subscribe((value) => activated.push(value));

    (host.querySelector('.af-calendar-mobile__row') as HTMLButtonElement).click();

    expect(activated.map((item) => item.id)).toEqual(['e1']);
  });

  it('falls back to the empty state with no events', async () => {
    const { host } = await render({ events: [] });

    expect(host.getAttribute('data-state')).toBe('empty');
  });
});
