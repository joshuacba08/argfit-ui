import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    effect,
    inject,
    input,
    linkedSignal,
    output,
    signal,
    untracked,
    viewChild,
    type TemplateRef,
} from '@angular/core';

import {
    AF_CALENDAR_DEFAULT_LABELS,
    afCalendarNavigate,
    afCalendarToday,
    afCalendarVisibleRange,
    AfPlatformService,
    afCalendarToHhMm,
    afCalendarToMinutes,
    type AfCalendarDensity,
    type AfCalendarEvent,
    type AfCalendarEventDeleteIntent,
    type AfCalendarEventDraft,
    type AfCalendarEventSaveIntent,
    type AfCalendarEventTypeDefinition,
    type AfCalendarInteractionCancel,
    type AfCalendarLabels,
    type AfCalendarMutationRequest,
    type AfCalendarRecurrenceScope,
    type AfCalendarRecurrenceScopeRequest,
    type AfCalendarResource,
    type AfCalendarView,
    type AfCalendarVisibleRange,
    type AfCalendarWeekday,
} from '@argfit-ui/core';
import { AfCalendarDesktopComponent } from '@argfit-ui/desktop';
import { AfCalendarMobileComponent } from '@argfit-ui/mobile';
import { AfEscapeKeyDirective, AfFocusTrapDirective } from '@argfit-ui/primitives';

import { AfCalendarEventDetailComponent } from '../calendar-event-detail/af-calendar-event-detail.component';
import { AfCalendarEventEditorComponent } from '../calendar-event-editor/af-calendar-event-editor.component';

import {
    AfCalendarDayHeaderDirective,
    AfCalendarEventDirective,
} from './af-calendar-event.directive';
import {
    AfCalendarEmptyDirective,
    AfCalendarErrorDirective,
    AfCalendarFooterDirective,
    AfCalendarToolbarDirective,
} from './af-calendar-slots.directive';

/**
 * Calendario adaptativo de ArgFit UI.
 *
 * Recibe las ocurrencias visibles y emite intenciones tipadas: no hace HTTP, no
 * persiste, no expande series y no convierte zonas horarias. La aplicación es
 * la fuente de verdad; el componente decide cómo se ve, no qué pasa.
 *
 * La vista y la fecha ancla son estado de trabajo: arrancan del input y se
 * mueven con la toolbar, pero cada movimiento se anuncia con `viewChange`,
 * `anchorDateChange` y `visibleRangeChange` para que el consumidor recargue su
 * ventana de datos.
 */
@Component({
  selector: 'af-calendar',
  imports: [
    AfCalendarDesktopComponent,
    AfCalendarEventDetailComponent,
    AfCalendarEventEditorComponent,
    AfCalendarMobileComponent,
    AfEscapeKeyDirective,
    AfFocusTrapDirective,
  ],
  templateUrl: './af-calendar.component.html',
  styleUrl: './af-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'af-calendar',
    '[attr.data-platform]': 'isMobile() ? "mobile" : "desktop"',
  },
})
export class AfCalendarComponent {
  private readonly platform = inject(AfPlatformService);

  readonly events = input<readonly AfCalendarEvent[]>([]);
  readonly view = input<AfCalendarView>('week');
  readonly views = input<readonly AfCalendarView[]>(['day', 'week', 'month', 'agenda']);
  /** `YYYY-MM-DD`. Sin valor, hoy en la zona del dispositivo. */
  readonly anchorDate = input<string | undefined>(undefined);
  /**
   * Zona IANA de la organización. Obligatoria: inferirla del navegador es la
   * forma más rápida de mostrarle a un cuerpo técnico un entrenamiento a la
   * hora equivocada.
   */
  readonly timeZone = input.required<string>();
  readonly density = input<AfCalendarDensity>('comfortable');
  readonly firstDay = input<AfCalendarWeekday>(1);
  readonly hiddenDays = input<readonly AfCalendarWeekday[]>([]);
  readonly minTime = input('07:00');
  readonly maxTime = input('22:00');
  readonly nowIndicator = input(true, { transform: booleanAttribute });
  readonly showToolbar = input(true, { transform: booleanAttribute });
  /** Habilita mover y redimensionar. La creación se habilita con `selectable`. */
  readonly editable = input(false, { transform: booleanAttribute });
  /** Habilita dibujar un rango sobre una franja vacía para crear. */
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly createButton = input(false, { transform: booleanAttribute });
  /**
   * Hospeda el detalle y el editor en un modal propio.
   *
   * Con `false` el calendario solo emite `eventActivate` y `createPressed`, y
   * la aplicación decide dónde y cómo presentarlos — en un drawer, en una ruta
   * completa o en su propio diálogo.
   */
  readonly overlays = input(true, { transform: booleanAttribute });
  readonly eventTypes = input<readonly AfCalendarEventTypeDefinition[] | undefined>(undefined);
  readonly resources = input<readonly AfCalendarResource[]>([]);
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly height = input('640px');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly partial = input(false, { transform: booleanAttribute });
  readonly offline = input(false, { transform: booleanAttribute });
  readonly empty = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly ariaLabel = input('Calendario');

  readonly visibleRangeChange = output<AfCalendarVisibleRange>();
  readonly viewChange = output<AfCalendarView>();
  readonly anchorDateChange = output<string>();
  readonly eventActivate = output<AfCalendarEvent>();
  readonly retry = output<void>();

  /** Emitida en `pointerup`, nunca en `pointerdown`. */
  readonly eventMoveRequest = output<AfCalendarMutationRequest>();
  readonly eventResizeRequest = output<AfCalendarMutationRequest>();
  readonly rangeCreateRequest = output<AfCalendarMutationRequest>();
  readonly resourceAssignRequest = output<AfCalendarMutationRequest>();
  /** El alcance de una serie lo decide la aplicación, no el componente. */
  readonly recurrenceScopeRequest = output<AfCalendarRecurrenceScopeRequest>();
  readonly interactionCancel = output<AfCalendarInteractionCancel>();
  readonly createPressed = output<void>();
  readonly eventSave = output<AfCalendarEventSaveIntent>();
  readonly eventDelete = output<AfCalendarEventDeleteIntent>();

  protected readonly isMobile = this.platform.isMobile;

  protected readonly activeView = linkedSignal(() => this.view());
  protected readonly activeAnchor = linkedSignal(() => this.anchorDate() ?? afCalendarToday());

  private readonly eventSlot = contentChild(AfCalendarEventDirective);
  private readonly dayHeaderSlot = contentChild(AfCalendarDayHeaderDirective);
  private readonly toolbarSlot = contentChild(AfCalendarToolbarDirective);
  private readonly emptySlot = contentChild(AfCalendarEmptyDirective);
  private readonly errorSlot = contentChild(AfCalendarErrorDirective);
  private readonly footerSlot = contentChild(AfCalendarFooterDirective);

  private readonly calendarToolbar = viewChild<TemplateRef<unknown>>('calendarToolbar');
  private readonly calendarEmpty = viewChild<TemplateRef<unknown>>('calendarEmpty');
  private readonly calendarError = viewChild<TemplateRef<unknown>>('calendarError');
  private readonly calendarFooter = viewChild<TemplateRef<unknown>>('calendarFooter');

  protected readonly projectedEventTemplate = computed(() => this.eventSlot()?.templateRef);
  protected readonly projectedDayHeaderTemplate = computed(() => this.dayHeaderSlot()?.templateRef);
  protected readonly projectedToolbarTemplate = computed(() =>
    this.toolbarSlot() ? this.calendarToolbar() : undefined,
  );
  protected readonly projectedEmptyTemplate = computed(() =>
    this.emptySlot() ? this.calendarEmpty() : undefined,
  );
  protected readonly projectedErrorTemplate = computed(() =>
    this.errorSlot() ? this.calendarError() : undefined,
  );
  protected readonly projectedFooterTemplate = computed(() =>
    this.footerSlot() ? this.calendarFooter() : undefined,
  );

  /** Ventana visible actual. Pública para que el consumidor la lea sin esperar el output. */
  readonly currentRange = computed<AfCalendarVisibleRange>(() =>
    afCalendarVisibleRange(this.activeView(), this.activeAnchor(), {
      firstDay: this.firstDay(),
      hiddenDays: this.hiddenDays(),
      labels: this.labels(),
      timeZone: this.timeZone(),
    }),
  );

  private lastEmittedRange = '';

  constructor() {
    // El rango se anuncia también en el primer render: sin eso el consumidor no
    // sabe qué ventana pedir hasta que el usuario navegue.
    effect(() => {
      const range = this.currentRange();
      const key = `${range.view}|${range.start}|${range.end}|${range.timeZone}`;
      if (untracked(() => this.lastEmittedRange) === key) return;
      this.lastEmittedRange = key;
      this.visibleRangeChange.emit(range);
    });
  }

  // ── Detalle y editor ───────────────────────────────────────────────

  /** Ocurrencia abierta en el modal de detalle. */
  protected readonly detailEvent = signal<AfCalendarEvent | null>(null);

  /** Borrador abierto en el modal de editor. */
  protected readonly editorDraft = signal<AfCalendarEventDraft | null>(null);
  protected readonly editorMode = signal<'create' | 'edit'>('create');
  private readonly editorEvent = signal<AfCalendarEvent | null>(null);

  protected readonly selectedEventId = computed(
    () => this.detailEvent()?.id ?? this.editorEvent()?.id,
  );

  protected readonly editorScopes = computed<readonly AfCalendarRecurrenceScope[]>(() =>
    this.editorEvent()?.seriesId ? (['this', 'this-and-following', 'all'] as const) : [],
  );

  protected onEventActivate(event: AfCalendarEvent): void {
    this.eventActivate.emit(event);
    if (this.overlays()) this.detailEvent.set(event);
  }

  protected onCreatePressed(): void {
    this.createPressed.emit();
    if (!this.overlays()) return;
    this.openEditor(null, {
      date: this.activeAnchor(),
      start: '09:00',
      end: '10:00',
    });
  }

  /**
   * Una selección de rango confirmada abre el editor con la franja ya cargada.
   *
   * La intención se emite igual: la aplicación puede crear el evento sin pasar
   * por el editor si su producto no lo necesita.
   */
  protected onRangeCreateRequest(request: AfCalendarMutationRequest): void {
    this.rangeCreateRequest.emit(request);
    if (!this.overlays()) return;
    const [date, start] = request.proposedInterval.start.split('T');
    const end = request.proposedInterval.end.split('T')[1];
    this.openEditor(null, { date, start, end });
  }

  protected onDetailEdit(event: AfCalendarEvent): void {
    this.openEditor(event, {
      date: event.date,
      start: event.start,
      end: event.end,
    });
  }

  protected onEditorSave(intent: AfCalendarEventSaveIntent): void {
    this.eventSave.emit(intent);
    this.closeOverlays();
  }

  protected onEventDelete(intent: AfCalendarEventDeleteIntent): void {
    this.eventDelete.emit(intent);
    this.closeOverlays();
  }

  protected closeOverlays(): void {
    this.detailEvent.set(null);
    this.editorDraft.set(null);
    this.editorEvent.set(null);
  }

  private openEditor(
    event: AfCalendarEvent | null,
    slot: { date: string; start: string; end: string },
  ): void {
    const types = this.eventTypes();
    this.detailEvent.set(null);
    this.editorEvent.set(event);
    this.editorMode.set(event ? 'edit' : 'create');
    this.editorDraft.set({
      typeId: event?.type ?? types?.[0]?.id ?? '',
      title: event?.title ?? '',
      date: slot.date,
      start: slot.start,
      end: this.normalisedEnd(slot.start, slot.end),
      kind: event?.kind ?? 'timed',
      resourceId: event?.resourceId,
      values: (event?.meta ?? {}) as AfCalendarEventDraft['values'],
    });
  }

  /** Protege al editor de un rango invertido llegado desde la selección. */
  private normalisedEnd(start: string, end: string): string {
    const from = afCalendarToMinutes(start);
    const to = afCalendarToMinutes(end);
    return to > from ? end : afCalendarToHhMm(from + 30);
  }

  protected onViewChange(view: AfCalendarView): void {
    if (view === this.activeView()) return;
    this.activeView.set(view);
    this.viewChange.emit(view);
  }

  protected onNavigate(direction: -1 | 1): void {
    const next = afCalendarNavigate(this.activeView(), this.activeAnchor(), direction, {
      firstDay: this.firstDay(),
      hiddenDays: this.hiddenDays(),
      labels: this.labels(),
      timeZone: this.timeZone(),
    });
    this.setAnchor(next);
  }

  protected onToday(): void {
    this.setAnchor(afCalendarToday());
  }

  protected onDateSelect(date: string): void {
    this.setAnchor(date);
  }

  private setAnchor(date: string): void {
    if (date === this.activeAnchor()) return;
    this.activeAnchor.set(date);
    this.anchorDateChange.emit(date);
  }
}
