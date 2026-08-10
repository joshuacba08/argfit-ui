import { applicationConfig, type Preview } from '@storybook/angular-vite';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideArgfitUi } from '@argfit-ui/core';
import { providePrimeNG } from 'primeng/config';

import '../../../projects/showcase/src/styles.css';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), provideArgfitUi(), providePrimeNG()],
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' }, type: 'mobile' },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
      },
    },
  },
  initialGlobals: {
    viewport: { value: 'desktop', isRotated: false },
  },
};

export default preview;
