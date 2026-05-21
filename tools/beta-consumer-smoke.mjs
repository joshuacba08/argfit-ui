import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const smokeDirectory = resolve(repoRoot, '.tmp', 'beta-consumer');
const rootManifest = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));

const argfitPackages = [
  { name: '@argfit-ui/core', tarball: 'argfit-ui-core-0.1.0-alpha.0.tgz' },
  { name: '@argfit-ui/primitives', tarball: 'argfit-ui-primitives-0.1.0-alpha.0.tgz' },
  { name: '@argfit-ui/desktop', tarball: 'argfit-ui-desktop-0.1.0-alpha.0.tgz' },
  { name: '@argfit-ui/mobile', tarball: 'argfit-ui-mobile-0.1.0-alpha.0.tgz' },
  { name: '@argfit-ui/adaptive', tarball: 'argfit-ui-adaptive-0.1.0-alpha.0.tgz' },
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
runCommand('pnpm', ['exec', 'ng', 'build', '--configuration', 'production'], smokeDirectory);

console.log(`Beta consumer smoke passed. Consumer app available at ${smokeDirectory}.`);

function assertTarballsExist() {
  for (const argfitPackage of argfitPackages) {
    const tarballPath = resolve(repoRoot, 'dist', 'alpha-tarballs', argfitPackage.tarball);

    if (!existsSync(tarballPath)) {
      throw new Error(`Missing required tarball ${argfitPackage.tarball}. Run pnpm pack:alpha:dist first.`);
    }
  }
}

function writeWorkspaceFiles() {
  writeFileSync(resolve(smokeDirectory, 'package.json'), createPackageManifest(), 'utf8');
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

function createPackageManifest() {
  const dependencies = Object.fromEntries(
    runtimeDependencies.map((dependency) => [dependency, rootManifest.dependencies[dependency]]),
  );

  for (const argfitPackage of argfitPackages) {
    const tarballPath = resolve(repoRoot, 'dist', 'alpha-tarballs', argfitPackage.tarball);
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
  AfToastViewport,
} from '@argfit-ui/adaptive';
import type { AfDataTableColumn, AfDataTablePagination, AfDataTableSort } from '@argfit-ui/core';
import { AfVisuallyHiddenComponent } from '@argfit-ui/primitives';

interface ConsumerAthleteRow {
  readonly id: string;
  readonly athlete: string;
  readonly jump: number;
  readonly status: 'Ready' | 'Review';
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
    AfDataTable,
    AfInlineMessage,
    AfInput,
    AfToastViewport,
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
}
`;
}

function createAppTemplateSource() {
  return `<af-toast-viewport />

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
</main>
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