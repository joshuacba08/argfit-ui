import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
    provideArgfitUi,
    type AfKanbanAddCardEvent,
    type AfKanbanCard,
    type AfKanbanCardClickEvent,
    type AfKanbanColumn,
    type AfKanbanColumnActionEvent,
    type AfKanbanFilter,
    type AfKanbanFilterChange,
    type AfKanbanMoveEvent,
} from '@argfit-ui/core';
import { AfKanbanDesktopComponent } from '@argfit-ui/desktop';
import { AfKanbanMobileComponent } from '@argfit-ui/mobile';

import { AfKanbanComponent } from './af-kanban.component';

@Component({
  imports: [AfKanbanComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-kanban
      [columns]="columns"
      [cards]="cards()"
      [filters]="filters"
      [activeFilter]="activeFilter()"
      title="Workflow"
      ariaLabel="Kanban tests"
      (cardMove)="handleMove($event)"
      (cardClick)="handleCardClick($event)"
      (addCard)="handleAdd($event)"
      (filterChange)="handleFilterChange($event)"
      (columnAction)="handleColumnAction($event)"
    />
  `,
})
class AdaptiveKanbanHostComponent {
  readonly columns: readonly AfKanbanColumn[] = [
    { id: 'pending', label: 'Pendientes', accentColor: 'var(--af-warning)' },
    { id: 'ready', label: 'Listas', accentColor: 'var(--af-primary)' },
    { id: 'done', label: 'Completadas', accentColor: 'var(--af-success)' },
  ];
  readonly filters: readonly AfKanbanFilter[] = [
    { id: 'all', label: 'Todas', count: 4 },
    { id: 'CMJ', label: 'CMJ', count: 2 },
    { id: 'DJ', label: 'DJ', count: 1 },
  ];
  readonly cards = signal<readonly AfKanbanCard[]>([
    {
      id: 'pending-cmj',
      columnId: 'pending',
      category: 'CMJ',
      title: 'CMJ pendiente',
      assigneeName: 'Maria',
      assigneeInitials: 'MG',
      metricLabel: '8 saltos',
    },
    {
      id: 'pending-dj',
      columnId: 'pending',
      category: 'DJ',
      title: 'DJ pendiente',
      assigneeName: 'Lucia',
      assigneeInitials: 'LP',
      metricLabel: '4 saltos',
    },
    {
      id: 'ready-cmj',
      columnId: 'ready',
      category: 'CMJ',
      title: 'CMJ lista',
      assigneeName: 'Bruno',
      assigneeInitials: 'BS',
      metricLabel: '6 saltos',
    },
    {
      id: 'done-cmj',
      columnId: 'done',
      category: 'CMJ',
      title: 'CMJ cerrada',
      assigneeName: 'Ines',
      assigneeInitials: 'ID',
      metricLabel: 'CSV listo',
    },
  ]);
  readonly activeFilter = signal('all');
  readonly moves = signal<readonly AfKanbanMoveEvent[]>([]);
  readonly addCount = signal(0);
  readonly lastClickedCardId = signal<string | null>(null);
  readonly lastColumnActionId = signal<string | null>(null);

  handleMove(move: AfKanbanMoveEvent): void {
    this.cards.set(move.cards);
    this.moves.set([...this.moves(), move]);
  }

  handleCardClick(event: AfKanbanCardClickEvent): void {
    this.lastClickedCardId.set(event.card.id);
  }

  handleAdd(event: AfKanbanAddCardEvent): void {
    this.addCount.update((count) => count + 1);
    const targetColumnId = event.columnId ?? this.columns[0]?.id;
    if (!targetColumnId) {
      return;
    }

    this.cards.update((cards) => [
      ...cards,
      {
        id: `added-${cards.length + 1}`,
        columnId: targetColumnId,
        category: 'CMJ',
        title: `Nueva rutina ${cards.length + 1}`,
        assigneeName: 'ArgFit',
        assigneeInitials: 'AF',
        metricLabel: '5 saltos',
      },
    ]);
  }

  handleFilterChange(change: AfKanbanFilterChange): void {
    this.activeFilter.set(change.filterId);
  }

  handleColumnAction(event: AfKanbanColumnActionEvent): void {
    this.lastColumnActionId.set(event.columnId);
  }
}

describe('AfKanbanComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop kanban and emits filter, add, card click and column action events', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveKanbanHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveKanbanHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-kanban-desktop')).not.toBeNull();
    expect(root.querySelector('af-kanban-mobile')).toBeNull();

    const filterButton = Array.from(root.querySelectorAll('.af-kanban-desktop__filter')).find((button) =>
      button.textContent?.includes('CMJ'),
    ) as HTMLButtonElement;
    filterButton.click();
    fixture.detectChanges();

    const addButton = root.querySelector('.af-kanban-desktop__add-board') as HTMLButtonElement;
    addButton.click();

    const cardBody = root.querySelector('.af-kanban-desktop__card-body') as HTMLElement;
    cardBody.click();

    const columnAction = root.querySelector('.af-kanban-desktop__column-action') as HTMLButtonElement;
    columnAction.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.activeFilter()).toBe('CMJ');
    expect(fixture.componentInstance.addCount()).toBe(1);
    expect(fixture.componentInstance.lastClickedCardId()).toBe('pending-cmj');
    expect(fixture.componentInstance.lastColumnActionId()).toBe('pending');
  });

  it('reorders cards inside the same desktop column', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveKanbanHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveKanbanHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktopKanban = fixture.debugElement.query(By.directive(AfKanbanDesktopComponent)).componentInstance as AfKanbanDesktopComponent & {
      requestMove(event: Event, card: AfKanbanCard, direction: 'up' | 'down' | 'previous-column' | 'next-column'): void;
    };

    desktopKanban.requestMove(new MouseEvent('click', { bubbles: true }), fixture.componentInstance.cards()[0]!, 'down');
    fixture.detectChanges();

    const pendingIds = fixture.componentInstance.cards()
      .filter((card) => card.columnId === 'pending')
      .map((card) => card.id);

    expect(fixture.componentInstance.moves().at(-1)).toEqual(
      expect.objectContaining({ kind: 'reorder', fromColumnId: 'pending', toColumnId: 'pending' }),
    );
    expect(pendingIds).toEqual(['pending-dj', 'pending-cmj']);
  });

  it('moves cards across desktop columns with the drop handler', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveKanbanHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveKanbanHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktopKanban = fixture.debugElement.query(By.directive(AfKanbanDesktopComponent)).componentInstance as AfKanbanDesktopComponent & {
      dropListId(columnId: string): string;
      onDrop(event: unknown, targetColumn: AfKanbanColumn): void;
    };
    const movedCard = fixture.componentInstance.cards()[0]!;

    desktopKanban.onDrop(
      {
        item: { data: movedCard },
        previousContainer: { id: desktopKanban.dropListId('pending') },
        currentContainer: { id: desktopKanban.dropListId('ready') },
        previousIndex: 0,
        currentIndex: 1,
      },
      fixture.componentInstance.columns[1]!,
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.moves().at(-1)).toEqual(
      expect.objectContaining({ kind: 'crossColumn', fromColumnId: 'pending', toColumnId: 'ready' }),
    );
    expect(fixture.componentInstance.cards().find((card) => card.id === 'pending-cmj')?.columnId).toBe('ready');
  });

  it('renders mobile kanban and supports the non-drag move fallback', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveKanbanHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveKanbanHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-kanban-mobile')).not.toBeNull();
    expect(root.querySelector('af-kanban-desktop')).toBeNull();

    const mobileKanban = fixture.debugElement.query(By.directive(AfKanbanMobileComponent)).componentInstance as AfKanbanMobileComponent & {
      requestMove(event: Event, card: AfKanbanCard, direction: 'up' | 'down' | 'previous-column' | 'next-column'): void;
    };

    mobileKanban.requestMove(new MouseEvent('click', { bubbles: true }), fixture.componentInstance.cards()[0]!, 'next-column');
    fixture.detectChanges();

    expect(fixture.componentInstance.moves().at(-1)).toEqual(
      expect.objectContaining({ kind: 'crossColumn', toColumnId: 'ready' }),
    );
    expect(fixture.componentInstance.cards().find((card) => card.id === 'pending-cmj')?.columnId).toBe('ready');
  });
});
