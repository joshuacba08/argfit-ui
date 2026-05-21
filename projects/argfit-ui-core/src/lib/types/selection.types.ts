import type { AfFormOption } from './form-control.types';

export type AfSelectionDensity = 'compact' | 'comfortable';

export type AfSelectionValue = unknown;

export interface AfMultiSelectOption<TValue = AfSelectionValue> extends AfFormOption<TValue> {
  readonly searchText?: string;
}

export interface AfResolvedMultiSelectOption<TValue = AfSelectionValue> extends AfMultiSelectOption<TValue> {
  readonly key: string;
  readonly searchText: string;
  readonly selected: boolean;
}