import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent } from 'storybook/test';

import { AfCalendarWeekLoadComponent } from './af-calendar-week-load.component';
import {
    AF_CALENDAR_WIDGET_EVENTS,
    AF_CALENDAR_WIDGET_NOW,
} from '../calendar-widget/af-calendar-widget.fixtures';

const meta: Meta<AfCalendarWeekLoadComponent> = {
  title: 'Data/CalendarWeekLoad',
  component: AfCalendarWeekLoadComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfCalendarWeekLoad',
      useWhen: [
        'comparar la carga planificada de los días de una semana',
        'detectar picos de trabajo antes de sumar actividades',
      ],
      avoidWhen: [
        'graficar una serie que no son minutos por día: usar AfChart',
        'mostrar una sola métrica: usar AfMetricCard',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-card-bg', '--af-primary-hover', '--af-primary-active', '--af-accent'],
      related: ['AfCalendar', 'AfChart', 'AfCalendarDayTimeline'],
    },
    docs: {
      description: {
        component:
          'Minutos planificados por día. Los picos se destacan por color e intensidad, y el ' +
          'valor numérico acompaña cada barra: la altura relativa sola no alcanza para planificar.',
      },
    },
  },
  argTypes: {
    goalMinutes: { control: { type: 'number', step: 30 } },
    now: { control: 'text' },
    daySelect: { action: 'daySelect' },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="max-width:400px">
      <af-calendar-week-load
        [events]="events"
        [anchorDate]="anchorDate"
        [goalMinutes]="goalMinutes"
        [heading]="heading"
        [now]="now"
        (daySelect)="daySelect($event)"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfCalendarWeekLoadComponent>;

const DEFAULT_ARGS = {
  events: AF_CALENDAR_WIDGET_EVENTS,
  anchorDate: '2026-08-12',
  goalMinutes: undefined,
  heading: 'Carga semanal',
  now: AF_CALENDAR_WIDGET_NOW,
  daySelect: fn(),
};

export const Default: Story = { args: DEFAULT_ARGS };

export const WithGoal: Story = {
  name: 'Con objetivo',
  args: { ...DEFAULT_ARGS, goalMinutes: 900 },
};

export const Empty: Story = { name: 'Semana vacía', args: { ...DEFAULT_ARGS, events: [] } };

export const DaySelection: Story = {
  name: 'Elegir un día',
  args: DEFAULT_ARGS,
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Mié 12 de agosto/ }));

    await expect(args.daySelect).toHaveBeenCalledWith('2026-08-12');
  },
};
