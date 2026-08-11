# Release Notes: 1.4.0

ArgFit UI `1.4.0` centralizes component development in Storybook and introduces
the official `@argfit-ui/mcp` package so AI clients can discover and consume the
library from the same public contracts.

## Release Contract

- Stable version: `1.4.0`
- npm dist-tag: `latest`
- Packages: `@argfit-ui/core`, `@argfit-ui/primitives`,
  `@argfit-ui/desktop`, `@argfit-ui/mobile`, `@argfit-ui/adaptive` and
  `@argfit-ui/mcp`

## Highlights

- Storybook documents all 59 adaptive components. The coverage allowlist is
  empty and new exported components must add a canonical story.
- `AfAuthShell` provides split and centered authentication layouts across
  desktop, mobile and adaptive renderers.
- `@argfit-ui/mcp` exposes the generated Storybook and Compodoc catalog through
  STDIO and Streamable HTTP without writing consumer files.
- Searchable selects support API-backed infinite loading and a persistent,
  themed search field.
- DatePicker, ImageCropper and Storybook documentation layouts receive visual
  and interaction refinements.

## Validation

The release is gated by:

```bash
pnpm release:production:check
```

This rebuilds the packages, creates and validates the artifacts under
`dist/production-tarballs/`, runs the production consumer smoke and checks the
public package metadata.

## Installation

```bash
pnpm add @argfit-ui/core@1.4.0 @argfit-ui/primitives@1.4.0
pnpm add @argfit-ui/desktop@1.4.0 @argfit-ui/mobile@1.4.0 @argfit-ui/adaptive@1.4.0
pnpm add -D @argfit-ui/mcp@1.4.0
```
