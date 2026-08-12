import { TestBed } from '@angular/core/testing';

import {
  provideAfCalendarRequestId,
  type AfCalendarEvent,
  type AfCalendarMutationRequest,
} from '@argfit-ui/core';

import { AfCalendarDesktopComponent } from './af-calendar-desktop.component';

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
    imports: [AfCalendarDesktopComponent],
    // Un id determinista hace comparable el payload completo de la intención.
    providers: [provideAfCalendarRequestId(() => 'req_test')],
  }).compileComponents();

  const fixture = TestBed.createComponent(AfCalendarDesktopComponent);
  fixture.componentRef.setInput('timeZone', TIME_ZONE);
  fixture.componentRef.setInput('anchorDate', '2026-08-12');
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, host: fixture.nativeElement as HTMLElement };
}

describe('AfCalendarDesktopComponent', () => {
  it('renders the week grid with a column per visible day', async () => {
    const { host } = await render({ events: [event()] });

    expect(host.querySelectorAll('.af-calendar-desktop__col')).toHaveLength(7);
    expect(host.querySelector('.af-calendar-desktop__title')?.textContent).toContain(
      '10–16 Agosto 2026',
    );
  });

  it('hides weekends in work-week without changing the layout engine', async () => {
    const { host } = await render({ view: 'work-week', events: [event()] });

    expect(host.querySelectorAll('.af-calendar-desktop__col')).toHaveLength(5);
  });

  it('names each event with its time, date and state for screen readers', async () => {
    const { host } = await render({ events: [event({ state: 'conflict' })] });

    const block = host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement;
    expect(block.getAttribute('aria-label')).toBe(
      'Entrenamiento de campo, 09:00 – 10:30, Mié 12 de agosto, Cancha 1, En conflicto',
    );
  });

  it('communicates block state with a shape, since the text does not fit', async () => {
    const { host } = await render({ events: [event({ state: 'pending' })] });

    expect(host.querySelector('.af-calendar-desktop__state-icon')).not.toBeNull();
    expect(host.querySelector('[data-state="pending"]')).not.toBeNull();
    // El texto completo sigue disponible para el lector de pantalla.
    expect(host.querySelector('.af-calendar-desktop__event')?.getAttribute('aria-label')).toContain(
      'Pendiente',
    );
  });

  it('spells the state out in the agenda, where there is room', async () => {
    const { host } = await render({ view: 'agenda', events: [event({ state: 'pending' })] });

    expect(host.querySelector('.af-calendar-desktop__flag')?.textContent?.trim()).toBe('Pendiente');
  });

  it('positions a block from the density token, not from measuring the DOM', async () => {
    const { host } = await render({ density: 'comfortable', minTime: '08:00', events: [event()] });

    const block = host.querySelector('.af-calendar-desktop__event') as HTMLElement;
    // 09:00 is 60 min past the 08:00 bound -> 2 slots of 32px.
    expect(block.style.top).toBe('64px');
    // 90 min -> 3 slots.
    expect(block.style.height).toBe('96px');
  });

  it('emits the activated event', async () => {
    const { fixture, host } = await render({ events: [event()] });
    const activated: AfCalendarEvent[] = [];
    fixture.componentInstance.eventActivate.subscribe((value) => activated.push(value));

    (host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement).click();

    expect(activated).toHaveLength(1);
    expect(activated[0].id).toBe('e1');
  });

  it('collapses a crowded month cell into an explicit overflow label', async () => {
    const events = ['a', 'b', 'c', 'd', 'e'].map((id, index) =>
      event({ id, start: `0${index + 8}:00`, end: `0${index + 9}:00` }),
    );
    const { host } = await render({ view: 'month', events });

    // Capacity 3 keeps 2 chips and spends the third line on the overflow label.
    expect(
      host.querySelectorAll('.af-calendar-desktop__month-cell .af-calendar-desktop__chip'),
    ).toHaveLength(2);
    expect(host.querySelector('.af-calendar-desktop__more')?.textContent?.trim()).toBe('+3 más');
  });

  it('lists agenda days that have events', async () => {
    const { host } = await render({
      view: 'agenda',
      events: [event(), event({ id: 'e2', date: '2026-08-14', start: '11:00', end: '12:00' })],
    });

    expect(host.querySelectorAll('.af-calendar-desktop__agenda-day')).toHaveLength(2);
    expect(host.querySelectorAll('.af-calendar-desktop__row')).toHaveLength(2);
  });

  it('shows the empty state when the range has no events', async () => {
    const { host } = await render({ events: [] });

    expect(host.getAttribute('data-state')).toBe('empty');
    expect(host.querySelector('.af-calendar-desktop__state')).not.toBeNull();
  });

  it('keeps the calendar navigable while showing a recoverable error', async () => {
    const { host } = await render({ events: [event()], error: 'No se pudo cargar el rango.' });

    expect(host.getAttribute('data-state')).toBe('error');
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('No se pudo cargar');
    expect(host.querySelector('.af-calendar-desktop__toolbar')).not.toBeNull();
  });

  it('stacks the offline and partial banners above the grid', async () => {
    const { host } = await render({ events: [event()], offline: true, partial: true });

    expect(host.querySelector('.af-calendar-desktop__banner--offline')).not.toBeNull();
    expect(host.querySelector('.af-calendar-desktop__banner--partial')).not.toBeNull();
    expect(host.querySelector('.af-calendar-desktop__col')).not.toBeNull();
  });

  it('does not offer handles when the calendar is read-only', async () => {
    const { host } = await render({ events: [event()] });

    expect(host.querySelector('.af-calendar-desktop__handle')).toBeNull();
    expect(host.querySelector('.af-calendar-desktop__event--movable')).toBeNull();
  });

  it('locks read-only and cancelled events even when the calendar is editable', async () => {
    const { host } = await render({
      editable: true,
      events: [
        event({ id: 'ro', state: 'readonly' }),
        event({ id: 'ok', start: '14:00', end: '15:00' }),
      ],
    });

    const movable = host.querySelectorAll('.af-calendar-desktop__event--movable');
    expect(movable).toHaveLength(1);
    expect(movable[0].getAttribute('aria-label')).toContain('14:00');
  });

  it('renders one column per resource over a single day', async () => {
    const { host } = await render({
      view: 'resources',
      resources: [
        { id: 'r1', title: 'Cancha 1', subtitle: 'Césped natural', colorToken: 'training' },
        { id: 'r2', title: 'Gimnasio', colorToken: 'gym' },
      ],
      events: [
        event({ id: 'a', resourceId: 'r1' }),
        event({ id: 'b', resourceId: 'r2', start: '11:00', end: '12:00' }),
        event({ id: 'c', resourceId: 'r1', date: '2026-08-13' }),
      ],
    });

    expect(host.querySelectorAll('.af-calendar-desktop__col')).toHaveLength(2);
    expect(host.querySelector('.af-calendar-desktop__resource-title')?.textContent).toContain(
      'Cancha 1',
    );
    // Solo los eventos del día ancla, repartidos por recurso.
    expect(host.querySelectorAll('.af-calendar-desktop__event')).toHaveLength(2);
  });

  it('drops the all-day band in the resources view', async () => {
    const { host } = await render({
      view: 'resources',
      resources: [{ id: 'r1', title: 'Cancha 1' }],
      events: [
        event({ id: 'a', resourceId: 'r1' }),
        event({ id: 'allday', resourceId: 'r1', kind: 'all-day' }),
      ],
    });

    expect(host.querySelector('.af-calendar-desktop__allday')).toBeNull();
  });

  it('falls back to a plain day when no resource is declared', async () => {
    const { host } = await render({ view: 'resources', resources: [], events: [event()] });

    expect(host.querySelectorAll('.af-calendar-desktop__col')).toHaveLength(1);
    expect(host.querySelector('.af-calendar-desktop__allday')).not.toBeNull();
  });

  it('names each resource column for screen readers', async () => {
    const { host } = await render({
      view: 'resources',
      resources: [{ id: 'r1', title: 'Cancha 1' }],
      events: [event({ resourceId: 'r1' })],
    });

    expect(host.querySelector('.af-calendar-desktop__col')?.getAttribute('aria-label')).toBe(
      'Cancha 1',
    );
  });

  it('emits navigation intents instead of moving on its own', async () => {
    const { fixture, host } = await render({ events: [event()] });
    const steps: number[] = [];
    fixture.componentInstance.navigate.subscribe((value) => steps.push(value));

    const [previous, next] = Array.from(
      host.querySelectorAll<HTMLButtonElement>('.af-calendar-desktop__nav button'),
    );
    previous.click();
    next.click();

    expect(steps).toEqual([-1, 1]);
    // The anchor is owned by the caller: the renderer did not move.
    expect(host.querySelector('.af-calendar-desktop__title')?.textContent).toContain('10–16');
  });
});

/**
 * El modo mover por teclado es la superficie donde el arrastre se puede probar
 * de verdad: `userEvent` no reproduce pointer capture de forma confiable, y la
 * semántica compartida vive en el motor de core, con sus propios tests.
 */
describe('AfCalendarDesktopComponent keyboard move', () => {
  const key = (element: Element, init: KeyboardEventInit): void => {
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ...init }));
  };

  const setup = async () => {
    const { fixture, host } = await render({ editable: true, events: [event()] });
    const requests: AfCalendarMutationRequest[] = [];
    const cancels: unknown[] = [];
    fixture.componentInstance.eventMoveRequest.subscribe((value) => requests.push(value));
    fixture.componentInstance.interactionCancel.subscribe((value) => cancels.push(value));
    const block = host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement;

    const flush = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    };

    return { fixture, host, block, requests, cancels, flush };
  };

  it('enters move mode with Enter and says so out loud', async () => {
    const { host, block, flush } = await setup();

    key(block, { key: 'Enter' });
    await flush();

    expect(host.querySelector('.af-calendar-desktop__event--keyboard')).not.toBeNull();
    expect(host.querySelector('af-live-region')?.textContent).toContain('Modo mover activo');
  });

  it('moves 15 minutes per arrow and an hour with shift', async () => {
    const { host, block, flush } = await setup();

    key(block, { key: 'Enter' });
    key(block, { key: 'ArrowDown' });
    await flush();
    expect(host.querySelector('af-live-region')?.textContent).toContain('09:15');

    key(block, { key: 'ArrowDown', shiftKey: true });
    await flush();
    expect(host.querySelector('af-live-region')?.textContent).toContain('10:15');
  });

  it('changes day with the horizontal arrows', async () => {
    const { host, block, flush } = await setup();

    key(block, { key: 'Enter' });
    key(block, { key: 'ArrowRight' });
    await flush();

    expect(host.querySelector('af-live-region')?.textContent).toContain('Jue 13 de agosto');
  });

  it('emits a keyboard-origin move request on confirm', async () => {
    const { block, requests, flush } = await setup();

    key(block, { key: 'Enter' });
    key(block, { key: 'ArrowDown' });
    key(block, { key: 'ArrowRight' });
    key(block, { key: 'Enter' });
    await flush();

    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({
      requestId: 'req_test',
      kind: 'move',
      eventId: 'e1',
      origin: 'keyboard',
      previousInterval: { start: '2026-08-12T09:00', end: '2026-08-12T10:30' },
      proposedInterval: { start: '2026-08-13T09:15', end: '2026-08-13T10:45' },
    });
  });

  it('preserves the wall-clock duration across the day change', async () => {
    const { block, requests, flush } = await setup();

    key(block, { key: 'Enter' });
    key(block, { key: 'ArrowRight' });
    key(block, { key: 'Enter' });
    await flush();

    expect(requests[0].proposedInterval.kind).toBe('timed-zoned');
    if (requests[0].proposedInterval.kind !== 'timed-zoned') {
      throw new Error('Expected timed mutation');
    }
    expect(requests[0].proposedInterval.start).toBe('2026-08-13T09:00');
    expect(requests[0].proposedInterval.end).toBe('2026-08-13T10:30');
  });

  it('reverts and reports the cancel on Escape', async () => {
    const { host, block, requests, cancels, flush } = await setup();

    key(block, { key: 'Enter' });
    key(block, { key: 'ArrowDown' });
    key(block, { key: 'Escape' });
    await flush();

    expect(requests).toHaveLength(0);
    expect(cancels).toEqual([{ reason: 'escape', eventId: 'e1' }]);
    expect(host.querySelector('.af-calendar-desktop__event--keyboard')).toBeNull();
    // El evento volvió a su horario original.
    expect(host.querySelector('.af-calendar-desktop__event')?.getAttribute('aria-label')).toContain(
      '09:00 – 10:30',
    );
  });

  it('keeps the focus on the event after committing', async () => {
    const { block, flush } = await setup();

    block.focus();
    key(block, { key: 'Enter' });
    key(block, { key: 'ArrowDown' });
    key(block, { key: 'Enter' });
    await flush();

    expect(document.activeElement).toBe(block);
  });

  it('asks for the recurrence scope instead of moving a series occurrence', async () => {
    const { fixture, host } = await render({
      editable: true,
      events: [event({ seriesId: 'serie-1', occurrenceId: 'occ-1' })],
    });
    const scopes: unknown[] = [];
    const moves: unknown[] = [];
    fixture.componentInstance.recurrenceScopeRequest.subscribe((value) => scopes.push(value));
    fixture.componentInstance.eventMoveRequest.subscribe((value) => moves.push(value));

    const block = host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement;
    key(block, { key: 'Enter' });
    key(block, { key: 'ArrowDown' });
    key(block, { key: 'Enter' });
    fixture.detectChanges();

    expect(moves).toHaveLength(0);
    expect(scopes).toEqual([
      {
        request: expect.objectContaining({ seriesId: 'serie-1', occurrenceId: 'occ-1' }),
        scopes: ['this', 'this-and-following', 'all'],
      },
    ]);
  });

  it('moves between resource columns and reports a reassign', async () => {
    const { fixture, host } = await render({
      editable: true,
      view: 'resources',
      resources: [
        { id: 'r1', title: 'Cancha 1' },
        { id: 'r2', title: 'Cancha 2' },
      ],
      events: [event({ resourceId: 'r1' })],
    });
    const reassigns: AfCalendarMutationRequest[] = [];
    const moves: unknown[] = [];
    fixture.componentInstance.resourceAssignRequest.subscribe((value) => reassigns.push(value));
    fixture.componentInstance.eventMoveRequest.subscribe((value) => moves.push(value));

    const block = host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement;
    key(block, { key: 'Enter' });
    key(block, { key: 'ArrowRight' });
    key(block, { key: 'Enter' });
    fixture.detectChanges();

    expect(moves).toHaveLength(0);
    expect(reassigns).toHaveLength(1);
    expect(reassigns[0]).toMatchObject({
      kind: 'reassign',
      previousResourceIds: ['r1'],
      proposedResourceIds: ['r2'],
      // El horario no cambió: solo el recurso.
      proposedInterval: { start: '2026-08-12T09:00', end: '2026-08-12T10:30' },
    });
  });

  it('ignores the move keys on a locked event', async () => {
    const { fixture, host } = await render({
      editable: true,
      events: [event({ state: 'readonly' })],
    });
    const requests: unknown[] = [];
    fixture.componentInstance.eventMoveRequest.subscribe((value) => requests.push(value));

    const block = host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement;
    key(block, { key: 'Enter' });
    key(block, { key: 'ArrowDown' });
    key(block, { key: 'Enter' });
    fixture.detectChanges();

    expect(requests).toHaveLength(0);
    expect(host.querySelector('.af-calendar-desktop__event--keyboard')).toBeNull();
  });

  it('rejects a product-invalid destination before emitting or showing pending state', async () => {
    const { fixture, host } = await render({
      editable: true,
      events: [event()],
      allowMutation: () => ({ allowed: false, message: 'La cancha está ocupada' }),
    });
    const moves: unknown[] = [];
    const cancels: unknown[] = [];
    fixture.componentInstance.eventMoveRequest.subscribe((value) => moves.push(value));
    fixture.componentInstance.interactionCancel.subscribe((value) => cancels.push(value));
    const block = host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement;

    key(block, { key: 'Enter' });
    key(block, { key: 'ArrowDown' });
    key(block, { key: 'Enter' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(moves).toHaveLength(0);
    expect(cancels).toEqual([
      { reason: 'invalid-target', requestId: 'req_test', eventId: 'e1' },
    ]);
    expect(host.querySelector('af-live-region')?.textContent).toContain('La cancha está ocupada');
    expect(host.querySelector('[data-state="pending"]')).toBeNull();
  });

  it('requests the non-drag dialog with F2', async () => {
    const { fixture, host } = await render({ editable: true, events: [event()] });
    const requests: AfCalendarEvent[] = [];
    fixture.componentInstance.interactionEditRequest.subscribe((value) => requests.push(value));

    key(host.querySelector('.af-calendar-desktop__event')!, { key: 'F2' });

    expect(requests).toEqual([expect.objectContaining({ id: 'e1' })]);
  });
});
