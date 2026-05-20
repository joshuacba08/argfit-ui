import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
  inject,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select, type SelectChangeEvent } from 'primeng/select';

import { AfThemeService, type AfControlSize, type AfFormOption, type AfValidationState } from '@argfit-ui/core';

let nextAfDesktopSelectId = 0;

@Component({
  selector: 'af-select-desktop',
  imports: [FormsModule, Select],
  templateUrl: './af-select-desktop.component.html',
  styleUrl: './af-select-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-select-desktop',
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'effectiveState()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfSelectDesktopComponent {
  private readonly defaultSelectId = `af-select-desktop-${++nextAfDesktopSelectId}`;

  readonly value = input<string>('');
  readonly options = input<readonly AfFormOption[]>([]);
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly state = input<AfValidationState>('default');
  readonly size = input<AfControlSize>('md');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  constructor() {
    inject(AfThemeService);
  }

  protected readonly resolvedSelectId = computed(() => this.inputId() ?? this.defaultSelectId);
  protected readonly labelId = computed(() => `${this.resolvedSelectId()}-label`);
  protected readonly ariaLabelledBy = computed(() => (this.label() ? this.labelId() : undefined));
  protected readonly selectOptions = computed(() => [...this.options()]);
  protected readonly hintId = computed(() => `${this.resolvedSelectId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedSelectId()}-error`);
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
  protected readonly selectPt = computed(() => ({
    root: {
      'aria-describedby': this.describedBy() ?? undefined,
      'aria-invalid': this.error() ? 'true' : undefined,
      'aria-required': this.required() ? 'true' : undefined,
    },
  }));

  protected onChange(event: SelectChangeEvent): void {
    this.valueChange.emit((event.value ?? '') as string);
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }
}
