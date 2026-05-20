import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import type { AfControlSize, AfValidationState } from '@argfit-ui/core';

let nextAfMobileCheckboxId = 0;

@Component({
  selector: 'af-checkbox-mobile',
  templateUrl: './af-checkbox-mobile.component.html',
  styleUrl: './af-checkbox-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'af-checkbox-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'effectiveState()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-checked]': 'checked() ? "" : null',
  },
})
export class AfCheckboxMobileComponent {
  private readonly defaultCheckboxId = `af-checkbox-mobile-${++nextAfMobileCheckboxId}`;

  readonly checked = input(false, { transform: booleanAttribute });
  readonly label = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly state = input<AfValidationState>('default');
  readonly size = input<AfControlSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly checkedChange = output<boolean>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedCheckboxId = computed(() => this.inputId() ?? this.defaultCheckboxId);
  protected readonly hintId = computed(() => `${this.resolvedCheckboxId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedCheckboxId()}-error`);
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

  protected onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checkedChange.emit(target.checked);
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }
}
