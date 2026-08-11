import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';

import {
  AfThemeService,
  type AfControlSize,
  type AfFormOption,
  type AfSelectLoadMoreEvent,
  type AfSelectSearchMode,
  type AfValidationState,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfDialogMobileComponent } from '../dialog/af-dialog-mobile.component';

let nextAfMobileSelectId = 0;

@Component({
  selector: 'af-select-mobile',
  imports: [IonSelect, IonSelectOption, AfIconComponent, AfDialogMobileComponent],
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
export class AfSelectMobileComponent implements OnDestroy {
  private readonly defaultSelectId = `af-select-mobile-${++nextAfMobileSelectId}`;
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private lastLoadRequestKey: string | null = null;

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
  /**
   * §19 «Reglas de formularios»: selectores con búsqueda para listas largas.
   *
   * Ionic no filtra dentro de `ion-select`, así que este modo cambia de control: un
   * disparador que abre una hoja con campo de búsqueda y lista, el mismo patrón que ya
   * usan los selectores de fecha y hora en esta capa.
   */
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly searchPlaceholder = input('Buscar…');
  readonly searchEmptyText = input('Sin resultados');
  readonly searchMode = input<AfSelectSearchMode>('client');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingMore = input(false, { transform: booleanAttribute });
  readonly scrollLoad = input(false, { transform: booleanAttribute });
  readonly hasMore = input(true, { transform: booleanAttribute });
  readonly scrollThreshold = input(50);
  readonly debounceTime = input(300);
  readonly selectedOption = input<AfFormOption | null>(null);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();
  readonly searchChange = output<string>();
  readonly loadMore = output<AfSelectLoadMoreEvent>();
  readonly clearSearch = output<void>();

  protected readonly sheetOpen = signal(false);
  protected readonly query = signal('');

  ngOnDestroy(): void {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  }

  protected readonly selectOptions = computed(() => {
    const opts = [...this.options()];
    const val = this.value();
    const selected = this.selectedOption();
    if (val && selected && selected.value === val && !opts.some((option) => option.value === val)) {
      return [selected, ...opts];
    }
    return opts;
  });

  protected readonly filteredOptions = computed(() => {
    if (this.searchMode() === 'server') {
      return this.selectOptions();
    }
    const query = this.query().trim().toLowerCase();
    if (query === '') {
      return this.selectOptions();
    }
    return this.selectOptions().filter((option) => option.label.toLowerCase().includes(query));
  });

  protected readonly selectedLabel = computed(
    () =>
      this.selectOptions().find((option) => option.value === this.value())?.label ??
      this.placeholder() ??
      'Selecciona una opción',
  );

  protected readonly sheetId = computed(() => `${this.resolvedSelectId()}-sheet`);

  protected openSheet(): void {
    if (this.disabled()) {
      return;
    }
    this.query.set('');
    this.lastLoadRequestKey = null;
    this.sheetOpen.set(true);
    this.focusChange.emit(true);
  }

  protected onSheetOpenChange(open: boolean): void {
    if (!open) {
      this.sheetOpen.set(false);
      this.focusChange.emit(false);
    }
  }

  protected chooseOption(option: AfFormOption): void {
    if (option.disabled) {
      return;
    }
    this.valueChange.emit(String(option.value));
    this.sheetOpen.set(false);
    this.focusChange.emit(false);
  }

  protected onQueryInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.query.set(query);

    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.searchChange.emit(query);
    }, this.debounceTime());
  }

  protected clearQuery(): void {
    this.query.set('');
    this.clearSearch.emit();
    this.searchChange.emit('');
  }

  protected onListScroll(event: Event): void {
    if (!this.scrollLoad() || !this.hasMore() || this.loading() || this.loadingMore()) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target && target.scrollTop + target.clientHeight >= target.scrollHeight - this.scrollThreshold()) {
      const query = this.query();
      const offset = this.options().length;
      const requestKey = `${query}\u0000${offset}`;
      if (requestKey === this.lastLoadRequestKey) {
        return;
      }
      this.lastLoadRequestKey = requestKey;
      this.loadMore.emit({ query, offset });
    }
  }

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

