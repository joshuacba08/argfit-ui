import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';
import type { AfIconName } from './icon.types';

export type AfTimelineDensity = 'compact' | 'comfortable';

export interface AfTimelineBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfTimelineItem {
  readonly id: string;
  readonly title: string;
  readonly timestamp: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly meta?: string;
  readonly badge?: AfTimelineBadge;
  readonly icon?: AfIconName;
  readonly tone?: AfBadgeTone;
  readonly disabled?: boolean;
}

export interface AfTimelineItemContext<TItem extends AfTimelineItem = AfTimelineItem> {
  readonly $implicit: TItem;
  readonly item: TItem;
  readonly itemId: string;
  readonly itemIndex: number;
}

export type AfTimelineItemTemplate<TItem extends AfTimelineItem = AfTimelineItem> = TemplateRef<
  AfTimelineItemContext<TItem>
>;
