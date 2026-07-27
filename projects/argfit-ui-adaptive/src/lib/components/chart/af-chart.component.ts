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
  type AfChartIndicator,
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
        [indicators]="indicators()"
        [title]="title()"
        [description]="description()"
        [height]="height()"
        [legend]="legend()"
        [showGrid]="showGrid()"
        [interactive]="interactive()"
        [loading]="loading()"
        [emptyMessage]="emptyMessage()"
        [dataTable]="dataTable()"
        [dataTableLabel]="dataTableLabel()"
        [dataTableSeriesHeader]="dataTableSeriesHeader()"
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
        [indicators]="indicators()"
        [title]="title()"
        [description]="description()"
        [height]="height()"
        [legend]="legend()"
        [showGrid]="showGrid()"
        [interactive]="interactive()"
        [loading]="loading()"
        [emptyMessage]="emptyMessage()"
        [dataTable]="dataTable()"
        [dataTableLabel]="dataTableLabel()"
        [dataTableSeriesHeader]="dataTableSeriesHeader()"
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
  readonly tone = input<AfChartTone>('default');
  readonly density = input<AfChartDensity>('comfortable');
  readonly categories = input<readonly string[]>([]);
  readonly series = input<readonly AfChartSeries[]>([]);
  readonly indicators = input<readonly AfChartIndicator[]>([]);
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly height = input<number | undefined>(undefined);
  readonly legend = input(true, { transform: booleanAttribute });
  readonly showGrid = input(true, { transform: booleanAttribute });
  readonly interactive = input(true, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly emptyMessage = input<string>('Sin datos disponibles');
  readonly ariaLabel = input<string | undefined>(undefined);
  /**
   * Publica la serie como tabla accesible junto al gráfico.
   *
   * §20 exige resumen textual en todo gráfico. Un lienzo no es navegable por teclado ni
   * legible por tecnología asistiva: esta tabla contiene los mismos datos, no un resumen.
   */
  readonly dataTable = input(false, { transform: booleanAttribute });
  readonly dataTableLabel = input('Datos del gráfico');
  readonly dataTableSeriesHeader = input('Serie');

  readonly pointSelect = output<AfChartPointEvent>();

  protected readonly isMobile = this.platform.isMobile;
}
