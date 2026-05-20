# Alpha Components

This page summarizes the `0.1.0-alpha.0` component surface. The primary consumer package is `@argfit-ui/adaptive`.

## Status Labels

| Status | Meaning |
| --- | --- |
| `stable-for-alpha` | Included in the alpha contract. Breaking changes are still possible before beta, but should be documented. |
| `experimental` | Usable in alpha, but more likely to change between prereleases. |
| `planned` | Not included in this alpha. |

## Stable For Alpha

| Component | Import | Main inputs/outputs | Compact example |
| --- | --- | --- | --- |
| Button | `AfButton` | `variant`, `size`, `type`, `disabled`, `loading`, `(pressed)` | `<af-button (pressed)="save()">Save</af-button>` |
| Card | `AfCard` | `variant`, `density`, `tone`, `interactive`; card slot directives | `<af-card variant="panel"><div afCardContent>Content</div></af-card>` |
| Input | `AfInput` | `label`, `type`, `placeholder`, `hint`, `error`, `prefixIcon`, `suffix`, `formControl` | `<af-input label="Athlete" formControlName="name" />` |
| Dialog | `AfDialog` | `open`, `title`, `description`, `size`, `tone`, `(openChange)`; dialog slots | `<af-dialog [open]="open()" (openChange)="open.set($event)" />` |
| Chart | `AfChart` | `type`, `series`, `categories`, `indicators`, `loading`, `emptyTitle` | `<af-chart type="line" [series]="series" />` |
| Badge | `AfBadge` | `tone`, `variant`, `size`, `shape`, `icon`, `dot` | `<af-badge tone="success" dot>Online</af-badge>` |
| Page shell | `AfPageShell` | `title`, `subtitle`, `navItems`, `mobileTabs`, `activeItem`, `(navItemSelected)` | `<af-page-shell title="Dashboard" [navItems]="nav" />` |
| Metric card | `AfMetricCard` | `label`, `value`, `unit`, `tone`, `icon`, `trendValue`, `trendDirection`, `loading` | `<af-metric-card label="Jump" value="45.2" unit="cm" />` |
| Icon | `AfIconComponent` | `name`, `size`, `tone`, `decorative`, `ariaLabel` | `<af-icon name="activity" ariaLabel="Activity" />` |

## Experimental In Alpha

| Component | Import | Main inputs/outputs | Notes |
| --- | --- | --- | --- |
| Analytics card | `AfAnalyticsCard` | `title`, `subtitle`, `density`, `variant`, `tone`, `state`; actions/metrics/legend/footer slots | Layout contract may evolve. |
| Data table | `AfDataTable` | `columns`, `rows`, `rowIdKey`, `sort`, `pagination`, `selectionMode`, row/cell outputs | Enterprise table API is still being validated. |
| Select | `AfSelect` | `label`, `options`, `placeholder`, `state`, `formControl` | Form API may expand. |
| Textarea | `AfTextarea` | `label`, `placeholder`, `rows`, `maxLength`, `formControl` | Form API may expand. |
| Toggle | `AfToggle` | `label`, `description`, `disabled`, `formControl` | CVA-enabled. |
| Checkbox | `AfCheckbox` | `label`, `description`, `disabled`, `formControl` | CVA-enabled. |
| Radio group | `AfRadioGroup` | `label`, `options`, `disabled`, `formControl` | CVA-enabled. |
| Segmented control | `AfSegmentedControl` | `options`, `size`, `disabled`, `formControl`, `(valueChange)` | CVA-enabled. |
| Password | `AfPassword` | `label`, `placeholder`, `feedback`, `toggleLabel`, `formControl` | Reveal behavior may be refined. |
| Toast viewport | `AfToastViewport` | `placement`, `limit` | Uses `AfToastService`. |
| Toast | `AfToast` | `toast`, `(dismissed)` | Low-level row component. |
| Inline message | `AfInlineMessage` | `severity`, `title`, `description`, `closable`, `(dismissed)` | Feedback patterns may evolve. |

## Planned

Not included in `0.1.0-alpha.0`:

- Popover, dropdown, tooltip, drawer and command palette.
- Date picker, file upload, autocomplete, slider and schema-driven forms.
- Virtual table, server-side data source, column resizing and inline editing.
- Chart export, drilldown, synchronized charts and 3D presets.
- Notification center and persistent notification history.

## Example: Alpha Dashboard Card

```ts
import { AfBadge, AfButton, AfCard, AfMetricCard } from '@argfit-ui/adaptive';
```

```html
<af-card variant="panel" tone="primary">
  <header afCardHeader>
    <h2 afCardTitle>Alpha dashboard</h2>
    <af-badge tone="primary">0.1.0-alpha.0</af-badge>
  </header>
  <div afCardContent>
    <af-metric-card label="Ready athletes" value="38" icon="users" />
  </div>
  <footer afCardFooter>
    <af-button>Open session</af-button>
  </footer>
</af-card>
```

## Vendor Boundary

Adaptive components do not expose PrimeNG, Ionic or ECharts APIs. Consumers should not import vendor components to use the adaptive catalog.
