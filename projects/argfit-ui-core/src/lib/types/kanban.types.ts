import type { TemplateRef } from '@angular/core';

import type { AfBadgeTone } from './badge.types';
import type { AfIconName } from './icon.types';

export type AfKanbanDensity = 'compact' | 'comfortable';

export type AfKanbanPriority = 'low' | 'medium' | 'high';

export interface AfKanbanBadge {
  readonly label: string;
  readonly tone?: AfBadgeTone;
}

export interface AfKanbanColumn<TData = unknown> {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly meta?: string;
  readonly icon?: AfIconName;
  readonly badge?: AfKanbanBadge;
  readonly disabled?: boolean;
  readonly accentColor?: string;
  readonly data?: TData;
}

export interface AfKanbanCard<TData = unknown> {
  readonly id: string;
  readonly columnId: string;
  readonly title: string;
  readonly description?: string;
  readonly category?: string;
  readonly priority?: AfKanbanPriority;
  readonly badge?: AfKanbanBadge;
  readonly icon?: AfIconName;
  readonly assigneeName?: string;
  readonly assigneeInitials?: string;
  readonly dateLabel?: string;
  readonly metricLabel?: string;
  readonly meta?: string;
  readonly disabled?: boolean;
  readonly data?: TData;
}

export interface AfKanbanFilter<TData = unknown> {
  readonly id: string;
  readonly label: string;
  readonly count?: number;
  readonly disabled?: boolean;
  readonly data?: TData;
}

export interface AfKanbanEmptyState {
  readonly title: string;
  readonly description?: string;
}

export interface AfKanbanMoveEvent<TCard extends AfKanbanCard = AfKanbanCard> {
  readonly cards: readonly TCard[];
  readonly card: TCard;
  readonly movedIds: readonly string[];
  readonly kind: 'reorder' | 'crossColumn';
  readonly fromColumnId: string;
  readonly toColumnId: string;
  readonly previousIndex: number;
  readonly currentIndex: number;
}

export interface AfKanbanCardClickEvent<TCard extends AfKanbanCard = AfKanbanCard> {
  readonly card: TCard;
  readonly columnId: string;
  readonly index: number;
}

export interface AfKanbanAddCardEvent<TColumn extends AfKanbanColumn = AfKanbanColumn> {
  readonly trigger: 'board' | 'column';
  readonly column?: TColumn;
  readonly columnId?: string;
}

export interface AfKanbanFilterChange<TFilter extends AfKanbanFilter = AfKanbanFilter> {
  readonly filter: TFilter;
  readonly filterId: string;
}

export interface AfKanbanColumnActionEvent<TColumn extends AfKanbanColumn = AfKanbanColumn> {
  readonly column: TColumn;
  readonly columnId: string;
  readonly actionId: string;
}

export interface AfKanbanCardContext<TCard extends AfKanbanCard = AfKanbanCard, TColumn extends AfKanbanColumn = AfKanbanColumn> {
  readonly $implicit: TCard;
  readonly card: TCard;
  readonly column: TColumn;
  readonly columnId: string;
  readonly cardIndex: number;
}

export interface AfKanbanColumnHeaderContext<TColumn extends AfKanbanColumn = AfKanbanColumn, TCard extends AfKanbanCard = AfKanbanCard> {
  readonly $implicit: TColumn;
  readonly column: TColumn;
  readonly columnId: string;
  readonly cards: readonly TCard[];
  readonly count: number;
}

export interface AfKanbanEmptyContext<TColumn extends AfKanbanColumn = AfKanbanColumn> {
  readonly $implicit: TColumn;
  readonly column: TColumn;
  readonly columnId: string;
}

export interface AfKanbanCardFooterContext<TCard extends AfKanbanCard = AfKanbanCard, TColumn extends AfKanbanColumn = AfKanbanColumn> {
  readonly $implicit: TCard;
  readonly card: TCard;
  readonly column: TColumn;
  readonly columnId: string;
}

export type AfKanbanCardTemplate<TCard extends AfKanbanCard = AfKanbanCard, TColumn extends AfKanbanColumn = AfKanbanColumn> =
  TemplateRef<AfKanbanCardContext<TCard, TColumn>>;

export type AfKanbanColumnHeaderTemplate<
  TColumn extends AfKanbanColumn = AfKanbanColumn,
  TCard extends AfKanbanCard = AfKanbanCard,
> = TemplateRef<AfKanbanColumnHeaderContext<TColumn, TCard>>;

export type AfKanbanEmptyTemplate<TColumn extends AfKanbanColumn = AfKanbanColumn> = TemplateRef<AfKanbanEmptyContext<TColumn>>;

export type AfKanbanCardFooterTemplate<
  TCard extends AfKanbanCard = AfKanbanCard,
  TColumn extends AfKanbanColumn = AfKanbanColumn,
> = TemplateRef<AfKanbanCardFooterContext<TCard, TColumn>>;
