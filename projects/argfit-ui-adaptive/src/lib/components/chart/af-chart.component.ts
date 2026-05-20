import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import {
    AfPlatformService,
    type AfChartDensity,
    type AfChartPointEvent,
    type AfChartSeries,
    type AfChartTone,
    type AfChartType,
} from '@argfit-ui/core';
import { AfChartDesktopComponent } from '@argfit-ui/desktop';
import { AfChartMobileComponent } from '@argfit-ui/mobile';

/**
 * Adaptive chart facade that swaps the desktop or mobile implementation
 * based on the current `AfPlatformService` mode. Consumers only deal with
 * the ArgFit `AfChart*` contract.
 */
@Component({
  selector: 'af-chart',
  standalone: true,
  imports: [AfChartDesktopComponent, AfChartMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (isMobile()) {
      <af-chart-mobile
        [type]="type()"
        [tone]="tone()"
        [density]="density()"
        [categories]="categories()"
        [series]="series()"
        [title]="title()"
        [loading]="loading()"
        [emptyMessage]="emptyMessage()"
        [ariaLabel]="ariaLabel()"
        (pointSelect)="pointSelect.emit($event)"
      />
    } @else {
      <af-chart-desktop
        [type]="type()"
        [tone]="tone()"
        [density]="density()"
        [categories]="categories()"
        [series]="series()"
        [title]="title()"
        [loading]="loading()"
        [emptyMessage]="emptyMessage()"
        [ariaLabel]="ariaLabel()"
        (pointSelect)="pointSelect.emit($event)"
      />
    }
  `,
  host: {
    class: 'af-chart',
  },
})
export class AfChartComponent {
  private readonly platform = inject(AfPlatformService);

  readonly type = input<AfChartType>('line');
  readonly tone = input<AfChartTone>('primary');
  readonly density = input<AfChartDensity>('comfortable');
  readonly categories = input<readonly string[]>([]);
  readonly series = input<readonly AfChartSeries[]>([]);
  readonly title = input<string | undefined>(undefined);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly emptyMessage = input<string>('Sin datos disponibles');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly pointSelect = output<AfChartPointEvent>();

  protected readonly isMobile = this.platform.isMobile;
}
