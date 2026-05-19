import { AF_BASE_THEME_TOKENS } from './base-tokens';
import type { AfThemeDefinition } from './theme.types';

/**
 * ArgFit light theme.
 *
 * Provided as an exported, complete definition so consumers can opt into a
 * light surface. The platform UI does not yet ship a switching control — the
 * theme exists as a stable contract for future work.
 */
export const ARGFIT_LIGHT_THEME: AfThemeDefinition = {
  name: 'argfit-light',
  kind: 'light',
  tokens: {
    ...AF_BASE_THEME_TOKENS,

    // ── Surfaces & backgrounds ────────────────────────────────────────
    '--af-bg-main': '#F0F4F8',
    '--af-bg-elevated': '#FFFFFF',
    '--af-bg-surface': '#FFFFFF',
    '--af-bg-interactive': '#E8EDF3',
    '--af-bg-overlay': 'rgba(16, 42, 67, 0.4)',
    '--af-surface-1': '#FFFFFF',
    '--af-surface-2': '#E8EDF3',
    '--af-surface-3': '#D9E2EC',
    '--af-surface-4': '#BCCCDC',

    // ── Foreground ────────────────────────────────────────────────────
    '--af-text-main': '#102A43',
    '--af-text-muted': '#334E68',
    '--af-text-soft': '#627D98',
    '--af-text-disabled': '#829AB1',
    '--af-text-inverse': '#F0F4F8',

    // ── Borders & focus ───────────────────────────────────────────────
    '--af-border': 'rgba(16, 42, 67, 0.10)',
    '--af-border-soft': 'rgba(16, 42, 67, 0.06)',
    '--af-border-strong': 'rgba(16, 42, 67, 0.20)',
    '--af-border-focus': '#2599D5',
    '--af-focus-ring': '0 0 0 3px rgba(37, 153, 213, 0.28)',

    // ── Inputs ────────────────────────────────────────────────────────
    '--af-input-bg': '#FFFFFF',
    '--af-input-border': 'rgba(16, 42, 67, 0.15)',

    // ── Cards ─────────────────────────────────────────────────────────
    '--af-card-bg': '#FFFFFF',
    '--af-card-border': 'rgba(16, 42, 67, 0.10)',
    '--af-card-shadow': '0 2px 8px rgba(16, 42, 67, 0.08)',

    // ── Scrollbar ─────────────────────────────────────────────────────
    '--af-scrollbar-thumb': '#9FB3C8',
  },
};
