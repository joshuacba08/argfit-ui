import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';
import type { AfDataTableColumn } from './data-table.types';
import type { AfIconName } from './icon.types';

export type AfTreeTableDensity = 'compact' | 'normal' | 'comfortable';

export type AfTreeTableSelectionMode = 'none' | 'single' | 'multiple';

export type AfTreeTableSelectedIds = readonly string[];

export type AfTreeTableExpandedIds = readonly string[];

export interface AfTreeTableBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfTreeTableNode<TData extends object = object> {
  readonly id: string;
  readonly data: TData;
  readonly label?: string;
  readonly description?: string;
  readonly meta?: string;
  readonly badge?: AfTreeTableBadge;
  readonly icon?: AfIconName;
  readonly children?: readonly AfTreeTableNode<TData>[];
  readonly disabled?: boolean;
}

export interface AfTreeTableCellContext<
  TNode extends AfTreeTableNode = AfTreeTableNode,
  TData = TNode['data'],
> {
  readonly $implicit: unknown;
  readonly value: unknown;
  readonly node: TNode;
  readonly data: TData;
  readonly column: AfDataTableColumn<TData>;
  readonly nodeId: string;
  readonly level: number;
  readonly expanded: boolean;
  readonly selected: boolean;
  readonly hasChildren: boolean;
}

export interface AfTreeTableCellTemplate<
  TNode extends AfTreeTableNode = AfTreeTableNode,
  TData = TNode['data'],
> {
  readonly columnKey: string;
  readonly template: TemplateRef<AfTreeTableCellContext<TNode, TData>>;
}
