import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { PasswordDirective } from 'primeng/password';

import type { AfIconName, AfInputSize, AfInputTone } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

let nextAfDesktopPasswordId = 0;

@Component({
  selector: 'af-password-desktop',
  imports: [AfIconComponent, PasswordDirective],
  templateUrl: './af-password-desktop.component.html',
  styleUrl: './af-password-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-password-desktop',
    '[attr.data-size]': 'size()',
    '[attr.data-tone]': 'effectiveTone()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
    '[attr.data-visible]': 'passwordVisible() ? "" : null',
  },
})
export class AfPasswordDesktopComponent {
  private readonly defaultInputId = `af-password-desktop-${++nextAfDesktopPasswordId}`;

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
  readonly feedback = input(false, { transform: booleanAttribute });
  readonly revealLabel = input('Mostrar contrasena');
  readonly hideLabel = input('Ocultar contrasena');
  readonly promptLabel = input('Ingresa una contrasena');
  readonly weakLabel = input('Debil');
  readonly mediumLabel = input('Media');
  readonly strongLabel = input('Fuerte');

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly passwordVisible = signal(false);
  protected readonly resolvedInputId = computed(() => this.inputId() ?? this.defaultInputId);
  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);
  protected readonly resolvedAutocomplete = computed(() => this.autocomplete() ?? 'current-password');
  protected readonly effectiveTone = computed<AfInputTone>(() => (this.error() ? 'danger' : this.tone()));
  protected readonly toggleLabel = computed(() =>
    this.passwordVisible() ? this.hideLabel() : this.revealLabel(),
  );
  protected readonly toggleIcon = computed<AfIconName>(() =>
    this.passwordVisible() ? 'eye-off' : 'eye',
  );
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
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
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
