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
  'AfToastService',
  'AfToastViewport',
  'AfInlineMessage',
  "{ id: 'feedback', label: 'Feedback', icon: 'bell' }",
  'showFeedbackToast(severity: AfFeedbackSeverity)',
]);

expectIncludes('projects/showcase/src/app/app.html', [
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
  'af-password-desktop',
  'af-password-mobile',
  'ion-input-password-toggle',
]);

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
