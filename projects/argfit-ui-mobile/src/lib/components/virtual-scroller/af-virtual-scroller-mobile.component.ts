import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  type AfVirtualScrollerDensity,
  type AfVirtualScrollerItem,
  type AfVirtualScrollerItemContext,
  type AfVirtualScrollerItemTemplate,
  type AfVirtualScrollerRange,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeMobileComponent } from '../badge/af-badge-mobile.component';

type AfVirtualScrollerMobileState = 'ready' | 'loading' | 'empty' | 'error';

interface AfVirtualScrollerMobileWindow {
  readonly range: AfVirtualScrollerRange;
  readonly startIndex: number;
  readonly endExclusive: number;
  readonly topSpacerHeight: number;
  readonly bottomSpacerHeight: number;
  readonly items: ReadonlyArray<{ readonly item: AfVirtualScrollerItem; readonly itemIndex: number }>;
}

@Component({
  selector: 'af-virtual-scroller-mobile',
  imports: [AfBadgeMobileComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-virtual-scroller-mobile.component.html',
  styleUrl: './af-virtual-scroller-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-virtual-scroller-mobile',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
  },
})
export class AfVirtualScrollerMobileComponent {
  private readonly scrollTop = signal(0);

  readonly items = input<readonly AfVirtualScrollerItem[]>([]);
  readonly density = input<AfVirtualScrollerDensity>('comfortable');
  readonly itemHeight = input(84);
  readonly viewportHeight = input(320);
  readonly overscan = input(2);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin items');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Lista virtualizada');
  readonly itemTemplate = input<AfVirtualScrollerItemTemplate | undefined>(undefined);
  readonly actionsTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly emptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly loadingTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly itemPressed = output<AfVirtualScrollerItem>();
  readonly visibleRangeChange = output<AfVirtualScrollerRange>();

  protected readonly state = computed<AfVirtualScrollerMobileState>(() => {
    if (this.error()) {
      return 'error';
    }

    if (this.loading()) {
      return 'loading';
    }

    return this.items().length > 0 ? 'ready' : 'empty';
  });

  protected readonly windowState = computed(() => this.buildWindow(this.scrollTop()));
  protected readonly skeletonItems = computed(() => Array.from({ length: 4 }, (_, index) => index));

  protected itemContext(item: AfVirtualScrollerItem, itemIndex: number): AfVirtualScrollerItemContext {
    return {
      $implicit: item,
      item,
      itemId: item.id,
      itemIndex,
      visibleRange: this.windowState().range,
    };
  }

  protected onViewportScroll(event: Event): void {
    const target = event.target as HTMLElement | null;
    const nextScrollTop = target?.scrollTop ?? 0;
    const windowState = this.buildWindow(nextScrollTop);

    this.scrollTop.set(nextScrollTop);
    this.visibleRangeChange.emit(windowState.range);
  }

  protected onItemPressed(item: AfVirtualScrollerItem): void {
    if (item.disabled) {
      return;
    }

    this.itemPressed.emit(item);
  }

  protected onItemKeydown(event: KeyboardEvent, item: AfVirtualScrollerItem): void {
    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
      return;
    }

    event.preventDefault();
    this.onItemPressed(item);
  }

  private buildWindow(scrollTop: number): AfVirtualScrollerMobileWindow {
    const allItems = this.items();
    const totalItems = allItems.length;

    if (totalItems === 0) {
      return {
        range: { startIndex: 0, endIndex: 0, totalItems: 0 },
        startIndex: 0,
        endExclusive: 0,
        topSpacerHeight: 0,
        bottomSpacerHeight: 0,
        items: [],
      };
    }

    const safeItemHeight = Math.max(1, this.itemHeight());
    const safeViewportHeight = Math.max(safeItemHeight, this.viewportHeight());
    const safeOverscan = Math.max(0, this.overscan());
    const viewportItemCount = Math.max(1, Math.ceil(safeViewportHeight / safeItemHeight));
    const firstVisibleIndex = Math.floor(scrollTop / safeItemHeight);
    const startIndex = Math.max(0, firstVisibleIndex - safeOverscan);
    const endExclusive = Math.min(totalItems, startIndex + viewportItemCount + safeOverscan * 2);
    const topSpacerHeight = startIndex * safeItemHeight;
    const bottomSpacerHeight = Math.max(0, (totalItems - endExclusive) * safeItemHeight);

    return {
      range: {
        startIndex,
        endIndex: Math.max(startIndex, endExclusive - 1),
        totalItems,
      },
      startIndex,
      endExclusive,
      topSpacerHeight,
      bottomSpacerHeight,
      items: allItems.slice(startIndex, endExclusive).map((item, index) => ({
        item,
        itemIndex: startIndex + index,
      })),
    };
  }
}