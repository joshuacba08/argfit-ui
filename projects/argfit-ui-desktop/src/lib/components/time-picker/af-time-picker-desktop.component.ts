import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    numberAttribute,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

import {
    afMinutesToTime,
    AfThemeService,
    afTimeToMinutes,
    isAfTimeValue,
    type AfTimePickerDensity,
    type AfTimePickerMinuteStep,
    type AfTimePickerSize,
} from '@argfit-ui/core';

let nextAfDesktopTimePickerId = 0;

/**
 * Desktop renderer for `AfTimePicker`, backed by PrimeNG's picker in `timeOnly` mode.
 *
 * The public contract is a civil `HH:mm` string; the `Date` handled internally never
 * leaves this component, so no consumer inherits PrimeNG's date semantics.
 */
@Component({
  selector: 'af-time-picker-desktop',
  imports: [FormsModule, DatePicker],
  templateUrl: './af-time-picker-desktop.component.html',
  styleUrl: './af-time-picker-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-time-picker-desktop',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
    '[attr.data-invalid]': 'errorText() ? "" : null',
  },
})
export class AfTimePickerDesktopComponent {
  private readonly defaultInputId = `af-time-picker-desktop-${++nextAfDesktopTimePickerId}`;

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
  readonly minuteStep = input<AfTimePickerMinuteStep, unknown>(5, {
    transform: (raw) => numberAttribute(raw, 5) as AfTimePickerMinuteStep,
  });
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly size = input<AfTimePickerSize>('md');
  readonly density = input<AfTimePickerDensity>('comfortable');
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedInputId = computed(() => this.inputId() ?? this.defaultInputId);
  protected readonly labelId = computed(() => `${this.resolvedInputId()}-label`);
  protected readonly ariaLabelledBy = computed(() => (this.label() ? this.labelId() : undefined));
  protected readonly ariaLabel = computed(() =>
    this.label() ? undefined : (this.placeholder() ?? 'Selecciona una hora'),
  );
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

  protected readonly valueAsDate = computed(() => this.toDate(this.value()));
  protected readonly pickerSize = computed<'small' | 'large' | undefined>(() => {
    if (this.size() === 'sm') {
      return 'small';
    }
    if (this.size() === 'lg') {
      return 'large';
    }
    return undefined;
  });

  protected onModelChange(next: Date | string | null | undefined): void {
    if (this.readonly()) {
      return;
    }
    this.valueChange.emit(this.clampToRange(this.serialize(next)));
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }

  /**
   * PrimeNG no admite límites en modo `timeOnly`, así que el rango se aplica al valor ya
   * serializado. Se recorta en vez de rechazarse: descartar la selección en silencio
   * dejaría al usuario sin saber por qué su clic no hizo nada.
   */
  private clampToRange(value: string): string {
    const minutes = afTimeToMinutes(value);
    if (minutes === null) {
      return value;
    }

    const min = afTimeToMinutes(this.min());
    if (min !== null && minutes < min) {
      return afMinutesToTime(min);
    }

    const max = afTimeToMinutes(this.max());
    if (max !== null && minutes > max) {
      return afMinutesToTime(max);
    }

    return value;
  }

  /** El día es un portador arbitrario: solo viajan hora y minuto. */
  private toDate(value: string | undefined): Date | null {
    const minutes = afTimeToMinutes(value);
    if (minutes === null) {
      return null;
    }
    const carrier = new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60, 0, 0);
    return carrier;
  }

  private serialize(value: Date | string | null | undefined): string {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return afMinutesToTime(value.getHours() * 60 + value.getMinutes());
    }

    if (typeof value === 'string') {
      if (isAfTimeValue(value)) {
        return value;
      }
      const prefix = /^([01]\d|2[0-3]):([0-5]\d)/.exec(value);
      if (prefix) {
        return `${prefix[1]}:${prefix[2]}`;
      }
    }

    return '';
  }
}
