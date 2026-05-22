import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  output,
  viewChild,
  type TemplateRef,
} from '@angular/core';

import {
  AfPlatformService,
  type AfDataViewDensity,
  type AfDataViewItem,
  type AfDataViewItemTemplate,
  type AfDataViewLayout,
} from '@argfit-ui/core';
import { AfDataViewDesktopComponent } from '@argfit-ui/desktop';
import { AfDataViewMobileComponent } from '@argfit-ui/mobile';

import { AfDataViewItemDirective } from './af-data-view-item.directive';
import {
  AfDataViewActionsDirective,
  AfDataViewEmptyDirective,
  AfDataViewLoadingDirective,
} from './af-data-view-slots.directive';

@Component({
  selector: 'af-data-view',
  imports: [AfDataViewDesktopComponent, AfDataViewMobileComponent],
  templateUrl: './af-data-view.component.html',
  styleUrl: './af-data-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfDataViewComponent {
  private readonly platform = inject(AfPlatformService);

  readonly items = input<readonly AfDataViewItem[]>([]);
  readonly layout = input<AfDataViewLayout>('grid');
  readonly density = input<AfDataViewDensity>('comfortable');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin resultados');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Vista de datos');

  readonly itemPressed = output<AfDataViewItem>();

  private readonly itemTemplateDirective = contentChild(AfDataViewItemDirective);
  private readonly actionsSlot = contentChild(AfDataViewActionsDirective);
  private readonly emptySlot = contentChild(AfDataViewEmptyDirective);
  private readonly loadingSlot = contentChild(AfDataViewLoadingDirective);
  private readonly actionsTemplate = viewChild<TemplateRef<unknown>>('dataViewActions');
  private readonly emptyTemplate = viewChild<TemplateRef<unknown>>('dataViewEmpty');
  private readonly loadingTemplate = viewChild<TemplateRef<unknown>>('dataViewLoading');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly projectedItemTemplate = computed<AfDataViewItemTemplate | undefined>(
    () => this.itemTemplateDirective()?.templateRef,
  );
  protected readonly projectedActionsTemplate = computed(() =>
    this.actionsSlot() ? this.actionsTemplate() : undefined,
  );
  protected readonly projectedEmptyTemplate = computed(() =>
    this.emptySlot() ? this.emptyTemplate() : undefined,
  );
  protected readonly projectedLoadingTemplate = computed(() =>
    this.loadingSlot() ? this.loadingTemplate() : undefined,
  );
}