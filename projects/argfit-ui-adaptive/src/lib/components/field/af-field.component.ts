import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import type { AfFieldDensity, AfFieldLabelMode, AfFieldState } from '@argfit-ui/core';

@Component({
  selector: 'af-field',
  templateUrl: './af-field.component.html',
  styleUrl: './af-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'af-field',
    '[attr.data-density]': 'density()',
    '[attr.data-label-mode]': 'labelMode()',
    '[attr.data-state]': 'effectiveState()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
  },
})
export class AfFieldComponent {
  readonly label = input<string | undefined>(undefined);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly density = input<AfFieldDensity>('comfortable');
  readonly labelMode = input<AfFieldLabelMode>('stacked');
  readonly state = input<AfFieldState>('default');
  readonly inputId = input<string | undefined>(undefined);

  protected readonly hintId = computed(() => (this.inputId() ? `${this.inputId()}-hint` : null));
  protected readonly errorId = computed(() => (this.inputId() ? `${this.inputId()}-error` : null));
  protected readonly effectiveState = computed<AfFieldState>(() => (this.errorText() ? 'error' : this.state()));
}
