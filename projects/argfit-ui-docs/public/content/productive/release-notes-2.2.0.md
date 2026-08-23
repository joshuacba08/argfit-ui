# Release Notes: 2.2.0

ArgFit UI 2.2.0 evolves `AfCommandPalette` into a global, service-driven command system and adds generic entity collections for workflows such as players, teams, sessions or documents.

## Highlights

- Configure commands declaratively with a versioned, JSON-compatible contract and distributed JSON Schema.
- Open a single application-wide host through `Mod+K`, modes or direct collection activators such as `@jugadores`.
- Rank commands and entities with deterministic fuzzy search, context predicates, priorities and recent-command signals.
- Combine static commands, dynamic search providers, nested command groups and sequential parameter steps.
- Present entities as accessible mini-cards with images or fallbacks, then expose actions scoped to the selected entity.
- Keep routing, API calls, exports, permissions and other business behavior inside application-owned executors.

## Entity collections

Collections can mix static entities with provider results and static actions with provider actions. Dynamic entries replace static entries with the same ID, while provider failures preserve every valid result from other sources.

Selecting an entity creates a navigable `Colección › Entidad` level. Back, `Escape` or an empty-query `Backspace` restores the previous query and active entity. Executors receive immutable `collection` and `entity` snapshots alongside command, payload, parameters and application context.

## Accessibility and adaptive presentation

The desktop renderer keeps a top-centered productive overlay, while mobile uses a fullscreen safe-area layout. Both preserve combobox/listbox semantics, keyboard navigation, active-descendant state, focus trapping, focus restoration, scroll locking and accessible disabled reasons.

## Packages

The following packages are released together at `2.2.0`:

- `@argfit-ui/core`
- `@argfit-ui/primitives`
- `@argfit-ui/chart-runtime`
- `@argfit-ui/desktop`
- `@argfit-ui/mobile`
- `@argfit-ui/adaptive`
- `@argfit-ui/mcp`

Internal peer dependencies remain aligned exactly at `2.2.0`.

## Validation

The release is gated by `pnpm release:production:check`, including package builds and tests, architecture guards, Storybook build/smoke/accessibility/visual matrices, production tarball smoke tests, MCP catalog validation and release metadata checks.

Validated release artifacts are written to `dist/production-tarballs/` and published under the npm `latest` dist-tag only after the tagged production workflow passes.
