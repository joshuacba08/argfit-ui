import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import {
    AF_CALENDAR_DEFAULT_LABELS,
    afCalendarAddDays,
    afCalendarDayOfWeek,
    afCalendarDurationLabel,
    afCalendarLongDate,
    afCalendarMoment,
    afCalendarStartOfWeek,
    afCalendarWeekLoad,
    type AfCalendarEvent,
    type AfCalendarLabels,
    type AfCalendarWeekday,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

export interface AfCalendarWeekLoadBar {
  readonly date: string;
  readonly initial: string;
  readonly ariaLabel: string;
  readonly valueLabel: string;
  readonly heightPercent: number;
  readonly isToday: boolean;
  readonly isPeak: boolean;
  readonly isEmpty: boolean;
}

/** Un día por debajo de esta fracción del pico no se considera carga alta. */
const PEAK_RATIO = 0.8;

/**
 * Minutos planificados por día de la semana.
 *
 * Los picos se destacan por color e intensidad, pero el valor numérico
 * acompaña cada barra: un gráfico donde la única lectura es la altura relativa
 * no sirve para planificar una semana de trabajo.
 */
@Component({
  selector: 'af-calendar-week-load',
  imports: [AfIconComponent],
  templateUrl: './af-calendar-week-load.component.html',
  styleUrl: './af-calendar-week-load.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'af-calendar-week-load' },
})
export class AfCalendarWeekLoadComponent {
  readonly events = input<readonly AfCalendarEvent[]>([]);
  readonly anchorDate = input<string | undefined>(undefined);
  readonly firstDay = input<AfCalendarWeekday>(1);
  readonly labels = input<AfCalendarLabels>(AF_CALENDAR_DEFAULT_LABELS);
  readonly heading = input('Carga semanal');
  /** Minutos objetivo por semana. Con valor, se dibuja la línea de referencia. */
  readonly goalMinutes = input<number | undefined>(undefined);
  /** Instante de referencia `YYYY-MM-DDTHH:mm`. Sin valor, el reloj del dispositivo. */
  readonly now = input<string | undefined>(undefined);

  readonly daySelect = output<string>();

  private readonly today = computed(() => afCalendarMoment(this.now()).date);

  private readonly days = computed(() => {
    const start = afCalendarStartOfWeek(this.anchorDate() ?? this.today(), this.firstDay());
    return Array.from({ length: 7 }, (_, index) => afCalendarAddDays(start, index));
  });

  private readonly load = computed(() => afCalendarWeekLoad(this.events(), this.days()));

  protected readonly bars = computed<readonly AfCalendarWeekLoadBar[]>(() => {
    const labels = this.labels();
    const today = this.today();

    return this.load().map((day) => ({
      date: day.date,
      initial: labels.weekdaysShort[afCalendarDayOfWeek(day.date)].charAt(0),
      ariaLabel: `${afCalendarLongDate(day.date, labels)}: ${
        day.minutes === 0 ? 'sin actividades' : afCalendarDurationLabel(day.minutes)
      }`,
      valueLabel: day.minutes === 0 ? '–' : `${Math.round((day.minutes / 60) * 10) / 10}h`,
      // Una barra de 0 % no se ve; se deja un mínimo para que el día exista.
      heightPercent: day.minutes === 0 ? 3 : Math.max(day.intensity * 100, 6),
      isToday: day.date === today,
      isPeak: day.minutes > 0 && day.intensity >= PEAK_RATIO,
      isEmpty: day.minutes === 0,
    }));
  });

  protected readonly totalLabel = computed(() =>
    afCalendarDurationLabel(this.load().reduce((total, day) => total + day.minutes, 0)),
  );

  protected readonly peakLabel = computed(() =>
    afCalendarDurationLabel(Math.max(0, ...this.load().map((day) => day.minutes))),
  );

  protected readonly goalLabel = computed(() => {
    const goal = this.goalMinutes();
    return goal === undefined ? null : afCalendarDurationLabel(goal);
  });
}
