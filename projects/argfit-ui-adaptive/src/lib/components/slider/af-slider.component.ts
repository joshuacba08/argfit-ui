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
  type AfSliderDensity,
  type AfSliderMark,
  type AfSliderSize,
  type AfSliderValueDisplay,
} from '@argfit-ui/core';
import { AfSliderDesktopComponent } from '@argfit-ui/desktop';
import { AfSliderMobileComponent } from '@argfit-ui/mobile';

/**
 * Bounded numeric input along a continuum.
 *
 * Use it when the position on the scale is itself the information — a perceived-effort
 * rating, a 1–10 assessment, a threshold. When the exact figure matters more than the
 * relation to the range, `AfInputCount` is the better control.
 *
 * The mobile renderer keeps the thumb above the 44 px touch target at every size: the
 * control is used standing up, outdoors, sometimes with gloves on.
 */
@Component({
  selector: 'af-slider',
  imports: [AfSliderDesktopComponent, AfSliderMobileComponent],
  templateUrl: './af-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfSliderComponent),
      multi: true,
    },
  ],
})
export class AfSliderComponent implements ControlValueAccessor {
  private readonly platform = inject(AfPlatformService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly label = input<string | undefined>(undefined);
  readonly value = input(0, { transform: numberAttribute });
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  readonly unit = input<string | undefined>(undefined);
  /** Paradas etiquetadas bajo la barra. Convierten un número en un juicio interpretable. */
  readonly marks = input<readonly AfSliderMark[]>([]);
  readonly valueDisplay = input<AfSliderValueDisplay>('inline');
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly size = input<AfSliderSize>('md');
  readonly density = input<AfSliderDensity>('comfortable');
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaValueText = input<string | undefined>(undefined);

  readonly valueChange = output<number>();
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
    return this.hasInternalValue() ? this.internalValue() : this.value();
  }

  protected resolvedDisabled(): boolean {
    return this.disabled() || this.cvaDisabled();
  }

  protected onInternalValueChange(next: number): void {
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

  writeValue(value: number | null | undefined): void {
    this.hasInternalValue.set(true);
    this.internalValue.set(typeof value === 'number' && Number.isFinite(value) ? value : this.min());
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
}
