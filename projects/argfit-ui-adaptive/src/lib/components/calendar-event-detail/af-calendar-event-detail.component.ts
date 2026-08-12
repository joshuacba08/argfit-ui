import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import {
    AF_CALENDAR_DEFAULT_LABELS,
    AF_CALENDAR_EVENT_TYPES,
    afCalendarDurationLabel,
    afCalendarLongDate,
    afCalendarToMinutes,
    AfPlatformService,
    type AfCalendarEvent,
    type AfCalendarEventDeleteIntent,
    type AfCalendarEventTypeDefinition,
    type AfCalendarFieldDef,
    type AfCalendarFieldValue,
    type AfCalendarLabels,
    type AfIconName,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

const EVENT_ICON: Readonly<Record<string, AfIconName>> = {
  training: 'activity',
  match: 'trophy',
  gym: 'dumbbell',
  video: 'video',
  medical: 'stethoscope',
  neutral: 'calendar',
};

export interface AfCalendarEventDetailField {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

/**
 * Detalle de una ocurrencia del calendario.
 *
 * Muestra lo común a todo evento — tipo, fecha, hora, lugar, serie, estado — y
 * debajo los campos propios de su tipo, resueltos desde el esquema del registro.
 * Ningún campo está codificado acá: agregar un tipo de evento no toca este
 * componente.
 *
 * Es una **superficie plana, no un overlay**. La aplicación (o el propio
 * `AfCalendar`) lo hospeda en un popover, un drawer o una ruta completa; así el
 * mismo detalle sirve en los tres lugares sin duplicarse.
 *
 * No lleva renderers separados: entre escritorio y móvil solo cambian densidad
 * y ancho de los campos, y eso se resuelve con `isMobile()` y CSS. Es el mismo
 * criterio de `AfField`, `AfIconField` y `AfInputGroup`, y el que el flujo de
 * trabajo llama «decisión explícita de renderer compartido».
 */
@Component({
  selector: 'af-calendar-event-detail',
  imports: [AfIconComponent],
  templateUrl: './af-calendar-event-detail.component.html',
  styleUrl: './af-calendar-event-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-calendar-event-detail',
    '[attr.data-platform]': 'isMobile() ? "mobile" : "desktop"',
    '[attr.data-state]': 'event().state ?? "normal"',
    '[attr.data-color]': 'event().colorToken',
  },
})
export class AfCalendarEventDetailComponent {
  private readonly platform = inject(AfPlatformService);
  private readonly providedTypes = inject(AF_CALENDAR_EVENT_TYPES);

  readonly event = input.required<AfCalendarEvent>();
  /** Pisa el registro inyectado cuando una pantalla usa un subconjunto. */
  readonly eventTypes = input<readonly AfCalendarEventTypeDefinition[] | undefined>(undefined);
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly canEdit = input(false, { transform: booleanAttribute });
  readonly canDelete = input(false, { transform: booleanAttribute });
  readonly canDuplicate = input(false, { transform: booleanAttribute });
  readonly showClose = input(true, { transform: booleanAttribute });

  readonly editRequest = output<AfCalendarEvent>();
  readonly duplicateRequest = output<AfCalendarEvent>();
  readonly deleteRequest = output<AfCalendarEventDeleteIntent>();
  readonly closed = output<void>();

  protected readonly isMobile = this.platform.isMobile;

  protected readonly registry = computed<readonly AfCalendarEventTypeDefinition[]>(
    () => this.eventTypes() ?? this.providedTypes,
  );

  protected readonly typeDefinition = computed<AfCalendarEventTypeDefinition | undefined>(() => {
    const event = this.event();
    const registry = this.registry();
    return registry.find((type) => type.id === event.type) ?? registry[0];
  });

  protected readonly typeLabel = computed(() => this.typeDefinition()?.label ?? '');

  protected readonly icon = computed<AfIconName>(
    () => this.typeDefinition()?.icon ?? EVENT_ICON[this.event().colorToken] ?? 'calendar',
  );

  protected readonly dateLabel = computed(() =>
    afCalendarLongDate(this.event().date, this.labels()),
  );

  protected readonly timeLabel = computed(() => {
    const event = this.event();
    if (event.kind === 'all-day') return this.labels().allDay;
    const minutes = afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start);
    return `${event.start} – ${event.end} · ${afCalendarDurationLabel(minutes)}`;
  });

  protected readonly stateLabel = computed(() => {
    const state = this.event().state ?? 'normal';
    return state === 'normal' ? null : this.labels().stateLabels[state];
  });

  /**
   * Campos del tipo que tienen valor.
   *
   * Solo se listan los completos: una ficha llena de «—» no informa nada y
   * empuja hacia abajo lo que sí importa.
   */
  protected readonly fields = computed<readonly AfCalendarEventDetailField[]>(() => {
    const meta = this.event().meta ?? {};
    const definition = this.typeDefinition();
    if (!definition) return [];

    return definition.fields
      .map((field) => ({
        key: field.key,
        label: field.label,
        value: this.formatValue(field, meta[field.key] as AfCalendarFieldValue | undefined),
      }))
      .filter((field): field is AfCalendarEventDetailField => field.value !== null);
  });

  private formatValue(field: AfCalendarFieldDef, value: AfCalendarFieldValue | undefined): string | null {
    if (value === undefined || value === null || value === '') return null;
    if (field.kind === 'switch') return value === true ? 'Sí' : null;
    if (Array.isArray(value)) return value.length > 0 ? value.join(' · ') : null;
    if (field.kind === 'select' && field.options) {
      return field.options.find((option) => option.value === value)?.label ?? String(value);
    }
    return String(value);
  }

  protected onDelete(): void {
    const event = this.event();
    this.deleteRequest.emit({
      eventId: event.id,
      occurrenceId: event.occurrenceId,
      seriesId: event.seriesId,
    });
  }
}
