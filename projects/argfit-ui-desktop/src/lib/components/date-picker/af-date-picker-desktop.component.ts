import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import type { AfDatePickerDensity, AfDatePickerSize } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

let nextAfDesktopDatePickerId = 0;

@Component({
  selector: 'af-date-picker-desktop',
  imports: [AfIconComponent],
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

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }
}