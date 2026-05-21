import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type {
    AfDataTableColumn,
    AfDataTablePageChange,
    AfDataTablePagination,
    AfDataTableSort,
} from '@argfit-ui/core';

import { AfDataTableDesktopComponent } from './af-data-table-desktop.component';

interface TestAthlete {
  readonly id: string;
  readonly name: string;
  readonly sport: string;
  readonly bestJump: number;
  readonly status: string;
}

@Component({
  standalone: true,
  imports: [AfDataTableDesktopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #statusTemplate let-value>
      <span class="status-template">{{ value }}</span>
    </ng-template>
    <ng-template #expandedTemplate let-row="row">
      <div class="expanded-template">Detalle {{ row.name }}</div>
    </ng-template>

    <af-data-table-desktop
      [columns]="columns"
      [rows]="rows()"
      rowIdKey="id"
      density="compact"
      selectionMode="multiple"
      [selectedRowIds]="selectedRowIds()"
      [expandedRowIds]="expandedRowIds()"
      [sort]="sort()"
      [pagination]="pagination()"
      [loading]="loading()"
      [error]="error()"
      emptyTitle="Sin atletas"
      emptyDescription="Ajusta los filtros"
      [cellTemplates]="[{ columnKey: 'status', template: statusTemplate }]"
      [expandedRowTemplate]="expandedTemplate"
      (sortChange)="sort.set($event)"
      (pageChange)="onPageChange($event)"
      (rowPressed)="rowPressed.set($event)"
      (selectionChange)="selectedRowIds.set($event)"
      (rowExpandedChange)="expandedRowIds.set($event)"
    />
  `,
})
class DataTableHostComponent {
  readonly columns: readonly AfDataTableColumn<TestAthlete>[] = [
    { key: 'name', header: 'Atleta', sortable: true, mobilePriority: 'primary' },
    { key: 'sport', header: 'Deporte', sortable: true, mobilePriority: 'secondary' },
    { key: 'bestJump', header: 'Mejor', sortable: true, align: 'end', mobilePriority: 'secondary' },
    { key: 'status', header: 'Estado', mobilePriority: 'tertiary' },
  ];
  readonly rows = signal<readonly TestAthlete[]>([
    { id: 'a1', name: 'Maria Garcia', sport: 'Voleibol', bestJump: 45.2, status: 'Activo' },
    { id: 'a2', name: 'Lucas Rodriguez', sport: 'Futbol', bestJump: 52.1, status: 'Activo' },
    { id: 'a3', name: 'Diego Romero', sport: 'Rugby', bestJump: 46.5, status: 'Inactivo' },
  ]);
  readonly selectedRowIds = signal<readonly string[]>([]);
  readonly expandedRowIds = signal<readonly string[]>([]);
  readonly sort = signal<AfDataTableSort | undefined>(undefined);
  readonly pagination = signal<AfDataTablePagination>({ pageIndex: 0, pageSize: 2, totalItems: 3 });
  readonly loading = signal(false);
  readonly error = signal<string | undefined>(undefined);
  readonly rowPressed = signal<unknown>(undefined);
  readonly pageEvent = signal<AfDataTablePageChange | undefined>(undefined);

  onPageChange(event: AfDataTablePageChange): void {
    this.pageEvent.set(event);
    this.pagination.update((current) => ({ ...current, pageIndex: event.pageIndex }));
  }
}

describe('AfDataTableDesktopComponent', () => {
  it('renders headers, rows and custom cell templates', async () => {
    const fixture = TestBed.createComponent(DataTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('table')).not.toBeNull();
    expect(root.textContent).toContain('Atleta');
    expect(root.textContent).toContain('Maria Garcia');
    expect(root.querySelector('.status-template')?.textContent?.trim()).toBe('Activo');
  });

  it('emits sortChange and exposes aria-sort on sortable headers', async () => {
    const fixture = TestBed.createComponent(DataTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const sortButton = Array.from(root.querySelectorAll('th button')).find((button) =>
      button.textContent?.includes('Mejor'),
    ) as HTMLButtonElement;

    sortButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.sort()).toEqual({ key: 'bestJump', direction: 'asc' });
    const sortedHeader = Array.from(root.querySelectorAll('th')).find((header) =>
      header.textContent?.includes('Mejor'),
    ) as HTMLElement;
    expect(sortedHeader.getAttribute('aria-sort')).toBe('ascending');
  });

  it('renders loading, empty and error states', async () => {
    const fixture = TestBed.createComponent(DataTableHostComponent);
    const host = fixture.componentInstance;

    host.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    let root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.af-data-table-desktop__skeleton')).not.toBeNull();

    host.loading.set(false);
    host.rows.set([]);
    host.pagination.set({ pageIndex: 0, pageSize: 2, totalItems: 0 });
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Sin atletas');

    host.error.set('Conexion perdida');
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('Conexion perdida');
  });

  it('emits rowPressed, selectionChange and expanded row changes', async () => {
    const fixture = TestBed.createComponent(DataTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const firstRow = root.querySelector('tbody tr[tabindex="0"]') as HTMLElement;
    firstRow.click();
    expect(fixture.componentInstance.rowPressed()).toEqual(
      expect.objectContaining({ id: 'a1' }),
    );

    const rowCheckbox = root.querySelectorAll('.af-data-table-desktop__checkbox')[1] as HTMLButtonElement;
    rowCheckbox.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['a1']);

    const expand = root.querySelector('.af-data-table-desktop__expand') as HTMLButtonElement;
    expand.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedRowIds()).toEqual(['a1']);
    expect(root.querySelector('.expanded-template')?.textContent).toContain('Maria Garcia');
  });

  it('supports keyboard row activation with Enter and Space', async () => {
    const fixture = TestBed.createComponent(DataTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const firstRow = root.querySelector('tbody tr[tabindex="0"]') as HTMLElement;

    firstRow.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.rowPressed()).toEqual(
      expect.objectContaining({ id: 'a1' }),
    );

    fixture.componentInstance.rowPressed.set(undefined);
    firstRow.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.rowPressed()).toEqual(
      expect.objectContaining({ id: 'a1' }),
    );
  });

  it('renders pagination footer and emits pageChange', async () => {
    const fixture = TestBed.createComponent(DataTableHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.af-data-table-desktop__pagination')?.textContent).toContain(
      'Mostrando 1-2 de 3',
    );

    const next = root.querySelector('button[aria-label="Pagina siguiente"]') as HTMLButtonElement;
    next.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.pageEvent()).toEqual({ pageIndex: 1, pageSize: 2 });
  });
});
