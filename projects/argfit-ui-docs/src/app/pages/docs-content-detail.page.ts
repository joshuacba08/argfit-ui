import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';

import { AfBadge } from '@argfit-ui/adaptive';

import { findProductiveDoc } from '../docs-data';
import { DocsMarkdownComponent } from '../shared/docs-markdown.component';
import type { MarkdownLinkResolver } from '../shared/markdown';

const WELL_KNOWN_DOC_ROUTES: Readonly<Record<string, string>> = {
  components: '/components',
  'api-reference': '/api',
  quickstart: '/quickstart',
};

type ContentState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'ready'; readonly markdown: string };

const INITIAL_CONTENT_STATE: ContentState = { status: 'loading' };

@Component({
  selector: 'app-docs-content-detail-page',
  imports: [RouterLink, AfBadge, DocsMarkdownComponent],
  host: {
    class: 'docs-page',
  },
  template: `
    @if (doc(); as ref) {
      <div class="docs-page__header">
        <a [routerLink]="ref.backRoute" class="docs-action-link docs-action-link--secondary">&larr; {{ ref.backLabel }}</a>
        <span class="docs-kicker">{{ ref.section === 'guide' ? 'Guide' : 'Release asset' }}</span>
        <h1>{{ ref.title }}</h1>
        <p class="docs-page__lead">{{ ref.summary }}</p>
        <div class="docs-pill-row">
          <af-badge tone="neutral">{{ ref.sourcePath }}</af-badge>
        </div>
      </div>

      @switch (content().status) {
        @case ('loading') {
          <div class="docs-empty-state">
            <strong>Loading content…</strong>
            <span>Fetching {{ ref.sourcePath }}.</span>
          </div>
        }
        @case ('error') {
          <div class="docs-empty-state">
            <strong>Could not load this document</strong>
            <span>
              {{ ref.sourcePath }} did not respond. Run <code class="docs-inline-code">pnpm sync:docs-content</code>
              and reload, or open the file directly in the repository.
            </span>
          </div>
        }
        @case ('ready') {
          <docs-markdown [source]="contentMarkdown()" [linkResolver]="linkResolver" />
        }
      }
    } @else {
      <div class="docs-page__header">
        <span class="docs-kicker">Not found</span>
        <h1>Document not found</h1>
        <p class="docs-page__lead">This guide or release asset does not exist. It may have moved.</p>
      </div>
      <a routerLink="/guides" class="docs-action-link">Browse guides</a>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsContentDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  protected readonly doc = toSignal(
    this.route.paramMap.pipe(map((params) => findProductiveDoc(params.get('slug') ?? ''))),
    { initialValue: findProductiveDoc(this.route.snapshot.paramMap.get('slug') ?? '') },
  );

  protected readonly content = toSignal(
    this.route.paramMap.pipe(
      map((params) => findProductiveDoc(params.get('slug') ?? '')),
      switchMap((ref) => {
        if (!ref) {
          return of<ContentState>({ status: 'error' });
        }

        return this.http.get(ref.contentUrl, { responseType: 'text' }).pipe(
          map((markdown): ContentState => ({ status: 'ready', markdown })),
          catchError(() => of<ContentState>({ status: 'error' })),
        );
      }),
    ),
    { initialValue: INITIAL_CONTENT_STATE },
  );

  protected readonly contentMarkdown = computed(() => {
    const state = this.content();
    return state.status === 'ready' ? state.markdown : '';
  });

  protected readonly linkResolver: MarkdownLinkResolver = (relativePath) => {
    const match = /^\.?\/?([\w.-]+)\.md$/.exec(relativePath.trim());
    if (!match) {
      return null;
    }

    const slug = match[1];
    if (slug in WELL_KNOWN_DOC_ROUTES) {
      return WELL_KNOWN_DOC_ROUTES[slug];
    }

    const target = findProductiveDoc(slug);
    return target ? `/docs/${target.slug}` : null;
  };
}
