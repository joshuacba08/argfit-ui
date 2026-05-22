import { NgTemplateOutlet } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    type TemplateRef,
    ViewEncapsulation,
} from '@angular/core';

import {
    type AfDataViewDensity,
    type AfDataViewItem,
    type AfDataViewItemContext,
    type AfDataViewItemTemplate,
    type AfDataViewLayout,
} from '@argfit-ui/core';

import { AfBadgeDesktopComponent } from '../badge/af-badge-desktop.component';

type AfDataViewDesktopState = 'ready' | 'loading' | 'empty' | 'error';

@Component({
  selector: 'af-data-view-desktop',
  imports: [AfBadgeDesktopComponent, NgTemplateOutlet],
  templateUrl: './af-data-view-desktop.component.html',
  styleUrl: './af-data-view-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-data-view-desktop',
    '[attr.data-layout]': 'layout()',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
  },
})
export class AfDataViewDesktopComponent {
  readonly items = input<readonly AfDataViewItem[]>([]);
  readonly layout = input<AfDataViewLayout>('grid');
  readonly density = input<AfDataViewDensity>('comfortable');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin resultados');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Vista de datos');
  readonly itemTemplate = input<AfDataViewItemTemplate | undefined>(undefined);
  readonly actionsTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly emptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly loadingTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly itemPressed = output<AfDataViewItem>();

  protected readonly state = computed<AfDataViewDesktopState>(() => {
    if (this.error()) {
      return 'error';
    }

    if (this.loading()) {
      return 'loading';
    }

    return this.items().length > 0 ? 'ready' : 'empty';
  });

  protected readonly skeletonItems = computed(() =>
    Array.from({ length: this.layout() === 'grid' ? 4 : 3 }, (_, index) => index),
  );

  protected itemContext(item: AfDataViewItem, itemIndex: number): AfDataViewItemContext {
    return {
      $implicit: item,
      item,
      itemId: item.id,
      itemIndex,
      layout: this.layout(),
    };
  }

  protected onItemPressed(item: AfDataViewItem): void {
    if (item.disabled) {
      return;
    }

    this.itemPressed.emit(item);
  }

  protected onItemKeydown(event: KeyboardEvent, item: AfDataViewItem): void {
    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
      return;
    }

    event.preventDefault();
    this.onItemPressed(item);
  }
}
