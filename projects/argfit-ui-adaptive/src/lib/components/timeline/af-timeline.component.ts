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
  type AfTimelineDensity,
  type AfTimelineItem,
  type AfTimelineItemTemplate,
} from '@argfit-ui/core';
import { AfTimelineDesktopComponent } from '@argfit-ui/desktop';
import { AfTimelineMobileComponent } from '@argfit-ui/mobile';

import { AfTimelineItemDirective } from './af-timeline-item.directive';
import {
  AfTimelineActionsDirective,
  AfTimelineEmptyDirective,
  AfTimelineLoadingDirective,
} from './af-timeline-slots.directive';

@Component({
  selector: 'af-timeline',
  imports: [AfTimelineDesktopComponent, AfTimelineMobileComponent],
  templateUrl: './af-timeline.component.html',
  styleUrl: './af-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfTimelineComponent {
  private readonly platform = inject(AfPlatformService);

  readonly items = input<readonly AfTimelineItem[]>([]);
  readonly density = input<AfTimelineDensity>('comfortable');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin eventos');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Linea de tiempo');

  readonly itemPressed = output<AfTimelineItem>();

  private readonly itemTemplateDirective = contentChild(AfTimelineItemDirective);
  private readonly actionsSlot = contentChild(AfTimelineActionsDirective);
  private readonly emptySlot = contentChild(AfTimelineEmptyDirective);
  private readonly loadingSlot = contentChild(AfTimelineLoadingDirective);
  private readonly actionsTemplate = viewChild<TemplateRef<unknown>>('timelineActions');
  private readonly emptyTemplate = viewChild<TemplateRef<unknown>>('timelineEmpty');
  private readonly loadingTemplate = viewChild<TemplateRef<unknown>>('timelineLoading');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly projectedItemTemplate = computed<AfTimelineItemTemplate | undefined>(
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