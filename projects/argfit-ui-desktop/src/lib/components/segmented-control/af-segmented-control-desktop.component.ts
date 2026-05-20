import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import type { AfControlSize, AfFormOption, AfValidationState } from '@argfit-ui/core';

let nextAfDesktopSegmentedControlId = 0;

@Component({
  selector: 'af-segmented-control-desktop',
  templateUrl: './af-segmented-control-desktop.component.html',
  styleUrl: './af-segmented-control-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-segmented-control-desktop',
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'effectiveState()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfSegmentedControlDesktopComponent {
  private readonly defaultSegmentedControlId = `af-segmented-control-desktop-${++nextAfDesktopSegmentedControlId}`;

  readonly value = input<string>('');
  readonly options = input<readonly AfFormOption[]>([]);
  readonly label = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly state = input<AfValidationState>('default');
  readonly size = input<AfControlSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly inputId = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedSegmentedControlId = computed(() => this.inputId() ?? this.defaultSegmentedControlId);
  protected readonly labelId = computed(() => `${this.resolvedSegmentedControlId()}-label`);
  protected readonly hintId = computed(() => `${this.resolvedSegmentedControlId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedSegmentedControlId()}-error`);
  protected readonly effectiveState = computed<AfValidationState>(() => (this.error() ? 'error' : this.state()));
  protected readonly describedBy = computed(() => {
    if (this.error()) {
      return this.errorId();
    }
    if (this.hint()) {
      return this.hintId();
    }
    return null;
  });

  protected selectOption(option: AfFormOption): void {
    if (!this.disabled() && !option.disabled && option.value !== this.value()) {
      this.valueChange.emit(String(option.value));
    }
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }
}
