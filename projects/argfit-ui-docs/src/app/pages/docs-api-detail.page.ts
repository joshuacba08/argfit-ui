import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import {
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
} from '@argfit-ui/adaptive';

import { findProductivePackageGuide, PRODUCTIVE_COMPONENT_DOCS } from '../docs-data';
import { DocsCodeBlockComponent } from '../shared/code-block.component';

@Component({
  selector: 'app-docs-api-detail-page',
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
    @if (packageGuide(); as pkg) {
      <div class="docs-page__header">
        <span class="docs-kicker">Package detail</span>
        <h1>{{ pkg.name }}</h1>
        <p class="docs-page__lead">{{ pkg.purpose }}</p>
        <div class="docs-pill-row">
          <af-badge tone="primary">{{ pkg.importPath }}</af-badge>
          <af-badge tone="success">{{ pkg.slug }}</af-badge>
        </div>
      </div>

      <section class="docs-detail-grid">
        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Package responsibility</span>
              <h2 afCardTitle>What belongs here</h2>
            </div>
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
            <code>{{ pkg.sourcePath }}</code>
          </footer>
        </af-card>

        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Import posture</span>
              <h2 afCardTitle>How to enter the API</h2>
            </div>
          </header>
          <div afCardContent class="docs-stack">
            <docs-code-block
              [code]="importExample()"
              language="typescript"
              [filename]="pkg.importPath"
            />
            <p>Packages stay scoped and semantic. Use renderer-specific packages only when the application intentionally needs that lower-level boundary.</p>
          </div>
        </af-card>
      </section>

      <section class="docs-detail-grid">
        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Navigation</span>
              <h2 afCardTitle>Continue exploring</h2>
            </div>
          </header>
          <div afCardContent class="docs-action-row">
            <a routerLink="/api" class="docs-action-link">Back to API index</a>
            <a routerLink="/components" class="docs-action-link docs-action-link--secondary">Browse components</a>
          </div>
        </af-card>

        @if (pkg.slug === 'adaptive') {
          <af-card variant="panel" tone="primary" class="docs-card">
            <header afCardHeader>
              <div>
                <span afCardEyebrow>Recommended first stop</span>
                <h2 afCardTitle>Adaptive surface examples</h2>
              </div>
              <af-badge tone="accent">{{ adaptiveExamples().length }}</af-badge>
            </header>
            <div afCardContent class="docs-chip-grid">
              @for (component of adaptiveExamples(); track component.slug) {
                <a [routerLink]="component.route" class="docs-chip docs-chip--link">
                  {{ component.name }}
                </a>
              }
            </div>
          </af-card>
        }
      </section>
    } @else {
      <section class="docs-empty-state">
        <span class="docs-kicker">Package detail</span>
        <h1>Package not found</h1>
        <p class="docs-page__lead">The requested API package route does not exist in the productive documentation app.</p>
        <div class="docs-action-row">
          <a routerLink="/api" class="docs-action-link">Back to API index</a>
          <a routerLink="/search" class="docs-action-link docs-action-link--secondary">Search docs</a>
        </div>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsApiDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('slug') ?? '' },
  );

  protected readonly packageGuide = computed(() => findProductivePackageGuide(this.slug()) ?? null);
  protected readonly adaptiveExamples = computed(() => PRODUCTIVE_COMPONENT_DOCS.slice(0, 8));
  protected readonly importExample = computed(() => this.packageGuide()?.example ?? '');
}
