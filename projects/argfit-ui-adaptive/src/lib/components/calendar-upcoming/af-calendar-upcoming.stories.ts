import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent } from 'storybook/test';

import { AfCalendarUpcomingComponent } from './af-calendar-upcoming.component';
import {
    AF_CALENDAR_WIDGET_EVENTS,
    AF_CALENDAR_WIDGET_NOW,
} from '../calendar-widget/af-calendar-widget.fixtures';

const meta: Meta<AfCalendarUpcomingComponent> = {
  title: 'Data/CalendarUpcoming',
  component: AfCalendarUpcomingComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfCalendarUpcoming',
      useWhen: [
        'listar las próximas actividades en un dashboard',
        'dar contexto de agenda sin cargar el calendario completo',
      ],
      avoidWhen: [
        'navegar o editar la agenda: para eso está AfCalendar',
        'mostrar una lista que no proviene de un calendario: usar AfDataView',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-card-bg', '--af-card-border', '--af-calendar-grid-line', '--af-event-training-accent'],
      related: ['AfCalendar', 'AfCalendarNextSession', 'AfCalendarStripAgenda'],
    },
    docs: {
      description: {
        component:
          'Lista compacta de las próximas ocurrencias. Solo lectura: no carga el motor de ' +
          'interacción del calendario. Una actividad en curso sigue listada hasta que termina.',
      },
    },
  },
  argTypes: {
    limit: { control: { type: 'number', min: 1, max: 10 } },
    loading: { control: 'boolean' },
    showLink: { control: 'boolean' },
    now: { control: 'text', description: 'Instante de referencia; sin valor usa el reloj real.' },
    eventActivate: { action: 'eventActivate' },
    linkPressed: { action: 'linkPressed' },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="max-width:400px">
      <af-calendar-upcoming
        [events]="events"
        [timeZone]="timeZone"
        [limit]="limit"
        [heading]="heading"
        [loading]="loading"
        [showLink]="showLink"
        [now]="now"
        (eventActivate)="eventActivate($event)"
        (linkPressed)="linkPressed()"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfCalendarUpcomingComponent>;

const DEFAULT_ARGS = {
  events: AF_CALENDAR_WIDGET_EVENTS,
  timeZone: 'America/Argentina/Buenos_Aires',
  limit: 5,
  heading: 'Próximas actividades',
  loading: false,
  showLink: true,
  now: AF_CALENDAR_WIDGET_NOW,
  eventActivate: fn(),
  linkPressed: fn(),
};

export const Default: Story = { args: DEFAULT_ARGS };

export const Loading: Story = { name: 'Carga', args: { ...DEFAULT_ARGS, loading: true } };

export const Empty: Story = { name: 'Vacío', args: { ...DEFAULT_ARGS, events: [] } };

export const Activation: Story = {
  name: 'Activar una actividad',
  args: DEFAULT_ARGS,
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Entrenamiento integrado/ }));

    await expect(args.eventActivate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'w2' }),
    );
  },
};
