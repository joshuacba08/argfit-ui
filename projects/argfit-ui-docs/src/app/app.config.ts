import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideArgfitUi({
      theme: ARGFIT_DARK_THEME,
      platform: 'auto',
    }),
    provideIonicAngular(),
    providePrimeNG(),
  ],
};