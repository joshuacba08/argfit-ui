import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfDataTableColumn, AfDataTablePagination } from '@argfit-ui/core';

import { AfDataTableMobileComponent } from './af-data-table-mobile.component';

interface TestAthlete {
  readonly id: string;
  readonly name: string;
  readonly sport: string;
  readonly bestJump: number;
  readonly rsi: number;
  readonly status: string;
}

@Component({
  standalone: true,
  imports: [AfDataTableMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #statusTemplate let-value>
      <span class="status-template">{{ value }}</span>
    </ng-template>
    <ng-template #expandedTemplate let-row="row">
      <div class="expanded-template">Detalle {{ row.name }}</div>
    </ng-template>

    <af-data-table-mobile
      [columns]="columns"
      [rows]="rows()"
      rowIdKey="id"
      selectionMode="multiple"
      [selectedRowIds]="selectedRowIds()"
      [expandedRowIds]="expandedRowIds()"
      [pagination]="pagination()"
      [loading]="loading()"
      [error]="error()"
      emptyTitle="Sin atletas"
      [cellTemplates]="[{ columnKey: 'status', template: statusTemplate }]"
      [expandedRowTemplate]="expandedTemplate"
      (rowPressed)="rowPressed.set($event)"
      (selectionChange)="selectedRowIds.set($event)"
      (rowExpandedChange)="expandedRowIds.set($event)"
    />
  `,
})
class MobileDataTableHostComponent {
  readonly columns: readonly AfDataTableColumn<TestAthlete>[] = [
    { key: 'name', header: 'Atleta', mobilePriority: 'primary' },
    { key: 'sport', header: 'Deporte', mobilePriority: 'secondary' },
    { key: 'bestJump', header: 'Mejor', align: 'end', mobilePriority: 'secondary' },
    { key: 'status', header: 'Estado', mobilePriority: 'secondary' },
    { key: 'rsi', header: 'RSI', align: 'end', mobilePriority: 'tertiary' },
  ];
  readonly rows = signal<readonly TestAthlete[]>([
    { id: 'a1', name: 'Maria Garcia', sport: 'Voleibol', bestJump: 45.2, rsi: 1.32, status: 'Activo' },
    { id: 'a2', name: 'Lucas Rodriguez', sport: 'Futbol', bestJump: 52.1, rsi: 1.45, status: 'Activo' },
  ]);
  readonly selectedRowIds = signal<readonly string[]>([]);
  readonly expandedRowIds = signal<readonly string[]>([]);
  readonly pagination = signal<AfDataTablePagination>({ pageIndex: 0, pageSize: 2, totalItems: 2 });
  readonly loading = signal(false);
  readonly error = signal<string | undefined>(undefined);
  readonly rowPressed = signal<unknown>(undefined);
}

describe('AfDataTableMobileComponent', () => {
  it('renders rows as a prioritized list without a table element', async () => {
    const fixture = TestBed.createComponent(MobileDataTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('table')).toBeNull();
    expect(root.querySelector('[role="list"]')).not.toBeNull();
    expect(root.textContent).toContain('Atleta');
    expect(root.textContent).toContain('Maria Garcia');
    expect(root.textContent).toContain('Deporte');
    expect(root.querySelector('.status-template')?.textContent?.trim()).toBe('Activo');
  });

  it('emits rowPressed and selectionChange', async () => {
    const fixture = TestBed.createComponent(MobileDataTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const firstItem = root.querySelector('.af-data-table-mobile__item') as HTMLElement;
    firstItem.click();
    expect(fixture.componentInstance.rowPressed()).toEqual(expect.objectContaining({ id: 'a1' }));

    const checkbox = root.querySelector('.af-data-table-mobile__checkbox') as HTMLButtonElement;
    checkbox.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['a1']);
  });

  it('renders expanded row templates', async () => {
    const fixture = TestBed.createComponent(MobileDataTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const expand = root.querySelector('.af-data-table-mobile__expand') as HTMLButtonElement;
    expand.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.expandedRowIds()).toEqual(['a1']);
    expect(root.querySelector('.expanded-template')?.textContent).toContain('Maria Garcia');
  });

  it('renders loading, empty and error states', async () => {
    const fixture = TestBed.createComponent(MobileDataTableHostComponent);
    const host = fixture.componentInstance;

    host.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    let root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.af-data-table-mobile__skeleton')).not.toBeNull();

    host.loading.set(false);
    host.rows.set([]);
    host.pagination.set({ pageIndex: 0, pageSize: 2, totalItems: 0 });
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Sin atletas');

    host.error.set('Sin conexion');
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('Sin conexion');
  });
});
