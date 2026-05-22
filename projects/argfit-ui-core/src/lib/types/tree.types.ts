import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';
import type { AfIconName } from './icon.types';

export type AfTreeDensity = 'compact' | 'comfortable';

export type AfTreeSelectionMode = 'none' | 'single' | 'multiple';

export type AfTreeSelectedIds = readonly string[];

export type AfTreeExpandedIds = readonly string[];

export interface AfTreeBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfTreeNode {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly meta?: string;
  readonly badge?: AfTreeBadge;
  readonly icon?: AfIconName;
  readonly children?: readonly AfTreeNode[];
  readonly disabled?: boolean;
}

export interface AfTreeNodeContext<TNode extends AfTreeNode = AfTreeNode> {
  readonly $implicit: TNode;
  readonly node: TNode;
  readonly nodeId: string;
  readonly level: number;
  readonly expanded: boolean;
  readonly selected: boolean;
  readonly hasChildren: boolean;
}

export type AfTreeNodeTemplate<TNode extends AfTreeNode = AfTreeNode> = TemplateRef<
  AfTreeNodeContext<TNode>
>;
