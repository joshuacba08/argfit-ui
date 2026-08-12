# Release Notes: 1.5.0

ArgFit UI `1.5.0` makes its icon renderer extensible and completes the P0
interaction contract of `AfCalendar` without changing the Calendar appearance
at rest.

## Release Contract

- Stable version: `1.5.0`
- npm dist-tag: `latest`
- Packages: `@argfit-ui/core`, `@argfit-ui/primitives`,
  `@argfit-ui/desktop`, `@argfit-ui/mobile`, `@argfit-ui/adaptive` and
  `@argfit-ui/mcp`

## Highlights

- `AfIcon` keeps all built-in names and accepts individually registered Lucide
  and `@ng-icons/*` definitions without bundling complete catalogs.
- `AfCalendar` supports smooth mouse, touch and pen movement, cross-day drag,
  resize from both temporal edges, all-day intervals and opt-in timed/all-day
  conversion.
- The controlled mutation API adds product validation, explicit async
  resolution, conflict/rejection/timeout reversion and undo-token requests.
- Keyboard users can move and resize with the same 15-minute rules, or press
  F2 to use a focused modal editor instead of dragging.
- Calendar consumers can import the family through the tree-shakeable
  `@argfit-ui/adaptive/calendar` secondary entry point.
- Storybook and the generated MCP catalog document the exact public contract;
  the static quality gates no longer depend on remote web fonts.

## Validation

The release is gated by:

```bash
pnpm release:production:check
```

This rebuilds all packages and documentation, validates unit, accessibility,
visual and architecture gates, creates production tarballs, verifies the
consumer surface and enforces production performance budgets.

The locally verified artifacts are written to `dist/production-tarballs/`;
the protected tag workflow publishes those same package sources to npm.

## Installation

```bash
pnpm add @argfit-ui/core@1.5.0 @argfit-ui/primitives@1.5.0
pnpm add @argfit-ui/desktop@1.5.0 @argfit-ui/mobile@1.5.0 @argfit-ui/adaptive@1.5.0
pnpm add -D @argfit-ui/mcp@1.5.0
```

The concrete `@ng-icons/*` packs remain optional application dependencies.
