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

import { AfPlatformService, type AfControlSize, type AfValidationState } from '@argfit-ui/core';
import { AfToggleDesktopComponent } from '@argfit-ui/desktop';
import { AfToggleMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-toggle',
  imports: [AfToggleDesktopComponent, AfToggleMobileComponent],
  templateUrl: './af-toggle.component.html',
  styleUrl: './af-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfToggleComponent),
      multi: true,
    },
  ],
})
export class AfToggleComponent implements ControlValueAccessor {
  private readonly platform = inject(AfPlatformService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly checked = input(false, { transform: booleanAttribute });
  readonly label = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly state = input<AfValidationState>('default');
  readonly size = input<AfControlSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly inputId = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly checkedChange = output<boolean>();
  readonly focusChange = output<boolean>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly internalChecked = signal(false);
  protected readonly hasInternalChecked = signal(false);
  protected readonly cvaDisabled = signal(false);

  private onChange: (value: boolean) => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };

  protected resolvedChecked(): boolean {
    return this.hasInternalChecked() ? this.internalChecked() : this.checked();
  }

  protected resolvedDisabled(): boolean {
    return this.disabled() || this.cvaDisabled();
  }

  protected onInternalCheckedChange(next: boolean): void {
    this.hasInternalChecked.set(true);
    this.internalChecked.set(next);
    this.onChange(next);
    this.checkedChange.emit(next);
  }

  protected onInternalFocusChange(focused: boolean): void {
    if (!focused) {
      this.onTouched();
    }
    this.focusChange.emit(focused);
  }

  writeValue(value: boolean | null | undefined): void {
    this.hasInternalChecked.set(true);
    this.internalChecked.set(Boolean(value));
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: boolean) => void): void {
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
