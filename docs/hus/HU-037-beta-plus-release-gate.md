# HU-037 - Beta+ Release Gate And Publish Channel

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion / Fase 10 - Distribution

## Dependencias

Esta HU depende de:

- HU-027 - Beta+ Scope And Component Strategy.
- HU-028 - Beta+ Overlay Components.
- HU-029 - Beta+ Status Identity And Disclosure Components.
- HU-030 - Beta+ Form Field And Input Components.
- HU-031 - Beta+ Selection And Advanced Form Components.
- HU-032 - Beta+ Data Components Suite.
- HU-033 - Beta+ Panel And Layout Components.
- HU-034 - Beta+ Kanban Workflow Board.
- HU-035 - Beta+ Showcase And Documentation.
- HU-036 - Beta+ Consumer And Visual Validation.

## Objetivo

Crear release flow Beta+:

- Version target `0.2.0-beta.0`.
- `release:beta-plus:check`.
- Tarballs Beta+.
- Release notes Beta+.
- Changelog Beta+.
- Optional publish workflow.

## Gate Local Sugerido

```json
{
  "release:beta-plus:check": "pnpm guard:architecture && pnpm build:all && pnpm test:all && pnpm audit:accessibility && pnpm visual:beta-plus && pnpm beta-plus:consumer-smoke && pnpm pack:beta-plus"
}
```

## Criterios De Aceptacion

1. Versiones Beta+ alineadas.
2. Tarballs Beta+ se generan en `dist/beta-plus-tarballs/`.
3. Release notes Beta+ existen.
4. Publish workflow usa dist-tag `beta` salvo decision contraria.
5. `pnpm release:beta-plus:check` pasa.

## Comandos De Validacion

```bash
pnpm release:beta-plus:check
git status --short
```
