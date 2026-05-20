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
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';

import { AfThemeService, type AfControlSize, type AfFormOption, type AfValidationState } from '@argfit-ui/core';

let nextAfMobileSelectId = 0;

@Component({
  selector: 'af-select-mobile',
  imports: [IonSelect, IonSelectOption],
  templateUrl: './af-select-mobile.component.html',
  styleUrl: './af-select-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-select-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'effectiveState()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfSelectMobileComponent {
  private readonly defaultSelectId = `af-select-mobile-${++nextAfMobileSelectId}`;

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
  protected readonly hintId = computed(() => `${this.resolvedSelectId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedSelectId()}-error`);
  protected readonly effectiveState = computed<AfValidationState>(() => (this.error() ? 'error' : this.state()));
  protected readonly renderedLabel = computed(() => {
    const label = this.label();

    if (!label) {
      return undefined;
    }

    return this.required() ? `${label} *` : label;
  });
  protected readonly describedBy = computed(() => {
    if (this.error()) {
      return this.errorId();
    }
    if (this.hint()) {
      return this.hintId();
    }
    return null;
  });
  protected readonly interfaceOptions = computed(() => ({
    cssClass: 'af-select-mobile__overlay',
    header: this.label() ?? undefined,
    subHeader: this.error() ? undefined : this.hint() ?? undefined,
  }));

  protected onChange(event: CustomEvent<{ value: string | null | undefined }>): void {
    this.valueChange.emit((event.detail.value ?? '') as string);
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }
}
