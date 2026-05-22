import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  type AfOrderListDensity,
  type AfOrderListItem,
  type AfOrderListItemContext,
  type AfOrderListItemTemplate,
  type AfOrderListMoveDirection,
  type AfOrderListReorderChange,
  type AfOrderListSelectedIds,
  type AfOrderListSelectionMode,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeMobileComponent } from '../badge/af-badge-mobile.component';

type AfOrderListMobileState = 'ready' | 'loading' | 'empty' | 'error';

@Component({
  selector: 'af-order-list-mobile',
  imports: [AfBadgeMobileComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-order-list-mobile.component.html',
  styleUrl: './af-order-list-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-order-list-mobile',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfOrderListMobileComponent {
  readonly items = input<readonly AfOrderListItem[]>([]);
  readonly selectedIds = input<AfOrderListSelectedIds>([]);
  readonly selectionMode = input<AfOrderListSelectionMode>('single');
  readonly density = input<AfOrderListDensity>('comfortable');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin items');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Lista ordenable');
  readonly itemTemplate = input<AfOrderListItemTemplate | undefined>(undefined);
  readonly actionsTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly emptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly loadingTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly selectionChange = output<AfOrderListSelectedIds>();
  readonly reorderChange = output<AfOrderListReorderChange>();

  protected readonly moveDirections: readonly AfOrderListMoveDirection[] = ['top', 'up', 'down', 'bottom'];
  protected readonly state = computed<AfOrderListMobileState>(() => {
    if (this.error()) {
      return 'error';
    }

    if (this.loading()) {
      return 'loading';
    }

    return this.items().length > 0 ? 'ready' : 'empty';
  });
  protected readonly selectedIdSet = computed(() => new Set(this.selectedIds()));
  protected readonly selectedCount = computed(() =>
    this.items().filter((item) => this.selectedIdSet().has(item.id)).length,
  );
  protected readonly skeletonItems = computed(() => Array.from({ length: 4 }, (_, index) => index));

  protected itemContext(item: AfOrderListItem, itemIndex: number): AfOrderListItemContext {
    return {
      $implicit: item,
      item,
      itemId: item.id,
      itemIndex,
      selected: this.isSelected(item.id),
    };
  }

  protected isSelected(itemId: string): boolean {
    return this.selectedIdSet().has(itemId);
  }

  protected isItemDisabled(item: AfOrderListItem): boolean {
    return this.disabled() || item.disabled === true;
  }

  protected onItemPressed(item: AfOrderListItem): void {
    if (this.isItemDisabled(item)) {
      return;
    }

    this.selectionChange.emit(this.nextSelection(item.id));
  }

  protected onItemKeydown(event: KeyboardEvent, item: AfOrderListItem): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.onItemPressed(item);
      return;
    }

    const currentTarget = event.currentTarget as HTMLButtonElement | null;

    if (!currentTarget) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusSibling(currentTarget, 'next');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusSibling(currentTarget, 'previous');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.focusEdge('start');
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.focusEdge('end');
    }
  }

  protected onMove(direction: AfOrderListMoveDirection): void {
    if (!this.canMove(direction)) {
      return;
    }

    const nextItems = this.reorderItems(direction);
    this.reorderChange.emit({
      items: nextItems,
      movedIds: this.selectedIds(),
      selectedIds: this.selectedIds(),
      direction,
    });
  }

  protected canMove(direction: AfOrderListMoveDirection): boolean {
    if (this.disabled() || this.selectedIds().length === 0) {
      return false;
    }

    const items = this.items();
    const selected = this.selectedIdSet();

    if (direction === 'top' || direction === 'up') {
      return items.some((item, index) => selected.has(item.id) && index > 0 && !selected.has(items[index - 1]!.id));
    }

    return items.some(
      (item, index) => selected.has(item.id) && index < items.length - 1 && !selected.has(items[index + 1]!.id),
    );
  }

  protected moveButtonText(direction: AfOrderListMoveDirection): string {
    switch (direction) {
      case 'top':
        return 'Inicio';
      case 'up':
        return 'Subir';
      case 'down':
        return 'Bajar';
      case 'bottom':
        return 'Final';
    }
  }

  protected moveButtonIcon(direction: AfOrderListMoveDirection): 'arrow-up' | 'chevron-up' | 'chevron-down' | 'arrow-down' {
    switch (direction) {
      case 'top':
        return 'arrow-up';
      case 'up':
        return 'chevron-up';
      case 'down':
        return 'chevron-down';
      case 'bottom':
        return 'arrow-down';
    }
  }

  private nextSelection(itemId: string): AfOrderListSelectedIds {
    if (this.selectionMode() === 'multiple') {
      const next = [...this.selectedIds()];
      const index = next.indexOf(itemId);

      if (index >= 0) {
        next.splice(index, 1);
      } else {
        next.push(itemId);
      }

      return next;
    }

    return [itemId];
  }

  private reorderItems(direction: AfOrderListMoveDirection): readonly AfOrderListItem[] {
    const selected = this.selectedIdSet();
    const current = [...this.items()];

    if (direction === 'top') {
      return [...current.filter((item) => selected.has(item.id)), ...current.filter((item) => !selected.has(item.id))];
    }

    if (direction === 'bottom') {
      return [...current.filter((item) => !selected.has(item.id)), ...current.filter((item) => selected.has(item.id))];
    }

    if (direction === 'up') {
      for (let index = 1; index < current.length; index += 1) {
        if (selected.has(current[index]!.id) && !selected.has(current[index - 1]!.id)) {
          [current[index - 1], current[index]] = [current[index]!, current[index - 1]!];
        }
      }

      return current;
    }

    for (let index = current.length - 2; index >= 0; index -= 1) {
      if (selected.has(current[index]!.id) && !selected.has(current[index + 1]!.id)) {
        [current[index], current[index + 1]] = [current[index + 1]!, current[index]!];
      }
    }

    return current;
  }

  private focusSibling(currentTarget: HTMLButtonElement, direction: 'next' | 'previous'): void {
    const list = currentTarget.closest('.af-order-list-mobile__list');
    const items = Array.from(list?.querySelectorAll('.af-order-list-mobile__item') ?? []).filter(
      (item): item is HTMLButtonElement => item instanceof HTMLButtonElement && !item.disabled,
    );
    const currentIndex = items.indexOf(currentTarget);

    if (currentIndex < 0) {
      return;
    }

    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    items[nextIndex]?.focus();
  }

  private focusEdge(edge: 'start' | 'end'): void {
    const items = Array.from(document.querySelectorAll('.af-order-list-mobile__item')).filter(
      (item): item is HTMLButtonElement => item instanceof HTMLButtonElement && !item.disabled,
    );
    const target = edge === 'start' ? items[0] : items[items.length - 1];
    target?.focus();
  }
}
