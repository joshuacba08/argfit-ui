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
  type TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  AF_CALENDAR_DEFAULT_LABELS,
  AF_CALENDAR_REQUEST_ID,
  afCalendarActivateInteraction,
  afCalendarAddDays,
  afCalendarApplyDelta,
  afCalendarBeginInteraction,
  afCalendarConvertInteraction,
  afCalendarDayOfWeek,
  afCalendarDurationLabel,
  afCalendarEventsOn,
  afCalendarInteractionAnnouncement,
  afCalendarKeyboardDelta,
  afCalendarLayoutDay,
  afCalendarLongDate,
  afCalendarMinutesToPixels,
  afCalendarMutationRequest,
  afCalendarNowMinutes,
  afCalendarPixelsToMinutes,
  afCalendarProposedInterval,
  afCalendarSlotHeight,
  afCalendarStartOfWeek,
  afCalendarToday,
  afCalendarToHhMm,
  afCalendarToMinutes,
  afCalendarValidateMutation,
  type AfCalendarAllowMutation,
  type AfCalendarDensity,
  type AfCalendarEvent,
  type AfCalendarEventTemplate,
  type AfCalendarInteractionCancel,
  type AfCalendarInteractionMode,
  type AfCalendarInteractionState,
  type AfCalendarLabels,
  type AfCalendarMutationDecision,
  type AfCalendarMutationRequest,
  type AfCalendarRecurrenceScopeRequest,
  type AfCalendarView,
  type AfCalendarWeekday,
  type AfIconName,
} from '@argfit-ui/core';
import {
  AfIconComponent,
  AfLiveRegionComponent,
  AfPointerDragDirective,
  type AfPointerDragEvent,
} from '@argfit-ui/primitives';

const EVENT_ICON: Readonly<Record<string, AfIconName>> = {
  training: 'activity',
  match: 'trophy',
  gym: 'dumbbell',
  video: 'video',
  medical: 'stethoscope',
  neutral: 'calendar',
};

/**
 * Vistas que el móvil renderiza de verdad.
 *
 * Una semana de escritorio comprimida en 390 px no es una vista, es una vista
 * ilegible: `week`, `work-week` y `resources` se resuelven como rango de tres
 * días, y `month` como agenda. Para un mes en móvil está `AfCalendarMiniMonth`.
 */
const MOBILE_VIEWS: readonly AfCalendarView[] = ['agenda', 'day', 'three-day'];

const VIEW_FALLBACK: Readonly<Record<AfCalendarView, AfCalendarView>> = {
  day: 'day',
  'three-day': 'three-day',
  week: 'three-day',
  'work-week': 'three-day',
  resources: 'three-day',
  month: 'agenda',
  agenda: 'agenda',
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

const COMPACT_BLOCK_PX = 52;

/** Estados en los que el evento no se puede mover ni redimensionar. */
const LOCKED_STATES: ReadonlySet<string> = new Set(['readonly', 'cancelled']);

/**
 * Espera antes de armar el arrastre táctil.
 *
 * Mientras espera, el gesto sigue siendo del scroll: si el dedo se mueve, la
 * página desplaza y el arrastre se descarta. Es lo que permite que la grilla
 * conserve `touch-action: pan-y` y siga siendo scrolleable sobre los eventos.
 */
const LONG_PRESS_MS = 400;

type AfCalendarMobileState = 'ready' | 'loading' | 'empty' | 'error';

export interface AfCalendarMobileStripDay {
  readonly date: string;
  readonly weekdayLabel: string;
  readonly dayNumber: string;
  readonly ariaLabel: string;
  readonly isSelected: boolean;
  readonly isToday: boolean;
  readonly hasEvents: boolean;
}

export interface AfCalendarMobileBlock {
  readonly event: AfCalendarEvent;
  readonly topPx: number;
  readonly heightPx: number;
  readonly leftPercent: number;
  readonly widthPercent: number;
  readonly compact: boolean;
  readonly ariaLabel: string;
  readonly icon: AfIconName;
  readonly movable: boolean;
  readonly dragging: boolean;
  readonly keyboardActive: boolean;
}

export interface AfCalendarMobileColumn {
  readonly date: string;
  readonly weekdayLabel: string;
  readonly dayNumber: string;
  readonly ariaLabel: string;
  readonly isToday: boolean;
  readonly allDay: readonly AfCalendarEvent[];
  readonly blocks: readonly AfCalendarMobileBlock[];
  readonly nowOffsetPx: number | null;
}

export interface AfCalendarMobileAgendaItem {
  readonly event: AfCalendarEvent;
  readonly timeLabel: string;
  readonly endLabel: string | null;
  readonly durationLabel: string;
  readonly stateLabel: string | null;
  readonly ariaLabel: string;
  readonly icon: AfIconName;
}

interface OptimisticInteraction {
  readonly state: AfCalendarInteractionState;
  readonly event: AfCalendarEvent;
  readonly requestId: string;
  readonly sourceEvents: readonly AfCalendarEvent[];
}

/**
 * Renderer móvil de `AfCalendar`.
 *
 * Strip de días, agenda del día y grilla táctil. Sin Ionic: Ionic no tiene
 * scheduler y su DOM sería una capa más entre el token y el píxel.
 */
@Component({
  selector: 'af-calendar-mobile',
  imports: [AfIconComponent, AfLiveRegionComponent, AfPointerDragDirective, NgTemplateOutlet],
  templateUrl: './af-calendar-mobile.component.html',
  styleUrl: './af-calendar-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-calendar-mobile',
    '[attr.data-view]': 'resolvedView()',
    '[attr.data-density]': 'resolvedDensity',
    '[attr.data-state]': 'state()',
    '[attr.data-editable]': 'editable() ? "" : null',
    '[style.--af-calendar-slot]': 'slotHeightPx + "px"',
    '[style.height]': 'height()',
  },
})
export class AfCalendarMobileComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly nextRequestId = inject(AF_CALENDAR_REQUEST_ID);

  protected readonly longPressMs = LONG_PRESS_MS;

  readonly events = input<readonly AfCalendarEvent[]>([]);
  readonly view = input<AfCalendarView>('agenda');
  readonly views = input<readonly AfCalendarView[]>(['day', 'week', 'month', 'agenda']);
  readonly anchorDate = input<string>(afCalendarToday());
  readonly timeZone = input.required<string>();
  readonly density = input<AfCalendarDensity>('touch');
  readonly firstDay = input<AfCalendarWeekday>(1);
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
  readonly createButton = input(false, { transform: booleanAttribute });
  readonly selectedEventId = input<string | undefined>(undefined);
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly height = input('640px');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly partial = input(false, { transform: booleanAttribute });
  readonly offline = input(false, { transform: booleanAttribute });
  readonly empty = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly ariaLabel = input('Calendario');

  readonly eventTemplate = input<AfCalendarEventTemplate | undefined>(undefined);
  readonly toolbarTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly emptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly errorTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly footerTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly overlayTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly viewChange = output<AfCalendarView>();
  readonly dateSelect = output<string>();
  readonly todayPressed = output<void>();
  readonly eventActivate = output<AfCalendarEvent>();
  readonly createPressed = output<void>();
  readonly retry = output<void>();

  readonly eventMoveRequest = output<AfCalendarMutationRequest>();
  readonly eventResizeRequest = output<AfCalendarMutationRequest>();
  readonly recurrenceScopeRequest = output<AfCalendarRecurrenceScopeRequest>();
  readonly interactionCancel = output<AfCalendarInteractionCancel>();
  readonly interactionEditRequest = output<AfCalendarEvent>();

  private readonly grid = viewChild<ElementRef<HTMLElement>>('grid');
  private readonly allDayLane = viewChild<ElementRef<HTMLElement>>('allDayLane');

  private readonly now = signal(afCalendarNowMinutes());

  /** Vista previa optimista mientras dura el gesto. */
  private readonly interaction = signal<AfCalendarInteractionState | null>(null);
  private readonly optimistic = signal<OptimisticInteraction | null>(null);
  private readonly keyboardEventId = signal<string | null>(null);
  protected readonly announcement = signal('');

  private pending: { mode: AfCalendarInteractionMode; event: AfCalendarEvent } | null = null;
  private columnWidthPx = 0;
  private dragScrollStart = 0;
  private optimisticTimer: ReturnType<typeof setTimeout> | null = null;
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

  protected readonly resolvedView = computed(() => VIEW_FALLBACK[this.view()]);

  /**
   * El móvil siempre renderiza en densidad `touch`.
   *
   * `density` se acepta para que la fachada pueda pasar su valor sin ramificar,
   * pero se ignora a propósito: 24 o 32 px de slot dejan los bloques por debajo
   * del target táctil mínimo de 44 px.
   */
  protected readonly resolvedDensity: AfCalendarDensity = 'touch';

  protected readonly slotHeightPx = afCalendarSlotHeight(this.resolvedDensity);

  protected readonly state = computed<AfCalendarMobileState>(() => {
    if (this.error()) return 'error';
    if (this.loading()) return 'loading';
    return this.empty() || this.events().length === 0 ? 'empty' : 'ready';
  });

  protected readonly monthTitle = computed(() => {
    const date = this.anchorDate();
    return `${this.labels().months[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`;
  });

  protected readonly viewOptions = computed(() => {
    const requested = new Set(this.views().map((view) => VIEW_FALLBACK[view]));
    return MOBILE_VIEWS.filter((view) => requested.has(view)).map((view) => ({
      view,
      label: this.labels().viewLabels[view],
      icon: VIEW_ICON[view],
    }));
  });

  protected readonly stripDays = computed<readonly AfCalendarMobileStripDay[]>(() => {
    const labels = this.labels();
    const selected = this.anchorDate();
    const today = afCalendarToday();
    const start = afCalendarStartOfWeek(selected, this.firstDay());

    return Array.from({ length: 7 }, (_, index) => {
      const date = afCalendarAddDays(start, index);
      return {
        date,
        weekdayLabel: labels.weekdaysShort[afCalendarDayOfWeek(date)],
        dayNumber: String(Number(date.slice(8, 10))),
        ariaLabel: afCalendarLongDate(date, labels),
        isSelected: date === selected,
        isToday: date === today,
        hasEvents: afCalendarEventsOn(this.events(), date).length > 0,
      };
    });
  });

  protected readonly bounds = computed(() => ({
    minMinutes: afCalendarToMinutes(this.minTime()),
    maxMinutes: afCalendarToMinutes(this.maxTime()),
  }));

  protected readonly hours = computed(() => {
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
      this.slotHeightPx,
    ),
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

  protected readonly columns = computed<readonly AfCalendarMobileColumn[]>(() => {
    const labels = this.labels();
    const bounds = this.bounds();
    const slot = this.slotHeightPx;
    const today = afCalendarToday();
    const nowMinutes = this.now();
    const state = this.interaction();
    const keyboardId = this.keyboardEventId();
    const events = this.previewedEvents();
    const span = this.resolvedView() === 'day' ? 1 : 3;

    return Array.from({ length: span }, (_, index) => {
      const date = afCalendarAddDays(this.anchorDate(), index);
      const isToday = date === today;
      const showNow =
        this.nowIndicator() &&
        isToday &&
        nowMinutes >= bounds.minMinutes &&
        nowMinutes <= bounds.maxMinutes;

      return {
        date,
        weekdayLabel: labels.weekdaysShort[afCalendarDayOfWeek(date)],
        dayNumber: String(Number(date.slice(8, 10))),
        ariaLabel: afCalendarLongDate(date, labels),
        isToday,
        allDay: afCalendarEventsOn(events, date).filter((event) => event.kind === 'all-day'),
        blocks: afCalendarLayoutDay(afCalendarEventsOn(events, date), bounds).map((laid) => {
          const heightPx = afCalendarMinutesToPixels(laid.durationMinutes, slot);
          return {
            event: laid.event,
            topPx: afCalendarMinutesToPixels(laid.topMinutes - bounds.minMinutes, slot),
            heightPx: Math.max(heightPx, 24),
            leftPercent: (laid.column / laid.columns) * 100,
            widthPercent: 100 / laid.columns,
            compact: heightPx < COMPACT_BLOCK_PX,
            ariaLabel: this.eventAriaLabel(laid.event),
            icon: this.eventIcon(laid.event),
            movable: this.editable() && !LOCKED_STATES.has(laid.event.state ?? 'normal'),
            dragging: state?.eventId === laid.event.id && state.active,
            keyboardActive: keyboardId === laid.event.id,
          };
        }),
        nowOffsetPx: showNow
          ? afCalendarMinutesToPixels(nowMinutes - bounds.minMinutes, slot)
          : null,
      };
    });
  });

  protected readonly nowLabel = computed(() => afCalendarToHhMm(this.now()));

  protected readonly agendaItems = computed<readonly AfCalendarMobileAgendaItem[]>(() =>
    [...afCalendarEventsOn(this.events(), this.anchorDate())]
      .sort((a, b) => afCalendarToMinutes(a.start) - afCalendarToMinutes(b.start))
      .map((event) => ({
        event,
        timeLabel: event.kind === 'all-day' ? this.labels().allDay : event.start,
        endLabel: event.kind === 'all-day' ? null : event.end,
        durationLabel: this.eventDurationLabel(event),
        stateLabel: this.stateLabel(event),
        ariaLabel: this.eventAriaLabel(event),
        icon: this.eventIcon(event),
      })),
  );

  protected readonly agendaDateLabel = computed(() =>
    afCalendarLongDate(this.anchorDate(), this.labels()),
  );

  protected readonly skeletonRows = computed(() => [0, 1, 2, 3]);

  protected eventIcon(event: AfCalendarEvent): AfIconName {
    return EVENT_ICON[event.colorToken] ?? 'calendar';
  }

  protected stateLabel(event: AfCalendarEvent): string | null {
    const state = event.state ?? 'normal';
    return state === 'normal' ? null : this.labels().stateLabels[state];
  }

  protected eventDurationLabel(event: AfCalendarEvent): string {
    if (event.kind === 'all-day') return this.labels().allDay;
    return afCalendarDurationLabel(
      afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start),
    );
  }

  protected eventAriaLabel(event: AfCalendarEvent): string {
    const labels = this.labels();
    const time = event.kind === 'all-day' ? labels.allDay : `${event.start} – ${event.end}`;
    const parts = [event.title, time, afCalendarLongDate(event.date, labels)];
    if (event.subtitle) parts.push(event.subtitle);
    const state = this.stateLabel(event);
    if (state) parts.push(state);
    return parts.join(', ');
  }

  protected eventContext(event: AfCalendarEvent, compact = false) {
    return {
      $implicit: event,
      event,
      compact,
      selected: false,
      durationMinutes:
        event.kind === 'all-day'
          ? 0
          : afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start),
    };
  }

  protected onEventActivate(event: AfCalendarEvent): void {
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      return;
    }
    this.eventActivate.emit(event);
  }

  // ── Arrastre y resize táctiles ─────────────────────────────────────

  protected onBlockPointerDown(
    event: PointerEvent,
    block: AfCalendarMobileBlock,
    mode: AfCalendarInteractionMode,
  ): void {
    // La directiva compartida arma la sesión en captura. Detener aquí evita
    // que la superficie convierta el gesto del evento en una selección.
    event.stopPropagation();
    const enabled =
      mode === 'move'
        ? this.moveEnabled()
        : mode === 'resize-start'
          ? this.resizeStartEnabled()
          : this.resizeEndEnabled();
    this.pending = block.movable && enabled ? { mode, event: block.event } : null;
  }

  protected onAllDayPointerDown(event: PointerEvent, calendarEvent: AfCalendarEvent): void {
    event.stopPropagation();
    if (!this.editable() || LOCKED_STATES.has(calendarEvent.state ?? 'normal')) {
      this.pending = null;
      return;
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const edge = 18;
    const mode: AfCalendarInteractionMode =
      event.clientX - rect.left <= edge && this.resizeStartEnabled()
        ? 'resize-start'
        : rect.right - event.clientX <= edge && this.resizeEndEnabled()
          ? 'resize-end'
          : 'move';
    if (mode === 'move' && !this.moveEnabled()) return;
    this.pending = { mode, event: calendarEvent };
  }

  protected onAllDayKeydown(event: KeyboardEvent, calendarEvent: AfCalendarEvent): void {
    this.onBlockKeydown(event, {
      event: calendarEvent,
      movable: this.editable() && !LOCKED_STATES.has(calendarEvent.state ?? 'normal'),
    } as AfCalendarMobileBlock);
  }

  protected onDragStart(drag: AfPointerDragEvent): void {
    const source = this.pending;
    if (!source) return;
    this.columnWidthPx = this.measureColumnWidth();
    this.dragScrollStart = this.scrollSurface()?.scrollTop ?? 0;
    this.interaction.set(
      afCalendarActivateInteraction(
        afCalendarBeginInteraction({
          mode: source.mode,
          origin: this.pointerOrigin(drag.pointerType),
          eventId: source.event.id,
          date: source.event.date,
          startMinutes: afCalendarToMinutes(source.event.start),
          endMinutes: afCalendarToMinutes(source.event.end),
          resourceId: source.event.resourceId,
          kind: source.event.kind,
          endDate: source.event.endDate,
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
    const minutes = afCalendarPixelsToMinutes(drag.deltaY + scrollDelta, this.slotHeightPx);
    const date =
      state.mode === 'move' ? this.columnAfter(state.anchorDate, drag.deltaX) : undefined;
    this.interaction.set(
      afCalendarApplyDelta(state, { minutes, date }, this.bounds(), {
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
    this.commit(state, source.event);
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

  /** Camino sin arrastre, también en móvil: hay teclados bluetooth y lectores. */
  protected onBlockKeydown(event: KeyboardEvent, block: AfCalendarMobileBlock): void {
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
        minutes: state.startMinutes - state.anchorStartMinutes + delta.minutes,
        date: delta.columns === 0 ? state.date : this.columnStep(state.date, delta.columns),
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

  private commit(state: AfCalendarInteractionState, event: AfCalendarEvent): void {
    const proposed = afCalendarProposedInterval(state);
    const kind =
      event.kind !== state.kind
        ? state.kind === 'all-day'
          ? 'timed-to-all-day'
          : 'all-day-to-timed'
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

    if (event.seriesId) {
      this.recurrenceScopeRequest.emit({
        request,
        scopes: ['this', 'this-and-following', 'all'],
      });
      return;
    }

    this.beginOptimistic(state, event, request.requestId);

    if (kind === 'resize') this.eventResizeRequest.emit(request);
    else this.eventMoveRequest.emit(request);

    this.announcement.set(afCalendarInteractionAnnouncement(event.title, state, this.labels()));
  }

  private measureColumnWidth(): number {
    const body = this.grid()?.nativeElement;
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
    const grid = this.grid()?.nativeElement.getBoundingClientRect();
    if (allDay && drag.clientY >= allDay.top && drag.clientY <= allDay.bottom) {
      this.interaction.set(
        afCalendarConvertInteraction(state, {
          kind: 'all-day',
          date: this.dateAtClientX(drag.clientX, allDay),
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

  private minuteAtClientY(clientY: number): number {
    const grid = this.grid()?.nativeElement;
    if (!grid) return this.bounds().minMinutes;
    return (
      this.bounds().minMinutes +
      afCalendarPixelsToMinutes(clientY - grid.getBoundingClientRect().top, this.slotHeightPx)
    );
  }

  private scrollSurface(): HTMLElement | null {
    return this.grid()?.nativeElement.parentElement ?? null;
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

  private columnAfter(fromDate: string, deltaX: number): string {
    if (this.columnWidthPx <= 0) return fromDate;
    return this.columnStep(fromDate, Math.round(deltaX / this.columnWidthPx));
  }

  private columnStep(fromDate: string, steps: number): string {
    const dates = this.columns().map((column) => column.date);
    const index = dates.indexOf(fromDate);
    if (index === -1) return fromDate;
    return dates[Math.min(dates.length - 1, Math.max(0, index + steps))];
  }
}
