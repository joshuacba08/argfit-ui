import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { parseMarkdown, type MarkdownLinkResolver } from './markdown';
import { DocsCodeBlockComponent, type AfCodeBlockLanguage } from './code-block.component';

const KNOWN_LANGUAGES: readonly AfCodeBlockLanguage[] = [
  'bash', 'shell', 'sh', 'css', 'scss', 'json', 'typescript', 'ts', 'javascript', 'js', 'html', 'xml', 'plaintext',
];

function normalizeCodeLanguage(language: string): AfCodeBlockLanguage {
  const lower = language.toLowerCase();
  return (KNOWN_LANGUAGES as readonly string[]).includes(lower) ? (lower as AfCodeBlockLanguage) : 'plaintext';
}

@Component({
  selector: 'docs-markdown',
  imports: [DocsCodeBlockComponent],
  host: {
    class: 'docs-markdown docs-stack',
  },
  template: `
    @for (block of blocks(); track $index) {
      @switch (block.type) {
        @case ('heading') {
          @if (block.level === 2) {
            <h2 [id]="block.id" [innerHTML]="block.html"></h2>
          } @else {
            <h3 [id]="block.id" [innerHTML]="block.html"></h3>
          }
        }
        @case ('paragraph') {
          <p [innerHTML]="block.html"></p>
        }
        @case ('list') {
          @if (block.ordered) {
            <ol class="docs-numbered-list">
              @for (item of block.items; track $index) {
                <li [innerHTML]="item"></li>
              }
            </ol>
          } @else {
            <ul>
              @for (item of block.items; track $index) {
                <li [innerHTML]="item"></li>
              }
            </ul>
          }
        }
        @case ('code') {
          <docs-code-block [code]="block.code" [language]="normalizeLanguage(block.language)" />
        }
        @case ('table') {
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  @for (header of block.headers; track $index) {
                    <th [innerHTML]="header"></th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of block.rows; track $index) {
                  <tr>
                    @for (cell of row; track $index) {
                      <td [innerHTML]="cell"></td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
        @case ('hr') {
          <hr />
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsMarkdownComponent {
  readonly source = input.required<string>();
  readonly linkResolver = input<MarkdownLinkResolver | undefined>(undefined);

  protected readonly parsed = computed(() => parseMarkdown(this.source(), this.linkResolver()));
  protected readonly blocks = computed(() => this.parsed().blocks);

  protected normalizeLanguage(language: string): AfCodeBlockLanguage {
    return normalizeCodeLanguage(language);
  }
}
