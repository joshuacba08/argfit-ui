import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';
import type { AfIconName } from './icon.types';

export type AfPickListDensity = 'compact' | 'comfortable';

export type AfPickListSelectedIds = readonly string[];

export type AfPickListListKey = 'source' | 'target';

export type AfPickListTransferDirection = 'toTarget' | 'toSource' | 'allToTarget' | 'allToSource';

export interface AfPickListBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfPickListItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly meta?: string;
  readonly badge?: AfPickListBadge;
  readonly icon?: AfIconName;
  readonly disabled?: boolean;
}

export interface AfPickListItemContext<TItem extends AfPickListItem = AfPickListItem> {
  readonly $implicit: TItem;
  readonly item: TItem;
  readonly itemId: string;
  readonly itemIndex: number;
  readonly list: AfPickListListKey;
  readonly selected: boolean;
}

export type AfPickListItemTemplate<TItem extends AfPickListItem = AfPickListItem> = TemplateRef<
  AfPickListItemContext<TItem>
>;

export interface AfPickListChange<TItem extends AfPickListItem = AfPickListItem> {
  readonly sourceItems: readonly TItem[];
  readonly targetItems: readonly TItem[];
  readonly movedIds: readonly string[];
  readonly direction: AfPickListTransferDirection;
  readonly sourceSelectedIds: AfPickListSelectedIds;
  readonly targetSelectedIds: AfPickListSelectedIds;
}
