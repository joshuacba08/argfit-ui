import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
    AfPlatformService,
    type AfCalendarEvent,
    type AfCalendarVisibleRange,
} from '@argfit-ui/core';

import { AfCalendarComponent } from './af-calendar.component';
import { AF_CALENDAR_SLOT_DIRECTIVES } from './af-calendar-slots.directive';
import { AF_CALENDAR_TEMPLATE_DIRECTIVES } from './af-calendar-event.directive';

const TIME_ZONE = 'America/Argentina/Buenos_Aires';

const event = (over: Partial<AfCalendarEvent> = {}): AfCalendarEvent => ({
  id: 'e1',
  date: '2026-08-12',
  start: '09:00',
  end: '10:30',
  kind: 'timed',
  title: 'Entrenamiento de campo',
  colorToken: 'training',
  ...over,
});

async function render(inputs: Record<string, unknown> = {}) {
  await TestBed.configureTestingModule({
    imports: [AfCalendarComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(AfCalendarComponent);
  fixture.componentRef.setInput('timeZone', TIME_ZONE);
  fixture.componentRef.setInput('anchorDate', '2026-08-12');
  fixture.componentRef.setInput('events', [event()]);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, host: fixture.nativeElement as HTMLElement };
}

describe('AfCalendarComponent', () => {
  it('renders the desktop renderer by default', async () => {
    const { host } = await render();

    expect(host.querySelector('af-calendar-desktop')).not.toBeNull();
    expect(host.querySelector('af-calendar-mobile')).toBeNull();
  });

  it('switches to the mobile renderer with the platform preference', async () => {
    await TestBed.configureTestingModule({ imports: [AfCalendarComponent] }).compileComponents();
    TestBed.inject(AfPlatformService).setPreference('mobile');

    const fixture = TestBed.createComponent(AfCalendarComponent);
    fixture.componentRef.setInput('timeZone', TIME_ZONE);
    fixture.componentRef.setInput('events', [event()]);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('af-calendar-mobile')).not.toBeNull();
    expect(host.querySelector('af-calendar-desktop')).toBeNull();
  });

  it('announces the visible range on first render so the app knows what to load', async () => {
    await TestBed.configureTestingModule({ imports: [AfCalendarComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfCalendarComponent);
    const ranges: AfCalendarVisibleRange[] = [];
    fixture.componentRef.setInput('timeZone', TIME_ZONE);
    fixture.componentRef.setInput('anchorDate', '2026-08-12');
    fixture.componentInstance.visibleRangeChange.subscribe((range) => ranges.push(range));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(ranges).toHaveLength(1);
    expect(ranges[0].start).toBe('2026-08-10');
    expect(ranges[0].end).toBe('2026-08-17');
    expect(ranges[0].timeZone).toBe(TIME_ZONE);
  });

  it('moves the anchor and re-announces the range when navigating', async () => {
    const { fixture, host } = await render();
    const anchors: string[] = [];
    const ranges: AfCalendarVisibleRange[] = [];
    fixture.componentInstance.anchorDateChange.subscribe((value) => anchors.push(value));
    fixture.componentInstance.visibleRangeChange.subscribe((range) => ranges.push(range));

    const [, next] = Array.from(
      host.querySelectorAll<HTMLButtonElement>('.af-calendar-desktop__nav button'),
    );
    next.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(anchors).toEqual(['2026-08-19']);
    expect(ranges.at(-1)?.start).toBe('2026-08-17');
  });

  it('keeps the anchor still when the range does not change', async () => {
    const { fixture } = await render();
    const ranges: AfCalendarVisibleRange[] = [];
    fixture.componentInstance.visibleRangeChange.subscribe((range) => ranges.push(range));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(ranges).toHaveLength(0);
  });

  it('changes view and re-announces the range', async () => {
    const { fixture, host } = await render({ views: ['week', 'month'] });
    const views: string[] = [];
    fixture.componentInstance.viewChange.subscribe((value) => views.push(value));

    const buttons = Array.from(
      host.querySelectorAll<HTMLButtonElement>('.af-calendar-desktop__views button'),
    );
    buttons[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(views).toEqual(['month']);
    expect(fixture.componentInstance.currentRange().days).toHaveLength(42);
  });

  it('re-emits the activated event from the renderer', async () => {
    const { fixture, host } = await render();
    const activated: AfCalendarEvent[] = [];
    fixture.componentInstance.eventActivate.subscribe((value) => activated.push(value));

    (host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement).click();

    expect(activated.map((item) => item.id)).toEqual(['e1']);
  });

  it('does not host overlays when the app opts out', async () => {
    const { fixture, host } = await render({ overlays: false });
    const activated: AfCalendarEvent[] = [];
    fixture.componentInstance.eventActivate.subscribe((value) => activated.push(value));

    (host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(activated).toHaveLength(1);
    expect(host.querySelector('.af-calendar__scrim')).toBeNull();
  });

  it('exposes the API without leaking PrimeNG or Ionic types', async () => {
    const { fixture } = await render();

    // El contrato es de strings y tokens semánticos: nada de tipos de proveedor.
    expect(typeof fixture.componentInstance.currentRange().title).toBe('string');
    expect(fixture.componentInstance.currentRange().view).toBe('week');
  });
});

/**
 * El recorrido que el diseño llama «flujo completo»: abrir un evento, ver su
 * detalle, editarlo y guardar. Se prueba acá y no en cada renderer porque los
 * modales son de la fachada.
 */
describe('AfCalendarComponent overlays', () => {
  const TYPES = [
    {
      id: 'training' as const,
      label: 'Entrenamiento',
      icon: 'activity' as const,
      colorToken: 'training' as const,
      defaultDurationMinutes: 90,
      fields: [{ key: 'location', label: 'Lugar', kind: 'text' as const }],
    },
  ];

  const open = async (inputs: Record<string, unknown> = {}) => {
    const { fixture, host } = await render({ editable: true, eventTypes: TYPES, ...inputs });
    const flush = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    };
    const byText = (text: string) =>
      Array.from(host.querySelectorAll('button')).find((node) =>
        node.textContent?.includes(text),
      ) as HTMLButtonElement;

    (host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement).click();
    await flush();

    return { fixture, host, flush, byText };
  };

  it('opens the detail modal when an event is activated', async () => {
    const { host } = await open();

    const dialog = host.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-label')).toBe('Entrenamiento de campo');
    expect(host.querySelector('af-calendar-event-detail')).not.toBeNull();
  });

  it('closes the detail on Escape', async () => {
    const { host, flush } = await open();

    host
      .querySelector('.af-calendar__scrim')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();

    expect(host.querySelector('af-calendar-event-detail')).toBeNull();
  });

  it('swaps the detail for the editor, preloaded with the event', async () => {
    const { host, flush, byText } = await open();

    byText('Editar').click();
    await flush();

    expect(host.querySelector('af-calendar-event-detail')).toBeNull();
    const editor = host.querySelector('af-calendar-event-editor');
    expect(editor).not.toBeNull();
    expect(
      (editor?.querySelector('.af-calendar-event-editor__title-input') as HTMLInputElement).value,
    ).toBe('Entrenamiento de campo');
    expect(editor?.textContent).toContain('09:00 – 10:30');
  });

  it('emits the save intent and closes', async () => {
    const { fixture, host, flush, byText } = await open();
    const saved: unknown[] = [];
    fixture.componentInstance.eventSave.subscribe((value) => saved.push(value));

    byText('Editar').click();
    await flush();
    byText('Guardar').click();
    await flush();

    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ eventId: 'e1', draft: { typeId: 'training' } });
    expect(host.querySelector('.af-calendar__scrim')).toBeNull();
  });

  it('emits the delete intent from the detail', async () => {
    const { fixture, flush, byText } = await open();
    const deletes: unknown[] = [];
    fixture.componentInstance.eventDelete.subscribe((value) => deletes.push(value));

    byText('Eliminar').click();
    await flush();

    expect(deletes).toEqual([{ eventId: 'e1', occurrenceId: undefined, seriesId: undefined }]);
  });

  it('offers the recurrence scope when editing a series occurrence', async () => {
    const { host, flush, byText } = await render({
      editable: true,
      eventTypes: TYPES,
      events: [{ ...event(), seriesId: 's1', occurrenceId: 'o1' }],
    }).then(async (result) => {
      (result.host.querySelector('.af-calendar-desktop__event') as HTMLButtonElement).click();
      result.fixture.detectChanges();
      await result.fixture.whenStable();
      return {
        ...result,
        flush: async () => {
          result.fixture.detectChanges();
          await result.fixture.whenStable();
        },
        byText: (text: string) =>
          Array.from(result.host.querySelectorAll('button')).find((node) =>
            node.textContent?.includes(text),
          ) as HTMLButtonElement,
      };
    });

    byText('Editar').click();
    await flush();

    expect(host.textContent).toContain('Alcance del cambio');
  });

  it('opens an empty editor from the create button', async () => {
    const { fixture, host } = await render({
      editable: true,
      createButton: true,
      eventTypes: TYPES,
    });

    const create = Array.from(host.querySelectorAll('button')).find((node) =>
      node.textContent?.includes('Crear'),
    ) as HTMLButtonElement;
    create.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const editor = host.querySelector('af-calendar-event-editor');
    expect(editor).not.toBeNull();
    expect(editor?.textContent).toContain('Nueva actividad');
  });
});

@Component({
  imports: [AfCalendarComponent, ...AF_CALENDAR_SLOT_DIRECTIVES, ...AF_CALENDAR_TEMPLATE_DIRECTIVES],
  template: `
    <af-calendar
      [events]="events()"
      [timeZone]="timeZone"
      anchorDate="2026-08-12"
      [empty]="empty()"
    >
      <div afCalendarToolbar>Toolbar propia</div>
      <div afCalendarEmpty>Nada planificado</div>
      <ng-template afCalendarEvent let-event>
        <span class="custom-event">{{ event.title }} propio</span>
      </ng-template>
    </af-calendar>
  `,
})
class AfCalendarSlotHostComponent {
  readonly timeZone = TIME_ZONE;
  readonly events = signal<readonly AfCalendarEvent[]>([event()]);
  readonly empty = signal(false);
}

describe('AfCalendarComponent slots', () => {
  const renderHost = async () => {
    await TestBed.configureTestingModule({
      imports: [AfCalendarSlotHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfCalendarSlotHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    return { fixture, host: fixture.nativeElement as HTMLElement };
  };

  it('replaces the toolbar with the projected one', async () => {
    const { host } = await renderHost();

    expect(host.textContent).toContain('Toolbar propia');
    expect(host.querySelector('.af-calendar-desktop__views')).toBeNull();
  });

  it('renders the typed event template with the event in context', async () => {
    const { host } = await renderHost();

    expect(host.querySelector('.custom-event')?.textContent).toContain(
      'Entrenamiento de campo propio',
    );
  });

  it('uses the projected empty slot when the range is empty', async () => {
    const { fixture, host } = await renderHost();

    fixture.componentInstance.empty.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.textContent).toContain('Nada planificado');
  });
});
