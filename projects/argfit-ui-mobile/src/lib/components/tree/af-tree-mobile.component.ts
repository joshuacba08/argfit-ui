import { NgTemplateOutlet } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    output,
    type TemplateRef,
    ViewEncapsulation,
} from '@angular/core';

import {
    type AfTreeDensity,
    type AfTreeExpandedIds,
    type AfTreeNode,
    type AfTreeNodeContext,
    type AfTreeNodeTemplate,
    type AfTreeSelectedIds,
    type AfTreeSelectionMode,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeMobileComponent } from '../badge/af-badge-mobile.component';

type AfTreeMobileState = 'ready' | 'loading' | 'empty' | 'error';

@Component({
  selector: 'af-tree-mobile',
  imports: [AfBadgeMobileComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-tree-mobile.component.html',
  styleUrl: './af-tree-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-tree-mobile',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfTreeMobileComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

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
  readonly nodeTemplate = input<AfTreeNodeTemplate | undefined>(undefined);
  readonly actionsTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly emptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly loadingTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly selectionChange = output<AfTreeSelectedIds>();
  readonly expandedChange = output<AfTreeExpandedIds>();
  readonly nodePressed = output<AfTreeNode>();

  protected readonly state = computed<AfTreeMobileState>(() => {
    if (this.error()) {
      return 'error';
    }

    if (this.loading()) {
      return 'loading';
    }

    return this.nodes().length > 0 ? 'ready' : 'empty';
  });

  protected readonly selectedIdSet = computed(() => new Set(this.selectedIds()));
  protected readonly expandedIdSet = computed(() => new Set(this.expandedIds()));
  protected readonly selectionEnabled = computed(() => this.selectionMode() !== 'none');
  protected readonly skeletonItems = computed(() => Array.from({ length: 4 }, (_, index) => index));

  protected hasChildren(node: AfTreeNode): boolean {
    return (node.children?.length ?? 0) > 0;
  }

  protected isExpanded(nodeId: string): boolean {
    return this.expandedIdSet().has(nodeId);
  }

  protected isSelected(nodeId: string): boolean {
    return this.selectedIdSet().has(nodeId);
  }

  protected nodeContext(node: AfTreeNode, level: number): AfTreeNodeContext {
    return {
      $implicit: node,
      node,
      nodeId: node.id,
      level,
      expanded: this.isExpanded(node.id),
      selected: this.isSelected(node.id),
      hasChildren: this.hasChildren(node),
    };
  }

  protected onToggleClick(event: MouseEvent, nodeId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleExpanded(nodeId);
  }

  protected onNodePressed(node: AfTreeNode): void {
    if (this.disabled() || node.disabled) {
      return;
    }

    if (this.selectionEnabled()) {
      this.selectionChange.emit(this.nextSelection(node.id));
    }

    this.nodePressed.emit(node);
  }

  protected onNodeKeydown(event: KeyboardEvent, node: AfTreeNode, parentId: string | null): void {
    const currentTarget = event.currentTarget as HTMLButtonElement | null;

    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        this.onNodePressed(node);
        return;
      case 'ArrowRight':
        event.preventDefault();
        if (this.hasChildren(node)) {
          if (!this.isExpanded(node.id)) {
            this.toggleExpanded(node.id);
            return;
          }

          this.focusFirstChild(node.id);
        }
        return;
      case 'ArrowLeft':
        event.preventDefault();
        if (this.hasChildren(node) && this.isExpanded(node.id)) {
          this.toggleExpanded(node.id);
          return;
        }

        this.focusByNodeId(parentId);
        return;
      case 'ArrowDown':
        event.preventDefault();
        this.focusRelative(currentTarget, 1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        this.focusRelative(currentTarget, -1);
        return;
      case 'Home':
        event.preventDefault();
        this.focusEdge('start');
        return;
      case 'End':
        event.preventDefault();
        this.focusEdge('end');
        return;
      default:
        return;
    }
  }

  private toggleExpanded(nodeId: string): void {
    if (this.disabled()) {
      return;
    }

    const next = [...this.expandedIds()];
    const index = next.indexOf(nodeId);

    if (index >= 0) {
      next.splice(index, 1);
    } else {
      next.push(nodeId);
    }

    this.expandedChange.emit(next);
  }

  private nextSelection(nodeId: string): AfTreeSelectedIds {
    if (this.selectionMode() === 'multiple') {
      const next = [...this.selectedIds()];
      const index = next.indexOf(nodeId);

      if (index >= 0) {
        next.splice(index, 1);
      } else {
        next.push(nodeId);
      }

      return next;
    }

    if (this.selectionMode() === 'single') {
      return [nodeId];
    }

    return this.selectedIds();
  }

  private focusRelative(currentTarget: HTMLButtonElement | null, delta: number): void {
    if (!currentTarget) {
      return;
    }

    const buttons = this.visibleNodeButtons();
    const currentIndex = buttons.indexOf(currentTarget);
    if (currentIndex < 0) {
      return;
    }

    const nextIndex = currentIndex + delta;
    if (nextIndex < 0 || nextIndex >= buttons.length) {
      return;
    }

    buttons[nextIndex]?.focus();
  }

  private focusEdge(edge: 'start' | 'end'): void {
    const buttons = this.visibleNodeButtons();
    const target = edge === 'start' ? buttons[0] : buttons[buttons.length - 1];
    target?.focus();
  }

  private focusFirstChild(parentId: string): void {
    const target = this.visibleNodeButtons().find((button) => button.dataset['parentId'] === parentId);
    target?.focus();
  }

  private focusByNodeId(nodeId: string | null): void {
    if (!nodeId) {
      return;
    }

    const target = this.visibleNodeButtons().find((button) => button.dataset['nodeId'] === nodeId);
    target?.focus();
  }

  private visibleNodeButtons(): HTMLButtonElement[] {
    return Array.from(this.hostRef.nativeElement.querySelectorAll('.af-tree-mobile__label')).filter(
      (button): button is HTMLButtonElement => button instanceof HTMLButtonElement && !button.disabled,
    );
  }
}
