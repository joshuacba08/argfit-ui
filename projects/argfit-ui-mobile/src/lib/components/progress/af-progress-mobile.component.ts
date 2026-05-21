import {
  booleanAttribute,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  AfThemeService,
  type AfProgressSize,
  type AfProgressTone,
  type AfProgressVariant,
} from '@argfit-ui/core';
import { AfVisuallyHiddenComponent } from '@argfit-ui/primitives';

@Component({
  selector: 'af-progress-mobile',
  imports: [AfVisuallyHiddenComponent],
  templateUrl: './af-progress-mobile.component.html',
  styleUrl: './af-progress-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'af-progress-mobile',
    '[class]': 'hostClasses()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-size]': 'size()',
    '[attr.role]': 'role()',
    '[attr.aria-label]': 'accessibleLabel()',
    '[attr.aria-live]': 'variant() === "bar" ? null : "polite"',
    '[attr.aria-valuemin]': 'variant() === "bar" ? "0" : null',
    '[attr.aria-valuemax]': 'variant() === "bar" ? effectiveMaxLabel() : null',
    '[attr.aria-valuenow]': 'ariaValueNow()',
  },
})
export class AfProgressMobileComponent {
  readonly variant = input<AfProgressVariant>('bar');
  readonly tone = input<AfProgressTone>('primary');
  readonly size = input<AfProgressSize>('md');
  readonly value = input(0);
  readonly max = input(100);
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly skeletonWidth = input('100%');

  protected readonly effectiveMax = computed(() => normalizePositiveNumber(this.max(), 100));
  protected readonly clampedValue = computed(() => clampNumber(this.value(), 0, this.effectiveMax()));
  protected readonly progressRatio = computed(() =>
    this.indeterminate() ? undefined : this.clampedValue() / this.effectiveMax(),
  );
  protected readonly role = computed(() => (this.variant() === 'bar' ? 'progressbar' : 'status'));
  protected readonly accessibleLabel = computed(() =>
    this.ariaLabel() ?? (this.variant() === 'bar' ? 'Progress' : 'Loading'),
  );
  protected readonly effectiveMaxLabel = computed(() => String(this.effectiveMax()));
  protected readonly ariaValueNow = computed(() =>
    this.variant() === 'bar' && !this.indeterminate() ? String(this.clampedValue()) : null,
  );
  protected readonly hostClasses = computed(() =>
    [
      'af-progress-mobile',
      `af-progress-mobile--${this.variant()}`,
      `af-progress-mobile--tone-${this.tone()}`,
      `af-progress-mobile--${this.size()}`,
    ].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}

function normalizePositiveNumber(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}