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
    AF_METRIC_PROVENANCE_LABEL,
    type AfBadgeTone,
    type AfIconName,
    type AfMetricCardDensity,
    type AfMetricCardSize,
    type AfMetricCardState,
    type AfMetricCardTone,
    type AfMetricCardVariant,
    type AfMetricProvenance,
    type AfMetricSample,
    type AfMetricTrendDirection,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeDesktopComponent } from '../badge/af-badge-desktop.component';

@Component({
  selector: 'af-metric-card-desktop',
  imports: [AfBadgeDesktopComponent, AfIconComponent],
  templateUrl: './af-metric-card-desktop.component.html',
  styleUrl: './af-metric-card-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-metric-card-desktop',
    '[class]': 'hostClasses()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-trend]': 'trendDirection() ?? null',
    '[attr.data-state]': 'effectiveState()',
    '[attr.data-loading]': 'effectiveState() === "loading" ? "" : null',
    '[attr.data-interactive]': 'interactive() ? "" : null',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[attr.aria-busy]': 'effectiveState() === "loading" ? "true" : null',
    '[attr.role]': 'interactive() ? "button" : null',
    '[attr.tabindex]': 'interactive() ? 0 : null',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class AfMetricCardDesktopComponent {
  readonly label = input.required<string>();
  readonly value = input<string | number>('');
  readonly unit = input<string | undefined>(undefined);
  readonly helper = input<string | undefined>(undefined);
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly tone = input<AfMetricCardTone>('primary');
  readonly size = input<AfMetricCardSize>('md');
  readonly density = input<AfMetricCardDensity>('comfortable');
  readonly variant = input<AfMetricCardVariant>('surface');
  readonly trendValue = input<string | number | undefined>(undefined);
  readonly trendDirection = input<AfMetricTrendDirection | undefined>(undefined);
  readonly trendLabel = input<string | undefined>(undefined);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly state = input<AfMetricCardState>('ready');
  readonly emptyText = input('Sin muestra');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly errorText = input('Dato no disponible');
  readonly errorDescription = input<string | undefined>(undefined);
  readonly sample = input<AfMetricSample | undefined>(undefined);
  readonly period = input<string | undefined>(undefined);
  readonly provenance = input<AfMetricProvenance | undefined>(undefined);
  readonly provenanceLabel = input<string | undefined>(undefined);

  readonly pressed = output<MouseEvent | KeyboardEvent>();

  /**
   * `loading` precede a `state` por compatibilidad: existía antes de que la tarjeta
   * tuviera ciclo de vida y hay consumidores que solo pasan el booleano.
   */
  protected readonly effectiveState = computed<AfMetricCardState>(() =>
    this.loading() ? 'loading' : this.state(),
  );

  protected readonly hostClasses = computed(() =>
    [
      'af-metric-card-desktop',
      `af-metric-card-desktop--tone-${this.tone()}`,
      `af-metric-card-desktop--${this.variant()}`,
      `af-metric-card-desktop--${this.size()}`,
      `af-metric-card-desktop--density-${this.density()}`,
      `af-metric-card-desktop--state-${this.effectiveState()}`,
      this.interactive() ? 'af-metric-card-desktop--interactive' : '',
      this.effectiveState() === 'loading' ? 'af-metric-card-desktop--loading' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  /** Numerador y denominador visibles. Se omite cuando el denominador es 0. */
  protected readonly sampleText = computed<string | undefined>(() => {
    const sample = this.sample();
    if (!sample || sample.denominator <= 0) {
      return undefined;
    }
    return `${sample.numerator} / ${sample.denominator}`;
  });

  protected readonly provenanceText = computed<string | undefined>(() => {
    const explicit = this.provenanceLabel();
    if (explicit) {
      return explicit;
    }
    const provenance = this.provenance();
    return provenance ? AF_METRIC_PROVENANCE_LABEL[provenance] : undefined;
  });

  protected readonly provenanceTone = computed<AfBadgeTone>(() => {
    switch (this.provenance()) {
      case 'calculated':
        return 'accent';
      case 'estimated':
      case 'needs-validation':
        return 'warning';
      default:
        return 'neutral';
    }
  });

  protected readonly hasMeta = computed(
    () => Boolean(this.sampleText() || this.provenanceText() || this.period()),
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

  /**
   * El lector de pantalla debe oír lo mismo que se ve. Sin muestra no se anuncia un
   * valor: se anuncia que no lo hay, y con la muestra y la procedencia cuando existen.
   */
  protected readonly resolvedAriaLabel = computed(() => {
    const explicit = this.ariaLabel();
    if (explicit) {
      return explicit;
    }

    const state = this.effectiveState();
    if (state === 'empty') {
      return `${this.label()}: ${this.emptyText()}`;
    }
    if (state === 'error') {
      return `${this.label()}: ${this.errorText()}`;
    }
    if (state === 'loading') {
      return `${this.label()}: cargando`;
    }

    const unit = this.unit() ? ` ${this.unit()}` : '';
    const sample = this.sampleText() ? `, muestra ${this.sampleText()}` : '';
    const period = this.period() ? `, ${this.period()}` : '';
    const provenance = this.provenanceText() ? `, ${this.provenanceText()}` : '';
    return `${this.label()}: ${this.value()}${unit}${sample}${period}${provenance}`;
  });

  protected onClick(event: MouseEvent): void {
    if (!this.interactive() || this.effectiveState() === 'loading') {
      return;
    }
    this.pressed.emit(event);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.interactive() || this.effectiveState() === 'loading') {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.pressed.emit(event);
  }
}
