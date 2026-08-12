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
    afCalendarEventsOn,
    afCalendarLongDate,
    afCalendarMoment,
    afCalendarTimelineSegments,
    afCalendarToHhMm,
    afCalendarToMinutes,
    type AfCalendarEvent,
    type AfCalendarLabels,
    type AfIconName,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { afCalendarWidgetIcon } from '../calendar-widget/af-calendar-widget.tokens';

export interface AfCalendarDayTimelineBlock {
  readonly event: AfCalendarEvent;
  readonly leftPercent: number;
  readonly widthPercent: number;
  readonly ariaLabel: string;
  readonly icon: AfIconName;
}

/**
 * Franja horizontal con las actividades del día.
 *
 * Útil como barra de contexto sobre un dashboard: de un vistazo se ve dónde se
 * acumula la carga y en qué punto del día está el equipo.
 */
@Component({
  selector: 'af-calendar-day-timeline',
  imports: [AfIconComponent],
  templateUrl: './af-calendar-day-timeline.component.html',
  styleUrl: './af-calendar-day-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'af-calendar-day-timeline' },
})
export class AfCalendarDayTimelineComponent {
  readonly events = input<readonly AfCalendarEvent[]>([]);
  readonly date = input<string | undefined>(undefined);
  readonly minTime = input('07:00');
  readonly maxTime = input('21:00');
  readonly nowIndicator = input(true, { transform: booleanAttribute });
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly heading = input('Línea de tiempo');
  /** Instante de referencia `YYYY-MM-DDTHH:mm`. Sin valor, el reloj del dispositivo. */
  readonly now = input<string | undefined>(undefined);

  readonly eventActivate = output<AfCalendarEvent>();

  private readonly moment = computed(() => afCalendarMoment(this.now()));

  protected readonly resolvedDate = computed(() => this.date() ?? this.moment().date);

  protected readonly bounds = computed(() => ({
    minMinutes: afCalendarToMinutes(this.minTime()),
    maxMinutes: afCalendarToMinutes(this.maxTime()),
  }));

  protected readonly dateLabel = computed(() =>
    afCalendarLongDate(this.resolvedDate(), this.labels()),
  );

  /** Una marca cada dos horas: más ticks en una franja de 74 px es ruido. */
  protected readonly ticks = computed(() => {
    const { minMinutes, maxMinutes } = this.bounds();
    const span = maxMinutes - minMinutes;
    if (span <= 0) return [];
    return Array.from({ length: Math.floor(span / 120) + 1 }, (_, index) => {
      const minutes = minMinutes + index * 120;
      return { minutes, label: afCalendarToHhMm(minutes), leftPercent: ((minutes - minMinutes) / span) * 100 };
    });
  });

  protected readonly blocks = computed<readonly AfCalendarDayTimelineBlock[]>(() =>
    afCalendarTimelineSegments(this.events(), this.resolvedDate(), this.bounds()).map(
      (segment) => ({
        event: segment.event,
        leftPercent: segment.offset * 100,
        widthPercent: segment.length * 100,
        ariaLabel: `${segment.event.title}, ${segment.event.start} – ${segment.event.end}`,
        icon: afCalendarWidgetIcon(segment.event),
      }),
    ),
  );

  protected readonly nowPercent = computed<number | null>(() => {
    if (!this.nowIndicator()) return null;
    const moment = this.moment();
    if (moment.date !== this.resolvedDate()) return null;
    const { minMinutes, maxMinutes } = this.bounds();
    if (moment.minutes < minMinutes || moment.minutes > maxMinutes) return null;
    return ((moment.minutes - minMinutes) / (maxMinutes - minMinutes)) * 100;
  });

  protected readonly summary = computed(() => {
    const list = afCalendarEventsOn(this.events(), this.resolvedDate()).filter(
      (event) => event.kind !== 'all-day',
    );
    const minutes = list.reduce(
      (total, event) => total + afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start),
      0,
    );
    return { count: list.length, planned: afCalendarDurationLabel(minutes) };
  });
}
