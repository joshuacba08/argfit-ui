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
    afCalendarAddDays,
    afCalendarDayOfWeek,
    afCalendarDurationLabel,
    afCalendarEventsOn,
    afCalendarLongDate,
    afCalendarMoment,
    afCalendarStartOfWeek,
    afCalendarToMinutes,
    AfPlatformService,
    type AfCalendarEvent,
    type AfCalendarLabels,
    type AfCalendarWeekday,
    type AfIconName,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { afCalendarWidgetIcon } from '../calendar-widget/af-calendar-widget.tokens';

export interface AfCalendarStripDay {
  readonly date: string;
  readonly weekdayLabel: string;
  readonly dayNumber: string;
  readonly ariaLabel: string;
  readonly isSelected: boolean;
  readonly isToday: boolean;
  readonly hasEvents: boolean;
}

export interface AfCalendarStripItem {
  readonly event: AfCalendarEvent;
  readonly timeLabel: string;
  readonly endLabel: string | null;
  readonly durationLabel: string;
  readonly ariaLabel: string;
  readonly icon: AfIconName;
}

/**
 * Strip semanal de días con la agenda del día elegido.
 *
 * Es el patrón de calendario que funciona en una tarjeta angosta: siete
 * objetivos de toque para navegar y una lista debajo, sin la grilla temporal
 * que a 360 px no se puede leer.
 */
@Component({
  selector: 'af-calendar-strip-agenda',
  imports: [AfIconComponent],
  templateUrl: './af-calendar-strip-agenda.component.html',
  styleUrl: './af-calendar-strip-agenda.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-calendar-strip-agenda',
    '[attr.data-platform]': 'isMobile() ? "mobile" : "desktop"',
  },
})
export class AfCalendarStripAgendaComponent {
  private readonly platform = inject(AfPlatformService);

  readonly events = input<readonly AfCalendarEvent[]>([]);
  readonly timeZone = input.required<string>();
  readonly selectedDate = input<string | undefined>(undefined);
  readonly firstDay = input<AfCalendarWeekday>(1);
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly heading = input('Agenda');
  readonly createButton = input(false, { transform: booleanAttribute });
  /** Instante de referencia `YYYY-MM-DDTHH:mm`. Sin valor, el reloj del dispositivo. */
  readonly now = input<string | undefined>(undefined);

  readonly dateSelect = output<string>();
  readonly todayPressed = output<void>();
  readonly eventActivate = output<AfCalendarEvent>();
  readonly createPressed = output<string>();

  protected readonly isMobile = this.platform.isMobile;

  private readonly today = computed(() => afCalendarMoment(this.now()).date);

  protected readonly selected = computed(() => this.selectedDate() ?? this.today());

  protected readonly days = computed<readonly AfCalendarStripDay[]>(() => {
    const labels = this.labels();
    const today = this.today();
    const selected = this.selected();
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

  protected readonly selectedLabel = computed(() =>
    afCalendarLongDate(this.selected(), this.labels()),
  );

  protected readonly items = computed<readonly AfCalendarStripItem[]>(() => {
    const labels = this.labels();

    return [...afCalendarEventsOn(this.events(), this.selected())]
      .sort((a, b) => afCalendarToMinutes(a.start) - afCalendarToMinutes(b.start))
      .map((event) => {
        const allDay = event.kind === 'all-day';
        return {
          event,
          timeLabel: allDay ? labels.allDay : event.start,
          endLabel: allDay ? null : event.end,
          durationLabel: allDay
            ? labels.allDay
            : afCalendarDurationLabel(
                afCalendarToMinutes(event.end) - afCalendarToMinutes(event.start),
              ),
          ariaLabel: [
            event.title,
            allDay ? labels.allDay : `${event.start} – ${event.end}`,
            afCalendarLongDate(event.date, labels),
            event.subtitle,
          ]
            .filter(Boolean)
            .join(', '),
          icon: afCalendarWidgetIcon(event),
        };
      });
  });
}
