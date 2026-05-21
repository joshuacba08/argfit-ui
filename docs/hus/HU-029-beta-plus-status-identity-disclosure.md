# HU-029 - Beta+ Status Identity And Disclosure Components

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion

## Dependencias

Esta HU depende de:

- HU-027 - Beta+ Scope And Component Strategy.

## Decision De Producto

Beta+ debe completar primitives pequenas que aparecen en cualquier dashboard: progreso, carga, identidad de usuario/entidad, chips y disclosure. Son componentes de bajo riesgo que mejoran mucho la composicion.

## Historia De Usuario

Como consumidor de ArgFit UI, quiero primitives de estado, identidad y disclosure, para construir pantallas completas sin recrear UI basica en cada app.

## Objetivo

Implementar:

- `AfProgress`
- `AfAvatar`
- `AfChip`
- `AfAccordion`

`AfProgress` puede incluir variantes de progress bar, spinner y skeleton si el scope Beta+ lo aprueba.

## Engines Recomendados

| ArgFit API | Desktop | Mobile |
| --- | --- | --- |
| `AfProgress` | PrimeNG `ProgressBar`, `ProgressSpinner`, `Skeleton` | Ionic `ion-progress-bar`, `ion-spinner`, `ion-skeleton-text` |
| `AfAvatar` | PrimeNG `Avatar` | Ionic `ion-avatar` |
| `AfChip` | PrimeNG `Chip`, `Tag` | Ionic `ion-chip` |
| `AfAccordion` | PrimeNG `Accordion` | Ionic `ion-accordion`, `ion-accordion-group` |

## Requisitos

- Components are standalone and OnPush.
- Visual values use `--af-*` tokens.
- Avatar supports initials, image and icon fallback.
- Chip supports removable and non-removable states.
- Accordion supports keyboard navigation and ARIA state.
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

