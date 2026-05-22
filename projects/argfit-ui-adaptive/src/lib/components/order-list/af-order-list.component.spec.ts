import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  provideArgfitUi,
  type AfOrderListItem,
  type AfOrderListReorderChange,
  type AfOrderListSelectedIds,
} from '@argfit-ui/core';

import { AfOrderListItemDirective } from './af-order-list-item.directive';
import {
  AfOrderListActionsDirective,
  AfOrderListEmptyDirective,
  AfOrderListLoadingDirective,
} from './af-order-list-slots.directive';
import { AfOrderListComponent } from './af-order-list.component';

@Component({
  standalone: true,
  imports: [
    AfOrderListActionsDirective,
    AfOrderListComponent,
    AfOrderListEmptyDirective,
    AfOrderListItemDirective,
    AfOrderListLoadingDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-order-list
      [items]="items()"
      [selectedIds]="selectedIds()"
      selectionMode="multiple"
      emptyDescription="No hay tests para ordenar"
      (selectionChange)="selectedIds.set($event)"
      (reorderChange)="applyReorder($event)"
    >
      <div afOrderListActions class="order-list-actions">Acciones order list</div>
      <div afOrderListEmpty class="order-list-empty">Order list vacia custom</div>
      <div afOrderListLoading class="order-list-loading">Order list loading custom</div>
      <ng-template afOrderListItem let-item let-selected="selected">
        <div class="order-list-template">{{ item.label }} · {{ selected ? 'selected' : 'idle' }}</div>
      </ng-template>
    </af-order-list>
  `,
})
class AdaptiveOrderListHostComponent {
  readonly items = signal<readonly AfOrderListItem[]>([
    {
      id: 'warmup',
      label: 'Warm-up neural',
      description: 'Activacion y saltos submaximos',
      meta: '4 min',
      icon: 'activity',
    },
    {
      id: 'cmj',
      label: 'CMJ principal',
      description: 'Bloque de potencia con feedback',
      meta: '8 intentos',
      icon: 'bar-chart-3',
    },
    {
      id: 'drop-jump',
      label: 'Drop jump',
      description: 'Chequeo de RSI',
      meta: '4 intentos',
      icon: 'check-square',
    },
  ]);
  readonly selectedIds = signal<AfOrderListSelectedIds>(['cmj']);

  applyReorder(change: AfOrderListReorderChange): void {
    this.items.set(change.items);
    this.selectedIds.set(change.selectedIds);
  }
}

describe('AfOrderListComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop order list with projected actions and reorders the selected item', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveOrderListHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveOrderListHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-order-list-desktop')).not.toBeNull();
    expect(root.querySelector('af-order-list-mobile')).toBeNull();
    expect(root.querySelector('.order-list-actions')?.textContent).toContain('Acciones order list');
    expect(root.querySelector('.order-list-template')?.textContent).toContain('Warm-up neural');

    const moveTopButton = root.querySelector(
      '.af-order-list-desktop__control[data-direction="top"]',
    ) as HTMLButtonElement;
    moveTopButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.items().map((item) => item.id)).toEqual(['cmj', 'warmup', 'drop-jump']);
  });

  it('renders mobile order list with the custom empty slot', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveOrderListHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveOrderListHostComponent);
    fixture.componentInstance.items.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-order-list-mobile')).not.toBeNull();
    expect(root.querySelector('af-order-list-desktop')).toBeNull();
    expect(root.querySelector('.order-list-empty')?.textContent).toContain('Order list vacia custom');
  });
});
