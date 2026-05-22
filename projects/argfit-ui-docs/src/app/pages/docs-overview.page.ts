import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
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
  PRODUCTIVE_COMPONENT_FAMILIES,
  PRODUCTIVE_ENTRY_POINTS,
  PRODUCTIVE_QUICKSTART_STEPS,
  PRODUCTIVE_VALIDATION_COMMANDS,
} from '../docs-data';

@Component({
  selector: 'app-docs-overview-page',
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
    <div class="docs-page__header docs-page__header--hero">
      <span class="docs-kicker">Separate documentation app</span>
      <h1>ArgFit UI Documentation Platform</h1>
      <p class="docs-page__lead">
        Dedicated documentation app for the frozen 1.0 contract. The showcase stays as a demo and validation surface;
        this app is the documentation-facing entry point.
      </p>
      <div class="docs-pill-row">
        <af-badge tone="success" dot>1.0 target</af-badge>
        <af-badge tone="primary">adaptive first</af-badge>
        <af-badge tone="neutral">Angular 21</af-badge>
      </div>
    </div>

    <section class="docs-stat-grid" aria-label="Productive docs metrics">
      <div class="docs-stat-card">
        <strong>{{ stableComponentCount() }}</strong>
        <span>stable components</span>
      </div>
      <div class="docs-stat-card">
        <strong>{{ entryPoints.length }}</strong>
        <span>documentation tracks</span>
      </div>
      <div class="docs-stat-card">
        <strong>1</strong>
        <span>dedicated docs app</span>
      </div>
    </section>

    <section class="docs-card-grid docs-card-grid--three">
      @for (entry of entryPoints; track entry.title) {
        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>{{ entry.badge }}</span>
              <h2 afCardTitle>{{ entry.title }}</h2>
            </div>
            <af-badge tone="neutral">{{ entry.sourcePath }}</af-badge>
          </header>
          <div afCardContent class="docs-stack">
            <p>{{ entry.summary }}</p>
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
    </section>

    <section class="docs-card-grid docs-card-grid--two">
      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Quickstart posture</span>
            <h2 afCardTitle>How teams should enter the framework</h2>
          </div>
        </header>
        <div afCardContent class="docs-stack">
          <ul>
            @for (step of quickstartSteps; track step) {
              <li>{{ step }}</li>
            }
          </ul>
        </div>
        <footer afCardFooter class="docs-action-row">
          <a routerLink="/overview" class="docs-action-link">Review onboarding</a>
          <a routerLink="/components" class="docs-action-link docs-action-link--secondary">Browse components</a>
        </footer>
      </af-card>

      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Validation</span>
            <h2 afCardTitle>Commands that keep docs and framework aligned</h2>
          </div>
        </header>
        <div afCardContent class="docs-stack">
          <div class="docs-command-list">
            @for (command of validationCommands; track command) {
              <code>{{ command }}</code>
            }
          </div>
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
  protected readonly stableComponentCount = computed(() =>
    PRODUCTIVE_COMPONENT_FAMILIES.reduce((total, family) => total + family.components.length, 0),
  );
}
