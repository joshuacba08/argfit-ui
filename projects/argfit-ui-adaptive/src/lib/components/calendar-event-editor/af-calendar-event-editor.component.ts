import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    linkedSignal,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';

import {
    AF_CALENDAR_DEFAULT_LABELS,
    AF_CALENDAR_EVENT_TYPES,
    afCalendarDurationLabel,
    afCalendarLongDate,
    afCalendarToday,
    afCalendarToHhMm,
    afCalendarToMinutes,
    AfPlatformService,
    type AfCalendarEventDeleteIntent,
    type AfCalendarEventDraft,
    type AfCalendarEventSaveIntent,
    type AfCalendarEventTypeDefinition,
    type AfCalendarFieldDef,
    type AfCalendarFieldValue,
    type AfCalendarLabels,
    type AfCalendarRecurrenceScope,
    type AfCalendarResource,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

/** Duraciones ofrecidas en el selector, en minutos. */
const DURATIONS = [15, 30, 45, 60, 90, 120, 150, 180, 240, 480];

/** Horas ofrecidas en el selector: de 06:00 a 21:00 cada 15 minutos. */
const START_TIMES = Array.from({ length: 61 }, (_, index) => afCalendarToHhMm(360 + index * 15));

const SCOPE_LABELS: Readonly<Record<AfCalendarRecurrenceScope, string>> = {
  this: 'Solo esta ocurrencia',
  'this-and-following': 'Esta y las siguientes',
  all: 'Toda la serie',
};

/**
 * Editor genérico de eventos de calendario.
 *
 * Un único editor sirve a cualquier tipo: al elegir el tipo, el formulario se
 * recompone con sus campos, su duración por defecto y su color. Lo que hace
 * genérico al componente es que no conoce ningún dominio — recibe el esquema y
 * lo renderiza.
 *
 * **No valida reglas de negocio.** Emite el evento propuesto y el consumidor
 * decide: solapamientos, permisos, capacidad y disponibilidad son del producto.
 *
 * Igual que el detalle, es una superficie plana sin renderers separados: entre
 * plataformas cambian densidad y ancho de campo, no la estructura.
 */
@Component({
  selector: 'af-calendar-event-editor',
  imports: [AfIconComponent],
  templateUrl: './af-calendar-event-editor.component.html',
  styleUrl: './af-calendar-event-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-calendar-event-editor',
    '[attr.data-platform]': 'isMobile() ? "mobile" : "desktop"',
    '[attr.data-color]': 'activeType()?.colorToken ?? "neutral"',
    '[attr.data-busy]': 'busy() ? "" : null',
  },
})
export class AfCalendarEventEditorComponent {
  private readonly platform = inject(AfPlatformService);
  private readonly providedTypes = inject(AF_CALENDAR_EVENT_TYPES);

  /** Borrador inicial. `null` arranca un evento nuevo con los valores por defecto. */
  readonly draft = input<AfCalendarEventDraft | null>(null);
  readonly mode = input<'create' | 'edit'>('create');
  readonly eventTypes = input<readonly AfCalendarEventTypeDefinition[] | undefined>(undefined);
  readonly resources = input<readonly AfCalendarResource[]>([]);
  readonly timeZone = input.required<string>();
  /** Alcances ofrecidos al guardar una ocurrencia de serie. Vacío: no es serie. */
  readonly recurrenceScopes = input<readonly AfCalendarRecurrenceScope[]>([]);
  readonly eventId = input<string | undefined>(undefined);
  readonly occurrenceId = input<string | undefined>(undefined);
  readonly seriesId = input<string | undefined>(undefined);
  readonly sourceVersion = input<string | undefined>(undefined);
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly busy = input(false, { transform: booleanAttribute });
  readonly allowDelete = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);

  readonly draftChange = output<AfCalendarEventDraft>();
  readonly save = output<AfCalendarEventSaveIntent>();
  readonly deleteRequest = output<AfCalendarEventDeleteIntent>();
  readonly cancelled = output<void>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly durations = DURATIONS;
  protected readonly startTimes = START_TIMES;
  protected readonly scopeLabels = SCOPE_LABELS;

  protected readonly registry = computed<readonly AfCalendarEventTypeDefinition[]>(
    () => this.eventTypes() ?? this.providedTypes,
  );

  // El estado del formulario nace del input y se reinicia solo cuando el
  // consumidor entrega otro borrador: escribir no debe perderse en cada
  // detección de cambios.
  protected readonly typeId = linkedSignal(
    () => this.draft()?.typeId ?? this.registry()[0]?.id ?? '',
  );
  protected readonly title = linkedSignal(() => this.draft()?.title ?? '');
  protected readonly date = linkedSignal(() => this.draft()?.date ?? afCalendarToday());
  protected readonly startTime = linkedSignal(() => this.draft()?.start ?? '09:00');
  protected readonly allDay = linkedSignal(() => this.draft()?.kind === 'all-day');
  protected readonly resourceId = linkedSignal(() => this.draft()?.resourceId ?? '');
  protected readonly scope = linkedSignal<AfCalendarRecurrenceScope>(
    () => this.recurrenceScopes()[0] ?? 'this',
  );
  protected readonly values = linkedSignal<Record<string, AfCalendarFieldValue>>(() => ({
    ...(this.draft()?.values ?? {}),
  }));

  private readonly explicitDuration = signal<number | null>(null);

  protected readonly activeType = computed<AfCalendarEventTypeDefinition | undefined>(() =>
    this.registry().find((type) => type.id === this.typeId()),
  );

  /**
   * Duración vigente.
   *
   * Sale del borrador, o de lo que eligió el usuario, o de la duración por
   * defecto del tipo — en ese orden. Cambiar de tipo en un evento nuevo adopta
   * la duración del tipo nuevo; en uno existente respeta la que ya tenía.
   */
  protected readonly duration = computed<number>(() => {
    const explicit = this.explicitDuration();
    if (explicit !== null) return explicit;

    const draft = this.draft();
    if (draft && draft.kind !== 'all-day') {
      return afCalendarToMinutes(draft.end) - afCalendarToMinutes(draft.start);
    }
    return this.activeType()?.defaultDurationMinutes ?? 60;
  });

  protected readonly endTime = computed(() =>
    afCalendarToHhMm(afCalendarToMinutes(this.startTime()) + this.duration()),
  );

  protected readonly fields = computed<readonly AfCalendarFieldDef[]>(
    () => this.activeType()?.fields ?? [],
  );

  protected readonly summary = computed(() => {
    const when = afCalendarLongDate(this.date(), this.labels());
    if (this.allDay()) return `${when} · ${this.labels().allDay.toLowerCase()}`;
    return `${when} · ${this.startTime()} – ${this.endTime()}`;
  });

  protected readonly heading = computed(() =>
    this.mode() === 'create' ? 'Nueva actividad' : 'Editar actividad',
  );

  protected readonly submitLabel = computed(() => (this.mode() === 'create' ? 'Crear' : 'Guardar'));

  protected durationLabel(minutes: number): string {
    return afCalendarDurationLabel(minutes);
  }

  protected onTypeChange(typeId: string): void {
    this.typeId.set(typeId);
    // En un evento nuevo el tipo manda su duración; en uno existente el usuario
    // ya tenía una y cambiársela sería una sorpresa.
    if (this.mode() === 'create') this.explicitDuration.set(null);
    this.emitDraft();
  }

  protected onDurationChange(value: string): void {
    this.explicitDuration.set(Number(value));
    this.emitDraft();
  }

  protected onFieldChange(key: string, value: AfCalendarFieldValue): void {
    this.values.update((current) => ({ ...current, [key]: value }));
    this.emitDraft();
  }

  protected onChipToggle(key: string, option: string): void {
    const current = this.values()[key];
    const list = Array.isArray(current) ? [...current] : [];
    const index = list.indexOf(option);
    if (index === -1) list.push(option);
    else list.splice(index, 1);
    this.onFieldChange(key, list);
  }

  protected isChipOn(key: string, option: string): boolean {
    const current = this.values()[key];
    return Array.isArray(current) && current.includes(option);
  }

  protected fieldValue(key: string): string {
    const value = this.values()[key];
    return value === undefined || value === null || typeof value === 'boolean' ? '' : String(value);
  }

  protected isSwitchOn(key: string): boolean {
    return this.values()[key] === true;
  }

  protected onSubmit(): void {
    if (this.busy()) return;
    this.save.emit({
      draft: this.buildDraft(),
      eventId: this.eventId(),
      occurrenceId: this.occurrenceId(),
      seriesId: this.seriesId(),
      recurrenceScope: this.recurrenceScopes().length > 0 ? this.scope() : undefined,
      sourceVersion: this.sourceVersion(),
    });
  }

  protected onDelete(): void {
    const eventId = this.eventId();
    if (!eventId) return;
    this.deleteRequest.emit({
      eventId,
      occurrenceId: this.occurrenceId(),
      seriesId: this.seriesId(),
      recurrenceScope: this.recurrenceScopes().length > 0 ? this.scope() : undefined,
    });
  }

  protected emitDraft(): void {
    this.draftChange.emit(this.buildDraft());
  }

  private buildDraft(): AfCalendarEventDraft {
    const allDay = this.allDay();
    return {
      typeId: this.typeId(),
      title: this.title().trim() || (this.activeType()?.label ?? 'Actividad'),
      date: this.date(),
      start: allDay ? '00:00' : this.startTime(),
      end: allDay ? '24:00' : this.endTime(),
      kind: allDay ? 'all-day' : 'timed',
      resourceId: this.resourceId() || undefined,
      values: { ...this.values() },
    };
  }
}
