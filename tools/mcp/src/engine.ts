import { checkVersion, findComponent, normalize } from './catalog.js';
import type {
  ArgfitCatalog,
  CatalogComponent,
  ComponentStatus,
  DesignToken,
  Platform,
  SearchOptions,
  SearchResult,
  Theme,
  UsageDiagnostic,
  VersionNotice,
} from './types.js';

const semanticAliases: ReadonlyArray<{ readonly triggers: readonly string[]; readonly expansion: string }> = [
  {
    triggers: ['command palette', 'paleta', 'ctrl k', 'cmd k', 'spotlight'],
    expansion: 'command palette actions navigation results keyboard shortcut overlay',
  },
  {
    triggers: ['dropdown', 'selector', 'select', 'opciones', 'busqueda', 'buscar', 'infinite scroll', 'carga por scroll'],
    expansion: 'select searchable options scroll load more remote',
  },
  {
    triggers: ['login', 'auth', 'authentication', 'autenticacion', 'acceso', 'onboarding', 'sesion expirada'],
    expansion: 'auth shell input button inline message progress access login onboarding',
  },
  {
    triggers: ['modal', 'dialogo', 'dialog', 'confirmacion'],
    expansion: 'dialog overlay modal confirmation',
  },
  {
    triggers: ['tabla', 'table', 'registros', 'dataset'],
    expansion: 'data table rows columns records',
  },
  {
    triggers: ['fecha', 'date', 'calendario', 'calendar'],
    expansion: 'date picker civil date calendar',
  },
  {
    triggers: ['cargando', 'loading', 'progreso', 'progress', 'spinner', 'skeleton'],
    expansion: 'progress loading bar spinner skeleton',
  },
  {
    triggers: ['archivo', 'file', 'upload', 'adjunto'],
    expansion: 'file upload drop validation progress',
  },
];

const allowedStandardBindings = new Set([
  'class',
  'style',
  'id',
  'title',
  'hidden',
  'tabindex',
  'formcontrol',
  'formcontrolname',
  'ngmodel',
]);

export function searchComponents(catalog: ArgfitCatalog, options: SearchOptions): SearchResult[] {
  const query = expandQuery(options.query);
  const queryTerms = [...new Set(normalize(query).split(' ').filter(Boolean))];
  const limit = Math.max(1, Math.min(options.limit ?? 8, 20));

  return catalog.components
    .filter((component) => componentVisible(component, options))
    .map((component) => scoreComponent(component, queryTerms))
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.component.name.localeCompare(right.component.name))
    .slice(0, limit);
}

export function recommendComponents(
  catalog: ArgfitCatalog,
  intent: string,
  platform?: Platform,
): Array<{ component: CatalogComponent; reason: string; primary: boolean }> {
  const primary = searchComponents(catalog, { query: intent, platform, limit: 5 });
  if (primary.length === 0) return [];
  const selected = new Map<string, { component: CatalogComponent; reason: string; primary: boolean }>();

  for (const result of primary.slice(0, 3)) {
    selected.set(result.component.name, {
      component: result.component,
      reason: result.matches.length > 0
        ? `Matches ${result.matches.join(', ')}.`
        : result.component.useWhen[0] ?? result.component.description,
      primary: true,
    });
  }

  const normalizedIntent = normalize(intent);
  const authIntent = ['login', 'auth', 'autenticacion', 'acceso', 'onboarding', 'sesion'].some((term) =>
    normalizedIntent.includes(term),
  );
  const seed = authIntent ? findComponent(catalog, 'AfAuthShell') : primary[0]?.component;
  if (seed) {
    selected.set(seed.name, {
      component: seed,
      reason: seed.useWhen[0] ?? seed.description,
      primary: true,
    });
    for (const relatedName of seed.related) {
      const related = findComponent(catalog, relatedName);
      if (related && related.status !== 'legacy-undocumented') {
        selected.set(related.name, {
          component: related,
          reason: `Complements ${seed.name} in this composition.`,
          primary: false,
        });
      }
    }
  }

  return [...selected.values()].slice(0, 8);
}

export function generateUsage(
  catalog: ArgfitCatalog,
  identifiers: readonly string[],
): {
  imports: string;
  template: string;
  components: readonly CatalogComponent[];
  warnings: readonly string[];
} {
  const components = identifiers
    .map((identifier) => findComponent(catalog, identifier))
    .filter((component): component is CatalogComponent => Boolean(component));
  const warnings: string[] = [];
  const usable = components.filter((component) => {
    if (!component.example) {
      warnings.push(`${component.name} is ${component.status}; no usage example will be invented.`);
      return false;
    }
    return true;
  });
  const uniqueImports = [...new Set(usable.map((component) => component.name))].sort();
  return {
    imports: uniqueImports.length > 0
      ? `import { ${uniqueImports.join(', ')} } from '@argfit-ui/adaptive';`
      : '',
    template: usable.map((component) => `<!-- ${component.name}: ${component.docsUrl ?? 'documentation pending'} -->\n${component.example?.template}`).join('\n\n'),
    components,
    warnings,
  };
}

export function validateUsage(catalog: ArgfitCatalog, snippet: string): UsageDiagnostic[] {
  const diagnostics: UsageDiagnostic[] = [];
  const tokenNames = new Set(catalog.tokens.map((token) => token.name));

  addPatternDiagnostics(
    diagnostics,
    snippet,
    /from\s+['"](?:primeng\/[^'"]+|@ionic\/angular(?:\/[^'"]*)?)['"]/gi,
    'AF001',
    'error',
    'Consumer code must not import PrimeNG or Ionic renderers directly.',
    "Import the semantic component from '@argfit-ui/adaptive'.",
  );
  addPatternDiagnostics(
    diagnostics,
    snippet,
    /from\s+['"]@argfit-ui\/(?:desktop|mobile)['"]/gi,
    'AF002',
    'error',
    'Applications should use the adaptive package instead of a renderer package.',
    "Import from '@argfit-ui/adaptive'.",
  );
  addPatternDiagnostics(
    diagnostics,
    snippet,
    /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi,
    'AF003',
    'warning',
    'A raw color bypasses the ArgFit theme contract.',
    'Use a semantic --af-* token.',
  );

  for (const match of snippet.matchAll(/var\((--af-[a-z0-9-_]+)\)/gi)) {
    const token = match[1];
    if (token && !tokenNames.has(token)) {
      diagnostics.push(at(snippet, match.index ?? 0, {
        code: 'AF004',
        severity: 'error',
        message: `Unknown ArgFit design token ${token}.`,
        suggestion: 'Use get_design_tokens to find a supported semantic token.',
      }));
    }
  }

  for (const tag of snippet.matchAll(/<([a-z][a-z0-9-]*)([^>]*)>/gi)) {
    const selector = tag[1];
    if (!selector?.startsWith('af-')) continue;
    const component = findComponent(catalog, selector);
    if (!component) {
      diagnostics.push(at(snippet, tag.index ?? 0, {
        code: 'AF005',
        severity: 'error',
        message: `Unknown ArgFit selector <${selector}>.`,
        suggestion: 'Use search_components before generating markup.',
      }));
      continue;
    }
    const attributes = tag[2] ?? '';
    const allowedInputs = new Set(component.api.inputs.map((input) => normalize(input.name).replaceAll(' ', '')));
    const allowedOutputs = new Set(component.api.outputs.map((output) => normalize(output.name).replaceAll(' ', '')));
    for (const binding of attributes.matchAll(/\[([^\]]+)\]/g)) {
      const name = normalize(binding[1] ?? '').replaceAll(' ', '');
      if (!allowedInputs.has(name) && !allowedStandardBindings.has(name) && !name.startsWith('attraria')) {
        diagnostics.push(at(snippet, (tag.index ?? 0) + (binding.index ?? 0), {
          code: 'AF006',
          severity: 'error',
          message: `${component.name} has no input named ${binding[1]}.`,
          suggestion: `Use get_component('${component.name}') to inspect its public API.`,
        }));
      }
    }
    for (const event of attributes.matchAll(/(?:^|\s)\(([^)]+)\)\s*=/g)) {
      const name = normalize(event[1] ?? '').replaceAll(' ', '');
      if (!allowedOutputs.has(name)) {
        diagnostics.push(at(snippet, (tag.index ?? 0) + (event.index ?? 0), {
          code: 'AF007',
          severity: 'error',
          message: `${component.name} has no output named ${event[1]}.`,
          suggestion: `Use get_component('${component.name}') to inspect its public API.`,
        }));
      }
    }
    validateAccessibility(snippet, tag, component, diagnostics);
  }

  return diagnostics.sort((left, right) => left.line - right.line || left.column - right.column);
}

export function getTokens(
  catalog: ArgfitCatalog,
  options: { readonly theme?: Theme; readonly family?: string; readonly query?: string },
): Array<DesignToken & { readonly value: string | null }> {
  const theme = options.theme ?? 'dark';
  const query = normalize(options.query ?? '');
  return catalog.tokens
    .filter((token) => !options.family || normalize(token.family) === normalize(options.family))
    .filter((token) => !query || normalize(`${token.name} ${token.family}`).includes(query))
    .map((token) => ({ ...token, value: token.values[theme] }));
}

export function versionOrError(catalog: ArgfitCatalog, requested?: string): VersionNotice {
  return checkVersion(catalog, requested);
}

function componentVisible(component: CatalogComponent, options: SearchOptions): boolean {
  if (!options.includeLegacy && component.status === 'legacy-undocumented') return false;
  if (options.status && component.status !== options.status) return false;
  if (options.category && normalize(component.category) !== normalize(options.category)) return false;
  if (options.platform && !component.platforms.includes(options.platform)) return false;
  return true;
}

function scoreComponent(component: CatalogComponent, terms: readonly string[]): SearchResult {
  const fields = [
    { label: 'name', value: `${component.name} ${component.className} ${component.id}`, weight: 12 },
    { label: 'selector', value: component.selector, weight: 11 },
    { label: 'category', value: component.category, weight: 5 },
    { label: 'description', value: component.description, weight: 4 },
    { label: 'use cases', value: component.useWhen.join(' '), weight: 8 },
    { label: 'API', value: [...component.api.inputs, ...component.api.outputs].map((member) => member.name).join(' '), weight: 5 },
  ];
  let score = 0;
  const matches = new Set<string>();
  for (const term of terms) {
    for (const field of fields) {
      const normalizedField = normalize(field.value);
      if (normalizedField.includes(term)) {
        score += field.weight + (normalizedField === term ? field.weight : 0);
        matches.add(field.label);
      } else if (term.length >= 4 && normalizedField.split(' ').some((word) => levenshtein(term, word) <= 1)) {
        score += Math.max(1, Math.floor(field.weight / 3));
        matches.add(`${field.label} (fuzzy)`);
      }
    }
  }
  if (score > 0 && component.status === 'documented') score += 2;
  return { component, score, matches: [...matches] };
}

function expandQuery(query: string): string {
  const normalizedQuery = normalize(query);
  const expansions = semanticAliases
    .filter((alias) => alias.triggers.some((trigger) => normalizedQuery.includes(normalize(trigger))))
    .map((alias) => alias.expansion);
  return `${query} ${expansions.join(' ')}`;
}

function addPatternDiagnostics(
  target: UsageDiagnostic[],
  source: string,
  pattern: RegExp,
  code: string,
  severity: UsageDiagnostic['severity'],
  message: string,
  suggestion: string,
): void {
  for (const match of source.matchAll(pattern)) {
    target.push(at(source, match.index ?? 0, { code, severity, message, suggestion }));
  }
}

function validateAccessibility(
  source: string,
  tag: RegExpMatchArray,
  component: CatalogComponent,
  diagnostics: UsageDiagnostic[],
): void {
  if (!['AfInput', 'AfSelect', 'AfTextarea', 'AfDatePicker'].includes(component.name)) return;
  const attributes = tag[2] ?? '';
  if (!/\b(?:label|ariaLabel|aria-label)\s*=|\[(?:label|ariaLabel|attr\.aria-label)\]/i.test(attributes)) {
    diagnostics.push(at(source, tag.index ?? 0, {
      code: 'AF008',
      severity: 'warning',
      message: `${component.name} should have a visible label or accessible name.`,
      suggestion: 'Provide label or ariaLabel according to the component API.',
    }));
  }
}

function at(
  source: string,
  index: number,
  diagnostic: Omit<UsageDiagnostic, 'line' | 'column'>,
): UsageDiagnostic {
  const before = source.slice(0, index);
  const lines = before.split('\n');
  return { ...diagnostic, line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 };
}

function levenshtein(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        (current[column - 1] ?? 0) + 1,
        (previous[column] ?? 0) + 1,
        (previous[column - 1] ?? 0) + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length] ?? Math.max(left.length, right.length);
}
