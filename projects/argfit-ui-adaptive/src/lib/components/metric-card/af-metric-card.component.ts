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
    type AfMetricCardTone,
    type AfMetricCardVariant,
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

  readonly pressed = output<MouseEvent | KeyboardEvent>();

  protected readonly isMobile = this.platform.isMobile;
}
