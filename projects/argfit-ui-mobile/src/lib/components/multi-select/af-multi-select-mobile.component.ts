import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import {
  type AfResolvedMultiSelectOption,
  type AfSelectionDensity,
} from '@argfit-ui/core';

import { AfDrawerMobileComponent } from '../drawer/af-drawer-mobile.component';

let nextAfMobileMultiSelectId = 0;

@Component({
  selector: 'af-multi-select-mobile',
  imports: [AfDrawerMobileComponent],
  templateUrl: './af-multi-select-mobile.component.html',
  styleUrl: './af-multi-select-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-multi-select-mobile',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-invalid]': 'errorText() ? "" : null',
  },
})
export class AfMultiSelectMobileComponent {
  private readonly defaultInputId = `af-multi-select-mobile-${++nextAfMobileMultiSelectId}`;

  readonly open = input(false, { transform: booleanAttribute });
  readonly options = input<readonly AfResolvedMultiSelectOption[]>([]);
  readonly selectedLabels = input<readonly string[]>([]);
  readonly summaryText = input('Selecciona opciones');
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
  readonly searchValue = input('');
  readonly inputId = input<string | undefined>(undefined);

  readonly toggleValue = output<unknown>();
  readonly searchChange = output<string>();
  readonly openChange = output<boolean>();
  readonly clear = output<void>();

  protected readonly resolvedInputId = computed(() => this.inputId() ?? this.defaultInputId);
  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);
  protected readonly triggerPreview = computed(() => this.selectedLabels().slice(0, 2));
  protected readonly selectedCount = computed(() => this.options().filter(option => option.selected).length);
  protected readonly limitReached = computed(() => {
    const maxSelected = this.maxSelected();
    return maxSelected !== undefined && this.selectedCount() >= maxSelected;
  });
  protected readonly limitMessage = computed(() => {
    if (!this.limitReached()) {
      return null;
    }

    const maxSelected = this.maxSelected();

    if (maxSelected === undefined) {
      return null;
    }

    return this.selectionLimitText() ?? `Maximo ${maxSelected} seleccionados`;
  });

  protected requestOpen(): void {
    if (this.disabled()) {
      return;
    }

    this.openChange.emit(true);
  }

  protected onDrawerOpenChange(next: boolean): void {
    if (this.disabled()) {
      return;
    }

    this.openChange.emit(next);
  }

  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  protected onToggle(option: AfResolvedMultiSelectOption): void {
    if (this.isOptionDisabled(option)) {
      return;
    }

    this.toggleValue.emit(option.value);
  }

  protected onOptionKeydown(event: KeyboardEvent, option: AfResolvedMultiSelectOption): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.onToggle(option);
    }
  }

  protected onClear(): void {
    if (!this.clearable() || this.disabled() || this.readonly() || this.selectedCount() === 0) {
      return;
    }

    this.clear.emit();
  }

  protected isOptionDisabled(option: AfResolvedMultiSelectOption): boolean {
    return this.disabled() || this.readonly() || option.disabled || (!option.selected && this.limitReached());
  }
}
