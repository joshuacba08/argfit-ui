import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';

import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

let registered = false;
function ensureLanguagesRegistered(): void {
  if (registered) {
    return;
  }
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('shell', bash);
  hljs.registerLanguage('sh', bash);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('scss', scss);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('ts', typescript);
  hljs.registerLanguage('javascript', typescript);
  hljs.registerLanguage('js', typescript);
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('xml', xml);
  registered = true;
}

export type AfCodeBlockLanguage =
  | 'bash'
  | 'shell'
  | 'sh'
  | 'css'
  | 'scss'
  | 'json'
  | 'typescript'
  | 'ts'
  | 'javascript'
  | 'js'
  | 'html'
  | 'xml'
  | 'plaintext';

@Component({
  selector: 'docs-code-block',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'docs-code-block',
  },
  template: `
    <header class="docs-code-block__head">
      <div class="docs-code-block__meta">
        @if (filename()) {
          <span class="docs-code-block__filename">{{ filename() }}</span>
        }
        <span class="docs-code-block__lang">{{ displayLanguage() }}</span>
      </div>
      <button
        type="button"
        class="docs-code-block__copy"
        (click)="copy()"
        [attr.aria-label]="copyLabel()"
        [attr.data-state]="copyState()"
      >
        {{ copyLabel() }}
      </button>
    </header>
    <pre class="docs-code-block__pre"><code class="hljs" [class]="languageClass()" [innerHTML]="highlighted()"></code></pre>
  `,
})
export class DocsCodeBlockComponent {
  readonly code = input.required<string>();
  readonly language = input<AfCodeBlockLanguage>('typescript');
  readonly filename = input<string | null>(null);

  protected readonly copyState = signal<'idle' | 'copied' | 'error'>('idle');
  protected readonly copyLabel = computed(() => {
    switch (this.copyState()) {
      case 'copied':
        return 'Copied';
      case 'error':
        return 'Copy failed';
      default:
        return 'Copy';
    }
  });

  protected readonly languageClass = computed(() => `language-${this.language()}`);

  protected readonly displayLanguage = computed(() => {
    const lang = this.language();
    switch (lang) {
      case 'ts':
      case 'typescript':
        return 'typescript';
      case 'js':
      case 'javascript':
        return 'javascript';
      case 'sh':
      case 'shell':
      case 'bash':
        return 'shell';
      case 'html':
      case 'xml':
        return 'html';
      default:
        return lang;
    }
  });

  protected readonly highlighted = computed(() => {
    ensureLanguagesRegistered();
    const source = this.code() ?? '';
    const lang = this.language();
    if (lang === 'plaintext' || !hljs.getLanguage(lang)) {
      return this.escape(source);
    }
    try {
      return hljs.highlight(source, { language: lang, ignoreIllegals: true }).value;
    } catch {
      return this.escape(source);
    }
  });

  protected copy(): void {
    const text = this.code();
    const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
    if (!clipboard) {
      this.copyState.set('error');
      this.resetCopyState();
      return;
    }
    clipboard
      .writeText(text)
      .then(() => {
        this.copyState.set('copied');
        this.resetCopyState();
      })
      .catch(() => {
        this.copyState.set('error');
        this.resetCopyState();
      });
  }

  private resetCopyState(): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.setTimeout(() => this.copyState.set('idle'), 1800);
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
