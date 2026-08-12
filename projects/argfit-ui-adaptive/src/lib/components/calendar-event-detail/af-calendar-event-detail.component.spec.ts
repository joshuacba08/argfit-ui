import { TestBed } from '@angular/core/testing';

import {
    provideAfCalendarEventTypes,
    type AfCalendarEvent,
    type AfCalendarEventDeleteIntent,
    type AfCalendarEventTypeDefinition,
} from '@argfit-ui/core';

import { AfCalendarEventDetailComponent } from './af-calendar-event-detail.component';

const TRAINING: AfCalendarEventTypeDefinition = {
  id: 'training',
  label: 'Entrenamiento',
  icon: 'activity',
  colorToken: 'training',
  defaultDurationMinutes: 90,
  fields: [
    { key: 'location', label: 'Lugar', kind: 'text' },
    {
      key: 'load',
      label: 'Carga prevista',
      kind: 'select',
      options: [
        { value: 'low', label: 'Baja' },
        { value: 'high', label: 'Alta' },
      ],
    },
    { key: 'blocks', label: 'Bloques', kind: 'chips' },
    { key: 'confidential', label: 'Ficha confidencial', kind: 'switch' },
    { key: 'notes', label: 'Notas', kind: 'textarea' },
  ],
};

const event = (over: Partial<AfCalendarEvent> = {}): AfCalendarEvent => ({
  id: 'e1',
  date: '2026-08-12',
  start: '09:30',
  end: '11:00',
  kind: 'timed',
  title: 'Entrenamiento de campo',
  subtitle: 'Cancha 1',
  colorToken: 'training',
  type: 'training',
  ...over,
});

async function render(inputs: Record<string, unknown> = {}) {
  await TestBed.configureTestingModule({
    imports: [AfCalendarEventDetailComponent],
    providers: [provideAfCalendarEventTypes([TRAINING])],
  }).compileComponents();

  const fixture = TestBed.createComponent(AfCalendarEventDetailComponent);
  fixture.componentRef.setInput('event', event());
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, host: fixture.nativeElement as HTMLElement };
}

describe('AfCalendarEventDetailComponent', () => {
  it('shows what is common to every event', async () => {
    const { host } = await render();

    expect(host.querySelector('.af-calendar-event-detail__title')?.textContent).toContain(
      'Entrenamiento de campo',
    );
    expect(host.textContent).toContain('Mié 12 de agosto');
    expect(host.textContent).toContain('09:30 – 11:00 · 1 h 30 min');
    expect(host.textContent).toContain('Cancha 1');
  });

  it('resolves the type from the injected registry', async () => {
    const { host } = await render();

    expect(host.querySelector('.af-calendar-event-detail__type')?.textContent?.trim()).toContain(
      'Entrenamiento',
    );
  });

  it('renders only the fields that have a value', async () => {
    const { host } = await render({
      event: event({
        meta: { location: 'Cancha 1', load: 'high', blocks: ['Técnico', 'Táctico'], notes: '' },
      }),
    });

    const labels = Array.from(host.querySelectorAll('.af-calendar-event-detail__field dt')).map(
      (node) => node.textContent?.trim(),
    );
    expect(labels).toEqual(['Lugar', 'Carga prevista', 'Bloques']);
  });

  it('resolves select values to their label and joins chips', async () => {
    const { host } = await render({
      event: event({ meta: { load: 'high', blocks: ['Técnico', 'Táctico'] } }),
    });

    const values = Array.from(host.querySelectorAll('.af-calendar-event-detail__field dd')).map(
      (node) => node.textContent?.trim(),
    );
    expect(values).toEqual(['Alta', 'Técnico · Táctico']);
  });

  it('hides a switch that is off instead of printing "No"', async () => {
    const { host } = await render({ event: event({ meta: { confidential: false } }) });

    expect(host.querySelector('.af-calendar-event-detail__fields')).toBeNull();
  });

  it('flags a series occurrence and a non-normal state', async () => {
    const { host } = await render({
      event: event({ seriesId: 'serie-microciclo', state: 'conflict' }),
    });

    expect(host.textContent).toContain('Serie recurrente');
    expect(host.textContent).toContain('En conflicto');
  });

  it('offers no actions unless the caller grants the permission', async () => {
    const { host } = await render();

    expect(host.textContent).not.toContain('Editar');
    expect(host.textContent).not.toContain('Eliminar');
  });

  it('emits an edit intent', async () => {
    const { fixture, host } = await render({ canEdit: true });
    const edits: AfCalendarEvent[] = [];
    fixture.componentInstance.editRequest.subscribe((value) => edits.push(value));

    const button = Array.from(host.querySelectorAll('button')).find((node) =>
      node.textContent?.includes('Editar'),
    ) as HTMLButtonElement;
    button.click();

    expect(edits.map((item) => item.id)).toEqual(['e1']);
  });

  it('emits a delete intent carrying the series identity', async () => {
    const { fixture, host } = await render({
      canDelete: true,
      event: event({ seriesId: 's1', occurrenceId: 'o1' }),
    });
    const deletes: AfCalendarEventDeleteIntent[] = [];
    fixture.componentInstance.deleteRequest.subscribe((value) => deletes.push(value));

    const button = Array.from(host.querySelectorAll('button')).find((node) =>
      node.textContent?.includes('Eliminar'),
    ) as HTMLButtonElement;
    button.click();

    expect(deletes).toEqual([{ eventId: 'e1', occurrenceId: 'o1', seriesId: 's1' }]);
  });

  it('lets the caller override the injected registry', async () => {
    const { host } = await render({
      eventTypes: [{ ...TRAINING, id: 'training', label: 'Sesión de campo', fields: [] }],
    });

    expect(host.querySelector('.af-calendar-event-detail__type')?.textContent).toContain(
      'Sesión de campo',
    );
  });
});
