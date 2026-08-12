import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent } from 'storybook/test';

import { AfCalendarMiniMonthComponent } from './af-calendar-mini-month.component';
import {
    AF_CALENDAR_WIDGET_EVENTS,
    AF_CALENDAR_WIDGET_NOW,
} from '../calendar-widget/af-calendar-widget.fixtures';

const meta: Meta<AfCalendarMiniMonthComponent> = {
  title: 'Data/CalendarMiniMonth',
  component: AfCalendarMiniMonthComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfCalendarMiniMonth',
      useWhen: [
        'navegar el mes desde la columna lateral de un dashboard',
        'dar una vista de mes en pantallas donde la grilla completa no entra',
      ],
      avoidWhen: [
        'elegir una fecha en un formulario: usar AfDatePicker',
        'trabajar sobre la agenda: usar AfCalendar',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-card-bg', '--af-primary', '--af-primary-soft', '--af-accent'],
      related: ['AfCalendar', 'AfDatePicker', 'AfCalendarStripAgenda'],
    },
    docs: {
      description: {
        component:
          'Mini calendario de mes con marcas de actividad y la agenda del día elegido. No ' +
          'duplica la fuente de verdad: emite la fecha y quien lo usa sincroniza su calendario.',
      },
    },
  },
  argTypes: {
    showAgenda: { control: 'boolean' },
    now: { control: 'text' },
    dateSelect: { action: 'dateSelect' },
    monthChange: { action: 'monthChange' },
    eventActivate: { action: 'eventActivate' },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="max-width:320px">
      <af-calendar-mini-month
        [events]="events"
        [selectedDate]="selectedDate"
        [rangeStart]="rangeStart"
        [rangeEnd]="rangeEnd"
        [showAgenda]="showAgenda"
        [heading]="heading"
        [now]="now"
        (dateSelect)="dateSelect($event)"
        (monthChange)="monthChange($event)"
        (eventActivate)="eventActivate($event)"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfCalendarMiniMonthComponent>;

const DEFAULT_ARGS = {
  events: AF_CALENDAR_WIDGET_EVENTS,
  selectedDate: '2026-08-12',
  rangeStart: '2026-08-10',
  rangeEnd: '2026-08-17',
  showAgenda: true,
  heading: 'Planificación',
  now: AF_CALENDAR_WIDGET_NOW,
  dateSelect: fn(),
  monthChange: fn(),
  eventActivate: fn(),
};

export const Default: Story = { args: DEFAULT_ARGS };

export const WithoutAgenda: Story = {
  name: 'Solo el mes',
  args: { ...DEFAULT_ARGS, showAgenda: false },
};

export const MonthNavigation: Story = {
  name: 'Navegar de mes',
  args: DEFAULT_ARGS,
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Siguiente' }));
    await expect(args.monthChange).toHaveBeenCalledWith('2026-09-01');

    // El mes se mueve solo; la fecha seleccionada la sigue gobernando el consumidor.
    await expect(args.dateSelect).not.toHaveBeenCalled();
  },
};
