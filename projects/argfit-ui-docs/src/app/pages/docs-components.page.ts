import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
    <div class="docs-page__header docs-page__header--hero docs-components-hero">
      <span class="docs-kicker">Stable component catalog</span>
      <h1>Components</h1>
      <p class="docs-page__lead">
        Explore the adaptive contract with the live preview pinned close to the catalog. Component families are grouped
        in collapsible sections so the workbench stays within reach.
      </p>
      <div class="docs-pill-row">
        <af-badge tone="primary">{{ familyCount }} families</af-badge>
        <af-badge tone="success">{{ stableComponentCount() }} public components</af-badge>
        <af-badge tone="accent">{{ totalInputCount() }} inputs</af-badge>
        <af-badge tone="neutral">{{ totalVariationCount() }} variations</af-badge>
      </div>
    </div>

    @if (selectedComponent(); as selectedComponent) {
      <section class="docs-components-studio" aria-label="Component preview and catalog">
        <section class="docs-component-workbench docs-components-studio__preview" id="workbench" aria-label="Selected component interactive preview">
          <header class="docs-component-workbench__header">
            <div>
              <span class="docs-kicker">Live workbench</span>
              <h2>{{ selectedComponent.name }}</h2>
              <p class="docs-page__lead">
                Preview, controls and contract data stay pinned while you browse the catalog.
              </p>
            </div>
            <a [routerLink]="selectedComponent.route" class="docs-action-link">Open full docs</a>
          </header>

          <app-docs-component-preview [component]="selectedComponent" />
        </section>

        <section class="docs-components-studio__catalog" aria-label="Component atlas">
          <section class="docs-catalog-toolbar" aria-label="Component discovery controls">
            <div class="docs-catalog-toolbar__head">
              <div class="docs-catalog-toolbar__heading">
                <span class="docs-kicker">Browse the catalog</span>
                <h2>{{ filteredComponents().length }} components match</h2>
              </div>
              @if (activeFamily() !== 'all' || activeCategory() !== 'all') {
                <button type="button" class="docs-filter-button docs-filter-button--ghost" (click)="resetFilters()">
                  Clear filters
                </button>
              }
            </div>

            <div class="docs-catalog-select-grid">
              <label class="docs-catalog-select-field">
                <span>Family</span>
                <select [value]="activeFamily()" (change)="setFamilyFromEvent($event)" aria-label="Filter components by family">
                  <option value="all">All families</option>
                  @for (group of groups; track group.family) {
                    <option [value]="group.family">{{ familyLabel(group.family) }}</option>
                  }
                </select>
              </label>

              <label class="docs-catalog-select-field">
                <span>Category</span>
                <select [value]="activeCategory()" (change)="setCategoryFromEvent($event)" aria-label="Filter components by category">
                  <option value="all">All categories</option>
                  @for (category of categories; track category) {
                    <option [value]="category">{{ category }}</option>
                  }
                </select>
              </label>
            </div>
          </section>

          <div class="docs-family-accordion-list" aria-label="Component family sections">
            @for (group of visibleGroups(); track group.family) {
              <details
                class="docs-family-accordion"
                [attr.data-tone]="familyTone(group.family)"
                [open]="isGroupOpen(group.family, selectedComponent.family)"
              >
                <summary class="docs-family-accordion__summary">
                  <span class="docs-filter-dot" [attr.data-tone]="familyTone(group.family)"></span>
                  <span class="docs-family-accordion__title">
                    <span class="docs-kicker">{{ group.components.length }} components</span>
                    <strong>{{ group.family }}</strong>
                  </span>
                  <span class="docs-family-accordion__meta">
                    {{ groupInputCount(group.components) }} inputs | {{ groupOutputCount(group.components) }} outputs
                  </span>
                </summary>

                <div class="docs-family-accordion__body">
                  <p class="docs-page__lead">{{ group.summary }}</p>

                  <div class="docs-catalog-grid" aria-label="Component index">
                    @for (component of group.components; track component.slug) {
                      <article class="docs-catalog-tile" [attr.data-tone]="familyTone(group.family)" [class.is-active]="selectedComponent.slug === component.slug">
                        <button
                          type="button"
                          class="docs-catalog-tile__preview"
                          [attr.aria-pressed]="selectedComponent.slug === component.slug"
                          (click)="selectComponent(component.slug)"
                        >
                          <span class="docs-catalog-tile__glyph" aria-hidden="true">{{ componentInitials(component.name) }}</span>
                          <span class="docs-catalog-tile__title">{{ component.name }}</span>
                          <small class="docs-catalog-tile__summary">{{ component.summary }}</small>
                          <div class="docs-catalog-tile__meta">
                            <span class="docs-catalog-tile__chip">{{ component.category }}</span>
                            <span class="docs-catalog-tile__chip docs-catalog-tile__chip--quiet">{{ component.complexity }}</span>
                            <span class="docs-catalog-tile__chip docs-catalog-tile__chip--quiet">{{ component.api.inputs.length }} in | {{ component.api.outputs.length }} out</span>
                          </div>
                        </button>
                        <a [routerLink]="component.route" class="docs-catalog-tile__link">Open docs</a>
                      </article>
                    }
                  </div>
                </div>
              </details>
            }
          </div>
        </section>
      </section>
    } @else {
      <section class="docs-empty-state" aria-live="polite">
        <span class="docs-kicker">No matching components</span>
        <strong>Try a broader filter combination</strong>
        <p class="docs-page__lead">The current family and category filters do not overlap in the public component catalog.</p>
        <button type="button" class="docs-filter-button" (click)="resetFilters()">Reset filters</button>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponentsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly components = PRODUCTIVE_COMPONENT_DOCS;
  protected readonly groups = PRODUCTIVE_COMPONENT_GROUPS;
  protected readonly categories = Array.from(new Set(PRODUCTIVE_COMPONENT_DOCS.map((component) => component.category))).sort();
  protected readonly activeFamily = signal<string | 'all'>('all');
  protected readonly activeCategory = signal<ProductiveComponentCategory | 'all'>('all');
  protected readonly selectedSlug = signal<string | null>(null);
  private readonly knownFamilies = new Set(PRODUCTIVE_COMPONENT_GROUPS.map((group) => group.family));
  private readonly knownCategories = new Set<ProductiveComponentCategory>(this.categories);
  private readonly knownSlugs = new Set(PRODUCTIVE_COMPONENT_DOCS.map((component) => component.slug));
  private readonly defaultPreviewNames = ['AfButton', 'AfMetricCard', 'AfDataTable', 'AfSelect', 'AfKanban', 'AfChart'];
  protected readonly filteredComponents = computed(() =>
    this.components.filter((component) => this.matchesActiveFilters(component)),
  );
  protected readonly visibleGroups = computed(() =>
    this.groups.map((group) => ({
      ...group,
      components: group.components.filter((component) => this.matchesActiveFilters(component)),
    })).filter((group) => group.components.length > 0),
  );
  protected readonly selectedComponent = computed(() => {
    const filteredComponents = this.filteredComponents();
    const selectedSlug = this.selectedSlug();
    const selectedComponent = selectedSlug
      ? filteredComponents.find((component) => component.slug === selectedSlug)
      : undefined;

    return selectedComponent
      ?? filteredComponents.find((component) => this.defaultPreviewNames.includes(component.name))
      ?? filteredComponents[0]
      ?? null;
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

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.applyQueryParams(params.get('family'), params.get('category'), params.get('component'));
    });
  }

  protected setFamily(family: string | 'all'): void {
    this.activeFamily.set(family);
    this.selectedSlug.set(null);
    this.updateFilterUrl();
  }

  protected setCategory(category: ProductiveComponentCategory | 'all'): void {
    this.activeCategory.set(category);
    this.selectedSlug.set(null);
    this.updateFilterUrl();
  }

  protected setFamilyFromEvent(event: Event): void {
    const value = event.target instanceof HTMLSelectElement ? event.target.value : 'all';
    this.setFamily(value === 'all' ? 'all' : value);
  }

  protected setCategoryFromEvent(event: Event): void {
    const value = event.target instanceof HTMLSelectElement ? event.target.value : 'all';

    if (value === 'all') {
      this.setCategory('all');
      return;
    }

    this.setCategory(this.isKnownCategory(value) ? value : 'all');
  }

  protected resetFilters(): void {
    this.activeFamily.set('all');
    this.activeCategory.set('all');
    this.selectedSlug.set(null);
    this.updateFilterUrl();
  }

  protected selectComponent(slug: string): void {
    this.selectedSlug.set(slug);
    this.updateFilterUrl(slug);
    if (typeof document !== 'undefined' && typeof window !== 'undefined' && window.matchMedia('(max-width: 1120px)').matches) {
      const target = document.getElementById('workbench');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  protected familyLabel(family: string): string {
    return family.replace(' and ', ' / ');
  }

  protected familyTone(family: string): string {
    const index = this.groups.findIndex((group) => group.family === family);
    return String(((index >= 0 ? index : 0) % 6) + 1);
  }

  protected componentInitials(name: string): string {
    const cleaned = name.startsWith('Af') ? name.slice(2) : name;
    const matches = cleaned.match(/[A-Z][a-z]?/g) ?? [cleaned.slice(0, 2)];
    return matches.slice(0, 2).join('').slice(0, 2).toUpperCase();
  }

  protected isGroupOpen(groupFamily: string, selectedFamily: string): boolean {
    return this.activeFamily() !== 'all' || groupFamily === selectedFamily;
  }

  protected groupInputCount(components: readonly ProductiveComponentDoc[]): number {
    return components.reduce((total, component) => total + component.api.inputs.length, 0);
  }

  protected groupOutputCount(components: readonly ProductiveComponentDoc[]): number {
    return components.reduce((total, component) => total + component.api.outputs.length, 0);
  }

  private matchesActiveFilters(component: ProductiveComponentDoc): boolean {
    return (this.activeFamily() === 'all' || component.family === this.activeFamily())
      && (this.activeCategory() === 'all' || component.category === this.activeCategory());
  }

  private applyQueryParams(family: string | null, category: string | null, component: string | null): void {
    this.activeFamily.set(family && this.knownFamilies.has(family) ? family : 'all');
    this.activeCategory.set(category && this.isKnownCategory(category) ? category : 'all');
    this.selectedSlug.set(component && this.knownSlugs.has(component) ? component : null);
  }

  private updateFilterUrl(componentSlug: string | null = this.selectedSlug()): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        family: this.activeFamily() === 'all' ? null : this.activeFamily(),
        category: this.activeCategory() === 'all' ? null : this.activeCategory(),
        component: componentSlug,
      },
      queryParamsHandling: 'merge',
    });
  }

  private isKnownCategory(category: string): category is ProductiveComponentCategory {
    return this.knownCategories.has(category as ProductiveComponentCategory);
  }
}
