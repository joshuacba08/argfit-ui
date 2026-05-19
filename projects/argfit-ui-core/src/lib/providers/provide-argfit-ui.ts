import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';

import { AF_UI_CONFIG, type AfUiConfig } from '../config/argfit-ui.config';
import { AfPlatformService } from '../services/platform.service';
import { AfThemeService } from '../themes/theme.service';

export function provideArgfitUi(config: AfUiConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AF_UI_CONFIG,
      useValue: config,
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const themeService = inject(AfThemeService);
        const platformService = inject(AfPlatformService);

        if (config.theme) {
          themeService.applyTheme(config.theme);
        }

        if (config.platform) {
          platformService.setPreference(config.platform);
        }
      },
    },
  ]);
}
