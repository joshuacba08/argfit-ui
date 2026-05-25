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
    PRODUCTIVE_PACKAGE_GUIDES,
} from '../docs-data';

@Component({
  selector: 'app-docs-api-page',
  imports: [
    RouterLink,
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
  ],
  host: {
    class: 'docs-page',
  },
  template: `
    <div class="docs-page__header">
      <span class="docs-kicker">Package and import reference</span>
      <h1>API Reference</h1>
      <p class="docs-page__lead">
        The API surface is documented by package responsibility, import posture and the ArgFit-owned runtime contracts that matter to consumers.
      </p>
      <div class="docs-pill-row">
        <af-badge tone="primary">{{ packages.length }} public packages</af-badge>
        <af-badge tone="success">individual package pages</af-badge>
      </div>
    </div>

    <section class="docs-card-grid docs-card-grid--three">
      @for (pkg of packages; track pkg.importPath) {
        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>public package</span>
              <h2 afCardTitle>{{ pkg.name }}</h2>
            </div>
            <af-badge tone="accent">{{ pkg.importPath }}</af-badge>
          </header>
          <div afCardContent class="docs-stack">
            <p>{{ pkg.purpose }}</p>
            <ul>
              @for (highlight of pkg.highlights; track highlight) {
                <li>{{ highlight }}</li>
              }
            </ul>
          </div>
          <footer afCardFooter class="docs-source-row">
            <a [routerLink]="pkg.route" class="docs-action-link">Open package page</a>
          </footer>
        </af-card>
      }
    </section>

    <section class="docs-card-grid docs-card-grid--two">
      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Bootstrap</span>
            <h2 afCardTitle>Theme and platform runtime</h2>
          </div>
          <af-badge tone="success">core</af-badge>
        </header>
        <div afCardContent>
          <pre><code>{{ bootstrapExample }}</code></pre>
        </div>
      </af-card>

      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Adaptive path</span>
            <h2 afCardTitle>Application-level semantic imports</h2>
          </div>
          <af-badge tone="primary">recommended</af-badge>
        </header>
        <div afCardContent>
          <pre><code>{{ adaptiveExample }}</code></pre>
        </div>
      </af-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsApiPageComponent {
  protected readonly packages = PRODUCTIVE_PACKAGE_GUIDES;
  protected readonly bootstrapExample = PRODUCTIVE_BOOTSTRAP_EXAMPLE;
  protected readonly adaptiveExample = PRODUCTIVE_ADAPTIVE_EXAMPLE;
}
