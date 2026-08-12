import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    output,
    PLATFORM_ID,
    signal,
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
    afCalendarVisibleRange,
    type AfCalendarDayHeaderTemplate,
    type AfCalendarDensity,
    type AfCalendarEvent,
    type AfCalendarEventTemplate,
    type AfCalendarInteractionCancel,
    type AfCalendarInteractionMode,
    type AfCalendarInteractionState,
    type AfCalendarLabels,
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

  private readonly gridBody = viewChild<ElementRef<HTMLElement>>('gridBody');

  /**
   * Minuto actual, refrescado cada 30 s solo en navegador.
   *
   * El intervalo no arranca en servidor ni en tests de render: un temporizador
   * colgado deja la suite abierta y ensucia la puerta visual.
   */
  private readonly now = signal(afCalendarNowMinutes());

  /** Vista previa optimista mientras dura el gesto. */
  private readonly interaction = signal<AfCalendarInteractionState | null>(null);

  /** Evento en modo mover por teclado. */
  private readonly keyboardEventId = signal<string | null>(null);

  protected readonly announcement = signal('');

  private pending: PendingInteraction | null = null;
  private columnWidthPx = 0;
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
    const state = this.interaction();
    if (!state?.eventId) return this.events();
    return this.events().map((event) =>
      event.id === state.eventId
        ? {
            ...event,
            date: state.date,
            start: afCalendarToHhMm(state.startMinutes),
            end: afCalendarToHhMm(state.endMinutes),
          }
        : event,
    );
  });

  protected readonly dragBubble = computed(() => {
    const state = this.interaction();
    if (!state?.active) return null;
    return {
      label:
        `${afCalendarToHhMm(state.startMinutes)} – ${afCalendarToHhMm(state.endMinutes)} · ` +
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
    if (mode !== 'move') event.stopPropagation();
    if (!block.movable) {
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

  protected onDragStart(): void {
    if (!this.pending) return;
    const source = this.pending;
    this.columnWidthPx = this.measureColumnWidth();
    this.interaction.set(
      afCalendarActivateInteraction(
        afCalendarBeginInteraction({
          mode: source.mode,
          origin: 'mouse',
          eventId: source.event?.id,
          date: source.date,
          startMinutes: source.startMinutes,
          endMinutes: source.endMinutes,
          resourceId: source.resourceId,
        }),
      ),
    );
  }

  protected onDragMove(drag: AfPointerDragEvent): void {
    const state = this.interaction();
    if (!state) return;

    const minutes = afCalendarPixelsToMinutes(drag.deltaY, this.slotHeightPx());
    const steps = this.columnWidthPx > 0 ? Math.round(drag.deltaX / this.columnWidthPx) : 0;
    const target =
      state.mode === 'move'
        ? this.columnStep(state.anchorResourceId ?? state.anchorDate, steps)
        : undefined;

    this.interaction.set(afCalendarApplyDelta(state, { minutes, ...target }, this.bounds()));
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

  protected onDragCancel(): void {
    const state = this.interaction();
    this.pending = null;
    this.interaction.set(null);
    if (!state) return;
    this.suppressNextClick = true;
    this.interactionCancel.emit({
      reason: 'escape',
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

    const active = this.keyboardEventId();

    if (active !== block.event.id) {
      if (event.key !== 'Enter' && event.key !== 'm' && event.key !== 'M') return;
      event.preventDefault();
      this.keyboardEventId.set(block.event.id);
      this.interaction.set(
        afCalendarActivateInteraction(
          afCalendarBeginInteraction({
            mode: 'move',
            origin: 'keyboard',
            eventId: block.event.id,
            date: block.event.date,
            startMinutes: afCalendarToMinutes(block.event.start),
            endMinutes: afCalendarToMinutes(block.event.end),
            resourceId: block.event.resourceId,
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
      },
      this.bounds(),
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

    if (kind === 'create') this.rangeCreateRequest.emit(request);
    else if (kind === 'resize') this.eventResizeRequest.emit(request);
    else if (kind === 'reassign') this.resourceAssignRequest.emit(request);
    else this.eventMoveRequest.emit(request);

    if (event) {
      this.announcement.set(
        afCalendarInteractionAnnouncement(event.title, state, this.labels()),
      );
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

  private minuteAtClientY(clientY: number): number {
    const body = this.gridBody()?.nativeElement;
    if (!body) return this.bounds().minMinutes;
    const top = body.getBoundingClientRect().top;
    return (
      this.bounds().minMinutes +
      afCalendarPixelsToMinutes(clientY - top, this.slotHeightPx())
    );
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
