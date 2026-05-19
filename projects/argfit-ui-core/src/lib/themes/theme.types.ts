import type { AfThemeTokenMap } from '../tokens/theme-token-names';

/**
 * Discriminates a theme as dark or light so consumers can derive
 * `color-scheme`, `data-theme` or icon variants without inspecting tokens.
 */
export type AfThemeKind = 'dark' | 'light';

export interface AfThemeDefinition {
  readonly name: string;
  readonly kind: AfThemeKind;
  readonly tokens: AfThemeTokenMap;
}
