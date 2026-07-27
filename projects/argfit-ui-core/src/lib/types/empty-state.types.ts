import type { AfIconName } from './icon.types';

export type AfEmptyStateSize = 'sm' | 'md' | 'lg';

/**
 * Why the surface is empty.
 *
 * The distinction matters because the way out differs: `empty` invites a first action,
 * `filtered` offers to widen the criteria, `error` offers a retry and `permission`
 * explains what role is missing. Collapsing them into one blank panel leaves the user
 * guessing which of the four situations they are in.
 */
export type AfEmptyStateTone = 'empty' | 'filtered' | 'error' | 'permission';

export interface AfEmptyStateAction {
  readonly id: string;
  readonly label: string;
  readonly variant?: 'primary' | 'secondary' | 'ghost';
  readonly disabled?: boolean;
}

/** Default icon per tone, so the visual cue matches the situation without extra wiring. */
export const AF_EMPTY_STATE_ICON: Readonly<Record<AfEmptyStateTone, AfIconName>> = {
  empty: 'info',
  filtered: 'filter',
  error: 'alert-triangle',
  permission: 'eye-off',
};
