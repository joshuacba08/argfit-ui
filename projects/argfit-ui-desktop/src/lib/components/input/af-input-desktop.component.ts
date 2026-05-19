import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import type { AfInputSize, AfInputTone, AfInputType } from '@argfit-ui/core';

let nextAfDesktopInputId = 0;

@Component({
  selector: 'af-input-desktop',
  templateUrl: './af-input-desktop.component.html',
  styleUrl: './af-input-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-input-desktop',
    '[attr.data-size]': 'size()',
    '[attr.data-tone]': 'effectiveTone()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
  },
})
export class AfInputDesktopComponent {
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
  readonly prefixIcon = input<string | undefined>(undefined);
  readonly autocomplete = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedInputId = computed(
    () => this.inputId() ?? `af-input-desktop-${++nextAfDesktopInputId}`,
  );

  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);

  protected readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.error()) {
      ids.push(this.errorId());
    } else if (this.hint()) {
      ids.push(this.hintId());
    }
    return ids.length > 0 ? ids.join(' ') : null;
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
