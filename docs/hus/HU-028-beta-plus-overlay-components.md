# HU-028 - Beta+ Overlay Components

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion

## Dependencias

Esta HU depende de:

- HU-027 - Beta+ Scope And Component Strategy.
- HU-021 - Beta Accessibility And Keyboard Audit.
- HU-022 - Beta Visual Regression And Responsive QA.

## Decision De Producto

ArgFit necesita overlays propios, no APIs expuestas de PrimeNG/Ionic. Desktop puede usar PrimeNG internamente; mobile debe usar Ionic o patrones custom touch-first.

## Historia De Usuario

Como desarrollador de producto, quiero popovers, drawers y tooltips adaptativos, para construir acciones contextuales y ayudas de UI sin acoplar mi app a PrimeNG o Ionic.

## Objetivo

Implementar:

- `AfPopover`
- `AfDrawer`
- `AfTooltip`

## Engines Recomendados

| ArgFit API | Desktop | Mobile |
| --- | --- | --- |
| `AfPopover` | PrimeNG `Popover` or custom CDK-backed wrapper | Ionic `ion-popover` |
| `AfDrawer` | PrimeNG `Drawer` | Ionic `ion-menu` or modal sheet |
| `AfTooltip` | PrimeNG `Tooltip` | Custom tap help popover or inline disclosure |

## Requisitos

- Public API vendor-independent.
- Keyboard and pointer interactions covered.
- Escape dismisses dismissible overlays.
- Focus returns to trigger when appropriate.
- Mobile does not rely on hover-only behavior.
- Tooltip mobile fallback is explicitly documented.
- Visual QA covers open states.

## Criterios De Aceptacion

1. Adaptive exports exist for `AfPopover`, `AfDrawer` and `AfTooltip`.
2. Desktop and mobile implementations exist.
3. No vendor types leak through adaptive APIs.
4. Accessibility tests cover dismiss and focus behavior.
5. Showcase demonstrates desktop and mobile states.
6. `pnpm test:all` passes.

## Comandos De Validacion

```bash
pnpm guard:architecture
pnpm test:all
```

