import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';
import type { AfIconName } from './icon.types';

export type AfVirtualScrollerDensity = 'compact' | 'comfortable';

export interface AfVirtualScrollerBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfVirtualScrollerItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly meta?: string;
  readonly supportingText?: string;
  readonly badge?: AfVirtualScrollerBadge;
  readonly icon?: AfIconName;
  readonly disabled?: boolean;
}

export interface AfVirtualScrollerRange {
  readonly startIndex: number;
  readonly endIndex: number;
  readonly totalItems: number;
}

export interface AfVirtualScrollerItemContext<TItem extends AfVirtualScrollerItem = AfVirtualScrollerItem> {
  readonly $implicit: TItem;
  readonly item: TItem;
  readonly itemId: string;
  readonly itemIndex: number;
  readonly visibleRange: AfVirtualScrollerRange;
}

export type AfVirtualScrollerItemTemplate<TItem extends AfVirtualScrollerItem = AfVirtualScrollerItem> = TemplateRef<
  AfVirtualScrollerItemContext<TItem>
>;
