import { NgTemplateOutlet } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    type TemplateRef,
    ViewEncapsulation,
} from '@angular/core';

import type {
    AfAnalyticsCardDensity,
    AfAnalyticsCardState,
    AfAnalyticsCardTone,
    AfAnalyticsCardVariant,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

@Component({
  selector: 'af-analytics-card-desktop',
  imports: [AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-analytics-card-desktop.component.html',
  styleUrl: './af-analytics-card-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-analytics-card-desktop',
    '[class]': 'hostClasses()',
    '[attr.data-density]': 'density()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-state]': 'state()',
    '[attr.role]': '"region"',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[attr.aria-busy]': 'state() === "loading" ? "true" : null',
    '[attr.data-fill]': 'fill() ? "" : null',
    '[style.--af-analytics-card-content-height]': 'height() ?? null',
  },
})
export class AfAnalyticsCardDesktopComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>(undefined);
  readonly density = input<AfAnalyticsCardDensity>('comfortable');
  readonly variant = input<AfAnalyticsCardVariant>('surface');
  readonly tone = input<AfAnalyticsCardTone>('neutral');
  readonly state = input<AfAnalyticsCardState>('ready');
  readonly height = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin datos');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly errorTitle = input('No se pudo cargar');
  readonly errorDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);

  /**
   * La tarjeta reclama la altura de su contenedor en lugar de su altura intrínseca.
   * Es un eje distinto de `height`, que fija el alto del área de contenido del gráfico:
   * con `fill` activo ese alto sigue siendo el piso y el contenedor fija el techo.
   */
  readonly fill = input(false, { transform: booleanAttribute });

  readonly contentTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly actionsTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly metricsTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly legendTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly footerTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  protected readonly hostClasses = computed(() =>
    [
      'af-analytics-card-desktop',
      `af-analytics-card-desktop--${this.variant()}`,
      `af-analytics-card-desktop--tone-${this.tone()}`,
      `af-analytics-card-desktop--density-${this.density()}`,
      `af-analytics-card-desktop--state-${this.state()}`,
      this.fill() ? 'af-analytics-card-desktop--fill' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly resolvedAriaLabel = computed(() => this.ariaLabel() ?? this.title());
}
