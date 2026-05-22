import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  provideArgfitUi,
  type AfDataTableColumn,
  type AfTreeTableExpandedIds,
  type AfTreeTableNode,
  type AfTreeTableSelectedIds,
} from '@argfit-ui/core';

import { AfTreeTableCellDirective } from './af-tree-table-cell.directive';
import {
  AfTreeTableActionsDirective,
  AfTreeTableEmptyDirective,
  AfTreeTableLoadingDirective,
} from './af-tree-table-slots.directive';
import { AfTreeTableComponent } from './af-tree-table.component';

interface AdaptiveHierarchyRow {
  readonly name: string;
  readonly status: string;
  readonly owner: string;
}

@Component({
  standalone: true,
  imports: [
    AfTreeTableActionsDirective,
    AfTreeTableCellDirective,
    AfTreeTableComponent,
    AfTreeTableEmptyDirective,
    AfTreeTableLoadingDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-tree-table
      [columns]="columns"
      [nodes]="nodes()"
      treeColumnKey="name"
      selectionMode="multiple"
      [selectedIds]="selectedIds()"
      [expandedIds]="expandedIds()"
      (selectionChange)="selectedIds.set($event)"
      (expandedChange)="expandedIds.set($event)"
      (nodePressed)="pressed.set($event)"
    >
      <div afTreeTableActions class="tree-table-actions">Acciones tree table</div>
      <div afTreeTableEmpty class="tree-table-empty">Tree table vacia custom</div>
      <div afTreeTableLoading class="tree-table-loading">Tree table loading custom</div>
      <ng-template afTreeTableCell="status" let-value>
        <span class="tree-table-status">{{ value }}</span>
      </ng-template>
    </af-tree-table>
  `,
})
class AdaptiveTreeTableHostComponent {
  readonly columns: readonly AfDataTableColumn<AdaptiveHierarchyRow>[] = [
    { key: 'name', header: 'Unidad', mobilePriority: 'primary' },
    { key: 'status', header: 'Estado', mobilePriority: 'secondary' },
    { key: 'owner', header: 'Responsable', mobilePriority: 'secondary' },
  ];

  readonly nodes = signal<readonly AfTreeTableNode<AdaptiveHierarchyRow>[]>([
    {
      id: 'squad-a',
      label: 'Squad A',
      description: 'Microciclo de fuerza',
      meta: '08:00',
      icon: 'users',
      badge: { label: 'Activo', tone: 'success' },
      data: { name: 'Squad A', status: 'Activo', owner: 'Marta' },
      children: [
        {
          id: 'athlete-1',
          label: 'Atleta 1',
          data: { name: 'Atleta 1', status: 'Listo', owner: 'Carlos' },
        },
      ],
    },
  ]);

  readonly selectedIds = signal<AfTreeTableSelectedIds>([]);
  readonly expandedIds = signal<AfTreeTableExpandedIds>(['squad-a']);
  readonly pressed = signal<AfTreeTableNode | undefined>(undefined);
}

describe('AfTreeTableComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop tree table with actions, cell template, and controlled expansion', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveTreeTableHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveTreeTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-tree-table-desktop')).not.toBeNull();
    expect(root.querySelector('af-tree-table-mobile')).toBeNull();
    expect(root.querySelector('.tree-table-actions')?.textContent).toContain('Acciones tree table');
    expect(root.querySelector('.tree-table-status')?.textContent?.trim()).toBe('Activo');
    expect(root.querySelectorAll('.af-tree-table-desktop__row').length).toBe(2);

    const firstTreeButton = root.querySelector('.af-tree-table-desktop__tree-button') as HTMLElement;
    firstTreeButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.pressed()).toEqual(expect.objectContaining({ id: 'squad-a' }));
    expect(fixture.componentInstance.selectedIds()).toEqual(['squad-a']);

    const toggle = root.querySelector('.af-tree-table-desktop__toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.expandedIds()).toEqual([]);
  });

  it('renders mobile tree table with the custom empty slot', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveTreeTableHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveTreeTableHostComponent);
    fixture.componentInstance.nodes.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-tree-table-mobile')).not.toBeNull();
    expect(root.querySelector('af-tree-table-desktop')).toBeNull();
    expect(root.querySelector('.tree-table-empty')?.textContent).toContain('Tree table vacia custom');
  });
});