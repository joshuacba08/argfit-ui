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
    type AfCalendarDensity,
    type AfCalendarEvent,
    type AfCalendarEventTemplate,
    type AfCalendarInteractionCancel,
    type AfCalendarInteractionMode,
    type AfCalendarInteractionState,
    type AfCalendarLabels,
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
const LONG_PRESS_MS = 350;

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

  private readonly grid = viewChild<ElementRef<HTMLElement>>('grid');

  private readonly now = signal(afCalendarNowMinutes());

  /** Vista previa optimista mientras dura el gesto. */
  private readonly interaction = signal<AfCalendarInteractionState | null>(null);
  private readonly keyboardEventId = signal<string | null>(null);
  protected readonly announcement = signal('');

  private pending: { mode: AfCalendarInteractionMode; event: AfCalendarEvent } | null = null;
  private columnWidthPx = 0;
  private suppressNextClick = false;

  constructor() {
    if (this.isBrowser) {
      const handle = setInterval(() => this.now.set(afCalendarNowMinutes()), 30_000);
      this.destroyRef.onDestroy(() => clearInterval(handle));
    }
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
    if (mode !== 'move') event.stopPropagation();
    this.pending = block.movable ? { mode, event: block.event } : null;
  }

  protected onDragStart(): void {
    const source = this.pending;
    if (!source) return;
    this.columnWidthPx = this.measureColumnWidth();
    this.interaction.set(
      afCalendarActivateInteraction(
        afCalendarBeginInteraction({
          mode: source.mode,
          origin: 'touch',
          eventId: source.event.id,
          date: source.event.date,
          startMinutes: afCalendarToMinutes(source.event.start),
          endMinutes: afCalendarToMinutes(source.event.end),
          resourceId: source.event.resourceId,
        }),
      ),
    );
  }

  protected onDragMove(drag: AfPointerDragEvent): void {
    const state = this.interaction();
    if (!state) return;
    const minutes = afCalendarPixelsToMinutes(drag.deltaY, this.slotHeightPx);
    const date = state.mode === 'move' ? this.columnAfter(state.anchorDate, drag.deltaX) : undefined;
    this.interaction.set(afCalendarApplyDelta(state, { minutes, date }, this.bounds()));
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

  protected onDragCancel(): void {
    const state = this.interaction();
    this.pending = null;
    this.interaction.set(null);
    if (!state) return;
    this.suppressNextClick = true;
    this.interactionCancel.emit({ reason: 'escape', eventId: state.eventId ?? undefined });
  }

  /** Camino sin arrastre, también en móvil: hay teclados bluetooth y lectores. */
  protected onBlockKeydown(event: KeyboardEvent, block: AfCalendarMobileBlock): void {
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
        minutes: state.startMinutes - state.anchorStartMinutes + delta.minutes,
        date: delta.columns === 0 ? state.date : this.columnStep(state.date, delta.columns),
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

  private commit(state: AfCalendarInteractionState, event: AfCalendarEvent): void {
    const proposed = afCalendarProposedInterval(state);
    const kind = state.mode === 'move' ? 'move' : 'resize';
    const request = afCalendarMutationRequest({
      kind,
      requestId: this.nextRequestId(),
      timeZone: this.timeZone(),
      origin: state.origin,
      event,
      proposed,
    });

    if (event.seriesId) {
      this.recurrenceScopeRequest.emit({
        request,
        scopes: ['this', 'this-and-following', 'all'],
      });
      return;
    }

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
