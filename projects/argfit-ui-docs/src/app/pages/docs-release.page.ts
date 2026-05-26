import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
} from '@argfit-ui/adaptive';

import { PRODUCTIVE_RELEASE_ASSETS, PRODUCTIVE_VALIDATION_COMMANDS } from '../docs-data';
import { DocsCodeBlockComponent } from '../shared/code-block.component';

@Component({
  selector: 'app-docs-release-page',
  imports: [
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    DocsCodeBlockComponent,
  ],
  host: {
    class: 'docs-page',
  },
  template: `
    <div class="docs-page__header">
      <span class="docs-kicker">Release contract</span>
      <h1>Release</h1>
      <p class="docs-page__lead">
        Productive release work is anchored in the frozen public API, semver policy and the production gate.
        Package metadata, production tarballs and npm latest publishing are aligned for the 1.0 contract.
      </p>
      <div class="docs-pill-row">
        <af-badge tone="success">1.0.0 stable</af-badge>
        <af-badge tone="success">release:production:check</af-badge>
      </div>
    </div>

    <section class="docs-card-grid docs-card-grid--three">
      @for (asset of assets; track asset.title) {
        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>release asset</span>
              <h2 afCardTitle>{{ asset.title }}</h2>
            </div>
            <af-badge tone="neutral">{{ asset.sourcePath }}</af-badge>
          </header>
          <div afCardContent class="docs-stack">
            <p>{{ asset.summary }}</p>
          </div>
        </af-card>
      }
    </section>

    <section class="docs-card-grid docs-card-grid--two">
      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Validation</span>
            <h2 afCardTitle>Release commands</h2>
          </div>
        </header>
        <div afCardContent>
          <docs-code-block
            [code]="commands.join('\n')"
            language="bash"
            filename="terminal"
          />
        </div>
      </af-card>

      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Publish reality</span>
            <h2 afCardTitle>What is already true today</h2>
          </div>
        </header>
        <div afCardContent class="docs-stack">
          <ul>
            <li>The docs app is now its own Angular project.</li>
            <li>The productive markdown corpus remains the authored source of truth.</li>
            <li>The production gate rebuilds stable packages and writes production tarballs after the Beta+ regression substrate.</li>
          </ul>
        </div>
      </af-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsReleasePageComponent {
  protected readonly assets = PRODUCTIVE_RELEASE_ASSETS;
  protected readonly commands = PRODUCTIVE_VALIDATION_COMMANDS;
}
