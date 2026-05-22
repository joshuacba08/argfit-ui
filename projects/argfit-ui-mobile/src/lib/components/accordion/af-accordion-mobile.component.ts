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
    type AfAccordionChange,
    type AfAccordionDensity,
    type AfAccordionExpandedIds,
    type AfAccordionItem,
    type AfAccordionPanelContext,
    type AfAccordionPanelDefinition,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeMobileComponent } from '../badge/af-badge-mobile.component';

let nextAfAccordionMobileId = 0;

@Component({
  selector: 'af-accordion-mobile',
  imports: [AfBadgeMobileComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-accordion-mobile.component.html',
  styleUrl: './af-accordion-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-accordion-mobile',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfAccordionMobileComponent {
  private readonly defaultAccordionId = `af-accordion-mobile-${++nextAfAccordionMobileId}`;

  readonly items = input<readonly AfAccordionItem[]>([]);
  readonly expandedIds = input<AfAccordionExpandedIds>([]);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly density = input<AfAccordionDensity>('comfortable');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Accordion');
  readonly panelTemplates = input<readonly AfAccordionPanelDefinition[]>([]);

  readonly expandedChange = output<AfAccordionExpandedIds>();
  readonly itemToggle = output<AfAccordionChange>();

  protected readonly headerButtons = viewChildren<ElementRef<HTMLButtonElement>>('headerButton');
  protected readonly expandedIdSet = computed(() => new Set(this.expandedIds()));

  protected headerId(itemId: string): string {
    return `${this.defaultAccordionId}-header-${itemId}`;
  }

  protected panelId(itemId: string): string {
    return `${this.defaultAccordionId}-panel-${itemId}`;
  }

  protected isExpanded(itemId: string): boolean {
    return this.expandedIdSet().has(itemId);
  }

  protected panelTemplateFor(itemId: string) {
    return this.panelTemplates().find((panelTemplate) => panelTemplate.id === itemId)?.templateRef;
  }

  protected panelContext(item: AfAccordionItem, index: number): AfAccordionPanelContext {
    return {
      $implicit: item,
      item,
      index,
      expanded: this.isExpanded(item.id),
    };
  }

  protected toggleItem(item: AfAccordionItem, index: number): void {
    if (this.disabled() || item.disabled) {
      return;
    }

    const expanded = !this.isExpanded(item.id);
    const nextExpandedIds = expanded
      ? this.multiple()
        ? [...this.expandedIds(), item.id]
        : [item.id]
      : this.expandedIds().filter((expandedId) => expandedId !== item.id);

    this.expandedChange.emit(nextExpandedIds);
    this.itemToggle.emit({ expandedIds: nextExpandedIds, item, expanded, index });
  }

  protected onHeaderKeydown(event: KeyboardEvent, index: number, item: AfAccordionItem): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleItem(item, index);
      return;
    }

    const nextIndex = this.resolveNextEnabledIndex(index, event.key);
    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    queueMicrotask(() => this.headerButtons()[nextIndex]?.nativeElement.focus());
  }

  private resolveNextEnabledIndex(currentIndex: number, key: string): number | undefined {
    if (this.items().length === 0) {
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

    const step = key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
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
