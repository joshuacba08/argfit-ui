# Release Notes: 1.7.0

ArgFit UI `1.7.0` improves how consumers expose the source data and frequent
actions of analytical charts while preserving the existing 1.x contract.

## Release Contract

- Stable version: `1.7.0`
- npm dist-tag: `latest`
- Packages: `@argfit-ui/core`, `@argfit-ui/primitives`,
  `@argfit-ui/desktop`, `@argfit-ui/mobile`, `@argfit-ui/adaptive` and
  `@argfit-ui/mcp`

## Highlights

- `AfChart` can render its accessible data table by series or by individual
  observations. The default `auto` mode chooses the appropriate layout from
  the data shape.
- Point-oriented tables preserve the label and X, Y and optional Z magnitude
  of each observation, including multidimensional bubble-chart data.
- Consumers can provide concise table headers through
  `dataTableHeaders` without coupling the public API to a chart vendor.
- `AfChartCard.inlineActions` promotes frequent actions such as toggling the
  data table or downloading an image into the header on desktop and mobile.
  Promoted actions are automatically removed from the overflow menu.
- Storybook documents the observation-table pattern with representative HSR
  data, and the generated MCP catalog exposes the exact public inputs.

## Validation

The release is gated by:

```bash
pnpm release:production:check
```

This rebuilds all packages and documentation, runs unit, architecture,
accessibility and visual checks, installs the generated tarballs in a consumer
application, verifies the public API and enforces production performance
budgets.

The locally verified artifacts are written to `dist/production-tarballs/`;
the protected `v1.7.0` tag workflow publishes the same package sources to npm.

## Installation

```bash
pnpm add @argfit-ui/core@1.7.0 @argfit-ui/primitives@1.7.0
pnpm add @argfit-ui/desktop@1.7.0 @argfit-ui/mobile@1.7.0 @argfit-ui/adaptive@1.7.0
pnpm add -D @argfit-ui/mcp@1.7.0
```

Applications that render 3D charts must also install the optional compatible
`echarts-gl` peer dependency.
