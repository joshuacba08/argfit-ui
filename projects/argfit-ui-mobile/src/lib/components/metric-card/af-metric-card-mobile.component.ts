import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import type {
    AfBadgeTone,
    AfIconName,
    AfMetricCardDensity,
    AfMetricCardSize,
    AfMetricCardTone,
    AfMetricCardVariant,
    AfMetricTrendDirection,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeMobileComponent } from '../badge/af-badge-mobile.component';

@Component({
  selector: 'af-metric-card-mobile',
  imports: [AfBadgeMobileComponent, AfIconComponent],
  templateUrl: './af-metric-card-mobile.component.html',
  styleUrl: './af-metric-card-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-metric-card-mobile',
    '[class]': 'hostClasses()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-trend]': 'trendDirection() ?? null',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.data-interactive]': 'interactive() ? "" : null',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.role]': 'interactive() ? "button" : null',
    '[attr.tabindex]': 'interactive() ? 0 : null',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class AfMetricCardMobileComponent {
  readonly label = input.required<string>();
  readonly value = input<string | number>('');
  readonly unit = input<string | undefined>(undefined);
  readonly helper = input<string | undefined>(undefined);
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly tone = input<AfMetricCardTone>('primary');
  readonly size = input<AfMetricCardSize>('md');
  readonly density = input<AfMetricCardDensity>('compact');
  readonly variant = input<AfMetricCardVariant>('surface');
  readonly trendValue = input<string | number | undefined>(undefined);
  readonly trendDirection = input<AfMetricTrendDirection | undefined>(undefined);
  readonly trendLabel = input<string | undefined>(undefined);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly pressed = output<MouseEvent | KeyboardEvent>();

  protected readonly hostClasses = computed(() =>
    [
      'af-metric-card-mobile',
      `af-metric-card-mobile--tone-${this.tone()}`,
      `af-metric-card-mobile--${this.variant()}`,
      `af-metric-card-mobile--${this.size()}`,
      `af-metric-card-mobile--density-${this.density()}`,
      this.interactive() ? 'af-metric-card-mobile--interactive' : '',
      this.loading() ? 'af-metric-card-mobile--loading' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly trendBadgeTone = computed<AfBadgeTone>(() => {
    switch (this.trendDirection()) {
      case 'up':
        return 'success';
      case 'down':
        return 'danger';
      case 'flat':
        return 'neutral';
      default:
        return 'neutral';
    }
  });

  protected readonly trendDisplayValue = computed<string | undefined>(() => {
    const value = this.trendValue();
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const text = String(value);
    if (text.startsWith('+') || text.startsWith('-')) {
      return text;
    }

    if (this.trendDirection() === 'up') {
      return `+${text}`;
    }

    if (this.trendDirection() === 'down') {
      return `-${text}`;
    }

    return text;
  });

  protected readonly resolvedAriaLabel = computed(() => {
    const explicit = this.ariaLabel();
    if (explicit) {
      return explicit;
    }

    const unit = this.unit() ? ` ${this.unit()}` : '';
    return `${this.label()}: ${this.value()}${unit}`;
  });

  protected onClick(event: MouseEvent): void {
    if (!this.interactive() || this.loading()) {
      return;
    }
    this.pressed.emit(event);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.interactive() || this.loading()) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.pressed.emit(event);
  }
}
