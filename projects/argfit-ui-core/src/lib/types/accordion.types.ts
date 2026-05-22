import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';
import type { AfIconName } from './icon.types';

export type AfAccordionDensity = 'compact' | 'comfortable';

export type AfAccordionExpandedIds = readonly string[];

export interface AfAccordionBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfAccordionItem<TData = unknown> {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly meta?: string;
  readonly icon?: AfIconName;
  readonly badge?: AfAccordionBadge;
  readonly disabled?: boolean;
  readonly data?: TData;
}

export interface AfAccordionChange<TItem extends AfAccordionItem = AfAccordionItem> {
  readonly expandedIds: AfAccordionExpandedIds;
  readonly item: TItem;
  readonly expanded: boolean;
  readonly index: number;
}

export interface AfAccordionPanelContext<TItem extends AfAccordionItem = AfAccordionItem> {
  readonly $implicit: TItem;
  readonly item: TItem;
  readonly index: number;
  readonly expanded: boolean;
}

export type AfAccordionPanelTemplate<TItem extends AfAccordionItem = AfAccordionItem> =
  TemplateRef<AfAccordionPanelContext<TItem>>;

export interface AfAccordionPanelDefinition<TItem extends AfAccordionItem = AfAccordionItem> {
  readonly id: string;
  readonly templateRef: AfAccordionPanelTemplate<TItem>;
}