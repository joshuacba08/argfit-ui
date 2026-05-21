import ts from 'typescript';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const rootManifest = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));
const packageVersion = rootManifest.version;
const smokeDirectory = resolve(repoRoot, '.tmp', 'beta-smoke');

const packageDefinitions = [
  { name: '@argfit-ui/core', distDirectory: 'dist/argfit-ui-core', tarballName: `argfit-ui-core-${packageVersion}.tgz` },
  {
    name: '@argfit-ui/primitives',
    distDirectory: 'dist/argfit-ui-primitives',
    tarballName: `argfit-ui-primitives-${packageVersion}.tgz`,
  },
  { name: '@argfit-ui/desktop', distDirectory: 'dist/argfit-ui-desktop', tarballName: `argfit-ui-desktop-${packageVersion}.tgz` },
  { name: '@argfit-ui/mobile', distDirectory: 'dist/argfit-ui-mobile', tarballName: `argfit-ui-mobile-${packageVersion}.tgz` },
  {
    name: '@argfit-ui/adaptive',
    distDirectory: 'dist/argfit-ui-adaptive',
    tarballName: `argfit-ui-adaptive-${packageVersion}.tgz`,
  },
];

const failures = [];

for (const packageDefinition of packageDefinitions) {
  validateDistPackage(packageDefinition);
}

validateTarballs();
validateTypeScriptConsumerSmoke();
validateWorkflowShape();
validatePublishWorkflowShape();
validateDocsShape();

rmSync(smokeDirectory, { recursive: true, force: true });

if (failures.length > 0) {
  console.error('Beta smoke failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log('Beta smoke passed.');

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

  if (manifest.version !== packageVersion) {
    failures.push(`${packageDefinition.distDirectory}: expected version ${packageVersion}, found ${manifest.version}`);
  }

  const rootExport = manifest.exports?.['.'];
  const typeEntry = rootExport?.types ?? manifest.typings;
  const runtimeEntry = rootExport?.default ?? manifest.module;

  if (!typeEntry || !existsSync(resolve(packageDirectory, typeEntry))) {
    failures.push(`${packageDefinition.name}: missing exported type entrypoint`);
  }

  if (!runtimeEntry || !existsSync(resolve(packageDirectory, runtimeEntry))) {
    failures.push(`${packageDefinition.name}: missing exported runtime entrypoint`);
  }

  if (!existsSync(resolve(packageDirectory, 'LICENSE'))) {
    failures.push(`${packageDefinition.name}: missing LICENSE file in built package directory`);
  }
}

function validateTarballs() {
  const tarballDirectory = resolve(repoRoot, 'dist', 'beta-tarballs');

  if (!existsSync(tarballDirectory)) {
    failures.push('dist/beta-tarballs: expected tarball output directory to exist after pnpm pack:beta');
    return;
  }

  for (const packageDefinition of packageDefinitions) {
    const tarballPath = resolve(tarballDirectory, packageDefinition.tarballName);

    if (!existsSync(tarballPath) || !statSync(tarballPath).isFile()) {
      failures.push(`dist/beta-tarballs: missing ${packageDefinition.tarballName}`);
    }
  }
}

function validateTypeScriptConsumerSmoke() {
  const smokeEntry = resolve(smokeDirectory, 'beta-consumer.ts');
  mkdirSync(dirname(smokeEntry), { recursive: true });
  writeFileSync(smokeEntry, createSmokeSource(), 'utf8');

  const compilerOptions = {
    baseUrl: repoRoot,
    paths: Object.fromEntries(
      packageDefinitions.map((packageDefinition) => [packageDefinition.name, [`./${packageDefinition.distDirectory}`]]),
    ),
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
    failures.push(`TypeScript consumer import smoke failed:\n${formatDiagnostics(diagnostics)}`);
  }
}

function validateWorkflowShape() {
  const workflowPath = resolve(repoRoot, '.github', 'workflows', 'ci.yml');

  if (!existsSync(workflowPath)) {
    failures.push('.github/workflows/ci.yml: expected CI workflow to exist');
    return;
  }

  const workflow = readFileSync(workflowPath, 'utf8');
  const requiredSnippets = [
    'name: CI',
    'pull_request:',
    'push:',
    'actions/checkout@v4',
    'pnpm/action-setup@v4',
    'actions/setup-node@v4',
    'pnpm install --frozen-lockfile',
    'pnpm release:beta:check',
    'actions/upload-artifact@v4',
    'dist/beta-tarballs/*.tgz',
  ];

  for (const snippet of requiredSnippets) {
    if (!workflow.includes(snippet)) {
      failures.push(`.github/workflows/ci.yml: missing ${JSON.stringify(snippet)}`);
    }
  }
}

function validatePublishWorkflowShape() {
  const workflowPath = resolve(repoRoot, '.github', 'workflows', 'publish-beta.yml');

  if (!existsSync(workflowPath)) {
    failures.push('.github/workflows/publish-beta.yml: expected publish workflow to exist');
    return;
  }

  const workflow = readFileSync(workflowPath, 'utf8');
  const requiredSnippets = [
    'name: Publish Beta',
    'workflow_dispatch:',
    "- 'v*-beta.*'",
    'NPM_TOKEN',
    'NODE_AUTH_TOKEN',
    'pnpm release:beta:check',
    'pnpm pack:beta',
    `npm publish dist/beta-tarballs/argfit-ui-core-${packageVersion}.tgz --tag beta --access public`,
  ];

  for (const snippet of requiredSnippets) {
    if (!workflow.includes(snippet)) {
      failures.push(`.github/workflows/publish-beta.yml: missing ${JSON.stringify(snippet)}`);
    }
  }
}

function validateDocsShape() {
  for (const [filePath, snippets] of [
    ['README.md', ['Beta quickstart', 'Beta release notes', 'Beta release checklist', 'pnpm release:beta:check']],
    ['docs/beta/quickstart.md', [`pnpm add @argfit-ui/core@${packageVersion}`, 'pnpm pack:beta:dist', 'dist/beta-tarballs']],
    ['docs/beta/release-checklist.md', ['pnpm release:beta:check', 'v0.1.0-beta.0', '--tag beta', 'dist/beta-tarballs/']],
    ['docs/beta/release-notes-beta.md', ['0.1.0-beta.0', 'pnpm publish:beta:dry-run', 'pnpm release:beta:check']],
    ['CHANGELOG.md', ['0.1.0-beta.0', 'beta dist-tag', 'publish-beta.yml']],
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
  return `import { ARGFIT_DARK_THEME, AfPlatformService, AfThemeService, provideArgfitUi } from '@argfit-ui/core';
import type { AfButtonVariant, AfChartType } from '@argfit-ui/core';
import { AfIconComponent, AfVisuallyHiddenComponent } from '@argfit-ui/primitives';
import { AfButtonDesktopComponent } from '@argfit-ui/desktop';
import { AfButtonMobileComponent } from '@argfit-ui/mobile';
import { AfBadge, AfButton, AfCard, AfChart, AfDialog, AfInput, AfMetricCard, AfPageShell } from '@argfit-ui/adaptive';

const providers = provideArgfitUi({ theme: ARGFIT_DARK_THEME, platform: 'auto' });
const variant: AfButtonVariant = 'primary';
const chartType: AfChartType = 'line';

export const betaSmoke = {
  providers,
  variant,
  chartType,
  core: [AfPlatformService, AfThemeService],
  primitives: [AfIconComponent, AfVisuallyHiddenComponent],
  renderers: [AfButtonDesktopComponent, AfButtonMobileComponent],
  adaptive: [AfBadge, AfButton, AfCard, AfChart, AfDialog, AfInput, AfMetricCard, AfPageShell],
};
`;
}

function formatDiagnostics(diagnostics) {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => repoRoot,
    getNewLine: () => '\n',
  });
}