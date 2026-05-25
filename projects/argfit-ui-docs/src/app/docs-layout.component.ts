import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { AfPlatformService, AfThemeService, type AfPlatformPreference } from '@argfit-ui/core';

import { DOCS_NAV_ITEMS, PRODUCTIVE_COMPONENT_GROUPS, searchDocsAdvanced, searchProductiveComponents } from './docs-data';

@Component({
  selector: 'app-docs-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLayoutComponent {
  protected readonly navItems = DOCS_NAV_ITEMS;
  protected readonly platform = inject(AfPlatformService);
  protected readonly theme = inject(AfThemeService);
  private readonly router = inject(Router);
  private readonly routeSearchQuery = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.readInitialSearchQuery()),
    ),
    { initialValue: this.readInitialSearchQuery() },
  );
  protected readonly searchQuery = signal(this.readInitialSearchQuery());
  protected readonly quickSearchResults = computed(() => {
    const query = this.searchQuery().trim();

    return query.length > 0 ? searchDocsAdvanced(query, { limit: 4 }) : [];
  });
  protected readonly componentNavItems = computed(() => searchProductiveComponents(this.searchQuery()));
  protected readonly componentNavGroups = computed(() => {
    const matches = new Set(this.componentNavItems().map((component) => component.name));

    return PRODUCTIVE_COMPONENT_GROUPS.map((group) => ({
      ...group,
      components: group.components.filter((component) => matches.has(component.name)),
    })).filter((group) => group.components.length > 0);
  });
  protected readonly componentNavEyebrow = computed(() =>
    this.searchQuery().trim().length > 0 ? 'Filtered by search' : 'Stable 1.0 components',
  );
  private readonly syncSearchQuery = effect(() => {
    this.searchQuery.set(this.routeSearchQuery());
  });

  protected setPlatform(preference: AfPlatformPreference): void {
    this.platform.setPreference(preference);
  }

  protected updateSearch(query: string): void {
    this.searchQuery.set(query);
  }

  protected openSearch(): void {
    const query = this.searchQuery().trim();

    void this.router.navigate(['/search'], {
      queryParams: query.length > 0 ? { q: query } : {},
    });
  }

  protected toggleTheme(): void {
    this.theme.toggleTheme();
  }

  private readInitialSearchQuery(): string {
    const query = this.router.parseUrl(this.router.url).queryParams['q'];
    return typeof query === 'string' ? query : '';
  }
}
