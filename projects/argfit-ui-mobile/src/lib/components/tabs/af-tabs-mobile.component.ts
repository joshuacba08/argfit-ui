import { NgTemplateOutlet } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    input,
    output,
    viewChildren,
    ViewEncapsulation,
} from '@angular/core';

import {
    type AfTabChange,
    type AfTabItem,
    type AfTabPanelContext,
    type AfTabPanelDefinition,
    type AfTabsDensity,
    type AfTabsVariant,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeMobileComponent } from '../badge/af-badge-mobile.component';

let nextAfTabsMobileId = 0;

@Component({
  selector: 'af-tabs-mobile',
  imports: [AfBadgeMobileComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-tabs-mobile.component.html',
  styleUrl: './af-tabs-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-tabs-mobile',
    '[attr.data-density]': 'density()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfTabsMobileComponent {
  private readonly defaultTabsId = `af-tabs-mobile-${++nextAfTabsMobileId}`;

  readonly items = input<readonly AfTabItem[]>([]);
  readonly activeId = input<string | undefined>(undefined);
  readonly density = input<AfTabsDensity>('comfortable');
  readonly variant = input<AfTabsVariant>('cards');
  readonly renderPanel = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Tabs');
  readonly panelTemplates = input<readonly AfTabPanelDefinition[]>([]);

  readonly activeIdChange = output<string>();
  readonly tabChange = output<AfTabChange>();

  protected readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');
  protected readonly selectedId = computed(() => this.resolveSelectedId());
  protected readonly selectedItem = computed(() => this.items().find((item) => item.id === this.selectedId()));
  protected readonly selectedIndex = computed(() => this.items().findIndex((item) => item.id === this.selectedId()));
  protected readonly selectedPanelTemplate = computed(() =>
    this.panelTemplates().find((panelTemplate) => panelTemplate.id === this.selectedId())?.templateRef,
  );

  protected tabId(itemId: string): string {
    return `${this.defaultTabsId}-tab-${itemId}`;
  }

  protected panelId(itemId: string): string {
    return `${this.defaultTabsId}-panel-${itemId}`;
  }

  protected tabIndex(itemId: string): number {
    return this.selectedId() === itemId ? 0 : -1;
  }

  protected panelContext(item: AfTabItem, index: number): AfTabPanelContext {
    return {
      $implicit: item,
      item,
      index,
      selected: item.id === this.selectedId(),
      activeId: this.selectedId() ?? item.id,
    };
  }

  protected selectTab(item: AfTabItem, index: number): void {
    if (this.disabled() || item.disabled) {
      return;
    }

    const previousId = this.selectedId();
    if (previousId === item.id) {
      return;
    }

    this.activeIdChange.emit(item.id);
    this.tabChange.emit({ activeId: item.id, previousId, item, index });
  }

  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const nextIndex = this.resolveNextEnabledIndex(index, event.key);
    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    const nextItem = this.items()[nextIndex];
    if (!nextItem) {
      return;
    }

    this.selectTab(nextItem, nextIndex);
    queueMicrotask(() => this.tabButtons()[nextIndex]?.nativeElement.focus());
  }

  private resolveSelectedId(): string | undefined {
    const explicitItem = this.items().find((item) => item.id === this.activeId() && !item.disabled);
    if (explicitItem) {
      return explicitItem.id;
    }

    return this.items().find((item) => !item.disabled)?.id ?? this.items()[0]?.id;
  }

  private resolveNextEnabledIndex(currentIndex: number, key: string): number | undefined {
    if (this.disabled() || this.items().length === 0) {
      return undefined;
    }

    if (key === 'Home') {
      return this.items().findIndex((item) => !item.disabled);
    }

    if (key === 'End') {
      for (let index = this.items().length - 1; index >= 0; index -= 1) {
        if (!this.items()[index]?.disabled) {
          return index;
        }
      }

      return undefined;
    }

    const step = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 0;
    if (step === 0) {
      return undefined;
    }

    let nextIndex = currentIndex;
    for (let attempts = 0; attempts < this.items().length; attempts += 1) {
      nextIndex = (nextIndex + step + this.items().length) % this.items().length;
      if (!this.items()[nextIndex]?.disabled) {
        return nextIndex;
      }
    }

    return undefined;
  }
}
