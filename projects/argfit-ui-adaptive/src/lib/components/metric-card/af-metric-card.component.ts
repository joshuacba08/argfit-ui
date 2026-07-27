import { NgTemplateOutlet } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
} from '@angular/core';

import {
    AfPlatformService,
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
import { AfMetricCardDesktopComponent } from '@argfit-ui/desktop';
import { AfMetricCardMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-metric-card',
  imports: [AfMetricCardDesktopComponent, AfMetricCardMobileComponent, NgTemplateOutlet],
  templateUrl: './af-metric-card.component.html',
  styleUrl: './af-metric-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfMetricCardComponent {
  private readonly platform = inject(AfPlatformService);

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

  /**
   * Ciclo de vida del valor. `empty` es una afirmación sobre el dato, no un estilo:
   * una métrica sin muestra debe decirlo, nunca renderizar `0`, porque un cero es en sí
   * mismo una medición válida.
   */
  readonly state = input<AfMetricCardState>('ready');
  readonly emptyText = input('Sin muestra');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly errorText = input('Dato no disponible');
  readonly errorDescription = input<string | undefined>(undefined);
  /** Numerador y denominador tras un agregado: `1/1` y `240/240` no valen lo mismo. */
  readonly sample = input<AfMetricSample | undefined>(undefined);
  readonly period = input<string | undefined>(undefined);
  readonly provenance = input<AfMetricProvenance | undefined>(undefined);
  readonly provenanceLabel = input<string | undefined>(undefined);

  readonly pressed = output<MouseEvent | KeyboardEvent>();

  protected readonly isMobile = this.platform.isMobile;
}
