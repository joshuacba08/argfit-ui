import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfCalendarDayTimelineComponent } from './af-calendar-day-timeline.component';
import {
    AF_CALENDAR_WIDGET_EVENTS,
    AF_CALENDAR_WIDGET_NOW,
} from '../calendar-widget/af-calendar-widget.fixtures';

const meta: Meta<AfCalendarDayTimelineComponent> = {
  title: 'Data/CalendarDayTimeline',
  component: AfCalendarDayTimelineComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfCalendarDayTimeline',
      useWhen: [
        'dar contexto del día como barra sobre un dashboard',
        'mostrar dónde se acumula la carga sin ocupar una grilla completa',
      ],
      avoidWhen: [
        'trabajar sobre la agenda o mover actividades: usar AfCalendar',
        'mostrar hitos sin duración: usar AfTimeline',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-card-bg', '--af-surface-2', '--af-calendar-now', '--af-calendar-grid-line'],
      related: ['AfCalendar', 'AfTimeline', 'AfCalendarWeekLoad'],
    },
    docs: {
      description: {
        component:
          'Franja horizontal con las actividades del día y la posición de la hora actual. ' +
          'Útil como barra de contexto sobre un dashboard.',
      },
    },
  },
  argTypes: {
    minTime: { control: 'text' },
    maxTime: { control: 'text' },
    nowIndicator: { control: 'boolean' },
    now: { control: 'text' },
    eventActivate: { action: 'eventActivate' },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="max-width:620px">
      <af-calendar-day-timeline
        [events]="events"
        [date]="date"
        [minTime]="minTime"
        [maxTime]="maxTime"
        [nowIndicator]="nowIndicator"
        [now]="now"
        (eventActivate)="eventActivate($event)"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfCalendarDayTimelineComponent>;

const DEFAULT_ARGS = {
  events: AF_CALENDAR_WIDGET_EVENTS,
  date: '2026-08-12',
  minTime: '07:00',
  maxTime: '21:00',
  nowIndicator: true,
  now: AF_CALENDAR_WIDGET_NOW,
  eventActivate: fn(),
};

export const Default: Story = { args: DEFAULT_ARGS };

export const WithoutNow: Story = {
  name: 'Otro día',
  args: { ...DEFAULT_ARGS, date: '2026-08-14' },
};

export const Empty: Story = { name: 'Día libre', args: { ...DEFAULT_ARGS, date: '2026-08-09' } };
