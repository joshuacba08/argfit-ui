export type DocsRoutePath = '/overview' | '/components' | '/api' | '/guides' | '/release';

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
  readonly importPath: string;
  readonly purpose: string;
  readonly highlights: readonly string[];
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
    eyebrow: 'Get started',
    description: 'Quickstart, product posture and the shape of the 1.0 contract.',
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
    route: '/overview',
    sourcePath: 'docs/productive/quickstart.md',
    summary: 'Bootstrap, package posture and the local validation flow for the productive contract.',
    badge: 'start',
    bullets: ['Angular 21 standalone app', 'Adaptive-first imports', 'release:production:check as the real gate'],
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
    sourcePath: 'docs/productive/release-notes-1-0.md',
    summary: 'The release shape of 1.0, from frozen scope through the production gate.',
    badge: 'ship',
    bullets: ['Scope and semver policy', 'Quality gates and budgets', 'Final publish still aligns later in roadmap'],
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
    components: ['AfCheckbox', 'AfDatePicker', 'AfField', 'AfFieldset', 'AfIconField', 'AfInputCount', 'AfInputGroup', 'AfListbox', 'AfMultiSelect', 'AfPassword', 'AfRadioGroup', 'AfSegmentedControl', 'AfSelect', 'AfTextarea', 'AfToggle'],
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
    importPath: '@argfit-ui/core',
    purpose: 'Bootstrap, theme runtime, platform runtime, toast service and the shared ArgFit-owned type families.',
    highlights: ['provideArgfitUi', 'AfThemeService', 'AfPlatformService', 'AfToastService', 'Shared types for chart, data table, feedback and workflow'],
  },
  {
    name: '@argfit-ui/primitives',
    importPath: '@argfit-ui/primitives',
    purpose: 'Vendor-agnostic accessibility helpers and low-level building blocks.',
    highlights: ['AfVisuallyHiddenComponent', 'AfFocusTrapDirective', 'AfFocusInitialDirective', 'AfEscapeKeyDirective', 'AfIconComponent'],
  },
  {
    name: '@argfit-ui/adaptive',
    importPath: '@argfit-ui/adaptive',
    purpose: 'The recommended application-facing package: semantic components that choose the correct renderer for the current platform.',
    highlights: ['Foundation surfaces', 'Feedback and overlays', 'Forms and selection', 'Data and workflow', 'Layout and navigation'],
  },
  {
    name: '@argfit-ui/desktop',
    importPath: '@argfit-ui/desktop',
    purpose: 'Renderer-specific desktop surfaces for intentional integration paths, not the default application contract.',
    highlights: ['PrimeNG remains internal', 'Opt-in path only', 'Useful for infrastructure-specific examples', 'Secondary to adaptive imports'],
  },
  {
    name: '@argfit-ui/mobile',
    importPath: '@argfit-ui/mobile',
    purpose: 'Renderer-specific mobile surfaces for intentional integration and testing paths.',
    highlights: ['Ionic remains internal', 'Touch-first renderer path', 'Opt-in only', 'Still secondary to adaptive imports'],
  },
];

export const PRODUCTIVE_GUIDE_CARDS: readonly ProductiveGuideCard[] = [
  {
    title: 'Accessibility posture',
    sourcePath: 'docs/productive/accessibility.md',
    summary: 'Focus, keyboard, live-region and mobile disclosure rules for the 1.0 contract.',
    bullets: ['WCAG AA baseline', 'Dialog and drawer focus return', 'Severity-driven feedback semantics'],
  },
  {
    title: 'Theming and adaptive runtime',
    sourcePath: 'docs/productive/theming.md',
    summary: 'Theme bootstrap, token contract and platform preference behavior.',
    bullets: ['Dark and light shipped themes', 'Token-first overrides', 'No vendor-selector dependency'],
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
    title: 'Release notes',
    sourcePath: 'docs/productive/release-notes-1-0.md',
    summary: 'The target release story for 1.0 and the hardening already landed in the repo.',
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
