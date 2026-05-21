# HU-030 - Beta+ Showcase And Documentation

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion / Fase 6 - Showcase Platform

## Dependencias

Esta HU depende de:

- HU-028 - Beta+ Overlay Components.
- HU-029 - Beta+ Status Identity And Disclosure Components.

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
- Showcase includes avatar/chip/accordion examples in realistic product context.
- Docs explain mobile tooltip fallback behavior.

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

