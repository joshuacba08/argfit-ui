import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';

import {
    provideAfCalendarEventTypes,
    type AfCalendarEvent,
    type AfCalendarEventTypeDefinition,
} from '@argfit-ui/core';

import { AfCalendarEventDetailComponent } from './af-calendar-event-detail.component';

const SPORT_TYPES: readonly AfCalendarEventTypeDefinition[] = [
  {
    id: 'training',
    label: 'Entrenamiento',
    icon: 'activity',
    colorToken: 'training',
    defaultDurationMinutes: 90,
    fields: [
      { key: 'location', label: 'Lugar', kind: 'text' },
      {
        key: 'group',
        label: 'Grupo',
        kind: 'select',
        options: [
          { value: 'full', label: 'Plantel completo' },
          { value: 'a', label: 'Grupo A' },
        ],
      },
      {
        key: 'load',
        label: 'Carga prevista',
        kind: 'select',
        options: [
          { value: 'low', label: 'Baja' },
          { value: 'high', label: 'Alta' },
        ],
      },
      {
        key: 'blocks',
        label: 'Bloques',
        kind: 'chips',
        options: [
          { value: 'Técnico', label: 'Técnico' },
          { value: 'Táctico', label: 'Táctico' },
        ],
      },
      { key: 'notes', label: 'Notas', kind: 'textarea' },
    ],
  },
  {
    id: 'medical',
    label: 'Kinesiología',
    icon: 'stethoscope',
    colorToken: 'medical',
    defaultDurationMinutes: 30,
    fields: [
      { key: 'professional', label: 'Profesional', kind: 'text' },
      { key: 'confidential', label: 'Ficha confidencial', kind: 'switch' },
    ],
  },
];

const EVENT: AfCalendarEvent = {
  id: 'e1',
  date: '2026-08-12',
  start: '09:30',
  end: '11:00',
  kind: 'timed',
  type: 'training',
  title: 'Entrenamiento de campo',
  subtitle: 'Cancha 1 · Bloque técnico',
  colorToken: 'training',
  meta: {
    location: 'Cancha 1',
    group: 'full',
    load: 'high',
    blocks: ['Técnico', 'Táctico'],
    notes: 'Trabajo de salida limpia y presión tras pérdida.',
  },
};

const meta: Meta<AfCalendarEventDetailComponent> = {
  title: 'Data/CalendarEventDetail',
  component: AfCalendarEventDetailComponent,
  decorators: [
    applicationConfig({ providers: [provideAfCalendarEventTypes(SPORT_TYPES)] }),
  ],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfCalendarEventDetail',
      useWhen: [
        'mostrar una ocurrencia del calendario con los campos propios de su tipo',
        'hospedar el detalle en un popover, un drawer o una ruta completa',
      ],
      avoidWhen: [
        'editar el evento: para eso está AfCalendarEventEditor',
        'mostrar un registro que no proviene de un calendario',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-bg-elevated', '--af-border', '--af-event-training-accent', '--af-surface-1'],
      related: ['AfCalendar', 'AfCalendarEventEditor', 'AfDialog'],
    },
    docs: {
      description: {
        component:
          'Detalle de una ocurrencia. Muestra lo común a todo evento y, debajo, los campos ' +
          'propios de su tipo resueltos desde el registro. Es una superficie plana: el overlay ' +
          'lo pone quien la hospeda.',
      },
    },
  },
  argTypes: {
    canEdit: { control: 'boolean' },
    canDelete: { control: 'boolean' },
    canDuplicate: { control: 'boolean' },
    showClose: { control: 'boolean' },
    editRequest: { action: 'editRequest' },
    deleteRequest: { action: 'deleteRequest' },
    duplicateRequest: { action: 'duplicateRequest' },
    closed: { action: 'closed' },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="max-width:480px">
      <af-calendar-event-detail
        [event]="event"
        [canEdit]="canEdit"
        [canDelete]="canDelete"
        [canDuplicate]="canDuplicate"
        [showClose]="showClose"
        (editRequest)="editRequest($event)"
        (deleteRequest)="deleteRequest($event)"
        (duplicateRequest)="duplicateRequest($event)"
        (closed)="closed()"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfCalendarEventDetailComponent>;

const DEFAULT_ARGS = {
  event: EVENT,
  canEdit: true,
  canDelete: true,
  canDuplicate: false,
  showClose: true,
};

export const Default: Story = { args: DEFAULT_ARGS };

export const Recurring: Story = {
  name: 'Ocurrencia de serie',
  args: {
    ...DEFAULT_ARGS,
    event: { ...EVENT, seriesId: 'serie-microciclo', occurrenceId: 'serie-microciclo-14' },
  },
};

export const Conflict: Story = {
  name: 'En conflicto',
  args: { ...DEFAULT_ARGS, event: { ...EVENT, state: 'conflict' } },
};

export const Readonly: Story = {
  name: 'Solo lectura',
  args: {
    ...DEFAULT_ARGS,
    canEdit: false,
    canDelete: false,
    event: { ...EVENT, state: 'readonly' },
  },
};

export const OtherType: Story = {
  name: 'Otro tipo del registro',
  args: {
    ...DEFAULT_ARGS,
    event: {
      ...EVENT,
      id: 'e2',
      type: 'medical',
      colorToken: 'medical',
      title: 'Kinesiología',
      subtitle: 'Consultorio',
      start: '16:00',
      end: '16:30',
      meta: { professional: 'L. Fernández', confidential: true },
    },
  },
};
