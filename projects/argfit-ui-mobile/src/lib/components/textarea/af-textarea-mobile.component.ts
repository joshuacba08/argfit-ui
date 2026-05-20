import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    input,
    numberAttribute,
    output,
    ViewEncapsulation,
} from '@angular/core';

import type { AfControlSize, AfValidationState } from '@argfit-ui/core';

let nextAfMobileTextareaId = 0;

function optionalNumberAttribute(value: unknown): number | undefined {
  return value === undefined || value === null || value === '' ? undefined : numberAttribute(value);
}

@Component({
  selector: 'af-textarea-mobile',
  templateUrl: './af-textarea-mobile.component.html',
  styleUrl: './af-textarea-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'af-textarea-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'effectiveState()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
  },
})
export class AfTextareaMobileComponent {
  private readonly defaultTextareaId = `af-textarea-mobile-${++nextAfMobileTextareaId}`;

  readonly value = input<string>('');
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly state = input<AfValidationState>('default');
  readonly size = input<AfControlSize>('md');
  readonly rows = input(3, { transform: numberAttribute });
  readonly maxLength = input<number | undefined, unknown>(undefined, { transform: optionalNumberAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedTextareaId = computed(() => this.inputId() ?? this.defaultTextareaId);
  protected readonly hintId = computed(() => `${this.resolvedTextareaId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedTextareaId()}-error`);
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

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.valueChange.emit(target.value);
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }
}
