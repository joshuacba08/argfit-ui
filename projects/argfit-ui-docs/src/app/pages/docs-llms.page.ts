import { ChangeDetectionStrategy, Component } from '@angular/core';
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

import { DocsCodeBlockComponent } from '../shared/code-block.component';

interface LlmEndpoint {
  readonly label: string;
  readonly mode: string;
  readonly path: string;
  readonly canonicalUrl: string;
  readonly aliasUrl: string;
  readonly summary: string;
}

const CANONICAL_ORIGIN = 'https://argfit-ui.oroyajs.com';

const LLM_ENDPOINTS: readonly LlmEndpoint[] = [
  {
    label: '/llms.txt',
    mode: 'compact',
    path: '/llms.txt',
    canonicalUrl: `${CANONICAL_ORIGIN}/llms.txt`,
    aliasUrl: `${CANONICAL_ORIGIN}/llms/llms.txt`,
    summary: 'A concise index of the most useful ArgFit UI pages, packages and component entry points.',
  },
  {
    label: '/llms-full.txt',
    mode: 'full',
    path: '/llms-full.txt',
    canonicalUrl: `${CANONICAL_ORIGIN}/llms-full.txt`,
    aliasUrl: `${CANONICAL_ORIGIN}/llms/llms-full.txt`,
    summary: 'A fuller machine-readable context file with package guidance, usage posture and the stable component catalog.',
  },
];

const AGENT_FLOW: readonly string[] = [
  'Start with /llms.txt when you need navigation, install commands or the public package map.',
  'Use /llms-full.txt before generating code, migrations or component-level recommendations.',
  'Prefer @argfit-ui/adaptive imports for application code unless a renderer-specific integration is intentional.',
  'Use component detail pages for exact selectors, inputs, outputs, slots and generated API examples.',
];

const LLM_EXCERPT = [
  '# ArgFit UI',
  '',
  '> Adaptive Angular UI framework for product surfaces.',
  '',
  '## Documentation',
  '- [Quickstart](https://argfit-ui.oroyajs.com/quickstart)',
  '- [Components](https://argfit-ui.oroyajs.com/components)',
  '- [API Reference](https://argfit-ui.oroyajs.com/api)',
  '',
  '## Recommended package',
  '- @argfit-ui/adaptive: semantic components that choose the desktop or mobile renderer at runtime.',
].join('\n');

@Component({
  selector: 'app-docs-llms-page',
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
    <div class="docs-page__header">
      <span class="docs-kicker">AI Tools</span>
      <h1>LLMs.txt</h1>
      <p class="docs-page__lead">
        LLM-optimized documentation endpoints for agents, code assistants and search tools.
        The canonical public domain for these files is <code>argfit-ui.oroyajs.com</code>.
      </p>
      <div class="docs-pill-row">
        <af-badge tone="primary">argfit-ui.oroyajs.com</af-badge>
        <af-badge tone="success">root llms.txt</af-badge>
        <af-badge tone="accent">PrimeNG-style aliases</af-badge>
      </div>
    </div>

    <section class="docs-card-grid docs-card-grid--two" aria-label="LLM documentation endpoints">
      @for (endpoint of endpoints; track endpoint.path) {
        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>{{ endpoint.mode }} endpoint</span>
              <h2 afCardTitle>{{ endpoint.label }}</h2>
            </div>
            <af-badge tone="accent">{{ endpoint.mode }}</af-badge>
          </header>
          <div afCardContent class="docs-stack">
            <p>{{ endpoint.summary }}</p>
            <div class="docs-endpoint-meta">
              <span class="docs-kicker">Canonical URL</span>
              <code class="docs-inline-code">{{ endpoint.canonicalUrl }}</code>
              <span class="docs-kicker">Alias</span>
              <code class="docs-inline-code">{{ endpoint.aliasUrl }}</code>
            </div>
          </div>
          <footer afCardFooter class="docs-action-row">
            <a [href]="endpoint.path" class="docs-action-link docs-action-link--primary">Open endpoint</a>
          </footer>
        </af-card>
      }
    </section>

    <section class="docs-card-grid docs-card-grid--two">
      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Agent flow</span>
            <h2 afCardTitle>How AI tools should use these files</h2>
          </div>
        </header>
        <div afCardContent class="docs-stack">
          <ol class="docs-numbered-list">
            @for (step of agentFlow; track step) {
              <li>{{ step }}</li>
            }
          </ol>
        </div>
        <footer afCardFooter class="docs-action-row">
          <a routerLink="/components" class="docs-action-link">Browse components</a>
          <a routerLink="/api" class="docs-action-link docs-action-link--secondary">Open API reference</a>
        </footer>
      </af-card>

      <af-card variant="panel" tone="primary" class="docs-card">
        <header afCardHeader>
          <div>
            <span afCardEyebrow>Preview</span>
            <h2 afCardTitle>Compact file shape</h2>
          </div>
        </header>
        <div afCardContent>
          <docs-code-block [code]="excerpt" language="plaintext" filename="llms.txt" />
        </div>
      </af-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLlmsPageComponent {
  protected readonly endpoints = LLM_ENDPOINTS;
  protected readonly agentFlow = AGENT_FLOW;
  protected readonly excerpt = LLM_EXCERPT;
}
