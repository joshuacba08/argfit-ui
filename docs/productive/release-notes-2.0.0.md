# Release Notes: 2.0.0

ArgFit UI 2.0 removes the advanced chart engine from initial and shared application assets while preserving the existing chart data contracts.

## Added

- `@argfit-ui/adaptive/chart`, exporting `AfChart`, `AfChartComponent` and `AfChartCard`.
- The technical `@argfit-ui/chart-runtime` package, loaded under demand by desktop and mobile renderers.
- Accessible chart runtime failure and retry UI through `renderErrorMessage` and `retryLabel`.
- Storybook and MCP support for component-specific package entry points.
- Published-tarball bundle guards for initial assets, the lazy runtime chunk and applications without charts.

## Changed

- ECharts and ZRender are loaded only when the first browser chart is rendered; `echarts-gl` remains lazy and exclusive to 3D types.
- Desktop and mobile share one option builder and one cached runtime request.
- The productive package set, peer dependencies, tarballs, budgets and publish workflow are aligned to `2.0.0` and `v2.*.*` tags.

## Removed

- `AfChart` and `AfChartComponent` from the root `@argfit-ui/adaptive` barrel. See [migration from 1.x to 2.0](./migration-1-to-2.md).

## Validation

The release is validated through `pnpm release:production:check`, including unit, Storybook/MCP, consumer, production tarball and bundle-splitting gates.

Verified artifacts are written to `dist/production-tarballs/` and the seven packages publish under the npm `latest` dist-tag.
