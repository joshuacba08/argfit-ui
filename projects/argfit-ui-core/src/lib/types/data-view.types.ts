import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';

export type AfDataViewLayout = 'grid' | 'list';

export type AfDataViewDensity = 'compact' | 'comfortable';

export interface AfDataViewBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfDataViewItem {
  readonly id: string;
  readonly title: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly meta?: string;
  readonly supportingText?: string;
  readonly badge?: AfDataViewBadge;
  readonly disabled?: boolean;
}

export interface AfDataViewItemContext<TItem extends AfDataViewItem = AfDataViewItem> {
  readonly $implicit: TItem;
  readonly item: TItem;
  readonly itemId: string;
  readonly itemIndex: number;
  readonly layout: AfDataViewLayout;
}

export type AfDataViewItemTemplate<TItem extends AfDataViewItem = AfDataViewItem> = TemplateRef<
  AfDataViewItemContext<TItem>
>;