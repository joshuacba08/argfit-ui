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
    type AfOrganizationChartDensity,
    type AfOrganizationChartExpandedIds,
    type AfOrganizationChartNode,
    type AfOrganizationChartNodeContext,
    type AfOrganizationChartNodeTemplate,
    type AfOrganizationChartSelectedIds,
    type AfOrganizationChartSelectionMode,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfAvatarDesktopComponent } from '../avatar/af-avatar-desktop.component';
import { AfBadgeDesktopComponent } from '../badge/af-badge-desktop.component';

type AfOrganizationChartDesktopState = 'ready' | 'loading' | 'empty' | 'error';

@Component({
  selector: 'af-organization-chart-desktop',
  imports: [AfAvatarDesktopComponent, AfBadgeDesktopComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-organization-chart-desktop.component.html',
  styleUrl: './af-organization-chart-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-organization-chart-desktop',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfOrganizationChartDesktopComponent {
  readonly nodes = input<readonly AfOrganizationChartNode[]>([]);
  readonly selectedIds = input<AfOrganizationChartSelectedIds>([]);
  readonly expandedIds = input<AfOrganizationChartExpandedIds>([]);
  readonly selectionMode = input<AfOrganizationChartSelectionMode>('single');
  readonly density = input<AfOrganizationChartDensity>('comfortable');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin estructura');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Organigrama');
  readonly nodeTemplate = input<AfOrganizationChartNodeTemplate | undefined>(undefined);
  readonly actionsTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly emptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly loadingTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly selectionChange = output<AfOrganizationChartSelectedIds>();
  readonly expandedChange = output<AfOrganizationChartExpandedIds>();
  readonly nodePressed = output<AfOrganizationChartNode>();

  protected readonly state = computed<AfOrganizationChartDesktopState>(() => {
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
  protected readonly skeletonItems = computed(() => Array.from({ length: 3 }, (_, index) => index));

  protected hasChildren(node: AfOrganizationChartNode): boolean {
    return (node.children?.length ?? 0) > 0;
  }

  protected isExpanded(nodeId: string): boolean {
    return this.expandedIdSet().has(nodeId);
  }

  protected isSelected(nodeId: string): boolean {
    return this.selectedIdSet().has(nodeId);
  }

  protected childrenFor(node: AfOrganizationChartNode): readonly AfOrganizationChartNode[] {
    return node.children ?? [];
  }

  protected nodeContext(node: AfOrganizationChartNode, level: number): AfOrganizationChartNodeContext {
    return {
      $implicit: node,
      node,
      nodeId: node.id,
      level,
      expanded: this.isExpanded(node.id),
      selected: this.isSelected(node.id),
      hasChildren: this.hasChildren(node),
      childCount: node.children?.length ?? 0,
    };
  }

  protected onToggleClick(event: MouseEvent, nodeId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleExpanded(nodeId);
  }

  protected onNodePressed(node: AfOrganizationChartNode): void {
    if (this.disabled() || node.disabled) {
      return;
    }

    if (this.selectionEnabled()) {
      this.selectionChange.emit(this.nextSelection(node.id));
    }

    this.nodePressed.emit(node);
  }

  protected onNodeKeydown(event: KeyboardEvent, node: AfOrganizationChartNode): void {
    if (!this.hasChildren(node)) {
      return;
    }

    if (event.key === 'ArrowRight' && !this.isExpanded(node.id)) {
      event.preventDefault();
      this.toggleExpanded(node.id);
      return;
    }

    if (event.key === 'ArrowLeft' && this.isExpanded(node.id)) {
      event.preventDefault();
      this.toggleExpanded(node.id);
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

  private nextSelection(nodeId: string): AfOrganizationChartSelectedIds {
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
}
