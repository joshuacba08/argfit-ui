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

import {
    PRODUCTIVE_ADAPTIVE_EXAMPLE,
    PRODUCTIVE_BOOTSTRAP_EXAMPLE,
    PRODUCTIVE_QUICKSTART_STEPS,
    PRODUCTIVE_VALIDATION_COMMANDS,
} from '../docs-data';
import { DocsCodeBlockComponent, type AfCodeBlockLanguage } from '../shared/code-block.component';

interface QuickstartStep {
  readonly index: number;
  readonly title: string;
  readonly summary: string;
  readonly code?: string;
  readonly codeLanguage?: AfCodeBlockLanguage;
  readonly codeFilename?: string;
  readonly bullets?: readonly string[];
}

const REQUIREMENTS: ReadonlyArray<{ readonly label: string; readonly value: string }> = [
  { label: 'Angular', value: '21.x standalone' },
  { label: 'TypeScript', value: '5.9.x' },
  { label: 'Node', value: '22.x (24.x supported)' },
  { label: 'Package manager', value: 'pnpm 10.x' },
  { label: 'Rendering', value: 'Browser SPA' },
  { label: 'Theme runtime', value: 'Token-first, dark-first' },
];

const INSTALL_COMMANDS = [
  'pnpm add @argfit-ui/core @argfit-ui/primitives @argfit-ui/adaptive',
  'pnpm add @argfit-ui/desktop @argfit-ui/mobile',
].join('\n');

const STEPS: readonly QuickstartStep[] = [
  {
    index: 1,
    title: 'Install the framework packages',
    summary: 'Keep every @argfit-ui/* package aligned to the same version. Renderer packages stay opt-in but ship as part of the contract.',
    code: INSTALL_COMMANDS,
    codeLanguage: 'bash',
    codeFilename: 'terminal',
  },
  {
    index: 2,
    title: 'Bootstrap the runtime',
    summary: 'provideArgfitUi wires the theme, platform and toast runtime. It is the only setup boundary required for an adaptive application.',
    code: PRODUCTIVE_BOOTSTRAP_EXAMPLE,
    codeLanguage: 'typescript',
    codeFilename: 'src/app/app.config.ts',
  },
  {
    index: 3,
    title: 'Use adaptive components in your screens',
    summary: 'Application code stays adaptive-first. Renderer packages remain an explicit, intentional integration path.',
    code: PRODUCTIVE_ADAPTIVE_EXAMPLE,
    codeLanguage: 'typescript',
    codeFilename: 'src/app/pages/dashboard.page.ts',
  },
  {
    index: 4,
    title: 'Validate the productive contract',
    summary: 'release:production:check is the real gate. Run it locally before tagging or opening a release workflow.',
    bullets: PRODUCTIVE_VALIDATION_COMMANDS,
  },
];

const NEXT_STEPS = [
  {
    eyebrow: 'Catalog',
    title: 'Browse the stable component catalog',
    body: 'Foundation, forms, data, overlays and layout — documented by intent, not by vendor internals.',
    route: '/components',
    cta: 'Open components',
  },
  {
    eyebrow: 'Reference',
    title: 'Read the public API contract',
    body: 'Packages, services, shared types and slot directives that make up the 1.0 surface.',
    route: '/api',
    cta: 'Open API reference',
  },
  {
    eyebrow: 'Operate',
    title: 'Theming, accessibility and migration guides',
    body: 'Cross-cutting guidance to keep enterprise screens consistent and accessible.',
    route: '/guides',
    cta: 'Open guides',
  },
] as const;

@Component({
  selector: 'app-docs-quickstart-page',
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
      <span class="docs-kicker">Get started</span>
      <h1>Quickstart</h1>
      <p class="docs-page__lead">
        Bootstrap an Angular 21 standalone application against the stable ArgFit UI 1.2.0 contract in four steps.
        Keep imports adaptive-first and validate the productive gate before shipping.
      </p>
      <div class="docs-pill-row">
        <af-badge tone="primary">adaptive first</af-badge>
        <af-badge tone="success" dot>release:production:check</af-badge>
        <af-badge tone="neutral">Angular 21</af-badge>
      </div>
      <div class="docs-action-row">
        <a routerLink="/components" class="docs-action-link">Browse components</a>
        <a routerLink="/api" class="docs-action-link docs-action-link--secondary">API reference</a>
      </div>
    </div>

    <section class="docs-card-grid docs-card-grid--three" aria-label="Requirements">
      @for (requirement of requirements; track requirement.label) {
        <div class="docs-stat-card">
          <span>{{ requirement.label }}</span>
          <strong class="docs-stat-card__value">{{ requirement.value }}</strong>
        </div>
      }
    </section>

    <section class="docs-quickstart-steps" aria-label="Quickstart steps">
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
            @if (step.code) {
              <docs-code-block
                [code]="step.code"
                [language]="step.codeLanguage ?? 'typescript'"
                [filename]="step.codeFilename ?? null"
              />
            }
            @if (step.bullets) {
              <docs-code-block
                [code]="step.bullets.join('\n')"
                language="bash"
                filename="terminal"
              />
            }
          </div>
        </af-card>
      }
    </section>

    <section class="docs-quickstart-posture">
      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Posture</span>
            <h2 afCardTitle>Productive posture in one paragraph</h2>
          </div>
        </header>
        <div afCardContent class="docs-stack">
          <ul>
            @for (note of postureNotes; track note) {
              <li>{{ note }}</li>
            }
          </ul>
        </div>
        <footer afCardFooter class="docs-action-row">
          <a routerLink="/guides" class="docs-action-link">See guides</a>
          <a routerLink="/release" class="docs-action-link docs-action-link--secondary">Release contract</a>
        </footer>
      </af-card>
    </section>

    <section class="docs-card-grid docs-card-grid--three" aria-label="What to read next">
      @for (item of nextSteps; track item.route) {
        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>{{ item.eyebrow }}</span>
              <h2 afCardTitle>{{ item.title }}</h2>
            </div>
          </header>
          <div afCardContent class="docs-stack">
            <p>{{ item.body }}</p>
          </div>
          <footer afCardFooter class="docs-action-row">
            <a [routerLink]="item.route" class="docs-action-link">{{ item.cta }}</a>
          </footer>
        </af-card>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsQuickstartPageComponent {
  protected readonly requirements = REQUIREMENTS;
  protected readonly steps = STEPS;
  protected readonly nextSteps = NEXT_STEPS;
  protected readonly postureNotes: readonly string[] = [
    ...PRODUCTIVE_QUICKSTART_STEPS,
    'Renderer-specific packages remain opt-in for intentional integration work.',
    'The productive markdown corpus in docs/productive is the authored source of truth.',
  ];
}
