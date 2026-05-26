import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import {
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
} from '@argfit-ui/adaptive';

import { DocsComponentPreviewComponent } from '../docs-component-preview.component';
import {
    findProductiveComponentDoc,
    getProductiveFamilyGuide,
    PRODUCTIVE_COMPONENT_DOCS,
} from '../docs-data';
import { DocsCodeBlockComponent } from '../shared/code-block.component';

@Component({
  selector: 'app-docs-component-detail-page',
  imports: [
    RouterLink,
    AfBadge,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    DocsComponentPreviewComponent,
    DocsCodeBlockComponent,
  ],
  host: {
    class: 'docs-page',
  },
  template: `
    @if (componentDoc(); as component) {
      <div class="docs-page__header">
        <span class="docs-kicker">Component detail</span>
        <h1>{{ component.name }}</h1>
        <p class="docs-page__lead">{{ component.summary }}</p>
        <div class="docs-pill-row">
          <af-badge tone="primary">{{ component.family }}</af-badge>
          <af-badge tone="success">{{ component.importPath }}</af-badge>
          <af-badge tone="neutral">{{ component.selector }}</af-badge>
        </div>
      </div>

      <app-docs-component-preview id="preview" [component]="component" />

      <nav class="docs-anchor-strip" aria-label="Component detail sections">
        <a href="#preview">Preview</a>
        <a href="#contract">Contract</a>
        <a href="#inputs">Inputs</a>
        <a href="#outputs">Outputs</a>
        <a href="#composition">Composition</a>
        <a href="#related">Related</a>
      </nav>

      <section class="docs-stat-grid" aria-label="Component API summary">
        <div class="docs-stat-card">
          <strong>{{ component.api.inputs.length }}</strong>
          <span>inputs</span>
        </div>
        <div class="docs-stat-card">
          <strong>{{ component.api.outputs.length }}</strong>
          <span>outputs</span>
        </div>
        <div class="docs-stat-card">
          <strong>{{ component.api.variations.length }}</strong>
          <span>variations</span>
        </div>
      </section>

      <section class="docs-detail-grid">
        <af-card id="contract" variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Usage example</span>
              <h2 afCardTitle>Copy the adaptive contract shape</h2>
            </div>
          </header>
          <div afCardContent class="docs-stack">
            <docs-code-block
              [code]="component.api.example"
              language="html"
              [filename]="component.selector + '.html'"
            />
          </div>
        </af-card>

        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Variations</span>
              <h2 afCardTitle>Supported switches and states</h2>
            </div>
            <af-badge tone="accent">{{ component.api.variations.length }}</af-badge>
          </header>
          <div afCardContent>
            @if (component.api.variations.length > 0) {
              <div class="docs-variation-grid">
                @for (variation of component.api.variations; track variation.attribute) {
                  <div class="docs-variation-card">
                    <strong>{{ variation.attribute }}</strong>
                    <p>{{ variation.summary }}</p>
                    <div class="docs-value-row">
                      @for (value of variation.values; track value) {
                        <code>{{ value }}</code>
                      }
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="docs-callout docs-callout--soft">
                <strong>No explicit variations</strong>
                <p>This component is configured mainly through data, projected content or service-level state.</p>
              </div>
            }
          </div>
        </af-card>
      </section>

      <section class="docs-stack">
        <af-card id="inputs" variant="panel" tone="primary" class="docs-card docs-card--wide">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Attributes</span>
              <h2 afCardTitle>Inputs</h2>
            </div>
            <af-badge tone="primary">{{ component.api.inputs.length }}</af-badge>
          </header>
          <div afCardContent>
            <div class="docs-table-scroll">
              <table class="docs-api-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Values</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  @for (input of component.api.inputs; track input.name) {
                    <tr>
                      <td><code>{{ input.name }}</code></td>
                      <td><code>{{ input.type }}</code></td>
                      <td>{{ input.required ? 'yes' : 'no' }}</td>
                      <td>
                        @if (input.values.length > 0) {
                          <div class="docs-value-row docs-value-row--compact">
                            @for (value of input.values; track value) {
                              <code>{{ value }}</code>
                            }
                          </div>
                        } @else {
                          <span class="docs-muted">runtime value</span>
                        }
                      </td>
                      <td>{{ input.description }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </af-card>

        <af-card id="outputs" variant="panel" tone="primary" class="docs-card docs-card--wide">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Events</span>
              <h2 afCardTitle>Outputs</h2>
            </div>
            <af-badge tone="success">{{ component.api.outputs.length }}</af-badge>
          </header>
          <div afCardContent>
            @if (component.api.outputs.length > 0) {
              <div class="docs-table-scroll">
                <table class="docs-api-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Payload</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (output of component.api.outputs; track output.name) {
                      <tr>
                        <td><code>{{ output.name }}</code></td>
                        <td><code>{{ output.type }}</code></td>
                        <td>{{ output.description }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="docs-callout docs-callout--soft">
                <strong>No component outputs</strong>
                <p>This surface is configured through inputs, projected content or service state.</p>
              </div>
            }
          </div>
        </af-card>

        <af-card id="composition" variant="panel" tone="primary" class="docs-card docs-card--wide">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Composition</span>
              <h2 afCardTitle>Slots and template directives</h2>
            </div>
            <af-badge tone="neutral">{{ component.api.slots.length }}</af-badge>
          </header>
          <div afCardContent>
            @if (component.api.slots.length > 0) {
              <div class="docs-slot-grid">
                @for (slot of component.api.slots; track slot.selector) {
                  <div class="docs-slot-card">
                    <code>{{ slot.selector }}</code>
                    <span>{{ slot.purpose }}</span>
                  </div>
                }
              </div>
            } @else {
              <div class="docs-callout docs-callout--soft">
                <strong>No dedicated slot directives</strong>
                <p>Use the component content area or its data inputs according to the example above.</p>
              </div>
            }
          </div>
        </af-card>
      </section>

      <section class="docs-detail-grid">
        <af-card id="related" variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Use it for</span>
              <h2 afCardTitle>Product posture</h2>
            </div>
          </header>
          <div afCardContent class="docs-stack">
            <p>{{ familyGuide()?.usage }}</p>
            <p>{{ familyGuide()?.summary }}</p>
          </div>
          <footer afCardFooter class="docs-source-row">
            <code>{{ component.sourcePath }}</code>
          </footer>
        </af-card>

        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Accessibility</span>
              <h2 afCardTitle>Interaction rule</h2>
            </div>
          </header>
          <div afCardContent class="docs-stack">
            <p>{{ familyGuide()?.a11y }}</p>
          </div>
          <footer afCardFooter class="docs-source-row">
            <code>{{ component.importPath }}</code>
          </footer>
        </af-card>
      </section>

      <section class="docs-detail-grid">
        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Import and selector</span>
              <h2 afCardTitle>Start from the adaptive API</h2>
            </div>
          </header>
          <div afCardContent class="docs-stack">
            <docs-code-block
              [code]="importExample()"
              language="typescript"
              [filename]="component.importPath"
            />
            <p>Use the adaptive package as the application-facing contract unless you intentionally opt into a renderer-specific path.</p>
          </div>
        </af-card>

        <af-card variant="panel" tone="primary" class="docs-card">
          <header afCardHeader>
            <div>
              <span afCardEyebrow>Siblings</span>
              <h2 afCardTitle>Related components</h2>
            </div>
            <af-badge tone="accent">{{ siblingComponents().length }}</af-badge>
          </header>
          <div afCardContent class="docs-chip-grid" aria-label="Related components">
            @for (relatedComponent of siblingComponents(); track relatedComponent.slug) {
              <a [routerLink]="relatedComponent.route" class="docs-chip docs-chip--link">
                {{ relatedComponent.name }}
              </a>
            }
          </div>
          <footer afCardFooter class="docs-action-row">
            <a routerLink="/components" class="docs-action-link">Back to components</a>
            <a routerLink="/api/adaptive" class="docs-action-link docs-action-link--secondary">See adaptive package</a>
          </footer>
        </af-card>
      </section>
    } @else {
      <section class="docs-empty-state">
        <span class="docs-kicker">Component detail</span>
        <h1>Component not found</h1>
        <p class="docs-page__lead">The requested component route does not exist in the productive 1.0 catalog.</p>
        <div class="docs-action-row">
          <a routerLink="/components" class="docs-action-link">Back to components</a>
          <a routerLink="/search" class="docs-action-link docs-action-link--secondary">Search docs</a>
        </div>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponentDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('slug') ?? '' },
  );

  protected readonly componentDoc = computed(() => findProductiveComponentDoc(this.slug()) ?? null);
  protected readonly familyGuide = computed(() => {
    const component = this.componentDoc();
    return component ? getProductiveFamilyGuide(component.family) : undefined;
  });
  protected readonly siblingComponents = computed(() => {
    const component = this.componentDoc();

    if (!component) {
      return [];
    }

    return PRODUCTIVE_COMPONENT_DOCS.filter(
      (candidate) => candidate.family === component.family && candidate.slug !== component.slug,
    );
  });
  protected readonly importExample = computed(() => {
    const component = this.componentDoc();

    if (!component) {
      return '';
    }

    return [
      `import { ${component.name} } from '${component.importPath}';`,
      '',
      `<${component.selector}></${component.selector}>`,
    ].join('\n');
  });
}
