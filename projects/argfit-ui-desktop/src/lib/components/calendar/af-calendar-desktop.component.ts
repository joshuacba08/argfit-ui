import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  AF_CALENDAR_DEFAULT_LABELS,
  AF_CALENDAR_REQUEST_ID,
  afCalendarActivateInteraction,
  afCalendarApplyDelta,
  afCalendarBeginInteraction,
  afCalendarConvertInteraction,
  afCalendarDayOfWeek,
  afCalendarDurationLabel,
  afCalendarEventsOn,
  afCalendarInteractionAnnouncement,
  afCalendarIsResourceChange,
  afCalendarIsSameMonth,
  afCalendarIsWeekend,
  afCalendarKeyboardDelta,
  afCalendarLayoutDay,
  afCalendarLongDate,
  afCalendarMinutesToPixels,
  afCalendarMonthOverflow,
  afCalendarMutationRequest,
  afCalendarNowMinutes,
  afCalendarPixelsToMinutes,
  afCalendarProposedInterval,
  afCalendarSlotHeight,
  afCalendarToday,
  afCalendarToHhMm,
  afCalendarToMinutes,
  afCalendarValidateMutation,
  afCalendarVisibleRange,
  type AfCalendarDayHeaderTemplate,
  type AfCalendarDensity,
  type AfCalendarEvent,
  type AfCalendarEventTemplate,
  type AfCalendarInteractionCancel,
  type AfCalendarInteractionMode,
  type AfCalendarInteractionState,
  type AfCalendarLabels,
  type AfCalendarAllowMutation,
  type AfCalendarMutationDecision,
  type AfCalendarMutationRequest,
  type AfCalendarRecurrenceScopeRequest,
  type AfCalendarResource,
  type AfCalendarView,
  type AfCalendarVisibleRange,
  type AfCalendarWeekday,
  type AfIconName,
} from '@argfit-ui/core';
import {
  AfIconComponent,
  AfLiveRegionComponent,
  AfPointerDragDirective,
  type AfPointerDragEvent,
} from '@argfit-ui/primitives';

/** Icono por token de color: la información nunca depende solo del color. */
const EVENT_ICON: Readonly<Record<string, AfIconName>> = {
  training: 'activity',
  match: 'trophy',
  gym: 'dumbbell',
  video: 'video',
  medical: 'stethoscope',
  neutral: 'calendar',
};

/**
 * Icono por estado del evento.
 *
 * Dentro de un bloque de dos columnas no entra «En conflicto» sin recortarse a
 * «En C…», así que el bloque comunica el estado con forma y el texto completo
 * viaja en el nombre accesible; la agenda, que tiene ancho, sí lo muestra.
 */
const STATE_ICON: Readonly<Record<string, AfIconName>> = {
  tentative: 'circle-alert',
  pending: 'clock',
  syncing: 'refresh-cw',
  conflict: 'alert-triangle',
  cancelled: 'x',
  readonly: 'eye',
  error: 'alert-triangle',
};

const VIEW_ICON: Readonly<Record<AfCalendarView, AfIconName>> = {
  day: 'clock',
  'three-day': 'columns-3',
  week: 'grid-2x2',
  'work-week': 'grid-2x2',
  month: 'calendar',
  agenda: 'list',
  resources: 'layout-dashboard',
};

/** Estados en los que el evento no se puede mover ni redimensionar. */
const LOCKED_STATES: ReadonlySet<string> = new Set(['readonly', 'cancelled']);

/** Actividades visibles por celda de mes antes de colapsar en «+N más». */
const MONTH_CELL_CAPACITY = 3;

/**
 * Alto mínimo del bloque para el layout de tres líneas.
 *
 * Meta, título y subtítulo suman ~48 px con el padding: por debajo de eso el
 * texto se corta a la mitad, así que el bloque pasa a una sola línea.
 */
const COMPACT_BLOCK_PX = 56;

type AfCalendarDesktopState = 'ready' | 'loading' | 'empty' | 'error';

export interface AfCalendarDesktopBlock {
  readonly event: AfCalendarEvent;
  readonly topPx: number;
  readonly heightPx: number;
  readonly leftPercent: number;
  readonly widthPercent: number;
  readonly compact: boolean;
  readonly timeLabel: string;
  readonly stateLabel: string | null;
  readonly ariaLabel: string;
  readonly icon: AfIconName;
  readonly stateIcon: AfIconName | null;
  readonly durationMinutes: number;
  /** `false` en solo lectura y cancelado: no se arrastra ni se redimensiona. */
  readonly movable: boolean;
  readonly dragging: boolean;
  readonly keyboardActive: boolean;
}

export interface AfCalendarDesktopSelection {
  readonly topPx: number;
  readonly heightPx: number;
  readonly label: string;
}

export interface AfCalendarDesktopColumn {
  /** Día que representa la columna. En vista de recursos, el día ancla. */
  readonly date: string;
  /** Clave de la columna: la fecha, o el id del recurso en vista de recursos. */
  readonly key: string;
  readonly weekdayLabel: string;
  readonly dayNumber: string;
  readonly ariaLabel: string;
  readonly isToday: boolean;
  readonly isWeekend: boolean;
  readonly resource: AfCalendarResource | null;
  readonly allDay: readonly AfCalendarEvent[];
  readonly blocks: readonly AfCalendarDesktopBlock[];
  readonly nowOffsetPx: number | null;
  readonly eventCount: number;
  readonly selection: AfCalendarDesktopSelection | null;
}

export interface AfCalendarDesktopMonthCell {
  readonly date: string;
  readonly dayNumber: string;
  readonly ariaLabel: string;
  readonly isToday: boolean;
  readonly isOutside: boolean;
  readonly visible: readonly AfCalendarEvent[];
  readonly overflowCount: number;
  readonly overflowLabel: string;
}

export interface AfCalendarDesktopAgendaRow {
  readonly date: string;
  readonly dayNumber: string;
  readonly monthLabel: string;
  readonly weekdayLabel: string;
  readonly isToday: boolean;
  readonly events: readonly AfCalendarEvent[];
}

export interface AfCalendarDesktopHour {
  readonly minutes: number;
  readonly label: string;
}

/** Lo que se registró en `pointerdown`, antes de saber si habrá arrastre. */
interface PendingInteraction {
  readonly mode: AfCalendarInteractionMode;
  readonly event: AfCalendarEvent | null;
  readonly date: string;
  readonly startMinutes: number;
  readonly endMinutes: number;
  readonly resourceId?: string;
}

interface OptimisticInteraction {
  readonly state: AfCalendarInteractionState;
  readonly event: AfCalendarEvent;
  readonly requestId: string;
  readonly sourceEvents: readonly AfCalendarEvent[];
}

/**
 * Renderer de escritorio de `AfCalendar`.
 *
 * Grilla propia sobre CSS grid: ni PrimeNG ni ningún otro proveedor tiene un
 * scheduler, y un DOM de terceros sería imposible de corregir cuando axe falla
 * sobre una superficie tan densa.
 *
 * La geometría sale del token de densidad, no de medir el DOM: así el layout es
 * determinista, no necesita `ResizeObserver` y no salta al hidratar. El ancho
 * de columna es la única medición, y se toma una sola vez al empezar a
 * arrastrar.
 */
@Component({
  selector: 'af-calendar-desktop',
  imports: [AfIconComponent, AfLiveRegionComponent, AfPointerDragDirective, NgTemplateOutlet],
  templateUrl: './af-calendar-desktop.component.html',
  styleUrl: './af-calendar-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-calendar-desktop',
    '[attr.data-view]': 'view()',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
    '[attr.data-editable]': 'editable() ? "" : null',
    '[style.--af-calendar-slot]': 'slotHeightPx() + "px"',
    '[style.height]': 'height()',
  },
})
export class AfCalendarDesktopComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly nextRequestId = inject(AF_CALENDAR_REQUEST_ID);

  readonly events = input<readonly AfCalendarEvent[]>([]);
  readonly view = input<AfCalendarView>('week');
  readonly views = input<readonly AfCalendarView[]>(['day', 'week', 'month', 'agenda']);
  readonly anchorDate = input<string>(afCalendarToday());
  readonly timeZone = input.required<string>();
  readonly density = input<AfCalendarDensity>('comfortable');
  readonly firstDay = input<AfCalendarWeekday>(1);
  readonly hiddenDays = input<readonly AfCalendarWeekday[]>([]);
  readonly minTime = input('07:00');
  readonly maxTime = input('22:00');
  readonly nowIndicator = input(true, { transform: booleanAttribute });
  readonly showToolbar = input(true, { transform: booleanAttribute });
  readonly editable = input(false, { transform: booleanAttribute });
  readonly moveEnabled = input(true, { transform: booleanAttribute });
  readonly resizeStartEnabled = input(true, { transform: booleanAttribute });
  readonly resizeEndEnabled = input(true, { transform: booleanAttribute });
  readonly minDurationMinutes = input(15);
  readonly maxDurationMinutes = input<number | undefined>(undefined);
  readonly autoScroll = input(true, { transform: booleanAttribute });
  readonly timedAllDayConversion = input(false, { transform: booleanAttribute });
  readonly allowMutation = input<AfCalendarAllowMutation | undefined>(undefined);
  readonly mutationTimeoutMs = input(8_000);
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly createButton = input(false, { transform: booleanAttribute });
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly height = input('640px');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly partial = input(false, { transform: booleanAttribute });
  readonly offline = input(false, { transform: booleanAttribute });
  readonly empty = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly ariaLabel = input('Calendario');
  readonly selectedEventId = input<string | undefined>(undefined);
  /** Columnas de la vista `resources`. Sin recursos, la vista cae a `day`. */
  readonly resources = input<readonly AfCalendarResource[]>([]);

  readonly eventTemplate = input<AfCalendarEventTemplate | undefined>(undefined);
  readonly dayHeaderTemplate = input<AfCalendarDayHeaderTemplate | undefined>(undefined);
  readonly toolbarTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly emptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly errorTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly footerTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly overlayTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly viewChange = output<AfCalendarView>();
  readonly navigate = output<-1 | 1>();
  readonly todayPressed = output<void>();
  readonly eventActivate = output<AfCalendarEvent>();
  readonly createPressed = output<void>();
  readonly retry = output<void>();

  readonly eventMoveRequest = output<AfCalendarMutationRequest>();
  readonly eventResizeRequest = output<AfCalendarMutationRequest>();
  readonly rangeCreateRequest = output<AfCalendarMutationRequest>();
  readonly resourceAssignRequest = output<AfCalendarMutationRequest>();
  readonly recurrenceScopeRequest = output<AfCalendarRecurrenceScopeRequest>();
  readonly interactionCancel = output<AfCalendarInteractionCancel>();
  readonly interactionEditRequest = output<AfCalendarEvent>();

  private readonly gridBody = viewChild<ElementRef<HTMLElement>>('gridBody');
  private readonly allDayLane = viewChild<ElementRef<HTMLElement>>('allDayLane');

  /**
   * Minuto actual, refrescado cada 30 s solo en navegador.
   *
   * El intervalo no arranca en servidor ni en tests de render: un temporizador
   * colgado deja la suite abierta y ensucia la puerta visual.
   */
  private readonly now = signal(afCalendarNowMinutes());

  /** Vista previa optimista mientras dura el gesto. */
  private readonly interaction = signal<AfCalendarInteractionState | null>(null);
  private readonly optimistic = signal<OptimisticInteraction | null>(null);

  /** Evento en modo mover por teclado. */
  private readonly keyboardEventId = signal<string | null>(null);

  protected readonly announcement = signal('');

  private pending: PendingInteraction | null = null;
  private columnWidthPx = 0;
  private dragScrollStart = 0;
  private optimisticTimer: ReturnType<typeof setTimeout> | null = null;
  /**
   * El navegador dispara `click` después de `pointerup`, también cuando hubo
   * arrastre: sin esto, soltar un evento abriría su detalle.
   */
  private suppressNextClick = false;

  constructor() {
    if (this.isBrowser) {
      const handle = setInterval(() => this.now.set(afCalendarNowMinutes()), 30_000);
      this.destroyRef.onDestroy(() => clearInterval(handle));
    }
    effect(() => {
      const optimistic = this.optimistic();
      const events = this.events();
      if (!optimistic || events === optimistic.sourceEvents) return;
      const current = events.find((event) => event.id === optimistic.event.id);
      const proposed = afCalendarProposedInterval(optimistic.state);
      const accepted =
        current?.date === proposed.date &&
        current.kind === proposed.kind &&
        (current.kind === 'all-day'
          ? (current.endDate ?? '') === (proposed.endDate ?? '')
          : current.start === proposed.start && current.end === proposed.end);
      if (accepted) this.clearOptimistic();
      else if (current?.state === 'conflict') this.rejectOptimistic('conflict');
      else this.rejectOptimistic('rejected');
    });
    this.destroyRef.onDestroy(() => this.clearOptimistic());
    let context = `${this.view()}|${this.anchorDate()}`;
    let sourceEvents = this.events();
    effect(() => {
      const nextContext = `${this.view()}|${this.anchorDate()}`;
      const nextEvents = this.events();
      const active = untracked(this.interaction);
      if (active && (nextContext !== context || nextEvents !== sourceEvents)) {
        this.pending = null;
        this.interaction.set(null);
        this.interactionCancel.emit({
          reason: 'context-change',
          eventId: active.eventId ?? undefined,
        });
      }
      context = nextContext;
      sourceEvents = nextEvents;
    });
  }

  protected readonly state = computed<AfCalendarDesktopState>(() => {
    if (this.error()) return 'error';
    if (this.loading()) return 'loading';
    return this.empty() || this.events().length === 0 ? 'empty' : 'ready';
  });

  protected readonly slotHeightPx = computed(() => afCalendarSlotHeight(this.density()));

  readonly visibleRange = computed<AfCalendarVisibleRange>(() =>
    afCalendarVisibleRange(this.view(), this.anchorDate(), {
      firstDay: this.firstDay(),
      hiddenDays: this.hiddenDays(),
      labels: this.labels(),
      timeZone: this.timeZone(),
    }),
  );

  protected readonly bounds = computed(() => ({
    minMinutes: afCalendarToMinutes(this.minTime()),
    maxMinutes: afCalendarToMinutes(this.maxTime()),
  }));

  protected readonly hours = computed<readonly AfCalendarDesktopHour[]>(() => {
    const { minMinutes, maxMinutes } = this.bounds();
    const count = Math.max(1, Math.ceil((maxMinutes - minMinutes) / 60));
    return Array.from({ length: count }, (_, index) => {
      const minutes = minMinutes + index * 60;
      return { minutes, label: afCalendarToHhMm(minutes) };
    });
  });

  protected readonly gridHeightPx = computed(() =>
    afCalendarMinutesToPixels(
      this.bounds().maxMinutes - this.bounds().minMinutes,
      this.slotHeightPx(),
    ),
  );

  protected readonly viewOptions = computed(() =>
    this.views().map((view) => ({
      view,
      label: this.labels().viewLabels[view],
      icon: VIEW_ICON[view],
    })),
  );

  /** Eventos con la vista previa aplicada sobre el que se está manipulando. */
  private readonly previewedEvents = computed<readonly AfCalendarEvent[]>(() => {
    const state = this.interaction() ?? this.optimistic()?.state ?? null;
    const optimistic = this.optimistic();
    if (!state?.eventId) return this.events();
    return this.events().map((event) =>
      event.id === state.eventId
        ? {
            ...event,
            kind: state.kind,
            date: state.date,
            start: afCalendarToHhMm(state.startMinutes),
            end: afCalendarToHhMm(state.endMinutes),
            endDate: state.kind === 'all-day' ? state.endDate : undefined,
            ...(optimistic ? { state: 'pending' as const } : {}),
          }
        : event,
    );
  });

  protected readonly dragBubble = computed(() => {
    const state = this.interaction();
    if (!state?.active) return null;
    return {
      label:
        state.kind === 'all-day'
          ? `${afCalendarLongDate(state.date, this.labels())} – ${state.endDate}`
          : `${afCalendarToHhMm(state.startMinutes)} – ${afCalendarToHhMm(state.endMinutes)} · ` +
            afCalendarLongDate(state.date, this.labels()),
      keyboard: state.origin === 'keyboard',
    };
  });

  /**
   * `true` cuando el eje horizontal son recursos y no días.
   *
   * Sin recursos declarados la vista cae a un día común: una grilla de cero
   * columnas no es un estado vacío, es un error de configuración silencioso.
   */
  protected readonly byResource = computed(
    () => this.view() === 'resources' && this.resources().length > 0,
  );

  protected readonly columns = computed<readonly AfCalendarDesktopColumn[]>(() => {
    const labels = this.labels();
    const bounds = this.bounds();
    const slot = this.slotHeightPx();
    const today = afCalendarToday();
    const nowMinutes = this.now();
    const state = this.interaction();
    const keyboardId = this.keyboardEventId();
    const events = this.previewedEvents();
    const byResource = this.byResource();

    // Un día con una columna por recurso, o un rango de días con una por día:
    // el mismo motor de layout resuelve los dos.
    const axis: readonly { date: string; key: string; resource: AfCalendarResource | null }[] =
      byResource
        ? this.resources().map((resource) => ({
            date: this.anchorDate(),
            key: resource.id,
            resource,
          }))
        : this.visibleRange().days.map((date) => ({ date, key: date, resource: null }));

    return axis.map(({ date, key, resource }) => {
      const dayEvents = afCalendarEventsOn(events, date, resource?.id);
      const isToday = date === today;
      const showNow =
        this.nowIndicator() &&
        isToday &&
        nowMinutes >= bounds.minMinutes &&
        nowMinutes <= bounds.maxMinutes;

      const creating =
        state?.mode === 'create' &&
        state.active &&
        (byResource ? state.resourceId === key : state.date === date);

      return {
        date,
        key,
        weekdayLabel: labels.weekdaysShort[afCalendarDayOfWeek(date)],
        dayNumber: String(Number(date.slice(8, 10))),
        ariaLabel: resource ? resource.title : afCalendarLongDate(date, labels),
        isToday,
        isWeekend: !byResource && afCalendarIsWeekend(date),
        resource,
        // La franja de todo el día no aplica en vista de recursos.
        allDay: byResource ? [] : dayEvents.filter((event) => event.kind === 'all-day'),
        blocks: afCalendarLayoutDay(dayEvents, bounds).map((laid) => {
          const heightPx = afCalendarMinutesToPixels(laid.durationMinutes, slot);
          return {
            event: laid.event,
            topPx: afCalendarMinutesToPixels(laid.topMinutes - bounds.minMinutes, slot),
            heightPx: Math.max(heightPx, 18),
            leftPercent: (laid.column / laid.columns) * 100,
            widthPercent: 100 / laid.columns,
            compact: heightPx < COMPACT_BLOCK_PX,
            timeLabel: `${laid.event.start} – ${laid.event.end}`,
            stateLabel: this.stateLabel(laid.event),
            ariaLabel: this.eventAriaLabel(laid.event),
            icon: this.eventIcon(laid.event),
            stateIcon: STATE_ICON[laid.event.state ?? 'normal'] ?? null,
            durationMinutes: laid.durationMinutes,
            movable: this.editable() && !LOCKED_STATES.has(laid.event.state ?? 'normal'),
            dragging: state?.eventId === laid.event.id && state.active,
            keyboardActive: keyboardId === laid.event.id,
          };
        }),
        nowOffsetPx: showNow
          ? afCalendarMinutesToPixels(nowMinutes - bounds.minMinutes, slot)
          : null,
        eventCount: dayEvents.length,
        selection: creating
          ? {
              topPx: afCalendarMinutesToPixels(state.startMinutes - bounds.minMinutes, slot),
              heightPx: Math.max(
                afCalendarMinutesToPixels(state.endMinutes - state.startMinutes, slot),
                16,
              ),
              label: `${afCalendarToHhMm(state.startMinutes)} – ${afCalendarToHhMm(state.endMinutes)}`,
            }
          : null,
      };
    });
  });

  protected readonly nowLabel = computed(() => afCalendarToHhMm(this.now()));

  protected readonly monthWeekdays = computed(() => {
    const labels = this.labels();
    const first = this.firstDay();
    return Array.from({ length: 7 }, (_, index) => labels.weekdaysShort[(first + index) % 7]);
  });

  protected readonly monthCells = computed<readonly AfCalendarDesktopMonthCell[]>(() => {
    const labels = this.labels();
    const anchor = this.anchorDate();
    const today = afCalendarToday();

    return this.visibleRange().days.map((date) => {
      const { visible, overflowCount } = afCalendarMonthOverflow(
        afCalendarEventsOn(this.events(), date),
        MONTH_CELL_CAPACITY,
      );
      return {
        date,
        dayNumber: String(Number(date.slice(8, 10))),
        ariaLabel: afCalendarLongDate(date, labels),
        isToday: date === today,
        isOutside: !afCalendarIsSameMonth(date, anchor),
        visible,
        overflowCount,
        overflowLabel: labels.moreTemplate.replace('{count}', String(overflowCount)),
      };
    });
  });

  protected readonly agendaRows = computed<readonly AfCalendarDesktopAgendaRow[]>(() => {
    const labels = this.labels();
    const today = afCalendarToday();

    return this.visibleRange()
      .days.map((date) => ({
        date,
        dayNumber: String(Number(date.slice(8, 10))),
        monthLabel: labels.monthsShort[Number(date.slice(5, 7)) - 1],
        weekdayLabel: labels.weekdaysShort[afCalendarDayOfWeek(date)],
        isToday: date === today,
        events: [...afCalendarEventsOn(this.events(), date)].sort(
          (a, b) => afCalendarToMinutes(a.start) - afCalendarToMinutes(b.start),
        ),
      }))
      .filter((row) => row.events.length > 0);
  });

  protected readonly skeletonColumns = computed(() =>
    Array.from({ length: Math.max(1, this.visibleRange().days.length) }, (_, index) => index),
  );

  protected eventIcon(event: AfCalendarEvent): AfIconName {
    return EVENT_ICON[event.colorToken] ?? 'calendar';
  }

  protected eventTimeLabel(event: AfCalendarEvent): string {
    if (event.kind === 'all-day') return this.labels().allDay;
    return `${event.start} – ${event.end}`;
  }

  protected eventDurationLabel(event: AfCalendarEvent): string {
    if (event.kind === 'all-day') return this.labels().allDay;
    return afCalendarDurationLabel(
      afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start),
    );
  }

  /** `null` para `normal`: un estado sin novedad no merece una etiqueta. */
  protected stateLabel(event: AfCalendarEvent): string | null {
    const state = event.state ?? 'normal';
    return state === 'normal' ? null : this.labels().stateLabels[state];
  }

  /**
   * Nombre accesible completo del bloque.
   *
   * Incluye hora y estado porque en la grilla ambos se comunican con posición y
   * trama, que un lector de pantalla no percibe.
   */
  protected eventAriaLabel(event: AfCalendarEvent): string {
    const labels = this.labels();
    const parts = [event.title, this.eventTimeLabel(event), afCalendarLongDate(event.date, labels)];
    if (event.subtitle) parts.push(event.subtitle);
    const state = this.stateLabel(event);
    if (state) parts.push(state);
    if (event.seriesId) parts.push('Serie recurrente');
    return parts.join(', ');
  }

  protected eventContext(event: AfCalendarEvent, compact = false) {
    return {
      $implicit: event,
      event,
      compact,
      selected: event.id === this.selectedEventId(),
      durationMinutes:
        event.kind === 'all-day'
          ? 0
          : afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start),
    };
  }

  protected dayHeaderContext(column: AfCalendarDesktopColumn) {
    return {
      $implicit: column.date,
      date: column.date,
      isToday: column.isToday,
      isWeekend: column.isWeekend,
      eventCount: column.eventCount,
    };
  }

  protected onEventActivate(event: AfCalendarEvent): void {
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      return;
    }
    this.eventActivate.emit(event);
  }

  // ── Arrastre y resize ──────────────────────────────────────────────

  /**
   * Registra qué se presionó.
   *
   * Corre en fase de destino, antes de que el gesto llegue al contenedor: el
   * handle detiene la propagación para que el bloque no lo pise con `move`.
   */
  protected onBlockPointerDown(
    event: PointerEvent,
    block: AfCalendarDesktopBlock,
    mode: AfCalendarInteractionMode,
  ): void {
    // El contenedor de drag ya vio el evento en fase de captura. Evitamos que
    // la columna lo interprete después como una creación de rango y sobrescriba
    // la intención move/resize que corresponde al bloque.
    event.stopPropagation();
    const modeEnabled =
      mode === 'move'
        ? this.moveEnabled()
        : mode === 'resize-start'
          ? this.resizeStartEnabled()
          : this.resizeEndEnabled();
    if (!block.movable || !modeEnabled) {
      this.pending = null;
      return;
    }
    event.preventDefault();
    this.pending = {
      mode,
      event: block.event,
      date: block.event.date,
      startMinutes: afCalendarToMinutes(block.event.start),
      endMinutes: afCalendarToMinutes(block.event.end),
      resourceId: block.event.resourceId,
    };
  }

  protected onColumnPointerDown(event: PointerEvent, column: AfCalendarDesktopColumn): void {
    if (!this.selectable()) {
      this.pending = null;
      return;
    }
    const minutes = this.minuteAtClientY(event.clientY);
    this.pending = {
      mode: 'create',
      event: null,
      date: column.date,
      startMinutes: minutes,
      endMinutes: minutes,
      resourceId: column.resource?.id,
    };
  }

  protected onAllDayPointerDown(event: PointerEvent, calendarEvent: AfCalendarEvent): void {
    if (!this.editable() || LOCKED_STATES.has(calendarEvent.state ?? 'normal')) {
      this.pending = null;
      return;
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const edge = 14;
    const mode: AfCalendarInteractionMode =
      event.clientX - rect.left <= edge && this.resizeStartEnabled()
        ? 'resize-start'
        : rect.right - event.clientX <= edge && this.resizeEndEnabled()
          ? 'resize-end'
          : 'move';
    if (mode === 'move' && !this.moveEnabled()) return;
    this.pending = {
      mode,
      event: calendarEvent,
      date: calendarEvent.date,
      startMinutes: 0,
      endMinutes: 24 * 60,
      resourceId: calendarEvent.resourceId,
    };
  }

  protected onAllDayKeydown(event: KeyboardEvent, calendarEvent: AfCalendarEvent): void {
    this.onBlockKeydown(event, {
      event: calendarEvent,
      movable: this.editable() && !LOCKED_STATES.has(calendarEvent.state ?? 'normal'),
    } as AfCalendarDesktopBlock);
  }

  protected onDragStart(drag: AfPointerDragEvent): void {
    if (!this.pending) return;
    const source = this.pending;
    this.columnWidthPx = this.measureColumnWidth();
    this.dragScrollStart = this.scrollSurface()?.scrollTop ?? 0;
    this.interaction.set(
      afCalendarActivateInteraction(
        afCalendarBeginInteraction({
          mode: source.mode,
          origin: this.pointerOrigin(drag.pointerType),
          eventId: source.event?.id,
          date: source.date,
          startMinutes: source.startMinutes,
          endMinutes: source.endMinutes,
          resourceId: source.resourceId,
          kind: source.event?.kind,
          endDate: source.event?.endDate,
        }),
      ),
    );
  }

  protected onDragMove(drag: AfPointerDragEvent): void {
    const state = this.interaction();
    if (!state) return;

    const sourceEvent = this.pending?.event;
    if (
      this.timedAllDayConversion() &&
      state.mode === 'move' &&
      sourceEvent &&
      this.applyLaneConversion(state, sourceEvent, drag)
    ) {
      return;
    }

    this.autoScrollAt(drag.clientY);
    const scrollDelta = (this.scrollSurface()?.scrollTop ?? 0) - this.dragScrollStart;
    const minutes = afCalendarPixelsToMinutes(drag.deltaY + scrollDelta, this.slotHeightPx());
    const steps = this.columnWidthPx > 0 ? Math.round(drag.deltaX / this.columnWidthPx) : 0;
    const target =
      state.mode === 'move'
        ? this.columnStep(state.anchorResourceId ?? state.anchorDate, steps)
        : undefined;

    this.interaction.set(
      afCalendarApplyDelta(state, { minutes, days: steps, ...target }, this.bounds(), {
        minDurationMinutes: this.minDurationMinutes(),
        maxDurationMinutes: this.maxDurationMinutes(),
      }),
    );
  }

  protected onDragEnd(): void {
    const state = this.interaction();
    const source = this.pending;
    this.pending = null;
    this.interaction.set(null);
    if (!state?.active || !source) return;

    this.suppressNextClick = true;
    this.commit(state, source.event ?? undefined);
  }

  protected onDragCancel(drag: AfPointerDragEvent): void {
    const state = this.interaction();
    this.pending = null;
    this.interaction.set(null);
    if (!state) return;
    this.suppressNextClick = true;
    this.interactionCancel.emit({
      reason: drag.cancelReason === 'pointercancel' ? 'pointer-cancel' : 'escape',
      eventId: state.eventId ?? undefined,
    });
  }

  // ── Modo mover por teclado ─────────────────────────────────────────

  /**
   * Alternativa accesible al arrastre.
   *
   * `Enter` entra en modo mover, las flechas desplazan, `Enter` confirma y
   * `Escape` cancela. Cada paso se anuncia y el foco nunca abandona el evento:
   * sin esto la release no se acepta.
   */
  protected onBlockKeydown(event: KeyboardEvent, block: AfCalendarDesktopBlock): void {
    if (!block.movable) return;

    if (event.key === 'F2') {
      event.preventDefault();
      this.interactionEditRequest.emit(block.event);
      return;
    }

    const active = this.keyboardEventId();

    if (active !== block.event.id) {
      if (!['Enter', ' ', 'm', 'M', 'r', 'R'].includes(event.key)) return;
      event.preventDefault();
      const mode: AfCalendarInteractionMode =
        event.key === 'r' || event.key === 'R'
          ? event.shiftKey
            ? 'resize-start'
            : 'resize-end'
          : 'move';
      if (
        (mode === 'move' && !this.moveEnabled()) ||
        (mode === 'resize-start' && !this.resizeStartEnabled()) ||
        (mode === 'resize-end' && !this.resizeEndEnabled())
      )
        return;
      this.keyboardEventId.set(block.event.id);
      this.interaction.set(
        afCalendarActivateInteraction(
          afCalendarBeginInteraction({
            mode,
            origin: 'keyboard',
            eventId: block.event.id,
            date: block.event.date,
            startMinutes: afCalendarToMinutes(block.event.start),
            endMinutes: afCalendarToMinutes(block.event.end),
            resourceId: block.event.resourceId,
            kind: block.event.kind,
            endDate: block.event.endDate,
          }),
        ),
      );
      this.announcement.set(`${this.labels().moveMode}. ${block.event.title}`);
      return;
    }

    const state = this.interaction();
    if (!state) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.endKeyboardMode();
      this.interactionCancel.emit({ reason: 'escape', eventId: block.event.id });
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.endKeyboardMode();
      this.commit(state, block.event);
      return;
    }

    const delta = afCalendarKeyboardDelta(event.key, event.shiftKey);
    if (!delta) return;
    event.preventDefault();

    const next = afCalendarApplyDelta(
      state,
      {
        // El teclado desplaza desde donde quedó, no desde el ancla original.
        minutes: state.startMinutes - state.anchorStartMinutes + delta.minutes,
        ...(delta.columns === 0
          ? {}
          : this.columnStep(
              this.byResource() ? (state.resourceId ?? '') : state.date,
              delta.columns,
            )),
        days: delta.columns,
      },
      this.bounds(),
      {
        minDurationMinutes: this.minDurationMinutes(),
        maxDurationMinutes: this.maxDurationMinutes(),
      },
    );
    this.interaction.set(next);
    this.announcement.set(
      afCalendarInteractionAnnouncement(block.event.title, next, this.labels()),
    );
  }

  private endKeyboardMode(): void {
    this.keyboardEventId.set(null);
    this.interaction.set(null);
  }

  // ── Emisión de intenciones ─────────────────────────────────────────

  private commit(state: AfCalendarInteractionState, event?: AfCalendarEvent): void {
    const proposed = afCalendarProposedInterval(state);
    const kind =
      state.mode === 'create'
        ? 'create'
        : event && event.kind !== state.kind
          ? state.kind === 'all-day'
            ? 'timed-to-all-day'
            : 'all-day-to-timed'
        : afCalendarIsResourceChange(event, proposed)
          ? 'reassign'
          : state.mode === 'move'
            ? 'move'
            : 'resize';

    const request = afCalendarMutationRequest({
      kind,
      requestId: this.nextRequestId(),
      timeZone: this.timeZone(),
      origin: state.origin,
      event,
      proposed,
    });

    const validation = afCalendarValidateMutation(request, this.allowMutation());
    if (!validation.allowed) {
      this.interactionCancel.emit({
        reason: 'invalid-target',
        requestId: request.requestId,
        eventId: request.eventId,
      });
      this.announcement.set(validation.message ?? 'Destino no permitido');
      return;
    }

    // Una ocurrencia de serie no se mueve sin saber el alcance: el componente
    // pregunta y espera, en vez de decidir por la aplicación.
    if (event?.seriesId && kind !== 'create') {
      this.recurrenceScopeRequest.emit({
        request,
        scopes: ['this', 'this-and-following', 'all'],
      });
      this.announcement.set('');
      return;
    }

    if (event) this.beginOptimistic(state, event, request.requestId);

    if (kind === 'create') this.rangeCreateRequest.emit(request);
    else if (kind === 'resize') this.eventResizeRequest.emit(request);
    else if (kind === 'reassign') this.resourceAssignRequest.emit(request);
    else this.eventMoveRequest.emit(request);

    if (event) {
      this.announcement.set(afCalendarInteractionAnnouncement(event.title, state, this.labels()));
    }
  }

  // ── Geometría del gesto ────────────────────────────────────────────

  /**
   * Ancho de una columna.
   *
   * Es la única medición del componente y se toma una vez al empezar el
   * arrastre: un `ResizeObserver` permanente costaría un bucle de layout en
   * cada scroll para un dato que no cambia durante el gesto.
   */
  private measureColumnWidth(): number {
    const body = this.gridBody()?.nativeElement;
    const count = this.columns().length;
    if (!body || count === 0) return 0;
    const axis = body.firstElementChild?.getBoundingClientRect().width ?? 0;
    return (body.clientWidth - axis) / count;
  }

  private applyLaneConversion(
    state: AfCalendarInteractionState,
    event: AfCalendarEvent,
    drag: AfPointerDragEvent,
  ): boolean {
    const allDay = this.allDayLane()?.nativeElement.getBoundingClientRect();
    const grid = this.gridBody()?.nativeElement.getBoundingClientRect();
    if (allDay && drag.clientY >= allDay.top && drag.clientY <= allDay.bottom) {
      const date = this.dateAtClientX(drag.clientX, allDay);
      this.interaction.set(
        afCalendarConvertInteraction(state, {
          kind: 'all-day',
          date,
          durationDays: event.kind === 'all-day' ? state.durationDays : 1,
        }),
      );
      return true;
    }
    if (
      grid &&
      drag.clientY >= grid.top &&
      drag.clientY <= grid.bottom &&
      (event.kind === 'all-day' || state.kind === 'all-day')
    ) {
      this.interaction.set(
        afCalendarConvertInteraction(state, {
          kind: 'timed',
          date: this.dateAtClientX(drag.clientX, grid),
          startMinutes: this.minuteAtClientY(drag.clientY),
          durationMinutes:
            event.kind === 'timed'
              ? afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start)
              : 60,
        }),
      );
      return true;
    }
    return false;
  }

  private dateAtClientX(clientX: number, rect: DOMRect): string {
    const columns = this.columns();
    if (columns.length === 0) return this.anchorDate();
    const axisWidth = Math.max(0, rect.width - this.columnWidthPx * columns.length);
    const index = Math.min(
      columns.length - 1,
      Math.max(0, Math.floor((clientX - rect.left - axisWidth) / Math.max(1, this.columnWidthPx))),
    );
    return columns[index].date;
  }

  private scrollSurface(): HTMLElement | null {
    return this.gridBody()?.nativeElement.parentElement ?? null;
  }

  private autoScrollAt(clientY: number): void {
    if (!this.autoScroll()) return;
    const surface = this.scrollSurface();
    if (!surface) return;
    const rect = surface.getBoundingClientRect();
    const edge = 48;
    const topRatio = Math.max(0, Math.min(1, (edge - (clientY - rect.top)) / edge));
    const bottomRatio = Math.max(0, Math.min(1, (edge - (rect.bottom - clientY)) / edge));
    const velocity = (bottomRatio * bottomRatio - topRatio * topRatio) * 18;
    if (velocity) surface.scrollTop += velocity;
  }

  private pointerOrigin(pointerType: string): 'mouse' | 'touch' | 'pen' {
    return pointerType === 'touch' || pointerType === 'pen' ? pointerType : 'mouse';
  }

  private beginOptimistic(
    state: AfCalendarInteractionState,
    event: AfCalendarEvent,
    requestId: string,
  ): void {
    this.clearOptimistic();
    this.optimistic.set({ state, event, requestId, sourceEvents: this.events() });
    this.optimisticTimer = setTimeout(
      () => this.rejectOptimistic('timeout'),
      Math.max(0, this.mutationTimeoutMs()),
    );
  }

  private rejectOptimistic(reason: 'rejected' | 'conflict' | 'timeout'): void {
    const optimistic = this.optimistic();
    if (!optimistic) return;
    this.clearOptimistic();
    this.interactionCancel.emit({
      reason,
      requestId: optimistic.requestId,
      eventId: optimistic.event.id,
    });
    this.announcement.set(
      reason === 'conflict' ? 'El evento tiene un conflicto' : 'Cambio revertido',
    );
  }

  private clearOptimistic(): void {
    if (this.optimisticTimer) clearTimeout(this.optimisticTimer);
    this.optimisticTimer = null;
    this.optimistic.set(null);
  }

  /** Resuelve explícitamente una intención sin obligar a reemplazar el array de eventos. */
  resolveMutation(decision: AfCalendarMutationDecision): void {
    const optimistic = this.optimistic();
    if (!optimistic || optimistic.requestId !== decision.requestId) return;
    if (decision.status === 'accepted' || decision.status === 'queued') {
      if (decision.status === 'accepted') this.clearOptimistic();
      this.announcement.set(decision.message ?? 'Cambio aceptado');
      return;
    }
    this.rejectOptimistic(decision.status);
    if (decision.message) this.announcement.set(decision.message);
  }

  private minuteAtClientY(clientY: number): number {
    const body = this.gridBody()?.nativeElement;
    if (!body) return this.bounds().minMinutes;
    const top = body.getBoundingClientRect().top;
    return this.bounds().minMinutes + afCalendarPixelsToMinutes(clientY - top, this.slotHeightPx());
  }

  /**
   * Columna destino tras desplazarse `steps` posiciones.
   *
   * Devuelve la clave en la forma que espera el motor: una fecha cuando el eje
   * son días, un recurso cuando son recursos. El motor no distingue.
   */
  private columnStep(fromKey: string, steps: number): { date?: string; resourceId?: string } {
    const keys = this.columns().map((column) => column.key);
    const index = keys.indexOf(fromKey);
    if (index === -1) return {};
    const target = keys[Math.min(keys.length - 1, Math.max(0, index + steps))];
    return this.byResource() ? { resourceId: target } : { date: target };
  }
}
