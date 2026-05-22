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
    type AfVirtualScrollerDensity,
    type AfVirtualScrollerItem,
    type AfVirtualScrollerItemTemplate,
    type AfVirtualScrollerRange,
} from '@argfit-ui/core';
import { AfVirtualScrollerDesktopComponent } from '@argfit-ui/desktop';
import { AfVirtualScrollerMobileComponent } from '@argfit-ui/mobile';

import { AfVirtualScrollerItemDirective } from './af-virtual-scroller-item.directive';
import {
    AfVirtualScrollerActionsDirective,
    AfVirtualScrollerEmptyDirective,
    AfVirtualScrollerLoadingDirective,
} from './af-virtual-scroller-slots.directive';

@Component({
  selector: 'af-virtual-scroller',
  imports: [AfVirtualScrollerDesktopComponent, AfVirtualScrollerMobileComponent],
  templateUrl: './af-virtual-scroller.component.html',
  styleUrl: './af-virtual-scroller.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfVirtualScrollerComponent {
  private readonly platform = inject(AfPlatformService);

  readonly items = input<readonly AfVirtualScrollerItem[]>([]);
  readonly density = input<AfVirtualScrollerDensity>('comfortable');
  readonly itemHeight = input(88);
  readonly viewportHeight = input(336);
  readonly overscan = input(3);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin items');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Lista virtualizada');

  readonly itemPressed = output<AfVirtualScrollerItem>();
  readonly visibleRangeChange = output<AfVirtualScrollerRange>();

  private readonly itemTemplateDirective = contentChild(AfVirtualScrollerItemDirective);
  private readonly actionsSlot = contentChild(AfVirtualScrollerActionsDirective);
  private readonly emptySlot = contentChild(AfVirtualScrollerEmptyDirective);
  private readonly loadingSlot = contentChild(AfVirtualScrollerLoadingDirective);
  private readonly actionsTemplate = viewChild<TemplateRef<unknown>>('virtualScrollerActions');
  private readonly emptyTemplate = viewChild<TemplateRef<unknown>>('virtualScrollerEmpty');
  private readonly loadingTemplate = viewChild<TemplateRef<unknown>>('virtualScrollerLoading');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly projectedItemTemplate = computed<AfVirtualScrollerItemTemplate | undefined>(
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
