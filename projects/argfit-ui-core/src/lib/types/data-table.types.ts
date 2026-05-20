import type { TemplateRef } from '@angular/core';

export type AfDataTableDensity = 'compact' | 'normal' | 'comfortable';

export type AfDataTableSelectionMode = 'none' | 'single' | 'multiple';

export type AfDataTableSortDirection = 'asc' | 'desc';

export type AfDataTableColumnAlign = 'start' | 'center' | 'end';

export type AfDataTableColumnPriority = 'primary' | 'secondary' | 'tertiary';

export type AfDataTableValueLabel<TRow = unknown> = {
  bivarianceHack(row: TRow): string;
}['bivarianceHack'];

export interface AfDataTableColumn<TRow = unknown> {
  readonly key: string;
  readonly header: string;
  readonly sortable?: boolean;
  readonly align?: AfDataTableColumnAlign;
  readonly width?: string;
  readonly minWidth?: string;
  readonly mobilePriority?: AfDataTableColumnPriority;
  readonly valueLabel?: AfDataTableValueLabel<TRow>;
}

export interface AfDataTableSort {
  readonly key: string;
  readonly direction: AfDataTableSortDirection;
}

export interface AfDataTablePagination {
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly totalItems?: number;
}

export interface AfDataTablePageChange {
  readonly pageIndex: number;
  readonly pageSize: number;
}

export interface AfDataTableCellContext<TRow = unknown> {
  readonly $implicit: unknown;
  readonly value: unknown;
  readonly row: TRow;
  readonly column: AfDataTableColumn<TRow>;
  readonly rowId: string;
  readonly rowIndex: number;
}

export interface AfDataTableExpandedRowContext<TRow = unknown> {
  readonly $implicit: TRow;
  readonly row: TRow;
  readonly rowId: string;
  readonly rowIndex: number;
}

export interface AfDataTableCellTemplate<TRow = unknown> {
  readonly columnKey: string;
  readonly template: TemplateRef<AfDataTableCellContext<TRow>>;
}

export type AfDataTableExpandedRowTemplate<TRow = unknown> = TemplateRef<
  AfDataTableExpandedRowContext<TRow>
>;
