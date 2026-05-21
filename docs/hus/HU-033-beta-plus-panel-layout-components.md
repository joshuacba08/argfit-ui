# HU-033 - Beta+ Panel And Layout Components

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion / Fase 6 - Showcase Platform

## Dependencias

Esta HU depende de:

- HU-027 - Beta+ Scope And Component Strategy.
- HU-004 - AfCard Vertical Slice.
- HU-009 - AfPageShell Navigation Slice.
- HU-028 - Beta+ Overlay Components.

## Decision De Producto

Para crear interfaces avanzadas no alcanza con inputs y tablas. Beta+ necesita contenedores, paneles y layout primitives: tabs, stepper, splitter, toolbar, fieldset, scroll panel, divider y accordion.

## Historia De Usuario

Como desarrollador de pantallas complejas, quiero componentes de panel y layout, para componer flujos densos, secciones colapsables, tabs, toolbars y layouts redimensionables con una API ArgFit coherente.

## Componentes Incluidos

### Stable-For-Beta+

- `AfAccordion`
- `AfTabs`
- `AfToolbar`
- `AfDivider`
- `AfFieldset`
- `AfPanel`
- `AfScrollPanel`

### Experimental-In-Beta+

- `AfSplitter`
- `AfStepper`

### Ya Existente / Integracion

- `AfCard`

`AfCard` ya existe, pero esta HU debe documentar como convive con paneles, fieldsets y tabs.

## Engines Recomendados

| ArgFit API | Desktop | Mobile |
| --- | --- | --- |
| `AfAccordion` | PrimeNG `Accordion` | Ionic `ion-accordion`, `ion-accordion-group` |
| `AfTabs` | PrimeNG `Tabs` | Ionic `ion-segment`/custom tabs |
| `AfToolbar` | PrimeNG `Toolbar` | Ionic `ion-toolbar` or ArgFit toolbar |
| `AfDivider` | PrimeNG `Divider` or custom | Custom tokenized divider |
| `AfFieldset` | PrimeNG `Fieldset` | Custom/Ionic section card |
| `AfPanel` | PrimeNG `Panel` | Custom/Ionic section card |
| `AfScrollPanel` | PrimeNG `ScrollPanel` | Native scroll container with mobile momentum |
| `AfSplitter` | PrimeNG `Splitter` or CDK layout | Custom desktop-first, mobile stacked fallback |
| `AfStepper` | PrimeNG `Stepper` | Custom/Ionic step flow |

## Requisitos

- No usar cards dentro de cards para secciones grandes.
- Tabs deben soportar teclado y ARIA.
- Accordion debe soportar multiple/single expand.
- Stepper debe soportar linear/non-linear, labels y estados.
- Splitter debe documentar que mobile usa stacked fallback.
- Toolbar debe soportar slots start/center/end.
- ScrollPanel no debe romper foco, wheel ni touch scroll.
- Panel/Fieldset deben tener heading semantico.

## Paths Esperados

- `projects/argfit-ui-core/src/lib/types/panel.types.ts`
- `projects/argfit-ui-core/src/lib/types/tabs.types.ts`
- `projects/argfit-ui-core/src/lib/types/stepper.types.ts`
- `projects/argfit-ui-desktop/src/lib/components/*`
- `projects/argfit-ui-mobile/src/lib/components/*`
- `projects/argfit-ui-adaptive/src/lib/components/*`
- showcase y docs Beta+

## Showcase Esperado

Crear seccion Panel/Layout Beta+ con:

- tabs para vista de atleta;
- accordion para bloques de evaluacion;
- fieldset/panel para formularios;
- toolbar con acciones;
- splitter desktop para detalle/lista;
- stepper para configurar rutina;
- scroll panel con lista larga;
- divider en layouts densos.

## Criterios De Aceptacion

1. Componentes stable-for-Beta+ existen en adaptive.
2. `AfTabs` y `AfAccordion` tienen tests de teclado.
3. `AfStepper` y `AfSplitter` quedan implementados o documentados como experimental-in-Beta+ con showcase controlado.
4. Mobile tiene fallback de layout propio para Splitter/Stepper.
5. No hay fugas de tipos PrimeNG/Ionic.
6. Showcase cubre paneles, tabs, stepper, splitter y toolbar.
7. `pnpm guard:architecture` pasa.
8. `pnpm test:all` pasa.

## Comandos De Validacion

```bash
pnpm guard:architecture
pnpm test:all
pnpm build:all
```

## Prompt Para Implementacion

Implementa HU-033 - Beta+ Panel And Layout Components.

Prioriza `AfTabs`, `AfAccordion`, `AfToolbar`, `AfPanel`, `AfFieldset`, `AfDivider` y `AfScrollPanel`. Luego implementa `AfStepper` y `AfSplitter` como experimental-in-Beta+ con mobile fallback documentado.
