import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import {
  applicationConfig,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular-vite';
import type { Decorator, Preview } from '@storybook/angular-vite';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import { provideIonicAngular } from '@ionic/angular/standalone';
import {
  ARGFIT_DARK_THEME,
  ARGFIT_LIGHT_THEME,
  AfPlatformService,
  AfThemeService,
  provideArgfitUi,
  type AfPlatformPreference,
  type AfThemeDefinition,
} from '@argfit-ui/core';
import docJson from '../documentation.json';
import './preview.css';

setCompodocJson(docJson);

@Component({
  selector: 'af-storybook-environment',
  template: '<ng-content />',
  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        width: 100%;
      }

      :host.af-storybook-environment--mobile {
        margin-inline: auto;
        min-height: 844px;
        width: min(100%, 390px);
      }
    `,
  ],
  host: {
    '[class.af-storybook-environment--mobile]': "platform() === 'mobile'",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AfStorybookEnvironmentComponent {
  private readonly themeService = inject(AfThemeService);
  private readonly platformService = inject(AfPlatformService);

  readonly theme = input.required<AfThemeDefinition>();
  readonly platform = input.required<AfPlatformPreference>();

  constructor() {
    effect(() => {
      this.themeService.applyTheme(this.theme());
      this.platformService.setPreference(this.platform());
    });
  }
}

const withArgfitEnvironment: Decorator = componentWrapperDecorator(
  AfStorybookEnvironmentComponent,
  (context) => {
    const theme = context.globals['theme'] === 'light' ? ARGFIT_LIGHT_THEME : ARGFIT_DARK_THEME;
    const platform = (context.globals['platform'] ?? 'desktop') as AfPlatformPreference;

    context.parameters['viewport'] = {
      ...context.parameters['viewport'],
      defaultViewport: platform === 'mobile' ? 'mobile' : 'desktop',
    };

    return { theme, platform };
  },
);

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        provideArgfitUi({ theme: ARGFIT_DARK_THEME, platform: 'desktop' }),
        provideIonicAngular(),
      ],
    }),
    moduleMetadata({ imports: [AfStorybookEnvironmentComponent] }),
    withArgfitEnvironment,
  ],
  globalTypes: {
    theme: {
      description: 'ArgFit theme',
      defaultValue: 'dark',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
    platform: {
      description: 'Adaptive renderer',
      defaultValue: 'desktop',
      toolbar: {
        icon: 'browser',
        items: [
          { value: 'desktop', title: 'Desktop' },
          { value: 'mobile', title: 'Mobile' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    viewport: {
      options: {
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
        mobile: {
          name: 'Mobile',
          styles: { width: '390px', height: '844px' },
        },
      },
    },
    controls: {
      exclude:
        /^(cdr|platform|isMobile|destroyRef|internal|cva|on[A-Z]|resolved|register|write|setDisabledState)/,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
    layout: 'padded',
    options: {
      storySort: {
        order: [
          'Getting Started',
          'Foundations',
          'Components',
          'Data',
          'Feedback',
          'Patterns',
          'Experimental',
        ],
      },
    },
  },
};

export default preview;
