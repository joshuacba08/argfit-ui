# Beta Components

This page summarizes the intended `0.1.0-beta.0` component surface for application consumers.

The recommended application path remains `@argfit-ui/adaptive`. Renderer packages stay public, but renderer-specific imports are not the primary beta path.

## Status Labels

| Status | Meaning |
| --- | --- |
| `stable-for-beta` | Recommended for beta consumers and expected to evolve conservatively. |
| `experimental-in-beta` | Public, but still expected to move during beta prereleases. |
| `renderer-specific` | Supported public renderer API, but not the preferred application-facing path. |

## Stable-For-Beta Adaptive Components

### AfButton

- Import: `import { AfButton } from '@argfit-ui/adaptive';`
- Selector: `af-button`
- Description: Semantic action button that routes to the desktop or mobile renderer without exposing vendor APIs.
- Main inputs: `variant`, `size`, `type`, `disabled`, `loading`, `fullWidth`, `ariaLabel`
- Main outputs: `(pressed)`
- Compact example:

```html
<af-button variant="secondary" (pressed)="save()">Save</af-button>
```

- Desktop/mobile status: available through the adaptive facade on both renderers.
- Accessibility note: uses native button semantics across renderers. Set `ariaLabel` when the visible content is icon-only.
- Theming note: visual states come from ArgFit tokens. Override tokens instead of targeting PrimeNG or Ionic classes.

### AfCard

- Import: `import { AfCard, AfCardContentDirective, AfCardFooterDirective, AfCardHeaderDirective, AfCardTitleDirective } from '@argfit-ui/adaptive';`
- Selector: `af-card`
- Description: Semantic surface component for panels, summaries and interactive cards.
- Main inputs: `variant`, `density`, `tone`, `interactive`, `selected`
- Main outputs: `(pressed)` when `interactive` is true
- Compact example:

```html
<af-card variant="panel" tone="primary">
  <header afCardHeader>
    <h2 afCardTitle>Weekly readiness</h2>
  </header>
  <div afCardContent>Content</div>
</af-card>
```

- Desktop/mobile status: available through the adaptive facade on both renderers.
- Accessibility note: interactive cards already handle keyboard activation. Use them only when the whole surface is a meaningful action.
- Theming note: `variant` and `tone` map to ArgFit surface tokens; keep layout customization at the token or container level.

### AfInput

- Import: `import { AfInput } from '@argfit-ui/adaptive';`
- Selector: `af-input`
- Description: Base text-like form control with label, hint, error and icon wiring.
- Main inputs: `value`, `label`, `placeholder`, `hint`, `error`, `type`, `size`, `tone`, `required`, `disabled`, `readonly`, `prefix`, `suffix`, `prefixIcon`, `autocomplete`, `name`, `inputId`
- Main outputs: `(valueChange)`, `(focusChange)`
- Compact example:

```html
<af-input
  label="Athlete"
  placeholder="Maria Garcia"
  type="search"
  (valueChange)="onSearch($event)"
/>
```

- Desktop/mobile status: available through the adaptive facade on both renderers and supports `ControlValueAccessor`.
- Accessibility note: keep `label`, `hint` and `error` meaningful so the built-in described-by wiring stays useful.
- Theming note: the control already consumes ArgFit field tokens. Avoid styling renderer internals from app code.

### AfDialog

- Import: `import { AfDialog, AfDialogContentDirective, AfDialogFooterDirective, AfDialogTitleDirective } from '@argfit-ui/adaptive';`
- Selector: `af-dialog`
- Description: Adaptive modal/sheet surface for confirmation, workflow and detail overlays.
- Main inputs: `open`, `title`, `description`, `size`, `tone`, `mobilePresentation`, `dismissible`, `closeOnBackdrop`, `closeOnEscape`, `ariaLabel`, `ariaDescribedBy`, `closeLabel`
- Main outputs: `(openChange)`, `(opened)`, `(closed)`, `(backdropPress)`, `(escapePress)`
- Compact example:

```html
<af-dialog
  [open]="dialogOpen()"
  title="Publish beta"
  description="Review the package before continuing."
  (openChange)="dialogOpen.set($event)"
>
  <div afDialogContent>Ready for the release gate.</div>
</af-dialog>
```

- Desktop/mobile status: available through the adaptive facade on both renderers.
- Accessibility note: focus trap, `Escape` handling and focus return are built in. Provide either `title` and `description` or explicit ARIA labels.
- Theming note: dialog tones and sizes are token-driven; avoid coupling app code to overlay container internals.

### AfChart

- Import: `import { AfChart } from '@argfit-ui/adaptive';`
- Selector: `af-chart`
- Description: ArgFit-owned chart facade that keeps ECharts internal to the renderer implementation.
- Main inputs: `type`, `tone`, `density`, `categories`, `series`, `indicators`, `title`, `description`, `height`, `legend`, `showGrid`, `interactive`, `loading`, `emptyMessage`, `ariaLabel`
- Main outputs: `(pointSelect)`
- Compact example:

```html
<af-chart
  type="line"
  [categories]="weeks"
  [series]="jumpSeries"
  ariaLabel="Weekly jump trend"
  (pointSelect)="onPointSelect($event)"
/>
```

- Desktop/mobile status: available through the adaptive facade on both renderers.
- Accessibility note: supply `ariaLabel` when the chart meaning is not obvious from surrounding text. Loading and empty states are already surfaced semantically.
- Theming note: chart tones resolve through ArgFit tokens and chart types, not through direct ECharts option styling from application code.

### AfBadge

- Import: `import { AfBadge } from '@argfit-ui/adaptive';`
- Selector: `af-badge`
- Description: Compact status, tag and counter surface for dense enterprise UI.
- Main inputs: `tone`, `variant`, `size`, `shape`, `dot`, `icon`, `ariaLabel`
- Main outputs: none
- Compact example:

```html
<af-badge tone="success" dot>Ready</af-badge>
```

- Desktop/mobile status: available through the adaptive facade on both renderers.
- Accessibility note: provide `ariaLabel` when the badge communicates status through icon or dot only.
- Theming note: badge tones and variants are mapped to shared status tokens.

### AfPageShell

- Import: `import { AfPageShell, AfPageShellActionsDirective, AfPageShellBrandDirective, AfPageShellFooterDirective, AfPageShellUserDirective } from '@argfit-ui/adaptive';`
- Selector: `af-page-shell`
- Description: Adaptive shell for application navigation, top-level actions, breadcrumbs and mobile tabs.
- Main inputs: `title`, `subtitle`, `navItems`, `mobileTabs`, `breadcrumbs`, `activeItem`, `activeTab`, `density`, `variant`, `collapsible`, `collapsed`, `showSearch`, `searchPlaceholder`, `notificationCount`, `userInitials`, `ariaLabel`
- Main outputs: `(navItemSelected)`, `(tabSelected)`, `(breadcrumbSelected)`, `(collapsedChange)`, `(searchChanged)`
- Compact example:

```html
<af-page-shell
  title="Dashboard"
  [navItems]="navItems"
  [activeItem]="activeItem"
  (navItemSelected)="selectSection($event)"
>
  <div afPageShellBrand>ArgFit</div>
</af-page-shell>
```

- Desktop/mobile status: available through the adaptive facade on both renderers.
- Accessibility note: keep navigation labels meaningful and provide stable active state values so `aria-current` remains useful.
- Theming note: shell chrome, spacing and emphasis are token-driven. Use shell slots for composition instead of targeting renderer wrappers.

### AfMetricCard

- Import: `import { AfMetricCard } from '@argfit-ui/adaptive';`
- Selector: `af-metric-card`
- Description: KPI surface for a primary metric, optional trend and optional interaction.
- Main inputs: `label`, `value`, `unit`, `helper`, `icon`, `tone`, `size`, `density`, `variant`, `trendValue`, `trendDirection`, `trendLabel`, `loading`, `interactive`, `ariaLabel`
- Main outputs: `(pressed)`
- Compact example:

```html
<af-metric-card
  label="Jump"
  value="45.2"
  unit="cm"
  tone="primary"
  trendValue="+4%"
  trendDirection="up"
/>
```

- Desktop/mobile status: available through the adaptive facade on both renderers.
- Accessibility note: when `interactive` is true, make the card label and `ariaLabel` describe the action rather than only the metric value.
- Theming note: tone, trend and surface emphasis come from shared metric tokens.

## Stable Primitives And A11y Building Blocks

| Export | Selector | Main API | Accessibility note | Theming note |
| --- | --- | --- | --- | --- |
| `AfIconComponent` | `af-icon` | `name`, `size`, `tone`, `strokeWidth`, `ariaLabel`, `decorative` | Set `decorative="false"` and `ariaLabel` when the icon carries meaning. | Icon color and size resolve from ArgFit tokens. |
| `AfVisuallyHiddenComponent` | `af-visually-hidden` | projected content only | Use for assistive-only text such as live labels or extra context. | Not a visual styling surface. |
| `AfFocusTrapDirective` | `[afFocusTrap]` | `afFocusTrapEnabled` | Keeps focus inside the host and restores focus on exit. | Not a visual styling surface. |
| `AfFocusInitialDirective` | `[afFocusInitial]` | marker directive | Marks the first focus target inside a trapped region. | Not a visual styling surface. |
| `AfEscapeKeyDirective` | `[afEscapeKey]` | `(afEscape)` | Emits `Escape` without owning dismiss logic, so the host stays accessible and explicit. | Not a visual styling surface. |

## Experimental-In-Beta Snapshot

These components are public, but they still require broader validation before they should be treated as low-risk contracts:

| Area | Public APIs | Beta stance |
| --- | --- | --- |
| Analytics | `AfAnalyticsCard` and analytics slot directives | `experimental-in-beta` |
| Data surfaces | `AfDataTable` and data-table slot directives | `experimental-in-beta` |
| Expanded form controls | `AfSelect`, `AfTextarea`, `AfToggle`, `AfCheckbox`, `AfRadioGroup`, `AfSegmentedControl`, `AfPassword` | `experimental-in-beta` |
| Feedback | `AfToastService`, `AfToast`, `AfToastViewport`, `AfInlineMessage` | `experimental-in-beta` |

See [Beta public API](./public-api.md) for the full export-by-export inventory and [Migration alpha to beta](./migration-alpha-to-beta.md) for upgrade posture.