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
  type AfResolvedMultiSelectOption,
  type AfSelectionDensity,
} from '@argfit-ui/core';
import { AfMultiSelectDesktopComponent } from '@argfit-ui/desktop';
import { AfMultiSelectMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-multi-select',
  imports: [AfMultiSelectDesktopComponent, AfMultiSelectMobileComponent],
  templateUrl: './af-multi-select.component.html',
  styleUrl: './af-multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfMultiSelectComponent),
      multi: true,
    },
  ],
})
export class AfMultiSelectComponent implements ControlValueAccessor {
  private readonly platform = inject(AfPlatformService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly options = input<readonly unknown[]>([]);
  readonly value = input<readonly unknown[]>([]);
  readonly optionLabel = input<string | undefined>(undefined);
  readonly optionValue = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly searchable = input(true, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly maxSelected = input<number | undefined>(undefined);
  readonly selectionLimitText = input<string | undefined>(undefined);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly density = input<AfSelectionDensity>('comfortable');
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<readonly unknown[]>();
  readonly searchChange = output<string>();
  readonly openedChange = output<boolean>();
  readonly clear = output<void>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly open = signal(false);
  protected readonly searchValue = signal('');
  protected readonly internalValue = signal<readonly unknown[]>([]);
  protected readonly hasInternalValue = signal(false);
  protected readonly cvaDisabled = signal(false);

  protected readonly resolvedValue = computed(() =>
    this.hasInternalValue() ? this.internalValue() : this.normalizeSelection(this.value()),
  );
  protected readonly resolvedDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly resolvedPlaceholder = computed(() => this.placeholder() ?? 'Selecciona opciones');
  protected readonly resolvedOptions = computed<readonly AfResolvedMultiSelectOption[]>(() => {
    const selectedValues = this.resolvedValue();
    const query = this.searchValue().trim().toLocaleLowerCase();

    return this.options()
      .map((option, index) => this.resolveOption(option, index, selectedValues))
      .filter(option => (query ? option.searchText.includes(query) : true));
  });
  protected readonly selectedLabels = computed(() =>
    this.options()
      .map((option, index) => this.resolveOption(option, index, this.resolvedValue()))
      .filter(option => option.selected)
      .map(option => option.label),
  );
  protected readonly summaryText = computed(() => {
    const labels = this.selectedLabels();

    if (labels.length === 0) {
      return this.resolvedPlaceholder();
    }

    if (labels.length <= 2) {
      return labels.join(', ');
    }

    return `${labels.length} seleccionados`;
  });

  private onChange: (value: readonly unknown[]) => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };

  protected onToggleValue(value: unknown): void {
    if (this.resolvedDisabled() || this.readonly()) {
      return;
    }

    const current = [...this.resolvedValue()];
    const selectedIndex = current.findIndex(item => Object.is(item, value));

    if (selectedIndex >= 0) {
      current.splice(selectedIndex, 1);
      this.commitValue(current);
      return;
    }

    const maxSelected = this.maxSelected();

    if (maxSelected !== undefined && current.length >= maxSelected) {
      return;
    }

    current.push(value);
    this.commitValue(current);
  }

  protected onSearchValueChange(query: string): void {
    this.searchValue.set(query);
    this.searchChange.emit(query);
  }

  protected onOpenChange(next: boolean): void {
    this.open.set(next);

    if (!next) {
      this.searchValue.set('');
      this.onTouched();
    }

    this.openedChange.emit(next);
  }

  protected onClear(): void {
    if (this.resolvedDisabled() || this.readonly()) {
      return;
    }

    this.commitValue([]);
    this.searchValue.set('');
    this.clear.emit();
  }

  writeValue(value: readonly unknown[] | null | undefined): void {
    this.hasInternalValue.set(true);
    this.internalValue.set(this.normalizeSelection(value));
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: readonly unknown[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  private commitValue(next: readonly unknown[]): void {
    const normalized = this.normalizeSelection(next);
    this.hasInternalValue.set(true);
    this.internalValue.set(normalized);
    this.onChange(normalized);
    this.valueChange.emit(normalized);
    this.cdr.markForCheck();
  }

  private normalizeSelection(value: readonly unknown[] | null | undefined): readonly unknown[] {
    return Array.isArray(value) ? [...value] : [];
  }

  private resolveOption(option: unknown, index: number, selectedValues: readonly unknown[]): AfResolvedMultiSelectOption {
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
        selected: selectedValues.some(selectedValue => Object.is(selectedValue, value)),
      };
    }

    const label = String(option ?? `Opcion ${index + 1}`);

    return {
      key: `${label}-${index}`,
      label,
      value: option,
      searchText: label.toLocaleLowerCase(),
      selected: selectedValues.some(selectedValue => Object.is(selectedValue, option)),
    };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}