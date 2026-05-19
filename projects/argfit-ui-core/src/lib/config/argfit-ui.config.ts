import { InjectionToken } from '@angular/core';

import type { AfPlatformPreference } from '../types/platform.types';
import type { AfThemeDefinition } from '../themes/theme.types';

export interface AfUiConfig {
  readonly platform?: AfPlatformPreference;
  readonly theme?: AfThemeDefinition;
}

export const AF_UI_CONFIG = new InjectionToken<AfUiConfig>('AF_UI_CONFIG', {
  providedIn: 'root',
  factory: () => ({}),
});
