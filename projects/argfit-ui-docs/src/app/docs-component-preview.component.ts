import { DOCUMENT, NgComponentOutlet, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocsCodeBlockComponent } from './shared/code-block.component';

import {
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardSubtitleDirective,
    AfCardTitleDirective,
    AfChart,
    AfDataTable,
    AfDataTableCellDirective,
    AfDataTableExpandedRowDirective,
    AfDataTableToolbarDirective,
    AfDataView,
    AfDataViewActionsDirective,
    AfDialog,
    AfDialogContentDirective,
    AfDialogFooterDirective,
    AfDivider,
    AfDrawer,
    AfIconField,
    AfIconFieldControlDirective,
    AfIconFieldPrefixDirective,
    AfIconFieldSuffixDirective,
    AfInputGroup,
    AfInputGroupControlDirective,
    AfInputGroupPrefixDirective,
    AfInputGroupSuffixDirective,
    AfKanban,
    AfMultiSelect,
    AfOrderList,
    AfOrderListActionsDirective,
    AfOrderListItemDirective,
    AfOrganizationChart,
    AfOrganizationChartActionsDirective,
    AfOrganizationChartNodeDirective,
    AfPageShell,
    AfPageShellActionsDirective,
    AfPageShellBrandDirective,
    AfPageShellFooterDirective,
    AfPageShellUserDirective,
    AfPaginator,
    AfPanel,
    AfPickList,
    AfPickListActionsDirective,
    AfPickListItemDirective,
    AfPopover,
    AfPopoverContentDirective,
    AfPopoverTriggerDirective,
    AfScrollPanel,
    AfSplitter,
    AfSplitterPrimaryDirective,
    AfSplitterSecondaryDirective,
    AfStepPanelDirective,
    AfStepper,
    AfTabPanelDirective,
    AfTabs,
    AfToastViewport,
    AfToolbar,
    AfToolbarCenterDirective,
    AfToolbarEndDirective,
    AfToolbarStartDirective,
    AfTooltip,
} from '@argfit-ui/adaptive';
import type {
    AfBreadcrumbItem,
    AfCardDensity,
    AfCardTone,
    AfCardVariant,
    AfChartDensity,
    AfChartIndicator,
    AfChartPointEvent,
    AfChartSeries,
    AfChartTone,
    AfChartType,
    AfDataTableColumn,
    AfDataTableDensity,
    AfDataTablePageChange,
    AfDataTablePagination,
    AfDataTableSelectionMode,
    AfDataTableSort,
    AfDataViewDensity,
    AfDataViewItem,
    AfDataViewLayout,
    AfDialogMobilePresentation,
    AfDialogSize,
    AfDialogTone,
    AfDividerOrientation,
    AfDividerTone,
    AfDrawerPlacement,
    AfDrawerSize,
    AfDrawerTone,
    AfFeedbackSeverity,
    AfFieldDensity,
    AfFieldLabelMode,
    AfFieldState,
    AfKanbanAddCardEvent,
    AfKanbanCard,
    AfKanbanCardClickEvent,
    AfKanbanColumn,
    AfKanbanColumnActionEvent,
    AfKanbanDensity,
    AfKanbanFilter,
    AfKanbanFilterChange,
    AfKanbanMoveEvent,
    AfNavigationItem,
    AfOrderListDensity,
    AfOrderListItem,
    AfOrderListReorderChange,
    AfOrderListSelectedIds,
    AfOrderListSelectionMode,
    AfOrganizationChartDensity,
    AfOrganizationChartExpandedIds,
    AfOrganizationChartNode,
    AfOrganizationChartSelectedIds,
    AfOrganizationChartSelectionMode,
    AfPageShellDensity,
    AfPageShellVariant,
    AfPaginatorDensity,
    AfPaginatorPageChange,
    AfPickListChange,
    AfPickListDensity,
    AfPickListItem,
    AfPickListSelectedIds,
    AfPopoverPlacement,
    AfPopoverTone,
    AfScrollPanelDirection,
    AfSectionDensity,
    AfSelectionDensity,
    AfSplitterOrientation,
    AfStepChange,
    AfStepItem,
    AfStepperDensity,
    AfSurfaceTone,
    AfTabChange,
    AfTabItem,
    AfTabsDensity,
    AfToastPlacement,
    AfToolbarDensity,
    AfTooltipPlacement,
    AfTooltipTone,
} from '@argfit-ui/core';
import {
    AfToastService,
} from '@argfit-ui/core';

import type { ProductiveComponentApiAttribute, ProductiveComponentDoc, ProductiveComponentVariation } from './docs-data';

interface PreviewBar {
  readonly label: string;
  readonly width: number;
}

interface PreviewDataTableRow {
  readonly id: string;
  readonly surface: string;
  readonly status: string;
  readonly owner: string;
  readonly detail: string;
}

type PreviewMode = 'canvas' | 'blueprint' | 'contract';
type AvatarPresentationMode = 'photo' | 'initials' | 'icon';

const AVATAR_PRESENTATION_VALUES: readonly AvatarPresentationMode[] = ['photo', 'initials', 'icon'];

const LIVE_RENDER_BLOCKLIST = new Set([
  'AfDialog',
  'AfDrawer',
  'AfPageShell',
  'AfPopover',
  'AfToast',
  'AfToastViewport',
  'AfTooltip',
]);

const SAMPLE_OPTIONS = [
  { value: 'pipeline', label: 'Pipeline', hint: 'Release automation' },
  { value: 'forms', label: 'Forms', hint: 'Dense editing' },
  { value: 'analytics', label: 'Analytics', hint: 'Executive summary' },
];

const SAMPLE_COLUMNS = [
  { key: 'surface', header: 'Surface', sortable: true, mobilePriority: 'primary' },
  { key: 'status', header: 'Status', sortable: true, mobilePriority: 'secondary' },
  { key: 'owner', header: 'Owner', mobilePriority: 'tertiary' },
];

const SAMPLE_ROWS = [
  { id: 'shell', surface: 'Page shell', status: 'Stable', owner: 'Platform' },
  { id: 'table', surface: 'Data table', status: 'Ready', owner: 'Ops' },
  { id: 'forms', surface: 'Form controls', status: 'Active', owner: 'Product' },
];

const SAMPLE_COLLECTION_ITEMS = [
  { id: 'insight', title: 'Insight queue', label: 'Insight queue', description: 'Operational review lane', meta: '12 checks', badge: { label: 'ready', tone: 'success' } },
  { id: 'workflow', title: 'Workflow polish', label: 'Workflow polish', description: 'Field task states', meta: '5 active', badge: { label: 'live', tone: 'primary' } },
  { id: 'release', title: 'Release gate', label: 'Release gate', description: 'Budget and API check', meta: 'green', badge: { label: 'ship', tone: 'accent' } },
];

const SAMPLE_ACCORDION_ITEMS = [
  { id: 'evaluation', label: 'Evaluation flow', description: 'Review density, keyboard behavior and adaptive panel content.', meta: '3 checks', badge: { label: 'open', tone: 'primary' } },
  { id: 'accessibility', label: 'Accessibility pass', description: 'Validate headings, focus order and region announcements before release.', meta: 'AA ready', badge: { label: 'a11y', tone: 'success' } },
  { id: 'release', label: 'Release notes', description: 'Confirm public inputs, emitted events and migration notes for consumers.', meta: 'beta+', badge: { label: 'ship', tone: 'accent' } },
];

const SAMPLE_AVATAR_IMAGE_URL = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop';

const AVATAR_PRESENTATION_VARIATION: ProductiveComponentVariation = {
  attribute: 'presentation',
  label: 'content source',
  values: AVATAR_PRESENTATION_VALUES,
  summary: 'Switch between photo, initials and icon fallback rendering.',
};

const SAMPLE_TREE_NODES = [
  {
    id: 'platform',
    label: 'Platform',
    title: 'Platform lead',
    description: 'Adaptive runtime',
    badge: { label: 'core', tone: 'primary' },
    children: [
      { id: 'desktop', label: 'Desktop', title: 'Dense renderer', description: 'PrimeNG internal' },
      { id: 'mobile', label: 'Mobile', title: 'Touch renderer', description: 'Ionic internal' },
    ],
  },
];

const SAMPLE_KANBAN_COLUMNS = [
  { id: 'queued', label: 'Queued', description: 'Ready for grooming', badge: { label: '1', tone: 'neutral' } },
  { id: 'active', label: 'Active', description: 'Currently shipping', badge: { label: '1', tone: 'primary' } },
  { id: 'done', label: 'Validated', description: 'Ready to release', badge: { label: '1', tone: 'success' } },
] satisfies readonly AfKanbanColumn[];

const SAMPLE_KANBAN_CARDS = [
  {
    id: 'card-1',
    columnId: 'queued',
    title: 'API table polish',
    description: 'Ship density and sorting docs preview.',
    category: 'docs',
    priority: 'medium',
    assigneeName: 'ArgFit',
    assigneeInitials: 'AF',
    dateLabel: 'Today',
    meta: 'docs',
  },
  {
    id: 'card-2',
    columnId: 'active',
    title: 'Interactive preview',
    description: 'Wire event-driven docs demos.',
    category: 'live',
    priority: 'high',
    assigneeName: 'ArgFit',
    assigneeInitials: 'UI',
    dateLabel: 'Today',
    meta: 'live',
  },
  {
    id: 'card-3',
    columnId: 'done',
    title: 'Budget gate',
    description: 'Keep build and API checks green.',
    category: 'release',
    priority: 'low',
    assigneeName: 'ArgFit',
    assigneeInitials: 'QA',
    dateLabel: 'Today',
    meta: 'green',
  },
] satisfies readonly AfKanbanCard[];

const PREVIEW_KANBAN_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'docs', label: 'Docs' },
  { id: 'live', label: 'Live' },
  { id: 'release', label: 'Release' },
] satisfies readonly AfKanbanFilter[];

const SAMPLE_FILTERS = [
  { id: 'all', label: 'All', count: 9 },
  { id: 'active', label: 'Active', count: 2 },
];

const SAMPLE_CATEGORIES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SAMPLE_SERIES = [
  { name: 'Adoption', data: [42, 54, 61, 74, 88], tone: 'primary' },
  { name: 'Quality', data: [62, 68, 73, 81, 94], tone: 'success' },
];
const SAMPLE_INDICATORS = [
  { name: 'Density', max: 100 },
  { name: 'A11y', max: 100 },
  { name: 'API', max: 100 },
  { name: 'Mobile', max: 100 },
];

const SAMPLE_NAV_ITEMS: readonly AfNavigationItem[] = [
  { id: 'overview', label: 'Overview', badge: 'live' },
  { id: 'components', label: 'Components', badge: 57 },
  { id: 'release', label: 'Release' },
];

const SAMPLE_BREADCRUMBS: readonly AfBreadcrumbItem[] = [
  { id: 'docs', label: 'Docs' },
  { id: 'components', label: 'Components' },
];

const PREVIEW_CHART_TYPES: readonly AfChartType[] = [
  'line',
  'area',
  'bar',
  'stacked-bar',
  'horizontal-bar',
  'sparkline',
  'donut',
  'gauge',
  'radar',
  'heatmap',
  'boxplot',
  'parallel',
];

const PREVIEW_CHART_CARTESIAN_CATEGORIES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PREVIEW_CHART_CARTESIAN_SERIES = [
  { name: 'Adoption', data: [42, 54, 61, 74, 80, 88], tone: 'primary' },
  { name: 'Quality', data: [58, 64, 69, 76, 85, 91], tone: 'success' },
] satisfies readonly AfChartSeries[];
const PREVIEW_CHART_SPARKLINE_CATEGORIES = ['t-5', 't-4', 't-3', 't-2', 't-1', 't-0'];
const PREVIEW_CHART_SPARKLINE_SERIES = [
  { name: 'Latency', data: [42, 40, 39, 37, 35, 34], tone: 'warning' },
] satisfies readonly AfChartSeries[];
const PREVIEW_CHART_DONUT_SERIES = [
  {
    name: 'Sessions',
    data: [
      { label: 'CMJ', value: 42 },
      { label: 'SJ', value: 20 },
      { label: 'DJ', value: 16 },
      { label: 'Sprint', value: 9 },
    ],
  },
] satisfies readonly AfChartSeries[];
const PREVIEW_CHART_GAUGE_INDICATORS = [
  { name: 'Performance score', min: 0, max: 100 },
] satisfies readonly AfChartIndicator[];
const PREVIEW_CHART_GAUGE_SERIES = [
  { name: 'Performance score', data: [78], tone: 'primary' },
] satisfies readonly AfChartSeries[];
const PREVIEW_CHART_RADAR_INDICATORS = [
  { name: 'Jump', max: 100 },
  { name: 'Power', max: 100 },
  { name: 'Symmetry', max: 100 },
  { name: 'RSI', max: 100 },
  { name: 'Load', max: 100 },
] satisfies readonly AfChartIndicator[];
const PREVIEW_CHART_RADAR_SERIES = [
  { name: 'Starter', data: [82, 78, 71, 76, 68], tone: 'primary' },
  { name: 'Validated', data: [89, 84, 76, 82, 74], tone: 'success' },
] satisfies readonly AfChartSeries[];
const PREVIEW_CHART_HEATMAP_CATEGORIES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PREVIEW_CHART_HEATMAP_SERIES = [
  { name: 'Ops', data: [4, 6, 7, 5, 8], tone: 'primary' },
  { name: 'QA', data: [5, 4, 8, 6, 7], tone: 'success' },
  { name: 'Docs', data: [3, 5, 6, 7, 6], tone: 'warning' },
] satisfies readonly AfChartSeries[];
const PREVIEW_CHART_BOXPLOT_SERIES = [
  { name: 'Explosive', data: [38, 40, 41, 44, 46, 47, 49], tone: 'primary' },
  { name: 'Stable', data: [32, 34, 35, 36, 37, 39, 41], tone: 'success' },
  { name: 'Recovery', data: [26, 28, 29, 31, 33, 34, 36], tone: 'warning' },
] satisfies readonly AfChartSeries[];
const PREVIEW_CHART_PARALLEL_INDICATORS = [
  { name: 'Jump', min: 30, max: 60 },
  { name: 'Force', min: 2000, max: 3600 },
  { name: 'Contact', min: 0.25, max: 0.42 },
  { name: 'RSI', min: 0.9, max: 1.8 },
  { name: 'Load', min: 0, max: 100 },
] satisfies readonly AfChartIndicator[];
const PREVIEW_CHART_PARALLEL_SERIES = [
  {
    name: 'Athletes',
    data: [
      { label: 'Maya', value: [45, 2840, 0.34, 1.32, 72] },
      { label: 'Lucas', value: [52, 3120, 0.31, 1.45, 81] },
      { label: 'Paula', value: [44, 2710, 0.33, 1.28, 69] },
    ],
    tone: 'primary',
  },
] satisfies readonly AfChartSeries[];

const PREVIEW_DATA_TABLE_COLUMNS = [
  { key: 'surface', header: 'Surface', sortable: true, minWidth: '190px', mobilePriority: 'primary' },
  { key: 'status', header: 'Status', sortable: true, minWidth: '120px', mobilePriority: 'secondary' },
  { key: 'owner', header: 'Owner', sortable: true, minWidth: '120px', mobilePriority: 'secondary' },
] satisfies readonly AfDataTableColumn<PreviewDataTableRow>[];

const PREVIEW_DATA_TABLE_ROWS = [
  {
    id: 'shell',
    surface: 'Page shell',
    status: 'stable',
    owner: 'Platform',
    detail: 'Navigation, search and shell actions share one adaptive contract.',
  },
  {
    id: 'table',
    surface: 'Data table',
    status: 'ready',
    owner: 'Ops',
    detail: 'Paged reading, sorting and row details stay visible in dense staff workflows.',
  },
  {
    id: 'forms',
    surface: 'Form controls',
    status: 'active',
    owner: 'Product',
    detail: 'Field validation and layout density are tuned for operational editing.',
  },
  {
    id: 'feedback',
    surface: 'Feedback stack',
    status: 'live',
    owner: 'QA',
    detail: 'Inline and global feedback remain consistent across desktop and mobile.',
  },
] satisfies readonly PreviewDataTableRow[];

const PREVIEW_DATA_VIEW_ITEMS = [
  {
    id: 'insight',
    title: 'Insight queue',
    eyebrow: '12 checks',
    description: 'Operational review lane',
    meta: 'today',
    badge: { label: 'ready', tone: 'success' },
  },
  {
    id: 'workflow',
    title: 'Workflow polish',
    eyebrow: '5 active',
    description: 'Field task states',
    meta: 'live',
    badge: { label: 'live', tone: 'primary' },
  },
  {
    id: 'release',
    title: 'Release gate',
    eyebrow: 'green',
    description: 'Budget and API check',
    meta: 'ship',
    badge: { label: 'ship', tone: 'accent' },
  },
] satisfies readonly AfDataViewItem[];

const PREVIEW_ORDER_LIST_ITEMS = [
  {
    id: 'insight',
    label: 'Insight queue',
    description: 'Operational review lane',
    meta: '12 checks',
    badge: { label: 'ready', tone: 'success' },
  },
  {
    id: 'workflow',
    label: 'Workflow polish',
    description: 'Field task states',
    meta: '5 active',
    badge: { label: 'live', tone: 'primary' },
  },
  {
    id: 'release',
    label: 'Release gate',
    description: 'Budget and API check',
    meta: 'green',
    badge: { label: 'ship', tone: 'accent' },
  },
] satisfies readonly AfOrderListItem[];

const PREVIEW_ORGANIZATION_CHART_NODES = [
  {
    id: 'platform',
    label: 'Platform',
    title: 'Platform lead',
    description: 'Adaptive runtime',
    meta: '3 squads',
    avatarLabel: 'PL',
    badge: { label: 'core', tone: 'primary' },
    children: [
      {
        id: 'desktop',
        label: 'Desktop',
        title: 'Dense renderer',
        description: 'PrimeNG internal',
        meta: '2 maintainers',
        avatarLabel: 'DS',
      },
      {
        id: 'mobile',
        label: 'Mobile',
        title: 'Touch renderer',
        description: 'Ionic internal',
        meta: '2 maintainers',
        avatarLabel: 'MO',
      },
      {
        id: 'docs',
        label: 'Docs',
        title: 'Consumer enablement',
        description: 'Public API guidance',
        meta: 'ship ready',
        avatarLabel: 'DX',
        badge: { label: 'live', tone: 'success' },
      },
    ],
  },
] satisfies readonly AfOrganizationChartNode[];

const PREVIEW_PICK_LIST_SOURCE_ITEMS = [
  {
    id: 'insight',
    label: 'Insight queue',
    description: 'Operational review lane',
    meta: '12 checks',
    badge: { label: 'ready', tone: 'success' },
  },
  {
    id: 'workflow',
    label: 'Workflow polish',
    description: 'Field task states',
    meta: '5 active',
    badge: { label: 'live', tone: 'primary' },
  },
] satisfies readonly AfPickListItem[];

const PREVIEW_PICK_LIST_TARGET_ITEMS = [
  {
    id: 'release',
    label: 'Release gate',
    description: 'Budget and API check',
    meta: 'green',
    badge: { label: 'ship', tone: 'accent' },
  },
] satisfies readonly AfPickListItem[];

const PREVIEW_TABS_ITEMS = [
  {
    id: 'insight',
    label: 'Insight queue',
    description: 'Operational review lane',
    badge: { label: 'ready', tone: 'success' },
  },
  {
    id: 'workflow',
    label: 'Workflow polish',
    description: 'Field task states',
    badge: { label: 'live', tone: 'primary' },
  },
  {
    id: 'release',
    label: 'Release gate',
    description: 'Budget and API check',
    badge: { label: 'ship', tone: 'accent' },
  },
] satisfies readonly AfTabItem[];

const PREVIEW_STEPPER_STEPS = [
  { id: 'scope', label: 'Scope', description: 'Define the preview contract.' },
  { id: 'wire', label: 'Wire outputs', description: 'Connect stateful events and slots.' },
  { id: 'ship', label: 'Ship', description: 'Validate the docs workbench behavior.' },
] satisfies readonly AfStepItem[];

@Component({
  selector: 'app-docs-component-preview',
  imports: [
    NgComponentOutlet,
    NgFor,
    RouterLink,
    DocsCodeBlockComponent,
    AfChart,
    AfCard,
    AfCardHeaderDirective,
    AfCardEyebrowDirective,
    AfCardTitleDirective,
    AfCardSubtitleDirective,
    AfCardContentDirective,
    AfCardFooterDirective,
    AfDataTable,
    AfDataTableCellDirective,
    AfDataTableExpandedRowDirective,
    AfDataTableToolbarDirective,
    AfDataView,
    AfDataViewActionsDirective,
    AfDivider,
    AfDialog,
    AfDialogContentDirective,
    AfDialogFooterDirective,
    AfDrawer,
    AfIconField,
    AfIconFieldPrefixDirective,
    AfIconFieldControlDirective,
    AfIconFieldSuffixDirective,
    AfInputGroup,
    AfInputGroupPrefixDirective,
    AfInputGroupControlDirective,
    AfInputGroupSuffixDirective,
    AfKanban,
    AfMultiSelect,
    AfOrderList,
    AfOrderListActionsDirective,
    AfOrderListItemDirective,
    AfOrganizationChart,
    AfOrganizationChartActionsDirective,
    AfOrganizationChartNodeDirective,
    AfPanel,
    AfPageShell,
    AfPageShellBrandDirective,
    AfPageShellActionsDirective,
    AfPageShellUserDirective,
    AfPageShellFooterDirective,
    AfPaginator,
    AfPickList,
    AfPickListActionsDirective,
    AfPickListItemDirective,
    AfPopover,
    AfPopoverTriggerDirective,
    AfPopoverContentDirective,
    AfScrollPanel,
    AfTabPanelDirective,
    AfTabs,
    AfStepPanelDirective,
    AfStepper,
    AfSplitter,
    AfSplitterPrimaryDirective,
    AfSplitterSecondaryDirective,
    AfToastViewport,
    AfToolbar,
    AfToolbarCenterDirective,
    AfToolbarEndDirective,
    AfToolbarStartDirective,
    AfTooltip,
  ],
  template: `
    @if (component(); as component) {
      <section
        class="docs-live-lab"
        [attr.data-component]="component.slug"
        [class.docs-live-lab--compact]="compact()"
        [class.docs-live-lab--forms]="component.family.includes('Forms')"
        [class.docs-live-lab--data]="component.family.includes('Data')"
        [class.docs-live-lab--overlay]="component.family.includes('Overlay')"
      >
        <header class="docs-live-lab__header">
          <div>
            <span class="docs-kicker">Interactive lab</span>
            <h2>{{ component.name }}</h2>
          </div>
          <div class="docs-live-lab__header-actions">
            @if (!compact()) {
              <div class="docs-live-lab__view-switch" aria-label="Preview view mode">
                <button type="button" [class.is-active]="viewMode() === 'canvas'" (click)="setViewMode('canvas')">Canvas</button>
                <button type="button" [class.is-active]="viewMode() === 'blueprint'" (click)="setViewMode('blueprint')">Blueprint</button>
                <button type="button" [class.is-active]="viewMode() === 'contract'" (click)="setViewMode('contract')">Contract</button>
              </div>
              <a [routerLink]="component.route" class="docs-live-lab__route">{{ component.selector }}</a>
            } @else {
              <a [routerLink]="component.route" class="docs-live-lab__route" [attr.aria-label]="'Open ' + component.name + ' documentation'">{{ component.selector }}</a>
            }
          </div>
        </header>

        <div
          class="docs-live-lab__workspace"
          [class.docs-live-lab__workspace--blueprint]="viewMode() === 'blueprint'"
          [class.docs-live-lab__workspace--hidden]="viewMode() === 'contract' && !compact()"
        >
          <div class="docs-live-lab__preview" (click)="handlePreviewClick($event)" (keyup.enter)="recordInteraction('keyboard preview')" tabindex="0">
            <div class="docs-live-lab__preview-top">
              <span>Live preview</span>
              <b>{{ component.category }}</b>
            </div>
            @if (component.name === 'AfCard') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-card-demo" (click)="$event.stopPropagation()">
                  <af-card
                    [variant]="cardVariant()"
                    [density]="cardDensity()"
                    [tone]="cardTone()"
                    [interactive]="booleanValue('interactive')"
                    [selected]="booleanValue('selected')"
                    (pressed)="onCardPressed($event)"
                  >
                    <header afCardHeader>
                      <div>
                        <span afCardEyebrow>Release surface</span>
                        <h3 afCardTitle>Product health</h3>
                        <p afCardSubtitle>Interactive card contract</p>
                      </div>
                      <span class="docs-card-demo__badge">{{ booleanValue('selected') ? 'Selected' : 'Ready' }}</span>
                    </header>

                    <div afCardContent>
                      <div class="docs-card-demo__metric">
                        <strong>94%</strong>
                        <span>API coverage</span>
                      </div>
                      <p>
                        This preview uses the real card slots and emits <code>pressed</code> when interactive mode is enabled.
                      </p>
                    </div>

                    <footer afCardFooter>
                      <span>{{ cardAction() }}</span>
                      <strong>{{ cardVariant() }} · {{ cardTone() }}</strong>
                    </footer>
                  </af-card>
                </div>
              </div>
            } @else if (component.name === 'AfDivider') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-divider-demo" (click)="$event.stopPropagation()">
                  <div class="docs-divider-demo__status" aria-live="polite">
                    <strong>{{ dividerOrientation() }} divider</strong>
                    <span>{{ dividerTone() }} tone</span>
                  </div>

                  @if (dividerOrientation() === 'horizontal') {
                    <div class="docs-divider-demo__stack">
                      <div class="docs-divider-demo__surface">Release scope</div>
                      <af-divider label="Workflow boundary" [orientation]="dividerOrientation()" [tone]="dividerTone()" />
                      <div class="docs-divider-demo__surface">Validation notes</div>
                    </div>
                  } @else {
                    <div class="docs-divider-demo__row">
                      <div class="docs-divider-demo__surface docs-divider-demo__surface--wide">Preview</div>
                      <af-divider label="Split" [orientation]="dividerOrientation()" [tone]="dividerTone()" />
                      <div class="docs-divider-demo__surface docs-divider-demo__surface--wide">Catalog</div>
                    </div>
                  }
                </div>
              </div>
            } @else if (component.name === 'AfPanel') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-panel-demo" (click)="$event.stopPropagation()">
                  <div class="docs-panel-demo__status" aria-live="polite">
                    <strong>{{ panelTone() }}</strong>
                    <span>{{ panelDensity() }} density</span>
                  </div>

                  <af-panel
                    eyebrow="Live workbench"
                    heading="Release cockpit"
                    description="Grouped context for the current workflow."
                    [density]="panelDensity()"
                    [tone]="panelTone()"
                  >
                    <div class="docs-panel-demo__content">
                      <div>
                        <span>Focus</span>
                        <strong>Adaptive preview quality</strong>
                      </div>
                      <p>Panels should group related signals, actions and supporting copy into one readable surface.</p>
                    </div>
                  </af-panel>
                </div>
              </div>
            } @else if (component.name === 'AfScrollPanel') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-scroll-panel-demo" (click)="$event.stopPropagation()">
                  <div class="docs-scroll-panel-demo__status" aria-live="polite">
                    <strong>{{ scrollPanelDirection() }} scroll region</strong>
                    <span>Focus and scroll inside the viewport.</span>
                  </div>

                  <af-scroll-panel
                    [direction]="scrollPanelDirection()"
                    maxHeight="15rem"
                    ariaLabel="Preview scroll panel"
                  >
                    @if (scrollPanelDirection() === 'vertical') {
                      <div class="docs-scroll-panel-demo__stack">
                        @for (item of previewDataViewItems; track item.id) {
                          <article class="docs-scroll-panel-demo__card">
                            <strong>{{ item.title }}</strong>
                            <span>{{ item.description }}</span>
                          </article>
                        }
                        @for (item of previewDataViewItems; track item.id + '-repeat' ) {
                          <article class="docs-scroll-panel-demo__card">
                            <strong>{{ item.title }}</strong>
                            <span>{{ item.description }}</span>
                          </article>
                        }
                      </div>
                    } @else {
                      <div class="docs-scroll-panel-demo__row" [attr.data-direction]="scrollPanelDirection()">
                        @for (item of previewDataViewItems; track item.id) {
                          <article class="docs-scroll-panel-demo__card docs-scroll-panel-demo__card--wide">
                            <strong>{{ item.title }}</strong>
                            <span>{{ item.description }}</span>
                          </article>
                        }
                        @for (item of previewDataViewItems; track item.id + '-repeat-row' ) {
                          <article class="docs-scroll-panel-demo__card docs-scroll-panel-demo__card--wide">
                            <strong>{{ item.title }}</strong>
                            <span>{{ item.description }}</span>
                          </article>
                        }
                      </div>
                    }
                  </af-scroll-panel>
                </div>
              </div>
            } @else if (component.name === 'AfStepper') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-stepper-demo" (click)="$event.stopPropagation()">
                  <div class="docs-stepper-demo__status" aria-live="polite">
                    <strong>{{ stepperActiveId() }}</strong>
                    <span>{{ stepperAction() }}</span>
                  </div>

                  <af-stepper
                    [steps]="previewStepperSteps"
                    [activeId]="stepperActiveId()"
                    [density]="stepperDensity()"
                    [linear]="booleanValue('linear')"
                    [disabled]="booleanValue('disabled')"
                    ariaLabel="Preview stepper"
                    (activeIdChange)="setStepperActiveId($event)"
                    (stepChange)="recordStepperChange($event)"
                  >
                    <ng-template afStepPanel="scope" let-step="step">
                      <div class="docs-stepper-demo__panel">
                        <span>Step</span>
                        <strong>{{ step.label }}</strong>
                        <p>{{ step.description }}</p>
                      </div>
                    </ng-template>

                    <ng-template afStepPanel="wire" let-step="step">
                      <div class="docs-stepper-demo__panel">
                        <span>Step</span>
                        <strong>{{ step.label }}</strong>
                        <p>{{ step.description }}</p>
                      </div>
                    </ng-template>

                    <ng-template afStepPanel="ship" let-step="step">
                      <div class="docs-stepper-demo__panel">
                        <span>Step</span>
                        <strong>{{ step.label }}</strong>
                        <p>{{ step.description }}</p>
                      </div>
                    </ng-template>
                  </af-stepper>
                </div>
              </div>
            } @else if (component.name === 'AfTabs') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-tabs-demo" (click)="$event.stopPropagation()">
                  <div class="docs-tabs-demo__status" aria-live="polite">
                    <strong>{{ tabsActiveId() }}</strong>
                    <span>{{ tabsAction() }}</span>
                  </div>

                  <af-tabs
                    [items]="previewTabsItems"
                    [activeId]="tabsActiveId()"
                    [density]="tabsDensity()"
                    [disabled]="booleanValue('disabled')"
                    ariaLabel="Preview tabs"
                    (activeIdChange)="setTabsActiveId($event)"
                    (tabChange)="recordTabChange($event)"
                  >
                    <ng-template afTabPanel="insight" let-item="item">
                      <div class="docs-tabs-demo__panel">
                        <span>{{ item.label }}</span>
                        <strong>{{ item.description }}</strong>
                        <p>Keep peer views close to the current workflow without leaving the surrounding page context.</p>
                      </div>
                    </ng-template>

                    <ng-template afTabPanel="workflow" let-item="item">
                      <div class="docs-tabs-demo__panel">
                        <span>{{ item.label }}</span>
                        <strong>{{ item.description }}</strong>
                        <p>Switching tabs should preserve context while exposing a distinct slice of the same surface.</p>
                      </div>
                    </ng-template>

                    <ng-template afTabPanel="release" let-item="item">
                      <div class="docs-tabs-demo__panel">
                        <span>{{ item.label }}</span>
                        <strong>{{ item.description }}</strong>
                        <p>Use a dedicated panel template when the content goes beyond a plain label-only tab strip.</p>
                      </div>
                    </ng-template>
                  </af-tabs>
                </div>
              </div>
            } @else if (component.name === 'AfToolbar') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-toolbar-demo" (click)="$event.stopPropagation()">
                  <div class="docs-toolbar-demo__status" aria-live="polite">
                    <strong>{{ toolbarDensity() }} density</strong>
                    <span>{{ toolbarAction() }}</span>
                  </div>

                  <af-toolbar [density]="toolbarDensity()" ariaLabel="Preview toolbar">
                    <ng-template afToolbarStart>
                      <div class="docs-toolbar-demo__cluster">
                        <button type="button" class="docs-toolbar-demo__button" (click)="triggerToolbarAction($event, 'Filters opened from the start region.')">
                          Filters
                        </button>
                        <button type="button" class="docs-toolbar-demo__button" (click)="triggerToolbarAction($event, 'View presets opened from the start region.')">
                          Views
                        </button>
                      </div>
                    </ng-template>

                    <ng-template afToolbarCenter>
                      <div class="docs-toolbar-demo__summary">
                        <span>Release cockpit</span>
                        <strong>12 queued checks</strong>
                      </div>
                    </ng-template>

                    <ng-template afToolbarEnd>
                      <div class="docs-toolbar-demo__cluster docs-toolbar-demo__cluster--end">
                        <button type="button" class="docs-toolbar-demo__button" (click)="triggerToolbarAction($event, 'Export queued from the end region.')">
                          Export
                        </button>
                        <button type="button" class="docs-toolbar-demo__button docs-toolbar-demo__button--primary" (click)="triggerToolbarAction($event, 'Publish review requested.')">
                          Publish
                        </button>
                      </div>
                    </ng-template>
                  </af-toolbar>
                </div>
              </div>
            } @else if (component.name === 'AfPageShell') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-page-shell-demo" (click)="$event.stopPropagation()">
                  <af-page-shell
                    title="Documentation cockpit"
                    subtitle="Adaptive shell preview"
                    [navItems]="pageShellNavItems"
                    [mobileTabs]="pageShellNavItems"
                    [breadcrumbs]="pageShellBreadcrumbs"
                    [activeItem]="pageShellActiveItem()"
                    [activeTab]="pageShellActiveItem()"
                    [density]="pageShellDensity()"
                    [variant]="pageShellVariant()"
                    [collapsible]="booleanValue('collapsible')"
                    [collapsed]="booleanValue('collapsed')"
                    [showSearch]="booleanValue('showSearch')"
                    searchPlaceholder="Search components"
                    [notificationCount]="7"
                    userInitials="AF"
                    ariaLabel="Documentation preview navigation"
                    (navItemSelected)="selectPageShellNavItem($event)"
                    (tabSelected)="selectPageShellNavItem($event)"
                    (breadcrumbSelected)="selectPageShellBreadcrumb($event)"
                    (collapsedChange)="setPageShellCollapsed($event)"
                    (searchChanged)="setPageShellSearch($event)"
                  >
                    <div afPageShellBrand class="docs-page-shell-demo__brand">
                      <span>AF</span>
                      <strong>ArgFit Docs</strong>
                    </div>

                    <button afPageShellActions type="button" class="docs-page-shell-demo__action" (click)="activatePageShellCommand($event, 'New audit queued')">
                      New audit
                    </button>

                    <div afPageShellUser class="docs-page-shell-demo__user">
                      <span>AF</span>
                      <strong>Platform</strong>
                    </div>

                    <div afPageShellFooter class="docs-page-shell-demo__footer">
                      <span>Beta plus</span>
                      <strong>{{ pageShellAction() }}</strong>
                    </div>

                    <section class="docs-page-shell-demo__content" aria-label="Preview shell content">
                      <div>
                        <span>Active section</span>
                        <strong>{{ pageShellActiveLabel() }}</strong>
                      </div>
                      <p>
                        Search, navigation, breadcrumbs and collapse events are wired to the documentation event log.
                      </p>
                      <button type="button" (click)="activatePageShellCommand($event, 'Primary shell action fired')">
                        Run shell action
                      </button>
                    </section>
                  </af-page-shell>
                </div>
              </div>
            } @else if (component.name === 'AfSplitter') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-splitter-demo" (click)="$event.stopPropagation()">
                  <div class="docs-splitter-demo__status" aria-live="polite">
                    <strong>{{ splitterOrientation() }} splitter</strong>
                    <span>{{ splitterAction() }}</span>
                    <b>primary pane {{ splitterPrimarySize() }}%</b>
                  </div>

                  <af-splitter
                    primaryLabel="Primary workspace"
                    secondaryLabel="Execution lane"
                    [orientation]="splitterOrientation()"
                    [primarySize]="splitterPrimarySize()"
                    [minPrimarySize]="30"
                    [minSecondarySize]="25"
                    ariaLabel="Documentation preview splitter"
                    (primarySizeChange)="onSplitterPrimarySizeChange($event)"
                  >
                    <ng-template afSplitterPrimary>
                      <section class="docs-splitter-demo__pane docs-splitter-demo__pane--primary">
                        <span>Primary panel</span>
                        <strong>Workspace composition</strong>
                        <p>Pin filters, navigation or a dense editing surface in the lead pane while keeping context visible.</p>
                        <div class="docs-splitter-demo__chips" aria-label="Primary panel content">
                          <b>Filters</b>
                          <b>Selection</b>
                          <b>Inspector</b>
                        </div>
                      </section>
                    </ng-template>

                    <ng-template afSplitterSecondary>
                      <section class="docs-splitter-demo__pane docs-splitter-demo__pane--secondary">
                        <span>Secondary panel</span>
                        <strong>Execution feedback</strong>
                        <p>Use the supporting pane for logs, summaries or validation notes without leaving the current workflow.</p>
                        <div class="docs-splitter-demo__metrics" aria-label="Secondary panel metrics">
                          <div>
                            <strong>12</strong>
                            <span>events</span>
                          </div>
                          <div>
                            <strong>3</strong>
                            <span>panes</span>
                          </div>
                          <div>
                            <strong>AA</strong>
                            <span>focus</span>
                          </div>
                        </div>
                      </section>
                    </ng-template>
                  </af-splitter>
                </div>
              </div>
            } @else if (component.name === 'AfToast' || component.name === 'AfToastViewport') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-toast-demo" (click)="$event.stopPropagation()">
                  <div class="docs-toast-demo__callout">
                    <strong>Service-driven preview</strong>
                    <p>{{ toastContextMessage() }}</p>
                  </div>

                  <div class="docs-toast-demo__actions">
                    <button type="button" class="docs-toast-demo__button" (click)="showPreviewToast($event)">
                      Show {{ toastSeverity() }} toast
                    </button>
                    <button type="button" class="docs-toast-demo__button docs-toast-demo__button--ghost" (click)="clearPreviewToasts($event)">
                      Clear
                    </button>
                  </div>

                  <div class="docs-toast-demo__status" aria-live="polite">
                    <strong>{{ previewToasts().length > 0 ? 'Toast visible' : 'No active toasts' }}</strong>
                    <span>{{ toastAction() }}</span>
                    <b>{{ toastStatusMeta() }}</b>
                  </div>

                  <div class="docs-toast-demo__frame">
                    <div class="docs-toast-demo__frame-top">
                      <span>Viewport</span>
                      <b>{{ toastPlacement() }}</b>
                    </div>

                    @if (previewToasts().length === 0) {
                      <div class="docs-toast-demo__empty">
                        <strong>Trigger a preview toast</strong>
                        <span>{{ toastEmptyMessage() }}</span>
                      </div>
                    }

                    <af-toast-viewport
                      [placement]="toastPlacement()"
                      ariaLabel="Preview notifications"
                      closeLabel="Dismiss preview notification"
                    />
                  </div>
                </div>
              </div>
            } @else if (component.name === 'AfDialog') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-dialog-demo" (click)="$event.stopPropagation()">
                  <button type="button" class="docs-dialog-demo__trigger" (click)="openDialog($event)">
                    Open dialog
                  </button>
                  <div class="docs-dialog-demo__status" aria-live="polite">
                    <strong>{{ dialogOpen() ? 'Dialog open' : 'Dialog closed' }}</strong>
                    <span>{{ dialogAction() }}</span>
                  </div>
                </div>

                <af-dialog
                  [open]="dialogOpen()"
                  title="Review release scope"
                  description="Confirm the component contract before publishing documentation updates."
                  [size]="dialogSize()"
                  [tone]="dialogTone()"
                  [mobilePresentation]="dialogMobilePresentation()"
                  [dismissible]="booleanValue('dismissible')"
                  [closeOnBackdrop]="booleanValue('closeOnBackdrop')"
                  [closeOnEscape]="booleanValue('closeOnEscape')"
                  closeLabel="Close preview dialog"
                  (openChange)="setDialogOpen($event)"
                  (opened)="onDialogOpened()"
                  (closed)="onDialogClosed()"
                  (backdropPress)="onDialogBackdropPress()"
                  (escapePress)="onDialogEscapePress($event)"
                >
                  <div afDialogContent class="docs-dialog-demo__content">
                    <div>
                      <span>Component</span>
                      <strong>AfDialog</strong>
                    </div>
                    <div>
                      <span>Contract</span>
                      <strong>{{ dialogSize() }} · {{ dialogTone() }}</strong>
                    </div>
                    <p>
                      This preview uses the real adaptive dialog, including backdrop, escape and close-button events.
                    </p>
                  </div>
                  <div afDialogFooter class="docs-dialog-demo__footer">
                    <button type="button" class="docs-dialog-demo__button docs-dialog-demo__button--ghost" (click)="closeDialog($event, 'Cancelled')">
                      Cancel
                    </button>
                    <button type="button" class="docs-dialog-demo__button" (click)="closeDialog($event, 'Release scope confirmed')">
                      Confirm scope
                    </button>
                  </div>
                </af-dialog>
              </div>
            } @else if (component.name === 'AfDrawer') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-drawer-demo" (click)="$event.stopPropagation()">
                  <div class="docs-drawer-demo__status" aria-live="polite">
                    <span>Drawer state</span>
                    <strong>{{ drawerOpen() ? 'Open' : 'Closed' }}</strong>
                    <b>{{ drawerStatusMeta() }}</b>
                  </div>

                  <div class="docs-drawer-demo__actions">
                    <button type="button" class="docs-drawer-demo__button" (click)="openDrawer($event)">
                      {{ drawerOpen() ? 'Refresh drawer' : 'Open drawer' }}
                    </button>
                    <button
                      type="button"
                      class="docs-drawer-demo__button docs-drawer-demo__button--ghost"
                      [disabled]="!drawerOpen()"
                      (click)="closeDrawer($event, 'Drawer closed from preview controls')"
                    >
                      Close
                    </button>
                  </div>

                  <p class="docs-drawer-demo__note">{{ drawerAction() }}</p>

                  <af-drawer
                    [open]="drawerOpen()"
                    title="Session checklist"
                    description="Keep secondary tasks attached to the current workflow without pushing users to a separate page."
                    [placement]="drawerPlacement()"
                    [size]="drawerSize()"
                    [tone]="drawerTone()"
                    [dismissible]="booleanValue('dismissible')"
                    [closeOnBackdrop]="booleanValue('closeOnBackdrop')"
                    [closeOnEscape]="booleanValue('closeOnEscape')"
                    ariaLabel="Preview drawer"
                    closeLabel="Close preview drawer"
                    (openChange)="setDrawerOpen($event)"
                    (opened)="onDrawerOpened()"
                    (closed)="onDrawerClosed()"
                    (backdropPress)="onDrawerBackdropPress()"
                    (escapePress)="onDrawerEscapePress($event)"
                  >
                    <div class="docs-drawer-demo__content">
                      <div>
                        <span>Placement</span>
                        <strong>{{ drawerPlacement() }}</strong>
                      </div>
                      <div>
                        <span>Surface</span>
                        <strong>{{ drawerSize() }} · {{ drawerTone() }}</strong>
                      </div>
                      <p>
                        Drawers are better for side tasks, audit notes and short approval flows that should not interrupt the main screen.
                      </p>
                      <div class="docs-drawer-demo__footer">
                        <button type="button" class="docs-drawer-demo__button docs-drawer-demo__button--ghost" (click)="closeDrawer($event, 'Drawer dismissed')">
                          Dismiss
                        </button>
                        <button type="button" class="docs-drawer-demo__button" (click)="closeDrawer($event, 'Workflow queued from drawer')">
                          Queue workflow
                        </button>
                      </div>
                    </div>
                  </af-drawer>
                </div>
              </div>
            } @else if (component.name === 'AfPopover') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-popover-demo" (click)="$event.stopPropagation()">
                  <div class="docs-popover-demo__status" aria-live="polite">
                    <span>Popover state</span>
                    <strong>{{ popoverOpen() ? 'Open' : 'Closed' }}</strong>
                    <b>{{ popoverStatusMeta() }}</b>
                  </div>

                  <af-popover
                    [open]="popoverOpen()"
                    title="Context actions"
                    [placement]="popoverPlacement()"
                    [tone]="popoverTone()"
                    [dismissible]="booleanValue('dismissible')"
                    [closeOnBackdrop]="booleanValue('closeOnBackdrop')"
                    [closeOnEscape]="booleanValue('closeOnEscape')"
                    ariaLabel="Preview popover actions"
                    closeLabel="Close preview popover"
                    (openChange)="setPopoverOpen($event)"
                    (opened)="onPopoverOpened()"
                    (closed)="onPopoverClosed()"
                    (backdropPress)="onPopoverBackdropPress()"
                    (escapePress)="onPopoverEscapePress($event)"
                  >
                    <ng-template afPopoverTrigger>
                      <button type="button" class="docs-popover-demo__trigger">
                        {{ popoverOpen() ? 'Close context' : 'Open context' }}
                      </button>
                    </ng-template>

                    <ng-template afPopoverContent>
                      <div class="docs-popover-demo__content">
                        <p>Use popover for anchored contextual actions and short supporting detail.</p>
                        <div class="docs-popover-demo__actions">
                          <button type="button" (click)="selectPopoverAction($event, 'Assigned owner')">Assign</button>
                          <button type="button" (click)="selectPopoverAction($event, 'Queued review')">Queue</button>
                        </div>
                      </div>
                    </ng-template>
                  </af-popover>

                  <p class="docs-popover-demo__note">{{ popoverAction() }}</p>
                </div>
              </div>
            } @else if (component.name === 'AfTooltip') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-tooltip-demo" (click)="$event.stopPropagation()">
                  <div class="docs-tooltip-demo__status" aria-live="polite">
                    <span>Tooltip state</span>
                    <strong>{{ tooltipOpen() ? 'Visible' : 'Hidden' }}</strong>
                    <b>{{ tooltipStatusMeta() }}</b>
                  </div>

                  <af-tooltip
                    [open]="tooltipOpen()"
                    text="Concise hints should add context without interrupting the workflow."
                    [placement]="tooltipPlacement()"
                    [tone]="tooltipTone()"
                    ariaLabel="Preview tooltip"
                  >
                    <button type="button" class="docs-tooltip-demo__trigger" (click)="toggleTooltip($event)">
                      {{ tooltipOpen() ? 'Hide helper' : 'Show helper' }}
                    </button>
                  </af-tooltip>

                  <p class="docs-tooltip-demo__note">{{ tooltipAction() }}</p>
                </div>
              </div>
            } @else if (component.name === 'AfInputGroup') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-input-group-demo" (click)="$event.stopPropagation()">
                  <af-input-group
                    label="Load target"
                    [helperText]="inputGroupHelperText()"
                    [errorText]="inputGroupErrorText()"
                    [density]="inputGroupDensity()"
                    [labelMode]="inputGroupLabelMode()"
                    [state]="inputGroupState()"
                    inputId="docs-input-group-target"
                    [required]="booleanValue('required')"
                    [disabled]="booleanValue('disabled')"
                    [readonly]="booleanValue('readonly')"
                  >
                    <span afInputGroupPrefix>kg</span>
                    <input
                      afInputGroupControl
                      id="docs-input-group-target"
                      class="docs-input-group-demo__input"
                      inputmode="numeric"
                      [value]="inputGroupValue()"
                      [disabled]="booleanValue('disabled')"
                      [readOnly]="booleanValue('readonly')"
                      (click)="$event.stopPropagation()"
                      (input)="setInputGroupValue($event)"
                    />
                    <button
                      afInputGroupSuffix
                      type="button"
                      class="docs-input-group-demo__button"
                      [disabled]="booleanValue('disabled')"
                      (click)="applyInputGroupValue($event)"
                    >
                      Apply
                    </button>
                  </af-input-group>

                  <div class="docs-input-group-demo__status" aria-live="polite">
                    <span>Current target <strong>{{ inputGroupValue() }} kg</strong></span>
                    <span>{{ inputGroupAction() }}</span>
                  </div>
                </div>
              </div>
            } @else if (component.name === 'AfIconField') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-icon-field-demo" (click)="$event.stopPropagation()">
                  <af-icon-field
                    label="Search workbench"
                    [helperText]="iconFieldHelperText()"
                    [errorText]="iconFieldErrorText()"
                    [density]="iconFieldDensity()"
                    [labelMode]="iconFieldLabelMode()"
                    [state]="iconFieldState()"
                    inputId="docs-icon-field-query"
                    [required]="booleanValue('required')"
                    [disabled]="booleanValue('disabled')"
                    [readonly]="booleanValue('readonly')"
                  >
                    <span afIconFieldPrefix class="docs-icon-field-demo__affordance" aria-hidden="true">⌕</span>
                    <input
                      afIconFieldControl
                      id="docs-icon-field-query"
                      class="docs-icon-field-demo__input"
                      type="search"
                      placeholder="Search preview surfaces"
                      [value]="iconFieldValue()"
                      [disabled]="booleanValue('disabled')"
                      [readOnly]="booleanValue('readonly')"
                      (click)="$event.stopPropagation()"
                      (input)="setIconFieldValue($event)"
                    />
                    <button
                      afIconFieldSuffix
                      type="button"
                      class="docs-icon-field-demo__button"
                      [disabled]="booleanValue('disabled') || booleanValue('readonly') || iconFieldValue().length === 0"
                      (click)="clearIconFieldValue($event)"
                    >
                      Clear
                    </button>
                  </af-icon-field>

                  <div class="docs-icon-field-demo__status" aria-live="polite">
                    <span>Query <strong>{{ iconFieldValue() || 'empty' }}</strong></span>
                    <span>{{ iconFieldAction() }}</span>
                  </div>
                </div>
              </div>
            } @else if (component.name === 'AfMultiSelect') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-multi-select-demo" (click)="$event.stopPropagation()">
                  <div class="docs-multi-select-demo__status" aria-live="polite">
                    <strong>{{ multiSelectValue().length }} selected</strong>
                    <span>{{ multiSelectAction() }}</span>
                  </div>

                  <af-multi-select
                    label="Preview surfaces"
                    placeholder="Choose surfaces"
                    [options]="previewMultiSelectOptions"
                    [value]="multiSelectValue()"
                    optionLabel="label"
                    optionValue="value"
                    [density]="multiSelectDensity()"
                    [searchable]="booleanValue('searchable')"
                    [clearable]="booleanValue('clearable')"
                    [disabled]="booleanValue('disabled')"
                    [readonly]="booleanValue('readonly')"
                    [required]="booleanValue('required')"
                    [maxSelected]="2"
                    selectionLimitText="Select up to two preview surfaces."
                    helperText="Search and curate a small set of active surfaces."
                    (valueChange)="setMultiSelectValue($event)"
                    (searchChange)="recordMultiSelectSearch($event)"
                    (openedChange)="setMultiSelectOpen($event)"
                    (clear)="recordMultiSelectClear()"
                  />
                </div>
              </div>
            } @else if (component.name === 'AfKanban') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-kanban-demo" (click)="$event.stopPropagation()">
                  <div class="docs-kanban-demo__status" aria-live="polite">
                    <strong>{{ kanbanStatus() }}</strong>
                    <span>{{ kanbanAction() }}</span>
                  </div>

                  <af-kanban
                    [columns]="kanbanColumns()"
                    [cards]="kanbanCards()"
                    [filters]="kanbanFilters()"
                    [activeFilter]="kanbanActiveFilter()"
                    [density]="kanbanDensity()"
                    [disabled]="booleanValue('disabled')"
                    [readonly]="booleanValue('readonly')"
                    [allowReorder]="booleanValue('allowReorder')"
                    [allowCrossColumnMove]="booleanValue('allowCrossColumnMove')"
                    title="AfKanban preview"
                    ariaLabel="Preview kanban board"
                    (filterChange)="setKanbanFilter($event)"
                    (cardMove)="setKanbanMove($event)"
                    (cardClick)="recordKanbanCardClick($event)"
                    (addCard)="addKanbanCard($event)"
                    (columnAction)="recordKanbanColumnAction($event)"
                  />
                </div>
              </div>
            } @else if (component.name === 'AfChart') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-chart-demo" (click)="$event.stopPropagation()">
                  <div class="docs-chart-demo__status" aria-live="polite">
                    <span>Chart state</span>
                    <strong>{{ chartType() }}</strong>
                    <b>{{ chartTone() }} | {{ chartDensity() }}</b>
                  </div>

                  <af-chart
                    [type]="chartType()"
                    [tone]="chartTone()"
                    [density]="chartDensity()"
                    [categories]="chartCategories()"
                    [series]="chartSeries()"
                    [indicators]="chartIndicators()"
                    [height]="chartHeight()"
                    title="Performance preview"
                    description="Adaptive chart contract with typed demo data."
                    [legend]="booleanValue('legend')"
                    [showGrid]="booleanValue('showGrid')"
                    [interactive]="booleanValue('interactive')"
                    [loading]="booleanValue('loading')"
                    ariaLabel="Preview analytics chart"
                    (pointSelect)="onChartPointSelect($event)"
                  />

                  <p class="docs-chart-demo__note">{{ chartAction() }}</p>
                </div>
              </div>
            } @else if (component.name === 'AfDataTable') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-data-table-demo" (click)="$event.stopPropagation()">
                  <af-data-table
                    [columns]="previewDataTableColumns"
                    [rows]="previewDataTableRows"
                    rowIdKey="id"
                    [density]="dataTableDensity()"
                    [selectionMode]="dataTableSelectionMode()"
                    [selectedRowIds]="dataTableSelectedRowIds()"
                    [expandedRowIds]="dataTableExpandedRowIds()"
                    [sort]="dataTableSort()"
                    [pagination]="dataTablePagination()"
                    [loading]="booleanValue('loading')"
                    emptyTitle="No preview rows"
                    emptyDescription="The current table state returned no visible records."
                    ariaLabel="Preview data table"
                    (sortChange)="setDataTableSort($event)"
                    (pageChange)="setDataTablePage($event)"
                    (selectionChange)="setDataTableSelection($event)"
                    (rowExpandedChange)="setDataTableExpanded($event)"
                    (rowPressed)="recordDataTableRow($event)"
                  >
                    <div afDataTableToolbar class="docs-data-table-demo__toolbar">
                      <strong>{{ previewDataTableRows.length }} product surfaces</strong>
                      <span>{{ dataTableAction() }}</span>
                    </div>

                    <ng-template afDataTableCell="surface" let-row="row">
                      <div class="docs-data-table-demo__cell">
                        <strong>{{ previewDataTableField(row, 'surface') }}</strong>
                        <small>{{ previewDataTableField(row, 'detail') }}</small>
                      </div>
                    </ng-template>

                    <ng-template afDataTableCell="status" let-row="row">
                      <span class="docs-data-table-demo__pill" [attr.data-status]="previewDataTableField(row, 'status')">
                        {{ previewDataTableField(row, 'status') }}
                      </span>
                    </ng-template>

                    <ng-template afDataTableExpandedRow let-row="row">
                      <div class="docs-data-table-demo__expanded">
                        <strong>{{ previewDataTableField(row, 'surface') }}</strong>
                        <span>{{ previewDataTableField(row, 'owner') }} owns this surface.</span>
                        <p>{{ previewDataTableField(row, 'detail') }}</p>
                      </div>
                    </ng-template>
                  </af-data-table>
                </div>
              </div>
            } @else if (component.name === 'AfDataView') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-data-view-demo" (click)="$event.stopPropagation()">
                  <af-data-view
                    [items]="previewDataViewItems"
                    [layout]="dataViewLayout()"
                    [density]="dataViewDensity()"
                    [loading]="booleanValue('loading')"
                    emptyTitle="No preview items"
                    emptyDescription="The current data view state returned no items."
                    ariaLabel="Preview data view"
                    (itemPressed)="selectDataViewItem($event)"
                  >
                    <div afDataViewActions class="docs-data-view-demo__actions">
                      <strong>{{ dataViewLayout() === 'grid' ? 'Grid cards' : 'List rows' }}</strong>
                      <span>{{ dataViewAction() }}</span>
                    </div>
                  </af-data-view>
                </div>
              </div>
            } @else if (component.name === 'AfOrderList') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-order-list-demo" (click)="$event.stopPropagation()">
                  <af-order-list
                    [items]="previewOrderListItems()"
                    [selectedIds]="orderListSelectedIds()"
                    [selectionMode]="orderListSelectionMode()"
                    [density]="orderListDensity()"
                    [loading]="booleanValue('loading')"
                    [disabled]="booleanValue('disabled')"
                    emptyTitle="No workflow items"
                    emptyDescription="The preview list is ready to prioritize."
                    ariaLabel="Preview order list"
                    (selectionChange)="setOrderListSelection($event)"
                    (reorderChange)="setOrderListReorder($event)"
                  >
                    <div afOrderListActions class="docs-order-list-demo__status" aria-live="polite">
                      <strong>{{ orderListSelectionMode() === 'multiple' ? 'Multi select' : 'Single select' }}</strong>
                      <span>{{ orderListAction() }}</span>
                    </div>

                    <ng-template afOrderListItem let-item="item" let-selected="selected">
                      <div class="docs-order-list-demo__item" [class.is-selected]="selected">
                        <div>
                          <strong>{{ item.label }}</strong>
                          <small>{{ item.description }}</small>
                        </div>
                        <span class="docs-order-list-demo__meta">{{ item.meta }}</span>
                      </div>
                    </ng-template>
                  </af-order-list>
                </div>
              </div>
            } @else if (component.name === 'AfOrganizationChart') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-organization-chart-demo" (click)="$event.stopPropagation()">
                  <af-organization-chart
                    [nodes]="previewOrganizationChartNodes"
                    [selectedIds]="organizationChartSelectedIds()"
                    [expandedIds]="organizationChartExpandedIds()"
                    [selectionMode]="organizationChartSelectionMode()"
                    [density]="organizationChartDensity()"
                    [loading]="booleanValue('loading')"
                    [disabled]="booleanValue('disabled')"
                    emptyTitle="No organization data"
                    emptyDescription="The preview hierarchy is ready to inspect."
                    ariaLabel="Preview organization chart"
                    (selectionChange)="setOrganizationChartSelection($event)"
                    (expandedChange)="setOrganizationChartExpanded($event)"
                    (nodePressed)="recordOrganizationChartNode($event)"
                  >
                    <div afOrganizationChartActions class="docs-organization-chart-demo__status" aria-live="polite">
                      <strong>{{ organizationChartSelectionMode() }}</strong>
                      <span>{{ organizationChartAction() }}</span>
                    </div>

                    <ng-template afOrganizationChartNode let-node="node" let-expanded="expanded" let-selected="selected" let-hasChildren="hasChildren">
                      <div class="docs-organization-chart-demo__node" [class.is-selected]="selected">
                        <span class="docs-organization-chart-demo__avatar">{{ node.avatarLabel || node.label.slice(0, 2).toUpperCase() }}</span>
                        <div>
                          <strong>{{ node.label }}</strong>
                          <small>{{ node.title || node.description }}</small>
                        </div>
                        <span class="docs-organization-chart-demo__meta">{{ hasChildren ? (expanded ? 'expanded' : 'collapsed') : (node.meta || 'leaf') }}</span>
                      </div>
                    </ng-template>
                  </af-organization-chart>
                </div>
              </div>
            } @else if (component.name === 'AfPaginator') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-paginator-demo" (click)="$event.stopPropagation()">
                  <div class="docs-paginator-demo__status" aria-live="polite">
                    <strong>{{ paginatorSummary() }}</strong>
                    <span>{{ paginatorAction() }}</span>
                  </div>

                  <af-paginator
                    [pageIndex]="paginatorState().pageIndex"
                    [pageSize]="paginatorState().pageSize"
                    [totalItems]="paginatorState().totalItems"
                    [density]="paginatorDensity()"
                    [disabled]="booleanValue('disabled')"
                    ariaLabel="Preview paginator"
                    (pageChange)="setPaginatorPage($event)"
                  />

                  <p class="docs-paginator-demo__note">The docs preview keeps a fixed page size of {{ paginatorState().pageSize }} items.</p>
                </div>
              </div>
            } @else if (component.name === 'AfPickList') {
              <div class="docs-live-lab__actual docs-live-lab__actual--composition">
                <div class="docs-pick-list-demo" (click)="$event.stopPropagation()">
                  <af-pick-list
                    [sourceItems]="pickListSourceItems()"
                    [targetItems]="pickListTargetItems()"
                    [sourceSelectedIds]="pickListSourceSelectedIds()"
                    [targetSelectedIds]="pickListTargetSelectedIds()"
                    sourceTitle="Backlog"
                    sourceDescription="Available workflow items"
                    targetTitle="Current sprint"
                    targetDescription="Assigned items"
                    [density]="pickListDensity()"
                    [loading]="booleanValue('loading')"
                    [disabled]="booleanValue('disabled')"
                    ariaLabel="Preview pick list"
                    (sourceSelectionChange)="setPickListSourceSelection($event)"
                    (targetSelectionChange)="setPickListTargetSelection($event)"
                    (transferChange)="applyPickListTransfer($event)"
                  >
                    <div afPickListActions class="docs-pick-list-demo__status" aria-live="polite">
                      <strong>{{ pickListTargetItems().length }} assigned</strong>
                      <span>{{ pickListAction() }}</span>
                    </div>

                    <ng-template afPickListItem let-item="item" let-selected="selected">
                      <div class="docs-pick-list-demo__item" [class.is-selected]="selected">
                        <div>
                          <strong>{{ item.label }}</strong>
                          <small>{{ item.description }}</small>
                        </div>
                        <span class="docs-pick-list-demo__meta">{{ item.meta }}</span>
                      </div>
                    </ng-template>
                  </af-pick-list>
                </div>
              </div>
            } @else if (canRenderLiveComponent()) {
              <div class="docs-live-lab__actual">
                <ng-container
                  [ngComponentOutlet]="component.componentType"
                  [ngComponentOutletInputs]="previewInputs()"
                  [ngComponentOutletContent]="projectedContent()"
                />
              </div>
            } @else {
              <div class="docs-live-lab__placeholder">
                <strong>{{ component.name }}</strong>
                <span>{{ component.selector }}</span>
              </div>
            }
          </div>

          <aside class="docs-live-lab__blueprint" aria-label="Component structure preview">
            <div class="docs-live-lab__blueprint-top">
              <span>Blueprint</span>
              <b>{{ component.api.inputs.length }} inputs</b>
            </div>
            <svg class="docs-live-lab__wire" viewBox="0 0 420 190" role="img" [attr.aria-label]="component.name + ' wireframe preview'">
              <defs>
                <linearGradient [attr.id]="'docs-preview-gradient-' + component.slug" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="var(--af-primary)" stop-opacity="0.86" />
                  <stop offset="60%" stop-color="var(--af-accent)" stop-opacity="0.62" />
                  <stop offset="100%" stop-color="var(--af-success)" stop-opacity="0.54" />
                </linearGradient>
              </defs>
              <rect x="10" y="12" width="400" height="166" rx="24" class="docs-live-lab__wire-panel" />
              <rect x="34" y="38" width="118" height="16" rx="8" [attr.fill]="'url(#docs-preview-gradient-' + component.slug + ')'" opacity="0.78" />
              @for (bar of wireframeBars(); track bar.label; let index = $index) {
                <rect x="34" [attr.y]="76 + index * 26" [attr.width]="bar.width" height="12" rx="6" class="docs-live-lab__wire-bar" />
              }
              <rect x="268" y="54" width="86" height="86" rx="22" [attr.fill]="'url(#docs-preview-gradient-' + component.slug + ')'" opacity="0.7" />
              <path d="M286 112 L309 84 L334 121" class="docs-live-lab__wire-spark" />
            </svg>
          </aside>
        </div>

        @if (viewMode() === 'contract' && !compact()) {
          <div class="docs-live-lab__contract" aria-label="Component contract preview">
            <div class="docs-live-lab__contract-card">
              <span class="docs-kicker">Inputs</span>
              <strong>{{ component.api.inputs.length }} public inputs</strong>
              <div class="docs-live-lab__contract-list">
                @for (apiInput of contractInputs(); track apiInput.name) {
                  <span><code>{{ apiInput.name }}</code><b>{{ apiInput.type }}</b></span>
                }
              </div>
            </div>
            <div class="docs-live-lab__contract-card">
              <span class="docs-kicker">Outputs</span>
              <strong>{{ component.api.outputs.length }} emitted events</strong>
              <div class="docs-live-lab__contract-list">
                @for (apiOutput of contractOutputs(); track apiOutput.name) {
                  <span><code>{{ apiOutput.name }}</code><b>{{ apiOutput.type }}</b></span>
                } @empty {
                  <span><code>none</code><b>configured by inputs/content</b></span>
                }
              </div>
            </div>
            <div class="docs-live-lab__contract-card">
              <span class="docs-kicker">Posture</span>
              <strong>{{ component.category }} - {{ component.complexity }}</strong>
              <p>{{ component.interaction }} interaction, {{ component.api.slots.length }} slots, {{ component.api.variations.length }} variation groups.</p>
            </div>
          </div>
        }

        @if (visibleVariations().length > 0 || booleanInputs().length > 0) {
          <div class="docs-live-lab__controls">
            @if (visibleVariations().length > 0) {
              <div class="docs-live-lab__control-grid">
                @for (variation of visibleVariations(); track variation.attribute) {
                  <div class="docs-live-lab__control">
                    <strong>{{ variationControlLabel(variation) }}</strong>
                    <div class="docs-live-lab__toggle-row">
                      <button
                        *ngFor="let option of variation.values"
                        type="button"
                        class="docs-live-lab__toggle"
                        [class.is-active]="selectedValue(variation.attribute, variation.values) === option"
                        (click)="selectValue(variation.attribute, option)"
                      >
                        {{ option }}
                      </button>
                    </div>
                  </div>
                }
              </div>
            }

            @if (booleanInputs().length > 0) {
              <div class="docs-live-lab__boolean-grid">
                @for (apiInput of booleanInputs(); track apiInput.name) {
                  <button
                    type="button"
                    class="docs-live-lab__boolean"
                    [class.is-active]="booleanValue(apiInput.name)"
                    (click)="toggleBoolean(apiInput.name)"
                  >
                    <span>{{ apiInput.name }}</span>
                    <b>{{ booleanValue(apiInput.name) ? 'on' : 'off' }}</b>
                  </button>
                }
              </div>
            }
          </div>
        }

        @if (!compact() && (visibleVariations().length > 0 || booleanInputs().length > 0)) {
          <div class="docs-live-lab__snippet">
            <span class="docs-live-lab__snippet-label">Live snippet &mdash; reflects the controls above</span>
            <docs-code-block [code]="liveExampleCode()" language="html" />
          </div>
        }

        @if (!compact()) {
          <div class="docs-live-lab__event-row" aria-live="polite">
            @for (event of eventLog(); track $index) {
              <span>{{ event }}</span>
            }
          </div>
        }
      </section>
    }
  `,
  styleUrl: './docs-component-preview.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponentPreviewComponent {
  readonly component = input.required<ProductiveComponentDoc>();
  readonly compact = input(false);

  private readonly document = inject(DOCUMENT);
  private readonly toastService = inject(AfToastService);
  private readonly selectedValues = signal<Record<string, string>>({});
  private readonly selectedBooleans = signal<Record<string, boolean>>({});
  private readonly selectedExpandedIds = signal<Record<string, readonly string[]>>({});
  protected readonly previewTabsItems = PREVIEW_TABS_ITEMS;
  protected readonly previewStepperSteps = PREVIEW_STEPPER_STEPS;
  protected readonly tabsActiveId = signal('insight');
  protected readonly tabsAction = signal('Insight queue is active.');
  protected readonly stepperActiveId = signal('wire');
  protected readonly stepperAction = signal('Select a step to inspect the active panel state.');
  protected readonly toolbarAction = signal('Review queue aligned across start, center and end regions.');
  protected readonly previewDataTableColumns = PREVIEW_DATA_TABLE_COLUMNS;
  protected readonly previewDataTableRows = PREVIEW_DATA_TABLE_ROWS;
  protected readonly previewDataViewItems = PREVIEW_DATA_VIEW_ITEMS;
  protected readonly kanbanCards = signal<readonly AfKanbanCard[]>(SAMPLE_KANBAN_CARDS);
  protected readonly kanbanActiveFilter = signal('all');
  protected readonly kanbanAction = signal('Move cards or switch filters to inspect the kanban contract.');
  protected readonly kanbanColumns = computed<readonly AfKanbanColumn[]>(() =>
    SAMPLE_KANBAN_COLUMNS.map((column) => ({
      ...column,
      badge: {
        label: String(this.kanbanCards().filter((card) => card.columnId === column.id).length),
        tone: column.badge?.tone ?? 'neutral',
      },
    })),
  );
  protected readonly kanbanFilters = computed<readonly AfKanbanFilter[]>(() =>
    PREVIEW_KANBAN_FILTERS.map((filter) => ({
      ...filter,
      count: filter.id === 'all'
        ? this.kanbanCards().length
        : this.kanbanCards().filter((card) => (card.category ?? '').toLowerCase() === filter.id).length,
    })),
  );
  protected readonly kanbanVisibleCardCount = computed(() => {
    const activeFilter = this.kanbanActiveFilter();

    if (!activeFilter || activeFilter === 'all') {
      return this.kanbanCards().length;
    }

    return this.kanbanCards().filter((card) => (card.category ?? '').toLowerCase() === activeFilter.toLowerCase()).length;
  });
  protected readonly kanbanStatus = computed(() => {
    const activeFilter = this.kanbanActiveFilter();

    if (!activeFilter || activeFilter === 'all') {
      return `${this.kanbanCards().length} routines`;
    }

    return `${this.kanbanVisibleCardCount()} visible in ${activeFilter}`;
  });
  protected readonly previewOrderListItems = signal<readonly AfOrderListItem[]>(PREVIEW_ORDER_LIST_ITEMS);
  protected readonly previewOrganizationChartNodes = PREVIEW_ORGANIZATION_CHART_NODES;
  protected readonly orderListSelectedIds = signal<AfOrderListSelectedIds>(['workflow']);
  protected readonly orderListAction = signal('Reorder the list to inspect the persistent preview state.');
  protected readonly organizationChartSelectedIds = signal<AfOrganizationChartSelectedIds>(['platform']);
  protected readonly organizationChartExpandedIds = signal<AfOrganizationChartExpandedIds>(['platform']);
  protected readonly organizationChartAction = signal('Expand branches or select a node to inspect hierarchy state.');
  protected readonly paginatorState = signal({ pageIndex: 0, pageSize: 3, totalItems: 12 });
  protected readonly paginatorAction = signal('Advance the page to inspect the typed pageChange payload.');
  protected readonly pickListSourceItems = signal<readonly AfPickListItem[]>(PREVIEW_PICK_LIST_SOURCE_ITEMS);
  protected readonly pickListTargetItems = signal<readonly AfPickListItem[]>(PREVIEW_PICK_LIST_TARGET_ITEMS);
  protected readonly pickListSourceSelectedIds = signal<AfPickListSelectedIds>(['insight']);
  protected readonly pickListTargetSelectedIds = signal<AfPickListSelectedIds>(['release']);
  protected readonly pickListAction = signal('Move items between lists to inspect the transfer contract.');
  protected readonly chartAction = signal('Select a point to inspect the event payload.');
  protected readonly cardAction = signal('Ready for card press');
  protected readonly dataTableSort = signal<AfDataTableSort>({ key: 'surface', direction: 'asc' });
  protected readonly dataTablePageState = signal<AfDataTablePagination>({ pageIndex: 0, pageSize: 3, totalItems: PREVIEW_DATA_TABLE_ROWS.length });
  protected readonly dataTableSelectedRowIds = signal<readonly string[]>(['table']);
  protected readonly dataTableExpandedRowIds = signal<readonly string[]>(['shell']);
  protected readonly dataTableAction = signal('Sort, paginate or expand rows to inspect the adaptive table contract.');
  protected readonly dataViewAction = signal('Press a card to record the selected item.');
  protected readonly dialogOpen = signal(false);
  protected readonly dialogAction = signal('Ready to open');
  protected readonly drawerOpen = signal(false);
  protected readonly drawerAction = signal('Open the preview drawer to inspect the overlay contract.');
  protected readonly iconFieldValue = signal('adaptive');
  protected readonly iconFieldAction = signal('Search query ready for the current preview.');
  protected readonly inputGroupValue = signal('92');
  protected readonly inputGroupAction = signal('Ready to apply');
  protected readonly previewMultiSelectOptions = SAMPLE_OPTIONS;
  protected readonly multiSelectValue = signal<readonly unknown[]>(['pipeline']);
  protected readonly multiSelectAction = signal('1 selection active in the preview.');
  protected readonly pageShellActiveItem = signal('overview');
  protected readonly pageShellAction = signal('Overview selected');
  protected readonly pageShellQuery = signal('');
  protected readonly pageShellBreadcrumbs = SAMPLE_BREADCRUMBS;
  protected readonly pageShellNavItems = SAMPLE_NAV_ITEMS;
  protected readonly splitterPrimarySize = signal(58);
  protected readonly splitterAction = signal('Drag the divider or switch orientation.');
  protected readonly popoverOpen = signal(true);
  protected readonly popoverAction = signal('Popover mounted with contextual actions.');
  protected readonly previewToasts = this.toastService.toasts;
  protected readonly toastAction = signal('Mount the viewport and trigger a preview toast.');
  protected readonly tooltipOpen = signal(true);
  protected readonly tooltipAction = signal('Tooltip visible on the trigger.');
  protected readonly viewMode = signal<PreviewMode>('canvas');
  protected readonly eventLog = signal<readonly string[]>(['Ready']);

  protected readonly canRenderLiveComponent = computed(() => {
    const component = this.component();
    return Boolean(component.componentType) && !LIVE_RENDER_BLOCKLIST.has(component.name);
  });
  protected readonly visibleVariations = computed(() => {
    const limit = this.compact() ? 1 : 4;
    const component = this.component();
    const variations = component.api.variations.filter((variation) => !this.isBooleanValues(variation.values));

    if (component.name === 'AfAvatar') {
      const avatarVariations = ['size', 'shape', 'tone']
        .map((attribute) => variations.find((variation) => variation.attribute === attribute))
        .filter((variation): variation is ProductiveComponentVariation => Boolean(variation));

      return [
        AVATAR_PRESENTATION_VARIATION,
        ...avatarVariations,
      ].slice(0, limit);
    }

    return variations.slice(0, limit);
  });
  protected readonly booleanInputs = computed(() => {
    const limit = this.compact() ? 3 : 8;
    return this.component().api.inputs.filter((apiInput) => this.isBooleanValues(apiInput.values)).slice(0, limit);
  });
  protected readonly liveExampleCode = computed(() => {
    const component = this.component();
    const requiredAttrs = component.api.inputs
      .filter((apiInput) => apiInput.required)
      .slice(0, 2)
      .map((apiInput) => `[${apiInput.name}]="${apiInput.name}"`);
    const realInputNames = new Set(component.api.inputs.map((apiInput) => apiInput.name));
    const variationAttrs = this.visibleVariations()
      .filter((variation) => realInputNames.has(variation.attribute))
      .map((variation) => `${variation.attribute}="${this.selectedValue(variation.attribute, variation.values)}"`);
    const booleanAttrs = this.booleanInputs().map(
      (apiInput) => `[${apiInput.name}]="${this.booleanValue(apiInput.name)}"`,
    );
    const attributes = [...requiredAttrs, ...variationAttrs, ...booleanAttrs].join(' ');
    const openTag = attributes.length > 0 ? `<${component.selector} ${attributes}>` : `<${component.selector}>`;
    const slots = component.api.slots;

    if (slots.length > 0) {
      const slotAttr = slots[0].selector.replace('[', '').replace(']', '');
      return [openTag, `  <ng-template ${slotAttr}>`, '    Custom content', '  </ng-template>', `</${component.selector}>`].join('\n');
    }

    return [openTag, '  Content', `</${component.selector}>`].join('\n');
  });
  protected readonly contractInputs = computed(() => this.component().api.inputs.slice(0, 8));
  protected readonly contractOutputs = computed(() => this.component().api.outputs.slice(0, 6));
  protected readonly previewInputs = computed<Record<string, unknown>>(() => {
    const component = this.component();
    return Object.fromEntries(
      component.api.inputs.map((apiInput) => [apiInput.name, this.sampleValueForInput(component.name, apiInput)]),
    );
  });
  protected readonly projectedContent = computed<Node[][]>(() => [
    [this.document.createTextNode(this.projectedLabel())],
  ]);
  protected readonly wireframeBars = computed<readonly PreviewBar[]>(() => {
    const inputs = this.component().api.inputs.slice(0, 4);
    return inputs.length > 0
      ? inputs.map((apiInput, index) => ({ label: apiInput.name, width: 148 + ((apiInput.name.length + index * 23) % 178) }))
      : [
          { label: 'surface', width: 280 },
          { label: 'state', width: 218 },
          { label: 'action', width: 248 },
        ];
  });

  protected selectedValue(attribute: string, values: readonly string[]): string {
    return this.selectedValues()[attribute] ?? this.defaultSelectedValue(this.component().name, attribute, values);
  }

  protected selectValue(attribute: string, value: string): void {
    this.selectedValues.update((current) => ({ ...current, [attribute]: value }));

    if (this.component().name === 'AfSplitter' && attribute === 'orientation') {
      this.splitterAction.set(`Orientation set to ${value}`);
    }

    this.pushEvent(`${attribute}: ${value}`);
  }

  protected booleanValue(attribute: string): boolean {
    if (this.component().name === 'AfDialog' && attribute === 'open') {
      return this.dialogOpen();
    }

    if (this.component().name === 'AfDrawer' && attribute === 'open') {
      return this.drawerOpen();
    }

    if (this.component().name === 'AfPopover' && attribute === 'open') {
      return this.popoverOpen();
    }

    if (this.component().name === 'AfTooltip' && attribute === 'open') {
      return this.tooltipOpen();
    }

    return this.selectedBooleans()[attribute] ?? this.defaultBooleanValue(attribute);
  }

  protected toggleBoolean(attribute: string): void {
    if (this.component().name === 'AfDialog' && attribute === 'open') {
      const nextValue = !this.dialogOpen();
      this.dialogOpen.set(nextValue);
      this.dialogAction.set(nextValue ? 'Opening preview dialog' : 'Dialog close requested');
      this.pushEvent(`open: ${nextValue}`);
      return;
    }

    if (this.component().name === 'AfDrawer' && attribute === 'open') {
      this.setDrawerOpen(!this.drawerOpen());
      return;
    }

    if (this.component().name === 'AfPopover' && attribute === 'open') {
      this.setPopoverOpen(!this.popoverOpen());
      return;
    }

    if (this.component().name === 'AfTooltip' && attribute === 'open') {
      this.setTooltipOpen(!this.tooltipOpen());
      return;
    }

    if (this.component().name === 'AfPageShell' && attribute === 'collapsed') {
      this.setPageShellCollapsed(!this.booleanValue(attribute));
      return;
    }

    if (this.component().name === 'AfCard' && attribute === 'selected') {
      const nextValue = !this.booleanValue(attribute);
      this.selectedBooleans.update((current) => ({ ...current, [attribute]: nextValue }));
      this.cardAction.set(nextValue ? 'Selected from control' : 'Cleared from control');
      this.pushEvent(`selected: ${nextValue ? 'on' : 'off'}`);
      return;
    }

    const nextValue = !this.booleanValue(attribute);
    this.selectedBooleans.update((current) => ({ ...current, [attribute]: nextValue }));
    this.pushEvent(`${attribute}: ${nextValue ? 'on' : 'off'}`);
  }

  protected setViewMode(mode: PreviewMode): void {
    this.viewMode.set(mode);
    this.pushEvent(`view: ${mode}`);
  }

  protected recordInteraction(label: string): void {
    this.pushEvent(label);
  }

  protected variationControlLabel(variation: ProductiveComponentVariation): string {
    if (this.component().name === 'AfAvatar' && variation.attribute === 'tone') {
      return 'fallback tone';
    }

    return variation.attribute;
  }

  protected handlePreviewClick(event: MouseEvent): void {
    if (this.component().name === 'AfAccordion' && this.toggleAccordionFromEvent(event)) {
      return;
    }

    this.recordInteraction('preview click');
  }

  protected cardVariant(): AfCardVariant {
    return this.selectedValue('variant', ['surface', 'elevated', 'metric', 'device', 'panel']) as AfCardVariant;
  }

  protected chartType(): AfChartType {
    return this.selectedValue('type', PREVIEW_CHART_TYPES) as AfChartType;
  }

  protected dividerOrientation(): AfDividerOrientation {
    return this.selectedValue('orientation', ['horizontal', 'vertical']) as AfDividerOrientation;
  }

  protected dividerTone(): AfDividerTone {
    return this.selectedValue('tone', ['subtle', 'accent']) as AfDividerTone;
  }

  protected panelDensity(): AfSectionDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfSectionDensity;
  }

  protected panelTone(): AfSurfaceTone {
    return this.selectedValue('tone', ['neutral', 'accent', 'success', 'warning']) as AfSurfaceTone;
  }

  protected scrollPanelDirection(): AfScrollPanelDirection {
    return this.selectedValue('direction', ['vertical', 'horizontal', 'both']) as AfScrollPanelDirection;
  }

  protected stepperDensity(): AfStepperDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfStepperDensity;
  }

  protected tabsDensity(): AfTabsDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfTabsDensity;
  }

  protected setTabsActiveId(activeId: string): void {
    this.tabsActiveId.set(activeId);
    this.tabsAction.set(`${activeId} tab selected.`);
    this.pushEvent(`tabs active: ${activeId}`);
  }

  protected recordTabChange(change: AfTabChange): void {
    this.tabsActiveId.set(change.activeId);
    this.tabsAction.set(`${change.item.label} is now active.`);
    this.pushEvent(`tabs: ${change.activeId}`);
  }

  protected toolbarDensity(): AfToolbarDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfToolbarDensity;
  }

  protected triggerToolbarAction(event: MouseEvent, action: string): void {
    event.stopPropagation();
    this.toolbarAction.set(action);
    this.pushEvent(`toolbar: ${action.toLowerCase()}`);
  }

  protected setStepperActiveId(activeId: string): void {
    this.stepperActiveId.set(activeId);
    this.stepperAction.set(`${activeId} panel selected.`);
    this.pushEvent(`stepper active: ${activeId}`);
  }

  protected recordStepperChange(change: AfStepChange): void {
    this.stepperActiveId.set(change.activeId);
    this.stepperAction.set(`${change.step.label} is now active.`);
    this.pushEvent(`stepper step: ${change.activeId}`);
  }

  protected chartTone(): AfChartTone {
    return this.selectedValue('tone', ['default', 'primary', 'success', 'warning', 'danger']) as AfChartTone;
  }

  protected chartDensity(): AfChartDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfChartDensity;
  }

  protected chartCategories(): readonly string[] {
    switch (this.chartType()) {
      case 'sparkline':
        return PREVIEW_CHART_SPARKLINE_CATEGORIES;
      case 'heatmap':
        return PREVIEW_CHART_HEATMAP_CATEGORIES;
      case 'donut':
      case 'gauge':
      case 'parallel':
        return [];
      default:
        return PREVIEW_CHART_CARTESIAN_CATEGORIES;
    }
  }

  protected chartSeries(): readonly AfChartSeries[] {
    switch (this.chartType()) {
      case 'sparkline':
        return PREVIEW_CHART_SPARKLINE_SERIES;
      case 'donut':
        return PREVIEW_CHART_DONUT_SERIES;
      case 'gauge':
        return PREVIEW_CHART_GAUGE_SERIES;
      case 'radar':
        return PREVIEW_CHART_RADAR_SERIES;
      case 'heatmap':
        return PREVIEW_CHART_HEATMAP_SERIES;
      case 'boxplot':
        return PREVIEW_CHART_BOXPLOT_SERIES;
      case 'parallel':
        return PREVIEW_CHART_PARALLEL_SERIES;
      default:
        return PREVIEW_CHART_CARTESIAN_SERIES;
    }
  }

  protected chartIndicators(): readonly AfChartIndicator[] {
    switch (this.chartType()) {
      case 'gauge':
        return PREVIEW_CHART_GAUGE_INDICATORS;
      case 'radar':
        return PREVIEW_CHART_RADAR_INDICATORS;
      case 'parallel':
        return PREVIEW_CHART_PARALLEL_INDICATORS;
      default:
        return [];
    }
  }

  protected chartHeight(): number {
    switch (this.chartType()) {
      case 'sparkline':
        return 72;
      case 'gauge':
      case 'donut':
      case 'radar':
      case 'parallel':
        return 260;
      default:
        return 240;
    }
  }

  protected onChartPointSelect(event: AfChartPointEvent): void {
    const category = event.category ? `${event.category} · ` : '';
    this.chartAction.set(`${category}${event.seriesName} = ${Array.isArray(event.value) ? event.value.join(' / ') : event.value}`);
    this.pushEvent(`chart: ${event.seriesName}`);
  }

  protected cardDensity(): AfCardDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfCardDensity;
  }

  protected cardTone(): AfCardTone {
    return this.selectedValue('tone', ['neutral', 'primary', 'success', 'warning', 'danger']) as AfCardTone;
  }

  protected onCardPressed(event: Event): void {
    event.stopPropagation();

    const selected = !this.booleanValue('selected');
    this.selectedBooleans.update((current) => ({ ...current, selected }));
    this.cardAction.set(selected ? 'Pressed event selected the card' : 'Pressed event cleared selection');
    this.pushEvent(`pressed: ${selected ? 'selected' : 'cleared'}`);
  }

  protected pageShellDensity(): AfPageShellDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfPageShellDensity;
  }

  protected pageShellVariant(): AfPageShellVariant {
    return this.selectedValue('variant', ['app', 'dashboard', 'contained']) as AfPageShellVariant;
  }

  protected pageShellActiveLabel(): string {
    return this.pageShellNavItems.find((item) => item.id === this.pageShellActiveItem())?.label ?? 'Overview';
  }

  protected selectPageShellNavItem(item: AfNavigationItem): void {
    if (item.disabled) {
      return;
    }

    this.pageShellActiveItem.set(item.id);
    this.pageShellAction.set(`${item.label} selected`);
    this.pushEvent(`nav: ${item.label}`);
  }

  protected selectPageShellBreadcrumb(item: AfBreadcrumbItem): void {
    this.pageShellAction.set(`${item.label} breadcrumb selected`);
    this.pushEvent(`breadcrumb: ${item.label}`);
  }

  protected setPageShellCollapsed(collapsed: boolean): void {
    this.selectedBooleans.update((current) => ({ ...current, collapsed }));
    this.pageShellAction.set(collapsed ? 'Navigation collapsed' : 'Navigation expanded');
    this.pushEvent(collapsed ? 'collapsed' : 'expanded');
  }

  protected setPageShellSearch(query: string): void {
    this.pageShellQuery.set(query);
    this.pageShellAction.set(query ? `Search: ${query}` : 'Search cleared');
    this.pushEvent(query ? `search: ${query}` : 'search cleared');
  }

  protected activatePageShellCommand(event: MouseEvent, action: string): void {
    event.stopPropagation();
    this.pageShellAction.set(action);
    this.pushEvent(action.toLowerCase());
  }

  protected splitterOrientation(): AfSplitterOrientation {
    return this.selectedValue('orientation', ['horizontal', 'vertical']) as AfSplitterOrientation;
  }

  protected onSplitterPrimarySizeChange(size: number): void {
    const roundedSize = Math.round(size);
    this.splitterPrimarySize.set(roundedSize);
    this.splitterAction.set(`Primary pane resized to ${roundedSize}%`);
    this.pushEvent(`primarySize: ${roundedSize}%`);
  }

  protected toastSeverity(): AfFeedbackSeverity {
    return this.selectedValue('severity', ['success', 'info', 'warning', 'danger']) as AfFeedbackSeverity;
  }

  protected toastPlacement(): AfToastPlacement {
    return this.selectedValue('placement', ['top-end', 'top-center', 'bottom-center']) as AfToastPlacement;
  }

  protected toastContextMessage(): string {
    return this.component().name === 'AfToast'
      ? 'AfToast is the notification payload. In real product flows it becomes visible through AfToastViewport and is usually triggered by AfToastService.'
      : 'AfToastViewport is the shell-level mount point. It listens to AfToastService and positions the active stack on screen.';
  }

  protected toastEmptyMessage(): string {
    return this.component().name === 'AfToast'
      ? 'Dispatch the current severity to inspect the rendered toast inside the viewport.'
      : 'Change placement from the controls and trigger a preview toast to verify the stack position.';
  }

  protected toastStatusMeta(): string {
    const activeToast = this.previewToasts().at(-1);

    if (!activeToast) {
      return `placement: ${this.toastPlacement()}`;
    }

    return `${activeToast.id} · ${activeToast.severity}${activeToast.persistent ? ' · persistent' : ''}`;
  }

  protected showPreviewToast(event: MouseEvent): void {
    event.stopPropagation();

    const severity = this.toastSeverity();
    const persistent = this.component().name === 'AfToast' ? this.booleanValue('persistent') : false;

    this.toastService.show({
      id: 'docs-preview-toast',
      title: this.toastTitle(severity),
      description: this.toastDescription(severity),
      severity,
      duration: persistent ? 0 : 5000,
      persistent,
    });

    this.toastAction.set(
      persistent
        ? `${severity} toast pinned until dismissed or cleared.`
        : `${severity} toast dispatched through AfToastService.`,
    );
    this.pushEvent(`toast: ${severity}`);
  }

  protected clearPreviewToasts(event: MouseEvent): void {
    event.stopPropagation();
    this.toastService.clear();
    this.toastAction.set('Preview toasts cleared.');
    this.pushEvent('toast: cleared');
  }

  protected dialogSize(): AfDialogSize {
    return this.selectedValue('size', ['sm', 'md', 'lg', 'xl', 'fullscreen']) as AfDialogSize;
  }

  protected dialogTone(): AfDialogTone {
    return this.selectedValue('tone', ['neutral', 'info', 'success', 'danger']) as AfDialogTone;
  }

  protected dialogMobilePresentation(): AfDialogMobilePresentation {
    return this.selectedValue('mobilePresentation', ['sheet', 'fullscreen']) as AfDialogMobilePresentation;
  }

  protected openDialog(event: MouseEvent): void {
    event.stopPropagation();
    this.dialogOpen.set(true);
    this.dialogAction.set('Opening preview dialog');
    this.pushEvent('open requested');
  }

  protected setDialogOpen(open: boolean): void {
    this.dialogOpen.set(open);
    this.dialogAction.set(open ? 'Dialog opened' : 'Dialog close requested');
    this.pushEvent(`open: ${open}`);
  }

  protected closeDialog(event: MouseEvent, action: string): void {
    event.stopPropagation();
    this.dialogOpen.set(false);
    this.dialogAction.set(action);
    this.pushEvent(action.toLowerCase());
  }

  protected onDialogOpened(): void {
    this.dialogAction.set('Dialog mounted and focus trapped');
    this.pushEvent('opened');
  }

  protected onDialogClosed(): void {
    this.dialogAction.update((current) => current === 'Dialog close requested' ? 'Dialog closed' : current);
    this.pushEvent('closed');
  }

  protected onDialogBackdropPress(): void {
    this.dialogAction.set('Backdrop pressed');
    this.pushEvent('backdrop press');
  }

  protected onDialogEscapePress(event: KeyboardEvent): void {
    event.stopPropagation();
    this.dialogAction.set('Escape pressed');
    this.pushEvent('escape press');
  }

  protected drawerPlacement(): AfDrawerPlacement {
    return this.selectedValue('placement', ['start', 'end', 'bottom']) as AfDrawerPlacement;
  }

  protected drawerSize(): AfDrawerSize {
    return this.selectedValue('size', ['sm', 'md', 'lg', 'full']) as AfDrawerSize;
  }

  protected drawerTone(): AfDrawerTone {
    return this.selectedValue('tone', ['neutral', 'primary']) as AfDrawerTone;
  }

  protected drawerStatusMeta(): string {
    return `${this.drawerPlacement()} | ${this.drawerSize()} | ${this.drawerTone()}`;
  }

  protected openDrawer(event: MouseEvent): void {
    event.stopPropagation();
    this.drawerOpen.set(true);
    this.drawerAction.set('Opening preview drawer');
    this.pushEvent('drawer open requested');
  }

  protected setDrawerOpen(open: boolean): void {
    this.drawerOpen.set(open);
    this.drawerAction.set(open ? 'Drawer opened from the preview trigger.' : 'Drawer close requested');
    this.pushEvent(`drawer: ${open ? 'open' : 'closed'}`);
  }

  protected closeDrawer(event: MouseEvent, action: string): void {
    event.stopPropagation();
    this.drawerOpen.set(false);
    this.drawerAction.set(action);
    this.pushEvent(action.toLowerCase());
  }

  protected onDrawerOpened(): void {
    this.drawerAction.set('Drawer mounted and ready for supporting tasks.');
    this.pushEvent('drawer opened');
  }

  protected onDrawerClosed(): void {
    this.drawerAction.update((current) => current === 'Drawer close requested' ? 'Drawer closed' : current);
    this.pushEvent('drawer closed');
  }

  protected onDrawerBackdropPress(): void {
    this.drawerAction.set('Backdrop press detected.');
    this.pushEvent('drawer backdrop');
  }

  protected onDrawerEscapePress(event: KeyboardEvent): void {
    event.stopPropagation();
    this.drawerAction.set('Escape press detected.');
    this.pushEvent('drawer escape');
  }

  protected popoverPlacement(): AfPopoverPlacement {
    return this.selectedValue('placement', ['top', 'right', 'bottom', 'left']) as AfPopoverPlacement;
  }

  protected popoverTone(): AfPopoverTone {
    return this.selectedValue('tone', ['neutral', 'primary']) as AfPopoverTone;
  }

  protected popoverStatusMeta(): string {
    return `${this.popoverPlacement()} | ${this.popoverTone()}`;
  }

  protected setPopoverOpen(open: boolean): void {
    this.popoverOpen.set(open);
    this.popoverAction.set(open ? 'Popover opened from the trigger.' : 'Popover closed from the trigger.');
    this.pushEvent(`popover: ${open ? 'open' : 'closed'}`);
  }

  protected onPopoverOpened(): void {
    this.popoverAction.set('Panel is open and focus behavior is active.');
    this.pushEvent('popover opened');
  }

  protected onPopoverClosed(): void {
    this.popoverAction.set('Panel closed and focus returned to the trigger.');
    this.pushEvent('popover closed');
  }

  protected onPopoverBackdropPress(): void {
    this.popoverAction.set('Backdrop press detected.');
    this.pushEvent('popover backdrop');
  }

  protected onPopoverEscapePress(event: KeyboardEvent): void {
    event.stopPropagation();
    this.popoverAction.set('Escape press detected.');
    this.pushEvent('popover escape');
  }

  protected selectPopoverAction(event: MouseEvent, action: string): void {
    event.stopPropagation();
    this.popoverAction.set(`${action} from popover content.`);
    this.pushEvent(`popover action: ${action.toLowerCase()}`);
  }

  protected tooltipPlacement(): AfTooltipPlacement {
    return this.selectedValue('placement', ['top', 'right', 'bottom', 'left']) as AfTooltipPlacement;
  }

  protected tooltipTone(): AfTooltipTone {
    return this.selectedValue('tone', ['neutral', 'primary']) as AfTooltipTone;
  }

  protected tooltipStatusMeta(): string {
    return `${this.tooltipPlacement()} | ${this.tooltipTone()}`;
  }

  protected setTooltipOpen(open: boolean): void {
    this.tooltipOpen.set(open);
    this.tooltipAction.set(open ? 'Tooltip visible with the current helper copy.' : 'Tooltip hidden until the trigger is used again.');
    this.pushEvent(`tooltip: ${open ? 'open' : 'closed'}`);
  }

  protected toggleTooltip(event: MouseEvent): void {
    event.stopPropagation();
    this.setTooltipOpen(!this.tooltipOpen());
  }

  protected kanbanDensity(): AfKanbanDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfKanbanDensity;
  }

  protected setKanbanFilter(change: AfKanbanFilterChange): void {
    this.kanbanActiveFilter.set(change.filterId);
    this.kanbanAction.set(`${change.filter.label} filter applied.`);
    this.pushEvent(`kanban filter: ${change.filterId}`);
  }

  protected setKanbanMove(change: AfKanbanMoveEvent): void {
    this.kanbanCards.set(change.cards);
    this.kanbanAction.set(`${change.card.title} moved to ${this.kanbanColumnLabel(change.toColumnId)}.`);
    this.pushEvent(`kanban move: ${change.card.id}`);
  }

  protected recordKanbanCardClick(event: AfKanbanCardClickEvent): void {
    this.kanbanAction.set(`${event.card.title} opened from ${this.kanbanColumnLabel(event.columnId)}.`);
    this.pushEvent(`kanban card: ${event.card.id}`);
  }

  protected addKanbanCard(event: AfKanbanAddCardEvent): void {
    const columnId = event.columnId ?? this.kanbanColumns()[0]?.id ?? 'queued';
    const nextIndex = this.kanbanCards().length + 1;
    const activeFilter = this.kanbanActiveFilter();
    const nextCategory = activeFilter && activeFilter !== 'all' ? activeFilter : 'docs';
    const newCard: AfKanbanCard = {
      id: `card-${nextIndex}`,
      columnId,
      title: `Workflow ${nextIndex}`,
      description: 'Preview card added from the docs workbench.',
      category: nextCategory,
      priority: 'medium',
      assigneeName: 'ArgFit',
      assigneeInitials: 'AF',
      dateLabel: 'Now',
      meta: event.trigger === 'column' ? 'column add' : 'board add',
    };

    this.kanbanCards.update((cards) => [...cards, newCard]);
    this.kanbanAction.set(`Added ${newCard.title} to ${this.kanbanColumnLabel(columnId)}.`);
    this.pushEvent(`kanban add: ${columnId}`);
  }

  protected recordKanbanColumnAction(event: AfKanbanColumnActionEvent): void {
    this.kanbanAction.set(`${event.column.label} action requested.`);
    this.pushEvent(`kanban column: ${event.columnId}`);
  }

  protected orderListDensity(): AfOrderListDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfOrderListDensity;
  }

  protected orderListSelectionMode(): AfOrderListSelectionMode {
    return this.selectedValue('selectionMode', ['single', 'multiple']) as AfOrderListSelectionMode;
  }

  protected setOrderListSelection(selection: AfOrderListSelectedIds): void {
    this.orderListSelectedIds.set(selection);
    this.orderListAction.set(selection.length > 0 ? `${selection.length} workflow items selected.` : 'Selection cleared.');
    this.pushEvent(selection.length > 0 ? `order list selection: ${selection.length}` : 'order list selection cleared');
  }

  protected setOrderListReorder(change: AfOrderListReorderChange<AfOrderListItem>): void {
    this.previewOrderListItems.set(change.items);
    this.orderListSelectedIds.set(change.selectedIds);
    this.orderListAction.set(`Order updated via ${change.direction}.`);
    this.pushEvent(`order list: ${change.direction}`);
  }

  protected organizationChartDensity(): AfOrganizationChartDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfOrganizationChartDensity;
  }

  protected organizationChartSelectionMode(): AfOrganizationChartSelectionMode {
    return this.selectedValue('selectionMode', ['none', 'single', 'multiple']) as AfOrganizationChartSelectionMode;
  }

  protected setOrganizationChartSelection(selection: AfOrganizationChartSelectedIds): void {
    this.organizationChartSelectedIds.set(selection);
    this.organizationChartAction.set(selection.length > 0 ? `${selection.length} hierarchy nodes selected.` : 'Selection cleared.');
    this.pushEvent(selection.length > 0 ? `org chart selection: ${selection.length}` : 'org chart selection cleared');
  }

  protected setOrganizationChartExpanded(expanded: AfOrganizationChartExpandedIds): void {
    this.organizationChartExpandedIds.set(expanded);
    this.organizationChartAction.set(expanded.length > 0 ? `${expanded.length} branches expanded.` : 'All branches collapsed.');
    this.pushEvent(expanded.length > 0 ? `org chart expanded: ${expanded.length}` : 'org chart collapsed');
  }

  protected recordOrganizationChartNode(node: AfOrganizationChartNode): void {
    this.organizationChartAction.set(`${node.label} pressed.`);
    this.pushEvent(`org chart node: ${node.id}`);
  }

  protected paginatorDensity(): AfPaginatorDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfPaginatorDensity;
  }

  protected paginatorSummary(): string {
    const state = this.paginatorState();

    if (state.totalItems === 0) {
      return 'Showing 0-0 of 0';
    }

    const start = state.pageIndex * state.pageSize + 1;
    const end = Math.min(state.totalItems, start + state.pageSize - 1);
    return `Showing ${start}-${end} of ${state.totalItems}`;
  }

  protected setPaginatorPage(page: AfPaginatorPageChange): void {
    this.paginatorState.update((current) => ({ ...current, ...page }));
    this.paginatorAction.set(`Page ${page.pageIndex + 1} selected.`);
    this.pushEvent(`paginator: ${page.pageIndex + 1}`);
  }

  protected pickListDensity(): AfPickListDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfPickListDensity;
  }

  protected setPickListSourceSelection(selection: AfPickListSelectedIds): void {
    this.pickListSourceSelectedIds.set(selection);
    this.pickListAction.set(selection.length > 0 ? `${selection.length} backlog items selected.` : 'Backlog selection cleared.');
    this.pushEvent(selection.length > 0 ? `pick list source: ${selection.length}` : 'pick list source cleared');
  }

  protected setPickListTargetSelection(selection: AfPickListSelectedIds): void {
    this.pickListTargetSelectedIds.set(selection);
    this.pickListAction.set(selection.length > 0 ? `${selection.length} assigned items selected.` : 'Assigned selection cleared.');
    this.pushEvent(selection.length > 0 ? `pick list target: ${selection.length}` : 'pick list target cleared');
  }

  protected applyPickListTransfer(change: AfPickListChange<AfPickListItem>): void {
    this.pickListSourceItems.set(change.sourceItems);
    this.pickListTargetItems.set(change.targetItems);
    this.pickListSourceSelectedIds.set(change.sourceSelectedIds);
    this.pickListTargetSelectedIds.set(change.targetSelectedIds);
    this.pickListAction.set(`Transfer applied via ${change.direction}.`);
    this.pushEvent(`pick list: ${change.direction}`);
  }

  protected dataTableDensity(): AfDataTableDensity {
    return this.selectedValue('density', ['compact', 'normal', 'comfortable']) as AfDataTableDensity;
  }

  protected dataTableSelectionMode(): AfDataTableSelectionMode {
    return this.selectedValue('selectionMode', ['none', 'single', 'multiple']) as AfDataTableSelectionMode;
  }

  protected dataTablePagination(): AfDataTablePagination {
    return {
      ...this.dataTablePageState(),
      totalItems: this.previewDataTableRows.length,
    };
  }

  protected setDataTableSort(sort: AfDataTableSort): void {
    this.dataTableSort.set(sort);
    this.dataTablePageState.update((current) => ({ ...current, pageIndex: 0 }));
    this.dataTableAction.set(`Sorted by ${sort.key} ${sort.direction}.`);
    this.pushEvent(`table sort: ${sort.key} ${sort.direction}`);
  }

  protected setDataTablePage(page: AfDataTablePageChange): void {
    this.dataTablePageState.update((current) => ({ ...current, ...page }));
    this.dataTableAction.set(`Page ${page.pageIndex + 1} selected.`);
    this.pushEvent(`table page: ${page.pageIndex + 1}`);
  }

  protected setDataTableSelection(selection: readonly string[]): void {
    this.dataTableSelectedRowIds.set(selection);
    this.dataTableAction.set(selection.length > 0 ? `${selection.length} rows selected.` : 'Selection cleared.');
    this.pushEvent(selection.length > 0 ? `table selection: ${selection.length}` : 'table selection cleared');
  }

  protected setDataTableExpanded(expanded: readonly string[]): void {
    this.dataTableExpandedRowIds.set(expanded);
    this.dataTableAction.set(expanded.length > 0 ? `${expanded.length} detail rows open.` : 'All row details collapsed.');
    this.pushEvent(expanded.length > 0 ? `table expanded: ${expanded.length}` : 'table collapsed');
  }

  protected recordDataTableRow(row: unknown): void {
    if (!this.isPreviewDataTableRow(row)) {
      return;
    }

    this.dataTableAction.set(`${row.surface} pressed.`);
    this.pushEvent(`table row: ${row.id}`);
  }

  protected previewDataTableField(row: unknown, field: keyof PreviewDataTableRow): string {
    if (!this.isPreviewDataTableRow(row)) {
      return '';
    }

    return String(row[field]);
  }

  protected dataViewLayout(): AfDataViewLayout {
    return this.selectedValue('layout', ['grid', 'list']) as AfDataViewLayout;
  }

  protected dataViewDensity(): AfDataViewDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfDataViewDensity;
  }

  protected selectDataViewItem(item: AfDataViewItem): void {
    this.dataViewAction.set(`${item.title} selected from the preview.`);
    this.pushEvent(`data view: ${item.id}`);
  }

  protected inputGroupDensity(): AfFieldDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfFieldDensity;
  }

  protected iconFieldDensity(): AfFieldDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfFieldDensity;
  }

  protected iconFieldLabelMode(): AfFieldLabelMode {
    return this.selectedValue('labelMode', ['stacked', 'float', 'ifta']) as AfFieldLabelMode;
  }

  protected iconFieldState(): AfFieldState {
    return this.selectedValue('state', ['default', 'error', 'success']) as AfFieldState;
  }

  protected iconFieldHelperText(): string {
    if (this.iconFieldState() === 'success') {
      return 'The query is ready to narrow the current workbench view.';
    }

    return 'Type a keyword and clear it from the suffix action.';
  }

  protected iconFieldErrorText(): string | undefined {
    return this.iconFieldState() === 'error'
      ? 'Review the query before applying it.'
      : undefined;
  }

  protected setIconFieldValue(event: Event): void {
    event.stopPropagation();

    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.iconFieldValue.set(target.value);
    this.iconFieldAction.set(target.value ? 'Search query updated.' : 'Search query cleared.');
    this.pushEvent(target.value ? `icon field: ${target.value}` : 'icon field: cleared');
  }

  protected clearIconFieldValue(event: MouseEvent): void {
    event.stopPropagation();
    this.iconFieldValue.set('');
    this.iconFieldAction.set('Search query cleared from the suffix action.');
    this.pushEvent('icon field: cleared');
  }

  protected inputGroupLabelMode(): AfFieldLabelMode {
    return this.selectedValue('labelMode', ['stacked', 'float', 'ifta']) as AfFieldLabelMode;
  }

  protected inputGroupState(): AfFieldState {
    return this.selectedValue('state', ['default', 'error', 'success']) as AfFieldState;
  }

  protected inputGroupHelperText(): string {
    if (this.inputGroupState() === 'success') {
      return 'Target value is ready for the current workflow.';
    }

    return 'Edit the value and apply it through the suffix action.';
  }

  protected inputGroupErrorText(): string | undefined {
    return this.inputGroupState() === 'error'
      ? 'Review the target before applying it.'
      : undefined;
  }

  protected setInputGroupValue(event: Event): void {
    event.stopPropagation();

    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.inputGroupValue.set(target.value);
    this.inputGroupAction.set('Draft value updated');
    this.pushEvent(`value: ${target.value}`);
  }

  protected applyInputGroupValue(event: MouseEvent): void {
    event.stopPropagation();
    this.inputGroupAction.set(`Applied ${this.inputGroupValue()} kg`);
    this.pushEvent(`applied ${this.inputGroupValue()} kg`);
  }

  protected multiSelectDensity(): AfSelectionDensity {
    return this.selectedValue('density', ['compact', 'comfortable']) as AfSelectionDensity;
  }

  protected setMultiSelectValue(value: readonly unknown[]): void {
    this.multiSelectValue.set(value);
    this.multiSelectAction.set(value.length > 0 ? `${value.length} selections active in the preview.` : 'Selection cleared.');
    this.pushEvent(value.length > 0 ? `multi-select: ${value.length}` : 'multi-select cleared');
  }

  protected recordMultiSelectSearch(query: string): void {
    this.multiSelectAction.set(query ? `Filtering options by "${query}".` : `${this.multiSelectValue().length} selections visible.`);
    this.pushEvent(query ? `multi-select search: ${query}` : 'multi-select search cleared');
  }

  protected setMultiSelectOpen(open: boolean): void {
    this.multiSelectAction.set(open ? 'Picker opened from the preview trigger.' : `${this.multiSelectValue().length} selections active.`);
    this.pushEvent(`multi-select: ${open ? 'open' : 'closed'}`);
  }

  protected recordMultiSelectClear(): void {
    this.multiSelectAction.set('Selection cleared from the trigger action.');
    this.pushEvent('multi-select clear');
  }

  private sampleValueForInput(componentName: string, apiInput: ProductiveComponentApiAttribute): unknown {
    if (this.isBooleanValues(apiInput.values)) {
      return this.booleanValue(apiInput.name);
    }

    if (apiInput.values.length > 0) {
      return this.selectedValue(apiInput.name, apiInput.values);
    }

    switch (apiInput.name) {
      case 'activeFilter':
        return componentName === 'AfKanban' ? 'all' : this.sampleValue(componentName);
      case 'activeId':
      case 'activeItem':
      case 'activeTab':
      case 'value':
        return componentName === 'AfSlider' ? 6 : this.sampleValue(componentName);
      case 'ariaDescribedBy':
      case 'ariaLabel':
        if (componentName === 'AfAvatar') {
          return 'Maya Chen, product lead';
        }

        return `${componentName} live preview`;
      case 'breadcrumbs':
        return SAMPLE_BREADCRUMBS;
      case 'cards':
        return SAMPLE_KANBAN_CARDS;
      case 'categories':
        return SAMPLE_CATEGORIES;
      case 'columns':
        return componentName === 'AfKanban' ? SAMPLE_KANBAN_COLUMNS : SAMPLE_COLUMNS;
      case 'expandedIds':
        return componentName === 'AfAccordion' ? this.expandedIdsFor(componentName, ['evaluation']) : ['platform'];
      case 'expandedRowIds':
      case 'selectedRowIds':
        return ['shell'];
      case 'filters':
        return SAMPLE_FILTERS;
      case 'files':
      case 'progress':
        return [];
      case 'marks':
        return componentName === 'AfSlider'
          ? [
              { value: 0, label: 'Very light' },
              { value: 6, label: 'Working' },
              { value: 10, label: 'Maximum' },
            ]
          : [];
      case 'icon':
        return componentName === 'AfAvatar' && this.avatarPresentationMode() === 'icon' ? 'users' : undefined;
      case 'imageAlt':
        return componentName === 'AfAvatar' ? 'Portrait of Maya Chen' : undefined;
      case 'imageSrc':
        return componentName === 'AfAvatar' && this.avatarPresentationMode() === 'photo' ? SAMPLE_AVATAR_IMAGE_URL : undefined;
      case 'indicators':
        return SAMPLE_INDICATORS;
      case 'items':
        return this.sampleItems(componentName);
      case 'mobileTabs':
      case 'navItems':
        return SAMPLE_NAV_ITEMS;
      case 'nodes':
        return SAMPLE_TREE_NODES;
      case 'options':
        return SAMPLE_OPTIONS;
      case 'pagination':
        return { pageIndex: 0, pageSize: 3, totalItems: 12 };
      case 'rows':
        return componentName === 'AfTextarea' ? 4 : SAMPLE_ROWS;
      case 'selectedIds':
        return ['insight'];
      case 'series':
        return SAMPLE_SERIES;
      case 'sort':
        return { key: 'surface', direction: 'asc' };
      case 'sourceItems':
        return SAMPLE_COLLECTION_ITEMS.slice(0, 2);
      case 'sourceSelectedIds':
        return ['insight'];
      case 'steps':
        return [
          { id: 'scope', label: 'Scope', description: 'Define surface' },
          { id: 'api', label: 'API', description: 'Review inputs' },
          { id: 'ship', label: 'Ship', description: 'Run gate' },
        ];
      case 'targetItems':
        return SAMPLE_COLLECTION_ITEMS.slice(2);
      case 'targetSelectedIds':
        return ['release'];
      case 'cardIdKey':
        return 'id';
      case 'columnIdKey':
        return 'columnId';
      case 'optionLabel':
        return 'label';
      case 'optionValue':
        return 'value';
      case 'rowIdKey':
        return 'id';
      case 'treeColumnKey':
        return 'surface';
      case 'emptyState':
        return { title: 'No work queued', description: 'The preview dataset is ready to edit.' };
      case 'max':
      case 'maxValue':
        return 100;
      case 'maxFiles':
        return 3;
      case 'maxSizeBytes':
        return 10 * 1024 * 1024;
      case 'maxLength':
        return 180;
      case 'maxSelected':
        return 3;
      case 'min':
      case 'minValue':
        return 0;
      case 'minPrimarySize':
      case 'minSecondarySize':
        return 160;
      case 'notificationCount':
        return 7;
      case 'overscan':
        return 4;
      case 'pageIndex':
        return 0;
      case 'pageSize':
        return 3;
      case 'precision':
        return 0;
      case 'primarySize':
        return 58;
      case 'step':
        return 1;
      case 'skeletonWidth':
        return '72%';
      case 'actions':
        return componentName === 'AfEmptyState'
          ? [{ id: 'create', label: 'Create item', variant: 'primary' }]
          : [];
      case 'title':
        return componentName === 'AfEmptyState' ? 'No sessions yet' : `${componentName} preview`;
      case 'label':
        return componentName === 'AfAvatar'
          ? this.avatarPresentationMode() === 'initials'
            ? 'Maya Chen'
            : undefined
          : this.projectedLabel();
      case 'description':
      case 'emptyDescription':
      case 'helper':
      case 'helperText':
      case 'hint':
      case 'subtitle':
        return 'Interactive ArgFit documentation preview.';
      case 'placeholder':
        return 'Try the adaptive contract';
      case 'text':
        return 'Component surface';
      case 'unit':
        return '%';
      case 'initials':
        return componentName === 'AfAvatar' && this.avatarPresentationMode() === 'initials' ? 'MC' : componentName === 'AfAvatar' ? undefined : 'AF';
      case 'userInitials':
        return 'AF';
      default:
        return this.defaultScalarValue(apiInput.name);
    }
  }

  private sampleItems(componentName: string): readonly Record<string, unknown>[] {
    if (componentName === 'AfAccordion') {
      return SAMPLE_ACCORDION_ITEMS;
    }

    if (componentName === 'AfTabs') {
      return SAMPLE_COLLECTION_ITEMS.map((item) => ({ id: item.id, label: item.label, description: item.description, badge: item.badge }));
    }

    return SAMPLE_COLLECTION_ITEMS;
  }

  private toastTitle(severity: AfFeedbackSeverity): string {
    switch (severity) {
      case 'success':
        return 'Session saved';
      case 'warning':
        return 'Review the pending checks';
      case 'danger':
        return 'Release blocked';
      case 'info':
      default:
        return 'Sync completed';
    }
  }

  private toastDescription(severity: AfFeedbackSeverity): string {
    switch (severity) {
      case 'success':
        return 'The athlete profile is now available to the coaching staff.';
      case 'warning':
        return 'Some contract fields still need confirmation before publishing.';
      case 'danger':
        return 'The release remains blocked until the failing checks are resolved.';
      case 'info':
      default:
        return 'Documentation indexes and previews were refreshed successfully.';
    }
  }

  private sampleValue(componentName: string): unknown {
    if (componentName === 'AfProgress' || componentName === 'AfInputCount') {
      return 68;
    }

    if (componentName === 'AfAnalyticsCard' || componentName === 'AfMetricCard') {
      return 94;
    }

    if (componentName === 'AfMultiSelect') {
      return ['pipeline', 'analytics'];
    }

    return 'pipeline';
  }

  private defaultSelectedValue(componentName: string, attribute: string, values: readonly string[]): string {
    if (componentName === 'AfAvatar') {
      if (attribute === 'presentation') {
        return 'photo';
      }

      if (attribute === 'size' && values.includes('lg')) {
        return 'lg';
      }

      if (attribute === 'tone' && values.includes('neutral')) {
        return 'neutral';
      }
    }

    if (componentName === 'AfPageShell' && attribute === 'variant' && values.includes('dashboard')) {
      return 'dashboard';
    }

    if (componentName === 'AfPopover' && attribute === 'placement' && values.includes('bottom')) {
      return 'bottom';
    }

    if (componentName === 'AfOrganizationChart' && attribute === 'selectionMode' && values.includes('single')) {
      return 'single';
    }

    if (attribute === 'density' && values.includes('comfortable')) {
      return 'comfortable';
    }

    if (attribute === 'size' && values.includes('md')) {
      return 'md';
    }

    if (attribute === 'state' && values.includes('default')) {
      return 'default';
    }

    if (attribute === 'variant' && values.includes('primary')) {
      return 'primary';
    }

    return values[0] ?? '';
  }

  private avatarPresentationMode(): AvatarPresentationMode {
    const selectedPresentation = this.selectedValues()['presentation'];
    return AVATAR_PRESENTATION_VALUES.includes(selectedPresentation as AvatarPresentationMode)
      ? selectedPresentation as AvatarPresentationMode
      : 'photo';
  }

  private kanbanColumnLabel(columnId: string): string {
    return this.kanbanColumns().find((column) => column.id === columnId)?.label ?? columnId;
  }

  private expandedIdsFor(componentName: string, defaultIds: readonly string[]): readonly string[] {
    return this.selectedExpandedIds()[componentName] ?? defaultIds;
  }

  private toggleAccordionFromEvent(event: MouseEvent): boolean {
    const target = event.target;

    if (!(target instanceof Element)) {
      return false;
    }

    const button = target.closest('button');

    if (!button) {
      return false;
    }

    const buttonText = button.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const item = SAMPLE_ACCORDION_ITEMS.find((accordionItem) => buttonText.includes(accordionItem.label));

    if (!item) {
      return false;
    }

    const currentExpandedIds = this.expandedIdsFor('AfAccordion', ['evaluation']);
    const isExpanded = currentExpandedIds.includes(item.id);
    const nextExpandedIds = isExpanded
      ? currentExpandedIds.filter((expandedId) => expandedId !== item.id)
      : this.booleanValue('multiple')
        ? [...currentExpandedIds, item.id]
        : [item.id];

    this.selectedExpandedIds.update((current) => ({ ...current, AfAccordion: nextExpandedIds }));
    this.pushEvent(`${item.label}: ${isExpanded ? 'collapsed' : 'expanded'}`);

    return true;
  }

  private defaultScalarValue(attribute: string): unknown {
    if (attribute.endsWith('Label')) {
      return 'Preview action';
    }

    if (attribute.endsWith('Title')) {
      return 'Preview state';
    }

    return undefined;
  }

  private defaultBooleanValue(attribute: string): boolean {
    return [
      'allowCrossColumnMove',
      'allowManualInput',
      'allowReorder',
      'checked',
      'clearable',
      'closeOnBackdrop',
      'closeOnEscape',
      'collapsible',
      'dismissible',
      'interactive',
      'legend',
      'searchable',
      'showGrid',
      'showSearch',
    ].includes(attribute);
  }

  private projectedLabel(): string {
    return this.component().name === 'AfButton' ? 'Run workflow' : 'Adaptive component';
  }

  private isPreviewDataTableRow(value: unknown): value is PreviewDataTableRow {
    return typeof value === 'object'
      && value !== null
      && 'id' in value
      && 'surface' in value
      && 'status' in value
      && 'owner' in value
      && 'detail' in value;
  }

  private isBooleanValues(values: readonly string[]): boolean {
    return values.includes('false') && values.includes('true');
  }

  private pushEvent(event: string): void {
    this.eventLog.update((current) => [`${this.component().name} ${event}`, ...current].slice(0, 3));
  }
}
