# Release Notes: 1.6.0

ArgFit UI `1.6.0` adds adaptive data exploration and command discovery while
preserving the vendor-neutral public API of the design system.

## Release Contract

- Stable version: `1.6.0`
- npm dist-tag: `latest`
- Packages: `@argfit-ui/core`, `@argfit-ui/primitives`,
  `@argfit-ui/desktop`, `@argfit-ui/mobile`, `@argfit-ui/adaptive` and
  `@argfit-ui/mcp`

## Highlights

- `AfChartCard` composes a chart with title, context, actions and explicit
  loading, empty and error states across desktop and mobile renderers.
- `AfCommandPalette` provides grouped, filterable commands with keyboard
  navigation, focus management and a mobile fullscreen presentation.
- `AfChart` now covers a broad set of 2D, statistical, relationship,
  geographic and 3D visualizations through ArgFit-owned contracts.
- WebGL support remains optional: `echarts-gl` is loaded lazily only for chart
  types that require it.
- Storybook documents the public behavior and responsive states, and the MCP
  catalog exposes the same canonical contracts for AI-assisted consumption.

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
the protected `v1.6.0` tag workflow publishes the same package sources to npm.

## Installation

```bash
pnpm add @argfit-ui/core@1.6.0 @argfit-ui/primitives@1.6.0
pnpm add @argfit-ui/desktop@1.6.0 @argfit-ui/mobile@1.6.0 @argfit-ui/adaptive@1.6.0
pnpm add -D @argfit-ui/mcp@1.6.0
```

Applications that render 3D charts must also install the optional compatible
`echarts-gl` peer dependency.
