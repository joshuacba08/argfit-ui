import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { IonDatetime } from '@ionic/angular/standalone';

import type { AfDatePickerDensity, AfDatePickerSize } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfDialogMobileComponent } from '../dialog/af-dialog-mobile.component';

interface AfIonDatetimeChangeDetail {
  readonly value?: string | readonly string[] | null;
}

let nextAfMobileDatePickerId = 0;

@Component({
  selector: 'af-date-picker-mobile',
  imports: [AfIconComponent, IonDatetime, AfDialogMobileComponent],
  templateUrl: './af-date-picker-mobile.component.html',
  styleUrl: './af-date-picker-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-date-picker-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
    '[attr.data-invalid]': 'errorText() ? "" : null',
  },
})
export class AfDatePickerMobileComponent {
  private readonly defaultInputId = `af-date-picker-mobile-${++nextAfMobileDatePickerId}`;

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
  protected readonly ariaLabelledBy = computed(() => (this.label() ? this.labelId() : null));
  protected readonly ariaLabel = computed(() => (this.label() ? null : this.placeholder() ?? 'Selecciona una fecha'));
  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);
  protected readonly modalId = computed(() => `${this.resolvedInputId()}-dialog`);
  protected readonly datetimeValue = computed(() => this.normalizeDatetimeValue(this.value()) || undefined);
  protected readonly displayValue = computed(() => {
    const normalizedValue = this.normalizeDatetimeValue(this.value());

    if (!normalizedValue) {
      return this.placeholder() ?? 'Selecciona una fecha';
    }

    return this.formatDisplayValue(normalizedValue);
  });
  protected readonly describedBy = computed(() => {
    if (this.errorText()) {
      return this.errorId();
    }
    if (this.helperText()) {
      return this.hintId();
    }
    return null;
  });
  protected readonly open = signal(false);

  protected requestOpen(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    this.open.set(true);
    this.focusChange.emit(true);
  }

  protected onOverlayOpenChange(next: boolean): void {
    if (next) {
      if (!this.open()) {
        this.open.set(true);
        this.focusChange.emit(true);
      }
      return;
    }

    this.closeOverlay();
  }

  protected onDatetimeChange(event: CustomEvent<AfIonDatetimeChangeDetail>): void {
    if (this.readonly()) {
      return;
    }

    this.valueChange.emit(this.normalizeDatetimeValue(event.detail.value));
    this.closeOverlay();
  }

  protected onModalDismiss(): void {
    this.closeOverlay();
  }

  private closeOverlay(): void {
    if (!this.open()) {
      return;
    }

    this.open.set(false);
    this.focusChange.emit(false);
  }

  private normalizeDatetimeValue(value: string | readonly string[] | undefined | null): string {
    const rawValue = Array.isArray(value) ? value[0] : value;

    if (!rawValue) {
      return '';
    }

    const isoPrefix = /^(\d{4}-\d{2}-\d{2})/.exec(rawValue);

    return isoPrefix ? isoPrefix[1] : '';
  }

  private formatDisplayValue(value: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
      return value;
    }

    return `${match[3]}/${match[2]}/${match[1]}`;
  }
}
