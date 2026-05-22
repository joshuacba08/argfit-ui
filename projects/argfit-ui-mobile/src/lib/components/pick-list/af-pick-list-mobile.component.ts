import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  type AfPickListChange,
  type AfPickListDensity,
  type AfPickListItem,
  type AfPickListItemContext,
  type AfPickListItemTemplate,
  type AfPickListListKey,
  type AfPickListSelectedIds,
  type AfPickListTransferDirection,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeMobileComponent } from '../badge/af-badge-mobile.component';

type AfPickListMobileState = 'ready' | 'loading' | 'empty' | 'error';

@Component({
  selector: 'af-pick-list-mobile',
  imports: [AfBadgeMobileComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-pick-list-mobile.component.html',
  styleUrl: './af-pick-list-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-pick-list-mobile',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfPickListMobileComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly sourceItems = input<readonly AfPickListItem[]>([]);
  readonly targetItems = input<readonly AfPickListItem[]>([]);
  readonly sourceSelectedIds = input<AfPickListSelectedIds>([]);
  readonly targetSelectedIds = input<AfPickListSelectedIds>([]);
  readonly sourceTitle = input('Disponibles');
  readonly sourceDescription = input<string | undefined>(undefined);
  readonly targetTitle = input('Asignados');
  readonly targetDescription = input<string | undefined>(undefined);
  readonly density = input<AfPickListDensity>('comfortable');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly sourceEmptyTitle = input('Sin items disponibles');
  readonly sourceEmptyDescription = input<string | undefined>(undefined);
  readonly targetEmptyTitle = input('Sin items asignados');
  readonly targetEmptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Pick list');
  readonly itemTemplate = input<AfPickListItemTemplate | undefined>(undefined);
  readonly actionsTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly sourceEmptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly targetEmptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly loadingTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly sourceSelectionChange = output<AfPickListSelectedIds>();
  readonly targetSelectionChange = output<AfPickListSelectedIds>();
  readonly transferChange = output<AfPickListChange>();

  protected readonly transferDirections: readonly AfPickListTransferDirection[] = [
    'toTarget',
    'toSource',
    'allToTarget',
    'allToSource',
  ];
  protected readonly state = computed<AfPickListMobileState>(() => {
    if (this.error()) {
      return 'error';
    }

    if (this.loading()) {
      return 'loading';
    }

    return this.sourceItems().length === 0 && this.targetItems().length === 0 ? 'empty' : 'ready';
  });
  protected readonly sourceSelectedSet = computed(() => new Set(this.sourceSelectedIds()));
  protected readonly targetSelectedSet = computed(() => new Set(this.targetSelectedIds()));
  protected readonly skeletonItems = computed(() => Array.from({ length: 3 }, (_, index) => index));

  protected itemContext(item: AfPickListItem, itemIndex: number, list: AfPickListListKey): AfPickListItemContext {
    return {
      $implicit: item,
      item,
      itemId: item.id,
      itemIndex,
      list,
      selected: this.isSelected(list, item.id),
    };
  }

  protected isSelected(list: AfPickListListKey, itemId: string): boolean {
    return list === 'source' ? this.sourceSelectedSet().has(itemId) : this.targetSelectedSet().has(itemId);
  }

  protected isItemDisabled(item: AfPickListItem): boolean {
    return this.disabled() || item.disabled === true;
  }

  protected onItemPressed(list: AfPickListListKey, item: AfPickListItem): void {
    if (this.isItemDisabled(item)) {
      return;
    }

    const nextSelection = this.nextSelection(list, item.id);

    if (list === 'source') {
      this.sourceSelectionChange.emit(nextSelection);
      return;
    }

    this.targetSelectionChange.emit(nextSelection);
  }

  protected onItemKeydown(event: KeyboardEvent, list: AfPickListListKey, item: AfPickListItem): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.onItemPressed(list, item);
      return;
    }

    const currentTarget = event.currentTarget as HTMLButtonElement | null;

    if (!currentTarget) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusSibling(list, currentTarget, 'next');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusSibling(list, currentTarget, 'previous');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.focusEdge(list, 'start');
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.focusEdge(list, 'end');
    }
  }

  protected onTransfer(direction: AfPickListTransferDirection): void {
    if (!this.canTransfer(direction)) {
      return;
    }

    this.transferChange.emit(this.nextTransferState(direction));
  }

  protected canTransfer(direction: AfPickListTransferDirection): boolean {
    if (this.disabled()) {
      return false;
    }

    switch (direction) {
      case 'toTarget':
        return this.movableSelectedItems('source').length > 0;
      case 'toSource':
        return this.movableSelectedItems('target').length > 0;
      case 'allToTarget':
        return this.movableItems('source').length > 0;
      case 'allToSource':
        return this.movableItems('target').length > 0;
    }
  }

  protected transferButtonText(direction: AfPickListTransferDirection): string {
    switch (direction) {
      case 'toTarget':
        return 'Asignar';
      case 'toSource':
        return 'Quitar';
      case 'allToTarget':
        return 'Todo';
      case 'allToSource':
        return 'Vaciar';
    }
  }

  protected transferButtonIcon(
    direction: AfPickListTransferDirection,
  ): 'chevron-right' | 'chevron-left' {
    switch (direction) {
      case 'toTarget':
        return 'chevron-right';
      case 'toSource':
        return 'chevron-left';
      case 'allToTarget':
        return 'chevron-right';
      case 'allToSource':
        return 'chevron-left';
    }
  }

  private nextSelection(list: AfPickListListKey, itemId: string): AfPickListSelectedIds {
    const current = list === 'source' ? [...this.sourceSelectedIds()] : [...this.targetSelectedIds()];
    const index = current.indexOf(itemId);

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(itemId);
    }

    return current;
  }

  private nextTransferState(direction: AfPickListTransferDirection): AfPickListChange {
    const sourceItems = [...this.sourceItems()];
    const targetItems = [...this.targetItems()];

    switch (direction) {
      case 'toTarget': {
        const moved = this.movableSelectedItems('source');
        const movedIds = moved.map((item) => item.id);

        return {
          sourceItems: sourceItems.filter((item) => !movedIds.includes(item.id)),
          targetItems: [...targetItems, ...moved],
          movedIds,
          direction,
          sourceSelectedIds: [],
          targetSelectedIds: [],
        };
      }

      case 'toSource': {
        const moved = this.movableSelectedItems('target');
        const movedIds = moved.map((item) => item.id);

        return {
          sourceItems: [...sourceItems, ...moved],
          targetItems: targetItems.filter((item) => !movedIds.includes(item.id)),
          movedIds,
          direction,
          sourceSelectedIds: [],
          targetSelectedIds: [],
        };
      }

      case 'allToTarget': {
        const moved = this.movableItems('source');
        const movedIds = moved.map((item) => item.id);

        return {
          sourceItems: sourceItems.filter((item) => item.disabled === true),
          targetItems: [...targetItems, ...moved],
          movedIds,
          direction,
          sourceSelectedIds: [],
          targetSelectedIds: [],
        };
      }

      case 'allToSource': {
        const moved = this.movableItems('target');
        const movedIds = moved.map((item) => item.id);

        return {
          sourceItems: [...sourceItems, ...moved],
          targetItems: targetItems.filter((item) => item.disabled === true),
          movedIds,
          direction,
          sourceSelectedIds: [],
          targetSelectedIds: [],
        };
      }
    }
  }

  private movableItems(list: AfPickListListKey): readonly AfPickListItem[] {
    const items = list === 'source' ? this.sourceItems() : this.targetItems();
    return items.filter((item) => item.disabled !== true);
  }

  private movableSelectedItems(list: AfPickListListKey): readonly AfPickListItem[] {
    const items = list === 'source' ? this.sourceItems() : this.targetItems();
    const selectedSet = list === 'source' ? this.sourceSelectedSet() : this.targetSelectedSet();

    return items.filter((item) => item.disabled !== true && selectedSet.has(item.id));
  }

  private focusSibling(list: AfPickListListKey, currentTarget: HTMLButtonElement, direction: 'next' | 'previous'): void {
    const items = Array.from(this.hostRef.nativeElement.querySelectorAll(`.af-pick-list-mobile__item[data-list="${list}"]`)).filter(
      (item): item is HTMLButtonElement => item instanceof HTMLButtonElement && !item.disabled,
    );
    const currentIndex = items.indexOf(currentTarget);

    if (currentIndex < 0) {
      return;
    }

    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    items[nextIndex]?.focus();
  }

  private focusEdge(list: AfPickListListKey, edge: 'start' | 'end'): void {
    const items = Array.from(this.hostRef.nativeElement.querySelectorAll(`.af-pick-list-mobile__item[data-list="${list}"]`)).filter(
      (item): item is HTMLButtonElement => item instanceof HTMLButtonElement && !item.disabled,
    );
    const target = edge === 'start' ? items[0] : items[items.length - 1];
    target?.focus();
  }
}
