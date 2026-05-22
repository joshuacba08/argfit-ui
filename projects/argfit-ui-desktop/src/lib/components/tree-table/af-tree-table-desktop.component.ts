import { NgStyle, NgTemplateOutlet } from '@angular/common';
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
    type AfDataTableColumn,
    type AfTreeTableCellContext,
    type AfTreeTableCellTemplate,
    type AfTreeTableDensity,
    type AfTreeTableExpandedIds,
    type AfTreeTableNode,
    type AfTreeTableSelectedIds,
    type AfTreeTableSelectionMode,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeDesktopComponent } from '../badge/af-badge-desktop.component';

type AfTreeTableDesktopState = 'ready' | 'loading' | 'empty' | 'error';

interface AfTreeTableDesktopEntry {
  readonly node: AfTreeTableNode;
  readonly parentId: string | null;
  readonly level: number;
  readonly hasChildren: boolean;
  readonly expanded: boolean;
  readonly selected: boolean;
}

@Component({
  selector: 'af-tree-table-desktop',
  imports: [AfBadgeDesktopComponent, AfIconComponent, NgStyle, NgTemplateOutlet],
  templateUrl: './af-tree-table-desktop.component.html',
  styleUrl: './af-tree-table-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-tree-table-desktop',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfTreeTableDesktopComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly columns = input.required<readonly AfDataTableColumn[]>();
  readonly nodes = input<readonly AfTreeTableNode[]>([]);
  readonly treeColumnKey = input<string | undefined>(undefined);
  readonly selectedIds = input<AfTreeTableSelectedIds>([]);
  readonly expandedIds = input<AfTreeTableExpandedIds>([]);
  readonly selectionMode = input<AfTreeTableSelectionMode>('single');
  readonly density = input<AfTreeTableDensity>('normal');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin nodos');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Tabla jerarquica');
  readonly cellTemplates = input<readonly AfTreeTableCellTemplate[]>([]);
  readonly actionsTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly emptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly loadingTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly selectionChange = output<AfTreeTableSelectedIds>();
  readonly expandedChange = output<AfTreeTableExpandedIds>();
  readonly nodePressed = output<AfTreeTableNode>();

  protected readonly state = computed<AfTreeTableDesktopState>(() => {
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
  protected readonly cellTemplateMap = computed(
    () => new Map(this.cellTemplates().map((item) => [item.columnKey, item.template])),
  );
  protected readonly resolvedTreeColumn = computed(
    () => this.columns().find((column) => column.key === this.treeColumnKey()) ?? this.columns()[0],
  );
  protected readonly tableColumnCount = computed(
    () => this.columns().length + (this.selectionEnabled() ? 1 : 0),
  );
  protected readonly skeletonColumns = computed(() =>
    Array.from({ length: this.tableColumnCount() }, (_, index) => index),
  );
  protected readonly flatRows = computed(() => this.flattenNodes(this.nodes()));

  protected columnStyle(column: AfDataTableColumn): Record<string, string> | null {
    if (!column.width && !column.minWidth) {
      return null;
    }

    return {
      ...(column.width ? { width: column.width } : {}),
      ...(column.minWidth ? { minWidth: column.minWidth } : {}),
    };
  }

  protected isTreeColumn(column: AfDataTableColumn): boolean {
    return column.key === this.resolvedTreeColumn()?.key;
  }

  protected cellTemplateFor(
    column: AfDataTableColumn,
  ): TemplateRef<AfTreeTableCellContext> | undefined {
    return this.cellTemplateMap().get(column.key);
  }

  protected cellContext(
    entry: AfTreeTableDesktopEntry,
    column: AfDataTableColumn,
  ): AfTreeTableCellContext {
    const value = this.cellValue(entry.node, column);

    return {
      $implicit: value,
      value,
      node: entry.node,
      data: entry.node.data,
      column,
      nodeId: entry.node.id,
      level: entry.level,
      expanded: entry.expanded,
      selected: entry.selected,
      hasChildren: entry.hasChildren,
    };
  }

  protected displayValue(
    node: AfTreeTableNode,
    column: AfDataTableColumn,
  ): string {
    const labelledValue = column.valueLabel?.(node.data);
    if (labelledValue !== undefined) {
      return labelledValue;
    }

    const value = this.cellValue(node, column);
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return String(value);
  }

  protected onToggleClick(event: MouseEvent, nodeId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleExpanded(nodeId);
  }

  protected onSelectionToggle(event: MouseEvent, nodeId: string): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled()) {
      return;
    }

    this.selectionChange.emit(this.nextSelection(nodeId));
  }

  protected onRowPressed(node: AfTreeTableNode): void {
    if (this.disabled() || node.disabled) {
      return;
    }

    if (this.selectionEnabled()) {
      this.selectionChange.emit(this.nextSelection(node.id));
    }

    this.nodePressed.emit(node);
  }

  protected onTreeButtonClick(event: MouseEvent, node: AfTreeTableNode): void {
    event.stopPropagation();
    this.onRowPressed(node);
  }

  protected onTreeKeydown(event: KeyboardEvent, entry: AfTreeTableDesktopEntry): void {
    const currentTarget = event.currentTarget as HTMLElement | null;

    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        this.onRowPressed(entry.node);
        return;
      case 'ArrowRight':
        event.preventDefault();
        if (entry.hasChildren) {
          if (!entry.expanded) {
            this.toggleExpanded(entry.node.id);
            return;
          }

          this.focusFirstChild(entry.node.id);
        }
        return;
      case 'ArrowLeft':
        event.preventDefault();
        if (entry.hasChildren && entry.expanded) {
          this.toggleExpanded(entry.node.id);
          return;
        }

        this.focusByNodeId(entry.parentId);
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

  private flattenNodes(
    nodes: readonly AfTreeTableNode[],
    level = 0,
    parentId: string | null = null,
  ): readonly AfTreeTableDesktopEntry[] {
    const entries: AfTreeTableDesktopEntry[] = [];

    for (const node of nodes) {
      const hasChildren = (node.children?.length ?? 0) > 0;
      const expanded = this.expandedIdSet().has(node.id);

      entries.push({
        node,
        parentId,
        level,
        hasChildren,
        expanded,
        selected: this.selectedIdSet().has(node.id),
      });

      if (hasChildren && expanded) {
        entries.push(...this.flattenNodes(node.children ?? [], level + 1, node.id));
      }
    }

    return entries;
  }

  private cellValue(
    node: AfTreeTableNode,
    column: AfDataTableColumn,
  ): unknown {
    const value = this.valueByKey(node.data, column.key);
    if ((value === null || value === undefined || value === '') && this.isTreeColumn(column)) {
      return node.label ?? value;
    }

    return value;
  }

  private valueByKey(value: unknown, key: string): unknown {
    if (!this.isRecord(value)) {
      return undefined;
    }

    return value[key];
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

  private nextSelection(nodeId: string): AfTreeTableSelectedIds {
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

  private focusRelative(currentTarget: HTMLElement | null, delta: number): void {
    if (!currentTarget) {
      return;
    }

    const buttons = this.visibleTreeButtons();
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
    const buttons = this.visibleTreeButtons();
    const target = edge === 'start' ? buttons[0] : buttons[buttons.length - 1];
    target?.focus();
  }

  private focusFirstChild(parentId: string): void {
    const target = this.visibleTreeButtons().find((button) => button.dataset['parentId'] === parentId);
    target?.focus();
  }

  private focusByNodeId(nodeId: string | null): void {
    if (!nodeId) {
      return;
    }

    const target = this.visibleTreeButtons().find((button) => button.dataset['nodeId'] === nodeId);
    target?.focus();
  }

  private visibleTreeButtons(): HTMLElement[] {
    return Array.from(this.hostRef.nativeElement.querySelectorAll('.af-tree-table-desktop__tree-button')).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element.dataset['disabled'] !== 'true',
    );
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
