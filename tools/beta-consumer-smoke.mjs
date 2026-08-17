import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const consumerChannel = process.argv.includes('--production') ? 'production' : 'beta';
const smokeDirectory = resolve(repoRoot, '.tmp', `${consumerChannel}-consumer`);
const rootManifest = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));
const betaVersion = rootManifest.version;
const tarballDirectory = resolve(repoRoot, 'dist', `${consumerChannel}-tarballs`);

const argfitPackages = [
  { name: '@argfit-ui/core', tarball: createTarballName('@argfit-ui/core') },
  { name: '@argfit-ui/chart-runtime', tarball: createTarballName('@argfit-ui/chart-runtime') },
  { name: '@argfit-ui/primitives', tarball: createTarballName('@argfit-ui/primitives') },
  { name: '@argfit-ui/desktop', tarball: createTarballName('@argfit-ui/desktop') },
  { name: '@argfit-ui/mobile', tarball: createTarballName('@argfit-ui/mobile') },
  { name: '@argfit-ui/adaptive', tarball: createTarballName('@argfit-ui/adaptive') },
];

const runtimeDependencies = [
  '@angular/cdk',
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/forms',
  '@angular/platform-browser',
  '@angular/router',
  '@ionic/angular',
  '@lucide/angular',
  'echarts',
  'postcss',
  'primeicons',
  'primeng',
  'rxjs',
  'tailwindcss',
  'tslib',
];

const buildDependencies = [
  '@angular/build',
  '@angular/cli',
  '@angular/compiler-cli',
  'typescript',
];

assertTarballsExist();

rmSync(smokeDirectory, { recursive: true, force: true });
mkdirSync(resolve(smokeDirectory, 'src', 'app'), { recursive: true });
mkdirSync(resolve(smokeDirectory, 'public'), { recursive: true });

writeWorkspaceFiles();
assertPublicImportsOnly();

runCommand('pnpm', ['install', '--no-frozen-lockfile'], smokeDirectory);
runCommand('pnpm', ['exec', 'ng', 'build', '--configuration', 'production', '--stats-json'], smokeDirectory);
assertChartRuntimeIsLazy();
assertRootChartImportFails();
writeFileSync(resolve(smokeDirectory, 'src', 'app', 'app.ts'), createNoChartAppSource(), 'utf8');
writeFileSync(resolve(smokeDirectory, 'src', 'app', 'app.html'), '<af-button>Ready</af-button>\n', 'utf8');
runCommand('pnpm', ['exec', 'ng', 'build', '--configuration', 'production', '--stats-json'], smokeDirectory);
assertNoChartRuntime();

console.log(`${consumerChannel} consumer chart bundle smoke passed. Consumer app available at ${smokeDirectory}.`);

function assertTarballsExist() {
  for (const argfitPackage of argfitPackages) {
    const tarballPath = resolve(tarballDirectory, argfitPackage.tarball);

    if (!existsSync(tarballPath)) {
      throw new Error(`Missing required tarball ${argfitPackage.tarball}. Run pnpm pack:${consumerChannel}:dist first.`);
    }
  }
}

function writeWorkspaceFiles() {
  writeFileSync(resolve(smokeDirectory, 'package.json'), createPackageManifest(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'pnpm-workspace.yaml'), createPnpmWorkspaceSource(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'angular.json'), createAngularWorkspaceSource(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'tsconfig.json'), createTsconfigSource(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'tsconfig.app.json'), createTsconfigAppSource(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'src', 'main.ts'), createMainSource(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'src', 'index.html'), createIndexHtmlSource(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'src', 'styles.css'), createGlobalStylesSource(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'src', 'app', 'app.config.ts'), createAppConfigSource(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'src', 'app', 'app.ts'), createAppComponentSource(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'src', 'app', 'app.html'), createAppTemplateSource(), 'utf8');
  writeFileSync(resolve(smokeDirectory, 'src', 'app', 'app.css'), createAppStylesSource(), 'utf8');
}

function createPnpmWorkspaceSource() {
  return `packages:\n  - '.'\n\nonlyBuiltDependencies:\n  - '@parcel/watcher'\n  - esbuild\n  - lmdb\n  - msgpackr-extract\n`;
}

function createPackageManifest() {
  const dependencies = Object.fromEntries(
    runtimeDependencies.map((dependency) => [dependency, rootManifest.dependencies[dependency]]),
  );

  for (const argfitPackage of argfitPackages) {
    const tarballPath = resolve(tarballDirectory, argfitPackage.tarball);
    const relativeTarballPath = relative(smokeDirectory, tarballPath).split('\\').join('/');
    dependencies[argfitPackage.name] = `file:${relativeTarballPath}`;
  }

  const devDependencies = Object.fromEntries(
    buildDependencies.map((dependency) => [dependency, rootManifest.devDependencies[dependency]]),
  );

  return `${JSON.stringify(
    {
      name: 'beta-consumer-smoke',
      private: true,
      scripts: {
        build: 'ng build --configuration production',
      },
      dependencies,
      devDependencies,
    },
    null,
    2,
  )}\n`;
}

function createAngularWorkspaceSource() {
  return `${JSON.stringify(
    {
      $schema: './node_modules/@angular/cli/lib/config/schema.json',
      version: 1,
      cli: {
        packageManager: 'pnpm',
      },
      projects: {
        'beta-consumer': {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          prefix: 'app',
          architect: {
            build: {
              builder: '@angular/build:application',
              options: {
                browser: 'src/main.ts',
                tsConfig: 'tsconfig.app.json',
                assets: [
                  {
                    glob: '**/*',
                    input: 'public',
                  },
                ],
                styles: ['src/styles.css'],
              },
              configurations: {
                production: {
                  outputHashing: 'all',
                },
                development: {
                  optimization: false,
                  extractLicenses: false,
                  sourceMap: true,
                },
              },
              defaultConfiguration: 'production',
            },
          },
        },
      },
    },
    null,
    2,
  )}\n`;
}

function createTsconfigSource() {
  return `${JSON.stringify(
    {
      compileOnSave: false,
      compilerOptions: {
        strict: true,
        noImplicitOverride: true,
        noPropertyAccessFromIndexSignature: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        skipLibCheck: true,
        isolatedModules: true,
        experimentalDecorators: true,
        importHelpers: true,
        target: 'ES2022',
        module: 'preserve',
      },
      angularCompilerOptions: {
        enableI18nLegacyMessageIdFormat: false,
        strictInjectionParameters: true,
        strictInputAccessModifiers: true,
        strictTemplates: true,
      },
      files: [],
    },
    null,
    2,
  )}\n`;
}

function createTsconfigAppSource() {
  return `${JSON.stringify(
    {
      extends: './tsconfig.json',
      compilerOptions: {
        outDir: './out-tsc/app',
        types: [],
      },
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts'],
    },
    null,
    2,
  )}\n`;
}

function createMainSource() {
  return `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((error) => console.error(error));
`;
}

function createIndexHtmlSource() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Beta Consumer Smoke</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`;
}

function createGlobalStylesSource() {
  return `html,
body {
  margin: 0;
  min-height: 100%;
}

body {
  font-family: system-ui, sans-serif;
}
`;
}

function assertPublicImportsOnly() {
  const sources = [
    readFileSync(resolve(smokeDirectory, 'src', 'app', 'app.config.ts'), 'utf8'),
    readFileSync(resolve(smokeDirectory, 'src', 'app', 'app.ts'), 'utf8'),
    readFileSync(resolve(smokeDirectory, 'src', 'main.ts'), 'utf8'),
  ];
  const invalidImports = ['primeng', '@ionic/angular', 'echarts', '@argfit-ui/desktop', '@argfit-ui/mobile'];

  for (const invalidImport of invalidImports) {
    if (sources.some((source) => source.includes(invalidImport))) {
      throw new Error(`Consumer app must not import ${invalidImport} directly.`);
    }
  }
}

function createAppConfigSource() {
  return `import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideArgfitUi({
      theme: ARGFIT_DARK_THEME,
      platform: 'auto',
    }),
  ],
};
`;
}

function createAppComponentSource() {
  return `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  AfBadge,
  AfButton,
  AfCard,
  AfCardContentDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
  AfDataTable,
  AfInlineMessage,
  AfInput,
  AfOrganizationChart,
  AfOrganizationChartActionsDirective,
  AfOrganizationChartNodeDirective,
  AfTreeTable,
  AfTreeTableActionsDirective,
  AfTreeTableCellDirective,
  AfToastViewport,
  AfVirtualScroller,
  AfVirtualScrollerActionsDirective,
  AfVirtualScrollerItemDirective,
} from '@argfit-ui/adaptive';
import { AfChart } from '@argfit-ui/adaptive/chart';
import type {
  AfDataTableColumn,
  AfDataTablePagination,
  AfDataTableSort,
  AfOrganizationChartExpandedIds,
  AfOrganizationChartNode,
  AfOrganizationChartSelectedIds,
  AfTreeTableExpandedIds,
  AfTreeTableNode,
  AfTreeTableSelectedIds,
  AfVirtualScrollerItem,
  AfVirtualScrollerRange,
} from '@argfit-ui/core';
import { AfVisuallyHiddenComponent } from '@argfit-ui/primitives';

interface ConsumerAthleteRow {
  readonly id: string;
  readonly athlete: string;
  readonly jump: number;
  readonly status: 'Ready' | 'Review';
}

interface ConsumerTreeUnit {
  readonly name: string;
  readonly status: string;
}

interface ConsumerOrgUnit {
  readonly zone: string;
}

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    AfBadge,
    AfButton,
    AfCard,
    AfCardContentDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    AfChart,
    AfDataTable,
    AfInlineMessage,
    AfInput,
    AfOrganizationChart,
    AfOrganizationChartActionsDirective,
    AfOrganizationChartNodeDirective,
    AfTreeTable,
    AfTreeTableActionsDirective,
    AfTreeTableCellDirective,
    AfToastViewport,
    AfVirtualScroller,
    AfVirtualScrollerActionsDirective,
    AfVirtualScrollerItemDirective,
    AfVisuallyHiddenComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly athleteForm = new FormGroup({
    athlete: new FormControl('Maria Garcia', { nonNullable: true }),
  });

  protected readonly rows: readonly ConsumerAthleteRow[] = [
    { id: '1', athlete: 'Maria Garcia', jump: 45.2, status: 'Ready' },
    { id: '2', athlete: 'Santiago Perez', jump: 55.4, status: 'Review' },
    { id: '3', athlete: 'Paula Martinez', jump: 44.8, status: 'Ready' },
  ];

  protected readonly columns: readonly AfDataTableColumn<ConsumerAthleteRow>[] = [
    { key: 'athlete', header: 'Athlete', sortable: true, mobilePriority: 'primary' },
    { key: 'jump', header: 'Jump', sortable: true, align: 'end', mobilePriority: 'secondary' },
    { key: 'status', header: 'Status', mobilePriority: 'secondary' },
  ];

  protected readonly pagination: AfDataTablePagination = {
    pageIndex: 0,
    pageSize: 3,
    totalItems: this.rows.length,
  };

  protected readonly sort: AfDataTableSort = {
    key: 'jump',
    direction: 'desc',
  };

  protected readonly treeTableColumns: readonly AfDataTableColumn<ConsumerTreeUnit>[] = [
    { key: 'name', header: 'Unit', mobilePriority: 'primary' },
    { key: 'status', header: 'Status', mobilePriority: 'secondary' },
  ];

  protected readonly treeTableNodes: readonly AfTreeTableNode<ConsumerTreeUnit>[] = [
    {
      id: 'consumer-ops',
      label: 'Ops',
      data: { name: 'Ops', status: 'Active' },
      children: [{ id: 'consumer-lab', label: 'Lab', data: { name: 'Lab', status: 'Ready' } }],
    },
  ];

  protected treeTableSelectedIds: AfTreeTableSelectedIds = ['consumer-lab'];
  protected treeTableExpandedIds: AfTreeTableExpandedIds = ['consumer-ops'];

  protected readonly organizationNodes: readonly AfOrganizationChartNode<ConsumerOrgUnit>[] = [
    {
      id: 'consumer-root',
      label: 'ArgFit HQ',
      title: 'Leadership',
      meta: '2 cells',
      data: { zone: 'HQ' },
      children: [{ id: 'consumer-performance', label: 'Performance', title: 'Ops', data: { zone: 'Field' } }],
    },
  ];

  protected organizationSelectedIds: AfOrganizationChartSelectedIds = ['consumer-performance'];
  protected organizationExpandedIds: AfOrganizationChartExpandedIds = ['consumer-root'];

  protected readonly virtualItems: readonly AfVirtualScrollerItem[] = [
    { id: 'consumer-session-1', title: 'Session 1', meta: 'AM', supportingText: 'CMJ' },
    { id: 'consumer-session-2', title: 'Session 2', meta: 'PM', supportingText: 'RSI' },
    { id: 'consumer-session-3', title: 'Session 3', meta: 'PM', supportingText: 'Load review' },
  ];

  protected visibleRange: AfVirtualScrollerRange = {
    startIndex: 0,
    endIndex: 1,
    totalItems: this.virtualItems.length,
  };

  protected setTreeTableSelection(selectedIds: AfTreeTableSelectedIds): void {
    this.treeTableSelectedIds = selectedIds;
  }

  protected setTreeTableExpanded(expandedIds: AfTreeTableExpandedIds): void {
    this.treeTableExpandedIds = expandedIds;
  }

  protected setOrganizationSelection(selectedIds: AfOrganizationChartSelectedIds): void {
    this.organizationSelectedIds = selectedIds;
  }

  protected setOrganizationExpanded(expandedIds: AfOrganizationChartExpandedIds): void {
    this.organizationExpandedIds = expandedIds;
  }

  protected setVisibleRange(range: AfVirtualScrollerRange): void {
    this.visibleRange = range;
  }
}
`;
}

function createAppTemplateSource() {
  return `<af-toast-viewport />

<af-chart
  ariaLabel="Carga semanal"
  [categories]="['L', 'M', 'X']"
  [series]="[{ name: 'Carga', data: [520, 610, 570] }]"
/>

<main class="consumer-shell">
  <af-card variant="panel" tone="primary">
    <header afCardHeader>
      <h1 afCardTitle>ArgFit beta consumer smoke</h1>
      <af-badge tone="neutral">Angular 21</af-badge>
    </header>

    <div afCardContent class="consumer-stack">
      <af-inline-message
        severity="success"
        title="Consumer ready"
        description="Adaptive components compile from published tarballs with public imports only."
      />

      <form [formGroup]="athleteForm" class="consumer-form">
        <af-input label="Athlete" placeholder="Maria Garcia" formControlName="athlete" />
      </form>

      <div class="consumer-actions">
        <af-button>Save athlete</af-button>
        <af-badge tone="success" dot>Forms + feedback</af-badge>
      </div>

      <af-visually-hidden>ArgFit beta consumer smoke verification.</af-visually-hidden>
    </div>
  </af-card>

  <af-data-table
    [columns]="columns"
    [rows]="rows"
    rowIdKey="id"
    density="compact"
    ariaLabel="ArgFit beta consumer smoke table"
    [sort]="sort"
    [pagination]="pagination"
  />

  <af-tree-table
    [columns]="treeTableColumns"
    [nodes]="treeTableNodes"
    treeColumnKey="name"
    [selectedIds]="treeTableSelectedIds"
    [expandedIds]="treeTableExpandedIds"
    ariaLabel="ArgFit beta consumer smoke tree table"
    (selectionChange)="setTreeTableSelection($event)"
    (expandedChange)="setTreeTableExpanded($event)"
  >
    <div afTreeTableActions class="consumer-actions">
      <af-badge tone="accent">Hierarchy</af-badge>
    </div>
    <ng-template afTreeTableCell="status" let-value>
      <span>{{ value }}</span>
    </ng-template>
  </af-tree-table>

  <af-organization-chart
    [nodes]="organizationNodes"
    [selectedIds]="organizationSelectedIds"
    [expandedIds]="organizationExpandedIds"
    ariaLabel="ArgFit beta consumer smoke organization chart"
    (selectionChange)="setOrganizationSelection($event)"
    (expandedChange)="setOrganizationExpanded($event)"
  >
    <div afOrganizationChartActions class="consumer-actions">
      <af-badge tone="neutral">Org chart</af-badge>
    </div>
    <ng-template afOrganizationChartNode let-node>
      <div>
        <strong>{{ node.label }}</strong>
        <span>{{ node.title }}</span>
      </div>
    </ng-template>
  </af-organization-chart>

  <af-virtual-scroller
    [items]="virtualItems"
    [itemHeight]="72"
    [viewportHeight]="180"
    ariaLabel="ArgFit beta consumer smoke virtual list"
    (visibleRangeChange)="setVisibleRange($event)"
  >
    <div afVirtualScrollerActions class="consumer-actions">
      <af-badge tone="accent">{{ visibleRange.startIndex + 1 }}-{{ visibleRange.endIndex + 1 }}</af-badge>
    </div>
    <ng-template afVirtualScrollerItem let-item>
      <div>
        <strong>{{ item.title }}</strong>
        <span>{{ item.meta }}</span>
      </div>
    </ng-template>
  </af-virtual-scroller>
</main>
`;
}

function assertChartRuntimeIsLazy() {
  const statsPath = resolve(smokeDirectory, 'dist', 'beta-consumer', 'stats.json');
  const stats = JSON.parse(readFileSync(statsPath, 'utf8'));
  const mainOutput = Object.entries(stats.outputs).find(([, output]) =>
    output.entryPoint?.endsWith('src/main.ts'),
  );
  if (!mainOutput) {
    throw new Error('Consumer stats are missing the main entry point.');
  }

  const initialOutputs = new Set([mainOutput[0]]);
  const pending = [mainOutput[0]];
  while (pending.length > 0) {
    const outputName = pending.pop();
    for (const imported of stats.outputs[outputName]?.imports ?? []) {
      if (imported.kind === 'dynamic-import' || initialOutputs.has(imported.path)) continue;
      initialOutputs.add(imported.path);
      pending.push(imported.path);
    }
  }

  const forbiddenInitialInputs = [...initialOutputs].flatMap((outputName) =>
    Object.keys(stats.outputs[outputName]?.inputs ?? {}).filter((input) =>
      /(?:argfit-ui-chart-runtime|node_modules[\\/].*?(?:echarts|zrender))/.test(input),
    ),
  );
  if (forbiddenInitialInputs.length > 0) {
    throw new Error(`Chart runtime leaked into initial assets:\n${forbiddenInitialInputs.join('\n')}`);
  }

  const lazyRuntime = Object.entries(stats.outputs).find(([outputName, output]) =>
    !initialOutputs.has(outputName) &&
    Object.keys(output.inputs ?? {}).some((input) => input.includes('argfit-ui-chart-runtime')),
  );
  if (!lazyRuntime) {
    throw new Error('Consumer build did not emit @argfit-ui/chart-runtime as a lazy chunk.');
  }

  const adaptiveTypes = readFileSync(
    resolve(smokeDirectory, 'node_modules', '@argfit-ui', 'adaptive', 'types', 'argfit-ui-adaptive.d.ts'),
    'utf8',
  );
  if (/\bAfChartComponent\s+as\s+AfChart\b/.test(adaptiveTypes)) {
    throw new Error('AfChart must not be exported by the @argfit-ui/adaptive root entry point.');
  }
}

function assertNoChartRuntime() {
  const statsPath = resolve(smokeDirectory, 'dist', 'beta-consumer', 'stats.json');
  const stats = JSON.parse(readFileSync(statsPath, 'utf8'));
  const runtimeInputs = Object.values(stats.outputs).flatMap((output) =>
    Object.keys(output.inputs ?? {}).filter((input) =>
      /(?:argfit-ui-chart-runtime|node_modules[\\/].*?(?:echarts|zrender))/.test(input),
    ),
  );
  if (runtimeInputs.length > 0) {
    throw new Error(`An application without charts contains chart runtime code:\n${runtimeInputs.join('\n')}`);
  }
}

function assertRootChartImportFails() {
  writeFileSync(
    resolve(smokeDirectory, 'src', 'app', 'app.ts'),
    `import { Component } from '@angular/core';
import { AfChart } from '@argfit-ui/adaptive';

@Component({ selector: 'app-root', imports: [AfChart], template: '' })
export class App {}
`,
    'utf8',
  );

  const command = 'pnpm';
  const args = ['exec', 'ng', 'build', '--configuration', 'production'];
  const result = spawnSync(spawnExecutable(command), spawnArguments(command, args), {
    cwd: smokeDirectory,
    encoding: 'utf8',
    stdio: 'pipe',
    shell: false,
    maxBuffer: 1024 * 1024 * 50,
  });
  if (result.error) throw result.error;

  const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
  if (result.status === 0) {
    throw new Error('Importing AfChart from @argfit-ui/adaptive unexpectedly compiled.');
  }
  if (!/has no exported member ['"]AfChart['"]/.test(output)) {
    throw new Error(`Root AfChart import failed for an unexpected reason:\n${output}`);
  }
}

function createNoChartAppSource() {
  return `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AfButton } from '@argfit-ui/adaptive';

@Component({
  selector: 'app-root',
  imports: [AfButton],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
`;
}

function createAppStylesSource() {
  return `:host {
  display: block;
  min-height: 100vh;
}

.consumer-shell {
  display: grid;
  gap: 1.5rem;
  margin: 0 auto;
  max-width: 960px;
  padding: 2rem;
}

.consumer-stack,
.consumer-form {
  display: grid;
  gap: 1rem;
}

.consumer-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

af-tree-table,
af-organization-chart,
af-virtual-scroller {
  display: block;
}
`;
}

function runCommand(command, args, cwd) {
  const result = spawnSync(spawnExecutable(command), spawnArguments(command, args), {
    cwd,
    encoding: 'utf8',
    stdio: 'pipe',
    shell: false,
    maxBuffer: 1024 * 1024 * 50,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
    throw new Error(`Command failed in ${cwd}: ${command} ${args.join(' ')}\n${output}`);
  }
}

function spawnExecutable(command) {
  if (process.platform === 'win32' && command === 'pnpm') {
    return 'cmd.exe';
  }

  return commandExecutable(command);
}

function spawnArguments(command, args) {
  if (process.platform === 'win32' && command === 'pnpm') {
    return ['/d', '/s', '/c', serializeWindowsCommand(command, args)];
  }

  return args;
}

function commandExecutable(command) {
  if (command === 'node') {
    return process.execPath;
  }

  return command;
}

function serializeWindowsCommand(command, args) {
  return [command, ...args].map((argument) => quoteWindowsArgument(argument)).join(' ');
}

function quoteWindowsArgument(argument) {
  if (/^[A-Za-z0-9_./:@=-]+$/.test(argument)) {
    return argument;
  }

  return `"${argument.replace(/"/g, '""')}"`;
}

function createTarballName(packageName) {
  return `${packageName.replace('@', '').replace('/', '-')}-${betaVersion}.tgz`;
}
