import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AfBadge } from '@argfit-ui/adaptive';

import { DocsComponentPreviewComponent } from '../docs-component-preview.component';
import {
    PRODUCTIVE_COMPONENT_DOCS,
    PRODUCTIVE_COMPONENT_GROUPS,
    type ProductiveComponentCategory,
    type ProductiveComponentDoc,
} from '../docs-data';

@Component({
  selector: 'app-docs-components-page',
  imports: [
    RouterLink,
    AfBadge,
    DocsComponentPreviewComponent,
  ],
  host: {
    class: 'docs-page',
  },
  template: `
    <div class="docs-page__header">
      <span class="docs-kicker">Stable component catalog</span>
      <h1>Components</h1>
      <p class="docs-page__lead">
        Explore the adaptive contract through live previews, controls and complete API detail for every public component.
      </p>
      <div class="docs-pill-row">
        <af-badge tone="primary">{{ familyCount }} families</af-badge>
        <af-badge tone="success">{{ stableComponentCount() }} public components</af-badge>
        <af-badge tone="accent">{{ totalInputCount() }} inputs</af-badge>
        <af-badge tone="neutral">{{ totalVariationCount() }} variations</af-badge>
      </div>
    </div>

    <section class="docs-discovery-panel" aria-label="Component discovery controls">
      <div class="docs-discovery-panel__header">
        <div>
          <span class="docs-kicker">Browse by job</span>
          <h2>Find the right surface</h2>
        </div>
        <af-badge tone="primary">{{ filteredComponents().length }} shown</af-badge>
      </div>

      <div class="docs-filter-stack">
        <div class="docs-filter-row" aria-label="Filter components by family">
          <button type="button" class="docs-filter-button" [class.is-active]="activeFamily() === 'all'" (click)="setFamily('all')">
            All families
          </button>
          @for (group of groups; track group.family) {
            <button type="button" class="docs-filter-button" [class.is-active]="activeFamily() === group.family" (click)="setFamily(group.family)">
              {{ familyLabel(group.family) }}
            </button>
          }
        </div>

        <div class="docs-filter-row" aria-label="Filter components by category">
          <button type="button" class="docs-filter-button docs-filter-button--quiet" [class.is-active]="activeCategory() === 'all'" (click)="setCategory('all')">
            All categories
          </button>
          @for (category of categories; track category) {
            <button type="button" class="docs-filter-button docs-filter-button--quiet" [class.is-active]="activeCategory() === category" (click)="setCategory(category)">
              {{ category }}
            </button>
          }
        </div>
      </div>
    </section>

    <section class="docs-showcase-wall" aria-label="Interactive component previews">
      @for (component of spotlightComponents(); track component.slug) {
        <app-docs-component-preview [component]="component" [compact]="true" />
      }
    </section>

    <section class="docs-component-atlas" aria-label="Component atlas">
      @for (group of visibleGroups(); track group.family) {
        <article class="docs-family-panel">
          <header class="docs-family-panel__header">
            <div>
              <span class="docs-kicker">{{ group.components.length }} components</span>
              <h2>{{ group.family }}</h2>
            </div>
            <div class="docs-api-count-row docs-api-count-row--panel">
              <span><b>{{ groupInputCount(group.components) }}</b> inputs</span>
              <span><b>{{ groupOutputCount(group.components) }}</b> outputs</span>
              <span><b>{{ groupSlotCount(group.components) }}</b> slots</span>
            </div>
          </header>

          <p class="docs-page__lead">{{ group.summary }}</p>

          <div class="docs-component-index-grid docs-component-index-grid--atlas" aria-label="Component index">
            @for (component of group.components; track component.slug) {
              <a [routerLink]="component.route" class="docs-component-tile docs-component-tile--atlas">
                <span>{{ component.name }}</span>
                <small>{{ component.summary }}</small>
                <div class="docs-component-tile__meta">
                  <b>{{ component.category }}</b>
                  <b>{{ component.complexity }}</b>
                  <span>{{ component.api.inputs.length }} in · {{ component.api.outputs.length }} out</span>
                </div>
              </a>
            }
          </div>
        </article>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponentsPageComponent {
  protected readonly components = PRODUCTIVE_COMPONENT_DOCS;
  protected readonly groups = PRODUCTIVE_COMPONENT_GROUPS;
  protected readonly categories = Array.from(new Set(PRODUCTIVE_COMPONENT_DOCS.map((component) => component.category))).sort();
  protected readonly activeFamily = signal<string | 'all'>('all');
  protected readonly activeCategory = signal<ProductiveComponentCategory | 'all'>('all');
  private readonly spotlightNames = ['AfButton', 'AfMetricCard', 'AfDataTable', 'AfSelect', 'AfKanban', 'AfChart'];
  protected readonly filteredComponents = computed(() =>
    this.components.filter((component) => this.matchesActiveFilters(component)),
  );
  protected readonly visibleGroups = computed(() =>
    this.groups.map((group) => ({
      ...group,
      components: group.components.filter((component) => this.matchesActiveFilters(component)),
    })).filter((group) => group.components.length > 0),
  );
  protected readonly spotlightComponents = computed(() => {
    const filteredComponents = this.filteredComponents();
    const spotlightComponents = filteredComponents.filter((component) => this.spotlightNames.includes(component.name));
    return (spotlightComponents.length > 0 ? spotlightComponents : filteredComponents).slice(0, 6);
  });
  protected readonly familyCount = PRODUCTIVE_COMPONENT_GROUPS.length;
  protected readonly stableComponentCount = computed(() =>
    PRODUCTIVE_COMPONENT_GROUPS.reduce((total, group) => total + group.components.length, 0),
  );
  protected readonly totalInputCount = computed(() =>
    PRODUCTIVE_COMPONENT_DOCS.reduce((total, component) => total + component.api.inputs.length, 0),
  );
  protected readonly totalVariationCount = computed(() =>
    PRODUCTIVE_COMPONENT_DOCS.reduce((total, component) => total + component.api.variations.length, 0),
  );

  protected setFamily(family: string | 'all'): void {
    this.activeFamily.set(family);
  }

  protected setCategory(category: ProductiveComponentCategory | 'all'): void {
    this.activeCategory.set(category);
  }

  protected familyLabel(family: string): string {
    return family.replace(' and ', ' / ');
  }

  protected groupInputCount(components: readonly ProductiveComponentDoc[]): number {
    return components.reduce((total, component) => total + component.api.inputs.length, 0);
  }

  protected groupOutputCount(components: readonly ProductiveComponentDoc[]): number {
    return components.reduce((total, component) => total + component.api.outputs.length, 0);
  }

  protected groupSlotCount(components: readonly ProductiveComponentDoc[]): number {
    return components.reduce((total, component) => total + component.api.slots.length, 0);
  }

  private matchesActiveFilters(component: ProductiveComponentDoc): boolean {
    return (this.activeFamily() === 'all' || component.family === this.activeFamily())
      && (this.activeCategory() === 'all' || component.category === this.activeCategory());
  }
}
