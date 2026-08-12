import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent } from 'storybook/test';

import {
    provideAfCalendarEventTypes,
    type AfCalendarEventDraft,
    type AfCalendarEventTypeDefinition,
    type AfCalendarResource,
} from '@argfit-ui/core';

import { AfCalendarEventEditorComponent } from './af-calendar-event-editor.component';

const TIME_ZONE = 'America/Argentina/Buenos_Aires';

/** Registro deportivo: el que usa ArgFit Calendar. */
const SPORT_TYPES: readonly AfCalendarEventTypeDefinition[] = [
  {
    id: 'training',
    label: 'Entrenamiento',
    icon: 'activity',
    colorToken: 'training',
    defaultDurationMinutes: 90,
    fields: [
      { key: 'location', label: 'Lugar', kind: 'text', placeholder: 'Cancha 1' },
      {
        key: 'group',
        label: 'Grupo',
        kind: 'select',
        options: [
          { value: 'full', label: 'Plantel completo' },
          { value: 'a', label: 'Grupo A' },
          { value: 'b', label: 'Grupo B' },
        ],
      },
      {
        key: 'blocks',
        label: 'Bloques',
        kind: 'chips',
        options: [
          { value: 'tecnico', label: 'Técnico' },
          { value: 'tactico', label: 'Táctico' },
          { value: 'fisico', label: 'Físico' },
        ],
      },
      { key: 'notes', label: 'Notas', kind: 'textarea', placeholder: 'Objetivo de la sesión' },
    ],
  },
  {
    id: 'gym',
    label: 'Rutina',
    icon: 'dumbbell',
    colorToken: 'gym',
    defaultDurationMinutes: 60,
    fields: [
      { key: 'routine', label: 'Rutina', kind: 'text' },
      { key: 'athletes', label: 'Atletas', kind: 'number' },
    ],
  },
  {
    id: 'match',
    label: 'Partido',
    icon: 'trophy',
    colorToken: 'match',
    defaultDurationMinutes: 120,
    fields: [
      { key: 'opponent', label: 'Rival', kind: 'text', placeholder: 'Racing' },
      {
        key: 'venue',
        label: 'Sede',
        kind: 'select',
        options: [
          { value: 'home', label: 'Local' },
          { value: 'away', label: 'Visitante' },
        ],
      },
    ],
  },
];

/** El mismo componente en un producto que no es deportivo. */
const GENERIC_TYPES: readonly AfCalendarEventTypeDefinition[] = [
  {
    id: 'appointment',
    label: 'Turno',
    icon: 'stethoscope',
    colorToken: 'medical',
    defaultDurationMinutes: 30,
    fields: [
      { key: 'client', label: 'Cliente', kind: 'text' },
      {
        key: 'service',
        label: 'Servicio',
        kind: 'select',
        options: [
          { value: 'consulta', label: 'Consulta' },
          { value: 'control', label: 'Control' },
        ],
      },
      {
        key: 'channel',
        label: 'Canal',
        kind: 'chips',
        options: [
          { value: 'presencial', label: 'Presencial' },
          { value: 'remoto', label: 'Remoto' },
        ],
      },
    ],
  },
  {
    id: 'shift',
    label: 'Turno de trabajo',
    icon: 'clock',
    colorToken: 'video',
    defaultDurationMinutes: 480,
    fields: [
      { key: 'role', label: 'Puesto', kind: 'text' },
      { key: 'overnight', label: 'Nocturno', kind: 'switch' },
    ],
  },
];

const RESOURCES: readonly AfCalendarResource[] = [
  { id: 'r1', title: 'Cancha 1', subtitle: 'Césped natural', colorToken: 'training' },
  { id: 'r3', title: 'Gimnasio', subtitle: 'Sala de fuerza', colorToken: 'gym' },
];

const EDIT_DRAFT: AfCalendarEventDraft = {
  typeId: 'training',
  title: 'Entrenamiento de campo',
  date: '2026-08-12',
  start: '09:30',
  end: '11:00',
  kind: 'timed',
  resourceId: 'r1',
  values: { location: 'Cancha 1', group: 'full', blocks: ['tecnico'] },
};

const meta: Meta<AfCalendarEventEditorComponent> = {
  title: 'Data/CalendarEventEditor',
  component: AfCalendarEventEditorComponent,
  decorators: [applicationConfig({ providers: [provideAfCalendarEventTypes(SPORT_TYPES)] })],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfCalendarEventEditor',
      useWhen: [
        'crear o editar una actividad de calendario de cualquier tipo registrado',
        'ofrecer un formulario que se recompone según el esquema del tipo elegido',
      ],
      avoidWhen: [
        'validar reglas de negocio: el editor propone y la aplicación decide',
        'editar entidades que no son ocurrencias de calendario',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-bg-elevated', '--af-input-bg', '--af-input-border', '--af-primary'],
      related: ['AfCalendar', 'AfCalendarEventDetail', 'AfDatePicker'],
    },
    docs: {
      description: {
        component:
          'Editor genérico: al elegir el tipo, el formulario se recompone con sus campos, su ' +
          'duración por defecto y su color. No valida reglas de negocio — emite el evento ' +
          'propuesto y el consumidor decide.',
      },
    },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['create', 'edit'] },
    busy: { control: 'boolean' },
    allowDelete: { control: 'boolean' },
    error: { control: 'text' },
    save: { action: 'save' },
    deleteRequest: { action: 'deleteRequest' },
    draftChange: { action: 'draftChange' },
    cancelled: { action: 'cancelled' },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="max-width:640px">
      <af-calendar-event-editor
        [draft]="draft"
        [mode]="mode"
        [eventTypes]="eventTypes"
        [resources]="resources"
        [timeZone]="timeZone"
        [recurrenceScopes]="recurrenceScopes"
        [eventId]="eventId"
        [seriesId]="seriesId"
        [busy]="busy"
        [allowDelete]="allowDelete"
        [error]="error"
        (save)="save($event)"
        (deleteRequest)="deleteRequest($event)"
        (draftChange)="draftChange($event)"
        (cancelled)="cancelled()"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfCalendarEventEditorComponent>;

const DEFAULT_ARGS = {
  draft: null,
  mode: 'create' as const,
  eventTypes: undefined,
  resources: RESOURCES,
  timeZone: TIME_ZONE,
  recurrenceScopes: [],
  eventId: undefined,
  seriesId: undefined,
  busy: false,
  allowDelete: false,
  error: undefined,
  save: fn(),
  deleteRequest: fn(),
  draftChange: fn(),
  cancelled: fn(),
};

export const Default: Story = { args: DEFAULT_ARGS };

export const Edit: Story = {
  name: 'Editar',
  args: {
    ...DEFAULT_ARGS,
    mode: 'edit',
    draft: EDIT_DRAFT,
    eventId: 'e1',
    allowDelete: true,
  },
};

export const RecurringScopes: Story = {
  name: 'Alcance de serie',
  args: {
    ...DEFAULT_ARGS,
    mode: 'edit',
    draft: EDIT_DRAFT,
    eventId: 'e1',
    seriesId: 'serie-microciclo',
    recurrenceScopes: ['this', 'this-and-following', 'all'],
  },
};

export const Busy: Story = {
  name: 'Guardando',
  args: { ...DEFAULT_ARGS, mode: 'edit', draft: EDIT_DRAFT, eventId: 'e1', busy: true },
};

export const ErrorState: Story = {
  name: 'Rechazado por la aplicación',
  args: {
    ...DEFAULT_ARGS,
    mode: 'edit',
    draft: EDIT_DRAFT,
    eventId: 'e1',
    error: 'La cancha 1 ya está ocupada en ese horario.',
  },
};

export const GenericRegistry: Story = {
  name: 'Registro no deportivo',
  args: { ...DEFAULT_ARGS, eventTypes: GENERIC_TYPES },
};

export const TypeDrivenForm: Story = {
  name: 'El tipo recompone el formulario',
  args: DEFAULT_ARGS,
  play: async ({ args, canvas }) => {
    // El registro deportivo arranca en Entrenamiento, con 90 minutos.
    await expect(canvas.getByText(/09:00 – 10:30/)).toBeTruthy();

    await userEvent.click(canvas.getByRole('radio', { name: /Partido/ }));

    // Partido trae sus propios campos y su duración por defecto de 2 h.
    await expect(canvas.getByText(/09:00 – 11:00/)).toBeTruthy();
    await expect(canvas.getByPlaceholderText('Racing')).toBeTruthy();

    await userEvent.type(canvas.getByPlaceholderText('Racing'), 'Racing');
    await userEvent.click(canvas.getByRole('button', { name: /Crear/ }));

    await expect(args.save).toHaveBeenCalledWith(
      expect.objectContaining({
        draft: expect.objectContaining({
          typeId: 'match',
          values: expect.objectContaining({ opponent: 'Racing' }),
        }),
      }),
    );
  },
};
