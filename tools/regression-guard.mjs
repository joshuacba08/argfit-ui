import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const workspaceRoot = process.cwd();
const failures = [];

const expectedFiles = [
  'projects/argfit-ui-core/src/lib/types/feedback.types.ts',
  'projects/argfit-ui-core/src/lib/services/toast.service.ts',
  'projects/argfit-ui-core/src/lib/services/toast.service.spec.ts',
  'projects/argfit-ui-adaptive/src/lib/components/inline-message/af-inline-message.component.ts',
  'projects/argfit-ui-adaptive/src/lib/components/toast/af-toast.component.ts',
  'projects/argfit-ui-adaptive/src/lib/components/toast-viewport/af-toast-viewport.component.ts',
  'projects/argfit-ui-desktop/src/lib/components/inline-message/af-inline-message-desktop.component.ts',
  'projects/argfit-ui-desktop/src/lib/components/toast/af-toast-desktop.component.ts',
  'projects/argfit-ui-desktop/src/lib/components/toast-viewport/af-toast-viewport-desktop.component.ts',
  'projects/argfit-ui-mobile/src/lib/components/inline-message/af-inline-message-mobile.component.ts',
  'projects/argfit-ui-mobile/src/lib/components/toast/af-toast-mobile.component.ts',
  'projects/argfit-ui-mobile/src/lib/components/toast-viewport/af-toast-viewport-mobile.component.ts',
  'projects/argfit-ui-adaptive/src/lib/components/password/af-password.component.ts',
  'projects/argfit-ui-desktop/src/lib/components/password/af-password-desktop.component.ts',
  'projects/argfit-ui-mobile/src/lib/components/password/af-password-mobile.component.ts',
  'docs/alpha/quickstart.md',
  'docs/alpha/theming.md',
  'docs/alpha/components.md',
  'docs/alpha/known-limitations.md',
  'docs/alpha/release-notes-alpha.md',
  'docs/alpha/release-checklist.md',
  'docs/beta/release-notes-beta.md',
  'docs/beta/release-checklist.md',
  'docs/productive/projection.md',
  'docs/productive/scope.md',
  'docs/productive/public-api.md',
  'docs/productive/semver-policy.md',
  'docs/productive/quality-gates.md',
  'docs/productive/enterprise-readiness.md',
  'docs/productive/release-operations.md',
  'docs/productive/support-policy.md',
  'docs/productive/release-checklist.md',
  'docs/productive/quickstart.md',
  'docs/productive/components.md',
  'docs/productive/api-reference.md',
  'docs/productive/accessibility.md',
  'docs/productive/theming.md',
  'docs/productive/migration-beta-to-1-0.md',
  'docs/productive/release-notes-1-0.md',
  'docs/productive/release-notes-1.0.0.md',
  'docs/productive/release-notes-1.1.0.md',
  'docs/productive/release-notes-1.3.0.md',
  'docs/productive/release-notes-1.3.3.md',
  'projects/argfit-ui-docs/src/main.ts',
  'projects/argfit-ui-docs/src/index.html',
  'projects/argfit-ui-docs/src/styles.css',
  'projects/argfit-ui-docs/src/app/app.config.ts',
  'projects/argfit-ui-docs/src/app/app.routes.ts',
  'projects/argfit-ui-docs/src/app/docs-data.ts',
  'projects/argfit-ui-docs/src/app/app.ts',
  'projects/argfit-ui-docs/src/app/docs-layout.component.ts',
  'projects/argfit-ui-docs/src/app/app.html',
  'projects/argfit-ui-docs/src/app/app.scss',
  'projects/argfit-ui-docs/src/app/pages/home-landing.page.ts',
  'projects/argfit-ui-docs/src/app/pages/home-landing.page.html',
  'projects/argfit-ui-docs/src/app/pages/home-landing.page.scss',
  'projects/argfit-ui-docs/src/app/pages/docs-overview.page.ts',
  'projects/argfit-ui-docs/src/app/pages/docs-components.page.ts',
  'projects/argfit-ui-docs/src/app/pages/docs-api.page.ts',
  'projects/argfit-ui-docs/src/app/pages/docs-component-detail.page.ts',
  'projects/argfit-ui-docs/src/app/pages/docs-api-detail.page.ts',
  'projects/argfit-ui-docs/src/app/pages/docs-guides.page.ts',
  'projects/argfit-ui-docs/src/app/pages/docs-release.page.ts',
  'projects/argfit-ui-docs/src/app/pages/docs-search.page.ts',
  'tools/alpha-smoke.mjs',
  'tools/beta-smoke.mjs',
  'tools/pack-beta.mjs',
  'tools/production-performance.mjs',
  'tools/production-smoke.mjs',
  'tools/pack-production.mjs',
  '.github/workflows/ci.yml',
  '.github/workflows/publish-production.yml',
  '.github/workflows/publish-alpha.yml',
  '.github/workflows/publish-beta.yml',
  'CHANGELOG.md',
  'LICENSE',
];

for (const filePath of expectedFiles) {
  expectFile(filePath);
}

expectIncludes('projects/argfit-ui-core/src/public-api.ts', [
  './lib/services/toast.service',
  './lib/types/feedback.types',
]);
expectIncludes('projects/argfit-ui-adaptive/src/public-api.ts', [
  'AfInlineMessageComponent as AfInlineMessage',
  'AfToastComponent as AfToast',
  'AfToastViewportComponent as AfToastViewport',
  'AfPasswordComponent as AfPassword',
]);
expectIncludes('projects/argfit-ui-desktop/src/public-api.ts', [
  './lib/components/inline-message/af-inline-message-desktop.component',
  './lib/components/password/af-password-desktop.component',
  './lib/components/toast/af-toast-desktop.component',
  './lib/components/toast-viewport/af-toast-viewport-desktop.component',
]);
expectIncludes('projects/argfit-ui-mobile/src/public-api.ts', [
  './lib/components/inline-message/af-inline-message-mobile.component',
  './lib/components/password/af-password-mobile.component',
  './lib/components/toast/af-toast-mobile.component',
  './lib/components/toast-viewport/af-toast-viewport-mobile.component',
]);

expectIncludes('projects/argfit-ui-desktop/src/lib/components/password/af-password-desktop.component.ts', [
  "import { PasswordDirective } from 'primeng/password';",
  'readonly revealLabel = input',
  'readonly hideLabel = input',
  'protected readonly passwordVisible = signal(false)',
]);
expectIncludes('projects/argfit-ui-mobile/src/lib/components/password/af-password-mobile.component.ts', [
  "import { IonInput } from '@ionic/angular/standalone';",
  'AF_IONIC_PASSWORD_ELEMENTS',
  'CUSTOM_ELEMENTS_SCHEMA',
  'protected readonly passwordVisible = signal(false)',
  'toggleVisibility()',
]);
expectIncludes('projects/argfit-ui-mobile/src/lib/components/password/af-password-mobile.component.html', [
  'ion-input-password-toggle',
  'showIcon="eye"',
  'hideIcon="eye-off"',
  '[type]="inputType()"',
]);
expectIncludes('projects/argfit-ui-adaptive/src/lib/components/password/af-password.component.ts', [
  'ControlValueAccessor',
  'AfPasswordDesktopComponent',
  'AfPasswordMobileComponent',
]);
expectIncludes('projects/argfit-ui-primitives/src/lib/icon/af-icon.component.ts', [
  'LucideEye',
  'LucideEyeOff',
]);

expectIncludes('projects/argfit-ui-core/src/lib/types/feedback.types.ts', [
  'AfFeedbackSeverity',
  'AfToastPlacement',
  'AfToastOptions',
  'AfToast',
]);
expectIncludes('projects/argfit-ui-core/src/lib/services/toast.service.ts', [
  'signal<readonly AfToast[]>',
  'success(options:',
  'info(options:',
  'warning(options:',
  'danger(options:',
  'duration === 0',
  'dismiss(id:',
]);

expectIncludes('projects/argfit-ui-core/src/lib/types/chart.types.ts', [
  "| 'gauge'",
  "| 'radar'",
  "| 'heatmap'",
  "| 'boxplot'",
  "| 'parallel'",
  'AfChartValue = number | readonly number[]',
  'interface AfChartIndicator',
  'readonly point?: AfChartPoint',
]);
expectIncludes('projects/argfit-ui-adaptive/src/lib/components/chart/af-chart.component.ts', [
  '[indicators]="indicators()"',
  '[height]="height()"',
  '[legend]="legend()"',
  '[showGrid]="showGrid()"',
  '[interactive]="interactive()"',
  'readonly indicators = input<readonly AfChartIndicator[]>([])',
  'readonly height = input<number | undefined>(undefined)',
  'readonly legend = input(true',
]);
for (const chartFile of [
  'projects/argfit-ui-desktop/src/lib/components/chart/af-chart-desktop.component.ts',
  'projects/argfit-ui-mobile/src/lib/components/chart/af-chart-mobile.component.ts',
]) {
  expectIncludes(chartFile, [
    'readonly indicators = input<readonly AfChartIndicator[]>([])',
    'readonly height = input<number | undefined>(undefined)',
    'readonly legend = input(true',
    'readonly showGrid = input(true',
    'readonly interactive = input(true',
    'resolvedHeight',
    'ResizeObserver',
    'point:',
  ]);
}

const showcaseTemplate = readFile('projects/showcase/src/app/app.html');
expectContains(showcaseTemplate, 'projects/showcase/src/app/app.html', [
  "@case ('analytics')",
  'analytics-card--wide',
  'Sin datos de analytics',
  'type="gauge"',
  'type="radar"',
  'type="stacked-bar"',
  'type="heatmap"',
  'type="donut"',
  'type="boxplot"',
  'type="parallel"',
]);

const chartUsageCount = countOccurrences(showcaseTemplate, '<af-chart');
if (chartUsageCount < 8) {
  failures.push(
    `projects/showcase/src/app/app.html: expected at least 8 af-chart usages, found ${chartUsageCount}`,
  );
}

expectIncludes('projects/showcase/src/app/app.spec.ts', [
  'renders the AfAnalyticsCard showcase with charts, slots and states',
  "expect(chartTypes).toContain('gauge')",
  "expect(chartTypes).toContain('donut')",
  "expect(chartTypes).toContain('heatmap')",
  "expect(chartTypes).toContain('boxplot')",
  "expect(chartTypes).toContain('parallel')",
  'renders the AfChart vertical slice with empty and ready states',
]);

expectIncludes('projects/argfit-ui-mobile/src/lib/components/select/af-select-mobile.component.scss', [
  '--ion-color-step-850: var(--af-text-main);',
  '--ion-text-color-step-150: var(--af-text-main);',
  "ion-alert.af-select-mobile__overlay .alert-radio-button[aria-checked='true'] .alert-radio-label",
]);

expectIncludes('projects/argfit-ui-desktop/src/lib/components/select/af-select-desktop.component.scss', [
  "[data-pc-section='label']",
  "[data-pc-section='dropdown']",
  "[data-pc-section='option']",
  'margin-inline-start: auto;',
]);

expectIncludes('projects/argfit-ui-desktop/src/lib/components/topbar/af-topbar-desktop.component.scss', [
  '.af-topbar-desktop__search input',
  'appearance: none;',
  'box-shadow: none;',
  '::-webkit-search-cancel-button',
]);

expectIncludes('projects/showcase/src/app/app.ts', [
  "{ id: 'alpha', label: 'Beta+', icon: 'info' }",
  'AfToastService',
  'AfToastViewport',
  'AfInlineMessage',
  "{ id: 'feedback', label: 'Feedback', icon: 'bell' }",
  'showFeedbackToast(severity: AfFeedbackSeverity)',
]);

expectIncludes('projects/showcase/src/app/app.html', [
  "@case ('alpha')",
  'Beta+ consumer kit',
  'Instalacion Beta+ publicable',
  '0.2.0-beta.0',
  'docs/beta-plus/quickstart.md',
  'docs/beta-plus/components.md',
  'docs/beta-plus/release-notes-beta-plus.md',
  '<af-toast-viewport />',
  "@case ('feedback')",
  '<af-inline-message',
  "showFeedbackToast('success')",
  "showFeedbackToast('danger')",
]);

expectIncludes('projects/showcase/src/app/app.ts', [
  'AfPassword',
  'portalPassword',
  'temporaryPassword',
]);

expectIncludes('projects/showcase/src/app/app.html', [
  '<af-password',
  'label="Clave del portal"',
  'label="Clave temporal"',
  'formControlName="portalPassword"',
  'formControlName="temporaryPassword"',
]);

expectIncludes('projects/showcase/src/app/app.spec.ts', [
  'renders the current beta plus showcase section inside the legacy alpha slot',
  'Beta+ consumer kit',
  'af-password-desktop',
  'af-password-mobile',
  'ion-input-password-toggle',
]);

expectIncludes('README.md', [
  'Beta quickstart',
  'Beta components',
  'Beta release notes',
  'Beta release checklist',
  'pnpm release:beta:check',
  'Productive quickstart',
  'Productive components',
  'Productive API reference',
  'Productive accessibility',
  'Productive theming',
  'Migration beta/Beta+ to 1.0',
  'Productive release notes',
  'Productive release checklist',
  'Productive release operations',
  'Productive support policy',
  'argfit-ui-docs',
  'pnpm start:docs',
]);

expectIncludes('docs/productive/projection.md', [
  'ArgFit UI - Productive Version Projection',
  'docs/productive/scope.md',
  'docs/productive/public-api.md',
  'docs/productive/semver-policy.md',
  'docs/productive/quality-gates.md',
  'docs/productive/enterprise-readiness.md',
  'docs/productive/release-operations.md',
  'docs/productive/support-policy.md',
  'HU-039 - Productive Quality Gates',
]);

expectIncludes('docs/productive/scope.md', [
  'ArgFit UI 1.3.3 Scope',
  '`1.0-foundation`',
  '`1.0-adaptive`',
  '`1.0-renderer-specific`',
  'out-of-1.0',
]);

expectIncludes('docs/productive/public-api.md', [
  'Productive Public API Inventory',
  'projects/argfit-ui-core/src/public-api.ts',
  'projects/argfit-ui-adaptive/src/public-api.ts',
  '1.0-adaptive',
  '1.0-renderer-specific',
]);

expectIncludes('docs/productive/semver-policy.md', [
  'Productive Semver Policy',
  'Patch releases (`1.0.x`)',
  'Minor releases (`1.x.0`)',
  'Major releases (`2.0.0`, `3.0.0`, and so on)',
  'Deprecation Policy',
  'Migration Policy',
]);

expectIncludes('docs/productive/quality-gates.md', [
  'Productive Quality Gates',
  'pnpm release:production:check',
  'No active budget exceptions.',
  '2.90 MB',
  '650 kB',
  'Production tarball total',
]);

expectIncludes('docs/productive/release-operations.md', [
  'Productive Release Operations',
  'Branch And Tag Strategy',
  'npm Publish Process',
  'Patch Release Procedure',
  'Changelog Policy',
  'release-checklist.md',
  'publish-production.yml',
  'NPM_TOKEN',
  'latest',
]);

expectIncludes('docs/productive/release-checklist.md', [
  'Production Release Checklist',
  '1.3.3',
  'pnpm release:production:check',
  'v1.3.3',
  'latest',
  'dist/production-tarballs/',
]);

expectIncludes('docs/productive/support-policy.md', [
  'Productive Support Policy',
  'Support Window',
  'Security And Dependency Update Policy',
  'Deprecation Process',
  '1.x',
]);

expectIncludes('docs/productive/enterprise-readiness.md', [
  'Productive Enterprise Readiness',
  'Data Table Production Profile',
  'Forms Production Profile',
  'Overlay And Feedback Orchestration',
  'Chart Production Profile',
  'server-side pagination',
  'single app-level overlay posture',
]);

expectIncludes('docs/productive/quickstart.md', [
  'Productive Quickstart',
  'pnpm release:production:check',
  '@argfit-ui/adaptive',
  '1.3.3',
  './release-notes-1.3.3.md',
]);

expectIncludes('docs/productive/components.md', [
  'Productive Components',
  'AfButton',
  'AfDataTable',
  'AfKanban',
  'AfTabs',
]);

expectIncludes('docs/productive/api-reference.md', [
  'Productive API Reference',
  '@argfit-ui/core',
  '@argfit-ui/adaptive',
  'Slot Directive Families',
]);

expectIncludes('docs/productive/accessibility.md', [
  'Productive Accessibility',
  'Focus Management Rules',
  'Keyboard Rules',
  'WCAG AA',
]);

expectIncludes('docs/productive/theming.md', [
  'Productive Theming And Adaptive Rendering',
  'ARGFIT_DARK_THEME',
  'AfThemeService',
  'AfPlatformService',
]);

expectIncludes('docs/productive/migration-beta-to-1-0.md', [
  'Migration Beta And Beta+ To 1.0',
  'What Changes At 1.0',
  'What Does Not Enter 1.0',
  '@argfit-ui/adaptive',
]);

expectIncludes('docs/productive/release-notes-1-0.md', [
  'Release Notes: 1.0.0 Target Archive',
  'pnpm release:production:check',
  'Productive quickstart',
  '1.0.0',
]);

expectIncludes('docs/productive/release-notes-1.0.0.md', [
  'Release Notes: 1.0.0',
  'latest',
  'pnpm release:production:check',
  'dist/production-tarballs/',
]);

expectIncludes('angular.json', [
  '"argfit-ui-docs"',
  'projects/argfit-ui-docs/src/main.ts',
  'argfit-ui-docs:build:production',
]);

expectIncludes('projects/argfit-ui-docs/src/app/app.html', [
  'ArgFit UI Docs',
  'Productive 1.0 platform',
  'Search docs',
  'Component navigation',
  'Browse full catalog',
]);

expectIncludes('projects/argfit-ui-docs/src/app/app.routes.ts', [
  'home-landing.page',
  'docs-layout.component',
  "path: 'search'",
  "path: 'components/:slug'",
  "path: 'api/:slug'",
  'loadComponent',
]);

expectIncludes('projects/argfit-ui-docs/src/app/pages/home-landing.page.html', [
  'Adaptive Angular documentation',
  'Framework attributes',
  'Enter documentation',
  'Desktop control tower',
  'Workflow panel',
  'Mobile sheet',
]);

expectIncludes('projects/argfit-ui-docs/src/app/pages/home-landing.page.ts', [
  'HomeLandingPageComponent',
  'Adaptive contract',
  'AfPageShell',
  'release:production:check',
  'proofMetrics',
  'workflowColumns',
  'architectureSteps',
]);

expectIncludes('projects/argfit-ui-docs/src/app/pages/docs-components.page.ts', [
  'Stable component catalog',
  'Components',
  'Browse the catalog',
  'Component index',
  'selectComponent',
]);

expectIncludes('projects/argfit-ui-docs/src/app/pages/docs-api.page.ts', [
  'API Reference',
  'PRODUCTIVE_PACKAGE_GUIDES',
  '@argfit-ui/adaptive',
  'Open package page',
]);

expectIncludes('projects/argfit-ui-docs/src/app/pages/docs-component-detail.page.ts', [
  'Component detail',
  'Related components',
  'Back to components',
]);

expectIncludes('projects/argfit-ui-docs/src/app/pages/docs-api-detail.page.ts', [
  'Package detail',
  'What belongs here',
  'Back to API index',
]);

expectIncludes('projects/argfit-ui-docs/src/app/pages/docs-search.page.ts', [
  'Smart search',
  'Find components, APIs and patterns',
  'Search the contract by component name',
  'docs-search-result-card',
]);

expectIncludes('projects/argfit-ui-docs/src/app/docs-data.ts', [
  '@argfit-ui/core',
  '@argfit-ui/adaptive',
  'PRODUCTIVE_COMPONENT_DOCS',
  'docs/productive/release-checklist.md',
  'docs/productive/release-notes-1.3.3.md',
  'docs/productive/release-operations.md',
  'docs/productive/support-policy.md',
  'searchDocs',
]);

expectIncludes('projects/argfit-ui-docs/src/app/pages/docs-guides.page.ts', [
  'Guides',
  'Migration posture',
  'docs/productive/migration-beta-to-1-0.md',
]);

expectIncludes('projects/argfit-ui-docs/src/app/pages/docs-release.page.ts', [
  'Release',
  'release:production:check',
  'PRODUCTIVE_RELEASE_ASSETS',
  'The docs app is now its own Angular project.',
]);

expectIncludes('package.json', [
  '"version": "1.3.3"',
  '"start:docs"',
  '"build:docs"',
  'ng serve argfit-ui-docs --port 4300',
  'ng build argfit-ui-docs',
  '"release:beta:check"',
  '"release:production:check"',
  '"smoke:beta"',
  '"smoke:production:dist"',
  '"pack:production:dist"',
  '"pack:beta:dry-run:dist"',
  '"measure:production-performance:dist"',
]);

for (const packageManifest of [
  'projects/argfit-ui-core/package.json',
  'projects/argfit-ui-primitives/package.json',
  'projects/argfit-ui-desktop/package.json',
  'projects/argfit-ui-mobile/package.json',
  'projects/argfit-ui-adaptive/package.json',
]) {
  expectIncludes(packageManifest, [
    '"version": "1.3.3"',
    '"access": "public"',
    '"tag": "latest"',
  ]);
}

for (const packageManifest of [
  'projects/argfit-ui-primitives/package.json',
  'projects/argfit-ui-desktop/package.json',
  'projects/argfit-ui-mobile/package.json',
  'projects/argfit-ui-adaptive/package.json',
]) {
  expectIncludes(packageManifest, ['"@argfit-ui/core": "1.3.3"']);
}

expectIncludes('.github/workflows/ci.yml', [
  'name: CI',
  'pull_request:',
  'push:',
  'pnpm install --frozen-lockfile',
  'pnpm release:production:check',
  'actions/upload-artifact@v4',
  'dist/production-tarballs/*.tgz',
  '.tmp/visual-regression/beta-plus/*.png',
]);

expectIncludes('.github/workflows/publish-production.yml', [
  'name: Publish Production',
  'workflow_dispatch:',
  "- 'v1.*.*'",
  'NPM_TOKEN',
  'NODE_AUTH_TOKEN',
  'pnpm release:production:check',
  'pnpm build:libs',
  '--tag latest',
  '--access public',
]);

expectIncludes('.github/workflows/publish-alpha.yml', [
  'name: Publish Alpha',
  'workflow_dispatch:',
  "- 'v*-alpha.*'",
  'NPM_TOKEN',
  'NODE_AUTH_TOKEN',
  'pnpm release:alpha:check',
  '--access public',
]);

expectIncludes('.github/workflows/publish-beta.yml', [
  'name: Publish Beta',
  'workflow_dispatch:',
  "- 'v*-beta.*'",
  'NPM_TOKEN',
  'NODE_AUTH_TOKEN',
  'pnpm release:beta:check',
  '--tag beta',
  '--access public',
]);

expectIncludes('tools/alpha-smoke.mjs', [
  '.tmp',
  'alpha-smoke',
  'dist/argfit-ui-core',
  'dist/argfit-ui-adaptive',
  'dist/alpha-tarballs',
  'publish-alpha.yml',
  '@argfit-ui/adaptive',
  'ts.createProgram',
]);

expectIncludes('tools/beta-smoke.mjs', [
  '.tmp',
  'beta-smoke',
  'dist/argfit-ui-core',
  'dist/argfit-ui-adaptive',
  'dist/beta-tarballs',
  'publish-beta.yml',
  '@argfit-ui/adaptive',
  'ts.createProgram',
]);

expectIncludes('tools/pack-beta-plus.mjs', [
  "const BETA_PLUS_VERSION = '0.2.0-beta.0';",
  "tag: 'beta'",
  'rewriteReadmeVersion',
]);

expectIncludes('tools/pack-production.mjs', [
  "const PRODUCTION_VERSION = '1.3.3';",
  'dist',
  'production-tarballs',
  "tag: 'latest'",
  'must not use a prerelease version',
]);

expectIncludes('tools/production-performance.mjs', [
  'dist',
  'production-tarballs',
  'production tarball total',
]);

expectIncludes('tools/production-smoke.mjs', [
  "const PRODUCTION_VERSION = '1.3.3';",
  'dist',
  'production-tarballs',
  'publishConfig.tag must be latest',
  'release-notes-1.3.3.md',
]);

expectIncludes('docs/alpha/release-checklist.md', [
  'pnpm release:alpha:check',
  'v0.1.0-alpha.0',
  '--tag alpha',
  '--access public',
  'dist/alpha-tarballs/',
]);

expectIncludes('docs/beta/release-checklist.md', [
  'pnpm release:beta:check',
  'v0.1.0-beta.0',
  '--tag beta',
  '--access public',
  'dist/beta-tarballs/',
]);

expectIncludes('CHANGELOG.md', [
  '1.3.3',
  'latest dist-tag',
  'pnpm release:production:check',
  '0.1.0-beta.0',
  '@argfit-ui/adaptive',
  'publish-beta.yml',
  'beta dist-tag',
]);

expectIncludes('LICENSE', [
  'MIT License',
  'Permission is hereby granted, free of charge',
]);

expectIncludes('.gitignore', [
  '/.tmp',
  '*.tgz',
]);

expectIncludes('docs/alpha/quickstart.md', [
  'pnpm add @argfit-ui/core@0.1.0-alpha.0',
  'provideArgfitUi',
  '@argfit-ui/adaptive',
  'Troubleshooting',
]);

expectIncludes('docs/alpha/components.md', [
  'Stable For Alpha',
  'Experimental In Alpha',
  'AfPageShell',
  'Vendor Boundary',
]);

for (const packageReadme of [
  'projects/argfit-ui-core/README.md',
  'projects/argfit-ui-primitives/README.md',
  'projects/argfit-ui-desktop/README.md',
  'projects/argfit-ui-mobile/README.md',
  'projects/argfit-ui-adaptive/README.md',
]) {
  expectIncludes(packageReadme, [
    '1.3.3',
    '## Install',
    '## Productive Docs',
    'docs/productive/release-notes-1.3.3.md',
  ]);
}

expectNotIncludes('projects/argfit-ui-desktop/src/lib/components/toast/af-toast-desktop.component.scss', [
  'border-left:',
]);
expectNotIncludes('projects/argfit-ui-mobile/src/lib/components/toast/af-toast-mobile.component.scss', [
  'border-left:',
]);
expectNotIncludes('projects/argfit-ui-desktop/src/lib/components/card/af-card-desktop.component.scss', [
  'inset 3px 0 0 0',
  'left rail',
]);
expectNotIncludes('projects/argfit-ui-desktop/src/lib/components/dialog/af-dialog-desktop.component.scss', [
  'inset 3px 0 0 0',
]);
expectNotIncludes('projects/argfit-ui-mobile/src/lib/components/dialog/af-dialog-mobile.component.scss', [
  'inset 0 3px 0 0',
]);

expectIncludes('projects/argfit-ui-core/src/lib/types/dialog.types.ts', [
  "'neutral' | 'info' | 'success' | 'danger'",
]);

expectIncludes('projects/argfit-ui-desktop/src/lib/components/dialog/af-dialog-desktop.component.html', [
  'af-dialog-desktop__tone-icon',
  'toneIconName()',
  'af-dialog-desktop__description--body',
]);
expectIncludes('projects/argfit-ui-desktop/src/lib/components/dialog/af-dialog-desktop.component.scss', [
  "[data-tone='info']",
  "[data-tone='success']",
  'height: 100dvh;',
  'width: 100vw;',
  '.af-dialog-desktop__tone-icon',
  '.af-dialog-desktop__description--body',
  "[data-tone='danger'] .af-dialog__footer .af-button-desktop--danger",
]);
expectIncludes('projects/showcase/src/app/app.html', [
  'title="Detalles del dispositivo"',
  'title="Sesion completada"',
  'title="Nuevo test rapido"',
  'title="Eliminar atleta"',
  'tone="info"',
  'tone="success"',
  'Esta accion no se puede deshacer.',
  '>Eliminar</af-button>',
]);

if (failures.length > 0) {
  console.error('Regression guard failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Regression guard passed.');

function expectFile(relativePath) {
  if (!existsSync(resolve(relativePath))) {
    failures.push(`${relativePath}: expected file to exist`);
  }
}

function expectIncludes(relativePath, snippets) {
  const source = readFile(relativePath);
  expectContains(source, relativePath, snippets);
}

function expectNotIncludes(relativePath, snippets) {
  const source = readFile(relativePath);
  for (const snippet of snippets) {
    if (source.includes(snippet)) {
      failures.push(`${relativePath}: should not include ${JSON.stringify(snippet)}`);
    }
  }
}

function expectContains(source, relativePath, snippets) {
  for (const snippet of snippets) {
    if (!source.includes(snippet)) {
      failures.push(`${relativePath}: missing ${JSON.stringify(snippet)}`);
    }
  }
}

function readFile(relativePath) {
  const fullPath = resolve(relativePath);
  if (!existsSync(fullPath)) {
    failures.push(`${relativePath}: expected file to exist`);
    return '';
  }
  return readFileSync(fullPath, 'utf8');
}

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

function resolve(relativePath) {
  return join(workspaceRoot, relativePath);
}
