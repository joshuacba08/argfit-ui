import type { AfThemeTokenMap } from '../tokens/theme-token-names';

export interface AfThemeDefinition {
  readonly name: string;
  readonly tokens: AfThemeTokenMap;
}
