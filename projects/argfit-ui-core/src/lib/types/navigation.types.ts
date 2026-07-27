import type { AfIconName } from './icon.types';

export type AfNavigationItemKind = 'item' | 'action';

export interface AfNavigationItem {
  readonly id: string;
  readonly label: string;
  readonly icon?: AfIconName;
  readonly ariaLabel?: string;
  readonly href?: string;
  readonly disabled?: boolean;
  /**
   * Why the item cannot be used.
   *
   * A padlock with no explanation tells the user they are blocked but not what would
   * unblock them — a missing role, an inactive plan, a season already closed all look
   * identical. Surfaced as a tooltip and through `aria-describedby`, so the reason reaches
   * pointer, keyboard and screen-reader users alike.
   */
  readonly disabledReason?: string;
  readonly badge?: string | number;
  readonly kind?: AfNavigationItemKind;
}

export interface AfBreadcrumbItem {
  readonly id?: string;
  readonly label: string;
  readonly href?: string;
}
