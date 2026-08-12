import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import {
    AfCalendarDayTimelineComponent,
    AfCalendarMiniMonthComponent,
    AfCalendarNextSessionComponent,
    AfCalendarStripAgendaComponent,
    AfCalendarUpcomingComponent,
    AfCalendarWeekLoadComponent,
} from '@argfit-ui/adaptive';
import type { AfCalendarEvent } from '@argfit-ui/core';

/**
 * Composición, no componente.
 *
 * Los widgets se combinan en la aplicación: la librería entrega las piezas y el
 * producto decide la grilla. Esta historia vive en showcase justamente porque
 * no hay un `AfCalendarDashboard` que documentar — y no debería haberlo.
 */
const WEEK = [
  '2026-08-10',
  '2026-08-11',
  '2026-08-12',
  '2026-08-13',
  '2026-08-14',
  '2026-08-15',
  '2026-08-16',
];

const NOW = '2026-08-12T10:00';

const event = (
  id: string,
  dayIndex: number,
  start: string,
  end: string,
  title: string,
  subtitle: string,
  colorToken: AfCalendarEvent['colorToken'],
): AfCalendarEvent => ({
  id,
  date: WEEK[dayIndex],
  start,
  end,
  kind: 'timed',
  title,
  subtitle,
  colorToken,
});

const EVENTS: readonly AfCalendarEvent[] = [
  event('d1', 0, '08:00', '09:00', 'Activación + movilidad', 'Gimnasio', 'gym'),
  event('d2', 1, '09:00', '10:30', 'Fuerza máxima', 'Gimnasio · Grupo A', 'gym'),
  event('d3', 2, '08:30', '09:15', 'Test de salto', 'Laboratorio · 12 atletas', 'gym'),
  event('d4', 2, '10:00', '12:00', 'Entrenamiento integrado', 'Cancha 1', 'training'),
  event('d5', 2, '13:00', '14:00', 'Reunión de rendimiento', 'Sala 1', 'video'),
  event('d6', 2, '16:30', '17:30', 'Kinesiología', 'Consultorio · 4 jugadores', 'medical'),
  event('d7', 3, '09:00', '10:30', 'Velocidad y aceleración', 'Pista', 'training'),
  event('d8', 3, '17:00', '18:30', 'Rutina de core', 'Gimnasio · Grupo B', 'gym'),
  event('d9', 4, '10:00', '11:00', 'Fútbol reducido', 'Cancha 2', 'training'),
  event('d10', 4, '11:30', '12:15', 'Charla pre-partido', 'Sala 1 · Plantel', 'video'),
  event('d11', 5, '16:00', '18:00', 'Partido vs. Racing', 'Estadio · Fecha 14', 'match'),
  event('d12', 6, '10:00', '11:00', 'Recuperación post-partido', 'Piscina · Plantel', 'medical'),
];

const meta: Meta = {
  title: 'Patterns/Calendar/Dashboard',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        AfCalendarDayTimelineComponent,
        AfCalendarMiniMonthComponent,
        AfCalendarNextSessionComponent,
        AfCalendarStripAgendaComponent,
        AfCalendarUpcomingComponent,
        AfCalendarWeekLoadComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Los seis widgets de calendario compuestos en una grilla de dashboard. Todos leen el ' +
          'mismo conjunto de ocurrencias y son de solo lectura: emiten intenciones y la ' +
          'aplicación decide. La composición es del producto, no de la librería.',
      },
    },
  },
  render: () => ({
    props: { events: EVENTS, now: NOW, timeZone: 'America/Argentina/Buenos_Aires' },
    template: `
      <div class="af-story-surface" style="display:grid;gap:20px">
        <af-calendar-day-timeline [events]="events" date="2026-08-12" [now]="now" />

        <div style="display:grid;gap:20px;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));align-items:start">
          <af-calendar-next-session [events]="events" [timeZone]="timeZone" [now]="now" secondaryActionLabel="Recordarme" />
          <af-calendar-upcoming [events]="events" [timeZone]="timeZone" [now]="now" showLink />
          <af-calendar-strip-agenda [events]="events" [timeZone]="timeZone" [now]="now" selectedDate="2026-08-12" />
          <af-calendar-mini-month [events]="events" [now]="now" selectedDate="2026-08-12" rangeStart="2026-08-10" rangeEnd="2026-08-17" />
          <af-calendar-week-load [events]="events" [now]="now" anchorDate="2026-08-12" [goalMinutes]="900" />
        </div>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Dashboard: Story = {};
