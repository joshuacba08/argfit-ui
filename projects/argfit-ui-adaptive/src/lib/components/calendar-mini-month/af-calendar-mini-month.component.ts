import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    linkedSignal,
    output,
    ViewEncapsulation,
} from '@angular/core';

import {
    AF_CALENDAR_DEFAULT_LABELS,
    afCalendarAddMonths,
    afCalendarEventsOn,
    afCalendarIsSameMonth,
    afCalendarLongDate,
    afCalendarMoment,
    afCalendarMonthCells,
    afCalendarStartOfMonth,
    afCalendarToMinutes,
    type AfCalendarEvent,
    type AfCalendarLabels,
    type AfCalendarWeekday,
    type AfIconName,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { afCalendarWidgetIcon } from '../calendar-widget/af-calendar-widget.tokens';

export interface AfCalendarMiniMonthDay {
  readonly date: string;
  readonly dayNumber: string;
  readonly ariaLabel: string;
  readonly isOutside: boolean;
  readonly isToday: boolean;
  readonly isSelected: boolean;
  readonly isInRange: boolean;
  readonly hasEvents: boolean;
}

export interface AfCalendarMiniMonthItem {
  readonly event: AfCalendarEvent;
  readonly timeLabel: string;
  readonly icon: AfIconName;
}

/**
 * Mini calendario de mes con marcas de actividad y agenda del día elegido.
 *
 * Pensado para la columna lateral de un dashboard. No duplica la fuente de
 * verdad del calendario principal: emite la fecha y quien lo usa sincroniza.
 */
@Component({
  selector: 'af-calendar-mini-month',
  imports: [AfIconComponent],
  templateUrl: './af-calendar-mini-month.component.html',
  styleUrl: './af-calendar-mini-month.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'af-calendar-mini-month' },
})
export class AfCalendarMiniMonthComponent {
  readonly events = input<readonly AfCalendarEvent[]>([]);
  readonly anchorDate = input<string | undefined>(undefined);
  readonly selectedDate = input<string | undefined>(undefined);
  readonly firstDay = input<AfCalendarWeekday>(1);
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly showAgenda = input(true, { transform: booleanAttribute });
  readonly heading = input('Planificación');
  /** Rango resaltado, normalmente la ventana visible del calendario principal. */
  readonly rangeStart = input<string | undefined>(undefined);
  readonly rangeEnd = input<string | undefined>(undefined);
  /** Instante de referencia `YYYY-MM-DDTHH:mm`. Sin valor, el reloj del dispositivo. */
  readonly now = input<string | undefined>(undefined);

  readonly dateSelect = output<string>();
  readonly monthChange = output<string>();
  readonly eventActivate = output<AfCalendarEvent>();

  private readonly today = computed(() => afCalendarMoment(this.now()).date);

  /** Mes en pantalla. Se mueve con las flechas sin tocar la fecha seleccionada. */
  protected readonly month = linkedSignal(() =>
    afCalendarStartOfMonth(this.anchorDate() ?? this.selectedDate() ?? this.today()),
  );

  protected readonly selected = computed(
    () => this.selectedDate() ?? this.anchorDate() ?? this.today(),
  );

  protected readonly monthTitle = computed(() => {
    const month = this.month();
    return `${this.labels().months[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)}`;
  });

  protected readonly weekdays = computed(() => {
    const labels = this.labels();
    const first = this.firstDay();
    return Array.from({ length: 7 }, (_, index) => ({
      key: (first + index) % 7,
      short: labels.weekdaysShort[(first + index) % 7],
      initial: labels.weekdaysShort[(first + index) % 7].charAt(0),
    }));
  });

  protected readonly days = computed<readonly AfCalendarMiniMonthDay[]>(() => {
    const labels = this.labels();
    const month = this.month();
    const today = this.today();
    const selected = this.selected();
    const from = this.rangeStart();
    const to = this.rangeEnd();

    return afCalendarMonthCells(month, this.firstDay()).map((date) => ({
      date,
      dayNumber: String(Number(date.slice(8, 10))),
      ariaLabel: afCalendarLongDate(date, labels),
      isOutside: !afCalendarIsSameMonth(date, month),
      isToday: date === today,
      isSelected: date === selected,
      isInRange: from !== undefined && to !== undefined && date >= from && date < to,
      hasEvents: afCalendarEventsOn(this.events(), date).length > 0,
    }));
  });

  protected readonly selectedLabel = computed(() =>
    afCalendarLongDate(this.selected(), this.labels()),
  );

  protected readonly items = computed<readonly AfCalendarMiniMonthItem[]>(() =>
    [...afCalendarEventsOn(this.events(), this.selected())]
      .sort((a, b) => afCalendarToMinutes(a.start) - afCalendarToMinutes(b.start))
      .map((event) => ({
        event,
        timeLabel: event.kind === 'all-day' ? this.labels().allDay : event.start,
        icon: afCalendarWidgetIcon(event),
      })),
  );

  protected onMonthStep(direction: -1 | 1): void {
    const next = afCalendarAddMonths(this.month(), direction);
    this.month.set(next);
    this.monthChange.emit(next);
  }
}
