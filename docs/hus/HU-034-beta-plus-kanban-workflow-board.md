# HU-034 - Beta+ Kanban Workflow Board

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion / Fase 7 - Enterprise Systems

## Dependencias

Esta HU depende de:

- HU-027 - Beta+ Scope And Component Strategy.
- HU-028 - Beta+ Overlay Components.
- HU-029 - Beta+ Status Identity And Disclosure Components.
- HU-032 - Beta+ Data Components Suite.
- HU-033 - Beta+ Panel And Layout Components.
- HU-021 - Beta Accessibility And Keyboard Audit.
- HU-022 - Beta Visual Regression And Responsive QA.

## Decision De Producto

El design system de Claude Design incluye un kanban de rutinas. Beta+ debe incorporarlo como componente de workflow real, no como pantalla hardcodeada del showcase.

La interaccion de drag/drop debe ser fluida y animada. PrimeNG puede seguir siendo engine visual en desktop para piezas como botones, badges, menus o tarjetas, pero el drag/drop debe apoyarse preferentemente en `@angular/cdk/drag-drop` por su soporte de listas conectadas, sorting, previews, placeholders y clases de animacion.

## Historia De Usuario

Como usuario de una app ArgFit, quiero organizar rutinas en un kanban fluido, para mover tareas entre estados como pendientes, listas, en curso y completadas con feedback claro y sin perder contexto.

## Objetivo

Implementar:

- `AfKanban`
- `AfKanbanDesktop`
- `AfKanbanMobile`
- tipos publicos compartidos para columnas, tarjetas, filtros y eventos
- soporte drag/drop con Angular CDK

## Referencia Visual

El componente debe poder reproducir el patron visual de `KANBAN - RUTINAS`:

- columnas: `Pendientes`, `Listas`, `En curso`, `Completadas`;
- contador por columna;
- cards con categoria, prioridad, titulo, descripcion, avatar/iniciales, fecha y metrica;
- filtros superiores por categoria: `Todas`, `CMJ`, `SJ`, `DJ`, `Sprint`, `Abalakov`;
- boton primario `Nueva rutina`;
- columna activa con borde dashed y drop target visible;
- card ghost/preview durante drag;
- movimiento suave al reordenar.

## Engines Recomendados

| ArgFit API | Desktop | Mobile |
| --- | --- | --- |
| `AfKanban` | Angular CDK DragDrop + composicion ArgFit/PrimeNG para botones, badges, menus y scroll | Angular CDK DragDrop cuando sea touch-safe + Ionic/ArgFit cards; fallback de acciones "Mover a..." para accesibilidad y touch |

`@angular/cdk/drag-drop` se considera engine de interaccion permitido para desktop y mobile porque no es un renderer visual externo y ya pertenece al stack Angular.

## API Minima Esperada

Tipos:

- `AfKanbanColumn`
- `AfKanbanCard`
- `AfKanbanPriority`
- `AfKanbanFilter`
- `AfKanbanMoveEvent`
- `AfKanbanColumnActionEvent`

Inputs:

- `columns`
- `cards`
- `filters`
- `activeFilter`
- `title`
- `ariaLabel`
- `cardIdKey`
- `columnIdKey`
- `disabled`
- `readonly`
- `allowReorder`
- `allowCrossColumnMove`
- `density`: `compact | comfortable`
- `emptyState`

Outputs:

- `cardMove`
- `cardClick`
- `addCard`
- `filterChange`
- `columnAction`

Templates o slots:

- card content custom.
- column header custom.
- empty column custom.
- card footer/action custom.

## Requisitos De Interaccion

- Reordenar cards dentro de una columna.
- Mover cards entre columnas conectadas.
- Mantener preview y placeholder durante drag.
- Animar transiciones de cards con clases CDK:
  - `.cdk-drag-preview`
  - `.cdk-drag-placeholder`
  - `.cdk-drag-animating`
- Drop target con borde dashed y color de columna.
- No bloquear scroll horizontal del tablero.
- Soportar `prefers-reduced-motion`.
- Emitir eventos sin mutar los inputs si la API se define como controlada.
- Documentar si el componente ofrece modo controlado, no controlado o ambos.

## Requisitos De Mobile

- Mobile no debe ser una tabla desktop encogida.
- Debe poder renderizar como:
  - board horizontal swipeable; o
  - lista agrupada por estado con acciones de mover.
- Drag/drop touch debe ser usable sin interferir con scroll.
- Debe existir alternativa accesible sin drag: menu/acciones `Mover a...`.
- Safe areas y viewport height deben estar contemplados.

## Requisitos De Accesibilidad

- El tablero debe tener `aria-label` o titulo accesible.
- Columnas deben anunciar nombre y cantidad.
- Cards deben ser focusables cuando son interactivas.
- Debe existir operacion por teclado para mover cards:
  - seleccionar card;
  - mover arriba/abajo;
  - mover a columna anterior/siguiente;
  - confirmar/cancelar.
- Cambios de columna deben anunciarse con live region.
- Drag/drop no puede ser el unico mecanismo para completar la tarea.

## Paths Esperados

- `projects/argfit-ui-core/src/lib/types/kanban.types.ts`
- `projects/argfit-ui-desktop/src/lib/components/kanban/*`
- `projects/argfit-ui-mobile/src/lib/components/kanban/*`
- `projects/argfit-ui-adaptive/src/lib/components/kanban/*`
- public APIs de core, desktop, mobile y adaptive
- `projects/showcase/src/app/*`
- `tools/visual-regression.mjs`
- docs Beta+

## Showcase Esperado

Crear seccion `Kanban` con datos ArgFit:

- rutinas de CMJ, SJ, DJ, Sprint y Abalakov;
- prioridades alta/media/baja;
- cards con atleta, fecha y cantidad de saltos;
- filtros funcionales;
- boton `Nueva rutina`;
- demo de drag/drop;
- detalle de card via overlay/dialog/drawer si HU-028 esta disponible.

## Criterios De Aceptacion

1. `AfKanban` existe en adaptive, desktop y mobile.
2. Drag/drop funciona con `@angular/cdk/drag-drop`.
3. Reorder dentro de columna y move entre columnas emiten `cardMove`.
4. Existe alternativa accesible sin drag para mover cards.
5. Mobile tiene comportamiento touch-first documentado.
6. Animaciones son fluidas y respetan `prefers-reduced-motion`.
7. Visual QA cubre board desktop, board mobile y estado de drop activo.
8. Tests cubren sorting, cross-column move, filtros y eventos.
9. `pnpm guard:architecture` pasa.
10. `pnpm test:all` pasa.

## Comandos De Validacion

```bash
pnpm guard:architecture
pnpm test:all
pnpm build:all
pnpm visual:beta-plus
```

## Prompt Para Implementacion

Implementa HU-034 - Beta+ Kanban Workflow Board.

Reusa la referencia de `docs/claude-design/ui_kits/desktop/kanban.jsx` como inspiracion visual, pero crea una API Angular/ArgFit propia. Usa Angular CDK DragDrop para listas conectadas y sorting, manteniendo renderers desktop/mobile separados y sin filtrar PrimeNG/Ionic en la API publica.
