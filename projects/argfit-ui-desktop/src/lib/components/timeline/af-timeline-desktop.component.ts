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
  type AfBadgeTone,
  type AfTimelineDensity,
  type AfTimelineItem,
  type AfTimelineItemContext,
  type AfTimelineItemTemplate,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeDesktopComponent } from '../badge/af-badge-desktop.component';

type AfTimelineDesktopState = 'ready' | 'loading' | 'empty' | 'error';

@Component({
  selector: 'af-timeline-desktop',
  imports: [AfBadgeDesktopComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-timeline-desktop.component.html',
  styleUrl: './af-timeline-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-timeline-desktop',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
  },
})
export class AfTimelineDesktopComponent {
  readonly items = input<readonly AfTimelineItem[]>([]);
  readonly density = input<AfTimelineDensity>('comfortable');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin eventos');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Linea de tiempo');
  readonly itemTemplate = input<AfTimelineItemTemplate | undefined>(undefined);
  readonly actionsTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly emptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly loadingTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly itemPressed = output<AfTimelineItem>();

  protected readonly state = computed<AfTimelineDesktopState>(() => {
    if (this.error()) {
      return 'error';
    }

    if (this.loading()) {
      return 'loading';
    }

    return this.items().length > 0 ? 'ready' : 'empty';
  });

  protected readonly skeletonItems = computed(() => Array.from({ length: 3 }, (_, index) => index));

  protected itemContext(item: AfTimelineItem, itemIndex: number): AfTimelineItemContext {
    return {
      $implicit: item,
      item,
      itemId: item.id,
      itemIndex,
    };
  }

  protected markerTone(item: AfTimelineItem): AfBadgeTone {
    return item.tone ?? item.badge?.tone ?? 'primary';
  }

  protected onItemPressed(item: AfTimelineItem): void {
    if (item.disabled) {
      return;
    }

    this.itemPressed.emit(item);
  }

  protected onItemKeydown(event: KeyboardEvent, item: AfTimelineItem): void {
    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
      return;
    }

    event.preventDefault();
    this.onItemPressed(item);
  }
}