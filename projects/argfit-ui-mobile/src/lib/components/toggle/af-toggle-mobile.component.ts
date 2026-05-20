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

let nextAfMobileToggleId = 0;

@Component({
  selector: 'af-toggle-mobile',
  templateUrl: './af-toggle-mobile.component.html',
  styleUrl: './af-toggle-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'af-toggle-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'effectiveState()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-checked]': 'checked() ? "" : null',
  },
})
export class AfToggleMobileComponent {
  private readonly defaultToggleId = `af-toggle-mobile-${++nextAfMobileToggleId}`;

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

  protected readonly resolvedToggleId = computed(() => this.inputId() ?? this.defaultToggleId);
  protected readonly hintId = computed(() => `${this.resolvedToggleId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedToggleId()}-error`);
  protected readonly effectiveState = computed<AfValidationState>(() => (this.error() ? 'error' : this.state()));
  protected readonly describedBy = computed(() => {
    if (this.error()) {
      return this.errorId();
    }
    if (this.hint() || this.description()) {
      return this.hintId();
    }
    return null;
  });

  protected toggle(): void {
    if (!this.disabled()) {
      this.checkedChange.emit(!this.checked());
    }
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }
}
