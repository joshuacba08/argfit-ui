import { AF_BASE_THEME_TOKENS } from './base-tokens';
import type { AfThemeDefinition } from './theme.types';

/**
 * Default ArgFit dark theme.
 *
 * Deep navy background with blue-tinted surfaces and the brand primary
 * `#2599D5`. This is the canonical theme for the platform.
 */
export const ARGFIT_DARK_THEME: AfThemeDefinition = {
  name: 'argfit-dark',
  kind: 'dark',
  tokens: {
    ...AF_BASE_THEME_TOKENS,

    // ── Surfaces & backgrounds ────────────────────────────────────────
    '--af-bg-main': '#0A1628',
    '--af-bg-elevated': '#0F1D32',
    '--af-bg-surface': '#0F1D32',
    '--af-bg-interactive': '#152A42',
    '--af-bg-overlay': 'rgba(10, 22, 40, 0.75)',
    '--af-surface-1': '#0F1D32',
    '--af-surface-2': '#152A42',
    '--af-surface-3': '#1C3550',
    '--af-surface-4': '#234060',

    // ── Foreground ────────────────────────────────────────────────────
    '--af-text-main': '#F0F4F8',
    '--af-text-muted': '#BCCCDC',
    '--af-text-soft': '#829AB1',
    '--af-text-disabled': '#627D98',
    '--af-text-inverse': '#0A1628',

    // ── Borders & focus ───────────────────────────────────────────────
    '--af-border': 'rgba(37, 153, 213, 0.10)',
    '--af-border-soft': 'rgba(37, 153, 213, 0.06)',
    '--af-border-strong': 'rgba(37, 153, 213, 0.22)',
    '--af-border-focus': '#2599D5',
    '--af-focus-ring': '0 0 0 3px rgba(37, 153, 213, 0.32)',

    // ── Inputs ────────────────────────────────────────────────────────
    '--af-input-bg': 'rgba(15, 29, 50, 0.8)',
    '--af-input-border': 'rgba(37, 153, 213, 0.15)',

    // ── Cards ─────────────────────────────────────────────────────────
    '--af-card-bg': '#0F1D32',
    '--af-card-border': 'rgba(37, 153, 213, 0.10)',
    '--af-card-shadow': '0 4px 12px rgba(0, 0, 0, 0.2)',

    // ── Scrollbar ─────────────────────────────────────────────────────
    '--af-scrollbar-thumb': '#334E68',
  },
};
