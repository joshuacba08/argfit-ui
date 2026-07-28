import type { Type } from '@angular/core';
import * as ArgfitAdaptive from '@argfit-ui/adaptive';

export type DocsRoutePath = '/overview' | '/quickstart' | '/pwa' | '/llms' | '/components' | '/api' | '/guides' | '/release' | '/search';
export type DocsSearchKind = 'component' | 'package' | 'guide' | 'release' | 'page';
export type ProductiveComponentCategory = 'action' | 'surface' | 'feedback' | 'identity' | 'overlay' | 'form' | 'selection' | 'data' | 'workflow' | 'navigation' | 'layout';
export type ProductiveComponentInteraction = 'command' | 'display' | 'input' | 'selection' | 'disclosure' | 'navigation' | 'workflow';
export type ProductiveComponentComplexity = 'simple' | 'composed' | 'advanced';

export interface DocsNavItem {
  readonly route: DocsRoutePath;
  readonly label: string;
  readonly eyebrow: string;
  readonly description: string;
}

export interface ProductiveEntryPoint {
  readonly title: string;
  readonly route: DocsRoutePath;
  readonly sourcePath: string;
  readonly summary: string;
  readonly badge: string;
  readonly bullets: readonly string[];
}

export interface ProductiveFamilyGuide {
  readonly family: string;
  readonly summary: string;
  readonly usage: string;
  readonly a11y: string;
  readonly components: readonly string[];
}

export interface ProductivePackageGuide {
  readonly name: string;
  readonly slug: string;
  readonly route: string;
  readonly importPath: string;
  readonly purpose: string;
  readonly highlights: readonly string[];
  readonly sourcePath: string;
  readonly example?: string;
}

export interface ProductiveComponentDoc {
  readonly name: string;
  readonly slug: string;
  readonly route: string;
  readonly selector: string;
  readonly componentType: Type<unknown> | null;
  readonly family: string;
  readonly category: ProductiveComponentCategory;
  readonly interaction: ProductiveComponentInteraction;
  readonly complexity: ProductiveComponentComplexity;
  readonly searchKeywords: readonly string[];
  readonly summary: string;
  readonly sourcePath: string;
  readonly importPath: '@argfit-ui/adaptive';
  readonly api: ProductiveComponentApiSpec;
}

export interface ProductiveComponentGroup {
  readonly family: string;
  readonly summary: string;
  readonly usage: string;
  readonly a11y: string;
  readonly components: readonly ProductiveComponentDoc[];
}

export interface ProductiveComponentApiAttribute {
  readonly name: string;
  readonly kind: 'input' | 'output';
  readonly type: string;
  readonly required: boolean;
  readonly values: readonly string[];
  readonly description: string;
}

export interface ProductiveComponentVariation {
  readonly attribute: string;
  readonly label: string;
  readonly values: readonly string[];
  readonly summary: string;
}

export interface ProductiveComponentSlotDirective {
  readonly selector: string;
  readonly purpose: string;
}

export interface ProductiveComponentApiSpec {
  readonly inputs: readonly ProductiveComponentApiAttribute[];
  readonly outputs: readonly ProductiveComponentApiAttribute[];
  readonly variations: readonly ProductiveComponentVariation[];
  readonly slots: readonly ProductiveComponentSlotDirective[];
  readonly example: string;
}

export interface DocsSearchEntry {
  readonly title: string;
  readonly route: string;
  readonly kind: DocsSearchKind;
  readonly eyebrow: string;
  readonly summary: string;
  readonly family?: string;
  readonly category?: ProductiveComponentCategory;
  readonly interaction?: ProductiveComponentInteraction;
  readonly complexity?: ProductiveComponentComplexity;
  readonly tags: readonly string[];
}

export interface DocsSearchResult extends DocsSearchEntry {
  readonly score: number;
  readonly matchedFields: readonly string[];
}

export interface DocsSearchOptions {
  readonly kind?: DocsSearchKind | 'all';
  readonly family?: string | 'all';
  readonly category?: ProductiveComponentCategory | 'all';
  readonly limit?: number;
}

export interface ProductiveGuideCard {
  readonly title: string;
  readonly sourcePath: string;
  readonly summary: string;
  readonly bullets: readonly string[];
}

export interface ProductiveReleaseAsset {
  readonly title: string;
  readonly sourcePath: string;
  readonly summary: string;
}

export const DOCS_NAV_ITEMS: readonly DocsNavItem[] = [
  {
    route: '/overview',
    label: 'Overview',
    eyebrow: 'Start here',
    description: 'Product posture, framework map and the stable 1.3.0 contract.',
  },
  {
    route: '/quickstart',
    label: 'Quickstart',
    eyebrow: 'Get started',
    description: 'Install, bootstrap and validate the productive contract in four steps.',
  },
  {
    route: '/pwa',
    label: 'PWA',
    eyebrow: 'Installable',
    description: 'Build installable desktop, tablet and mobile apps with offline and device capability flows.',
  },
  {
    route: '/llms',
    label: 'LLMs.txt',
    eyebrow: 'AI Tools',
    description: 'LLM-optimized documentation endpoints for agents and code assistants.',
  },
  {
    route: '/components',
    label: 'Components',
    eyebrow: 'Catalog',
    description: 'Stable component families with production usage and accessibility rules.',
  },
  {
    route: '/api',
    label: 'API',
    eyebrow: 'Reference',
    description: 'Packages, imports, shared types and slot directive families.',
  },
  {
    route: '/guides',
    label: 'Guides',
    eyebrow: 'Operate',
    description: 'Theming, enterprise posture, accessibility and migration guidance.',
  },
  {
    route: '/release',
    label: 'Release',
    eyebrow: 'Ship',
    description: 'Scope freeze, semver, gates, release notes and publish reality.',
  },
];

export const PRODUCTIVE_ENTRY_POINTS: readonly ProductiveEntryPoint[] = [
  {
    title: 'Quickstart',
    route: '/quickstart',
    sourcePath: 'docs/productive/quickstart.md',
    summary: 'Bootstrap, package posture and the local validation flow for the productive contract.',
    badge: 'start',
    bullets: ['Angular 21 standalone app', 'Adaptive-first imports', 'release:production:check as the real gate'],
  },
  {
    title: 'PWA applications',
    route: '/pwa',
    sourcePath: 'docs/pwa/quickstart.md',
    summary: 'Create installable ArgFit UI applications with manifest metadata, Angular service worker caching and browser-safe device capability flows.',
    badge: 'pwa',
    bullets: ['Installable desktop, tablet and mobile shell', 'Offline and update posture', 'Web Bluetooth and native bridge boundaries'],
  },
  {
    title: 'LLMs.txt',
    route: '/llms',
    sourcePath: 'projects/argfit-ui-docs/public/llms.txt',
    summary: 'Machine-readable entry points for AI agents to understand ArgFit UI documentation and component contracts.',
    badge: 'ai',
    bullets: ['Canonical domain argfit-ui.oroyajs.com', 'Concise and full text indexes', 'Root and PrimeNG-style endpoint aliases'],
  },
  {
    title: 'Components',
    route: '/components',
    sourcePath: 'docs/productive/components.md',
    summary: 'Stable component families documented by intent, not by vendor internals.',
    badge: 'stable',
    bullets: ['Foundation, forms, data, overlays and layout', 'Usage notes per family', 'Accessibility posture per family'],
  },
  {
    title: 'API reference',
    route: '/api',
    sourcePath: 'docs/productive/api-reference.md',
    summary: 'Packages, imports, services, shared types and slot directives.',
    badge: 'api',
    bullets: ['@argfit-ui/core', '@argfit-ui/primitives', '@argfit-ui/adaptive', 'Renderer-specific packages remain secondary'],
  },
  {
    title: 'Guides',
    route: '/guides',
    sourcePath: 'docs/productive/accessibility.md',
    summary: 'Cross-cutting guidance for accessibility, theming, migration and enterprise use.',
    badge: 'guide',
    bullets: ['WCAG AA posture', 'Token-first theming', 'Beta/Beta+ to 1.0 migration'],
  },
  {
    title: 'Release',
    route: '/release',
    sourcePath: 'docs/productive/release-notes-1.3.0.md',
    summary: 'The shipped 1.3 release shape, from stable scope through the production gate.',
    badge: 'ship',
    bullets: ['Native button icons', 'Reliable mobile full width', '1.3.0 package metadata aligned'],
  },
];

export const PRODUCTIVE_COMPONENT_FAMILIES: readonly ProductiveFamilyGuide[] = [
  {
    family: 'Foundation and base composition',
    summary: 'Core surfaces for task actions, semantic cards, input capture and application shell composition.',
    usage: 'Use these pieces to structure dashboards, record views and task flows before adding more specialized data or workflow surfaces.',
    a11y: 'Preserve landmarks, clear titles, input labels and focus return when the flow opens a dialog.',
    components: ['AfButton', 'AfCard', 'AfDialog', 'AfInput', 'AfPageShell'],
  },
  {
    family: 'Analytics, feedback and status',
    summary: 'Summary blocks, status indicators and transient or persistent feedback for operational UIs.',
    usage: 'Pair metric and analytics surfaces with local inline guidance when the screen needs to explain risk, loading or action outcomes.',
    a11y: 'Use inline message for persistent local errors and reserve toast/live region behavior for brief global state changes.',
    components: ['AfAnalyticsCard', 'AfBadge', 'AfChip', 'AfInlineMessage', 'AfMetricCard', 'AfProgress', 'AfToast', 'AfToastViewport'],
  },
  {
    family: 'Overlay and identity',
    summary: 'Contextual disclosure, secondary task panels and ownership surfaces.',
    usage: 'Use drawer and dialog for complete tasks, popover and tooltip for lightweight context, and avatar for identity or assignment cues.',
    a11y: 'Critical product meaning must not live behind hover-only disclosure; overlay close behavior must stay explicit.',
    components: ['AfAvatar', 'AfDrawer', 'AfPopover', 'AfTooltip'],
  },
  {
    family: 'Forms and selection',
    summary: 'Productive data entry and choice surfaces for desktop-density and touch-first flows.',
    usage: 'Prefer clear labels, local validation and mobile presentations that use sheets, drawers or fullscreen disclosure for dense editing.',
    a11y: 'Keep label-hint-error relationships synchronized and preserve native-button affordances for reveal, clear and dismiss actions.',
    components: ['AfCheckbox', 'AfDatePicker', 'AfField', 'AfFieldset', 'AfIconField', 'AfInputCount', 'AfInputGroup', 'AfListbox', 'AfMultiSelect', 'AfPassword', 'AfRadioGroup', 'AfSegmentedControl', 'AfSelect', 'AfSlider', 'AfTextarea', 'AfTimePicker', 'AfToggle'],
  },
  {
    family: 'Data, hierarchy and workflow',
    summary: 'High-signal reading, paged data, workflow state and hierarchy-oriented product surfaces.',
    usage: 'Keep expensive filtering, sorting and aggregation out of the template layer and let the app decide the next state for emitted events.',
    a11y: 'Maintain keyboard activation, mobile degradation to readable list-first patterns and non-drag alternatives for movement workflows.',
    components: ['AfChart', 'AfDataTable', 'AfDataView', 'AfKanban', 'AfOrderList', 'AfOrganizationChart', 'AfPaginator', 'AfPickList', 'AfTimeline', 'AfTree', 'AfTreeTable', 'AfVirtualScroller'],
  },
  {
    family: 'Layout and navigation',
    summary: 'Progressive structure for multi-step, multi-panel or tool-heavy interfaces.',
    usage: 'Use these surfaces to shape long or dense flows without collapsing back into vendor-specific layout abstractions.',
    a11y: 'Active or expanded state must stay explicit and the reading order should remain clear even when layout changes.',
    components: ['AfAccordion', 'AfDivider', 'AfPanel', 'AfScrollPanel', 'AfSplitter', 'AfStepper', 'AfTabs', 'AfToolbar'],
  },
];

export const PRODUCTIVE_PACKAGE_GUIDES: readonly ProductivePackageGuide[] = [
  {
    name: '@argfit-ui/core',
    slug: 'core',
    route: '/api/core',
    importPath: '@argfit-ui/core',
    purpose: 'Bootstrap, theme runtime, platform runtime, toast service and the shared ArgFit-owned type families.',
    highlights: ['provideArgfitUi', 'AfThemeService', 'AfPlatformService', 'AfToastService', 'Shared types for chart, data table, feedback and workflow'],
    sourcePath: 'docs/productive/api-reference.md',
    example: [
      "import { ApplicationConfig } from '@angular/core';",
      "import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';",
      '',
      'export const appConfig: ApplicationConfig = {',
      '  providers: [provideArgfitUi({ theme: ARGFIT_DARK_THEME, platform: \'auto\' })],',
      '};',
    ].join('\n'),
  },
  {
    name: '@argfit-ui/primitives',
    slug: 'primitives',
    route: '/api/primitives',
    importPath: '@argfit-ui/primitives',
    purpose: 'Vendor-agnostic accessibility helpers and low-level building blocks.',
    highlights: ['AfVisuallyHiddenComponent', 'AfFocusTrapDirective', 'AfFocusInitialDirective', 'AfEscapeKeyDirective', 'AfIconComponent'],
    sourcePath: 'docs/productive/api-reference.md',
    example: [
      "import { AfIconComponent, AfVisuallyHiddenComponent } from '@argfit-ui/primitives';",
      '',
      '// Keep primitives close to accessibility or composition boundaries.',
    ].join('\n'),
  },
  {
    name: '@argfit-ui/adaptive',
    slug: 'adaptive',
    route: '/api/adaptive',
    importPath: '@argfit-ui/adaptive',
    purpose: 'The recommended application-facing package: semantic components that choose the correct renderer for the current platform.',
    highlights: ['Foundation surfaces', 'Feedback and overlays', 'Forms and selection', 'Data and workflow', 'Layout and navigation'],
    sourcePath: 'docs/productive/api-reference.md',
    example: [
      "import { AfButton, AfCard } from '@argfit-ui/adaptive';",
      '',
      '<af-card variant="panel" tone="primary">',
      '  <af-button>Ship 1.0</af-button>',
      '</af-card>',
    ].join('\n'),
  },
  {
    name: '@argfit-ui/desktop',
    slug: 'desktop',
    route: '/api/desktop',
    importPath: '@argfit-ui/desktop',
    purpose: 'Renderer-specific desktop surfaces for intentional integration paths, not the default application contract.',
    highlights: ['PrimeNG remains internal', 'Opt-in path only', 'Useful for infrastructure-specific examples', 'Secondary to adaptive imports'],
    sourcePath: 'docs/productive/api-reference.md',
    example: [
      "import '@argfit-ui/desktop';",
      '',
      '// Use only when you intentionally need the desktop renderer surface.',
    ].join('\n'),
  },
  {
    name: '@argfit-ui/mobile',
    slug: 'mobile',
    route: '/api/mobile',
    importPath: '@argfit-ui/mobile',
    purpose: 'Renderer-specific mobile surfaces for intentional integration and testing paths.',
    highlights: ['Ionic remains internal', 'Touch-first renderer path', 'Opt-in only', 'Still secondary to adaptive imports'],
    sourcePath: 'docs/productive/api-reference.md',
    example: [
      "import '@argfit-ui/mobile';",
      '',
      '// Use only for intentional mobile-renderer integration paths.',
    ].join('\n'),
  },
];

export const PRODUCTIVE_GUIDE_CARDS: readonly ProductiveGuideCard[] = [
  {
    title: 'Accessibility posture',
    sourcePath: 'docs/productive/accessibility.md',
    summary: 'Focus, keyboard, live-region and mobile disclosure rules for the stable 1.3.0 contract.',
    bullets: ['WCAG AA baseline', 'Dialog and drawer focus return', 'Severity-driven feedback semantics'],
  },
  {
    title: 'Theming and adaptive runtime',
    sourcePath: 'docs/productive/theming.md',
    summary: 'Theme bootstrap, token contract and platform preference behavior.',
    bullets: ['Dark and light shipped themes', 'Token-first overrides', 'No vendor-selector dependency'],
  },
  {
    title: 'PWA app setup',
    sourcePath: 'docs/pwa/quickstart.md',
    summary: 'How to use ArgFit UI to create installable PWA shells for desktop, tablet and mobile with safe device capability detection.',
    bullets: ['Angular service worker', 'Manifest and standalone display', 'Web Bluetooth guarded by secure origin and user gesture'],
  },
  {
    title: 'Enterprise readiness',
    sourcePath: 'docs/productive/enterprise-readiness.md',
    summary: 'Production posture for data-heavy, form-heavy, overlay-heavy and analytics-heavy screens.',
    bullets: ['Server-side pagination posture', 'App-level overlay rules', 'Prepared insight for charts'],
  },
  {
    title: 'Migration beta/Beta+ to 1.0',
    sourcePath: 'docs/productive/migration-beta-to-1-0.md',
    summary: 'How to move from prerelease assumptions to a stable semver-major contract.',
    bullets: ['No vendor pivot', 'Experimental public category disappears', 'Version alignment remains mandatory'],
  },
  {
    title: 'Quality gates',
    sourcePath: 'docs/productive/quality-gates.md',
    summary: 'The operational contract that keeps the productive line honest.',
    bullets: ['release:production:check', 'Performance budgets', 'CI artifact expectations'],
  },
  {
    title: 'Release operations',
    sourcePath: 'docs/productive/release-operations.md',
    summary: 'Branching, tagging, npm publish, patch release and changelog rules for production releases.',
    bullets: ['publish-production.yml', 'latest dist-tag guard', 'Patch release procedure'],
  },
  {
    title: 'Production release checklist',
    sourcePath: 'docs/productive/release-checklist.md',
    summary: 'Final pre-tag checks for version alignment, docs, workflow publish and recovery.',
    bullets: ['1.0.0 metadata', 'release:production:check', 'latest dist-tag verification'],
  },
  {
    title: 'Support policy',
    sourcePath: 'docs/productive/support-policy.md',
    summary: 'Support window, security, dependency update and deprecation rules for the productive line.',
    bullets: ['1.x support window', 'Security and dependency updates', 'Deprecation process'],
  },
];

export const PRODUCTIVE_RELEASE_ASSETS: readonly ProductiveReleaseAsset[] = [
  {
    title: '1.0 scope',
    sourcePath: 'docs/productive/scope.md',
    summary: 'What enters 1.0, what stays out and what remains frozen in 1.0.x.',
  },
  {
    title: 'Public API inventory',
    sourcePath: 'docs/productive/public-api.md',
    summary: 'The source of truth for the public contract by package barrel.',
  },
  {
    title: 'Semver policy',
    sourcePath: 'docs/productive/semver-policy.md',
    summary: 'Rules for patch, minor, major, deprecations and migration responsibility.',
  },
  {
    title: 'Quality gates',
    sourcePath: 'docs/productive/quality-gates.md',
    summary: 'The production gate, budgets and the CI expectation for the release line.',
  },
  {
    title: 'Release operations',
    sourcePath: 'docs/productive/release-operations.md',
    summary: 'Branch and tag strategy, npm publish process, patch release steps and changelog policy.',
  },
  {
    title: 'Production release checklist',
    sourcePath: 'docs/productive/release-checklist.md',
    summary: 'The final checklist for 1.0.0 metadata, docs, tagging, npm latest and recovery posture.',
  },
  {
    title: 'Support policy',
    sourcePath: 'docs/productive/support-policy.md',
    summary: 'Support window, security maintenance, dependency update and deprecation process for 1.x.',
  },
  {
    title: 'Release notes',
    sourcePath: 'docs/productive/release-notes-1.3.0.md',
    summary: 'The canonical 1.3.0 release notes and production publish posture.',
  },
];

export const PRODUCTIVE_QUICKSTART_STEPS: readonly string[] = [
  'Bootstrap the runtime with provideArgfitUi from @argfit-ui/core.',
  'Keep application imports adaptive-first through @argfit-ui/adaptive.',
  'Validate the contract locally with pnpm build:docs and pnpm release:production:check.',
];

export const PRODUCTIVE_VALIDATION_COMMANDS: readonly string[] = [
  'pnpm install',
  'pnpm build:docs',
  'pnpm build:all',
  'pnpm release:production:check',
];

export const PRODUCTIVE_BOOTSTRAP_EXAMPLE = [
  "import { ApplicationConfig } from '@angular/core';",
  "import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';",
  '',
  'export const appConfig: ApplicationConfig = {',
  '  providers: [',
  '    provideArgfitUi({ theme: ARGFIT_DARK_THEME, platform: \'auto\' }),',
  '  ],',
  '};',
].join('\n');

export const PRODUCTIVE_ADAPTIVE_EXAMPLE = [
  "import { AfButton, AfCard, AfCardContentDirective, AfCardHeaderDirective, AfCardTitleDirective } from '@argfit-ui/adaptive';",
  '',
  '<af-card variant="panel" tone="primary">',
  '  <header afCardHeader>',
  '    <h2 afCardTitle>Productive dashboard</h2>',
  '  </header>',
  '  <div afCardContent>',
  '    <af-button>Ship 1.0</af-button>',
  '  </div>',
  '</af-card>',
].join('\n');

export const PRODUCTIVE_MIGRATION_CHECKLIST: readonly string[] = [
  'Keep existing adaptive imports where possible.',
  'Remove assumptions that public adaptive surfaces are still prerelease-only.',
  'Re-check wrappers against the frozen names and semantics in the 1.0 public API.',
  'Re-test overlays, feedback and dense forms on both desktop and mobile behavior paths.',
  'Run the productive gate before treating the migration as complete.',
];

const PRODUCTIVE_COMPONENT_SOURCE_PATH = 'docs/productive/components.md';
const PRODUCTIVE_FAMILY_GUIDE_BY_NAME = new Map(
  PRODUCTIVE_COMPONENT_FAMILIES.map((family) => [family.family, family] as const),
);

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function toComponentSlug(name: string): string {
  return toKebabCase(name.replace(/^Af/, ''));
}

function toComponentSelector(name: string): string {
  return `af-${toComponentSlug(name)}`;
}

interface AngularComponentDefinition {
  readonly inputs?: Record<string, unknown>;
  readonly outputs?: Record<string, unknown>;
}

interface AngularComponentType extends Type<unknown> {
  readonly ['\u0275cmp']?: AngularComponentDefinition;
}

const ADAPTIVE_EXPORTS = ArgfitAdaptive as unknown as Readonly<Record<string, AngularComponentType>>;

const BOOLEAN_INPUT_NAMES = new Set([
  'allowCrossColumnMove',
  'allowManualInput',
  'allowReorder',
  'clearable',
  'closeOnBackdrop',
  'closeOnEscape',
  'collapsible',
  'collapsed',
  'checked',
  'closable',
  'disabled',
  'dismissible',
  'dot',
  'feedback',
  'fullWidth',
  'indeterminate',
  'interactive',
  'legend',
  'linear',
  'loading',
  'multiple',
  'open',
  'persistent',
  'readonly',
  'removable',
  'required',
  'searchable',
  'selected',
  'showGrid',
  'showSearch',
]);

const NUMBER_INPUT_NAMES = new Set([
  'duration',
  'height',
  'itemHeight',
  'max',
  'maxLength',
  'maxSelected',
  'min',
  'minPrimarySize',
  'minSecondarySize',
  'notificationCount',
  'overscan',
  'pageIndex',
  'pageSize',
  'precision',
  'primarySize',
  'rows',
  'step',
  'totalItems',
  'value',
  'viewportHeight',
]);

const REQUIRED_INPUTS_BY_COMPONENT: Readonly<Record<string, readonly string[]>> = {
  AfAnalyticsCard: ['title'],
  AfDataTable: ['columns'],
  AfInlineMessage: ['title'],
  AfMetricCard: ['label'],
  AfToast: ['title'],
  AfTreeTable: ['columns'],
};

const SLOT_DIRECTIVES_BY_COMPONENT: Readonly<Record<string, readonly ProductiveComponentSlotDirective[]>> = {
  AfAccordion: [{ selector: '[afAccordionPanel]', purpose: 'Custom panel body template for a specific accordion item.' }],
  AfAnalyticsCard: [
    { selector: '[afAnalyticsCardActions]', purpose: 'Header-level actions for the analytics surface.' },
    { selector: '[afAnalyticsCardMetrics]', purpose: 'Metric row or KPI content.' },
    { selector: '[afAnalyticsCardLegend]', purpose: 'Legend content for chart or series context.' },
    { selector: '[afAnalyticsCardFooter]', purpose: 'Supporting footer content.' },
  ],
  AfCard: [
    { selector: '[afCardHeader]', purpose: 'Structured card header.' },
    { selector: '[afCardEyebrow]', purpose: 'Small contextual label above the title.' },
    { selector: '[afCardTitle]', purpose: 'Semantic card title.' },
    { selector: '[afCardSubtitle]', purpose: 'Secondary title copy.' },
    { selector: '[afCardContent]', purpose: 'Main card body content.' },
    { selector: '[afCardFooter]', purpose: 'Footer actions or supporting metadata.' },
  ],
  AfDataTable: [
    { selector: '[afDataTableToolbar]', purpose: 'Toolbar above the table.' },
    { selector: '[afDataTableCell]', purpose: 'Custom cell template by column key.' },
    { selector: '[afDataTableExpandedRow]', purpose: 'Expanded row template.' },
    { selector: '[afDataTableEmpty]', purpose: 'Empty-state template.' },
  ],
  AfDataView: [
    { selector: '[afDataViewItem]', purpose: 'Custom item template.' },
    { selector: '[afDataViewActions]', purpose: 'Collection-level actions.' },
    { selector: '[afDataViewEmpty]', purpose: 'Empty-state template.' },
    { selector: '[afDataViewLoading]', purpose: 'Loading-state template.' },
  ],
  AfDialog: [
    { selector: '[afDialogHeader]', purpose: 'Dialog header area.' },
    { selector: '[afDialogTitle]', purpose: 'Dialog title.' },
    { selector: '[afDialogDescription]', purpose: 'Dialog description.' },
    { selector: '[afDialogContent]', purpose: 'Main modal task content.' },
    { selector: '[afDialogFooter]', purpose: 'Dialog actions.' },
  ],
  AfIconField: [
    { selector: '[afIconFieldPrefix]', purpose: 'Leading icon or affordance.' },
    { selector: '[afIconFieldControl]', purpose: 'Projected form control.' },
    { selector: '[afIconFieldSuffix]', purpose: 'Trailing icon or affordance.' },
  ],
  AfInputGroup: [
    { selector: '[afInputGroupPrefix]', purpose: 'Leading unit, label or action.' },
    { selector: '[afInputGroupControl]', purpose: 'Projected form control.' },
    { selector: '[afInputGroupSuffix]', purpose: 'Trailing unit, label or action.' },
  ],
  AfKanban: [
    { selector: '[afKanbanColumnHeader]', purpose: 'Custom column header template.' },
    { selector: '[afKanbanCard]', purpose: 'Custom card template.' },
    { selector: '[afKanbanCardFooter]', purpose: 'Card footer template.' },
    { selector: '[afKanbanEmpty]', purpose: 'Column empty-state template.' },
  ],
  AfOrderList: [
    { selector: '[afOrderListItem]', purpose: 'Custom item template.' },
    { selector: '[afOrderListActions]', purpose: 'List action area.' },
    { selector: '[afOrderListEmpty]', purpose: 'Empty-state template.' },
    { selector: '[afOrderListLoading]', purpose: 'Loading-state template.' },
  ],
  AfOrganizationChart: [
    { selector: '[afOrganizationChartNode]', purpose: 'Custom node template.' },
    { selector: '[afOrganizationChartActions]', purpose: 'Chart action area.' },
    { selector: '[afOrganizationChartEmpty]', purpose: 'Empty-state template.' },
    { selector: '[afOrganizationChartLoading]', purpose: 'Loading-state template.' },
  ],
  AfPageShell: [
    { selector: '[afPageShellBrand]', purpose: 'Application brand region.' },
    { selector: '[afPageShellActions]', purpose: 'Top-level shell actions.' },
    { selector: '[afPageShellUser]', purpose: 'User or account region.' },
    { selector: '[afPageShellFooter]', purpose: 'Sidebar or shell footer.' },
  ],
  AfPickList: [
    { selector: '[afPickListItem]', purpose: 'Custom list item template.' },
    { selector: '[afPickListActions]', purpose: 'Transfer action area.' },
    { selector: '[afPickListSourceEmpty]', purpose: 'Source empty state.' },
    { selector: '[afPickListTargetEmpty]', purpose: 'Target empty state.' },
    { selector: '[afPickListLoading]', purpose: 'Loading-state template.' },
  ],
  AfPopover: [
    { selector: '[afPopoverTrigger]', purpose: 'Anchoring trigger template.' },
    { selector: '[afPopoverContent]', purpose: 'Popover panel content.' },
  ],
  AfSplitter: [
    { selector: '[afSplitterPrimary]', purpose: 'Primary pane content.' },
    { selector: '[afSplitterSecondary]', purpose: 'Secondary pane content.' },
  ],
  AfStepper: [{ selector: '[afStepPanel]', purpose: 'Panel template for a step.' }],
  AfTabs: [{ selector: '[afTabPanel]', purpose: 'Panel template for a tab.' }],
  AfTimeline: [
    { selector: '[afTimelineItem]', purpose: 'Custom timeline item template.' },
    { selector: '[afTimelineActions]', purpose: 'Timeline action area.' },
    { selector: '[afTimelineEmpty]', purpose: 'Empty-state template.' },
    { selector: '[afTimelineLoading]', purpose: 'Loading-state template.' },
  ],
  AfToolbar: [
    { selector: '[afToolbarStart]', purpose: 'Leading toolbar region.' },
    { selector: '[afToolbarCenter]', purpose: 'Centered toolbar region.' },
    { selector: '[afToolbarEnd]', purpose: 'Trailing toolbar region.' },
  ],
  AfTree: [
    { selector: '[afTreeNode]', purpose: 'Custom tree node template.' },
    { selector: '[afTreeActions]', purpose: 'Tree action area.' },
    { selector: '[afTreeEmpty]', purpose: 'Empty-state template.' },
    { selector: '[afTreeLoading]', purpose: 'Loading-state template.' },
  ],
  AfTreeTable: [
    { selector: '[afTreeTableCell]', purpose: 'Custom tree table cell by column key.' },
    { selector: '[afTreeTableActions]', purpose: 'Tree table action area.' },
    { selector: '[afTreeTableEmpty]', purpose: 'Empty-state template.' },
    { selector: '[afTreeTableLoading]', purpose: 'Loading-state template.' },
  ],
  AfVirtualScroller: [
    { selector: '[afVirtualScrollerItem]', purpose: 'Custom virtual item template.' },
    { selector: '[afVirtualScrollerActions]', purpose: 'Scroller action area.' },
    { selector: '[afVirtualScrollerEmpty]', purpose: 'Empty-state template.' },
    { selector: '[afVirtualScrollerLoading]', purpose: 'Loading-state template.' },
  ],
};

const COMPONENT_INPUT_VALUES: Readonly<Record<string, Readonly<Record<string, readonly string[]>>>> = {
  AfAnalyticsCard: {
    density: ['compact', 'comfortable'],
    state: ['ready', 'loading', 'empty', 'error'],
    tone: ['neutral', 'primary', 'accent'],
    variant: ['surface', 'elevated', 'outline'],
  },
  AfAvatar: {
    shape: ['circle', 'rounded', 'square'],
    size: ['sm', 'md', 'lg', 'xl'],
    tone: ['primary', 'accent', 'success', 'warning', 'danger', 'neutral'],
  },
  AfBadge: {
    shape: ['pill', 'rounded'],
    size: ['sm', 'md'],
    tone: ['primary', 'accent', 'success', 'warning', 'danger', 'neutral'],
    variant: ['soft', 'solid', 'outline', 'tag'],
  },
  AfButton: {
    icon: ['log-in', 'save', 'arrow-right'],
    iconPosition: ['start', 'end'],
    size: ['sm', 'md', 'lg'],
    type: ['button', 'submit', 'reset'],
    variant: ['primary', 'secondary', 'ghost', 'danger'],
  },
  AfCard: {
    density: ['compact', 'comfortable'],
    tone: ['neutral', 'primary', 'success', 'warning', 'danger'],
    variant: ['surface', 'elevated', 'metric', 'device', 'panel'],
  },
  AfChart: {
    density: ['compact', 'comfortable'],
    tone: ['default', 'primary', 'success', 'warning', 'danger'],
    type: ['line', 'area', 'bar', 'stacked-bar', 'horizontal-bar', 'sparkline', 'donut', 'gauge', 'radar', 'heatmap', 'boxplot', 'parallel'],
  },
  AfCheckbox: { size: ['sm', 'md', 'lg'], state: ['default', 'error', 'success'] },
  AfChip: {
    size: ['sm', 'md'],
    tone: ['primary', 'accent', 'success', 'warning', 'danger', 'neutral'],
    variant: ['soft', 'solid', 'outline'],
  },
  AfDataTable: {
    density: ['compact', 'normal', 'comfortable'],
    selectionMode: ['none', 'single', 'multiple'],
  },
  AfDataView: { density: ['compact', 'comfortable'], layout: ['grid', 'list'] },
  AfDatePicker: { density: ['compact', 'comfortable'], size: ['sm', 'md', 'lg'] },
  AfTimePicker: { density: ['compact', 'comfortable'], size: ['sm', 'md', 'lg'] },
  AfDialog: {
    mobilePresentation: ['sheet', 'fullscreen'],
    size: ['sm', 'md', 'lg', 'xl', 'fullscreen'],
    tone: ['neutral', 'info', 'success', 'danger'],
  },
  AfDivider: { orientation: ['horizontal', 'vertical'], tone: ['subtle', 'accent'] },
  AfDrawer: {
    placement: ['start', 'end', 'bottom'],
    size: ['sm', 'md', 'lg', 'full'],
    tone: ['neutral', 'primary'],
  },
  AfEmptyState: {
    size: ['sm', 'md', 'lg'],
    tone: ['empty', 'filtered', 'error', 'permission'],
  },
  AfField: { density: ['compact', 'comfortable'], labelMode: ['stacked', 'float', 'ifta'], state: ['default', 'error', 'success'] },
  AfFieldset: { density: ['compact', 'comfortable'], tone: ['neutral', 'accent', 'success', 'warning'] },
  AfFileUpload: {
    density: ['compact', 'comfortable'],
    size: ['sm', 'md', 'lg'],
  },
  AfIconField: { density: ['compact', 'comfortable'], labelMode: ['stacked', 'float', 'ifta'], state: ['default', 'error', 'success'] },
  AfInlineMessage: { severity: ['success', 'info', 'warning', 'danger'] },
  AfInput: {
    size: ['sm', 'md', 'lg'],
    tone: ['neutral', 'success', 'warning', 'danger'],
    type: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
  },
  AfInputCount: { density: ['compact', 'comfortable'], size: ['sm', 'md', 'lg'] },
  AfInputGroup: { density: ['compact', 'comfortable'], labelMode: ['stacked', 'float', 'ifta'], state: ['default', 'error', 'success'] },
  AfKanban: { density: ['compact', 'comfortable'] },
  AfListbox: { density: ['compact', 'comfortable'], selectionMode: ['single', 'multiple'] },
  AfMetricCard: {
    density: ['compact', 'comfortable'],
    size: ['sm', 'md', 'lg'],
    tone: ['primary', 'accent', 'success', 'warning', 'danger', 'neutral'],
    trendDirection: ['up', 'down', 'flat'],
    variant: ['surface', 'elevated', 'outline'],
  },
  AfMultiSelect: { density: ['compact', 'comfortable'] },
  AfOrderList: { density: ['compact', 'comfortable'], selectionMode: ['single', 'multiple'] },
  AfOrganizationChart: { density: ['compact', 'comfortable'], selectionMode: ['none', 'single', 'multiple'] },
  AfPageShell: { density: ['compact', 'comfortable'], variant: ['app', 'dashboard', 'contained'] },
  AfPaginator: { density: ['compact', 'comfortable'] },
  AfPanel: { density: ['compact', 'comfortable'], tone: ['neutral', 'accent', 'success', 'warning'] },
  AfPassword: { size: ['sm', 'md', 'lg'], tone: ['neutral', 'success', 'warning', 'danger'] },
  AfPickList: { density: ['compact', 'comfortable'] },
  AfPopover: { placement: ['top', 'right', 'bottom', 'left'], tone: ['neutral', 'primary'] },
  AfProgress: {
    size: ['sm', 'md', 'lg'],
    tone: ['primary', 'accent', 'success', 'warning', 'danger', 'neutral'],
    variant: ['bar', 'spinner', 'skeleton'],
  },
  AfRadioGroup: { layout: ['inline', 'stacked'], size: ['sm', 'md', 'lg'], state: ['default', 'error', 'success'] },
  AfScrollPanel: { direction: ['vertical', 'horizontal', 'both'] },
  AfSegmentedControl: { size: ['sm', 'md', 'lg'], state: ['default', 'error', 'success'] },
  AfSelect: { size: ['sm', 'md', 'lg'], state: ['default', 'error', 'success'] },
  AfSkeleton: {
    animation: ['pulse', 'none'],
    shape: ['text', 'rect', 'circle'],
  },
  AfSlider: {
    density: ['compact', 'comfortable'],
    size: ['sm', 'md', 'lg'],
    valueDisplay: ['none', 'inline', 'tooltip'],
  },
  AfSplitter: { orientation: ['horizontal', 'vertical'] },
  AfStepper: { density: ['compact', 'comfortable'] },
  AfTabs: { density: ['compact', 'comfortable'] },
  AfTextarea: { size: ['sm', 'md', 'lg'], state: ['default', 'error', 'success'] },
  AfTimeline: { density: ['compact', 'comfortable'] },
  AfToast: { severity: ['success', 'info', 'warning', 'danger'] },
  AfToastViewport: { placement: ['top-end', 'top-center', 'bottom-center'] },
  AfToggle: { size: ['sm', 'md', 'lg'], state: ['default', 'error', 'success'] },
  AfToolbar: { density: ['compact', 'comfortable'] },
  AfTooltip: { placement: ['top', 'right', 'bottom', 'left'], tone: ['neutral', 'primary'] },
  AfTree: { density: ['compact', 'comfortable'], selectionMode: ['none', 'single', 'multiple'] },
  AfTreeTable: {
    density: ['compact', 'normal', 'comfortable'],
    selectionMode: ['none', 'single', 'multiple'],
  },
  AfVirtualScroller: { density: ['compact', 'comfortable'] },
};

const ARRAY_INPUT_NAMES = new Set([
  'breadcrumbs',
  'cards',
  'categories',
  'columns',
  'expandedIds',
  'expandedRowIds',
  'filters',
  'indicators',
  'items',
  'mobileTabs',
  'navItems',
  'nodes',
  'options',
  'rows',
  'selectedIds',
  'selectedRowIds',
  'series',
  'sourceItems',
  'sourceSelectedIds',
  'steps',
  'targetItems',
  'targetSelectedIds',
]);

const STRING_INPUT_NAMES = new Set([
  'activeFilter',
  'activeId',
  'activeItem',
  'activeTab',
  'ariaDescribedBy',
  'ariaLabel',
  'autocomplete',
  'cardIdKey',
  'closeLabel',
  'columnIdKey',
  'description',
  'emptyDescription',
  'emptyMessage',
  'emptyTitle',
  'error',
  'errorDescription',
  'errorText',
  'eyebrow',
  'helper',
  'helperText',
  'hideLabel',
  'hint',
  'imageAlt',
  'imageSrc',
  'initials',
  'inputId',
  'label',
  'maxHeight',
  'name',
  'nextLabel',
  'optionLabel',
  'optionValue',
  'placeholder',
  'previousLabel',
  'promptLabel',
  'revealLabel',
  'rowIdKey',
  'searchPlaceholder',
  'secondaryLabel',
  'selectionLimitText',
  'skeletonWidth',
  'sourceDescription',
  'sourceEmptyDescription',
  'sourceEmptyTitle',
  'sourceTitle',
  'subtitle',
  'suffix',
  'targetDescription',
  'targetEmptyDescription',
  'targetEmptyTitle',
  'targetTitle',
  'text',
  'title',
  'treeColumnKey',
  'unit',
  'userInitials',
  'weakLabel',
  'mediumLabel',
  'strongLabel',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getPublicApiName(metadataValue: unknown, fallbackName: string): string {
  if (typeof metadataValue === 'string') {
    return metadataValue;
  }

  if (Array.isArray(metadataValue)) {
    for (const value of metadataValue) {
      if (typeof value === 'string') {
        return value;
      }
    }
  }

  if (isRecord(metadataValue) && typeof metadataValue['publicName'] === 'string') {
    return metadataValue['publicName'];
  }

  return fallbackName;
}

function getComponentDefinition(componentName: string): AngularComponentDefinition | undefined {
  return ADAPTIVE_EXPORTS[componentName]?.['\u0275cmp'];
}

function getComponentType(componentName: string): AngularComponentType | null {
  return ADAPTIVE_EXPORTS[componentName] ?? null;
}

function getInputValues(componentName: string, inputName: string): readonly string[] {
  if (BOOLEAN_INPUT_NAMES.has(inputName)) {
    return ['false', 'true'];
  }

  return COMPONENT_INPUT_VALUES[componentName]?.[inputName] ?? [];
}

function inferComponentCategory(componentName: string, family: string): ProductiveComponentCategory {
  if (componentName === 'AfButton' || componentName === 'AfToolbar') {
    return 'action';
  }

  if (['AfCard', 'AfPanel', 'AfPageShell'].includes(componentName)) {
    return 'surface';
  }

  if (['AfBadge', 'AfChip', 'AfInlineMessage', 'AfMetricCard', 'AfAnalyticsCard', 'AfProgress', 'AfToast', 'AfToastViewport'].includes(componentName)) {
    return 'feedback';
  }

  if (componentName === 'AfAvatar') {
    return 'identity';
  }

  if (family.includes('Overlay')) {
    return 'overlay';
  }

  if (['AfCheckbox', 'AfDatePicker', 'AfListbox', 'AfMultiSelect', 'AfRadioGroup', 'AfSegmentedControl', 'AfSelect', 'AfTimePicker', 'AfToggle'].includes(componentName)) {
    return 'selection';
  }

  if (family.includes('Forms')) {
    return 'form';
  }

  if (['AfKanban', 'AfOrderList', 'AfPickList', 'AfTimeline'].includes(componentName)) {
    return 'workflow';
  }

  if (family.includes('Data')) {
    return 'data';
  }

  if (['AfAccordion', 'AfStepper', 'AfTabs'].includes(componentName)) {
    return 'navigation';
  }

  return 'layout';
}

function inferComponentInteraction(category: ProductiveComponentCategory): ProductiveComponentInteraction {
  if (category === 'action') {
    return 'command';
  }

  if (category === 'form') {
    return 'input';
  }

  if (category === 'selection') {
    return 'selection';
  }

  if (category === 'overlay') {
    return 'disclosure';
  }

  if (category === 'navigation' || category === 'layout') {
    return 'navigation';
  }

  if (category === 'workflow') {
    return 'workflow';
  }

  return 'display';
}

function inferComponentComplexity(api: ProductiveComponentApiSpec): ProductiveComponentComplexity {
  const contractWeight = api.inputs.length + api.outputs.length * 2 + api.slots.length * 2;

  if (contractWeight >= 14) {
    return 'advanced';
  }

  if (contractWeight >= 7 || api.slots.length > 0) {
    return 'composed';
  }

  return 'simple';
}

function createComponentKeywords(
  componentName: string,
  selector: string,
  family: string,
  category: ProductiveComponentCategory,
  interaction: ProductiveComponentInteraction,
  complexity: ProductiveComponentComplexity,
  api: ProductiveComponentApiSpec,
): readonly string[] {
  return buildSearchEntryTags(
    componentName,
    selector,
    family,
    category,
    interaction,
    complexity,
    ...api.inputs.map((apiInput) => apiInput.name),
    ...api.outputs.map((apiOutput) => apiOutput.name),
    ...api.variations.flatMap((variation) => [variation.attribute, ...variation.values]),
    ...api.slots.map((slot) => slot.selector),
  );
}

function inferInputType(componentName: string, inputName: string, values: readonly string[]): string {
  if (values.length > 0 && !BOOLEAN_INPUT_NAMES.has(inputName)) {
    return values.map((value) => `'${value}'`).join(' | ');
  }

  if (BOOLEAN_INPUT_NAMES.has(inputName)) {
    return 'boolean';
  }

  if (NUMBER_INPUT_NAMES.has(inputName)) {
    return inputName === 'value' && componentName !== 'AfInputCount' && componentName !== 'AfProgress' ? 'string | number' : 'number';
  }

  if (ARRAY_INPUT_NAMES.has(inputName) || inputName.endsWith('Ids')) {
    return 'readonly item[]';
  }

  if (STRING_INPUT_NAMES.has(inputName)) {
    return 'string | undefined';
  }

  return 'unknown';
}

function inferOutputType(componentName: string, outputName: string): string {
  if (outputName === 'focusChange' || outputName === 'openChange' || outputName === 'openedChange' || outputName === 'collapsedChange') {
    return 'boolean';
  }

  if (outputName === 'valueChange') {
    if (componentName === 'AfInputCount') {
      return 'number';
    }

    if (componentName === 'AfMultiSelect') {
      return 'readonly unknown[]';
    }

    if (componentName === 'AfListbox') {
      return 'AfListboxValue';
    }

    return 'string';
  }

  if (outputName.endsWith('Change') || outputName.endsWith('Selected')) {
    return 'ArgFit event payload';
  }

  if (outputName === 'pressed') {
    return 'MouseEvent | KeyboardEvent';
  }

  if (outputName === 'dismissed') {
    return componentName === 'AfToast' ? 'string' : 'void';
  }

  return 'ArgFit event payload';
}

function describeApiAttribute(attributeName: string, kind: 'input' | 'output'): string {
  if (kind === 'output') {
    return `Emitted when ${attributeName.replace(/([A-Z])/g, ' $1').toLowerCase()} changes.`;
  }

  if (BOOLEAN_INPUT_NAMES.has(attributeName)) {
    return `Toggles the ${attributeName.replace(/([A-Z])/g, ' $1').toLowerCase()} state.`;
  }

  if (attributeName === 'ariaLabel' || attributeName.endsWith('Label')) {
    return 'Accessible label text for assistive technologies.';
  }

  if (attributeName === 'items' || attributeName === 'options' || attributeName === 'columns' || attributeName === 'rows' || attributeName === 'nodes') {
    return 'Collection data consumed by the component.';
  }

  if (attributeName === 'value' || attributeName.endsWith('Ids') || attributeName.endsWith('Id')) {
    return 'Controlled value or selected identifier state.';
  }

  return `Configures ${attributeName.replace(/([A-Z])/g, ' $1').toLowerCase()} for this component.`;
}

function createComponentExample(
  selector: string,
  inputs: readonly ProductiveComponentApiAttribute[],
  slots: readonly ProductiveComponentSlotDirective[],
): string {
  const requiredInputs = inputs.filter((input) => input.required).slice(0, 2);
  const variationInputs = inputs.filter((input) => input.values.length > 1 && !BOOLEAN_INPUT_NAMES.has(input.name)).slice(0, 3);
  const booleanInputs = inputs.filter((input) => BOOLEAN_INPUT_NAMES.has(input.name)).slice(0, 1);
  const attributeSource = [...requiredInputs, ...variationInputs, ...booleanInputs];
  const attributes = attributeSource
    .map((input) => {
      if (input.required) {
        return `[${input.name}]="${input.name}"`;
      }

      if (input.values.length > 0 && !BOOLEAN_INPUT_NAMES.has(input.name)) {
        return `${input.name}="${input.values[0]}"`;
      }

      if (BOOLEAN_INPUT_NAMES.has(input.name)) {
        return `[${input.name}]="false"`;
      }

      return `${input.name}=""`;
    })
    .join(' ');
  const openTag = attributes.length > 0 ? `<${selector} ${attributes}>` : `<${selector}>`;

  if (slots.length > 0) {
    const firstSlot = slots[0];
    return [openTag, `  <ng-template ${firstSlot.selector.replace('[', '').replace(']', '')}>`, '    Custom content', '  </ng-template>', `</${selector}>`].join('\n');
  }

  return [openTag, '  Content', `</${selector}>`].join('\n');
}

function createComponentApi(componentName: string, selector: string): ProductiveComponentApiSpec {
  const definition = getComponentDefinition(componentName);
  const requiredInputs = new Set(REQUIRED_INPUTS_BY_COMPONENT[componentName] ?? []);
  const slots = SLOT_DIRECTIVES_BY_COMPONENT[componentName] ?? [];
  const inputs = Object.entries(definition?.inputs ?? {}).map(([declaredName, metadataValue]) => {
    const name = getPublicApiName(metadataValue, declaredName);
    const values = getInputValues(componentName, name);

    return {
      name,
      kind: 'input' as const,
      type: inferInputType(componentName, name, values),
      required: requiredInputs.has(name),
      values,
      description: describeApiAttribute(name, 'input'),
    };
  });
  const outputs = Object.entries(definition?.outputs ?? {}).map(([declaredName, metadataValue]) => {
    const name = getPublicApiName(metadataValue, declaredName);

    return {
      name,
      kind: 'output' as const,
      type: inferOutputType(componentName, name),
      required: false,
      values: [] as const,
      description: describeApiAttribute(name, 'output'),
    };
  });
  const variations = inputs
    .filter((input) => input.values.length > 1)
    .map((input) => ({
      attribute: input.name,
      label: `${input.name} variations`,
      values: input.values,
      summary: `Supported values for ${input.name} on ${componentName}.`,
    }));

  return {
    inputs,
    outputs,
    variations,
    slots,
    example: createComponentExample(selector, inputs, slots),
  };
}

function createComponentDoc(family: string, name: string, summary: string): ProductiveComponentDoc {
  const slug = toComponentSlug(name);
  const selector = toComponentSelector(name);
  const api = createComponentApi(name, selector);
  const category = inferComponentCategory(name, family);
  const interaction = inferComponentInteraction(category);
  const complexity = inferComponentComplexity(api);

  return {
    name,
    slug,
    route: `/components/${slug}`,
    selector,
    componentType: getComponentType(name),
    family,
    category,
    interaction,
    complexity,
    searchKeywords: createComponentKeywords(name, selector, family, category, interaction, complexity, api),
    summary,
    sourcePath: PRODUCTIVE_COMPONENT_SOURCE_PATH,
    importPath: '@argfit-ui/adaptive',
    api,
  };
}

export const PRODUCTIVE_COMPONENT_DOCS: readonly ProductiveComponentDoc[] = [
  createComponentDoc('Foundation and base composition', 'AfButton', 'Trigger primary and secondary actions across dense dashboards and touch workflows.'),
  createComponentDoc('Foundation and base composition', 'AfCard', 'Group related content, actions and status inside semantic product surfaces.'),
  createComponentDoc('Foundation and base composition', 'AfDialog', 'Run focused modal tasks that should temporarily take over the screen context.'),
  createComponentDoc('Foundation and base composition', 'AfInput', 'Capture short textual, numeric or search-oriented values with a stable field contract.'),
  createComponentDoc('Foundation and base composition', 'AfPageShell', 'Frame app-wide navigation, breadcrumbs, search and action affordances in one adaptive shell.'),
  createComponentDoc('Analytics, feedback and status', 'AfAnalyticsCard', 'Combine insight narrative, metrics and trend context in a single executive summary surface.'),
  createComponentDoc('Analytics, feedback and status', 'AfBadge', 'Label inline status, severity, counters or state changes without breaking layout density.'),
  createComponentDoc('Analytics, feedback and status', 'AfChip', 'Represent compact entities, filters or removable selections with strong scanability.'),
  createComponentDoc('Analytics, feedback and status', 'AfInlineMessage', 'Keep persistent validation or operational guidance attached to the local workflow.'),
  createComponentDoc('Analytics, feedback and status', 'AfMetricCard', 'Surface a single KPI with tone, icon and trend in dashboards or summaries.'),
  createComponentDoc('Analytics, feedback and status', 'AfProgress', 'Communicate completion, load or quota state in a compact visual indicator.'),
  createComponentDoc('Analytics, feedback and status', 'AfToast', 'Raise short-lived global notifications for cross-screen outcomes.'),
  createComponentDoc('Analytics, feedback and status', 'AfToastViewport', 'Mount and coordinate toast presentation at the application shell level.'),
  createComponentDoc('Overlay and identity', 'AfAvatar', 'Show people, teams or ownership cues with initials, icons or imagery.'),
  createComponentDoc('Overlay and identity', 'AfDrawer', 'Open supporting or secondary tasks from the edge without leaving the current screen.'),
  createComponentDoc('Overlay and identity', 'AfPopover', 'Reveal anchored contextual actions or extra detail next to a trigger.'),
  createComponentDoc('Overlay and identity', 'AfTooltip', 'Add concise hover and focus hints where the UI needs lightweight explanation.'),
  createComponentDoc('Forms and selection', 'AfCheckbox', 'Capture binary choices inside settings, checklists or bulk selection flows.'),
  createComponentDoc('Forms and selection', 'AfDatePicker', 'Collect structured date values with a consistent cross-platform calendar affordance.'),
  createComponentDoc('Forms and selection', 'AfField', 'Compose custom field layouts with ArgFit-owned label, hint and error semantics.'),
  createComponentDoc('Forms and selection', 'AfFieldset', 'Group related controls under a shared legend and supporting copy.'),
  createComponentDoc('Forms and selection', 'AfIconField', 'Attach prefix or suffix icon affordances to compact text entry flows.'),
  createComponentDoc('Forms and selection', 'AfInputCount', 'Capture bounded counts with stepper-like adjustments and clear feedback.'),
  createComponentDoc('Forms and selection', 'AfInputGroup', 'Pair an input with unit labels, prefixes or appended actions.'),
  createComponentDoc('Forms and selection', 'AfListbox', 'Present long-form single or multi-selection in a readable scrolling list.'),
  createComponentDoc('Forms and selection', 'AfMultiSelect', 'Capture multiple values from dense data sets without exposing vendor details.'),
  createComponentDoc('Forms and selection', 'AfPassword', 'Collect secrets with reveal and validation semantics that stay accessible.'),
  createComponentDoc('Forms and selection', 'AfRadioGroup', 'Let users choose one option from a small explicit set.'),
  createComponentDoc('Forms and selection', 'AfSegmentedControl', 'Switch between a few mutually exclusive states with immediate visual feedback.'),
  createComponentDoc('Forms and selection', 'AfSelect', 'Choose one option from a collapsed option set with a stable adaptive API.'),
  createComponentDoc('Forms and selection', 'AfTextarea', 'Capture long-form notes, narrative and comments without leaving the form flow.'),
  createComponentDoc('Forms and selection', 'AfFileUpload', 'Select files with declared limits, reported rejections and application-driven upload progress.'),
  createComponentDoc('Forms and selection', 'AfSlider', 'Capture a bounded value where the position on the scale is the information.'),
  createComponentDoc('Analytics, feedback and status', 'AfEmptyState', 'Explain why a surface is empty and offer the next action.'),
  createComponentDoc('Analytics, feedback and status', 'AfSkeleton', 'Hold a loading surface shape without inventing placeholder data.'),
  createComponentDoc('Forms and selection', 'AfTimePicker', 'Collect a civil HH:mm time that stays anchored to the venue clock instead of drifting with the reader timezone.'),
  createComponentDoc('Forms and selection', 'AfToggle', 'Flip immediate on/off settings with a concise control posture.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfChart', 'Render comparison and trend visuals without leaking the charting vendor contract.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfDataTable', 'Present dense structured datasets with pagination, sorting and operational affordances.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfDataView', 'Render list or card collections that share pagination and filtering posture.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfKanban', 'Manage stateful work items across workflow columns and movement rules.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfOrderList', 'Reorder homogeneous lists explicitly where sequence is part of the task.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfOrganizationChart', 'Visualize reporting or domain hierarchy with readable node relationships.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfPaginator', 'Drive paged data traversal without rebuilding pager behavior by hand.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfPickList', 'Move items between source and target sets in curation workflows.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfTimeline', 'Narrate milestones, events and sequence state in chronological views.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfTree', 'Browse nested structures with expandable hierarchical context.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfTreeTable', 'Mix hierarchy and tabular comparison when both structure and columns matter.'),
  createComponentDoc('Data, hierarchy and workflow', 'AfVirtualScroller', 'Keep very large collections performant by virtualizing rendered rows or cards.'),
  createComponentDoc('Layout and navigation', 'AfAccordion', 'Reveal grouped content progressively without pushing users into a new page.'),
  createComponentDoc('Layout and navigation', 'AfDivider', 'Separate related regions while keeping visual rhythm and hierarchy clear.'),
  createComponentDoc('Layout and navigation', 'AfPanel', 'Wrap titled content blocks that may need collapse or emphasis.'),
  createComponentDoc('Layout and navigation', 'AfScrollPanel', 'Constrain long content areas with a styled local scrolling region.'),
  createComponentDoc('Layout and navigation', 'AfSplitter', 'Resize adjacent work areas in dense productivity layouts.'),
  createComponentDoc('Layout and navigation', 'AfStepper', 'Lead users through a sequence of explicit steps or phases.'),
  createComponentDoc('Layout and navigation', 'AfTabs', 'Switch between peer views while preserving strong information scent.'),
  createComponentDoc('Layout and navigation', 'AfToolbar', 'Arrange dense action sets and supporting context in a horizontal command strip.'),
];

export const PRODUCTIVE_COMPONENT_GROUPS: readonly ProductiveComponentGroup[] = PRODUCTIVE_COMPONENT_FAMILIES.map((family) => ({
  family: family.family,
  summary: family.summary,
  usage: family.usage,
  a11y: family.a11y,
  components: PRODUCTIVE_COMPONENT_DOCS.filter((component) => component.family === family.family),
}));

export const PRODUCTIVE_SEARCH_HINTS: readonly string[] = [
  'AfButton',
  'AfDataTable',
  'forms selection',
  'kanban workflow',
  'overlay focus',
  'adaptive',
  'PWA Bluetooth offline',
  'theming',
  'release',
];

export function getProductiveFamilyGuide(familyName: string): ProductiveFamilyGuide | undefined {
  return PRODUCTIVE_FAMILY_GUIDE_BY_NAME.get(familyName);
}

export function findProductiveComponentDoc(slug: string): ProductiveComponentDoc | undefined {
  return PRODUCTIVE_COMPONENT_DOCS.find((component) => component.slug === slug);
}

export function findProductivePackageGuide(slug: string): ProductivePackageGuide | undefined {
  return PRODUCTIVE_PACKAGE_GUIDES.find((pkg) => pkg.slug === slug);
}

function buildSearchEntryTags(...parts: readonly string[]): readonly string[] {
  return parts
    .flatMap((part) => part.split(/[^a-zA-Z0-9@.+-]+/))
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

export const PRODUCTIVE_SEARCH_ENTRIES: readonly DocsSearchEntry[] = [
  ...PRODUCTIVE_ENTRY_POINTS.map((entry) => ({
    title: entry.title,
    route: entry.route,
    kind: 'page' as const,
    eyebrow: entry.badge,
    summary: entry.summary,
    tags: buildSearchEntryTags(entry.title, entry.summary, ...entry.bullets),
  })),
  ...PRODUCTIVE_COMPONENT_DOCS.map((component) => ({
    title: component.name,
    route: component.route,
    kind: 'component' as const,
    eyebrow: component.family,
    summary: component.summary,
    family: component.family,
    category: component.category,
    interaction: component.interaction,
    complexity: component.complexity,
    tags: buildSearchEntryTags(component.name, component.family, component.summary, component.selector, ...component.searchKeywords),
  })),
  ...PRODUCTIVE_PACKAGE_GUIDES.map((pkg) => ({
    title: pkg.name,
    route: pkg.route,
    kind: 'package' as const,
    eyebrow: 'public package',
    summary: pkg.purpose,
    tags: buildSearchEntryTags(pkg.name, pkg.importPath, pkg.purpose, ...pkg.highlights),
  })),
  ...PRODUCTIVE_GUIDE_CARDS.map((guide) => ({
    title: guide.title,
    route: '/guides',
    kind: 'guide' as const,
    eyebrow: 'guide',
    summary: guide.summary,
    tags: buildSearchEntryTags(guide.title, guide.summary, guide.sourcePath, ...guide.bullets),
  })),
  ...PRODUCTIVE_RELEASE_ASSETS.map((asset) => ({
    title: asset.title,
    route: '/release',
    kind: 'release' as const,
    eyebrow: 'release asset',
    summary: asset.summary,
    tags: buildSearchEntryTags(asset.title, asset.summary, asset.sourcePath),
  })),
];

function normalizeQueryTokens(query: string): readonly string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

function includesAllTokens(haystack: string, tokens: readonly string[]): boolean {
  return tokens.every((token) => haystack.includes(token));
}

function scoreSearchEntry(entry: DocsSearchEntry, tokens: readonly string[]): number {
  const title = entry.title.toLowerCase();
  const summary = entry.summary.toLowerCase();
  const tags = entry.tags.join(' ').toLowerCase();
  const query = tokens.join(' ');

  let score = entry.kind === 'component' ? 4 : 0;

  if (title === query) {
    score += 120;
  }

  if (title.startsWith(query)) {
    score += 60;
  }

  if (title.includes(query)) {
    score += 28;
  }

  if (summary.includes(query)) {
    score += 16;
  }

  if (tags.includes(query)) {
    score += 20;
  }

  score += tokens.reduce((total, token) => total + (title.includes(token) ? 10 : 0), 0);
  score += tokens.reduce((total, token) => total + (tags.includes(token) ? 6 : 0), 0);

  return score;
}

function getMatchedFields(entry: DocsSearchEntry, tokens: readonly string[]): readonly string[] {
  if (tokens.length === 0) {
    return ['recommended'];
  }

  const fields = [
    ['title', entry.title],
    ['summary', entry.summary],
    ['family', entry.family ?? entry.eyebrow],
    ['category', entry.category ?? ''],
    ['interaction', entry.interaction ?? ''],
    ['tags', entry.tags.join(' ')],
  ] as const;

  return fields
    .filter(([, value]) => {
      const normalizedValue = value.toLowerCase();
      return tokens.some((token) => normalizedValue.includes(token));
    })
    .map(([field]) => field);
}

function matchesSearchOptions(entry: DocsSearchEntry, options: DocsSearchOptions): boolean {
  const kind = options.kind ?? 'all';
  const family = options.family ?? 'all';
  const category = options.category ?? 'all';

  return (kind === 'all' || entry.kind === kind)
    && (family === 'all' || entry.family === family)
    && (category === 'all' || entry.category === category);
}

export function searchDocsAdvanced(query: string, options: DocsSearchOptions = {}): readonly DocsSearchResult[] {
  const tokens = normalizeQueryTokens(query);
  const limit = options.limit ?? PRODUCTIVE_SEARCH_ENTRIES.length;

  return PRODUCTIVE_SEARCH_ENTRIES.map((entry) => {
    const haystack = `${entry.title} ${entry.summary} ${entry.eyebrow} ${entry.family ?? ''} ${entry.category ?? ''} ${entry.interaction ?? ''} ${entry.tags.join(' ')}`.toLowerCase();
    const matches = tokens.length === 0 || includesAllTokens(haystack, tokens);

    return {
      ...entry,
      matches,
      score: scoreSearchEntry(entry, tokens),
      matchedFields: getMatchedFields(entry, tokens),
    };
  })
    .filter((candidate) => candidate.matches && matchesSearchOptions(candidate, options))
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .slice(0, limit);
}

export function searchDocs(query: string, limit = PRODUCTIVE_SEARCH_ENTRIES.length): readonly DocsSearchEntry[] {
  const tokens = normalizeQueryTokens(query);

  if (tokens.length === 0) {
    return [];
  }

  return searchDocsAdvanced(query, { limit });
}

export function searchProductiveComponents(query: string): readonly ProductiveComponentDoc[] {
  const tokens = normalizeQueryTokens(query);

  if (tokens.length === 0) {
    return PRODUCTIVE_COMPONENT_DOCS;
  }

  return PRODUCTIVE_COMPONENT_DOCS.filter((component) => {
    const haystack = `${component.name} ${component.family} ${component.summary} ${component.selector} ${component.category} ${component.interaction} ${component.searchKeywords.join(' ')}`.toLowerCase();
    return includesAllTokens(haystack, tokens);
  });
}
