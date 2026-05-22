import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
} from '@angular/core';

import { AfPlatformService, type AfPaginatorDensity, type AfPaginatorPageChange } from '@argfit-ui/core';
import { AfPaginatorDesktopComponent } from '@argfit-ui/desktop';
import { AfPaginatorMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-paginator',
  imports: [AfPaginatorDesktopComponent, AfPaginatorMobileComponent],
  templateUrl: './af-paginator.component.html',
  styleUrl: './af-paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfPaginatorComponent {
  private readonly platform = inject(AfPlatformService);

  readonly pageIndex = input(0);
  readonly pageSize = input(12);
  readonly totalItems = input(0);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly density = input<AfPaginatorDensity>('comfortable');
  readonly ariaLabel = input('Paginacion');
  readonly previousLabel = input('Pagina anterior');
  readonly nextLabel = input('Pagina siguiente');

  readonly pageChange = output<AfPaginatorPageChange>();

  protected readonly isMobile = this.platform.isMobile;
}
