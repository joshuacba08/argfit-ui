import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';

import type { AfInputSize, AfInputTone } from '@argfit-ui/core';

interface AfIonPasswordInputDetail {
  readonly value?: string | null;
}

const AF_IONIC_PASSWORD_ELEMENTS = [IonInput] as const;

let nextAfMobilePasswordId = 0;

@Component({
  selector: 'af-password-mobile',
  templateUrl: './af-password-mobile.component.html',
  styleUrl: './af-password-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'af-password-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-tone]': 'effectiveTone()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
    '[attr.data-visible]': 'passwordVisible() ? "" : null',
  },
})
export class AfPasswordMobileComponent {
  private readonly defaultInputId = `af-password-mobile-${++nextAfMobilePasswordId}`;

  constructor() {
    void AF_IONIC_PASSWORD_ELEMENTS;
  }

  readonly value = input<string>('');
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly size = input<AfInputSize>('md');
  readonly tone = input<AfInputTone>('neutral');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly autocomplete = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly passwordVisible = signal(false);
  protected readonly resolvedInputId = computed(() => this.inputId() ?? this.defaultInputId);
  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);
  protected readonly inputType = computed(() => (this.passwordVisible() ? 'text' : 'password'));
  protected readonly resolvedAutocomplete = computed(() => this.autocomplete() ?? 'current-password');
  protected readonly effectiveTone = computed<AfInputTone>(() => (this.error() ? 'danger' : this.tone()));
  protected readonly describedBy = computed(() => {
    if (this.error()) {
      return this.errorId();
    }
    if (this.hint()) {
      return this.hintId();
    }
    return null;
  });

  protected onInput(event: CustomEvent<AfIonPasswordInputDetail>): void {
    this.valueChange.emit(String(event.detail.value ?? ''));
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }

  protected toggleVisibility(): void {
    if (this.disabled()) {
      return;
    }
    this.passwordVisible.update((visible) => !visible);
  }
}
