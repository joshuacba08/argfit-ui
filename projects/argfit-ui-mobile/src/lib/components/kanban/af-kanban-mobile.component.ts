import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output, signal, ViewEncapsulation } from '@angular/core';

import {
    type AfKanbanAddCardEvent,
    type AfKanbanCard,
    type AfKanbanCardClickEvent,
    type AfKanbanCardFooterContext,
    type AfKanbanCardFooterTemplate,
    type AfKanbanCardTemplate,
    type AfKanbanColumn,
    type AfKanbanColumnActionEvent,
    type AfKanbanColumnHeaderContext,
    type AfKanbanColumnHeaderTemplate,
    type AfKanbanDensity,
    type AfKanbanEmptyContext,
    type AfKanbanEmptyState,
    type AfKanbanEmptyTemplate,
    type AfKanbanFilter,
    type AfKanbanFilterChange,
    type AfKanbanMoveEvent,
} from '@argfit-ui/core';

const DEFAULT_EMPTY_STATE: AfKanbanEmptyState = {
  title: 'Sin rutinas',
  description: 'Agrega una nueva rutina o cambia el filtro activo.',
};

type AfKanbanMoveDirection = 'up' | 'down' | 'previous-column' | 'next-column';

@Component({
  selector: 'af-kanban-mobile',
  imports: [NgTemplateOutlet],
  templateUrl: './af-kanban-mobile.component.html',
  styleUrl: './af-kanban-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-kanban-mobile',
    '[class]': 'hostClasses()',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class AfKanbanMobileComponent {
  readonly columns = input<readonly AfKanbanColumn[]>([]);
  readonly cards = input<readonly AfKanbanCard[]>([]);
  readonly filters = input<readonly AfKanbanFilter[]>([]);
  readonly activeFilter = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly ariaLabel = input('Kanban');
  readonly cardIdKey = input<keyof AfKanbanCard>('id');
  readonly columnIdKey = input<keyof AfKanbanCard>('columnId');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly allowReorder = input(true, { transform: booleanAttribute });
  readonly allowCrossColumnMove = input(true, { transform: booleanAttribute });
  readonly density = input<AfKanbanDensity>('comfortable');
  readonly emptyState = input<AfKanbanEmptyState>(DEFAULT_EMPTY_STATE);
  readonly cardTemplate = input<AfKanbanCardTemplate | undefined>(undefined);
  readonly columnHeaderTemplate = input<AfKanbanColumnHeaderTemplate | undefined>(undefined);
  readonly emptyTemplate = input<AfKanbanEmptyTemplate | undefined>(undefined);
  readonly cardFooterTemplate = input<AfKanbanCardFooterTemplate | undefined>(undefined);

  readonly cardMove = output<AfKanbanMoveEvent>();
  readonly cardClick = output<AfKanbanCardClickEvent>();
  readonly addCard = output<AfKanbanAddCardEvent>();
  readonly filterChange = output<AfKanbanFilterChange>();
  readonly columnAction = output<AfKanbanColumnActionEvent>();

  protected readonly liveMessage = signal('');
  protected readonly hostClasses = computed(() => ['af-kanban-mobile', `af-kanban-mobile--${this.density()}`].join(' '));

  protected onFilterClick(filter: AfKanbanFilter): void {
    if (this.disabled() || filter.disabled) {
      return;
    }

    this.filterChange.emit({ filter, filterId: filter.id });
  }

  protected onBoardAdd(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const firstColumn = this.columns().find((column) => !column.disabled);
    this.addCard.emit({ trigger: 'board', column: firstColumn, columnId: firstColumn?.id });
  }

  protected onColumnAdd(column: AfKanbanColumn): void {
    if (this.disabled() || this.readonly() || column.disabled) {
      return;
    }

    this.addCard.emit({ trigger: 'column', column, columnId: column.id });
  }

  protected onColumnActionClick(column: AfKanbanColumn, actionId = 'menu'): void {
    if (this.disabled()) {
      return;
    }

    this.columnAction.emit({ column, columnId: column.id, actionId });
  }

  protected onCardClickSelect(card: AfKanbanCard, columnId: string, index: number): void {
    if (this.disabled()) {
      return;
    }

    this.cardClick.emit({ card, columnId, index });
  }

  protected requestMove(event: Event, card: AfKanbanCard, direction: AfKanbanMoveDirection): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.disabled() || this.readonly()) {
      return;
    }

    const sourceColumnId = this.resolveCardColumnId(card);
    const sourceCards = this.cardsForColumn(sourceColumnId);
    const previousIndex = sourceCards.findIndex((candidate) => this.resolveCardId(candidate) === this.resolveCardId(card));
    if (previousIndex === -1) {
      return;
    }

    let targetColumnId = sourceColumnId;
    let currentIndex = previousIndex;

    if (direction === 'up' || direction === 'down') {
      if (!this.allowReorder()) {
        return;
      }

      currentIndex = previousIndex + (direction === 'up' ? -1 : 1);
    } else {
      if (!this.allowCrossColumnMove()) {
        return;
      }

      const neighborColumnId = this.resolveNeighborColumnId(sourceColumnId, direction);
      if (!neighborColumnId) {
        return;
      }

      targetColumnId = neighborColumnId;
      currentIndex = this.cardsForColumn(targetColumnId).length;
    }

    const moveEvent = this.buildMoveEvent(card, sourceColumnId, targetColumnId, previousIndex, currentIndex);
    if (!moveEvent) {
      return;
    }

    this.cardMove.emit(moveEvent);
    this.liveMessage.set(
      `${moveEvent.card.title} movida a ${this.columns().find((column) => column.id === moveEvent.toColumnId)?.label ?? moveEvent.toColumnId}`,
    );
  }

  protected visibleCardsForColumn(columnId: string): readonly AfKanbanCard[] {
    return this.cardsForColumn(columnId).filter((card) => this.matchesActiveFilter(card));
  }

  protected headerContext(column: AfKanbanColumn): AfKanbanColumnHeaderContext {
    const visibleCards = this.visibleCardsForColumn(column.id);
    return {
      $implicit: column,
      column,
      columnId: column.id,
      cards: visibleCards,
      count: visibleCards.length,
    };
  }

  protected cardContext(card: AfKanbanCard, column: AfKanbanColumn, index: number) {
    return {
      $implicit: card,
      card,
      column,
      columnId: column.id,
      cardIndex: index,
    };
  }

  protected cardFooterContext(card: AfKanbanCard, column: AfKanbanColumn): AfKanbanCardFooterContext {
    return {
      $implicit: card,
      card,
      column,
      columnId: column.id,
    };
  }

  protected emptyContext(column: AfKanbanColumn): AfKanbanEmptyContext {
    return {
      $implicit: column,
      column,
      columnId: column.id,
    };
  }

  protected trackColumn(_: number, column: AfKanbanColumn): string {
    return column.id;
  }

  protected trackCard(_: number, card: AfKanbanCard): string {
    return this.resolveCardId(card);
  }

  protected priorityLabel(priority: AfKanbanCard['priority']): string {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
      default:
        return 'Baja';
    }
  }

  protected canMove(card: AfKanbanCard, direction: AfKanbanMoveDirection): boolean {
    if (this.disabled() || this.readonly() || card.disabled) {
      return false;
    }

    const sourceColumnId = this.resolveCardColumnId(card);
    const sourceCards = this.cardsForColumn(sourceColumnId);
    const index = sourceCards.findIndex((candidate) => this.resolveCardId(candidate) === this.resolveCardId(card));
    if (index === -1) {
      return false;
    }

    if (direction === 'up') {
      return this.allowReorder() && index > 0;
    }

    if (direction === 'down') {
      return this.allowReorder() && index < sourceCards.length - 1;
    }

    return this.allowCrossColumnMove() && !!this.resolveNeighborColumnId(sourceColumnId, direction);
  }

  private cardsForColumn(columnId: string): readonly AfKanbanCard[] {
    return this.cards().filter((card) => this.resolveCardColumnId(card) === columnId);
  }

  private matchesActiveFilter(card: AfKanbanCard): boolean {
    const activeFilter = this.activeFilter();

    if (!activeFilter || activeFilter === 'all') {
      return true;
    }

    return (card.category ?? '').toLowerCase() === activeFilter.toLowerCase();
  }

  private resolveNeighborColumnId(columnId: string, direction: 'previous-column' | 'next-column'): string | undefined {
    const enabledColumns = this.columns().filter((column) => !column.disabled);
    const currentIndex = enabledColumns.findIndex((column) => column.id === columnId);
    if (currentIndex === -1) {
      return undefined;
    }

    const offset = direction === 'previous-column' ? -1 : 1;
    return enabledColumns[currentIndex + offset]?.id;
  }

  private buildMoveEvent(
    card: AfKanbanCard,
    sourceColumnId: string,
    targetColumnId: string,
    previousIndex: number,
    currentIndex: number,
  ): AfKanbanMoveEvent | undefined {
    if (sourceColumnId === targetColumnId && !this.allowReorder()) {
      return undefined;
    }

    if (sourceColumnId !== targetColumnId && !this.allowCrossColumnMove()) {
      return undefined;
    }

    const sourceCards = [...this.cardsForColumn(sourceColumnId)];
    const targetCards = sourceColumnId === targetColumnId ? sourceCards : [...this.cardsForColumn(targetColumnId)];
    const normalizedTargetIndex = Math.max(0, Math.min(currentIndex, targetCards.length));
    const [removedCard] = sourceCards.splice(previousIndex, 1);

    if (!removedCard) {
      return undefined;
    }

    if (sourceColumnId === targetColumnId) {
      sourceCards.splice(normalizedTargetIndex, 0, removedCard);

      return {
        cards: this.flattenColumns(new Map([[sourceColumnId, sourceCards]])),
        card: removedCard,
        movedIds: [this.resolveCardId(removedCard)],
        kind: 'reorder',
        fromColumnId: sourceColumnId,
        toColumnId: targetColumnId,
        previousIndex,
        currentIndex: normalizedTargetIndex,
      };
    }

    const movedCard = {
      ...removedCard,
      [this.columnIdKey()]: targetColumnId,
    } as AfKanbanCard;

    targetCards.splice(normalizedTargetIndex, 0, movedCard);

    return {
      cards: this.flattenColumns(
        new Map([
          [sourceColumnId, sourceCards],
          [targetColumnId, targetCards],
        ]),
      ),
      card: movedCard,
      movedIds: [this.resolveCardId(movedCard)],
      kind: 'crossColumn',
      fromColumnId: sourceColumnId,
      toColumnId: targetColumnId,
      previousIndex,
      currentIndex: normalizedTargetIndex,
    };
  }

  private flattenColumns(overrides: Map<string, readonly AfKanbanCard[]>): readonly AfKanbanCard[] {
    const orderedCards: AfKanbanCard[] = [];
    const knownColumnIds = new Set(this.columns().map((column) => column.id));

    for (const column of this.columns()) {
      const columnCards = overrides.get(column.id) ?? this.cardsForColumn(column.id);
      orderedCards.push(...columnCards);
    }

    orderedCards.push(...this.cards().filter((card) => !knownColumnIds.has(this.resolveCardColumnId(card))));

    return orderedCards;
  }

  private resolveCardId(card: AfKanbanCard): string {
    const value = card[this.cardIdKey()];
    return typeof value === 'string' ? value : String(value ?? '');
  }

  private resolveCardColumnId(card: AfKanbanCard): string {
    const value = card[this.columnIdKey()];
    return typeof value === 'string' ? value : String(value ?? '');
  }
}
