import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import {
  type AfInputCountDensity,
  type AfInputCountSize,
} from '@argfit-ui/core';

let nextAfMobileInputCountId = 0;

@Component({
  selector: 'af-input-count-mobile',
  templateUrl: './af-input-count-mobile.component.html',
  styleUrl: './af-input-count-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-input-count-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-invalid]': 'errorText() ? "" : null',
  },
})
export class AfInputCountMobileComponent {
  private readonly defaultInputId = `af-input-count-mobile-${++nextAfMobileInputCountId}`;

  readonly label = input<string | undefined>(undefined);
  readonly value = input(0);
  readonly unit = input<string | undefined>(undefined);
  readonly min = input<number | undefined>(undefined);
  readonly max = input<number | undefined>(undefined);
  readonly step = input(1);
  readonly precision = input(0);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly allowManualInput = input(true, { transform: booleanAttribute });
  readonly size = input<AfInputCountSize>('md');
  readonly density = input<AfInputCountDensity>('comfortable');
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<number>();
  readonly increment = output<number>();
  readonly decrement = output<number>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedInputId = computed(() => this.inputId() ?? this.defaultInputId);
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
  protected readonly formattedValue = computed(() => this.formatValue(this.value()));
  protected readonly canDecrement = computed(() => {
    if (this.disabled() || this.readonly()) {
      return false;
    }
    const min = this.min();
    return min === undefined || this.value() > min;
  });
  protected readonly canIncrement = computed(() => {
    if (this.disabled() || this.readonly()) {
      return false;
    }
    const max = this.max();
    return max === undefined || this.value() < max;
  });

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const parsed = Number(target.value);

    if (Number.isNaN(parsed)) {
      return;
    }

    this.valueChange.emit(this.normalizeValue(parsed));
  }

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp': {
        event.preventDefault();
        this.emitIncrement();
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        this.emitDecrement();
        break;
      }
      case 'Home': {
        const min = this.min();
        if (min !== undefined) {
          event.preventDefault();
          this.valueChange.emit(this.normalizeValue(min));
        }
        break;
      }
      case 'End': {
        const max = this.max();
        if (max !== undefined) {
          event.preventDefault();
          this.valueChange.emit(this.normalizeValue(max));
        }
        break;
      }
    }
  }

  protected emitDecrement(): void {
    if (!this.canDecrement()) {
      return;
    }

    const next = this.normalizeValue(this.value() - this.step());
    this.valueChange.emit(next);
    this.decrement.emit(next);
  }

  protected emitIncrement(): void {
    if (!this.canIncrement()) {
      return;
    }

    const next = this.normalizeValue(this.value() + this.step());
    this.valueChange.emit(next);
    this.increment.emit(next);
  }

  protected onFocus(): void {
    this.focusChange.emit(true);
  }

  protected onBlur(): void {
    this.focusChange.emit(false);
  }

  private normalizeValue(value: number): number {
    const precision = Math.max(0, this.precision());
    const factor = 10 ** precision;
    let next = Math.round(value * factor) / factor;

    const min = this.min();
    const max = this.max();

    if (min !== undefined) {
      next = Math.max(min, next);
    }
    if (max !== undefined) {
      next = Math.min(max, next);
    }

    return next;
  }

  private formatValue(value: number): string {
    return value.toFixed(Math.max(0, this.precision()));
  }
}