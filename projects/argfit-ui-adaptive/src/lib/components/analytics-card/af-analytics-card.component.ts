import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    inject,
    input,
    viewChild,
    type TemplateRef,
} from '@angular/core';

import {
    AfPlatformService,
    type AfAnalyticsCardDensity,
    type AfAnalyticsCardState,
    type AfAnalyticsCardTone,
    type AfAnalyticsCardVariant,
} from '@argfit-ui/core';
import { AfAnalyticsCardDesktopComponent } from '@argfit-ui/desktop';
import { AfAnalyticsCardMobileComponent } from '@argfit-ui/mobile';

import {
    AfAnalyticsCardActionsDirective,
    AfAnalyticsCardFooterDirective,
    AfAnalyticsCardLegendDirective,
    AfAnalyticsCardMetricsDirective,
} from './af-analytics-card-slots.directive';

@Component({
  selector: 'af-analytics-card',
  imports: [AfAnalyticsCardDesktopComponent, AfAnalyticsCardMobileComponent],
  templateUrl: './af-analytics-card.component.html',
  styleUrl: './af-analytics-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-fill]': 'fill() ? "" : null',
  },
})
export class AfAnalyticsCardComponent {
  private readonly platform = inject(AfPlatformService);

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

  private readonly actionsSlot = contentChild(AfAnalyticsCardActionsDirective);
  private readonly metricsSlot = contentChild(AfAnalyticsCardMetricsDirective);
  private readonly legendSlot = contentChild(AfAnalyticsCardLegendDirective);
  private readonly footerSlot = contentChild(AfAnalyticsCardFooterDirective);
  private readonly actionsTemplate = viewChild<TemplateRef<unknown>>('analyticsCardActions');
  private readonly metricsTemplate = viewChild<TemplateRef<unknown>>('analyticsCardMetrics');
  private readonly legendTemplate = viewChild<TemplateRef<unknown>>('analyticsCardLegend');
  private readonly footerTemplate = viewChild<TemplateRef<unknown>>('analyticsCardFooter');
  protected readonly contentTemplate = viewChild<TemplateRef<unknown>>('analyticsCardContent');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly projectedActionsTemplate = computed(() =>
    this.actionsSlot() ? this.actionsTemplate() : undefined,
  );
  protected readonly projectedMetricsTemplate = computed(() =>
    this.metricsSlot() ? this.metricsTemplate() : undefined,
  );
  protected readonly projectedLegendTemplate = computed(() =>
    this.legendSlot() ? this.legendTemplate() : undefined,
  );
  protected readonly projectedFooterTemplate = computed(() =>
    this.footerSlot() ? this.footerTemplate() : undefined,
  );
}
