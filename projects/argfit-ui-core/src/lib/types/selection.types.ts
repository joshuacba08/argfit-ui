import type { AfFormOption } from './form-control.types';

export type AfSelectionDensity = 'compact' | 'comfortable';

export type AfSelectionValue = unknown;

export type AfListboxSelectionMode = 'single' | 'multiple';

export type AfListboxValue = AfSelectionValue | readonly AfSelectionValue[] | null;

export interface AfMultiSelectOption<TValue = AfSelectionValue> extends AfFormOption<TValue> {
  readonly searchText?: string;
}

export interface AfListboxOption<TValue = AfSelectionValue> extends AfMultiSelectOption<TValue> {}

export interface AfResolvedMultiSelectOption<TValue = AfSelectionValue> extends AfMultiSelectOption<TValue> {
  readonly key: string;
  readonly searchText: string;
  readonly selected: boolean;
}

export interface AfResolvedListboxOption<TValue = AfSelectionValue> extends AfListboxOption<TValue> {
  readonly key: string;
  readonly searchText: string;
  readonly selected: boolean;
}
