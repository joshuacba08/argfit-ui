import type { AfIconName } from './icon.types';

export type AfNavigationItemKind = 'item' | 'action';

export interface AfNavigationItem {
  readonly id: string;
  readonly label: string;
  readonly icon?: AfIconName;
  readonly ariaLabel?: string;
  readonly href?: string;
  readonly disabled?: boolean;
  readonly badge?: string | number;
  readonly kind?: AfNavigationItemKind;
}

export interface AfBreadcrumbItem {
  readonly id?: string;
  readonly label: string;
  readonly href?: string;
}