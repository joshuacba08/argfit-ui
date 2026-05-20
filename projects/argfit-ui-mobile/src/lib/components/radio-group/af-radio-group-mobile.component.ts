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

import type { AfControlSize, AfFormOption, AfValidationState } from '@argfit-ui/core';

let nextAfMobileRadioGroupId = 0;

@Component({
  selector: 'af-radio-group-mobile',
  templateUrl: './af-radio-group-mobile.component.html',
  styleUrl: './af-radio-group-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'af-radio-group-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'effectiveState()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfRadioGroupMobileComponent {
  private readonly defaultRadioGroupId = `af-radio-group-mobile-${++nextAfMobileRadioGroupId}`;

  readonly value = input<string>('');
  readonly options = input<readonly AfFormOption[]>([]);
  readonly label = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly state = input<AfValidationState>('default');
  readonly size = input<AfControlSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedGroupId = computed(() => this.inputId() ?? this.defaultRadioGroupId);
  protected readonly resolvedName = computed(() => this.name() ?? this.resolvedGroupId());
  protected readonly hintId = computed(() => `${this.resolvedGroupId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedGroupId()}-error`);
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

  protected onOptionChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }
}
