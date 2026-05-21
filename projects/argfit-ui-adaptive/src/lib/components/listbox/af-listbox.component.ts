import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  AfPlatformService,
  type AfListboxSelectionMode,
  type AfListboxValue,
  type AfResolvedListboxOption,
  type AfSelectionDensity,
} from '@argfit-ui/core';
import { AfListboxDesktopComponent } from '@argfit-ui/desktop';
import { AfListboxMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-listbox',
  imports: [AfListboxDesktopComponent, AfListboxMobileComponent],
  templateUrl: './af-listbox.component.html',
  styleUrl: './af-listbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfListboxComponent),
      multi: true,
    },
  ],
})
export class AfListboxComponent implements ControlValueAccessor {
  private readonly platform = inject(AfPlatformService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly options = input<readonly unknown[]>([]);
  readonly value = input<AfListboxValue>(null);
  readonly optionLabel = input<string | undefined>(undefined);
  readonly optionValue = input<string | undefined>(undefined);
  readonly selectionMode = input<AfListboxSelectionMode>('single');
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly density = input<AfSelectionDensity>('comfortable');
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<AfListboxValue>();
  readonly focusChange = output<boolean>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly internalValue = signal<AfListboxValue>(null);
  protected readonly hasInternalValue = signal(false);
  protected readonly cvaDisabled = signal(false);

  protected readonly resolvedValue = computed<AfListboxValue>(() =>
    this.hasInternalValue()
      ? this.normalizeSelection(this.internalValue())
      : this.normalizeSelection(this.value()),
  );
  protected readonly resolvedDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly resolvedOptions = computed<readonly AfResolvedListboxOption[]>(() => {
    const selectedValue = this.resolvedValue();

    return this.options().map((option, index) => this.resolveOption(option, index, selectedValue));
  });

  private onChange: (value: AfListboxValue) => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };

  protected onToggleValue(value: unknown): void {
    if (this.resolvedDisabled() || this.readonly()) {
      return;
    }

    const nextValue = this.selectionMode() === 'multiple'
      ? this.toggleMultipleValue(value)
      : value;

    this.commitValue(nextValue);
  }

  protected onInternalFocusChange(focused: boolean): void {
    if (!focused) {
      this.onTouched();
    }

    this.focusChange.emit(focused);
  }

  writeValue(value: AfListboxValue | null | undefined): void {
    this.hasInternalValue.set(true);
    this.internalValue.set(this.normalizeSelection(value));
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: AfListboxValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  private commitValue(next: AfListboxValue): void {
    const normalized = this.normalizeSelection(next);
    this.hasInternalValue.set(true);
    this.internalValue.set(normalized);
    this.onChange(normalized);
    this.valueChange.emit(normalized);
    this.cdr.markForCheck();
  }

  private toggleMultipleValue(value: unknown): readonly unknown[] {
    const resolvedValue = this.resolvedValue();
    const current = Array.isArray(resolvedValue) ? [...resolvedValue] : [];
    const selectedIndex = current.findIndex(item => Object.is(item, value));

    if (selectedIndex >= 0) {
      current.splice(selectedIndex, 1);
      return current;
    }

    current.push(value);
    return current;
  }

  private normalizeSelection(value: AfListboxValue | undefined): AfListboxValue {
    if (this.selectionMode() === 'multiple') {
      if (Array.isArray(value)) {
        return [...value];
      }

      return value == null ? [] : [value];
    }

    if (Array.isArray(value)) {
      return value[0] ?? null;
    }

    return value ?? null;
  }

  private resolveOption(option: unknown, index: number, selectedValue: AfListboxValue): AfResolvedListboxOption {
    if (this.isRecord(option)) {
      const labelKey = this.optionLabel();
      const valueKey = this.optionValue();
      const rawLabel = labelKey ? option[labelKey] : option['label'];
      const rawValue = valueKey ? option[valueKey] : option['value'];
      const label = typeof rawLabel === 'string' ? rawLabel : String(rawLabel ?? `Opcion ${index + 1}`);
      const value = rawValue ?? option;
      const hint = typeof option['hint'] === 'string' ? option['hint'] : undefined;
      const searchText = typeof option['searchText'] === 'string' ? option['searchText'] : `${label} ${hint ?? ''}`;
      const disabled = option['disabled'] === true;

      return {
        key: `${label}-${index}`,
        label,
        value,
        hint,
        disabled,
        searchText: searchText.toLocaleLowerCase(),
        selected: this.isSelectedValue(selectedValue, value),
      };
    }

    const label = String(option ?? `Opcion ${index + 1}`);

    return {
      key: `${label}-${index}`,
      label,
      value: option,
      searchText: label.toLocaleLowerCase(),
      selected: this.isSelectedValue(selectedValue, option),
    };
  }

  private isSelectedValue(selectedValue: AfListboxValue, candidate: unknown): boolean {
    if (Array.isArray(selectedValue)) {
      return selectedValue.some(value => Object.is(value, candidate));
    }

    return Object.is(selectedValue, candidate);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
