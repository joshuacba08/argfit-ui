# HU-035 - Beta+ Showcase And Documentation

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion / Fase 6 - Showcase Platform

## Dependencias

Esta HU depende de:

- HU-028 - Beta+ Overlay Components.
- HU-029 - Beta+ Status Identity And Disclosure Components.
- HU-030 - Beta+ Form Field And Input Components.
- HU-031 - Beta+ Selection And Advanced Form Components.
- HU-032 - Beta+ Data Components Suite.
- HU-033 - Beta+ Panel And Layout Components.
- HU-034 - Beta+ Kanban Workflow Board.

## Objetivo

Crear documentacion y showcase Beta+:

- Quickstart Beta+.
- Component reference Beta+.
- Migration beta -> Beta+.
- Showcase section Beta+.
- Ejemplos mobile y desktop.

## Alcance Incluido

Paths esperados:

- `docs/beta-plus/quickstart.md`
- `docs/beta-plus/components.md`
- `docs/beta-plus/migration-beta-to-beta-plus.md`
- `docs/beta-plus/known-limitations.md`
- `README.md`
- `projects/argfit-ui-*/README.md`
- `projects/showcase/src/app/*`

## Requisitos

- Docs explain preferred adaptive imports.
- Docs mark Beta+ APIs separately from base beta.
- Showcase includes open overlay states.
- Showcase includes progress/loading states.
- Showcase includes avatar/chip examples in realistic product context.
- Showcase includes advanced forms: `AfInputCount`, `AfMultiSelect`, `AfDatePicker`, `AfTreeSelect`, `AfInputMask` and `AfAutoComplete`.
- Showcase includes data components: `AfDataView`, `AfPaginator`, `AfTimeline`, `AfTree`, `AfTreeTable` and `AfVirtualScroller`.
- Showcase includes panel/layout components: `AfTabs`, `AfAccordion`, `AfPanel`, `AfFieldset`, `AfSplitter`, `AfStepper` and `AfToolbar`.
- Showcase includes `AfKanban` with routines, filters, drag/drop and mobile behavior.
- Docs explain mobile tooltip fallback behavior.
- Docs explain keyboard/fallback movement for kanban cards.

## Criterios De Aceptacion

1. Beta+ docs exist.
2. README links Beta+ docs.
3. Showcase has a Beta+ section.
4. Showcase tests cover the Beta+ section.
5. `pnpm build:all` passes.
6. `ng test showcase --watch=false` passes.

## Comandos De Validacion

```bash
pnpm build:all
ng test showcase --watch=false
```
