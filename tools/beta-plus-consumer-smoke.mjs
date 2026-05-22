import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const BETA_PLUS_VERSION = '0.2.0-beta.0';
const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const smokeDirectory = resolve(repoRoot, '.tmp', 'beta-plus-consumer');
const tarballDirectory = resolve(repoRoot, 'dist', 'beta-plus-tarballs');
const rootManifest = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));

const argfitPackages = [
  { name: '@argfit-ui/core', tarball: createTarballName('@argfit-ui/core') },
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
  '@primeuix/themes',
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
assertRepresentativeSurface();

runCommand('pnpm', ['install', '--no-frozen-lockfile'], smokeDirectory);
runCommand('pnpm', ['exec', 'ng', 'build', '--configuration', 'production'], smokeDirectory);
assertBuildOutputExists();

console.log(`Beta+ consumer smoke passed. Consumer app available at ${smokeDirectory}.`);

function assertTarballsExist() {
  for (const argfitPackage of argfitPackages) {
    const tarballPath = resolve(tarballDirectory, argfitPackage.tarball);

    if (!existsSync(tarballPath)) {
      throw new Error(`Missing required tarball ${argfitPackage.tarball}. Run pnpm pack:beta-plus:dist first.`);
    }
  }
}

function assertBuildOutputExists() {
  const distCandidates = [
    resolve(smokeDirectory, 'dist', 'beta-plus-consumer', 'browser', 'index.html'),
    resolve(smokeDirectory, 'dist', 'beta-plus-consumer', 'index.html'),
  ];

  if (!distCandidates.some((candidate) => existsSync(candidate))) {
    throw new Error('Beta+ consumer smoke build did not emit an index.html file.');
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

function assertRepresentativeSurface() {
  const template = readFileSync(resolve(smokeDirectory, 'src', 'app', 'app.html'), 'utf8');
  const requiredTags = [
    '<af-tooltip',
    '<af-popover',
    '<af-drawer',
    '<af-avatar',
    '<af-chip',
    '<af-progress',
    '<af-input-count',
    '<af-multi-select',
    '<af-date-picker',
    '<af-listbox',
    '<af-data-view',
    '<af-timeline',
    '<af-tree',
    '<af-tabs',
    '<af-stepper',
    '<af-splitter',
    '<af-kanban',
  ];

  for (const requiredTag of requiredTags) {
    if (!template.includes(requiredTag)) {
      throw new Error(`Beta+ consumer template must include ${requiredTag}.`);
    }
  }
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
      name: 'beta-plus-consumer-smoke',
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
        'beta-plus-consumer': {
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
    <title>Beta+ Consumer Smoke</title>
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
  background: Canvas;
  color: CanvasText;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
`;
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
  return `import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AfAvatar,
  AfCard,
  AfCardContentDirective,
  AfCardHeaderDirective,
  AfCardTitleDirective,
  AfChip,
  AfDataView,
  AfDataViewActionsDirective,
  AfDataViewItemDirective,
  AfDatePicker,
  AfDrawer,
  AfInputCount,
  AfKanban,
  AfListbox,
  AfMultiSelect,
  AfPopover,
  AfPopoverContentDirective,
  AfPopoverTriggerDirective,
  AfProgress,
  AfSplitter,
  AfSplitterPrimaryDirective,
  AfSplitterSecondaryDirective,
  AfStepPanelDirective,
  AfStepper,
  AfTabPanelDirective,
  AfTabs,
  AfTimeline,
  AfTimelineActionsDirective,
  AfTimelineItemDirective,
  AfTooltip,
  AfTree,
  AfTreeActionsDirective,
  AfTreeNodeDirective,
} from '@argfit-ui/adaptive';
import {
  AfPlatformService,
  AfThemeService,
  type AfDataViewItem,
  type AfKanbanAddCardEvent,
  type AfKanbanCard,
  type AfKanbanCardClickEvent,
  type AfKanbanColumn,
  type AfKanbanColumnActionEvent,
  type AfKanbanFilter,
  type AfKanbanFilterChange,
  type AfKanbanMoveEvent,
  type AfListboxOption,
  type AfStepItem,
  type AfTabItem,
  type AfTimelineItem,
  type AfTreeExpandedIds,
  type AfTreeNode,
  type AfTreeSelectedIds,
} from '@argfit-ui/core';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    AfAvatar,
    AfCard,
    AfCardContentDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    AfChip,
    AfDataView,
    AfDataViewActionsDirective,
    AfDataViewItemDirective,
    AfDatePicker,
    AfDrawer,
    AfInputCount,
    AfKanban,
    AfListbox,
    AfMultiSelect,
    AfPopover,
    AfPopoverContentDirective,
    AfPopoverTriggerDirective,
    AfProgress,
    AfSplitter,
    AfSplitterPrimaryDirective,
    AfSplitterSecondaryDirective,
    AfStepPanelDirective,
    AfStepper,
    AfTabPanelDirective,
    AfTabs,
    AfTimeline,
    AfTimelineActionsDirective,
    AfTimelineItemDirective,
    AfTooltip,
    AfTree,
    AfTreeActionsDirective,
    AfTreeNodeDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly platform = inject(AfPlatformService);
  private readonly theme = inject(AfThemeService);

  protected readonly resolvedPlatform = this.platform.platform;
  protected readonly currentThemeKind = this.theme.currentThemeKind;

  protected readonly popoverOpen = signal(false);
  protected readonly drawerOpen = signal(false);

  protected readonly athleteAge = new FormControl<number>(18, { nonNullable: true });
  protected readonly sessionDate = new FormControl<string>('2026-05-22', { nonNullable: true });
  protected readonly selectedTests = new FormControl<readonly string[]>(['cmj'], { nonNullable: true });
  protected readonly visibleTests = new FormControl<readonly string[]>(['cmj'], { nonNullable: true });

  protected readonly multiSelectOptions = [
    { label: 'CMJ', value: 'cmj', hint: 'Counter movement jump' },
    { label: 'SJ', value: 'sj', hint: 'Squat jump' },
    { label: 'DJ', value: 'dj', hint: 'Drop jump' },
  ];

  protected readonly listboxOptions: readonly AfListboxOption<string>[] = [
    { value: 'cmj', label: 'CMJ', hint: 'Potencia bilateral' },
    { value: 'sj', label: 'SJ', hint: 'Salto sin contramovimiento' },
    { value: 'dj', label: 'DJ', hint: 'Reactividad' },
  ];

  protected readonly dataViewItems = signal<readonly AfDataViewItem[]>([
    {
      id: 'plan-semanal',
      title: 'Plan semanal',
      eyebrow: 'Potencia',
      description: 'Microciclo con enfasis en RSI y asimetria.',
      meta: 'Hoy 10:30',
      badge: { label: 'Activo', tone: 'success' },
    },
    {
      id: 'sesion-de-carga',
      title: 'Sesion de carga',
      eyebrow: 'Fuerza',
      description: 'Bloque de sentadilla y monitoreo de salto.',
      meta: 'Manana 08:00',
      badge: { label: 'Pendiente', tone: 'warning' },
    },
  ]);

  protected readonly timelineItems = signal<readonly AfTimelineItem[]>([
    {
      id: 'session-created',
      title: 'Sesion creada',
      timestamp: 'Hoy 08:00',
      eyebrow: 'Setup',
      description: 'El cuerpo tecnico preparo la carga inicial del bloque.',
      badge: { label: 'Activo', tone: 'success' },
      icon: 'calendar',
    },
    {
      id: 'session-reviewed',
      title: 'Revision completada',
      timestamp: 'Hoy 11:45',
      eyebrow: 'Staff',
      description: 'Se revisaron asimetrias y readiness antes del entrenamiento.',
      badge: { label: 'Pendiente', tone: 'warning' },
      icon: 'check-square',
    },
  ]);

  protected readonly treeNodes = signal<readonly AfTreeNode[]>([
    {
      id: 'club',
      label: 'Club ArgFit',
      description: 'Unidad principal',
      meta: '3 grupos',
      icon: 'users',
      children: [
        {
          id: 'team-performance',
          label: 'Equipo de performance',
          description: 'Staff y atletas prioritarios',
          meta: '6 atletas',
          icon: 'activity',
          children: [
            {
              id: 'athlete-maria',
              label: 'Maria Garcia',
              description: 'Voleibol',
              meta: 'Activa',
              icon: 'users',
            },
          ],
        },
      ],
    },
  ]);

  protected readonly treeSelectedIds = signal<AfTreeSelectedIds>(['club']);
  protected readonly treeExpandedIds = signal<AfTreeExpandedIds>(['club']);

  protected readonly tabItems = signal<readonly AfTabItem[]>([
    {
      id: 'profile',
      label: 'Perfil',
      description: 'Resumen del atleta',
      badge: { label: 'Activo', tone: 'success' },
    },
    {
      id: 'readiness',
      label: 'Readiness',
      description: 'Carga y disponibilidad',
    },
    {
      id: 'history',
      label: 'Historial',
      description: 'Sesiones anteriores',
      disabled: true,
    },
  ]);

  protected readonly activeTabId = signal<string | undefined>('profile');

  protected readonly steps = signal<readonly AfStepItem[]>([
    { id: 'setup', label: 'Setup', description: 'Parametros base', state: 'completed' },
    { id: 'capture', label: 'Capture', description: 'Carga y resultados' },
    { id: 'review', label: 'Review', description: 'Revision tecnica', optional: true },
  ]);

  protected readonly activeStepId = signal<string | undefined>('capture');
  protected readonly splitterPrimarySize = signal(58);

  protected readonly kanbanColumns: readonly AfKanbanColumn[] = [
    { id: 'backlog', label: 'Backlog', accentColor: 'var(--af-primary, #3b82f6)' },
    { id: 'planned', label: 'Planned', accentColor: 'var(--af-warning, #f59e0b)' },
    { id: 'active', label: 'Active', accentColor: 'var(--af-info, #38bdf8)' },
    { id: 'done', label: 'Done', accentColor: 'var(--af-success, #22c55e)' },
  ];

  protected readonly kanbanFilters: readonly AfKanbanFilter[] = [
    { id: 'all', label: 'Todas', count: 6 },
    { id: 'CMJ', label: 'CMJ', count: 3 },
    { id: 'DJ', label: 'DJ', count: 2 },
  ];

  protected readonly kanbanCards = signal<readonly AfKanbanCard[]>([
    {
      id: 'backlog-cmj',
      columnId: 'backlog',
      category: 'CMJ',
      title: 'CMJ baseline',
      assigneeName: 'Maria',
      assigneeInitials: 'MG',
      metricLabel: '8 saltos',
    },
    {
      id: 'backlog-dj',
      columnId: 'backlog',
      category: 'DJ',
      title: 'DJ readiness',
      assigneeName: 'Lucia',
      assigneeInitials: 'LP',
      metricLabel: '4 saltos',
    },
    {
      id: 'planned-force',
      columnId: 'planned',
      category: 'Force',
      title: 'Force profile',
      assigneeName: 'Bruno',
      assigneeInitials: 'BS',
      metricLabel: '2 bloques',
    },
    {
      id: 'active-cmj',
      columnId: 'active',
      category: 'CMJ',
      title: 'CMJ live capture',
      assigneeName: 'Ines',
      assigneeInitials: 'ID',
      metricLabel: 'En curso',
    },
    {
      id: 'active-dj',
      columnId: 'active',
      category: 'DJ',
      title: 'DJ live capture',
      assigneeName: 'Raul',
      assigneeInitials: 'RM',
      metricLabel: '3 atletas',
    },
    {
      id: 'done-report',
      columnId: 'done',
      category: 'CMJ',
      title: 'Export ready',
      assigneeName: 'ArgFit',
      assigneeInitials: 'AF',
      metricLabel: 'CSV listo',
    },
  ]);

  protected readonly activeKanbanFilter = signal('all');
  protected readonly addCount = signal(0);
  protected readonly lastPressedTreeNode = signal<string | null>(null);
  protected readonly lastPressedDataItem = signal<string | null>(null);
  protected readonly lastPressedTimelineItem = signal<string | null>(null);
  protected readonly lastClickedCardId = signal<string | null>(null);
  protected readonly lastColumnActionId = signal<string | null>(null);

  protected useDesktop(): void {
    this.platform.setPreference('desktop');
  }

  protected useMobile(): void {
    this.platform.setPreference('mobile');
  }

  protected useAuto(): void {
    this.platform.useAutoDetection();
  }

  protected applyDarkTheme(): void {
    this.theme.applyDarkTheme();
  }

  protected applyLightTheme(): void {
    this.theme.applyLightTheme();
  }

  protected setPopoverOpen(open: boolean): void {
    this.popoverOpen.set(open);
  }

  protected togglePopover(): void {
    this.popoverOpen.update((open) => !open);
  }

  protected setDrawerOpen(open: boolean): void {
    this.drawerOpen.set(open);
  }

  protected openDrawer(): void {
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  protected setTreeSelection(selectedIds: AfTreeSelectedIds): void {
    this.treeSelectedIds.set(selectedIds);
  }

  protected setTreeExpanded(expandedIds: AfTreeExpandedIds): void {
    this.treeExpandedIds.set(expandedIds);
  }

  protected handleTreePressed(node: AfTreeNode): void {
    this.lastPressedTreeNode.set(node.id);
  }

  protected handleDataItemPressed(item: AfDataViewItem): void {
    this.lastPressedDataItem.set(item.id);
  }

  protected handleTimelineItemPressed(item: AfTimelineItem): void {
    this.lastPressedTimelineItem.set(item.id);
  }

  protected setActiveTab(nextId: string): void {
    this.activeTabId.set(nextId);
  }

  protected setActiveStep(nextId: string): void {
    this.activeStepId.set(nextId);
  }

  protected setPrimarySize(nextSize: number): void {
    this.splitterPrimarySize.set(nextSize);
  }

  protected handleKanbanMove(move: AfKanbanMoveEvent): void {
    this.kanbanCards.set(move.cards);
  }

  protected handleKanbanClick(event: AfKanbanCardClickEvent): void {
    this.lastClickedCardId.set(event.card.id);
  }

  protected handleKanbanAdd(event: AfKanbanAddCardEvent): void {
    const targetColumnId = event.columnId ?? this.kanbanColumns[0]?.id;
    if (!targetColumnId) {
      return;
    }

    this.addCount.update((count) => count + 1);
    this.kanbanCards.update((cards) => [
      ...cards,
      {
        id: 'added-' + (cards.length + 1),
        columnId: targetColumnId,
        category: 'CMJ',
        title: 'Nueva rutina ' + (cards.length + 1),
        assigneeName: 'ArgFit',
        assigneeInitials: 'AF',
        metricLabel: '5 saltos',
      },
    ]);
  }

  protected handleKanbanFilterChange(change: AfKanbanFilterChange): void {
    this.activeKanbanFilter.set(change.filterId);
  }

  protected handleKanbanColumnAction(event: AfKanbanColumnActionEvent): void {
    this.lastColumnActionId.set(event.columnId);
  }
}
`;
}

function createAppTemplateSource() {
  return `<main
  class="consumer-shell"
  data-qa="consumer-shell"
  [attr.data-platform]="resolvedPlatform()"
  [attr.data-theme]="currentThemeKind()"
>
  <section class="consumer-hero">
    <div>
      <p class="eyebrow">ArgFit UI Beta+</p>
      <h1>Consumer smoke and visual QA</h1>
      <p class="hero-copy">
        Representative Beta+ families rendered only through public ArgFit imports.
      </p>
    </div>

    <div class="control-group" data-qa="environment-controls">
      <div class="control-row">
        <span class="control-label">Platform</span>
        <button type="button" data-qa="platform-auto" (click)="useAuto()">Auto</button>
        <button type="button" data-qa="platform-desktop" (click)="useDesktop()">Desktop</button>
        <button type="button" data-qa="platform-mobile" (click)="useMobile()">Mobile</button>
      </div>

      <div class="control-row">
        <span class="control-label">Theme</span>
        <button type="button" data-qa="theme-dark" (click)="applyDarkTheme()">Dark</button>
        <button type="button" data-qa="theme-light" (click)="applyLightTheme()">Light</button>
      </div>

      <div class="control-row control-row--status">
        <span>Platform: <strong>{{ resolvedPlatform() }}</strong></span>
        <span>Theme: <strong>{{ currentThemeKind() }}</strong></span>
      </div>
    </div>
  </section>

  <section class="section-grid">
    <af-card variant="panel" tone="primary" data-qa="status-identity">
      <header afCardHeader>
        <p class="section-kicker">Wave 1</p>
        <h2 afCardTitle>Status and identity</h2>
      </header>

      <div afCardContent class="surface-stack">
        <div class="identity-row">
          <af-avatar label="Maria Garcia" imageAlt="Maria Garcia" tone="accent" size="lg" shape="rounded" ariaLabel="Athlete avatar" />
          <af-chip tone="success" variant="outline" size="md" icon="bluetooth">Athlete ready</af-chip>
          <af-progress variant="bar" tone="success" size="lg" [value]="72" ariaLabel="Workload progress" skeletonWidth="64px" />
        </div>
      </div>
    </af-card>

    <af-card variant="panel" tone="primary" data-qa="overlays">
      <header afCardHeader>
        <p class="section-kicker">Wave 1</p>
        <h2 afCardTitle>Overlay surfaces</h2>
      </header>

      <div afCardContent class="surface-stack">
        <div class="overlay-actions">
          <button type="button" data-qa="popover-toggle" (click)="togglePopover()">Toggle popover</button>
          <button type="button" data-qa="drawer-open" (click)="openDrawer()">Open drawer</button>
        </div>

        <div class="overlay-grid">
          <div data-qa="tooltip-control">
            <af-tooltip [open]="true" text="More details for coaches" placement="bottom" tone="primary">
              <button type="button">Info</button>
            </af-tooltip>
          </div>

          <div data-qa="popover-control">
            <af-popover [open]="popoverOpen()" title="Performance details" placement="right" (openChange)="setPopoverOpen($event)">
              <ng-template afPopoverTrigger>
                <button type="button">Open popover</button>
              </ng-template>
              <ng-template afPopoverContent>
                <div class="overlay-copy">Popover body</div>
              </ng-template>
            </af-popover>
          </div>

          <af-drawer
            [open]="drawerOpen()"
            title="Overlay filters"
            description="Side panel for advanced filters"
            placement="end"
            size="md"
            (openChange)="setDrawerOpen($event)"
          >
            <div class="surface-stack">
              <p class="overlay-copy">Filter body</p>
              <button type="button" (click)="closeDrawer()">Close drawer</button>
            </div>
          </af-drawer>
        </div>
      </div>
    </af-card>
  </section>

  <af-card variant="panel" tone="primary" data-qa="forms">
    <header afCardHeader>
      <p class="section-kicker">Wave 2</p>
      <h2 afCardTitle>Advanced forms and selection</h2>
    </header>

    <div afCardContent class="form-grid">
      <div data-qa="input-count-control">
        <af-input-count
          label="Edad"
          unit="anos"
          [min]="10"
          [max]="60"
          [step]="2"
          helperText="Control numerico"
          [formControl]="athleteAge"
        />
      </div>

      <div data-qa="multi-select-control">
        <af-multi-select
          label="Tipos de test"
          placeholder="Selecciona tipos"
          [options]="multiSelectOptions"
          optionLabel="label"
          optionValue="value"
          [searchable]="true"
          [clearable]="true"
          [maxSelected]="2"
          helperText="Elige hasta dos tipos"
          [formControl]="selectedTests"
        />
      </div>

      <div data-qa="date-picker-control">
        <af-date-picker
          label="Fecha de sesion"
          helperText="Fecha operativa del microciclo"
          min="2026-01-01"
          max="2026-12-31"
          [formControl]="sessionDate"
        />
      </div>

      <div data-qa="listbox-control">
        <af-listbox
          label="Tests visibles"
          helperText="Seleccion multiple para el dashboard"
          selectionMode="multiple"
          [options]="listboxOptions"
          [formControl]="visibleTests"
        />
      </div>
    </div>
  </af-card>

  <section class="section-grid" data-qa="data">
    <af-card variant="panel" tone="primary">
      <header afCardHeader>
        <p class="section-kicker">Wave 3</p>
        <h2 afCardTitle>Data views</h2>
      </header>

      <div afCardContent class="surface-stack">
        <div data-qa="data-view-control">
          <af-data-view [items]="dataViewItems()" [layout]="'grid'" emptyDescription="Carga un grupo para comenzar" ariaLabel="Performance data view" (itemPressed)="handleDataItemPressed($event)">
            <div afDataViewActions class="inline-slot">Toolbar</div>
            <ng-template afDataViewItem let-item>
              <article class="surface-item-template">
                <strong>{{ item.title }}</strong>
                <span>{{ item.meta }}</span>
              </article>
            </ng-template>
          </af-data-view>
        </div>

        <div data-qa="timeline-control">
          <af-timeline [items]="timelineItems()" emptyDescription="Aun no hay hitos para este atleta" ariaLabel="Performance timeline" (itemPressed)="handleTimelineItemPressed($event)">
            <div afTimelineActions class="inline-slot">Acciones timeline</div>
            <ng-template afTimelineItem let-item>
              <article class="surface-item-template">
                <strong>{{ item.title }}</strong>
                <span>{{ item.timestamp }}</span>
              </article>
            </ng-template>
          </af-timeline>
        </div>

        <div data-qa="tree-control">
          <af-tree
            [nodes]="treeNodes()"
            [selectedIds]="treeSelectedIds()"
            [expandedIds]="treeExpandedIds()"
            selectionMode="single"
            emptyDescription="Carga una estructura para empezar"
            ariaLabel="Squad structure"
            (selectionChange)="setTreeSelection($event)"
            (expandedChange)="setTreeExpanded($event)"
            (nodePressed)="handleTreePressed($event)"
          >
            <div afTreeActions class="inline-slot">Acciones tree</div>
            <ng-template afTreeNode let-node>
              <article class="surface-item-template">
                <strong>{{ node.label }}</strong>
                <span>{{ node.meta }}</span>
              </article>
            </ng-template>
          </af-tree>
        </div>
      </div>
    </af-card>

    <af-card variant="panel" tone="primary" data-qa="layout">
      <header afCardHeader>
        <p class="section-kicker">Wave 4</p>
        <h2 afCardTitle>Panel and layout surfaces</h2>
      </header>

      <div afCardContent class="surface-stack">
        <div data-qa="tabs-control">
          <af-tabs [items]="tabItems()" [activeId]="activeTabId()" ariaLabel="Athlete tabs" (activeIdChange)="setActiveTab($event)">
            <ng-template afTabPanel="profile" let-item>
              <article class="surface-item-template">Panel {{ item.label }}</article>
            </ng-template>

            <ng-template afTabPanel="readiness" let-item>
              <article class="surface-item-template">Panel {{ item.label }}</article>
            </ng-template>
          </af-tabs>
        </div>

        <div data-qa="stepper-control">
          <af-stepper [steps]="steps()" [activeId]="activeStepId()" ariaLabel="Evaluation flow" (activeIdChange)="setActiveStep($event)">
            <ng-template afStepPanel="setup" let-step>
              <article class="surface-item-template">{{ step.label }} complete</article>
            </ng-template>

            <ng-template afStepPanel="capture" let-step>
              <article class="surface-item-template">{{ step.label }} active</article>
            </ng-template>

            <ng-template afStepPanel="review" let-step>
              <article class="surface-item-template">{{ step.label }} optional</article>
            </ng-template>
          </af-stepper>
        </div>

        <div data-qa="splitter-control">
          <af-splitter
            primaryLabel="Training queue"
            secondaryLabel="Coach notes"
            orientation="horizontal"
            [primarySize]="splitterPrimarySize()"
            [minPrimarySize]="30"
            [minSecondarySize]="25"
            ariaLabel="Training workspace"
            (primarySizeChange)="setPrimarySize($event)"
          >
            <ng-template afSplitterPrimary>
              <article class="surface-item-template">Queue panel</article>
            </ng-template>

            <ng-template afSplitterSecondary>
              <article class="surface-item-template">Notes panel</article>
            </ng-template>
          </af-splitter>
        </div>
      </div>
    </af-card>
  </section>

  <af-card variant="panel" tone="primary" data-qa="workflow">
    <header afCardHeader>
      <p class="section-kicker">Wave 5</p>
      <h2 afCardTitle>Workflow Beta+: AfKanban</h2>
    </header>

    <div afCardContent>
      <div data-qa="kanban-board">
        <af-kanban
          [columns]="kanbanColumns"
          [cards]="kanbanCards()"
          [filters]="kanbanFilters"
          [activeFilter]="activeKanbanFilter()"
          title="Workflow"
          ariaLabel="Workflow board"
          (cardMove)="handleKanbanMove($event)"
          (cardClick)="handleKanbanClick($event)"
          (addCard)="handleKanbanAdd($event)"
          (filterChange)="handleKanbanFilterChange($event)"
          (columnAction)="handleKanbanColumnAction($event)"
        />
      </div>
    </div>
  </af-card>
</main>
`;
}

function createAppStylesSource() {
  return `:host {
  display: block;
}

.consumer-shell {
  display: grid;
  gap: 1.5rem;
  margin: 0 auto;
  max-width: 1280px;
  padding: 2rem;
}

.consumer-hero,
.section-grid {
  display: grid;
  gap: 1.25rem;
}

.section-grid {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.eyebrow,
.section-kicker,
.control-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0;
  opacity: 0.72;
  text-transform: uppercase;
}

h1,
h2 {
  margin: 0;
}

.hero-copy {
  margin: 0.5rem 0 0;
  max-width: 56ch;
  opacity: 0.82;
}

.control-group,
.surface-stack,
.form-grid {
  display: grid;
  gap: 1rem;
}

.control-row,
.identity-row,
.overlay-actions,
.overlay-grid,
.inline-slot {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.control-row button,
.overlay-actions button,
.overlay-grid button {
  background: color-mix(in srgb, Canvas 90%, CanvasText 10%);
  border: 1px solid color-mix(in srgb, CanvasText 18%, Canvas 82%);
  border-radius: 999px;
  color: inherit;
  cursor: pointer;
  font: inherit;
  padding: 0.55rem 0.9rem;
}

.control-row--status {
  font-size: 0.9rem;
  opacity: 0.82;
}

.identity-row {
  align-items: stretch;
}

.form-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.surface-item-template {
  display: grid;
  gap: 0.25rem;
}

.surface-item-template span,
.overlay-copy {
  font-size: 0.9rem;
  opacity: 0.8;
}

[data-qa='workflow'] af-kanban,
[data-qa='data'] af-data-view,
[data-qa='data'] af-timeline,
[data-qa='data'] af-tree,
[data-qa='layout'] af-tabs,
[data-qa='layout'] af-stepper,
[data-qa='layout'] af-splitter {
  display: block;
}

@media (max-width: 720px) {
  .consumer-shell {
    padding: 1rem;
  }

  .identity-row,
  .overlay-grid,
  .control-row {
    align-items: stretch;
    flex-direction: column;
  }
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
  return `${packageName.replace('@', '').replace('/', '-')}-${BETA_PLUS_VERSION}.tgz`;
}