import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    numberAttribute,
    output,
    ViewEncapsulation,
} from '@angular/core';

import {
    afClampToStep,
    type AfSliderDensity,
    type AfSliderMark,
    type AfSliderSize,
    type AfSliderValueDisplay,
} from '@argfit-ui/core';

let nextAfMobileSliderId = 0;

/**
 * Mobile renderer for `AfSlider`.
 *
 * Built on the native range input rather than a vendor widget: keyboard stepping, the
 * `slider` role, value announcements and pointer capture all come for free and stay
 * correct, which is a lot to re-earn in a custom implementation.
 */
@Component({
  selector: 'af-slider-mobile',
  templateUrl: './af-slider-mobile.component.html',
  styleUrl: './af-slider-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-slider-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
    '[attr.data-invalid]': 'errorText() ? "" : null',
  },
})
export class AfSliderMobileComponent {
  private readonly defaultInputId = `af-slider-mobile-${++nextAfMobileSliderId}`;

  readonly label = input<string | undefined>(undefined);
  readonly value = input(0, { transform: numberAttribute });
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  readonly unit = input<string | undefined>(undefined);
  readonly marks = input<readonly AfSliderMark[]>([]);
  readonly valueDisplay = input<AfSliderValueDisplay>('inline');
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly size = input<AfSliderSize>('md');
  readonly density = input<AfSliderDensity>('comfortable');
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Texto que anuncia el valor actual. Sin él se anuncia el número a secas. */
  readonly ariaValueText = input<string | undefined>(undefined);

  readonly valueChange = output<number>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedInputId = computed(() => this.inputId() ?? this.defaultInputId);
  protected readonly labelId = computed(() => `${this.resolvedInputId()}-label`);
  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);
  protected readonly describedBy = computed(() => {
    if (this.errorText()) {
      return this.errorId();
    }
    if (this.helperText()) {
      return this.hintId();
    }
    return null;
  });

  protected readonly boundedValue = computed(() =>
    afClampToStep(this.value(), this.min(), this.max(), this.step()),
  );

  /** Porcentaje recorrido, para pintar la parte activa de la barra. */
  protected readonly progress = computed(() => {
    const span = this.max() - this.min();
    if (span <= 0) {
      return 0;
    }
    return ((this.boundedValue() - this.min()) / span) * 100;
  });

  protected readonly displayValue = computed(() => {
    const unit = this.unit();
    return unit ? `${this.boundedValue()} ${unit}` : `${this.boundedValue()}`;
  });

  protected readonly resolvedValueText = computed(
    () => this.ariaValueText() ?? this.markLabelFor(this.boundedValue()) ?? this.displayValue(),
  );

  protected onInput(event: Event): void {
    if (this.readonly() || this.disabled()) {
      return;
    }

    const target = event.target as HTMLInputElement;
    this.valueChange.emit(
      afClampToStep(Number(target.value), this.min(), this.max(), this.step()),
    );
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }

  /** Posición de una marca en porcentaje, para colocarla bajo su punto de la barra. */
  protected markOffset(mark: AfSliderMark): number {
    const span = this.max() - this.min();
    if (span <= 0) {
      return 0;
    }
    return ((mark.value - this.min()) / span) * 100;
  }

  private markLabelFor(value: number): string | undefined {
    return this.marks().find((mark) => mark.value === value)?.label;
  }
}
