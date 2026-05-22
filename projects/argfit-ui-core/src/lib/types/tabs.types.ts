import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';
import type { AfIconName } from './icon.types';

export type AfTabsDensity = 'compact' | 'comfortable';

export interface AfTabBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfTabItem<TData = unknown> {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: AfIconName;
  readonly badge?: AfTabBadge;
  readonly disabled?: boolean;
  readonly data?: TData;
}

export interface AfTabChange<TTab extends AfTabItem = AfTabItem> {
  readonly activeId: string;
  readonly previousId?: string;
  readonly item: TTab;
  readonly index: number;
}

export interface AfTabPanelContext<TTab extends AfTabItem = AfTabItem> {
  readonly $implicit: TTab;
  readonly item: TTab;
  readonly index: number;
  readonly selected: boolean;
  readonly activeId: string;
}

export type AfTabPanelTemplate<TTab extends AfTabItem = AfTabItem> = TemplateRef<AfTabPanelContext<TTab>>;

export interface AfTabPanelDefinition<TTab extends AfTabItem = AfTabItem> {
  readonly id: string;
  readonly templateRef: AfTabPanelTemplate<TTab>;
}