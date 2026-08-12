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
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

import {
    afCalendarCivilDate,
    afCalendarParseCivilDate,
    AfThemeService,
    type AfDatePickerDensity,
    type AfDatePickerSize,
} from '@argfit-ui/core';

let nextAfDesktopDatePickerId = 0;

@Component({
  selector: 'af-date-picker-desktop',
  imports: [FormsModule, DatePicker],
  templateUrl: './af-date-picker-desktop.component.html',
  styleUrl: './af-date-picker-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-date-picker-desktop',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
    '[attr.data-invalid]': 'errorText() ? "" : null',
  },
})
export class AfDatePickerDesktopComponent {
  private readonly defaultInputId = `af-date-picker-desktop-${++nextAfDesktopDatePickerId}`;

  constructor() {
    inject(AfThemeService);
  }

  readonly value = input('');
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly min = input<string | undefined>(undefined);
  readonly max = input<string | undefined>(undefined);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly size = input<AfDatePickerSize>('md');
  readonly density = input<AfDatePickerDensity>('comfortable');
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedInputId = computed(() => this.inputId() ?? this.defaultInputId);
  protected readonly labelId = computed(() => `${this.resolvedInputId()}-label`);
  protected readonly ariaLabelledBy = computed(() => (this.label() ? this.labelId() : undefined));
  protected readonly ariaLabel = computed(() => (this.label() ? undefined : this.placeholder() ?? 'Selecciona una fecha'));
  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);
  protected readonly describedBy = computed(() => {
    if (this.errorText()) {
      return this.errorId();
    }
    if (this.helperText()) {
      return this.hintId();
    }
    return null;
  });
  protected readonly valueAsDate = computed(() => afCalendarParseCivilDate(this.value()));
  protected readonly minDate = computed(() => afCalendarParseCivilDate(this.min()));
  protected readonly maxDate = computed(() => afCalendarParseCivilDate(this.max()));
  protected readonly pickerSize = computed<'small' | 'large' | undefined>(() => {
    if (this.size() === 'sm') {
      return 'small';
    }

    if (this.size() === 'lg') {
      return 'large';
    }

    return undefined;
  });

  protected onModelChange(value: Date | string | null | undefined): void {
    if (this.readonly()) {
      return;
    }

    this.valueChange.emit(this.serializeDateValue(value));
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }

  /**
   * Traduce el valor que devuelve PrimeNG al contrato público `YYYY-MM-DD`.
   *
   * La conversión civil ↔ `Date` la resuelve el core: es la misma aritmética que
   * usa el calendario y no tiene por qué existir dos veces.
   */
  private serializeDateValue(value: Date | string | null | undefined): string {
    if (value instanceof Date) {
      return afCalendarCivilDate(value);
    }

    if (typeof value === 'string') {
      const isoPrefix = /^(\d{4}-\d{2}-\d{2})/.exec(value);

      if (isoPrefix) {
        return isoPrefix[1];
      }

      const parsedDate = new Date(value);

      if (!Number.isNaN(parsedDate.getTime())) {
        return afCalendarCivilDate(parsedDate);
      }
    }

    return '';
  }
}
