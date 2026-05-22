import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';
import type { AfIconName } from './icon.types';

export type AfOrganizationChartDensity = 'compact' | 'comfortable';

export type AfOrganizationChartSelectionMode = 'none' | 'single' | 'multiple';

export type AfOrganizationChartSelectedIds = readonly string[];

export type AfOrganizationChartExpandedIds = readonly string[];

export interface AfOrganizationChartBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfOrganizationChartNode<TData = unknown> {
  readonly id: string;
  readonly label: string;
  readonly title?: string;
  readonly description?: string;
  readonly meta?: string;
  readonly avatarLabel?: string;
  readonly badge?: AfOrganizationChartBadge;
  readonly icon?: AfIconName;
  readonly children?: readonly AfOrganizationChartNode<TData>[];
  readonly disabled?: boolean;
  readonly data?: TData;
}

export interface AfOrganizationChartNodeContext<
  TNode extends AfOrganizationChartNode = AfOrganizationChartNode,
> {
  readonly $implicit: TNode;
  readonly node: TNode;
  readonly nodeId: string;
  readonly level: number;
  readonly expanded: boolean;
  readonly selected: boolean;
  readonly hasChildren: boolean;
  readonly childCount: number;
}

export type AfOrganizationChartNodeTemplate<
  TNode extends AfOrganizationChartNode = AfOrganizationChartNode,
> = TemplateRef<AfOrganizationChartNodeContext<TNode>>;