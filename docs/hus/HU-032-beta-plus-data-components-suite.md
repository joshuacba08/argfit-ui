# HU-032 - Beta+ Data Components Suite

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion / Fase 7 - Enterprise Systems

## Dependencias

Esta HU depende de:

- HU-027 - Beta+ Scope And Component Strategy.
- HU-011 - AfDataTable Vertical Slice.
- HU-031 - Beta+ Selection And Advanced Form Components.

## Decision De Producto

Beta+ debe desbloquear interfaces avanzadas de datos mas alla de `AfDataTable`: vistas de lista/grid, paginacion reusable, ordenamiento visual, picklists, timeline, arboles y virtualizacion.

## Historia De Usuario

Como desarrollador de dashboards avanzados, quiero componentes de datos reutilizables, para construir pantallas densas de administracion, analitica y organizacion sin recrear patrones de lista, arbol, paginacion o virtualizacion.

## Componentes Incluidos

### Prioridad Alta

- `AfDataView`
- `AfPaginator`
- `AfOrderList`
- `AfPickList`
- `AfTimeline`
- `AfTree`
- `AfTreeTable`
- `AfVirtualScroller`

### Prioridad Media

- `AfOrganizationChart`

`AfDataTable` ya existe desde beta y debe integrarse con los nuevos primitives de paginacion/filtros cuando corresponda.

## Engines Recomendados

| ArgFit API | Desktop | Mobile |
| --- | --- | --- |
| `AfDataView` | PrimeNG `DataView` | ArgFit/Ionic cards or list/grid |
| `AfPaginator` | PrimeNG `Paginator` | Compact pagination, load more or infinite pattern |
| `AfOrderList` | PrimeNG `OrderList` or CDK DragDrop | CDK DragDrop or move actions |
| `AfPickList` | PrimeNG `PickList` or CDK DragDrop | Dual-sheet/list pattern |
| `AfTimeline` | PrimeNG `Timeline` | Custom/Ionic timeline list |
| `AfTree` | PrimeNG `Tree` | Custom nested list with disclosure |
| `AfTreeTable` | PrimeNG `TreeTable` | Mobile grouped cards/list, not table shrink |
| `AfVirtualScroller` | PrimeNG `VirtualScroller` or CDK virtual scroll | CDK virtual scroll or paginated mobile fallback |
| `AfOrganizationChart` | PrimeNG `OrganizationChart` | Custom compact hierarchy viewer |

## Requisitos

- APIs deben ser data-model-first y no PrimeNG-model-first.
- Soportar templates o slots para item, empty, loading y actions.
- Estados loading, empty y error deben ser consistentes.
- `AfPaginator` debe poder usarse con `AfDataTable` y `AfDataView`.
- Drag/reorder debe preferir CDK cuando de mas control y accesibilidad.
- Virtualizacion debe documentar restricciones de alto/row height.
- Mobile debe priorizar cards/listas, no tablas comprimidas.

## Paths Esperados

- `projects/argfit-ui-core/src/lib/types/data-view.types.ts`
- `projects/argfit-ui-core/src/lib/types/paginator.types.ts`
- `projects/argfit-ui-core/src/lib/types/tree.types.ts`
- `projects/argfit-ui-core/src/lib/types/timeline.types.ts`
- `projects/argfit-ui-desktop/src/lib/components/*`
- `projects/argfit-ui-mobile/src/lib/components/*`
- `projects/argfit-ui-adaptive/src/lib/components/*`
- showcase, visual regression y docs Beta+

## Showcase Esperado

Crear seccion Data Beta+ con:

- `AfDataView` alternando list/grid.
- `AfPaginator` conectado a DataView.
- `AfOrderList` para ordenar tests.
- `AfPickList` para asignar atletas a una rutina.
- `AfTimeline` para eventos de sesion.
- `AfTree` para club/equipo/grupo.
- `AfTreeTable` desktop y mobile fallback.
- `AfVirtualScroller` con dataset suficientemente grande.

## Criterios De Aceptacion

1. Componentes prioridad alta existen en adaptive.
2. Desktop y mobile tienen implementaciones platform-appropriate.
3. `AfPaginator` se puede usar de forma independiente.
4. No se filtran tipos PrimeNG/Ionic/CDK en adaptive.
5. Tests cubren paginacion, seleccion, reorder, expand/collapse y estados.
6. Visual QA cubre DataView, Timeline, Tree/TreeTable y VirtualScroller.
7. `pnpm guard:architecture` pasa.
8. `pnpm test:all` pasa.

## Comandos De Validacion

```bash
pnpm guard:architecture
pnpm test:all
pnpm build:all
pnpm visual:beta-plus
```

## Prompt Para Implementacion

Implementa HU-032 - Beta+ Data Components Suite.

Prioriza `AfDataView`, `AfPaginator`, `AfTimeline` y `AfTree` como primeros vertical slices. Luego suma reorder/picklist y virtualizacion. Mantiene mobile list/card-first y usa CDK cuando mejore drag/drop o virtual scroll.
