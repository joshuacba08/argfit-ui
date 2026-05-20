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

import { AfPlatformService, type AfControlSize, type AfFormOption, type AfValidationState } from '@argfit-ui/core';
import { AfRadioGroupDesktopComponent } from '@argfit-ui/desktop';
import { AfRadioGroupMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-radio-group',
  imports: [AfRadioGroupDesktopComponent, AfRadioGroupMobileComponent],
  templateUrl: './af-radio-group.component.html',
  styleUrl: './af-radio-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfRadioGroupComponent),
      multi: true,
    },
  ],
})
export class AfRadioGroupComponent implements ControlValueAccessor {
  private readonly platform = inject(AfPlatformService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly value = input<string>('');
  readonly options = input<readonly AfFormOption[]>([]);
  readonly label = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly state = input<AfValidationState>('default');
  readonly size = input<AfControlSize>('md');
  readonly layout = input<'inline' | 'stacked'>('inline');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
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
