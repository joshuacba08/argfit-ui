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
]);
expectIncludes('projects/argfit-ui-desktop/src/public-api.ts', [
  './lib/components/inline-message/af-inline-message-desktop.component',
  './lib/components/toast/af-toast-desktop.component',
  './lib/components/toast-viewport/af-toast-viewport-desktop.component',
]);
expectIncludes('projects/argfit-ui-mobile/src/public-api.ts', [
  './lib/components/inline-message/af-inline-message-mobile.component',
  './lib/components/toast/af-toast-mobile.component',
  './lib/components/toast-viewport/af-toast-viewport-mobile.component',
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
