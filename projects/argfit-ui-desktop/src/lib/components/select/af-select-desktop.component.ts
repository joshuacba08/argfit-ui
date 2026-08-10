import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

import {
  AfThemeService,
  type AfControlSize,
  type AfFormOption,
  type AfSelectLoadMoreEvent,
  type AfSelectSearchMode,
  type AfValidationState,
} from '@argfit-ui/core';

let nextAfDesktopSelectId = 0;

type AfSelectChangeEvent = {
  readonly value?: unknown;
};

type AfSelectFilterEvent = {
  readonly filter?: string;
};

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
export class AfSelectDesktopComponent implements OnDestroy {
  private readonly defaultSelectId = `af-select-desktop-${++nextAfDesktopSelectId}`;
  private scrollListenerRemover: (() => void) | null = null;
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private currentFilterQuery = '';

  readonly value = input<string>('');
  readonly options = input<readonly AfFormOption[]>([]);
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  /** §19 «Reglas de formularios»: selectores con búsqueda para listas largas. */
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly searchPlaceholder = input('Buscar…');
  readonly searchEmptyText = input('Sin resultados');
  readonly searchMode = input<AfSelectSearchMode>('client');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingMore = input(false, { transform: booleanAttribute });
  readonly scrollLoad = input(false, { transform: booleanAttribute });
  readonly scrollThreshold = input(50);
  readonly debounceTime = input(300);
  readonly selectedOption = input<AfFormOption | null>(null);
  readonly error = input<string | undefined>(undefined);
  readonly state = input<AfValidationState>('default');
  readonly size = input<AfControlSize>('md');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();
  readonly searchChange = output<string>();
  readonly loadMore = output<AfSelectLoadMoreEvent>();
  readonly clearSearch = output<void>();

  constructor() {
    inject(AfThemeService);
  }

  ngOnDestroy(): void {
    this.removeScrollListener();
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  }

  protected readonly resolvedSelectId = computed(() => this.inputId() ?? this.defaultSelectId);
  protected readonly labelId = computed(() => `${this.resolvedSelectId()}-label`);
  protected readonly ariaLabelledBy = computed(() => (this.label() ? this.labelId() : undefined));
  protected readonly selectOptions = computed(() => {
    const opts = [...this.options()];
    const val = this.value();
    const selected = this.selectedOption();
    if (val && selected && selected.value === val && !opts.some((option) => option.value === val)) {
      return [selected, ...opts];
    }
    return opts;
  });
  protected readonly hintId = computed(() => `${this.resolvedSelectId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedSelectId()}-error`);
  protected readonly effectiveState = computed<AfValidationState>(() =>
    this.error() ? 'error' : this.state(),
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
  protected readonly selectPt = computed(() => ({
    root: {
      'aria-describedby': this.describedBy() ?? undefined,
      'aria-invalid': this.error() ? 'true' : undefined,
      'aria-required': this.required() ? 'true' : undefined,
    },
  }));

  protected onChange(event: AfSelectChangeEvent): void {
    const selectedValue = event.value;

    this.valueChange.emit(
      typeof selectedValue === 'string' ? selectedValue : String(selectedValue ?? ''),
    );
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }

  protected onFilter(event: AfSelectFilterEvent): void {
    const query = event.filter ?? '';
    this.currentFilterQuery = query;

    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.searchChange.emit(query);
    }, this.debounceTime());
  }

  protected onShow(): void {
    if (!this.scrollLoad()) {
      return;
    }
    setTimeout(() => {
      // PrimeNG mueve el panel a <body>. Resolverlo desde el id propio evita que dos
      // selects abiertos/animándose compartan por accidente el listener de paginado.
      const trigger = document.getElementById(this.resolvedSelectId());
      const listId = trigger?.getAttribute('aria-controls');
      const list = listId ? document.getElementById(listId) : null;
      const container = list?.closest(
        '.p-select-list-container, [data-pc-section="listcontainer"]',
      ) as HTMLElement | null;
      if (container) {
        const handler = (e: Event) => this.onListScroll(e);
        container.addEventListener('scroll', handler, { passive: true });
        this.scrollListenerRemover = () => container.removeEventListener('scroll', handler);
      }
    }, 50);
  }

  protected onHide(): void {
    this.removeScrollListener();
  }

  private onListScroll(event: Event): void {
    if (!this.scrollLoad() || this.loading() || this.loadingMore()) {
      return;
    }
    const target = event.target as HTMLElement;
    if (
      target &&
      target.scrollTop + target.clientHeight >= target.scrollHeight - this.scrollThreshold()
    ) {
      this.loadMore.emit({ query: this.currentFilterQuery, offset: this.options().length });
    }
  }

  private removeScrollListener(): void {
    if (this.scrollListenerRemover) {
      this.scrollListenerRemover();
      this.scrollListenerRemover = null;
    }
  }
}
