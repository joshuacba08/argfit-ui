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
import { AfIconComponent } from '@argfit-ui/primitives';
import type { AfIconName } from '@argfit-ui/core';

import {
    PRODUCTIVE_COMPONENT_DOCS,
    PRODUCTIVE_COMPONENT_FAMILIES,
    PRODUCTIVE_ENTRY_POINTS,
    PRODUCTIVE_PACKAGE_GUIDES,
    PRODUCTIVE_QUICKSTART_STEPS,
    PRODUCTIVE_VALIDATION_COMMANDS,
} from '../docs-data';
import { DocsCodeBlockComponent } from '../shared/code-block.component';

interface FrameworkLayer {
  readonly tone: 'app' | 'adaptive' | 'renderer' | 'foundation';
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly packages: readonly string[];
}

interface FrameworkPrinciple {
  readonly title: string;
  readonly description: string;
  readonly icon: AfIconName;
}

const FRAMEWORK_LAYERS: readonly FrameworkLayer[] = [
  {
    tone: 'app',
    title: 'Application',
    subtitle: 'Your product code',
    description: 'Imports adaptive components. Stays free of vendor APIs and renderer assumptions.',
    packages: ['your-app'],
  },
  {
    tone: 'adaptive',
    title: 'Adaptive',
    subtitle: 'Recommended public surface',
    description: 'Semantic components that pick the right renderer at runtime. The default contract for application code.',
    packages: ['@argfit-ui/adaptive'],
  },
  {
    tone: 'renderer',
    title: 'Renderers',
    subtitle: 'Opt-in integration paths',
    description: 'Renderer-specific surfaces. PrimeNG remains internal to desktop, Ionic remains internal to mobile.',
    packages: ['@argfit-ui/desktop', '@argfit-ui/mobile'],
  },
  {
    tone: 'foundation',
    title: 'Foundation',
    subtitle: 'Bootstrap, theme and primitives',
    description: 'Runtime, theme, platform service, toast orchestration and vendor-agnostic accessibility primitives.',
    packages: ['@argfit-ui/core', '@argfit-ui/primitives'],
  },
];

const FRAMEWORK_PRINCIPLES: readonly FrameworkPrinciple[] = [
  {
    title: 'Adaptive first',
    description: 'One semantic API resolves to the right renderer. Consumers do not import PrimeNG or Ionic.',
    icon: 'zap',
  },
  {
    title: 'Token-driven theming',
    description: 'Dark-first themes, CSS variables and a token contract instead of vendor selector overrides.',
    icon: 'grid-2x2',
  },
  {
    title: 'Renderer discipline',
    description: 'Strict boundaries between core, primitives, desktop, mobile and adaptive keep upgrades safe.',
    icon: 'layout-dashboard',
  },
  {
    title: 'Enterprise posture',
    description: 'Dense forms, workflow boards, data tables and analytics surfaces are first-class concerns.',
    icon: 'bar-chart-3',
  },
];

@Component({
  selector: 'app-docs-overview-page',
  imports: [
    RouterLink,
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfIconComponent,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    DocsCodeBlockComponent,
  ],
  host: {
    class: 'docs-page',
  },
  template: `
    <header class="docs-overview-hero">
      <div class="docs-overview-hero__copy">
        <span class="docs-kicker">ArgFit UI · 1.0 documentation</span>
        <h1>An adaptive Angular framework for serious product surfaces.</h1>
        <p class="docs-page__lead">
          One semantic API, two renderer paths and a frozen public contract.
          Build dashboards, workflow boards and dense forms without coupling your app to PrimeNG or Ionic.
        </p>
        <div class="docs-pill-row">
          <af-badge tone="success" dot>1.0 stable</af-badge>
          <af-badge tone="primary">adaptive first</af-badge>
          <af-badge tone="accent">PrimeNG + Ionic internal</af-badge>
          <af-badge tone="neutral">Angular 21</af-badge>
        </div>
        <div class="docs-action-row">
          <a routerLink="/quickstart" class="docs-action-link docs-action-link--primary">Start the quickstart</a>
          <a routerLink="/components" class="docs-action-link">Browse components</a>
          <a routerLink="/api" class="docs-action-link docs-action-link--secondary">API reference</a>
        </div>
      </div>

      <aside class="docs-overview-hero__panel" aria-label="Framework snapshot">
        <span class="docs-nav__eyebrow">Snapshot</span>
        <ul class="docs-overview-hero__stats">
          <li>
            <strong>{{ stableComponentCount }}</strong>
            <span>stable components</span>
          </li>
          <li>
            <strong>{{ packageCount }}</strong>
            <span>public packages</span>
          </li>
          <li>
            <strong>{{ familyCount }}</strong>
            <span>component families</span>
          </li>
          <li>
            <strong>{{ entryPoints.length }}</strong>
            <span>documentation tracks</span>
          </li>
        </ul>
      </aside>
    </header>

    <section class="docs-overview-section" aria-labelledby="overview-pillars">
      <div class="docs-overview-section__head">
        <span class="docs-kicker">Operating pillars</span>
        <h2 id="overview-pillars">Why teams pick ArgFit UI</h2>
      </div>
      <div class="docs-principle-grid">
        @for (principle of principles; track principle.title) {
          <article class="docs-principle-card">
            <span class="docs-principle-card__icon">
              <af-icon [name]="principle.icon" size="lg" tone="primary" />
            </span>
            <strong>{{ principle.title }}</strong>
            <p>{{ principle.description }}</p>
          </article>
        }
      </div>
    </section>

    <section class="docs-overview-section" aria-labelledby="overview-architecture">
      <div class="docs-overview-section__head">
        <span class="docs-kicker">Framework map</span>
        <h2 id="overview-architecture">How the layers fit together</h2>
        <p class="docs-page__lead">
          Layers compose downward. Application code only sees the adaptive surface; renderers stay an opt-in path
          and the foundation provides theming, accessibility and runtime services.
        </p>
      </div>

      <div class="docs-layer-stack">
        @for (layer of layers; track layer.title) {
          <article class="docs-layer-card" [attr.data-tone]="layer.tone">
            <header class="docs-layer-card__head">
              <span class="docs-layer-card__badge">{{ layer.subtitle }}</span>
              <h3>{{ layer.title }}</h3>
            </header>
            <p>{{ layer.description }}</p>
            <ul class="docs-layer-card__packages">
              @for (pkg of layer.packages; track pkg) {
                <li><code>{{ pkg }}</code></li>
              }
            </ul>
          </article>
        }
      </div>
    </section>

    <section class="docs-overview-section" aria-labelledby="overview-tracks">
      <div class="docs-overview-section__head">
        <span class="docs-kicker">Documentation tracks</span>
        <h2 id="overview-tracks">Where to go next</h2>
      </div>

      <div class="docs-card-grid docs-card-grid--three">
        @for (entry of entryPoints; track entry.title) {
          <af-card variant="panel" tone="primary" class="docs-card">
            <header afCardHeader>
              <div>
                <span afCardEyebrow>{{ entry.badge }}</span>
                <h2 afCardTitle>{{ entry.title }}</h2>
              </div>
            </header>
            <div afCardContent class="docs-stack">
              <ul>
                @for (bullet of entry.bullets; track bullet) {
                  <li>{{ bullet }}</li>
                }
              </ul>
            </div>
            <footer afCardFooter class="docs-action-row">
              <a [routerLink]="entry.route" class="docs-action-link">Open section</a>
            </footer>
          </af-card>
        }
      </div>
    </section>

    <section class="docs-overview-section" aria-labelledby="overview-packages">
      <div class="docs-overview-section__head">
        <span class="docs-kicker">Public packages</span>
        <h2 id="overview-packages">The shape of the public surface</h2>
        <p class="docs-page__lead">
          Five packages compose the contract. Keep every <code>&#64;argfit-ui/*</code> dependency aligned to the same version.
        </p>
      </div>

      <div class="docs-package-grid">
        @for (pkg of packages; track pkg.slug) {
          <a [routerLink]="pkg.route" class="docs-package-tile">
            <span class="docs-nav__eyebrow">{{ pkg.slug }}</span>
            <strong>{{ pkg.name }}</strong>
            <p>{{ pkg.purpose }}</p>
          </a>
        }
      </div>
    </section>

    <section class="docs-overview-section docs-overview-section--split" aria-labelledby="overview-validation">
      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Quickstart posture</span>
            <h2 afCardTitle id="overview-validation">Enter the framework in 4 steps</h2>
          </div>
        </header>
        <div afCardContent class="docs-stack">
          <ol class="docs-numbered-list">
            @for (step of quickstartSteps; track step) {
              <li>{{ step }}</li>
            }
          </ol>
        </div>
        <footer afCardFooter class="docs-action-row">
          <a routerLink="/quickstart" class="docs-action-link docs-action-link--primary">Go to quickstart</a>
          <a routerLink="/components" class="docs-action-link docs-action-link--secondary">Browse components</a>
        </footer>
      </af-card>

      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Validation</span>
            <h2 afCardTitle>Local commands that keep the contract honest</h2>
          </div>
        </header>
        <div afCardContent>
          <docs-code-block
            [code]="validationCommands.join('\n')"
            language="bash"
            filename="terminal"
          />
        </div>
        <footer afCardFooter class="docs-action-row">
          <a routerLink="/release" class="docs-action-link">See release contract</a>
        </footer>
      </af-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsOverviewPageComponent {
  protected readonly entryPoints = PRODUCTIVE_ENTRY_POINTS;
  protected readonly quickstartSteps = PRODUCTIVE_QUICKSTART_STEPS;
  protected readonly validationCommands = PRODUCTIVE_VALIDATION_COMMANDS;
  protected readonly packages = PRODUCTIVE_PACKAGE_GUIDES;
  protected readonly layers = FRAMEWORK_LAYERS;
  protected readonly principles = FRAMEWORK_PRINCIPLES;
  protected readonly packageCount = PRODUCTIVE_PACKAGE_GUIDES.length;
  protected readonly familyCount = PRODUCTIVE_COMPONENT_FAMILIES.length;
  protected readonly stableComponentCount = PRODUCTIVE_COMPONENT_DOCS.length;
}
