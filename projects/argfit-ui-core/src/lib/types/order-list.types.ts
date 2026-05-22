import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';
import type { AfIconName } from './icon.types';

export type AfOrderListDensity = 'compact' | 'comfortable';

export type AfOrderListSelectionMode = 'single' | 'multiple';

export type AfOrderListSelectedIds = readonly string[];

export type AfOrderListMoveDirection = 'up' | 'down' | 'top' | 'bottom';

export interface AfOrderListBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfOrderListItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly meta?: string;
  readonly badge?: AfOrderListBadge;
  readonly icon?: AfIconName;
  readonly disabled?: boolean;
}

export interface AfOrderListItemContext<TItem extends AfOrderListItem = AfOrderListItem> {
  readonly $implicit: TItem;
  readonly item: TItem;
  readonly itemId: string;
  readonly itemIndex: number;
  readonly selected: boolean;
}

export type AfOrderListItemTemplate<TItem extends AfOrderListItem = AfOrderListItem> = TemplateRef<
  AfOrderListItemContext<TItem>
>;

export interface AfOrderListReorderChange<TItem extends AfOrderListItem = AfOrderListItem> {
  readonly items: readonly TItem[];
  readonly movedIds: readonly string[];
  readonly selectedIds: AfOrderListSelectedIds;
  readonly direction: AfOrderListMoveDirection;
}
