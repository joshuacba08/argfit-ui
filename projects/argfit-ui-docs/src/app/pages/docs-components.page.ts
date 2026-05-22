import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import {
  AfBadge,
  AfCard,
  AfCardContentDirective,
  AfCardEyebrowDirective,
  AfCardFooterDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
} from '@argfit-ui/adaptive';

import { PRODUCTIVE_COMPONENT_FAMILIES } from '../docs-data';

@Component({
  selector: 'app-docs-components-page',
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
      <span class="docs-kicker">Stable component catalog</span>
      <h1>Components</h1>
      <p class="docs-page__lead">
        Productive component families are documented here by role, usage posture and accessibility rule.
        The goal is to help teams choose the right ArgFit surface without reading vendor internals.
      </p>
      <div class="docs-pill-row">
        <af-badge tone="primary">{{ familyCount }} families</af-badge>
        <af-badge tone="success">{{ stableComponentCount() }} public components</af-badge>
      </div>
    </div>

    <section class="docs-family-grid">
      @for (family of families; track family.family) {
        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>stable family</span>
              <h2 afCardTitle>{{ family.family }}</h2>
            </div>
            <af-badge tone="primary">{{ family.components.length }}</af-badge>
          </header>
          <div afCardContent class="docs-stack">
            <p>{{ family.summary }}</p>
            <div class="docs-callout">
              <strong>Usage</strong>
              <p>{{ family.usage }}</p>
            </div>
            <div class="docs-callout docs-callout--soft">
              <strong>Accessibility</strong>
              <p>{{ family.a11y }}</p>
            </div>
            <div class="docs-chip-grid" aria-label="Stable component names">
              @for (component of family.components; track component) {
                <span class="docs-chip">{{ component }}</span>
              }
            </div>
          </div>
          <footer afCardFooter class="docs-source-row">
            <code>docs/productive/components.md</code>
          </footer>
        </af-card>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponentsPageComponent {
  protected readonly families = PRODUCTIVE_COMPONENT_FAMILIES;
  protected readonly familyCount = PRODUCTIVE_COMPONENT_FAMILIES.length;
  protected readonly stableComponentCount = computed(() =>
    PRODUCTIVE_COMPONENT_FAMILIES.reduce((total, family) => total + family.components.length, 0),
  );
}
