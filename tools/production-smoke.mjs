import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const smokeDirectory = resolve(repoRoot, '.tmp', 'production-smoke');
const tarballDirectory = resolve(repoRoot, 'dist', 'production-tarballs');
const PRODUCTION_VERSION = '1.3.2';
const failures = [];

const packageDefinitions = [
  {
    name: '@argfit-ui/core',
    projectManifest: 'projects/argfit-ui-core/package.json',
    distDirectory: 'dist/argfit-ui-core',
    tarballPrefix: 'argfit-ui-core-',
    internalPeers: [],
  },
  {
    name: '@argfit-ui/primitives',
    projectManifest: 'projects/argfit-ui-primitives/package.json',
    distDirectory: 'dist/argfit-ui-primitives',
    tarballPrefix: 'argfit-ui-primitives-',
    internalPeers: ['@argfit-ui/core'],
  },
  {
    name: '@argfit-ui/desktop',
    projectManifest: 'projects/argfit-ui-desktop/package.json',
    distDirectory: 'dist/argfit-ui-desktop',
    tarballPrefix: 'argfit-ui-desktop-',
    internalPeers: ['@argfit-ui/core', '@argfit-ui/primitives'],
  },
  {
    name: '@argfit-ui/mobile',
    projectManifest: 'projects/argfit-ui-mobile/package.json',
    distDirectory: 'dist/argfit-ui-mobile',
    tarballPrefix: 'argfit-ui-mobile-',
    internalPeers: ['@argfit-ui/core', '@argfit-ui/primitives'],
  },
  {
    name: '@argfit-ui/adaptive',
    projectManifest: 'projects/argfit-ui-adaptive/package.json',
    distDirectory: 'dist/argfit-ui-adaptive',
    tarballPrefix: 'argfit-ui-adaptive-',
    internalPeers: ['@argfit-ui/core', '@argfit-ui/desktop', '@argfit-ui/mobile', '@argfit-ui/primitives'],
  },
];

validateRootManifest();

for (const packageDefinition of packageDefinitions) {
  validateSourcePackage(packageDefinition);
  validateDistPackage(packageDefinition);
}

validateTarballs();
validateTypeScriptConsumerSmoke();
validateWorkflowShape();
validateProductionPublishWorkflowShape();
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

function validateRootManifest() {
  const manifestPath = resolve(repoRoot, 'package.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (manifest.version !== PRODUCTION_VERSION) {
    failures.push(`package.json: expected version ${PRODUCTION_VERSION}, found ${manifest.version}`);
  }
}

function validateSourcePackage(packageDefinition) {
  const manifestPath = resolve(repoRoot, packageDefinition.projectManifest);

  if (!existsSync(manifestPath)) {
    failures.push(`${packageDefinition.projectManifest}: expected source package manifest to exist`);
    return;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  validatePackageManifest(packageDefinition, manifest, packageDefinition.projectManifest);
}

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

  validatePackageManifest(packageDefinition, manifest, packageDefinition.distDirectory);

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

function validatePackageManifest(packageDefinition, manifest, label) {
  if (manifest.version !== PRODUCTION_VERSION) {
    failures.push(`${label}: expected version ${PRODUCTION_VERSION}, found ${manifest.version}`);
  }

  if (typeof manifest.version === 'string' && manifest.version.includes('-')) {
    failures.push(`${label}: production package version must not include a prerelease identifier`);
  }

  if (manifest.publishConfig?.access !== 'public') {
    failures.push(`${label}: publishConfig.access must be public`);
  }

  if (manifest.publishConfig?.tag !== 'latest') {
    failures.push(`${label}: publishConfig.tag must be latest`);
  }

  const peerDependencies = manifest.peerDependencies ?? {};

  for (const internalPeerName of packageDefinition.internalPeers) {
    if (peerDependencies[internalPeerName] !== PRODUCTION_VERSION) {
      failures.push(`${label}: peer ${internalPeerName} must be ${PRODUCTION_VERSION}, found ${peerDependencies[internalPeerName]}`);
    }
  }
}

function validateTarballs() {
  if (!existsSync(tarballDirectory)) {
    failures.push('dist/production-tarballs: expected tarball output directory to exist after pnpm pack:production:dist');
    return;
  }

  const tarballFiles = readdirSync(tarballDirectory).filter((entry) => entry.endsWith('.tgz'));

  for (const packageDefinition of packageDefinitions) {
    const matchingTarball = tarballFiles.find((entry) => entry === `${packageDefinition.tarballPrefix}${PRODUCTION_VERSION}.tgz`);

    if (!matchingTarball) {
      failures.push(`dist/production-tarballs: missing ${packageDefinition.tarballPrefix}${PRODUCTION_VERSION}.tgz for ${packageDefinition.name}`);
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
    'dist/production-tarballs/*.tgz',
    '.tmp/visual-regression/beta-plus/*.png',
  ]) {
    if (!workflow.includes(snippet)) {
      failures.push(`.github/workflows/ci.yml: missing ${JSON.stringify(snippet)}`);
    }
  }
}

function validateProductionPublishWorkflowShape() {
  const workflowPath = resolve(repoRoot, '.github', 'workflows', 'publish-production.yml');

  if (!existsSync(workflowPath)) {
    failures.push('.github/workflows/publish-production.yml: expected production publish workflow to exist');
    return;
  }

  const workflow = readFileSync(workflowPath, 'utf8');

  for (const snippet of [
    'name: Publish Production',
    'workflow_dispatch:',
    "- 'v1.*.*'",
    'NPM_TOKEN',
    'NODE_AUTH_TOKEN',
    'pnpm release:production:check',
    'pnpm build:libs',
    "manifest.publishConfig?.tag !== 'latest'",
    'npm publish "./$package_dir" --tag latest --access public',
  ]) {
    if (!workflow.includes(snippet)) {
      failures.push(`.github/workflows/publish-production.yml: missing ${JSON.stringify(snippet)}`);
    }
  }
}

function validateDocsShape() {
  for (const [filePath, snippets] of [
    ['package.json', ['"version": "1.3.2"', '"pack:production:dist"', '"release:production:check"', '"smoke:production:dist"', '"measure:production-performance:dist"']],
    ['docs/productive/quality-gates.md', ['pnpm release:production:check', 'No active budget exceptions.', '2.90 MB', '650 kB', 'Production tarball total']],
    ['docs/productive/scope.md', ['ArgFit UI 1.3.2 Scope', '`1.0-adaptive`']],
    ['docs/productive/public-api.md', ['Productive Public API Inventory', '1.0-renderer-specific']],
    ['docs/productive/semver-policy.md', ['Productive Semver Policy', 'Deprecation Policy']],
    ['docs/productive/release-operations.md', ['Productive Release Operations', 'Branch And Tag Strategy', 'npm Publish Process', 'Patch Release Procedure', 'Changelog Policy', 'publish-production.yml', 'NPM_TOKEN', 'latest']],
    ['docs/productive/support-policy.md', ['Productive Support Policy', 'Support Window', 'Security And Dependency Update Policy', 'Deprecation Process', '1.x']],
    ['docs/productive/release-checklist.md', ['Production Release Checklist', '1.3.2', 'pnpm release:production:check', 'v1.3.2', 'latest']],
    ['docs/productive/release-notes-1.3.2.md', ['Release Notes: 1.3.2', 'latest', 'pnpm release:production:check', 'dist/production-tarballs/']],
    ['CHANGELOG.md', ['## 1.3.2', 'latest', 'pnpm release:production:check']],
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
import type { AfButtonIconPosition, AfButtonVariant, AfIconName, AfNavigationItem, AfPlatformPreference } from '@argfit-ui/core';
import { AfIconComponent, AfVisuallyHiddenComponent } from '@argfit-ui/primitives';
import { AfButtonDesktopComponent } from '@argfit-ui/desktop';
import { AfButtonMobileComponent } from '@argfit-ui/mobile';
import { AfButton, AfCard, AfDialog, AfInput, AfKanban, AfPageShell, AfTabs, AfTooltip } from '@argfit-ui/adaptive';

const providers = provideArgfitUi({ theme: ARGFIT_DARK_THEME, platform: 'auto' });
const variant: AfButtonVariant = 'primary';
const buttonIcon: AfIconName = 'log-in';
const buttonIconPosition: AfButtonIconPosition = 'end';
const preference: AfPlatformPreference = 'auto';
const navigation: readonly AfNavigationItem[] = [{ id: 'home', label: 'Home' }];

void providers;
void variant;
void buttonIcon;
void buttonIconPosition;
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
