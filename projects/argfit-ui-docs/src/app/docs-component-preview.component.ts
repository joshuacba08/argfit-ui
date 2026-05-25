import { DOCUMENT, NgComponentOutlet, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { ProductiveComponentApiAttribute, ProductiveComponentDoc, ProductiveComponentVariation } from './docs-data';

interface PreviewBar {
  readonly label: string;
  readonly width: number;
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
  { id: 'queued', label: 'Queued', badge: { label: '3', tone: 'neutral' } },
  { id: 'active', label: 'Active', badge: { label: '2', tone: 'primary' } },
  { id: 'done', label: 'Validated', badge: { label: '4', tone: 'success' } },
];

const SAMPLE_KANBAN_CARDS = [
  { id: 'card-1', columnId: 'queued', title: 'API table polish', priority: 'medium', assigneeInitials: 'AF', meta: 'docs' },
  { id: 'card-2', columnId: 'active', title: 'Interactive preview', priority: 'high', assigneeInitials: 'UI', meta: 'live' },
  { id: 'card-3', columnId: 'done', title: 'Budget gate', priority: 'low', assigneeInitials: 'QA', meta: 'green' },
];

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

const SAMPLE_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', badge: 'live' },
  { id: 'components', label: 'Components', badge: 52 },
  { id: 'release', label: 'Release' },
];

const SAMPLE_BREADCRUMBS = [
  { id: 'docs', label: 'Docs' },
  { id: 'components', label: 'Components' },
];

@Component({
  selector: 'app-docs-component-preview',
  imports: [NgComponentOutlet, NgFor, RouterLink],
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
              <span class="docs-live-lab__route">{{ component.selector }}</span>
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
            @if (canRenderLiveComponent()) {
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
  private readonly selectedValues = signal<Record<string, string>>({});
  private readonly selectedBooleans = signal<Record<string, boolean>>({});
  private readonly selectedExpandedIds = signal<Record<string, readonly string[]>>({});
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
    this.pushEvent(`${attribute}: ${value}`);
  }

  protected booleanValue(attribute: string): boolean {
    return this.selectedBooleans()[attribute] ?? this.defaultBooleanValue(attribute);
  }

  protected toggleBoolean(attribute: string): void {
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
        return this.sampleValue(componentName);
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
      case 'title':
        return `${componentName} preview`;
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

  private isBooleanValues(values: readonly string[]): boolean {
    return values.includes('false') && values.includes('true');
  }

  private pushEvent(event: string): void {
    this.eventLog.update((current) => [`${this.component().name} ${event}`, ...current].slice(0, 3));
  }
}
