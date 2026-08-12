import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent } from 'storybook/test';

import { AfCalendarStripAgendaComponent } from './af-calendar-strip-agenda.component';
import {
    AF_CALENDAR_WIDGET_EVENTS,
    AF_CALENDAR_WIDGET_NOW,
} from '../calendar-widget/af-calendar-widget.fixtures';

const meta: Meta<AfCalendarStripAgendaComponent> = {
  title: 'Data/CalendarStripAgenda',
  component: AfCalendarStripAgendaComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfCalendarStripAgenda',
      useWhen: [
        'navegar la semana y ver el día en una tarjeta angosta',
        'dar agenda en una home móvil sin la grilla temporal completa',
      ],
      avoidWhen: [
        'necesitar arrastre o resize: usar AfCalendar',
        'mostrar un mes: usar AfCalendarMiniMonth',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-card-bg', '--af-primary', '--af-surface-2', '--af-calendar-grid-line'],
      related: ['AfCalendar', 'AfCalendarMiniMonth', 'AfCalendarUpcoming'],
    },
    docs: {
      description: {
        component:
          'Strip semanal de días con la agenda del día elegido: siete objetivos de toque para ' +
          'navegar y una lista debajo, sin la grilla temporal que a 360 px no se puede leer.',
      },
    },
  },
  argTypes: {
    createButton: { control: 'boolean' },
    now: { control: 'text' },
    dateSelect: { action: 'dateSelect' },
    todayPressed: { action: 'todayPressed' },
    eventActivate: { action: 'eventActivate' },
    createPressed: { action: 'createPressed' },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="max-width:400px">
      <af-calendar-strip-agenda
        [events]="events"
        [timeZone]="timeZone"
        [selectedDate]="selectedDate"
        [heading]="heading"
        [createButton]="createButton"
        [now]="now"
        (dateSelect)="dateSelect($event)"
        (todayPressed)="todayPressed()"
        (eventActivate)="eventActivate($event)"
        (createPressed)="createPressed($event)"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfCalendarStripAgendaComponent>;

const DEFAULT_ARGS = {
  events: AF_CALENDAR_WIDGET_EVENTS,
  timeZone: 'America/Argentina/Buenos_Aires',
  selectedDate: '2026-08-12',
  heading: 'Agenda',
  createButton: false,
  now: AF_CALENDAR_WIDGET_NOW,
  dateSelect: fn(),
  todayPressed: fn(),
  eventActivate: fn(),
  createPressed: fn(),
};

export const Default: Story = { args: DEFAULT_ARGS };

export const WithCreate: Story = {
  name: 'Con acción de crear',
  args: { ...DEFAULT_ARGS, createButton: true },
};

export const EmptyDay: Story = {
  name: 'Día libre',
  args: { ...DEFAULT_ARGS, selectedDate: '2026-08-09' },
};

export const DayNavigation: Story = {
  name: 'Cambiar de día',
  args: DEFAULT_ARGS,
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Vie 14 de agosto' }));

    // El componente no cambia de día solo: emite y el consumidor decide.
    await expect(args.dateSelect).toHaveBeenCalledWith('2026-08-14');
  },
};
