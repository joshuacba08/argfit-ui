import { applicationConfig, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent } from 'storybook/test';

import {
    provideAfCalendarEventTypes,
    provideAfCalendarRequestId,
    type AfCalendarEvent,
    type AfCalendarEventTypeDefinition,
} from '@argfit-ui/core';

import { AfCalendarComponent } from './af-calendar.component';
import { AF_CALENDAR_TEMPLATE_DIRECTIVES } from './af-calendar-event.directive';
import { AF_CALENDAR_SLOT_DIRECTIVES } from './af-calendar-slots.directive';

/**
 * Las fechas son fijas a propósito.
 *
 * Un fixture anclado a «hoy» haría que la puerta visual comparase una captura
 * distinta cada día. Con una semana fija, cualquier diferencia en el screenshot
 * es una regresión real.
 */
const WEEK = ['2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14', '2026-08-15', '2026-08-16'];
const ANCHOR = WEEK[2];
const TIME_ZONE = 'America/Argentina/Buenos_Aires';

const event = (
  id: string,
  dayIndex: number,
  start: string,
  end: string,
  title: string,
  subtitle: string,
  colorToken: AfCalendarEvent['colorToken'],
  over: Partial<AfCalendarEvent> = {},
): AfCalendarEvent => ({
  id,
  date: WEEK[dayIndex],
  start,
  end,
  kind: 'timed',
  title,
  subtitle,
  colorToken,
  ...over,
});

const EVENTS: readonly AfCalendarEvent[] = [
  event('e1', 0, '08:00', '09:00', 'Activación + movilidad', 'Gimnasio · Plantel completo', 'gym'),
  event('e2', 0, '09:30', '11:00', 'Entrenamiento de campo', 'Cancha 1 · Bloque técnico', 'training'),
  event('e3', 0, '11:15', '12:00', 'Video análisis rival', 'Sala 2 · Cuerpo técnico', 'video'),
  event('e4', 0, '16:00', '17:00', 'Kinesiología', 'Consultorio · 4 jugadores', 'medical'),
  event('e5', 1, '09:00', '10:30', 'Fuerza máxima', 'Gimnasio · Grupo A', 'gym'),
  event('e6', 1, '10:00', '11:30', 'Rutina regenerativa', 'Cancha 2 · Grupo B', 'training'),
  event('e7', 1, '15:30', '17:00', 'Trabajo táctico', 'Cancha 1 · Plantel completo', 'training'),
  event('e8', 2, '08:30', '09:15', 'Test de salto', 'Laboratorio · 12 atletas', 'gym', {
    state: 'pending',
  }),
  event('e9', 2, '10:00', '12:00', 'Entrenamiento integrado', 'Cancha 1', 'training'),
  event('e10', 2, '13:00', '14:00', 'Reunión de rendimiento', 'Sala 1', 'video'),
  event('e11', 3, '09:00', '10:30', 'Velocidad y aceleración', 'Pista', 'training'),
  event('e12', 3, '09:30', '11:00', 'Readaptación lesionados', 'Gimnasio · 3 jugadores', 'medical', {
    state: 'conflict',
  }),
  event('e13', 3, '17:00', '18:30', 'Rutina de core', 'Gimnasio · Grupo B', 'gym'),
  event('e14', 4, '10:00', '11:00', 'Fútbol reducido', 'Cancha 2', 'training'),
  event('e15', 4, '11:30', '12:15', 'Charla pre-partido', 'Sala 1 · Plantel', 'video', {
    seriesId: 'serie-charlas',
    occurrenceId: 'serie-charlas-14',
  }),
  event('e16', 5, '16:00', '18:00', 'Partido vs. Racing', 'Estadio · Fecha 14', 'match'),
  event('e17', 6, '10:00', '11:00', 'Recuperación post-partido', 'Piscina · Plantel', 'medical'),
  {
    id: 'a1',
    date: WEEK[5],
    start: '00:00',
    end: '24:00',
    kind: 'all-day',
    title: 'Día de partido',
    subtitle: 'Fecha 14',
    colorToken: 'match',
  },
  {
    id: 'a2',
    date: WEEK[2],
    start: '00:00',
    end: '24:00',
    kind: 'all-day',
    title: 'Carga alta',
    subtitle: 'Microciclo 7',
    colorToken: 'video',
  },
];

/** Un día cargado para que el mes muestre el overflow explícito. */
const CROWDED_DAY: readonly AfCalendarEvent[] = [
  ...EVENTS,
  event('x1', 2, '15:00', '16:00', 'Prensa', 'Sala 3', 'video'),
  event('x2', 2, '16:30', '17:30', 'Fisioterapia', 'Consultorio', 'medical'),
  event('x3', 2, '18:00', '19:00', 'Análisis individual', 'Sala 2', 'video'),
];

const STATE_EVENTS: readonly AfCalendarEvent[] = [
  event('s1', 2, '07:00', '08:00', 'Normal', 'Cancha 1 · Plantel', 'training'),
  event('s2', 2, '08:15', '09:15', 'Tentativo', 'Cancha 1 · Plantel', 'training', {
    state: 'tentative',
  }),
  event('s3', 2, '09:30', '10:30', 'Pendiente de confirmar', 'Gimnasio', 'gym', {
    state: 'pending',
  }),
  event('s4', 2, '10:45', '11:45', 'Sincronizando', 'Gimnasio', 'gym', { state: 'syncing' }),
  event('s5', 2, '12:00', '13:00', 'Conflicto de recurso', 'Estadio', 'match', {
    state: 'conflict',
  }),
  event('s6', 2, '13:15', '14:15', 'Cancelado', 'Sala 1', 'neutral', { state: 'cancelled' }),
  event('s7', 2, '14:30', '15:30', 'Solo lectura', 'Sala 1', 'neutral', { state: 'readonly' }),
  event('s8', 2, '15:45', '16:45', 'Error de datos', 'Consultorio', 'medical', { state: 'error' }),
];

/** Registro deportivo mínimo para las historias de edición. */
const EVENT_TYPES: readonly AfCalendarEventTypeDefinition[] = [
  {
    id: 'training',
    label: 'Entrenamiento',
    icon: 'activity',
    colorToken: 'training',
    defaultDurationMinutes: 90,
    fields: [
      { key: 'location', label: 'Lugar', kind: 'text', placeholder: 'Cancha 1' },
      {
        key: 'load',
        label: 'Carga prevista',
        kind: 'select',
        options: [
          { value: 'low', label: 'Baja' },
          { value: 'high', label: 'Alta' },
        ],
      },
    ],
  },
  {
    id: 'gym',
    label: 'Rutina',
    icon: 'dumbbell',
    colorToken: 'gym',
    defaultDurationMinutes: 60,
    fields: [{ key: 'routine', label: 'Rutina', kind: 'text' }],
  },
  {
    id: 'match',
    label: 'Partido',
    icon: 'trophy',
    colorToken: 'match',
    defaultDurationMinutes: 120,
    fields: [{ key: 'opponent', label: 'Rival', kind: 'text', placeholder: 'Racing' }],
  },
];

const meta: Meta<AfCalendarComponent> = {
  title: 'Data/Calendar',
  component: AfCalendarComponent,
  decorators: [
    moduleMetadata({
      imports: [...AF_CALENDAR_SLOT_DIRECTIVES, ...AF_CALENDAR_TEMPLATE_DIRECTIVES],
    }),
    applicationConfig({
      providers: [
        provideAfCalendarEventTypes(EVENT_TYPES),
        // Id estable: la historia no debe cambiar de payload entre corridas.
        provideAfCalendarRequestId(() => 'req_story'),
      ],
    }),
  ],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfCalendar',
      useWhen: [
        'mostrar sesiones planificadas sobre una grilla temporal',
        'alternar entre día, semana, mes y agenda sobre el mismo conjunto de datos',
      ],
      avoidWhen: [
        'elegir una única fecha civil: usar AfDatePicker',
        'expandir reglas de recurrencia o persistir cambios: eso es de la aplicación',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: [
        '--af-calendar-surface',
        '--af-calendar-grid-line',
        '--af-calendar-today-bg',
        '--af-calendar-now',
        '--af-calendar-slot-height-comfortable',
        '--af-calendar-time-axis-width',
        '--af-event-training-accent',
        '--af-event-match-accent',
      ],
      related: ['AfDatePicker', 'AfTimePicker', 'AfTimeline', 'AfDataTable'],
    },
    docs: {
      description: {
        component:
          'Calendario adaptativo: grilla temporal, mes y agenda sobre un mismo modelo de ' +
          'ocurrencias. Recibe eventos ya resueltos y emite intenciones tipadas; no hace HTTP, ' +
          'no persiste, no expande series y nunca infiere la zona horaria del navegador.',
      },
    },
  },
  argTypes: {
    view: {
      control: 'select',
      options: ['day', 'three-day', 'week', 'work-week', 'month', 'agenda'],
      description: 'Vista activa. El móvil resuelve semana como rango de tres días.',
    },
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'touch'],
      description: 'Altura de slot: 24, 32 o 44 px. El móvil siempre usa touch.',
    },
    firstDay: {
      control: 'select',
      options: [0, 1, 6],
      description: 'Primer día de la semana. 0 es domingo.',
    },
    minTime: { control: 'text', description: 'Primer minuto visible de la grilla.' },
    maxTime: { control: 'text', description: 'Último minuto visible, exclusivo.' },
    height: { control: 'text' },
    nowIndicator: { control: 'boolean' },
    showToolbar: { control: 'boolean' },
    loading: { control: 'boolean' },
    partial: { control: 'boolean' },
    offline: { control: 'boolean' },
    empty: { control: 'boolean' },
    error: { control: 'text' },
    editable: { control: 'boolean', description: 'Habilita mover y redimensionar.' },
    selectable: { control: 'boolean', description: 'Habilita dibujar un rango para crear.' },
    createButton: { control: 'boolean' },
    overlays: {
      control: 'boolean',
      description: 'Hospeda el detalle y el editor en un modal propio del calendario.',
    },
    visibleRangeChange: {
      action: 'visibleRangeChange',
      description: 'Ventana visible tras navegar o cambiar de vista: dispara la carga de datos.',
    },
    eventMoveRequest: {
      action: 'eventMoveRequest',
      description: 'Intención de mover. Se emite en pointerup, nunca en pointerdown.',
    },
    eventResizeRequest: { action: 'eventResizeRequest', description: 'Intención de redimensionar.' },
    rangeCreateRequest: { action: 'rangeCreateRequest', description: 'Selección de rango confirmada.' },
    recurrenceScopeRequest: {
      action: 'recurrenceScopeRequest',
      description: 'Alcance pedido antes de mutar una ocurrencia de serie.',
    },
    interactionCancel: { action: 'interactionCancel', description: 'Escape o pointercancel.' },
    eventSave: { action: 'eventSave', description: 'Guardado propuesto desde el editor.' },
    eventDelete: { action: 'eventDelete', description: 'Borrado propuesto desde detalle o editor.' },
    viewChange: { action: 'viewChange', description: 'Nueva vista elegida en la toolbar.' },
    anchorDateChange: { action: 'anchorDateChange', description: 'Nueva fecha de navegación.' },
    eventActivate: { action: 'eventActivate', description: 'Ocurrencia activada por el usuario.' },
    retry: { action: 'retry', description: 'Reintento pedido desde un banner de error o parcial.' },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface">
      <af-calendar
        [events]="events"
        [view]="view"
        [views]="views"
        [anchorDate]="anchorDate"
        [timeZone]="timeZone"
        [density]="density"
        [firstDay]="firstDay"
        [hiddenDays]="hiddenDays"
        [minTime]="minTime"
        [maxTime]="maxTime"
        [nowIndicator]="nowIndicator"
        [showToolbar]="showToolbar"
        [editable]="editable"
        [selectable]="selectable"
        [createButton]="createButton"
        [overlays]="overlays"
        [height]="height"
        [loading]="loading"
        [partial]="partial"
        [offline]="offline"
        [empty]="empty"
        [error]="error"
        [ariaLabel]="ariaLabel"
        (visibleRangeChange)="visibleRangeChange($event)"
        (viewChange)="viewChange($event)"
        (anchorDateChange)="anchorDateChange($event)"
        (eventActivate)="eventActivate($event)"
        (eventMoveRequest)="eventMoveRequest($event)"
        (eventResizeRequest)="eventResizeRequest($event)"
        (rangeCreateRequest)="rangeCreateRequest($event)"
        (recurrenceScopeRequest)="recurrenceScopeRequest($event)"
        (interactionCancel)="interactionCancel($event)"
        (eventSave)="eventSave($event)"
        (eventDelete)="eventDelete($event)"
        (retry)="retry()"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfCalendarComponent>;

const DEFAULT_ARGS = {
  events: EVENTS,
  view: 'week' as const,
  views: ['day', 'three-day', 'week', 'work-week', 'month', 'agenda'] as const,
  anchorDate: ANCHOR,
  timeZone: TIME_ZONE,
  density: 'comfortable' as const,
  firstDay: 1 as const,
  hiddenDays: [] as const,
  minTime: '07:00',
  maxTime: '20:00',
  nowIndicator: true,
  showToolbar: true,
  editable: false,
  selectable: false,
  createButton: false,
  overlays: true,
  height: '620px',
  loading: false,
  partial: false,
  offline: false,
  empty: false,
  error: undefined,
  ariaLabel: 'Calendario del plantel',
  visibleRangeChange: fn(),
  viewChange: fn(),
  anchorDateChange: fn(),
  eventActivate: fn(),
  eventMoveRequest: fn(),
  eventResizeRequest: fn(),
  rangeCreateRequest: fn(),
  recurrenceScopeRequest: fn(),
  interactionCancel: fn(),
  eventSave: fn(),
  eventDelete: fn(),
  retry: fn(),
};

/**
 * Historia canónica: es el id que corre en la puerta visual y en axe sobre las
 * cuatro matrices, así que deliberadamente no lleva `play`.
 */
export const Default: Story = {
  args: DEFAULT_ARGS,
};

export const Day: Story = {
  name: 'Día',
  args: { ...DEFAULT_ARGS, view: 'day' },
};

export const ThreeDay: Story = {
  name: '3 días',
  args: { ...DEFAULT_ARGS, view: 'three-day' },
};

export const WorkWeek: Story = {
  name: 'Semana laboral',
  args: { ...DEFAULT_ARGS, view: 'work-week' },
};

export const Month: Story = {
  name: 'Mes',
  args: { ...DEFAULT_ARGS, view: 'month', events: CROWDED_DAY, height: '680px' },
};

export const Agenda: Story = {
  args: { ...DEFAULT_ARGS, view: 'agenda' },
};

export const Densities: Story = {
  name: 'Densidades',
  args: { ...DEFAULT_ARGS, view: 'three-day' },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface" style="display:grid;gap:24px">
      @for (density of ['compact', 'comfortable', 'touch']; track density) {
        <af-calendar
          [events]="events"
          view="three-day"
          [anchorDate]="anchorDate"
          [timeZone]="timeZone"
          [density]="density"
          minTime="08:00"
          maxTime="13:00"
          height="360px"
          [ariaLabel]="'Calendario en densidad ' + density"
        />
      }
    </div>`,
  }),
};

export const EventStates: Story = {
  name: 'Estados de evento',
  args: {
    ...DEFAULT_ARGS,
    view: 'day',
    events: STATE_EVENTS,
    minTime: '06:00',
    maxTime: '18:00',
  },
};

export const Loading: Story = {
  name: 'Carga',
  args: { ...DEFAULT_ARGS, events: [], loading: true, height: '420px' },
};

export const Empty: Story = {
  name: 'Vacío',
  args: { ...DEFAULT_ARGS, events: [], height: '420px' },
};

export const ErrorState: Story = {
  name: 'Error',
  args: { ...DEFAULT_ARGS, error: 'No se pudo cargar el rango 10–16 de agosto.', height: '520px' },
};

export const Offline: Story = {
  name: 'Offline y parcial',
  args: { ...DEFAULT_ARGS, offline: true, partial: true, height: '520px' },
};

export const CustomTemplates: Story = {
  name: 'Toolbar y evento propios',
  args: { ...DEFAULT_ARGS, view: 'three-day' },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface">
      <af-calendar
        [events]="events"
        [view]="view"
        [anchorDate]="anchorDate"
        [timeZone]="timeZone"
        [height]="height"
        [minTime]="minTime"
        [maxTime]="maxTime"
        [ariaLabel]="ariaLabel"
        (eventActivate)="eventActivate($event)"
      >
        <div afCalendarToolbar style="display:flex;align-items:center;gap:12px;padding:12px 16px">
          <strong>Microciclo 7</strong>
          <span style="color:var(--af-text-soft);font-size:var(--af-text-xs)">
            Toolbar provista por la aplicación
          </span>
        </div>

        <ng-template afCalendarEvent let-event let-compact="compact">
          <span style="font-size:var(--af-text-xs);font-weight:600">{{ event.title }}</span>
          @if (!compact) {
            <span style="font-size:var(--af-text-xs);color:var(--af-text-soft)">
              {{ event.subtitle }}
            </span>
          }
        </ng-template>
      </af-calendar>
    </div>`,
  }),
};

export const Editable: Story = {
  name: 'Arrastre y resize',
  args: { ...DEFAULT_ARGS, editable: true, selectable: true, createButton: true },
};

const RESOURCES = [
  { id: 'r1', title: 'Cancha 1', subtitle: 'Césped natural', colorToken: 'training' as const, icon: 'map-pin' as const },
  { id: 'r2', title: 'Cancha 2', subtitle: 'Sintético', colorToken: 'training' as const, icon: 'map-pin' as const },
  { id: 'r3', title: 'Gimnasio', subtitle: 'Sala de fuerza', colorToken: 'gym' as const, icon: 'dumbbell' as const },
  { id: 'r4', title: 'Sala de video', subtitle: 'Capacidad 30', colorToken: 'video' as const, icon: 'video' as const },
  { id: 'r5', title: 'Consultorio', subtitle: 'Kinesiología', colorToken: 'medical' as const, icon: 'stethoscope' as const },
];

const RESOURCE_EVENTS: readonly AfCalendarEvent[] = [
  event('rr1', 2, '08:00', '09:30', 'Grupo A · técnico', 'Plantel profesional', 'training', { resourceId: 'r1' }),
  event('rr2', 2, '10:00', '11:30', 'Grupo B · táctico', 'Plantel profesional', 'training', { resourceId: 'r1' }),
  event('rr3', 2, '09:00', '10:30', 'Reserva · juveniles', 'Sub-20', 'training', { resourceId: 'r2' }),
  event('rr4', 2, '14:00', '15:30', 'Fútbol reducido', 'Sub-17', 'training', { resourceId: 'r2' }),
  event('rr5', 2, '08:30', '10:00', 'Fuerza máxima', 'Grupo A', 'gym', { resourceId: 'r3' }),
  event('rr6', 2, '10:15', '11:15', 'Core y estabilidad', 'Grupo B', 'gym', { resourceId: 'r3' }),
  event('rr7', 2, '16:00', '17:00', 'Readaptación', '3 jugadores', 'gym', {
    resourceId: 'r3',
    state: 'pending',
  }),
  event('rr8', 2, '11:30', '12:30', 'Análisis de rival', 'Cuerpo técnico', 'video', { resourceId: 'r4' }),
  event('rr9', 2, '15:00', '16:00', 'Charla de plantel', 'Fecha 14', 'video', { resourceId: 'r4' }),
  event('rr10', 2, '09:00', '12:00', 'Turnos de kinesiología', '6 jugadores', 'medical', { resourceId: 'r5' }),
];

export const Resources: Story = {
  name: 'Recursos',
  args: {
    ...DEFAULT_ARGS,
    view: 'resources',
    views: ['resources', 'day', 'week'],
    events: RESOURCE_EVENTS,
    resources: RESOURCES,
    editable: true,
    overlays: false,
    height: '640px',
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface">
      <af-calendar
        [events]="events"
        [view]="view"
        [views]="views"
        [anchorDate]="anchorDate"
        [timeZone]="timeZone"
        [resources]="resources"
        [editable]="editable"
        [overlays]="overlays"
        [minTime]="minTime"
        [maxTime]="maxTime"
        [height]="height"
        ariaLabel="Ocupación de instalaciones"
        (eventMoveRequest)="eventMoveRequest($event)"
        (resourceAssignRequest)="eventMoveRequest($event)"
        (eventActivate)="eventActivate($event)"
      />
    </div>`,
  }),
};

export const EventDetail: Story = {
  name: 'Detalle del evento',
  args: { ...DEFAULT_ARGS, editable: true },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Entrenamiento de campo/ }));

    const dialog = await canvas.findByRole('dialog');
    await expect(dialog).toBeTruthy();
    await expect(dialog.textContent).toContain('Mié 12 de agosto');
  },
};

export const EventEditor: Story = {
  name: 'Detalle y editor',
  args: { ...DEFAULT_ARGS, editable: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Entrenamiento de campo/ }));
    await userEvent.click(await canvas.findByRole('button', { name: /Editar/ }));
    await userEvent.click(canvas.getByRole('button', { name: /Guardar/ }));

    await expect(args.eventSave).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'e2',
        draft: expect.objectContaining({ title: 'Entrenamiento de campo' }),
      }),
    );
  },
};

export const CreateFromToolbar: Story = {
  name: 'Crear desde la toolbar',
  args: { ...DEFAULT_ARGS, editable: true, selectable: true, createButton: true },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /^Crear$/ }));

    const dialog = await canvas.findByRole('dialog');
    await expect(dialog.textContent).toContain('Nueva actividad');
  },
};

export const KeyboardMove: Story = {
  name: 'Mover sin arrastrar',
  args: { ...DEFAULT_ARGS, editable: true, overlays: false },
  play: async ({ args, canvas }) => {
    const block = canvas.getByRole('button', { name: /Entrenamiento de campo/ });
    block.focus();

    // Enter entra en modo mover; las flechas desplazan; Enter confirma.
    await userEvent.keyboard('{Enter}{ArrowDown}{ArrowRight}{Enter}');

    await expect(args.eventMoveRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: 'keyboard',
        proposedInterval: expect.objectContaining({
          start: '2026-08-13T09:45',
          end: '2026-08-13T11:15',
        }),
      }),
    );
    // El foco no se pierde tras la mutación.
    await expect(document.activeElement).toBe(block);
  },
};

export const KeyboardMoveCancelled: Story = {
  name: 'Escape revierte',
  args: { ...DEFAULT_ARGS, editable: true, overlays: false },
  play: async ({ args, canvas }) => {
    canvas.getByRole('button', { name: /Entrenamiento de campo/ }).focus();
    await userEvent.keyboard('{Enter}{ArrowDown}{Escape}');

    await expect(args.eventMoveRequest).not.toHaveBeenCalled();
    await expect(args.interactionCancel).toHaveBeenCalledWith({
      reason: 'escape',
      eventId: 'e2',
    });
  },
};

export const RecurrenceScope: Story = {
  name: 'Serie recurrente',
  args: {
    ...DEFAULT_ARGS,
    editable: true,
    overlays: false,
    events: EVENTS.map((item) =>
      item.id === 'e2'
        ? { ...item, seriesId: 'serie-microciclo', occurrenceId: 'serie-microciclo-12' }
        : item,
    ),
  },
  play: async ({ args, canvas }) => {
    canvas.getByRole('button', { name: /Entrenamiento de campo/ }).focus();
    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');

    // Una ocurrencia de serie no se mueve sin saber el alcance.
    await expect(args.eventMoveRequest).not.toHaveBeenCalled();
    await expect(args.recurrenceScopeRequest).toHaveBeenCalledWith(
      expect.objectContaining({ scopes: ['this', 'this-and-following', 'all'] }),
    );
  },
};

export const KeyboardNavigation: Story = {
  name: 'Navegación por teclado',
  args: DEFAULT_ARGS,
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Siguiente' }));
    await expect(args.anchorDateChange).toHaveBeenCalledWith('2026-08-19');
    await expect(args.visibleRangeChange).toHaveBeenCalledWith(
      expect.objectContaining({ start: '2026-08-17', end: '2026-08-24' }),
    );

    await userEvent.click(canvas.getByRole('button', { name: /Mes/ }));
    await expect(args.viewChange).toHaveBeenCalledWith('month');
  },
};
