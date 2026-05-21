import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  AfPlatformService,
  type AfDatePickerDensity,
  type AfDatePickerSize,
} from '@argfit-ui/core';
import { AfDatePickerDesktopComponent } from '@argfit-ui/desktop';
import { AfDatePickerMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-date-picker',
  imports: [AfDatePickerDesktopComponent, AfDatePickerMobileComponent],
  templateUrl: './af-date-picker.component.html',
  styleUrl: './af-date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfDatePickerComponent),
      multi: true,
    },
  ],
})
export class AfDatePickerComponent implements ControlValueAccessor {
  private readonly platform = inject(AfPlatformService);
  private readonly cdr = inject(ChangeDetectorRef);

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

  protected readonly isMobile = this.platform.isMobile;
  protected readonly internalValue = signal('');
  protected readonly hasInternalValue = signal(false);
  protected readonly cvaDisabled = signal(false);

  private onChange: (value: string) => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };

  protected resolvedValue(): string {
    return this.hasInternalValue() ? this.internalValue() : this.value();
  }

  protected resolvedDisabled(): boolean {
    return this.disabled() || this.cvaDisabled();
  }

  protected onInternalValueChange(next: string): void {
    this.hasInternalValue.set(true);
    this.internalValue.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
  }

  protected onInternalFocusChange(focused: boolean): void {
    if (!focused) {
      this.onTouched();
    }
    this.focusChange.emit(focused);
  }

  writeValue(value: string | null | undefined): void {
    this.hasInternalValue.set(true);
    this.internalValue.set(value ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }
}
