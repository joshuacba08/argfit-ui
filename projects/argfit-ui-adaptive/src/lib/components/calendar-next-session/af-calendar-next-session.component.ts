import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import {
    AF_CALENDAR_DEFAULT_LABELS,
    afCalendarDurationLabel,
    afCalendarLongDate,
    afCalendarMinutesUntil,
    afCalendarMoment,
    afCalendarToMinutes,
    afCalendarUpcomingEvents,
    type AfCalendarEvent,
    type AfCalendarLabels,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { afCalendarWidgetIcon } from '../calendar-widget/af-calendar-widget.tokens';

/**
 * Card destacada con lo que sigue.
 *
 * Pensada para la home móvil: qué actividad viene, cuándo y en cuánto tiempo.
 * Una actividad ya empezada sigue siendo «la próxima» hasta que termina — es
 * justo el momento en que el usuario más la está mirando.
 */
@Component({
  selector: 'af-calendar-next-session',
  imports: [AfIconComponent],
  templateUrl: './af-calendar-next-session.component.html',
  styleUrl: './af-calendar-next-session.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-calendar-next-session',
    '[attr.data-color]': 'event()?.colorToken ?? "neutral"',
  },
})
export class AfCalendarNextSessionComponent {
  readonly events = input<readonly AfCalendarEvent[]>([]);
  readonly timeZone = input.required<string>();
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly heading = input('Próxima sesión');
  readonly emptyTitle = input('Sin próxima sesión');
  readonly actionLabel = input('Ver detalle');
  readonly secondaryActionLabel = input<string | undefined>(undefined);
  readonly loading = input(false, { transform: booleanAttribute });
  /** Instante de referencia `YYYY-MM-DDTHH:mm`. Sin valor, el reloj del dispositivo. */
  readonly now = input<string | undefined>(undefined);

  readonly eventActivate = output<AfCalendarEvent>();
  readonly secondaryActionPressed = output<AfCalendarEvent>();

  protected readonly event = computed<AfCalendarEvent | null>(
    () => afCalendarUpcomingEvents(this.events(), afCalendarMoment(this.now()), 1)[0] ?? null,
  );

  protected readonly icon = computed(() => {
    const event = this.event();
    return event ? afCalendarWidgetIcon(event) : 'calendar';
  });

  /** «en 45 min». `null` si ya empezó o es otro día: contar horas no ayudaría. */
  protected readonly countdown = computed<string | null>(() => {
    const event = this.event();
    if (!event) return null;
    const minutes = afCalendarMinutesUntil(event, afCalendarMoment(this.now()));
    return minutes === null ? null : `en ${afCalendarDurationLabel(minutes)}`;
  });

  protected readonly whenLabel = computed(() => {
    const event = this.event();
    if (!event) return '';
    const day = afCalendarLongDate(event.date, this.labels());
    if (event.kind === 'all-day') return `${day} · ${this.labels().allDay.toLowerCase()}`;
    return `${day} · ${event.start} – ${event.end}`;
  });

  protected readonly durationLabel = computed(() => {
    const event = this.event();
    if (!event || event.kind === 'all-day') return this.labels().allDay;
    return afCalendarDurationLabel(
      afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start),
    );
  });
}
