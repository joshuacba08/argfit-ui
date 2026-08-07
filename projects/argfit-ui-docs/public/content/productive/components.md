# Productive Components

This page documents the stable adaptive component surface for the `1.3.3` contract.

Every component listed below is already public through `@argfit-ui/adaptive`. The tables focus on the practical production question: when to use a component, and what accessibility rule must remain true in app-level implementations.

## Foundation And Base Composition

Slot directives used most often in this family:

- `AfCardHeaderDirective`, `AfCardTitleDirective`, `AfCardSubtitleDirective`, `AfCardEyebrowDirective`, `AfCardContentDirective`, `AfCardFooterDirective`
- `AfDialogHeaderDirective`, `AfDialogTitleDirective`, `AfDialogDescriptionDirective`, `AfDialogContentDirective`, `AfDialogFooterDirective`
- `AfPageShellBrandDirective`, `AfPageShellActionsDirective`, `AfPageShellUserDirective`, `AfPageShellFooterDirective`

| Component | Use it for | Accessibility note |
| --- | --- | --- |
| `AfButton` | Primary and secondary task actions | Keep the accessible name visible and preserve native button keyboard behavior. |
| `AfCard` | Panels, summary blocks and grouped content | Interactive cards still need explicit titles and clear action affordances. |
| `AfDialog` | Blocking confirmation, focused editing and high-risk actions | Keep focus trap, `Escape`, close affordance and focus return intact. |
| `AfInput` | Short text, search and compact field entry | Maintain label, hint and error relationships on the underlying control. |
| `AfPageShell` | Application chrome, navigation and breadcrumbs | Preserve `main`, navigation landmarks and visible active state. |

### Buttons with icons and full-width actions

`AfButton` owns the icon layout across renderers. Use the typed `icon` input instead
of projecting an SVG or applying renderer-specific spacing. `iconPosition` defaults
to `start`; `fullWidth` stretches both desktop and mobile renderers.

```html
<af-button icon="log-in" fullWidth>
  Ingresar con Hub Identity
</af-button>

<af-button icon="arrow-right" iconPosition="end">
  Continuar
</af-button>
```

Icons that accompany visible text are decorative. For an icon-only action, provide
an explicit `ariaLabel`.

### Adaptive page shell slots

`AfPageShell` keeps each projected region attached to its semantic destination while
switching renderers. Brand and footer content land in the desktop sidebar; actions
and user content land in the desktop topbar. On mobile those same slots are composed
into the compact header and footer without application-specific wrappers.

```html
<af-page-shell title="Biblioteca" [navItems]="navigation" [mobileTabs]="mobileTabs">
  <div afPageShellBrand>ARGFIT Football</div>
  <af-button afPageShellActions size="sm">Crear ejercicio</af-button>
  <div afPageShellUser>Valeria · Entrenadora</div>
  <small afPageShellFooter>ArgFit Point</small>

  <router-outlet />
</af-page-shell>
```

## Analytics, Feedback And Status

Slot directives used in this family:

- `AfAnalyticsCardActionsDirective`, `AfAnalyticsCardMetricsDirective`, `AfAnalyticsCardLegendDirective`, `AfAnalyticsCardFooterDirective`

| Component | Use it for | Accessibility note |
| --- | --- | --- |
| `AfAnalyticsCard` | KPI plus chart, loading, empty and error panels | Loading and empty states must stay explicit and legible without color alone. |
| `AfBadge` | Compact status markers and counters | Do not rely on badge color as the only meaning carrier. |
| `AfChip` | Compact tokens, tags and removable filters | If removable, the remove action must stay keyboard reachable. |
| `AfEmptyState` | A route, detail or section with no available content | Explain the reason and give users a reachable next action. |
| `AfInlineMessage` | Persistent local warnings, errors and informational guidance | Severity-driven role/live-region behavior must match the message intent. |
| `AfMetricCard` | Single KPI or small summary block | Pair numeric emphasis with a readable label and trend context. |
| `AfProgress` | Determinate progress, spinner and skeleton loading | Always provide an `ariaLabel` when the state is meaningful. |
| `AfSkeleton` | Loading placeholders that preserve a surface's layout | Mark the loading region as busy and respect reduced-motion preferences. |
| `AfToast` | Transient global feedback after a completed action | Do not use toast as the only place for blocking validation or recovery steps. |
| `AfToastViewport` | Single application-level host for toasts | Mount once and keep dismiss actions keyboard reachable. |

### Interactive filter chips

Use `interactive` when a chip changes a filter or compact selection. Bind `selected`
so ArgFit UI exposes `aria-pressed` and the active visual state, and react to
`pressed`. A removable chip emits `removed` independently; use removal and
press-selection as separate chip modes so the component never nests interactive
targets.

```html
@for (collection of collections; track collection.id) {
  <af-chip
    interactive
    [selected]="activeCollection() === collection.id"
    [ariaLabel]="'Filtrar por ' + collection.label"
    (pressed)="activeCollection.set(collection.id)"
  >
    {{ collection.label }}
  </af-chip>
}
```

## Overlay And Identity

Slot directives used in this family:

- `AfPopoverTriggerDirective`, `AfPopoverContentDirective`

| Component | Use it for | Accessibility note |
| --- | --- | --- |
| `AfAvatar` | Person, team or owner identity cues | Do not depend on avatar visuals alone for user identification. |
| `AfDrawer` | Secondary task panels, mobile editing and contextual setup | Preserve escape dismiss, visible close affordance and open state clarity. |
| `AfPopover` | Lightweight contextual disclosure tied to a trigger | The trigger must remain explicit and content must not replace full dialogs. |
| `AfTooltip` | Brief supportive hints and secondary clarification | Never hide critical product meaning behind hover-only disclosure. |

## Forms And Selection

Slot directives used in this family:

- `AfIconFieldPrefixDirective`, `AfIconFieldControlDirective`, `AfIconFieldSuffixDirective`
- `AfInputGroupPrefixDirective`, `AfInputGroupControlDirective`, `AfInputGroupSuffixDirective`

| Component | Use it for | Accessibility note |
| --- | --- | --- |
| `AfCheckbox` | Boolean inclusion or optional toggles | Keep a visible label and clear checked state. |
| `AfDatePicker` | Date selection with touch-safe and desktop-safe disclosure | Labels and selected value must remain readable in both renderers. |
| `AfField` | Shared label, hint and error framing for a control | `aria-describedby` wiring must stay synchronized. |
| `AfFieldset` | Grouping related controls under one semantic heading | Keep the group legend/title meaningful and visible. |
| `AfIconField` | Fields with prefix or suffix icons | Decorative icons should stay outside the accessible name calculation. |
| `AfInputCount` | Bounded numeric stepping for small counts | Increment and decrement actions must be reachable and labeled. |
| `AfInputGroup` | Composite input layouts with embedded text or actions | Focus order must remain predictable across grouped elements. |
| `AfListbox` | Visible single or multi selection in a list surface | Keyboard list navigation and selected state must remain explicit. |
| `AfMultiSelect` | Bounded multi-option selection with search and clear actions | Search, clear and chip removal must all remain keyboard reachable. |
| `AfPassword` | Secret input with reveal affordance | The reveal control needs a clear accessible label. |
| `AfRadioGroup` | One-of-many exclusive selection | Keep the group label and native radio keyboard path intact. |
| `AfSegmentedControl` | Small exclusive mode switching | Segment text must remain concise and state must be visually obvious. |
| `AfSelect` | Bounded option sets and standard dropdown choices | Mobile disclosure must stay touch-safe and not depend on hover. |
| `AfTextarea` | Multi-line notes, comments and longer form input | Preserve label, helper text and error messaging. |
| `AfSlider` | Bounded values where the position on the scale is the information | Marks must be announced; mobile thumb stays above the 44 px touch target. |
| `AfFileUpload` | File selection with declared limits and reported rejections | Limits are announced before choosing; rejected files must never fail silently. |
| `AfTimePicker` | Civil `HH:mm` time selection anchored to the venue clock | Value carries no timezone; announce the selected time in both renderers. |
| `AfToggle` | Immediate on/off preferences or lightweight settings | State meaning must remain explicit, not implied by color alone. |

## Data, Hierarchy And Workflow

Slot directives used in this family:

- `AfDataTableCellDirective`, `AfDataTableExpandedRowDirective`, `AfDataTableToolbarDirective`, `AfDataTableEmptyDirective`
- `AfDataViewItemDirective`, `AfDataViewActionsDirective`, `AfDataViewEmptyDirective`, `AfDataViewLoadingDirective`
- `AfKanbanCardDirective`, `AfKanbanColumnHeaderDirective`, `AfKanbanEmptyDirective`, `AfKanbanCardFooterDirective`
- `AfOrderListItemDirective`, `AfOrderListActionsDirective`, `AfOrderListEmptyDirective`, `AfOrderListLoadingDirective`
- `AfOrganizationChartNodeDirective`, `AfOrganizationChartActionsDirective`, `AfOrganizationChartEmptyDirective`, `AfOrganizationChartLoadingDirective`
- `AfPickListItemDirective`, `AfPickListActionsDirective`, `AfPickListLoadingDirective`, `AfPickListSourceEmptyDirective`, `AfPickListTargetEmptyDirective`
- `AfTimelineItemDirective`, `AfTimelineActionsDirective`, `AfTimelineEmptyDirective`, `AfTimelineLoadingDirective`
- `AfTreeNodeDirective`, `AfTreeActionsDirective`, `AfTreeEmptyDirective`, `AfTreeLoadingDirective`
- `AfTreeTableCellDirective`, `AfTreeTableActionsDirective`, `AfTreeTableEmptyDirective`, `AfTreeTableLoadingDirective`
- `AfVirtualScrollerItemDirective`, `AfVirtualScrollerActionsDirective`, `AfVirtualScrollerEmptyDirective`, `AfVirtualScrollerLoadingDirective`

| Component | Use it for | Accessibility note |
| --- | --- | --- |
| `AfChart` | Summary and decision-support visualizations | Important conclusions must not depend only on color or hover. |
| `AfDataTable` | Dense desktop data and adaptive mobile list rendering | Row activation, sort state and empty state must remain keyboard and screen-reader clear. |
| `AfDataView` | Dataset presentation in card or mixed-content layouts | Each item still needs a readable heading and explicit empty state. |
| `AfKanban` | Status-based workflow boards and move operations | Non-drag movement remains mandatory for keyboard and assistive tech users. |
| `AfOrderList` | Ordered collections with move/reorder intent | Reorder actions must be reachable without drag assumptions. |
| `AfOrganizationChart` | Reporting structure and hierarchy snapshots | Provide text alternatives when the chart becomes visually dense. |
| `AfPaginator` | Page navigation for bounded datasets | Keep current page, next and previous actions explicit. |
| `AfPickList` | Transfer between source and target collections | Move controls must stay visible and keyboard operable. |
| `AfTimeline` | Ordered chronological events or phases | Step labels and actions must remain readable in sequence. |
| `AfTree` | Hierarchical disclosure and navigation | Expand/collapse state must remain explicit and keyboard reachable. |
| `AfTreeTable` | Hierarchical records with tabular context | Expand controls and row hierarchy must stay understandable without visuals alone. |
| `AfVirtualScroller` | Large repeated item rendering with bounded viewport work | Validate that item identity and focus behavior remain coherent as rows recycle. |

## Layout And Navigation

Slot directives used in this family:

- `AfSplitterPrimaryDirective`, `AfSplitterSecondaryDirective`
- `AfToolbarStartDirective`, `AfToolbarCenterDirective`, `AfToolbarEndDirective`

| Component | Use it for | Accessibility note |
| --- | --- | --- |
| `AfAccordion` | Progressive disclosure of sections within a page | Accordion headers must remain button-like and expose expanded state. |
| `AfDivider` | Visual separation between related blocks | Do not rely on divider alone where a heading or landmark is needed. |
| `AfPanel` | Self-contained content areas with a title | Panel headings should remain meaningful in page outline order. |
| `AfScrollPanel` | Controlled overflow areas inside dense layouts | Focusable children must remain reachable inside the scroll region. |
| `AfSplitter` | Resizable primary/secondary work areas | Preserve a meaningful content order when users do not resize the layout. |
| `AfStepper` | Linear or staged workflows | Current step and validation status should remain explicit. |
| `AfTabs` | Peer views that switch within the same surface | Active tab state and panel association must stay explicit. |
| `AfToolbar` | Grouped actions, filters and local controls | Keep button labels visible and groupings understandable. |

Use the default `cards` variant when each tab owns a projected panel. Use
`variant="line"` with `[renderPanel]="false"` when tabs only control an
application-owned region, such as a library filter:

```html
<af-tabs
  variant="line"
  density="compact"
  [renderPanel]="false"
  [items]="libraryTabs"
  [activeId]="activeLibraryTab()"
  (activeIdChange)="activeLibraryTab.set($event)"
/>
```

When `renderPanel` is false, `AfTabs` omits its implicit panel and does not emit
`aria-controls` references to elements that are not rendered. The application
must keep the controlled result region labelled and expose its loading or empty
state.

## Recommended Production Posture

- Prefer `@argfit-ui/adaptive` in application code.
- Use renderer-specific packages only when you are intentionally targeting a renderer integration path.
- Keep app-level wrappers small and semantic instead of reproducing vendor APIs.
- Reuse the enterprise constraints documented in [enterprise readiness](./enterprise-readiness.md) when a component operates in a dense data or feedback-heavy flow.
