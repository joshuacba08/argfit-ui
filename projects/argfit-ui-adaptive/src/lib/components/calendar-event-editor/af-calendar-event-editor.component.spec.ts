import { TestBed } from '@angular/core/testing';

import {
    provideAfCalendarEventTypes,
    type AfCalendarEventSaveIntent,
    type AfCalendarEventTypeDefinition,
} from '@argfit-ui/core';

import { AfCalendarEventEditorComponent } from './af-calendar-event-editor.component';

const TIME_ZONE = 'America/Argentina/Buenos_Aires';

const TRAINING: AfCalendarEventTypeDefinition = {
  id: 'training',
  label: 'Entrenamiento',
  icon: 'activity',
  colorToken: 'training',
  defaultDurationMinutes: 90,
  fields: [
    { key: 'location', label: 'Lugar', kind: 'text', placeholder: 'Cancha 1' },
    { key: 'confidential', label: 'Ficha confidencial', kind: 'switch' },
    {
      key: 'blocks',
      label: 'Bloques',
      kind: 'chips',
      options: [
        { value: 'tecnico', label: 'Técnico' },
        { value: 'tactico', label: 'Táctico' },
      ],
    },
  ],
};

const APPOINTMENT: AfCalendarEventTypeDefinition = {
  id: 'appointment',
  label: 'Turno',
  icon: 'stethoscope',
  colorToken: 'medical',
  defaultDurationMinutes: 30,
  fields: [{ key: 'client', label: 'Cliente', kind: 'text' }],
};

async function render(inputs: Record<string, unknown> = {}) {
  await TestBed.configureTestingModule({
    imports: [AfCalendarEventEditorComponent],
    providers: [provideAfCalendarEventTypes([TRAINING, APPOINTMENT])],
  }).compileComponents();

  const fixture = TestBed.createComponent(AfCalendarEventEditorComponent);
  fixture.componentRef.setInput('timeZone', TIME_ZONE);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  await fixture.whenStable();

  const host = fixture.nativeElement as HTMLElement;
  const flush = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const byText = (text: string) =>
    Array.from(host.querySelectorAll('button')).find((node) =>
      node.textContent?.includes(text),
    ) as HTMLButtonElement;

  return { fixture, host, flush, byText };
}

describe('AfCalendarEventEditorComponent', () => {
  it('starts on the first registered type with its default duration', async () => {
    const { host } = await render();

    expect(host.getAttribute('data-color')).toBe('training');
    expect(host.textContent).toContain('09:00 – 10:30');
  });

  it('recomposes the form when the type changes', async () => {
    const { host, flush, byText } = await render();

    expect(host.textContent).toContain('Ficha confidencial');

    byText('Turno').click();
    await flush();

    expect(host.getAttribute('data-color')).toBe('medical');
    expect(host.textContent).toContain('Cliente');
    expect(host.textContent).not.toContain('Ficha confidencial');
  });

  it('adopts the new type default duration when creating', async () => {
    const { host, flush, byText } = await render();

    byText('Turno').click();
    await flush();

    // 30 minutos, la duración por defecto del turno.
    expect(host.textContent).toContain('09:00 – 09:30');
  });

  it('keeps the existing duration when editing', async () => {
    const { host, flush, byText } = await render({
      mode: 'edit',
      draft: {
        typeId: 'training',
        title: 'Entrenamiento',
        date: '2026-08-12',
        start: '09:00',
        end: '11:00',
        kind: 'timed',
        values: {},
      },
    });

    byText('Turno').click();
    await flush();

    expect(host.textContent).toContain('09:00 – 11:00');
  });

  it('renders a control per field kind declared by the type', async () => {
    const { host } = await render();

    expect(host.querySelector('input[placeholder="Cancha 1"]')).not.toBeNull();
    expect(host.querySelectorAll('[role="switch"]')).toHaveLength(2);
    expect(host.querySelectorAll('.af-calendar-event-editor__chip')).toHaveLength(2);
  });

  it('emits the proposed draft on save without validating business rules', async () => {
    const { fixture, host, flush, byText } = await render();
    const saved: AfCalendarEventSaveIntent[] = [];
    fixture.componentInstance.save.subscribe((value) => saved.push(value));

    const title = host.querySelector('.af-calendar-event-editor__title-input') as HTMLInputElement;
    title.value = 'Trabajo táctico';
    title.dispatchEvent(new Event('input'));

    const location = host.querySelector('input[placeholder="Cancha 1"]') as HTMLInputElement;
    location.value = 'Cancha 2';
    location.dispatchEvent(new Event('input'));

    byText('Técnico').click();
    await flush();

    byText('Crear').click();

    expect(saved).toHaveLength(1);
    expect(saved[0].draft).toMatchObject({
      typeId: 'training',
      title: 'Trabajo táctico',
      kind: 'timed',
      values: { location: 'Cancha 2', blocks: ['tecnico'] },
    });
    expect(saved[0].eventId).toBeUndefined();
  });

  it('falls back to the type label when the title is left blank', async () => {
    const { fixture, byText } = await render();
    const saved: AfCalendarEventSaveIntent[] = [];
    fixture.componentInstance.save.subscribe((value) => saved.push(value));

    byText('Crear').click();

    expect(saved[0].draft.title).toBe('Entrenamiento');
  });

  it('spans the whole day when the all-day switch is on', async () => {
    const { fixture, host, flush, byText } = await render();
    const saved: AfCalendarEventSaveIntent[] = [];
    fixture.componentInstance.save.subscribe((value) => saved.push(value));

    (host.querySelectorAll('[role="switch"]')[0] as HTMLButtonElement).click();
    await flush();
    byText('Crear').click();

    expect(saved[0].draft).toMatchObject({ kind: 'all-day', start: '00:00', end: '24:00' });
  });

  it('carries the identity and scope of a series occurrence', async () => {
    const { fixture, byText } = await render({
      mode: 'edit',
      eventId: 'e1',
      occurrenceId: 'o1',
      seriesId: 's1',
      sourceVersion: '4',
      recurrenceScopes: ['this', 'this-and-following', 'all'],
    });
    const saved: AfCalendarEventSaveIntent[] = [];
    fixture.componentInstance.save.subscribe((value) => saved.push(value));

    byText('Guardar').click();

    expect(saved[0]).toMatchObject({
      eventId: 'e1',
      occurrenceId: 'o1',
      seriesId: 's1',
      sourceVersion: '4',
      recurrenceScope: 'this',
    });
  });

  it('does not offer a scope when the event is not part of a series', async () => {
    const { fixture, byText } = await render({ mode: 'edit', eventId: 'e1' });
    const saved: AfCalendarEventSaveIntent[] = [];
    fixture.componentInstance.save.subscribe((value) => saved.push(value));

    byText('Guardar').click();

    expect(saved[0].recurrenceScope).toBeUndefined();
  });

  it('refuses to submit while busy', async () => {
    const { fixture, byText } = await render({ busy: true });
    const saved: unknown[] = [];
    fixture.componentInstance.save.subscribe((value) => saved.push(value));

    byText('Crear').click();

    expect(saved).toHaveLength(0);
  });

  it('surfaces an error from the application', async () => {
    const { host } = await render({ error: 'El recurso no está disponible.' });

    expect(host.querySelector('[role="alert"]')?.textContent).toContain(
      'El recurso no está disponible.',
    );
  });

  it('emits a cancel instead of closing itself', async () => {
    const { fixture, byText } = await render();
    let cancelled = 0;
    fixture.componentInstance.cancelled.subscribe(() => (cancelled += 1));

    byText('Cancelar').click();

    expect(cancelled).toBe(1);
  });
});
