import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const smokeDirectory = resolve(repoRoot, '.tmp', 'production-smoke');
const tarballDirectory = resolve(repoRoot, 'dist', 'beta-plus-tarballs');
const failures = [];

const packageDefinitions = [
  { name: '@argfit-ui/core', distDirectory: 'dist/argfit-ui-core', tarballPrefix: 'argfit-ui-core-' },
  { name: '@argfit-ui/primitives', distDirectory: 'dist/argfit-ui-primitives', tarballPrefix: 'argfit-ui-primitives-' },
  { name: '@argfit-ui/desktop', distDirectory: 'dist/argfit-ui-desktop', tarballPrefix: 'argfit-ui-desktop-' },
  { name: '@argfit-ui/mobile', distDirectory: 'dist/argfit-ui-mobile', tarballPrefix: 'argfit-ui-mobile-' },
  { name: '@argfit-ui/adaptive', distDirectory: 'dist/argfit-ui-adaptive', tarballPrefix: 'argfit-ui-adaptive-' },
];

for (const packageDefinition of packageDefinitions) {
  validateDistPackage(packageDefinition);
}

validateTarballs();
validateTypeScriptConsumerSmoke();
validateWorkflowShape();
validateDocsShape();

rmSync(smokeDirectory, { recursive: true, force: true });

if (failures.length > 0) {
  console.error('Production smoke failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log('Production smoke passed.');

function validateDistPackage(packageDefinition) {
  const packageDirectory = resolve(repoRoot, packageDefinition.distDirectory);
  const manifestPath = resolve(packageDirectory, 'package.json');

  if (!existsSync(packageDirectory)) {
    failures.push(`${packageDefinition.distDirectory}: expected built package directory to exist`);
    return;
  }

  if (!existsSync(manifestPath)) {
    failures.push(`${packageDefinition.distDirectory}: expected package.json to exist`);
    return;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (manifest.name !== packageDefinition.name) {
    failures.push(`${packageDefinition.distDirectory}: expected package name ${packageDefinition.name}, found ${manifest.name}`);
  }

  const rootExport = manifest.exports?.['.'];
  const typeEntry = rootExport?.types ?? manifest.typings ?? manifest.types;
  const runtimeEntry = rootExport?.default ?? manifest.module ?? manifest.fesm2022;

  if (!typeEntry || !existsSync(resolve(packageDirectory, typeEntry))) {
    failures.push(`${packageDefinition.name}: missing exported type entrypoint`);
  }

  if (!runtimeEntry || !existsSync(resolve(packageDirectory, runtimeEntry))) {
    failures.push(`${packageDefinition.name}: missing exported runtime entrypoint`);
  }

}

function validateTarballs() {
  if (!existsSync(tarballDirectory)) {
    failures.push('dist/beta-plus-tarballs: expected tarball output directory to exist after pnpm pack:beta-plus:dist');
    return;
  }

  const tarballFiles = readdirSync(tarballDirectory).filter((entry) => entry.endsWith('.tgz'));

  for (const packageDefinition of packageDefinitions) {
    const matchingTarball = tarballFiles.find((entry) => entry.startsWith(packageDefinition.tarballPrefix));

    if (!matchingTarball) {
      failures.push(`dist/beta-plus-tarballs: missing tarball for ${packageDefinition.name}`);
    }
  }
}

function validateTypeScriptConsumerSmoke() {
  const smokeEntry = resolve(smokeDirectory, 'production-consumer.ts');
  mkdirSync(dirname(smokeEntry), { recursive: true });
  writeFileSync(smokeEntry, createSmokeSource(), 'utf8');

  const compilerOptions = {
    baseUrl: repoRoot,
    paths: Object.fromEntries(packageDefinitions.map((packageDefinition) => [packageDefinition.name, [`./${packageDefinition.distDirectory}`]])),
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    experimentalDecorators: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  };
  const program = ts.createProgram([smokeEntry], compilerOptions);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length > 0) {
    failures.push(`TypeScript production smoke failed:\n${formatDiagnostics(diagnostics)}`);
  }
}

function validateWorkflowShape() {
  const workflowPath = resolve(repoRoot, '.github', 'workflows', 'ci.yml');

  if (!existsSync(workflowPath)) {
    failures.push('.github/workflows/ci.yml: expected CI workflow to exist');
    return;
  }

  const workflow = readFileSync(workflowPath, 'utf8');

  for (const snippet of [
    'name: CI',
    'pull_request:',
    'push:',
    'pnpm release:production:check',
    'dist/beta-plus-tarballs/*.tgz',
    '.tmp/visual-regression/beta-plus/*.png',
  ]) {
    if (!workflow.includes(snippet)) {
      failures.push(`.github/workflows/ci.yml: missing ${JSON.stringify(snippet)}`);
    }
  }
}

function validateDocsShape() {
  for (const [filePath, snippets] of [
    ['package.json', ['"release:production:check"', '"smoke:production:dist"', '"measure:production-performance:dist"']],
    ['docs/productive/quality-gates.md', ['pnpm release:production:check', 'No active budget exceptions.', '2.90 MB', '650 kB']],
    ['docs/productive/scope.md', ['ArgFit UI 1.0.0 Scope', '`1.0-adaptive`']],
    ['docs/productive/public-api.md', ['Productive Public API Inventory', '1.0-renderer-specific']],
    ['docs/productive/semver-policy.md', ['Productive Semver Policy', 'Deprecation Policy']],
  ]) {
    const absolutePath = resolve(repoRoot, filePath);

    if (!existsSync(absolutePath)) {
      failures.push(`${filePath}: expected file to exist`);
      continue;
    }

    const contents = readFileSync(absolutePath, 'utf8');

    for (const snippet of snippets) {
      if (!contents.includes(snippet)) {
        failures.push(`${filePath}: missing ${JSON.stringify(snippet)}`);
      }
    }
  }
}

function createSmokeSource() {
  return `import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';
import type { AfButtonVariant, AfNavigationItem, AfPlatformPreference } from '@argfit-ui/core';
import { AfIconComponent, AfVisuallyHiddenComponent } from '@argfit-ui/primitives';
import { AfButtonDesktopComponent } from '@argfit-ui/desktop';
import { AfButtonMobileComponent } from '@argfit-ui/mobile';
import { AfButton, AfCard, AfDialog, AfInput, AfKanban, AfPageShell, AfTabs, AfTooltip } from '@argfit-ui/adaptive';

const providers = provideArgfitUi({ theme: ARGFIT_DARK_THEME, platform: 'auto' });
const variant: AfButtonVariant = 'primary';
const preference: AfPlatformPreference = 'auto';
const navigation: readonly AfNavigationItem[] = [{ id: 'home', label: 'Home' }];

void providers;
void variant;
void preference;
void navigation;
void AfIconComponent;
void AfVisuallyHiddenComponent;
void AfButtonDesktopComponent;
void AfButtonMobileComponent;
void AfButton;
void AfCard;
void AfDialog;
void AfInput;
void AfKanban;
void AfPageShell;
void AfTabs;
void AfTooltip;
`;
}

function formatDiagnostics(diagnostics) {
  return diagnostics
    .map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

      if (!diagnostic.file || diagnostic.start === undefined) {
        return message;
      }

      const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      return `${diagnostic.file.fileName}:${position.line + 1}:${position.character + 1} ${message}`;
    })
    .join('\n');
}
