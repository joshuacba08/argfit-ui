import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  AfBadge,
  AfCard,
  AfCardContentDirective,
  AfCardEyebrowDirective,
  AfCardFooterDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
} from '@argfit-ui/adaptive';

import { DocsCodeBlockComponent, type AfCodeBlockLanguage } from '../shared/code-block.component';

interface PwaRequirement {
  readonly label: string;
  readonly value: string;
}

interface PwaStep {
  readonly index: number;
  readonly title: string;
  readonly summary: string;
  readonly bullets: readonly string[];
  readonly code?: string;
  readonly codeLanguage?: AfCodeBlockLanguage;
  readonly codeFilename?: string;
}

const REQUIREMENTS: readonly PwaRequirement[] = [
  { label: 'Runtime', value: 'Angular standalone' },
  { label: 'UI layer', value: 'ArgFit adaptive' },
  { label: 'Install', value: 'Manifest + SW' },
  { label: 'Offline', value: 'App shell cache' },
  { label: 'Devices', value: 'Secure origin APIs' },
  { label: 'Targets', value: 'Desktop, tablet, mobile' },
];

const INSTALL_COMMANDS = [
  'pnpm add @argfit-ui/core @argfit-ui/primitives @argfit-ui/adaptive',
  'pnpm add @argfit-ui/desktop @argfit-ui/mobile @angular/service-worker',
].join('\n');

const APP_CONFIG_EXAMPLE = [
  "import { isDevMode, type ApplicationConfig } from '@angular/core';",
  "import { provideRouter } from '@angular/router';",
  "import { provideServiceWorker } from '@angular/service-worker';",
  "import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';",
  '',
  "import { routes } from './app.routes';",
  '',
  'export const appConfig: ApplicationConfig = {',
  '  providers: [',
  '    provideRouter(routes),',
  '    provideArgfitUi({ theme: ARGFIT_DARK_THEME, platform: \'auto\' }),',
  "    provideServiceWorker('ngsw-worker.js', {",
  '      enabled: !isDevMode(),',
  "      registrationStrategy: 'registerWhenStable:30000',",
  '    }),',
  '  ],',
  '};',
].join('\n');

const ANGULAR_CONFIG_EXAMPLE = [
  '"configurations": {',
  '  "production": {',
  '    "serviceWorker": "projects/my-pwa/ngsw-config.json",',
  '    "budgets": []',
  '  }',
  '}',
].join('\n');

const MANIFEST_EXAMPLE = [
  '{',
  '  "name": "ArgFit Field Console",',
  '  "short_name": "ArgFit",',
  '  "start_url": "/",',
  '  "scope": "/",',
  '  "display": "standalone",',
  '  "background_color": "#0A1628",',
  '  "theme_color": "#2599D5",',
  '  "icons": [',
  '    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },',
  '    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }',
  '  ]',
  '}',
].join('\n');

const SHELL_EXAMPLE = [
  "import { AfButton, AfMetricCard, AfPageShell } from '@argfit-ui/adaptive';",
  '',
  '<af-page-shell',
  '  title="ArgFit PWA"',
  '  subtitle="Installable app shell with device capability detection"',
  '  [navItems]="navItems"',
  '  userInitials="AF"',
  '>',
  '  <af-metric-card label="PWA" value="Installable" icon="download" tone="primary" />',
  '  <af-metric-card label="Network" value="Online" icon="monitor" tone="success" />',
  '  <af-button (pressed)="connectDevice()">Connect BLE</af-button>',
  '</af-page-shell>',
].join('\n');

const DEVICE_CAPABILITY_EXAMPLE = [
  'type BluetoothNavigator = Navigator & {',
  '  bluetooth?: {',
  '    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;',
  '  };',
  '};',
  '',
  'async function requestBatteryService(): Promise<BluetoothDevice> {',
  '  const nav = navigator as BluetoothNavigator;',
  '',
  "  if (!window.isSecureContext || !nav.bluetooth?.requestDevice) {",
  "    throw new Error('Web Bluetooth requires HTTPS or localhost support.');",
  '  }',
  '',
  '  return nav.bluetooth.requestDevice({',
  "    filters: [{ services: ['battery_service'] }],",
  "    optionalServices: ['device_information'],",
  '  });',
  '}',
].join('\n');

const VALIDATION_COMMANDS = [
  'pnpm start:pwa',
  'pnpm build:pwa',
  'pnpm pwa:smoke',
].join('\n');

const STEPS: readonly PwaStep[] = [
  {
    index: 1,
    title: 'Install ArgFit UI and the Angular service worker',
    summary: 'Keep ArgFit packages aligned and add Angular service worker support at the application boundary.',
    bullets: [
      'Use @argfit-ui/adaptive for screens.',
      'Keep renderer packages installed but secondary to adaptive imports.',
      'Add @angular/service-worker so production builds can cache the app shell.',
    ],
    code: INSTALL_COMMANDS,
    codeLanguage: 'bash',
    codeFilename: 'terminal',
  },
  {
    index: 2,
    title: 'Bootstrap the ArgFit runtime and service worker',
    summary: 'The app config owns routing, the ArgFit theme/platform runtime and production service worker registration.',
    bullets: [
      'Register the service worker only outside development mode.',
      'Use platform auto so the same app adapts across desktop, tablet and mobile.',
      'Mount the toast viewport once at shell level when the app needs global feedback.',
    ],
    code: APP_CONFIG_EXAMPLE,
    codeLanguage: 'typescript',
    codeFilename: 'src/app/app.config.ts',
  },
  {
    index: 3,
    title: 'Wire production PWA assets',
    summary: 'A PWA needs both Angular cache config and install metadata. Keep icons real bitmap assets so mobile install screens render cleanly.',
    bullets: [
      'Point the production build at ngsw-config.json.',
      'Ship manifest.webmanifest with standalone display, scope and maskable icons.',
      'Use localhost or HTTPS when testing install and device APIs.',
    ],
    code: `${ANGULAR_CONFIG_EXAMPLE}\n\n${MANIFEST_EXAMPLE}`,
    codeLanguage: 'json',
    codeFilename: 'angular.json + manifest.webmanifest',
  },
  {
    index: 4,
    title: 'Build an adaptive installable shell',
    summary: 'The first screen should be the actual operational surface: connection state, offline state, update state and device capability state.',
    bullets: [
      'Use AfPageShell for desktop navigation and mobile bottom navigation.',
      'Use metric, badge and inline-message components for capability states.',
      'Treat unsupported APIs as product state, not as application failures.',
    ],
    code: SHELL_EXAMPLE,
    codeLanguage: 'html',
    codeFilename: 'src/app/app.html',
  },
  {
    index: 5,
    title: 'Request devices behind explicit user actions',
    summary: 'Browser device APIs such as Web Bluetooth require secure origins and user gestures. Keep transport details in app services.',
    bullets: [
      'Call requestDevice only from a click, tap or keyboard-triggered command.',
      'Use explicit filters and optional services instead of broad discovery.',
      'Keep native bridges, such as Capacitor BLE, behind a separate transport adapter.',
    ],
    code: DEVICE_CAPABILITY_EXAMPLE,
    codeLanguage: 'typescript',
    codeFilename: 'src/app/device-transport.ts',
  },
];

const DEVICE_RULES: readonly string[] = [
  'Web Bluetooth is not universal. Surface available, unavailable and permission-dismissed states in the UI.',
  'Install prompts are controlled by the browser. Expose passive state and let users install from browser UI when beforeinstallprompt is not available.',
  'Service worker updates should be visible but never force reload in the middle of an active device session.',
  'Offline mode should keep the shell readable and queue or disable device actions that cannot safely run.',
];

@Component({
  selector: 'app-docs-pwa-page',
  imports: [
    RouterLink,
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    DocsCodeBlockComponent,
  ],
  host: {
    class: 'docs-page',
  },
  template: `
    <div class="docs-page__header docs-page__header--hero">
      <span class="docs-kicker">Installable apps</span>
      <h1>PWA applications</h1>
      <p class="docs-page__lead">
        Use ArgFit UI to build installable Angular applications that work as desktop, tablet and mobile PWAs,
        preserve an offline app shell and expose browser-safe device connection flows.
      </p>
      <div class="docs-pill-row">
        <af-badge tone="primary">adaptive shell</af-badge>
        <af-badge tone="success">offline ready</af-badge>
        <af-badge tone="accent">device capability aware</af-badge>
      </div>
      <div class="docs-action-row">
        <a routerLink="/quickstart" class="docs-action-link">ArgFit quickstart</a>
        <a routerLink="/components/page-shell" class="docs-action-link docs-action-link--secondary">Page shell API</a>
      </div>
    </div>

    <section class="docs-card-grid docs-card-grid--three" aria-label="PWA requirements">
      @for (requirement of requirements; track requirement.label) {
        <div class="docs-stat-card">
          <span>{{ requirement.label }}</span>
          <strong class="docs-stat-card__value">{{ requirement.value }}</strong>
        </div>
      }
    </section>

    <section class="docs-quickstart-steps" aria-label="PWA implementation steps">
      @for (step of steps; track step.index) {
        <af-card variant="panel" tone="primary" class="docs-card docs-quickstart-step">
          <header afCardHeader>
            <div class="docs-quickstart-step__heading">
              <span class="docs-step-badge">{{ step.index }}</span>
              <div>
                <span afCardEyebrow>Step {{ step.index }}</span>
                <h2 afCardTitle>{{ step.title }}</h2>
              </div>
            </div>
          </header>
          <div afCardContent class="docs-stack">
            <p>{{ step.summary }}</p>
            <ul>
              @for (bullet of step.bullets; track bullet) {
                <li>{{ bullet }}</li>
              }
            </ul>
            @if (step.code) {
              <docs-code-block
                [code]="step.code"
                [language]="step.codeLanguage ?? 'typescript'"
                [filename]="step.codeFilename ?? null"
              />
            }
          </div>
        </af-card>
      }
    </section>

    <section class="docs-card-grid docs-card-grid--two">
      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Device posture</span>
            <h2 afCardTitle>Connection flows stay app-owned</h2>
          </div>
          <af-badge tone="warning">secure origin</af-badge>
        </header>
        <div afCardContent class="docs-stack">
          <ul>
            @for (rule of deviceRules; track rule) {
              <li>{{ rule }}</li>
            }
          </ul>
        </div>
        <footer afCardFooter class="docs-source-row">
          <code>docs/pwa/device-capabilities.md</code>
        </footer>
      </af-card>

      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Reference starter</span>
            <h2 afCardTitle>Use the workspace starter as the reference implementation</h2>
          </div>
          <af-badge tone="success">HU-044</af-badge>
        </header>
        <div afCardContent class="docs-stack">
          <p>
            The repository includes <code>argfit-ui-pwa-starter</code> as an operational example with install,
            offline, update and Web Bluetooth capability screens.
          </p>
          <docs-code-block
            [code]="validationCommands"
            language="bash"
            filename="terminal"
          />
        </div>
        <footer afCardFooter class="docs-action-row">
          <a routerLink="/guides" class="docs-action-link">More guides</a>
          <a routerLink="/release" class="docs-action-link docs-action-link--secondary">Release gate</a>
        </footer>
      </af-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsPwaPageComponent {
  protected readonly requirements = REQUIREMENTS;
  protected readonly steps = STEPS;
  protected readonly deviceRules = DEVICE_RULES;
  protected readonly validationCommands = VALIDATION_COMMANDS;
}
