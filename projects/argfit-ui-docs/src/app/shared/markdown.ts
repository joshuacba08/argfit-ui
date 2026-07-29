export type MarkdownBlock =
  | { readonly type: 'heading'; readonly level: 2 | 3; readonly id: string; readonly html: string }
  | { readonly type: 'paragraph'; readonly html: string }
  | { readonly type: 'list'; readonly ordered: boolean; readonly items: readonly string[] }
  | { readonly type: 'code'; readonly language: string; readonly code: string }
  | { readonly type: 'table'; readonly headers: readonly string[]; readonly rows: readonly (readonly string[])[] }
  | { readonly type: 'hr' };

export interface ParsedMarkdown {
  readonly title: string;
  readonly blocks: readonly MarkdownBlock[];
}

/** Resolves a relative `./file.md` markdown link to an in-app route. */
export type MarkdownLinkResolver = (relativePath: string) => string | null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function renderInline(text: string, resolveLink: MarkdownLinkResolver | undefined): string {
  let html = escapeHtml(text);

  html = html.replace(/`([^`]+)`/g, '<code class="docs-inline-code">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    if (/^(https?:)?\/\//.test(href)) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    }

    const resolved = resolveLink?.(href);
    if (resolved) {
      return `<a href="${resolved}">${label}</a>`;
    }

    return label;
  });

  return html;
}

function isTableSeparatorRow(line: string): boolean {
  return /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line.trim());
}

function splitTableRow(line: string): readonly string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

/** Minimal CommonMark-subset parser covering the headings, lists, tables, code
 * fences and links actually used in the ArgFit UI productive markdown corpus. */
export function parseMarkdown(source: string, resolveLink?: MarkdownLinkResolver): ParsedMarkdown {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  let title = '';

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];

    if (line.trim().length === 0) {
      index += 1;
      continue;
    }

    if (/^```/.test(line.trim())) {
      const language = line.trim().slice(3).trim() || 'plaintext';
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: 'code', language, code: codeLines.join('\n') });
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.*)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      if (level === 1 && title.length === 0) {
        title = text;
      } else {
        blocks.push({
          type: 'heading',
          level: level === 2 ? 2 : 3,
          id: slugifyHeading(text),
          html: renderInline(text, resolveLink),
        });
      }
      index += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,})\s*$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      index += 1;
      continue;
    }

    if (line.trim().startsWith('|') && index + 1 < lines.length && isTableSeparatorRow(lines[index + 1])) {
      const headers = splitTableRow(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rows.push(splitTableRow(lines[index]).map((cell) => renderInline(cell, resolveLink)));
        index += 1;
      }
      blocks.push({ type: 'table', headers: headers.map((cell) => renderInline(cell, resolveLink)), rows });
      continue;
    }

    const orderedMatch = /^\s*\d+\.\s+(.*)$/.exec(line);
    const unorderedMatch = /^\s*[-*]\s+(.*)$/.exec(line);
    if (orderedMatch || unorderedMatch) {
      const ordered = Boolean(orderedMatch);
      const items: string[] = [];
      const itemPattern = ordered ? /^\s*\d+\.\s+(.*)$/ : /^\s*[-*]\s+(.*)$/;
      while (index < lines.length) {
        const match = itemPattern.exec(lines[index]);
        if (!match) {
          break;
        }
        items.push(renderInline(match[1], resolveLink));
        index += 1;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim().length > 0 &&
      !/^```/.test(lines[index].trim()) &&
      !/^#{1,3}\s+/.test(lines[index]) &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index]) &&
      !lines[index].trim().startsWith('|')
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push({ type: 'paragraph', html: renderInline(paragraphLines.join(' '), resolveLink) });
  }

  return { title, blocks };
}
