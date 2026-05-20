import type { AfThemeTokenMap } from '../tokens/theme-token-names';

/**
 * Tokens shared by every ArgFit theme.
 *
 * Themes only need to override surface/foreground/border tokens; everything
 * else (scales, typography, spacing, motion, button sizing) is theme-agnostic.
 */
export const AF_BASE_THEME_TOKENS = {
  // ── Brand colour scales ─────────────────────────────────────────────
  '--af-color-primary-50': '#E8F4FC',
  '--af-color-primary-100': '#C3E4F7',
  '--af-color-primary-200': '#8DCAEF',
  '--af-color-primary-300': '#57B0E7',
  '--af-color-primary-400': '#2599D5',
  '--af-color-primary-500': '#1E7DB1',
  '--af-color-primary-600': '#17618D',
  '--af-color-primary-700': '#114569',
  '--af-color-primary-800': '#0C2F49',
  '--af-color-primary-900': '#071C2E',

  '--af-color-accent-50': '#E0F7FF',
  '--af-color-accent-100': '#B3ECFF',
  '--af-color-accent-200': '#80E0FF',
  '--af-color-accent-300': '#4DD4FF',
  '--af-color-accent-400': '#00D4FF',
  '--af-color-accent-500': '#00AACE',
  '--af-color-accent-600': '#00809B',
  '--af-color-accent-700': '#005768',
  '--af-color-accent-800': '#003340',
  '--af-color-accent-900': '#001A22',

  '--af-color-neutral-50': '#F0F4F8',
  '--af-color-neutral-100': '#D9E2EC',
  '--af-color-neutral-200': '#BCCCDC',
  '--af-color-neutral-300': '#9FB3C8',
  '--af-color-neutral-400': '#829AB1',
  '--af-color-neutral-500': '#627D98',
  '--af-color-neutral-600': '#486581',
  '--af-color-neutral-700': '#334E68',
  '--af-color-neutral-800': '#243B53',
  '--af-color-neutral-900': '#102A43',

  // ── Semantic palette ────────────────────────────────────────────────
  '--af-success': '#00C853',
  '--af-success-light': '#B9F6CA',
  '--af-success-dark': '#009624',
  '--af-warning': '#FFB300',
  '--af-warning-light': '#FFE082',
  '--af-warning-dark': '#FF8F00',
  '--af-danger': '#FF3D71',
  '--af-danger-light': '#FF8A9B',
  '--af-danger-dark': '#DB2C66',
  '--af-info': '#2599D5',
  '--af-info-light': '#8DCAEF',
  '--af-info-dark': '#17618D',

  // ── Primary / accent aliases ────────────────────────────────────────
  '--af-primary': '#2599D5',
  '--af-primary-hover': '#57B0E7',
  '--af-primary-active': '#1E7DB1',
  '--af-primary-soft': 'rgba(37, 153, 213, 0.16)',
  '--af-primary-contrast': '#0A1628',
  '--af-accent': '#00D4FF',
  '--af-accent-hover': '#4DD4FF',
  '--af-accent-soft': 'rgba(0, 212, 255, 0.16)',
  '--af-secondary': '#00D4FF',
  '--af-secondary-hover': '#4DD4FF',
  '--af-danger-hover': '#FF8A9B',
  '--af-danger-soft': 'rgba(255, 61, 113, 0.16)',

  // ── Radii ───────────────────────────────────────────────────────────
  '--af-radius-none': '0',
  '--af-radius-xs': '2px',
  '--af-radius-sm': '4px',
  '--af-radius-md': '8px',
  '--af-radius-lg': '12px',
  '--af-radius-xl': '16px',
  '--af-radius-2xl': '24px',
  '--af-radius-pill': '999px',

  // ── Shadows ─────────────────────────────────────────────────────────
  '--af-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.12)',
  '--af-shadow-sm': '0 2px 4px rgba(0, 0, 0, 0.16)',
  '--af-shadow-md': '0 4px 12px rgba(0, 0, 0, 0.2)',
  '--af-shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.24)',
  '--af-shadow-xl': '0 16px 48px rgba(0, 0, 0, 0.28)',
  '--af-shadow-glow': '0 0 24px rgba(37, 153, 213, 0.25)',
  '--af-shadow-glow-accent': '0 0 24px rgba(0, 212, 255, 0.2)',

  // ── Spacing ─────────────────────────────────────────────────────────
  '--af-space-0': '0',
  '--af-space-px': '1px',
  '--af-space-0_5': '2px',
  '--af-space-1': '4px',
  '--af-space-1_5': '6px',
  '--af-space-2': '8px',
  '--af-space-3': '12px',
  '--af-space-4': '16px',
  '--af-space-5': '20px',
  '--af-space-6': '24px',
  '--af-space-8': '32px',
  '--af-space-10': '40px',
  '--af-space-12': '48px',
  '--af-space-16': '64px',
  '--af-space-20': '80px',
  '--af-space-24': '96px',

  // ── Typography ──────────────────────────────────────────────────────
  '--af-font-display':
    '"Zalando Sans Expanded", "Exo 2", system-ui, -apple-system, "Segoe UI", sans-serif',
  '--af-font-body':
    '"Outfit", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  '--af-font-mono': '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
  // Back-compat alias used by the existing vertical slice (AfButton, showcase).
  '--af-font-family':
    '"Outfit", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  '--af-text-xs': '0.75rem',
  '--af-text-sm': '0.875rem',
  '--af-text-base': '1rem',
  '--af-text-lg': '1.125rem',
  '--af-text-xl': '1.25rem',
  '--af-text-2xl': '1.5rem',
  '--af-text-3xl': '2rem',
  '--af-text-4xl': '2.5rem',
  '--af-text-5xl': '3rem',
  '--af-text-6xl': '3.75rem',

  // Back-compat aliases for the legacy `--af-font-size-*` naming.
  '--af-font-size-xs': '0.75rem',
  '--af-font-size-sm': '0.875rem',
  '--af-font-size-md': '1rem',
  '--af-font-size-lg': '1.125rem',
  '--af-font-size-xl': '1.25rem',
  '--af-font-size-2xl': '1.5rem',

  '--af-font-weight-regular': '400',
  '--af-font-weight-medium': '500',
  '--af-font-weight-semibold': '600',
  '--af-font-weight-bold': '700',

  '--af-leading-tight': '1.15',
  '--af-leading-snug': '1.3',
  '--af-leading-normal': '1.5',
  '--af-leading-relaxed': '1.65',
  // Back-compat aliases.
  '--af-line-height-tight': '1.15',
  '--af-line-height-normal': '1.5',

  '--af-tracking-tight': '-0.02em',
  '--af-tracking-normal': '0',
  '--af-tracking-wide': '0.02em',
  '--af-tracking-wider': '0.06em',
  '--af-tracking-widest': '0.1em',

  // ── Motion ──────────────────────────────────────────────────────────
  '--af-ease-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--af-ease-in-out': 'cubic-bezier(0.45, 0, 0.55, 1)',
  '--af-ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  '--af-duration-fast': '120ms',
  '--af-duration-normal': '200ms',
  '--af-duration-slow': '350ms',
  '--af-duration-slower': '500ms',
  // Back-compat aliases for the legacy `--af-motion-*` naming.
  '--af-motion-fast': '120ms',
  '--af-motion-base': '200ms',
  '--af-motion-slow': '350ms',
  '--af-motion-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',

  // ── Charts (data visualization) ─────────────────────────────────────
  '--af-chart-grid': 'rgba(37, 153, 213, 0.10)',
  '--af-chart-axis': 'rgba(37, 153, 213, 0.22)',
  '--af-chart-label': '#BCCCDC',
  '--af-chart-primary': '#2599D5',
  '--af-chart-accent': '#00D4FF',
  '--af-chart-success': '#00C853',
  '--af-chart-warning': '#FFB300',
  '--af-chart-danger': '#FF3D71',
  '--af-chart-track': 'rgba(37, 153, 213, 0.12)',
  '--af-chart-fill-soft': 'rgba(37, 153, 213, 0.16)',
  '--af-chart-tooltip-bg': 'rgba(10, 22, 40, 0.95)',
  '--af-chart-tooltip-border': 'rgba(37, 153, 213, 0.18)',
  '--af-chart-tooltip-text': '#F0F4F8',

  // ── Breakpoints ─────────────────────────────────────────────────────
  '--af-breakpoint-mobile': '767.98px',
  '--af-breakpoint-tablet': '1023.98px',
  '--af-breakpoint-desktop': '1024px',

  // ── Button sizing ───────────────────────────────────────────────────
  '--af-button-height-sm': '32px',
  '--af-button-height-md': '38px',
  '--af-button-height-lg': '44px',
  '--af-button-padding-x-sm': '12px',
  '--af-button-padding-x-md': '16px',
  '--af-button-padding-x-lg': '20px',
  '--af-button-gap': '8px',
} satisfies Partial<AfThemeTokenMap>;
