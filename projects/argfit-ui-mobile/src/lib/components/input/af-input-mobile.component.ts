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

import type { AfIconName, AfInputSize, AfInputTone, AfInputType } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

let nextAfMobileInputId = 0;

@Component({
  selector: 'af-input-mobile',
  imports: [AfIconComponent],
  templateUrl: './af-input-mobile.component.html',
  styleUrl: './af-input-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'af-input-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-tone]': 'effectiveTone()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
  },
})
export class AfInputMobileComponent {
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
  readonly prefixIcon = input<AfIconName | undefined>(undefined);
  readonly autocomplete = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedInputId = computed(
    () => this.inputId() ?? `af-input-mobile-${++nextAfMobileInputId}`,
  );

  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);

  protected readonly describedBy = computed(() => {
    if (this.error()) {
      return this.errorId();
    }
    if (this.hint()) {
      return this.hintId();
    }
    return null;
  });

  protected readonly effectiveTone = computed<AfInputTone>(() =>
    this.error() ? 'danger' : this.tone(),
  );

  protected onInput(event: Event): void {
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
