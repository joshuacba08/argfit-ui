import { createHash } from 'node:crypto';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const adaptiveRoot = resolve(workspaceRoot, 'projects/argfit-ui-adaptive/src');
const storiesRoot = resolve(adaptiveRoot, 'lib/components');
const compodocPath = resolve(workspaceRoot, 'projects/showcase/documentation.json');
const publicApiPath = resolve(adaptiveRoot, 'public-api.ts');
const chartPublicApiPath = resolve(workspaceRoot, 'projects/argfit-ui-adaptive/chart/src/public-api.ts');
const tokenFiles = [
  resolve(workspaceRoot, 'projects/argfit-ui-core/src/lib/themes/base-tokens.ts'),
  resolve(workspaceRoot, 'projects/argfit-ui-core/src/lib/themes/argfit-dark.theme.ts'),
  resolve(workspaceRoot, 'projects/argfit-ui-core/src/lib/themes/argfit-light.theme.ts'),
];
const tokenNamesPath = resolve(
  workspaceRoot,
  'projects/argfit-ui-core/src/lib/tokens/theme-token-names.ts',
);
const workflowPath = resolve(
  workspaceRoot,
  'projects/showcase/src/stories/component-workflow.docs.mdx',
);
const outputPath = resolve(workspaceRoot, 'tools/mcp/argfit-catalog.json');
const storybookIndexPath = resolve(workspaceRoot, 'dist/storybook/showcase/index.json');
const checkOnly = process.argv.includes('--check');
const validateStorybookIndex = process.argv.includes('--validate-storybook-index');

if (!existsSync(compodocPath)) {
  fail('Missing projects/showcase/documentation.json. Run pnpm --dir tools/storybook compodoc.');
}

const packageManifest = JSON.parse(readFileSync(resolve(workspaceRoot, 'package.json'), 'utf8'));
const compodoc = JSON.parse(readFileSync(compodocPath, 'utf8'));
const publicExports = readPublicExports(publicApiPath);
for (const [className, publicName] of readPublicExports(chartPublicApiPath)) {
  if (!publicExports.has(className)) {
    publicExports.set(className, publicName);
  }
}
const storyFiles = walk(storiesRoot).filter((path) => path.endsWith('.stories.ts')).sort();
const storyRecords = storyFiles.map(readStory);
const storyByClass = new Map(storyRecords.map((story) => [story.componentClass, story]));
const tokens = readTokens();
const tokenNames = new Set(tokens.map((token) => token.name));
const errors = [];

for (const story of storyRecords) {
  validateStory(story, tokenNames, errors);
}

const components = (compodoc.components ?? [])
  .filter((component) => publicExports.has(component.name))
  .map((component) => createComponentRecord(component, storyByClass.get(component.name)))
  .sort((left, right) => left.name.localeCompare(right.name));

if (components.length !== (compodoc.components ?? []).length) {
  const missing = (compodoc.components ?? [])
    .filter((component) => !publicExports.has(component.name))
    .map((component) => component.name);
  errors.push(`Components missing from adaptive public API: ${missing.join(', ')}`);
}

const componentNames = new Set(components.map((component) => component.name));
const componentIds = new Set();
for (const component of components) {
  if (componentIds.has(component.id)) {
    errors.push(`Duplicate component id: ${component.id}`);
  }
  componentIds.add(component.id);
  for (const related of component.related) {
    if (!componentNames.has(related)) {
      errors.push(`${component.name} references unknown related component ${related}`);
    }
  }
}

if (validateStorybookIndex) {
  validateIndex(components, errors);
}

if (errors.length > 0) {
  fail(`MCP catalog validation failed:\n- ${errors.join('\n- ')}`);
}

const canonicalSources = [
  publicApiPath,
  chartPublicApiPath,
  tokenNamesPath,
  ...tokenFiles,
  workflowPath,
  ...storyFiles,
].map((path) => `${relative(workspaceRoot, path).replaceAll('\\', '/')}\n${readFileSync(path, 'utf8')}`);

const gitSha = git(['rev-parse', '--short=12', 'HEAD'], 'unknown');
const generatedAt = git(['show', '-s', '--format=%cI', 'HEAD'], new Date(0).toISOString());
const sourceDigest = createHash('sha256').update(canonicalSources.join('\n---\n')).digest('hex');
const workflowContent = readFileSync(workflowPath, 'utf8');

const catalog = {
  schemaVersion: '1.0.0',
  library: {
    name: 'ArgFit UI',
    version: packageManifest.version,
    gitSha,
    generatedAt,
    sourceDigest,
    storybookBaseUrl: '/storybook',
  },
  components,
  tokens,
  guides: [
    {
      id: 'component-workflow',
      title: 'Crear, documentar y desplegar un componente',
      uri: 'argfit://guides/component-workflow',
      storybookUrl: '/storybook/?path=/docs/getting-started-new-component-workflow--docs',
      content: workflowContent,
    },
  ],
};

const serialized = `${JSON.stringify(catalog, null, 2)}\n`;
if (checkOnly) {
  if (!existsSync(outputPath) || readFileSync(outputPath, 'utf8') !== serialized) {
    fail('tools/mcp/argfit-catalog.json is stale. Run pnpm generate:mcp-catalog.');
  }
  console.log(`MCP catalog is current (${components.length} components, ${tokens.length} tokens).`);
} else {
  writeFileSync(outputPath, serialized, 'utf8');
  console.log(`Generated ${relative(workspaceRoot, outputPath)} (${components.length} components, ${tokens.length} tokens).`);
}

function createComponentRecord(component, story) {
  const exportName = publicExports.get(component.name);
  const componentPackage = story?.argfit.package ?? '@argfit-ui/adaptive';
  const id = kebab(exportName.replace(/^Af/, ''));
  const inputs = (component.inputsClass ?? []).map(cleanApiMember).sort(byName);
  const outputs = (component.outputsClass ?? []).map(cleanApiMember).sort(byName);
  const status = story ? (story.title.startsWith('Experimental/') ? 'experimental' : 'documented') : 'legacy-undocumented';
  const storybookId = story ? storybookSlug(story.title) : null;
  const canonicalStory = story?.stories.includes('Default')
    ? 'Default'
    : story?.stories.includes('Primary')
      ? 'Primary'
      : story?.stories[0];

  return {
    id,
    name: exportName,
    className: component.name,
    selector: component.selector,
    package: componentPackage,
    importStatement: `import { ${exportName} } from '${componentPackage}';`,
    title: story?.title ?? exportName,
    category: story?.argfit.category ?? 'Historical',
    status,
    description: story?.description || component.description || '',
    platforms: story?.argfit.platforms ?? ['desktop', 'mobile'],
    useWhen: story?.argfit.useWhen ?? [],
    avoidWhen: story?.argfit.avoidWhen ?? [],
    related: story?.argfit.related ?? [],
    tokens: story?.argfit.tokens ?? [],
    api: { inputs, outputs },
    stories: story
      ? story.stories.map((name) => ({
          id: `${storybookId}--${kebab(name)}`,
          name,
          url: `/storybook/?path=/story/${storybookId}--${kebab(name)}`,
        }))
      : [],
    docsUrl: storybookId ? `/storybook/?path=/docs/${storybookId}--docs` : null,
    example: story
      ? {
          story: canonicalStory ?? null,
          typescript: `import { ${exportName} } from '${componentPackage}';`,
          template: story.template || buildTemplate(component.selector, story.defaultArgs, inputs),
        }
      : null,
  };
}

function cleanApiMember(member) {
  return {
    name: member.name,
    type: member.type || 'unknown',
    required: Boolean(member.required),
    defaultValue: member.defaultValue ?? null,
    description: member.description || '',
    deprecated: Boolean(member.deprecated),
  };
}

function buildTemplate(selector, args, inputs) {
  const allowed = new Set(inputs.map((input) => input.name));
  const attributes = Object.entries(args ?? {})
    .filter(([name, value]) => allowed.has(name) && value !== undefined && value !== null)
    .slice(0, 8)
    .map(([name, value]) => {
      if (typeof value === 'string') {
        return `${name}="${escapeAttribute(value)}"`;
      }
      return `[${name}]="${escapeAttribute(JSON.stringify(value))}"`;
    });
  return attributes.length > 0
    ? `<${selector}\n  ${attributes.join('\n  ')}\n/>`
    : `<${selector} />`;
}

function readStory(path) {
  const source = readFileSync(path, 'utf8');
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const meta = findVariable(sourceFile, 'meta');
  const metaObject = asObject(meta?.initializer);
  const title = literalValue(property(metaObject, 'title'));
  const componentNode = property(metaObject, 'component');
  const componentClass = componentNode && ts.isIdentifier(unwrap(componentNode))
    ? unwrap(componentNode).text
    : '';
  const parameters = asObject(property(metaObject, 'parameters'));
  const docs = asObject(property(parameters, 'docs'));
  const docsDescription = asObject(property(docs, 'description'));
  const description = literalValue(property(docsDescription, 'component')) ?? '';
  const argfit = literalValue(property(parameters, 'argfit')) ?? {};
  const stories = [];
  let defaultArgs = {};
  let canonicalInitializer;

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || !hasExport(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      const name = declaration.name.text;
      stories.push(name);
      if (name === 'Default' || (!canonicalInitializer && name === 'Primary')) {
        canonicalInitializer = declaration.initializer;
        const storyObject = asObject(declaration.initializer);
        defaultArgs = literalValue(property(storyObject, 'args')) ?? {};
      }
    }
  }

  const template = findTemplate(metaObject) || findTemplate(asObject(canonicalInitializer));
  return { path, title, componentClass, description, argfit, stories, defaultArgs, template };
}

function validateStory(story, tokenNames, validationErrors) {
  const label = relative(workspaceRoot, story.path).replaceAll('\\', '/');
  if (!story.title || !story.componentClass) {
    validationErrors.push(`${label} must declare literal title and component metadata`);
  }
  const required = ['category', 'importName', 'useWhen', 'avoidWhen', 'platforms', 'tokens', 'related'];
  for (const field of required) {
    if (story.argfit[field] === undefined) {
      validationErrors.push(`${label} is missing parameters.argfit.${field}`);
    }
  }
  if (story.argfit.importName && publicExports.get(story.componentClass) !== story.argfit.importName) {
    validationErrors.push(`${label} importName does not match the adaptive public export`);
  }
  if (
    story.argfit.package !== undefined &&
    story.argfit.package !== '@argfit-ui/adaptive' &&
    story.argfit.package !== '@argfit-ui/adaptive/chart'
  ) {
    validationErrors.push(`${label} references unsupported parameters.argfit.package`);
  }
  for (const token of story.argfit.tokens ?? []) {
    if (!tokenNames.has(token)) {
      validationErrors.push(`${label} references unknown token ${token}`);
    }
  }
}

function validateIndex(componentRecords, validationErrors) {
  if (!existsSync(storybookIndexPath)) {
    validationErrors.push('Storybook index missing; run pnpm build-storybook before --validate-storybook-index');
    return;
  }
  const index = JSON.parse(readFileSync(storybookIndexPath, 'utf8'));
  const entries = new Set(Object.keys(index.entries ?? {}));
  for (const component of componentRecords.filter((record) => record.docsUrl)) {
    const docsId = component.docsUrl.match(/\/docs\/([^?]+)/)?.[1];
    if (!docsId || !entries.has(docsId)) {
      validationErrors.push(`${component.name} docs entry is missing from the built Storybook index`);
    }
    for (const story of component.stories) {
      if (!entries.has(story.id)) {
        validationErrors.push(`${component.name} story entry ${story.id} is missing from Storybook`);
      }
    }
  }
}

function readPublicExports(path) {
  const sourceFile = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
  const exports = new Map();
  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue;
    for (const element of statement.exportClause.elements) {
      const original = element.propertyName?.text ?? element.name.text;
      if (original.endsWith('Component')) {
        const current = exports.get(original);
        const candidate = element.name.text;
        if (!current || !candidate.endsWith('Component')) exports.set(original, candidate);
      }
    }
  }
  return exports;
}

function readTokens() {
  const byTheme = { base: {}, dark: {}, light: {} };
  for (const path of tokenFiles) {
    const theme = basename(path).includes('dark') ? 'dark' : basename(path).includes('light') ? 'light' : 'base';
    const sourceFile = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
    walkNodes(sourceFile, (node) => {
      if (!ts.isPropertyAssignment(node)) return;
      const name = propertyName(node.name);
      const value = literalValue(node.initializer);
      if (name?.startsWith('--af-') && typeof value === 'string') byTheme[theme][name] = value;
    });
  }

  const declared = [...readFileSync(tokenNamesPath, 'utf8').matchAll(/'(--af-[^']+)'/g)].map((match) => match[1]);
  return declared.map((name) => ({
    name,
    family: tokenFamily(name),
    values: {
      dark: byTheme.dark[name] ?? byTheme.base[name] ?? null,
      light: byTheme.light[name] ?? byTheme.base[name] ?? null,
    },
  }));
}

function tokenFamily(name) {
  if (name.startsWith('--af-calendar-')) return 'calendar';
  if (name.startsWith('--af-event-')) return 'event';
  if (name.includes('space')) return 'spacing';
  if (name.includes('radius')) return 'radius';
  if (name.includes('shadow')) return 'elevation';
  if (name.includes('font') || name.includes('text-') || name.includes('leading') || name.includes('tracking')) return 'typography';
  if (name.includes('duration') || name.includes('motion') || name.includes('ease')) return 'motion';
  if (name.includes('breakpoint')) return 'breakpoints';
  if (name.includes('button')) return 'button';
  return 'color';
}

function findVariable(sourceFile, name) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) return declaration;
    }
  }
  return undefined;
}

function hasExport(statement) {
  return statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function asObject(node) {
  const value = unwrap(node);
  return value && ts.isObjectLiteralExpression(value) ? value : undefined;
}

function unwrap(node) {
  let current = node;
  while (
    current &&
    (ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isParenthesizedExpression(current) ||
      ts.isTypeAssertionExpression(current))
  ) {
    current = current.expression;
  }
  return current;
}

function property(object, name) {
  if (!object) return undefined;
  const found = object.properties.find(
    (entry) => ts.isPropertyAssignment(entry) && propertyName(entry.name) === name,
  );
  return found?.initializer;
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return undefined;
}

function literalValue(node) {
  const value = unwrap(node);
  if (!value) return undefined;
  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) return value.text;
  if (ts.isNumericLiteral(value)) return Number(value.text);
  if (value.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (value.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (value.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(value)) return value.elements.map(literalValue).filter((item) => item !== undefined);
  if (ts.isObjectLiteralExpression(value)) {
    const result = {};
    for (const item of value.properties) {
      if (!ts.isPropertyAssignment(item)) continue;
      const name = propertyName(item.name);
      if (name) result[name] = literalValue(item.initializer);
    }
    return result;
  }
  if (ts.isPrefixUnaryExpression(value) && ts.isNumericLiteral(value.operand)) {
    return value.operator === ts.SyntaxKind.MinusToken ? -Number(value.operand.text) : Number(value.operand.text);
  }
  return undefined;
}

function findTemplate(root) {
  let result;
  if (!root) return undefined;
  walkNodes(root, (node) => {
    if (result || !ts.isPropertyAssignment(node) || propertyName(node.name) !== 'template') return;
    const value = unwrap(node.initializer);
    if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) result = value.text.trim();
  });
  return result;
}

function walkNodes(node, visitor) {
  visitor(node);
  node.forEachChild((child) => walkNodes(child, visitor));
}

function walk(root) {
  const files = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    if (statSync(path).isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

function storybookSlug(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function kebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-|-$/g, '');
}

function byName(left, right) {
  return left.name.localeCompare(right.name);
}

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;');
}

function git(args, fallback) {
  try {
    return execFileSync('git', args, { cwd: workspaceRoot, encoding: 'utf8' }).trim();
  } catch {
    return fallback;
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
