import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfDataTableColumn, type AfDataTablePagination, type AfDataTableSort } from '@argfit-ui/core';

import { AfDataTableCellDirective, AfDataTableExpandedRowDirective } from './af-data-table-cell.directive';
import { AfDataTableEmptyDirective, AfDataTableToolbarDirective } from './af-data-table-slots.directive';
import { AfDataTableComponent } from './af-data-table.component';

interface AdaptiveAthlete {
  readonly id: string;
  readonly name: string;
  readonly bestJump: number;
  readonly status: string;
}

@Component({
  standalone: true,
  imports: [
    AfDataTableComponent,
    AfDataTableCellDirective,
    AfDataTableExpandedRowDirective,
    AfDataTableToolbarDirective,
    AfDataTableEmptyDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-data-table
      [columns]="columns"
      [rows]="rows"
      rowIdKey="id"
      selectionMode="multiple"
      [selectedRowIds]="selectedRowIds()"
      [expandedRowIds]="expandedRowIds()"
      [sort]="sort()"
      [pagination]="pagination()"
      (sortChange)="sort.set($event)"
      (pageChange)="pageChanged.set($event.pageIndex)"
      (rowPressed)="rowPressed.set($event)"
      (selectionChange)="selectedRowIds.set($event)"
      (rowExpandedChange)="expandedRowIds.set($event)"
    >
      <div afDataTableToolbar class="toolbar-slot">Toolbar</div>
      <div afDataTableEmpty class="empty-slot">Sin registros custom</div>
      <ng-template afDataTableCell="status" let-value>
        <span class="custom-status">{{ value }}</span>
      </ng-template>
      <ng-template afDataTableExpandedRow let-row="row">
        <span class="custom-expanded">Detalle {{ row.name }}</span>
      </ng-template>
    </af-data-table>
  `,
})
class AdaptiveDataTableHostComponent {
  readonly columns: readonly AfDataTableColumn<AdaptiveAthlete>[] = [
    { key: 'name', header: 'Atleta', sortable: true, mobilePriority: 'primary' },
    { key: 'bestJump', header: 'Mejor', sortable: true, align: 'end', mobilePriority: 'secondary' },
    { key: 'status', header: 'Estado', mobilePriority: 'secondary' },
  ];
  readonly rows: readonly AdaptiveAthlete[] = [
    { id: 'a1', name: 'Maria Garcia', bestJump: 45.2, status: 'Activo' },
    { id: 'a2', name: 'Lucas Rodriguez', bestJump: 52.1, status: 'Activo' },
  ];
  readonly selectedRowIds = signal<readonly string[]>(['a1']);
  readonly expandedRowIds = signal<readonly string[]>(['a1']);
  readonly sort = signal<AfDataTableSort | undefined>({ key: 'bestJump', direction: 'desc' });
  readonly pagination = signal<AfDataTablePagination>({ pageIndex: 0, pageSize: 2, totalItems: 2 });
  readonly rowPressed = signal<unknown>(undefined);
  readonly pageChanged = signal<number | undefined>(undefined);
}

describe('AfDataTableComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop and projects toolbar, cell and expanded templates', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveDataTableHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveDataTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-data-table-desktop')).not.toBeNull();
    expect(root.querySelector('af-data-table-mobile')).toBeNull();
    expect(root.querySelector('.toolbar-slot')?.textContent).toContain('Toolbar');
    expect(root.querySelector('.custom-status')?.textContent?.trim()).toBe('Activo');
    expect(root.querySelector('.custom-expanded')?.textContent).toContain('Maria Garcia');
    expect(root.querySelector('tbody tr[data-selected]')).not.toBeNull();
  });

  it('renders mobile and reemits row and selection outputs', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveDataTableHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveDataTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-data-table-mobile')).not.toBeNull();
    expect(root.querySelector('af-data-table-desktop')).toBeNull();

    const item = root.querySelector('.af-data-table-mobile__item') as HTMLElement;
    item.click();
    expect(fixture.componentInstance.rowPressed()).toEqual(expect.objectContaining({ id: 'a2' }));

    const checkbox = root.querySelector('.af-data-table-mobile__checkbox') as HTMLButtonElement;
    checkbox.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['a1', 'a2']);
  });
});
