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
  type AfOrderListDensity,
  type AfOrderListItem,
  type AfOrderListItemTemplate,
  type AfOrderListReorderChange,
  type AfOrderListSelectedIds,
  type AfOrderListSelectionMode,
} from '@argfit-ui/core';
import { AfOrderListDesktopComponent } from '@argfit-ui/desktop';
import { AfOrderListMobileComponent } from '@argfit-ui/mobile';

import { AfOrderListItemDirective } from './af-order-list-item.directive';
import {
  AfOrderListActionsDirective,
  AfOrderListEmptyDirective,
  AfOrderListLoadingDirective,
} from './af-order-list-slots.directive';

@Component({
  selector: 'af-order-list',
  imports: [AfOrderListDesktopComponent, AfOrderListMobileComponent],
  templateUrl: './af-order-list.component.html',
  styleUrl: './af-order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfOrderListComponent {
  private readonly platform = inject(AfPlatformService);

  readonly items = input<readonly AfOrderListItem[]>([]);
  readonly selectedIds = input<AfOrderListSelectedIds>([]);
  readonly selectionMode = input<AfOrderListSelectionMode>('single');
  readonly density = input<AfOrderListDensity>('comfortable');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin items');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Lista ordenable');

  readonly selectionChange = output<AfOrderListSelectedIds>();
  readonly reorderChange = output<AfOrderListReorderChange>();

  private readonly itemTemplateDirective = contentChild(AfOrderListItemDirective);
  private readonly actionsSlot = contentChild(AfOrderListActionsDirective);
  private readonly emptySlot = contentChild(AfOrderListEmptyDirective);
  private readonly loadingSlot = contentChild(AfOrderListLoadingDirective);
  private readonly actionsTemplate = viewChild<TemplateRef<unknown>>('orderListActions');
  private readonly emptyTemplate = viewChild<TemplateRef<unknown>>('orderListEmpty');
  private readonly loadingTemplate = viewChild<TemplateRef<unknown>>('orderListLoading');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly projectedItemTemplate = computed<AfOrderListItemTemplate | undefined>(
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
