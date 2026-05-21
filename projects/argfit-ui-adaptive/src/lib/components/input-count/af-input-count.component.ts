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
  type AfInputCountDensity,
  type AfInputCountSize,
} from '@argfit-ui/core';
import { AfInputCountDesktopComponent } from '@argfit-ui/desktop';
import { AfInputCountMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-input-count',
  imports: [AfInputCountDesktopComponent, AfInputCountMobileComponent],
  templateUrl: './af-input-count.component.html',
  styleUrl: './af-input-count.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfInputCountComponent),
      multi: true,
    },
  ],
})
export class AfInputCountComponent implements ControlValueAccessor {
  private readonly platform = inject(AfPlatformService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly label = input<string | undefined>(undefined);
  readonly value = input(0);
  readonly unit = input<string | undefined>(undefined);
  readonly min = input<number | undefined>(undefined);
  readonly max = input<number | undefined>(undefined);
  readonly step = input(1);
  readonly precision = input(0);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly allowManualInput = input(true, { transform: booleanAttribute });
  readonly size = input<AfInputCountSize>('md');
  readonly density = input<AfInputCountDensity>('comfortable');
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<number>();
  readonly increment = output<number>();
  readonly decrement = output<number>();
  readonly focusChange = output<boolean>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly internalValue = signal(0);
  protected readonly hasInternalValue = signal(false);
  protected readonly cvaDisabled = signal(false);

  private onChange: (value: number) => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };

  protected resolvedValue(): number {
    return this.hasInternalValue() ? this.internalValue() : this.normalizeValue(this.value());
  }

  protected resolvedDisabled(): boolean {
    return this.disabled() || this.cvaDisabled();
  }

  protected onInternalValueChange(next: number): void {
    const normalized = this.normalizeValue(next);
    this.hasInternalValue.set(true);
    this.internalValue.set(normalized);
    this.onChange(normalized);
    this.valueChange.emit(normalized);
  }

  protected onInternalIncrement(next: number): void {
    this.increment.emit(next);
  }

  protected onInternalDecrement(next: number): void {
    this.decrement.emit(next);
  }

  protected onInternalFocusChange(focused: boolean): void {
    if (!focused) {
      this.onTouched();
    }
    this.focusChange.emit(focused);
  }

  writeValue(value: number | null | undefined): void {
    this.hasInternalValue.set(true);
    this.internalValue.set(this.normalizeValue(value ?? this.min() ?? 0));
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  private normalizeValue(value: number): number {
    const precision = Math.max(0, this.precision());
    const factor = 10 ** precision;
    let next = Number.isFinite(value) ? Math.round(value * factor) / factor : 0;

    const min = this.min();
    const max = this.max();

    if (min !== undefined) {
      next = Math.max(min, next);
    }
    if (max !== undefined) {
      next = Math.min(max, next);
    }

    return next;
  }
}