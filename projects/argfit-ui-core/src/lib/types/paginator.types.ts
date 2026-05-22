export type AfPaginatorDensity = 'compact' | 'comfortable';

export interface AfPaginatorState {
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly totalItems: number;
}

export interface AfPaginatorPageChange {
  readonly pageIndex: number;
  readonly pageSize: number;
}