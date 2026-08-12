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
    afCalendarDayOfWeek,
    afCalendarDurationLabel,
    afCalendarMoment,
    afCalendarToMinutes,
    afCalendarUpcomingEvents,
    type AfCalendarEvent,
    type AfCalendarLabels,
    type AfIconName,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { afCalendarWidgetIcon } from '../calendar-widget/af-calendar-widget.tokens';

export interface AfCalendarUpcomingItem {
  readonly event: AfCalendarEvent;
  readonly dayLabel: string;
  readonly isToday: boolean;
  readonly durationLabel: string;
  readonly ariaLabel: string;
  readonly icon: AfIconName;
}

/**
 * Lista compacta de las próximas actividades.
 *
 * Widget de solo lectura para dashboards: no carga el motor de interacción del
 * calendario completo, que en una tarjeta de 360 px sería puro peso muerto.
 */
@Component({
  selector: 'af-calendar-upcoming',
  imports: [AfIconComponent],
  templateUrl: './af-calendar-upcoming.component.html',
  styleUrl: './af-calendar-upcoming.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'af-calendar-upcoming', '[attr.data-loading]': 'loading() ? "" : null' },
})
export class AfCalendarUpcomingComponent {
  readonly events = input<readonly AfCalendarEvent[]>([]);
  readonly timeZone = input.required<string>();
  readonly limit = input(5);
  readonly heading = input('Próximas actividades');
  readonly emptyTitle = input('Sin actividades próximas');
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly showLink = input(false, { transform: booleanAttribute });
  readonly linkLabel = input('Ver calendario');
  /**
   * Instante de referencia `YYYY-MM-DDTHH:mm`.
   *
   * Sin valor usa el reloj del dispositivo. Se expone para poder congelarlo en
   * tests y en capturas: «lo que sigue» cambia con la hora, y una historia que
   * cambia sola no es comparable.
   */
  readonly now = input<string | undefined>(undefined);

  readonly eventActivate = output<AfCalendarEvent>();
  readonly linkPressed = output<void>();

  protected readonly items = computed<readonly AfCalendarUpcomingItem[]>(() => {
    const labels = this.labels();
    const from = afCalendarMoment(this.now());

    return afCalendarUpcomingEvents(this.events(), from, this.limit()).map((event) => {
      const isToday = event.date === from.date;
      const weekday = labels.weekdaysShort[afCalendarDayOfWeek(event.date)];
      const duration = afCalendarDurationLabel(
        afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start),
      );

      return {
        event,
        dayLabel: isToday ? labels.today : `${weekday} ${Number(event.date.slice(8, 10))}`,
        isToday,
        durationLabel: duration,
        ariaLabel: [
          event.title,
          `${event.start} – ${event.end}`,
          isToday ? labels.today : `${weekday} ${Number(event.date.slice(8, 10))}`,
          event.subtitle,
        ]
          .filter(Boolean)
          .join(', '),
        icon: afCalendarWidgetIcon(event),
      };
    });
  });

  protected readonly skeletons = computed(() => [0, 1, 2]);
}
