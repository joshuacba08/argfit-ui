import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  AfBadge,
  AfCard,
  AfCardContentDirective,
  AfCardEyebrowDirective,
  AfCardFooterDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
} from '@argfit-ui/adaptive';

import { PRODUCTIVE_GUIDE_CARDS, PRODUCTIVE_MIGRATION_CHECKLIST } from '../docs-data';

@Component({
  selector: 'app-docs-guides-page',
  imports: [
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
      <span class="docs-kicker">Operational guidance</span>
      <h1>Guides</h1>
      <p class="docs-page__lead">
        These guides explain how to operate the stable 1.2.0 contract safely: theme it, validate it, migrate to it and apply it to enterprise scenarios.
      </p>
    </div>

    <section class="docs-card-grid docs-card-grid--three">
      @for (guide of guides; track guide.title) {
        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>guide</span>
              <h2 afCardTitle>{{ guide.title }}</h2>
            </div>
            <af-badge tone="neutral">{{ guide.sourcePath }}</af-badge>
          </header>
          <div afCardContent class="docs-stack">
            <p>{{ guide.summary }}</p>
            <ul>
              @for (bullet of guide.bullets; track bullet) {
                <li>{{ bullet }}</li>
              }
            </ul>
          </div>
        </af-card>
      }
    </section>

    <section class="docs-card-grid docs-card-grid--two">
      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Migration posture</span>
            <h2 afCardTitle>Beta and Beta+ to 1.0 checklist</h2>
          </div>
        </header>
        <div afCardContent class="docs-stack">
          <ul>
            @for (step of migrationChecklist; track step) {
              <li>{{ step }}</li>
            }
          </ul>
        </div>
        <footer afCardFooter class="docs-source-row">
          <code>docs/productive/migration-beta-to-1-0.md</code>
        </footer>
      </af-card>

      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Source of truth</span>
            <h2 afCardTitle>Guides stay tied to repo docs</h2>
          </div>
        </header>
        <div afCardContent class="docs-stack">
          <p>
            The app is the navigable docs platform, but the markdown corpus under <code>docs/productive/</code>
            remains the authored source of truth for release work, reviews and repository-level guard coverage.
          </p>
        </div>
      </af-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsGuidesPageComponent {
  protected readonly guides = PRODUCTIVE_GUIDE_CARDS;
  protected readonly migrationChecklist = PRODUCTIVE_MIGRATION_CHECKLIST;
}
