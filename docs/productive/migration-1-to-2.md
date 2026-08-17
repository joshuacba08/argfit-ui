# Migration From 1.x To 2.0

ArgFit UI 2.0 moves the advanced chart renderer behind a lazy secondary entry point. Shared `AfChart*` data contracts in `@argfit-ui/core` are unchanged.

## Required Import Change

Replace the 1.x root import:

```ts
import { AfChart } from '@argfit-ui/adaptive';
```

with:

```ts
import { AfChart } from '@argfit-ui/adaptive/chart';
```

`AfChartComponent` is available from the same secondary entry point. `AfChartCard` remains available from the root barrel and is also re-exported by `/chart` for convenience.

Importing `AfChart` or `AfChartComponent` from `@argfit-ui/adaptive` is intentionally a compile-time error in 2.0.

Renderer-specific integrations use the matching technical secondary entry points:

```ts
import { AfChartDesktopComponent } from '@argfit-ui/desktop/chart';
import { AfChartMobileComponent } from '@argfit-ui/mobile/chart';
```

Most applications should not use these renderer imports; they exist to keep the root desktop and mobile packages free of any chart-runtime edge.

## Runtime Packaging

Install all ArgFit UI packages at the same version, including `@argfit-ui/chart-runtime`. The runtime package is a technical peer used by the desktop and mobile renderers; application code must not import it directly.

The `/chart` entry point itself is safe to import eagerly. ECharts, ZRender and the chart runtime are requested only when the first browser chart is drawn. `echarts-gl` remains a second lazy level used only by 3D chart types. Server-side rendering does not request either runtime.

## Loading And Failure UI

The existing skeleton is displayed while the runtime loads. Applications may customize the accessible failure state:

```html
<af-chart
  renderErrorMessage="The visualization could not be loaded."
  retryLabel="Try again"
  [dataTable]="true"
/>
```

When `dataTable` is active, the accessible table remains available during loading and runtime errors. Before the runtime is ready, `toDataUrl()` returns `null`; `resetView()` and `refreshSize()` remain safe no-ops.
