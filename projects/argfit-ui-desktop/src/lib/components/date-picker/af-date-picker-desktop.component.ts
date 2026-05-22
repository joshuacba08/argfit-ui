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

import { AfThemeService, type AfDatePickerDensity, type AfDatePickerSize } from '@argfit-ui/core';

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
  protected readonly valueAsDate = computed(() => this.parseIsoDate(this.value()));
  protected readonly minDate = computed(() => this.parseIsoDate(this.min()));
  protected readonly maxDate = computed(() => this.parseIsoDate(this.max()));
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

  private parseIsoDate(value: string | undefined): Date | null {
    if (!value) {
      return null;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const parsedDate = new Date(year, month - 1, day);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month - 1 ||
      parsedDate.getDate() !== day
    ) {
      return null;
    }

    return parsedDate;
  }

  private serializeDateValue(value: Date | string | null | undefined): string {
    if (value instanceof Date) {
      return this.formatAsIsoDate(value);
    }

    if (typeof value === 'string') {
      const isoPrefix = /^(\d{4}-\d{2}-\d{2})/.exec(value);

      if (isoPrefix) {
        return isoPrefix[1];
      }

      const parsedDate = new Date(value);

      if (!Number.isNaN(parsedDate.getTime())) {
        return this.formatAsIsoDate(parsedDate);
      }
    }

    return '';
  }

  private formatAsIsoDate(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
