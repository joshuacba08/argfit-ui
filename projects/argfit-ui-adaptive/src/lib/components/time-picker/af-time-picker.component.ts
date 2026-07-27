import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  AfPlatformService,
  type AfTimePickerDensity,
  type AfTimePickerMinuteStep,
  type AfTimePickerSize,
} from '@argfit-ui/core';
import { AfTimePickerDesktopComponent } from '@argfit-ui/desktop';
import { AfTimePickerMobileComponent } from '@argfit-ui/mobile';

/**
 * Civil time picker.
 *
 * Complements `AfDatePicker`: together they express "the session starts on 27 July at
 * 17:30 in the venue's timezone" without either control pretending to be an instant.
 *
 * The value is a `HH:mm` string on a 24-hour clock. It is not a `Date` and carries no
 * offset on purpose — a schedule that shifts when read from another timezone is a bug,
 * not a feature.
 */
@Component({
  selector: 'af-time-picker',
  imports: [AfTimePickerDesktopComponent, AfTimePickerMobileComponent],
  templateUrl: './af-time-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfTimePickerComponent),
      multi: true,
    },
  ],
})
export class AfTimePickerComponent implements ControlValueAccessor {
  private readonly platform = inject(AfPlatformService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly value = input('');
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  /** Límite inferior como `HH:mm`. */
  readonly min = input<string | undefined>(undefined);
  /** Límite superior como `HH:mm`. */
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
