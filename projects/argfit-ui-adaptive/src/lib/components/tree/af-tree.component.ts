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
    type AfTreeDensity,
    type AfTreeExpandedIds,
    type AfTreeNode,
    type AfTreeNodeTemplate,
    type AfTreeSelectedIds,
    type AfTreeSelectionMode,
} from '@argfit-ui/core';
import { AfTreeDesktopComponent } from '@argfit-ui/desktop';
import { AfTreeMobileComponent } from '@argfit-ui/mobile';

import { AfTreeNodeDirective } from './af-tree-node.directive';
import {
    AfTreeActionsDirective,
    AfTreeEmptyDirective,
    AfTreeLoadingDirective,
} from './af-tree-slots.directive';

@Component({
  selector: 'af-tree',
  imports: [AfTreeDesktopComponent, AfTreeMobileComponent],
  templateUrl: './af-tree.component.html',
  styleUrl: './af-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfTreeComponent {
  private readonly platform = inject(AfPlatformService);

  readonly nodes = input<readonly AfTreeNode[]>([]);
  readonly selectedIds = input<AfTreeSelectedIds>([]);
  readonly expandedIds = input<AfTreeExpandedIds>([]);
  readonly selectionMode = input<AfTreeSelectionMode>('single');
  readonly density = input<AfTreeDensity>('comfortable');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin nodos');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Arbol');

  readonly selectionChange = output<AfTreeSelectedIds>();
  readonly expandedChange = output<AfTreeExpandedIds>();
  readonly nodePressed = output<AfTreeNode>();

  private readonly nodeTemplateDirective = contentChild(AfTreeNodeDirective);
  private readonly actionsSlot = contentChild(AfTreeActionsDirective);
  private readonly emptySlot = contentChild(AfTreeEmptyDirective);
  private readonly loadingSlot = contentChild(AfTreeLoadingDirective);
  private readonly actionsTemplate = viewChild<TemplateRef<unknown>>('treeActions');
  private readonly emptyTemplate = viewChild<TemplateRef<unknown>>('treeEmpty');
  private readonly loadingTemplate = viewChild<TemplateRef<unknown>>('treeLoading');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly projectedNodeTemplate = computed<AfTreeNodeTemplate | undefined>(
    () => this.nodeTemplateDirective()?.templateRef,
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
