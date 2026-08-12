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
    '--af-text-soft': '#486581',
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

    // ── Charts (data visualization) ───────────────────────────────────
    '--af-chart-grid': 'rgba(16, 42, 67, 0.08)',
    '--af-chart-axis': 'rgba(16, 42, 67, 0.18)',
    '--af-chart-label': '#486581',
    '--af-chart-tooltip-bg': 'rgba(255, 255, 255, 0.98)',
    '--af-chart-tooltip-text': '#102A43',

    // ── Calendar (time grid surfaces) ─────────────────────────────────
    '--af-calendar-surface': '#FFFFFF',
    '--af-calendar-surface-elevated': '#F0F4F8',
    '--af-calendar-grid-line': 'rgba(16, 42, 67, 0.12)',
    '--af-calendar-today-bg': 'rgba(37, 153, 213, 0.10)',
    '--af-calendar-selection-bg': 'rgba(37, 153, 213, 0.16)',
    '--af-calendar-now': '#D01F4E',

    // ── Calendar event colours ────────────────────────────────────────
    // Accents are darkened for AA contrast on white; the dark palette
    // values (#00D4FF, #FFB300) sit around 1.5:1 on a light surface.
    '--af-event-training-accent': '#1E7DB1',
    '--af-event-match-accent': '#00809B',
    '--af-event-gym-accent': '#00893A',
    '--af-event-video-accent': '#A66A00',
    '--af-event-medical-accent': '#D01F4E',
    '--af-event-neutral-accent': '#486581',

    // ── Scrollbar ─────────────────────────────────────────────────────
    '--af-scrollbar-thumb': '#9FB3C8',
  },
};
