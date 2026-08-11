import {
    booleanAttribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  AfPlatformService,
  type AfControlSize,
  type AfFormOption,
  type AfSelectLoadMoreEvent,
  type AfSelectSearchMode,
  type AfValidationState,
} from '@argfit-ui/core';
import { AfSelectDesktopComponent } from '@argfit-ui/desktop';
import { AfSelectMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-select',
  imports: [AfSelectDesktopComponent, AfSelectMobileComponent],
  templateUrl: './af-select.component.html',
  styleUrl: './af-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfSelectComponent),
      multi: true,
    },
  ],
})
export class AfSelectComponent implements ControlValueAccessor {
  private readonly platform = inject(AfPlatformService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly value = input<string>('');
  readonly options = input<readonly AfFormOption[]>([]);
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  /**
   * Filtra las opciones dentro del propio selector.
   *
   * §19 «Reglas de formularios» lo exige para listas largas. Cada renderer lo resuelve
   * como su plataforma permite: uno filtra dentro del propio panel desplegable; el otro,
   * que no puede filtrar dentro de su control nativo, cambia a un disparador con hoja de
   * búsqueda. El contrato que ve la aplicación es el mismo en ambos.
   */
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly searchPlaceholder = input('Buscar…');
  readonly searchEmptyText = input('Sin resultados');
  readonly searchMode = input<AfSelectSearchMode>('client');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingMore = input(false, { transform: booleanAttribute });
  /** Habilita la solicitud de la siguiente página al acercarse al final de la lista. */
  readonly scrollLoad = input(false, { transform: booleanAttribute });
  /** Indica si el origen todavía tiene páginas disponibles. */
  readonly hasMore = input(true, { transform: booleanAttribute });
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

  protected readonly isMobile = this.platform.isMobile;
  protected readonly internalValue = signal('');
  protected readonly hasInternalValue = signal(false);
  protected readonly cvaDisabled = signal(false);

  private onChange: (value: string) => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };

  protected resolvedValue(): string {
    return this.hasInternalValue() ? this.internalValue() : this.value();
  }

  protected resolvedDisabled(): boolean {
    return this.disabled() || this.cvaDisabled();
  }

  protected onInternalValueChange(next: string): void {
    this.hasInternalValue.set(true);
    this.internalValue.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
  }

  protected onInternalFocusChange(focused: boolean): void {
    if (!focused) {
      this.onTouched();
    }
    this.focusChange.emit(focused);
  }

  writeValue(value: string | null | undefined): void {
    this.hasInternalValue.set(true);
    this.internalValue.set(value ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }
}
