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
    type AfDataTableCellContext,
    type AfDataTableCellTemplate,
    type AfDataTableColumn,
    type AfDataTableDensity,
    type AfDataTableExpandedRowContext,
    type AfDataTableExpandedRowTemplate,
    type AfDataTablePageChange,
    type AfDataTablePagination,
    type AfDataTableSelectionMode,
    type AfDataTableSort,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

type AfDataTableMobileState = 'ready' | 'loading' | 'empty' | 'error';

@Component({
  selector: 'af-data-table-mobile',
  imports: [AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-data-table-mobile.component.html',
  styleUrl: './af-data-table-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-data-table-mobile',
    '[class]': 'hostClasses()',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
    '[attr.data-selection-mode]': 'selectionMode()',
  },
})
export class AfDataTableMobileComponent {
  readonly columns = input.required<readonly AfDataTableColumn[]>();
  readonly rows = input<readonly unknown[]>([]);
  readonly rowIdKey = input('id');
  readonly density = input<AfDataTableDensity>('compact');
  readonly selectionMode = input<AfDataTableSelectionMode>('none');
  readonly selectedRowIds = input<readonly string[]>([]);
  readonly expandedRowIds = input<readonly string[]>([]);
  readonly sort = input<AfDataTableSort | undefined>(undefined);
  readonly pagination = input<AfDataTablePagination | undefined>(undefined);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin datos');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Lista de datos');
  readonly cellTemplates = input<readonly AfDataTableCellTemplate[]>([]);
  readonly expandedRowTemplate = input<AfDataTableExpandedRowTemplate | undefined>(undefined);
  readonly toolbarTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly emptyTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly sortChange = output<AfDataTableSort>();
  readonly pageChange = output<AfDataTablePageChange>();
  readonly rowPressed = output<unknown>();
  readonly selectionChange = output<readonly string[]>();
  readonly rowExpandedChange = output<readonly string[]>();

  protected readonly hostClasses = computed(() =>
    ['af-data-table-mobile', `af-data-table-mobile--density-${this.density()}`].join(' '),
  );
  protected readonly selectedRowIdSet = computed(() => new Set(this.selectedRowIds()));
  protected readonly expandedRowIdSet = computed(() => new Set(this.expandedRowIds()));
  protected readonly cellTemplateMap = computed(
    () => new Map(this.cellTemplates().map((item) => [item.columnKey, item.template])),
  );

  protected readonly primaryColumn = computed(() =>
    this.columns().find((column) => column.mobilePriority === 'primary') ?? this.columns()[0],
  );
  protected readonly secondaryColumns = computed(() => {
    const secondary = this.columns().filter((column) => column.mobilePriority === 'secondary');
    if (secondary.length > 0) {
      return secondary;
    }
    return this.columns().filter((column) => column.key !== this.primaryColumn()?.key).slice(0, 3);
  });
  protected readonly tertiaryColumns = computed(() =>
    this.columns().filter((column) => column.mobilePriority === 'tertiary'),
  );
  protected readonly hasExpandedRows = computed(
    () => !!this.expandedRowTemplate() || this.tertiaryColumns().length > 0,
  );

  protected readonly sortedRows = computed(() => {
    const activeSort = this.sort();
    const rows = [...this.rows()];

    if (!activeSort) {
      return rows;
    }

    rows.sort((leftRow, rightRow) => {
      const leftValue = this.valueByKey(leftRow, activeSort.key);
      const rightValue = this.valueByKey(rightRow, activeSort.key);
      const comparison = this.compareValues(leftValue, rightValue);
      return activeSort.direction === 'asc' ? comparison : -comparison;
    });

    return rows;
  });

  protected readonly displayRows = computed(() => {
    const pagination = this.pagination();
    const rows = this.sortedRows();

    if (!pagination) {
      return rows;
    }

    const start = pagination.pageIndex * pagination.pageSize;
    return rows.slice(start, start + pagination.pageSize);
  });

  protected readonly state = computed<AfDataTableMobileState>(() => {
    if (this.error()) {
      return 'error';
    }

    if (this.loading()) {
      return 'loading';
    }

    return this.displayRows().length > 0 ? 'ready' : 'empty';
  });

  protected readonly totalItems = computed(() => this.pagination()?.totalItems ?? this.sortedRows().length);
  protected readonly totalPages = computed(() => {
    const pagination = this.pagination();
    if (!pagination || pagination.pageSize <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(this.totalItems() / pagination.pageSize));
  });
  protected readonly pageStart = computed(() => {
    const pagination = this.pagination();
    if (!pagination || this.totalItems() === 0) {
      return this.displayRows().length === 0 ? 0 : 1;
    }
    return pagination.pageIndex * pagination.pageSize + 1;
  });
  protected readonly pageEnd = computed(() => {
    const pagination = this.pagination();
    if (!pagination) {
      return this.displayRows().length;
    }
    return Math.min((pagination.pageIndex + 1) * pagination.pageSize, this.totalItems());
  });

  protected cellTemplateFor(column: AfDataTableColumn): TemplateRef<AfDataTableCellContext> | undefined {
    return this.cellTemplateMap().get(column.key);
  }

  protected cellContext(
    row: unknown,
    column: AfDataTableColumn,
    rowIndex: number,
  ): AfDataTableCellContext {
    const value = this.valueByKey(row, column.key);
    return {
      $implicit: value,
      value,
      row,
      column,
      rowId: this.rowId(row, rowIndex),
      rowIndex,
    };
  }

  protected expandedRowContext(row: unknown, rowIndex: number): AfDataTableExpandedRowContext {
    return {
      $implicit: row,
      row,
      rowId: this.rowId(row, rowIndex),
      rowIndex,
    };
  }

  protected displayValue(row: unknown, column: AfDataTableColumn): string {
    const labelledValue = column.valueLabel?.(row);
    if (labelledValue !== undefined) {
      return labelledValue;
    }

    const value = this.valueByKey(row, column.key);
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return String(value);
  }

  protected rowId(row: unknown, rowIndex: number): string {
    const value = this.valueByKey(row, this.rowIdKey());
    if (value === null || value === undefined || value === '') {
      return String(rowIndex);
    }
    return String(value);
  }

  protected isRowSelected(row: unknown, rowIndex: number): boolean {
    return this.selectedRowIdSet().has(this.rowId(row, rowIndex));
  }

  protected isRowExpanded(row: unknown, rowIndex: number): boolean {
    return this.expandedRowIdSet().has(this.rowId(row, rowIndex));
  }

  protected pressRow(row: unknown): void {
    this.rowPressed.emit(row);
  }

  protected toggleRowSelection(row: unknown, rowIndex: number): void {
    const mode = this.selectionMode();
    if (mode === 'none') {
      return;
    }

    const rowId = this.rowId(row, rowIndex);
    const current = this.selectedRowIds();
    const selected = current.includes(rowId);
    const nextSelection = mode === 'single'
      ? selected ? [] : [rowId]
      : selected ? current.filter((selectedId) => selectedId !== rowId) : [...current, rowId];

    this.selectionChange.emit(nextSelection);
  }

  protected toggleExpanded(row: unknown, rowIndex: number): void {
    if (!this.hasExpandedRows()) {
      return;
    }

    const rowId = this.rowId(row, rowIndex);
    const current = this.expandedRowIds();
    const nextExpanded = current.includes(rowId)
      ? current.filter((expandedId) => expandedId !== rowId)
      : [...current, rowId];

    this.rowExpandedChange.emit(nextExpanded);
  }

  protected previousPage(): void {
    const pagination = this.pagination();
    if (pagination) {
      this.goToPage(pagination.pageIndex - 1);
    }
  }

  protected nextPage(): void {
    const pagination = this.pagination();
    if (pagination) {
      this.goToPage(pagination.pageIndex + 1);
    }
  }

  protected goToPage(pageIndex: number): void {
    const pagination = this.pagination();
    if (!pagination) {
      return;
    }

    const boundedPageIndex = Math.min(Math.max(pageIndex, 0), this.totalPages() - 1);
    this.pageChange.emit({ pageIndex: boundedPageIndex, pageSize: pagination.pageSize });
  }

  protected canGoPrevious(): boolean {
    return (this.pagination()?.pageIndex ?? 0) > 0;
  }

  protected canGoNext(): boolean {
    const pagination = this.pagination();
    return !!pagination && pagination.pageIndex < this.totalPages() - 1;
  }

  protected selectionLabel(): string {
    const count = this.selectedRowIds().length;
    return `${count} seleccionado${count === 1 ? '' : 's'}`;
  }

  private valueByKey(row: unknown, key: string): unknown {
    if (!this.isRecord(row)) {
      return undefined;
    }
    return row[key];
  }

  private compareValues(leftValue: unknown, rightValue: unknown): number {
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue - rightValue;
    }

    return String(leftValue ?? '').localeCompare(String(rightValue ?? ''));
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
