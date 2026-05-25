import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import {
    AfBadge,
} from '@argfit-ui/adaptive';

import {
    PRODUCTIVE_COMPONENT_DOCS,
    PRODUCTIVE_COMPONENT_GROUPS,
    PRODUCTIVE_SEARCH_HINTS,
    searchDocsAdvanced,
    type DocsSearchKind,
    type ProductiveComponentCategory,
} from '../docs-data';

@Component({
  selector: 'app-docs-search-page',
  imports: [
    RouterLink,
    AfBadge,
  ],
  host: {
    class: 'docs-page',
  },
  template: `
    <div class="docs-page__header">
      <span class="docs-kicker">Smart search</span>
      <h1>Find components, APIs and patterns</h1>
      <p class="docs-page__lead">
        Search the contract by component name, use case, category, public input, output, package or release artifact.
      </p>
      <div class="docs-pill-row">
        <af-badge tone="primary">{{ results().length }} matches</af-badge>
        @if (draftQuery().length > 0) {
          <af-badge tone="success">{{ draftQuery() }}</af-badge>
        }
        <af-badge tone="neutral">{{ activeKind() }}</af-badge>
      </div>
    </div>

    <section class="docs-search-workbench" aria-label="Advanced documentation search">
      <div class="docs-search-workbench__bar">
        <input
          #queryInput
          class="docs-search-workbench__input"
          type="search"
          [value]="draftQuery()"
          placeholder="Try: table sorting, overlay focus, AfSelect size, release gate"
          aria-label="Search documentation"
          (input)="updateQuery(queryInput.value)"
          (keyup.enter)="submitSearch()"
        />
        <button type="button" class="docs-search-workbench__submit" (click)="submitSearch()">Search</button>
      </div>

      <div class="docs-filter-stack">
        <div class="docs-filter-row" aria-label="Filter results by type">
          @for (filter of kindFilters; track filter.value) {
            <button type="button" class="docs-filter-button" [class.is-active]="activeKind() === filter.value" (click)="setKind(filter.value)">
              {{ filter.label }}
            </button>
          }
        </div>

        <div class="docs-filter-row" aria-label="Filter results by component family">
          <button type="button" class="docs-filter-button docs-filter-button--quiet" [class.is-active]="activeFamily() === 'all'" (click)="setFamily('all')">
            All families
          </button>
          @for (group of groups; track group.family) {
            <button type="button" class="docs-filter-button docs-filter-button--quiet" [class.is-active]="activeFamily() === group.family" (click)="setFamily(group.family)">
              {{ group.family }}
            </button>
          }
        </div>

        <div class="docs-filter-row" aria-label="Filter component results by category">
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

    @if (draftQuery().length === 0) {
      <section class="docs-suggestion-grid" aria-label="Search suggestions">
        @for (hint of hints; track hint) {
          <button type="button" class="docs-suggestion-card" (click)="applySuggestion(hint)">
            <span class="docs-kicker">suggestion</span>
            <strong>{{ hint }}</strong>
          </button>
        }
      </section>
    } @else if (results().length === 0) {
      <section class="docs-empty-state">
        <span class="docs-kicker">No matches</span>
        <h2>No documentation entry matched {{ draftQuery() }}</h2>
        <p class="docs-page__lead">Try a component name, package name or product concept such as theming, release or data table.</p>
      </section>
    } @else {
      <section class="docs-search-results" aria-label="Search results">
        @for (result of results(); track result.route + result.title) {
          <a [routerLink]="result.route" class="docs-search-result-card">
            <div class="docs-search-result-card__main">
              <span class="docs-kicker">{{ result.eyebrow }}</span>
              <strong>{{ result.title }}</strong>
              <p>{{ result.summary }}</p>
              <div class="docs-value-row docs-value-row--compact">
                @for (field of result.matchedFields; track field) {
                  <code>{{ field }}</code>
                }
              </div>
            </div>
            <div class="docs-search-result-card__meta">
              <af-badge tone="accent">{{ result.kind }}</af-badge>
              @if (result.category) {
                <af-badge tone="primary">{{ result.category }}</af-badge>
              }
              <span>{{ result.score }} relevance</span>
            </div>
          </a>
        }
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsSearchPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly searchQuery = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('q')?.trim() ?? '')),
    { initialValue: this.route.snapshot.queryParamMap.get('q')?.trim() ?? '' },
  );

  protected readonly hints = PRODUCTIVE_SEARCH_HINTS;
  protected readonly groups = PRODUCTIVE_COMPONENT_GROUPS;
  protected readonly categories = Array.from(new Set(PRODUCTIVE_COMPONENT_DOCS.map((component) => component.category))).sort();
  protected readonly kindFilters: readonly { readonly label: string; readonly value: DocsSearchKind | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Components', value: 'component' },
    { label: 'Packages', value: 'package' },
    { label: 'Guides', value: 'guide' },
    { label: 'Release', value: 'release' },
  ];
  protected readonly draftQuery = signal(this.searchQuery());
  protected readonly activeKind = signal<DocsSearchKind | 'all'>('all');
  protected readonly activeFamily = signal<string | 'all'>('all');
  protected readonly activeCategory = signal<ProductiveComponentCategory | 'all'>('all');
  protected readonly results = computed(() => searchDocsAdvanced(this.draftQuery(), {
    kind: this.activeKind(),
    family: this.activeFamily(),
    category: this.activeCategory(),
    limit: 60,
  }));
  private readonly syncRouteQuery = effect(() => {
    this.draftQuery.set(this.searchQuery());
  });

  protected updateQuery(query: string): void {
    this.draftQuery.set(query.trimStart());
  }

  protected submitSearch(): void {
    const query = this.draftQuery().trim();

    void this.router.navigate(['/search'], {
      queryParams: query.length > 0 ? { q: query } : {},
    });
  }

  protected applySuggestion(query: string): void {
    this.draftQuery.set(query);
    this.submitSearch();
  }

  protected setKind(kind: DocsSearchKind | 'all'): void {
    this.activeKind.set(kind);
  }

  protected setFamily(family: string | 'all'): void {
    this.activeFamily.set(family);
  }

  protected setCategory(category: ProductiveComponentCategory | 'all'): void {
    this.activeCategory.set(category);
  }
}
