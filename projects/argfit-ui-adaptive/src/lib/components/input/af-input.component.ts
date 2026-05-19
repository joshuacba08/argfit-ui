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
    type AfInputSize,
    type AfInputTone,
    type AfInputType,
} from '@argfit-ui/core';
import { AfInputDesktopComponent } from '@argfit-ui/desktop';
import { AfInputMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-input',
  imports: [AfInputDesktopComponent, AfInputMobileComponent],
  templateUrl: './af-input.component.html',
  styleUrl: './af-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfInputComponent),
      multi: true,
    },
  ],
})
export class AfInputComponent implements ControlValueAccessor {
  private readonly platform = inject(AfPlatformService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly value = input<string>('');
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly type = input<AfInputType>('text');
  readonly size = input<AfInputSize>('md');
  readonly tone = input<AfInputTone>('neutral');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly prefix = input<string | undefined>(undefined);
  readonly suffix = input<string | undefined>(undefined);
  readonly prefixIcon = input<string | undefined>(undefined);
  readonly autocomplete = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly isMobile = this.platform.isMobile;

  // Internal state synced from CVA / consumer.
  protected readonly internalValue = signal<string>('');
  protected readonly cvaDisabled = signal(false);

  private onChange: (value: string) => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };

  protected resolvedValue(): string {
    return this.internalValue() || this.value() || '';
  }

  protected resolvedDisabled(): boolean {
    return this.disabled() || this.cvaDisabled();
  }

  protected onInternalValueChange(next: string): void {
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
    this.internalValue.set(value ?? '');
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
