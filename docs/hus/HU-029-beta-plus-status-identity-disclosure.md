# HU-029 - Beta+ Status Identity And Disclosure Components

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion

## Dependencias

Esta HU depende de:

- HU-027 - Beta+ Scope And Component Strategy.

## Decision De Producto

Beta+ debe completar primitives pequenas que aparecen en cualquier dashboard: progreso, carga, identidad de usuario/entidad y chips. Son componentes de bajo riesgo que mejoran mucho la composicion y sirven como base visual para componentes mas ricos como `AfKanban`.

## Historia De Usuario

Como consumidor de ArgFit UI, quiero primitives de estado e identidad, para construir pantallas completas sin recrear UI basica en cada app.

## Objetivo

Implementar:

- `AfProgress`
- `AfAvatar`
- `AfChip`

`AfProgress` puede incluir variantes de progress bar, spinner y skeleton si el scope Beta+ lo aprueba.

`AfAvatar` y `AfChip` deben quedar listos para ser reutilizados por `AfKanban` sin duplicar estilos de identidad, prioridad o categoria.

## Engines Recomendados

| ArgFit API | Desktop | Mobile |
| --- | --- | --- |
| `AfProgress` | PrimeNG `ProgressBar`, `ProgressSpinner`, `Skeleton` | Ionic `ion-progress-bar`, `ion-spinner`, `ion-skeleton-text` |
| `AfAvatar` | PrimeNG `Avatar` | Ionic `ion-avatar` |
| `AfChip` | PrimeNG `Chip`, `Tag` | Ionic `ion-chip` |

## Requisitos

- Components are standalone and OnPush.
- Visual values use `--af-*` tokens.
- Avatar supports initials, image and icon fallback.
- Chip supports removable and non-removable states.
- Progress states are screen-reader friendly.

## Criterios De Aceptacion

1. Adaptive exports exist for all included components.
2. Desktop and mobile implementations exist.
3. Tests cover core inputs, states and accessibility semantics.
4. Showcase demonstrates dark/light and desktop/mobile.
5. `pnpm guard:architecture` passes.
6. `pnpm test:all` passes.

## Comandos De Validacion

```bash
pnpm guard:architecture
pnpm test:all
```
