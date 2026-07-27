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

import {
  type AfListboxSelectionMode,
  type AfResolvedListboxOption,
  type AfSelectionDensity,
} from '@argfit-ui/core';

let nextAfDesktopListboxId = 0;

@Component({
  selector: 'af-listbox-desktop',
  templateUrl: './af-listbox-desktop.component.html',
  styleUrl: './af-listbox-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-listbox-desktop',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-invalid]': 'errorText() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
  },
})
export class AfListboxDesktopComponent {
  private readonly defaultInputId = `af-listbox-desktop-${++nextAfDesktopListboxId}`;

  readonly options = input<readonly AfResolvedListboxOption[]>([]);
  readonly selectionMode = input<AfListboxSelectionMode>('single');
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly density = input<AfSelectionDensity>('comfortable');
  readonly inputId = input<string | undefined>(undefined);
  /** §19: selectores con búsqueda para listas largas. */
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly searchPlaceholder = input('Buscar…');
  readonly searchEmptyText = input('Sin resultados');

  readonly valueChange = output<unknown>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedInputId = computed(() => this.inputId() ?? this.defaultInputId);
  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);
  protected readonly emptyText = computed(() => this.placeholder() ?? 'No hay opciones disponibles.');

  protected readonly query = signal('');

  /** El filtro no altera la selección: solo decide qué se ve. */
  protected readonly visibleOptions = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (!this.searchable() || query === '') {
      return this.options();
    }
    return this.options().filter((option) => option.label.toLowerCase().includes(query));
  });

  protected onQueryInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onToggle(option: AfResolvedListboxOption): void {
    if (this.isOptionDisabled(option)) {
      return;
    }

    this.valueChange.emit(option.value);
  }

  protected onOptionFocus(): void {
    this.focusChange.emit(true);
  }

  protected onOptionBlur(event: FocusEvent): void {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const panel = currentTarget?.closest('.af-listbox-desktop__panel');
    const nextTarget = event.relatedTarget as HTMLElement | null;

    if (panel && nextTarget && panel.contains(nextTarget)) {
      return;
    }

    this.focusChange.emit(false);
  }

  protected onOptionKeydown(event: KeyboardEvent, option: AfResolvedListboxOption): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.onToggle(option);
      return;
    }

    const currentTarget = event.currentTarget as HTMLButtonElement | null;

    if (!currentTarget) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusSibling(currentTarget, 'next');
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusSibling(currentTarget, 'previous');
    }
  }

  protected isOptionDisabled(option: AfResolvedListboxOption): boolean {
    return this.disabled() || this.readonly() || option.disabled === true;
  }

  private focusSibling(currentTarget: HTMLButtonElement, direction: 'next' | 'previous'): void {
    const sibling = direction === 'next' ? currentTarget.nextElementSibling : currentTarget.previousElementSibling;

    if (sibling instanceof HTMLButtonElement && !sibling.disabled) {
      sibling.focus();
    }
  }
}
