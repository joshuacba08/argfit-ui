import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfCalendarNextSessionComponent } from './af-calendar-next-session.component';
import {
    AF_CALENDAR_WIDGET_EVENTS,
    AF_CALENDAR_WIDGET_NOW,
} from '../calendar-widget/af-calendar-widget.fixtures';

const meta: Meta<AfCalendarNextSessionComponent> = {
  title: 'Data/CalendarNextSession',
  component: AfCalendarNextSessionComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfCalendarNextSession',
      useWhen: [
        'destacar la próxima actividad en la home de una app',
        'dar una acción primaria sobre lo que viene',
      ],
      avoidWhen: [
        'listar varias actividades: usar AfCalendarUpcoming',
        'mostrar una métrica sin componente temporal: usar AfMetricCard',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-border-strong', '--af-primary', '--af-event-match-accent', '--af-event-match-bg'],
      related: ['AfCalendar', 'AfCalendarUpcoming', 'AfMetricCard'],
    },
    docs: {
      description: {
        component:
          'Card destacada con lo que sigue: qué actividad, cuándo y en cuánto tiempo. Una ' +
          'actividad ya empezada sigue siendo la próxima hasta que termina.',
      },
    },
  },
  argTypes: {
    loading: { control: 'boolean' },
    now: { control: 'text' },
    eventActivate: { action: 'eventActivate' },
    secondaryActionPressed: { action: 'secondaryActionPressed' },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="max-width:380px">
      <af-calendar-next-session
        [events]="events"
        [timeZone]="timeZone"
        [heading]="heading"
        [actionLabel]="actionLabel"
        [secondaryActionLabel]="secondaryActionLabel"
        [loading]="loading"
        [now]="now"
        (eventActivate)="eventActivate($event)"
        (secondaryActionPressed)="secondaryActionPressed($event)"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfCalendarNextSessionComponent>;

const DEFAULT_ARGS = {
  events: AF_CALENDAR_WIDGET_EVENTS,
  timeZone: 'America/Argentina/Buenos_Aires',
  heading: 'Próxima sesión',
  actionLabel: 'Ver detalle',
  secondaryActionLabel: 'Recordarme',
  loading: false,
  now: AF_CALENDAR_WIDGET_NOW,
  eventActivate: fn(),
  secondaryActionPressed: fn(),
};

export const Default: Story = { args: DEFAULT_ARGS };

/** Antes de que empiece: aparece la cuenta regresiva. */
export const Countdown: Story = {
  name: 'Cuenta regresiva',
  args: { ...DEFAULT_ARGS, now: '2026-08-12T09:15' },
};

export const Loading: Story = { name: 'Carga', args: { ...DEFAULT_ARGS, loading: true } };

export const Empty: Story = { name: 'Vacío', args: { ...DEFAULT_ARGS, events: [] } };
