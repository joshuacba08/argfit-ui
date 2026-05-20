# HU-011 — AfDataTable Vertical Slice

## Estado

Ready for implementation

## Fase del Roadmap

Fase 3 — Desktop Foundation / Fase 4 — Mobile Foundation / Fase 5 — Adaptive Layer / Fase 7 — Enterprise Systems

## Dependencias

Esta HU depende de:

- HU-001 — Formalizar tokens del design system.
- HU-002 — Theme runtime y estilos base.
- HU-003 — Accessibility primitives.
- HU-004 — AfCard vertical slice.
- HU-005 — AfInput vertical slice.
- HU-007 — Icon and Chart Foundations.
- HU-008 — AfBadge vertical slice.
- HU-009 — AfPageShell navigation slice.
- HU-010 — AfMetricCard vertical slice.

## Decision de Producto

ArgFit UI necesita un componente `AfDataTable` para vistas enterprise de atletas, dispositivos, sesiones y reportes. Las pantallas de Claude Design ya muestran tablas con sorting, paginacion, acciones, estados, seleccion y detalle expandible.

`AfDataTable` NO debe ser una copia expuesta de PrimeNG ni una tabla generica sin identidad. Debe ser una API adaptativa ArgFit que use una tabla densa en desktop y una lista mobile equivalente cuando el viewport/plataforma no soporte una tabla horizontal comoda.

Debe permitir construir:

- Tabla de atletas con columnas de deporte, sesiones, mejor salto, fuerza, RSI y estado.
- Tabla de dispositivos con estado y bateria.
- Tabla de reportes/sesiones.
- Tabla avanzada con busqueda, filtros, seleccion, densidad y filas expandibles.
- Mobile list de datos clave con la misma informacion priorizada.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero una data table adaptativa, tipada y accesible, para mostrar datasets deportivos y operativos con sorting, paginacion, seleccion y estados sin acoplar la aplicacion a PrimeNG ni rehacer tablas por pantalla.

## Objetivo

Crear el vertical slice inicial de `AfDataTable`:

- Tipos publicos en core.
- Implementacion desktop table.
- Implementacion mobile list/table compacta.
- API adaptativa publica.
- Columnas tipadas.
- Sorting controlado/no controlado basico.
- Paginacion basica.
- Estados loading, empty y error.
- Seleccion de filas opcional.
- Fila expandible opcional.
- Custom cell templates para casos como badge, progreso y acciones.
- Showcase con dataset de atletas.
- Tests por capa.

## Referencias del Design System

Todos los archivos de Claude Design estan disponibles localmente en `docs/claude-design`.

Referencias obligatorias para esta HU:

- `docs/claude-design/README.md`
- `docs/claude-design/SKILL.md`
- `docs/claude-design/colors_and_type.css`
- `docs/claude-design/preview/colors-surfaces.html`
- `docs/claude-design/preview/comp-badges.html`
- `docs/claude-design/preview/comp-buttons.html`
- `docs/claude-design/preview/comp-inputs.html`
- `docs/claude-design/ui_kits/desktop/components.jsx`
- `docs/claude-design/ui_kits/desktop/advanced-table.jsx`
- `docs/claude-design/ui_kits/desktop/screens.jsx`
- `docs/claude-design/ui_kits/mobile/components.jsx`
- `docs/claude-design/ui_kits/mobile/screens.jsx`

Referencias opcionales utiles:

- `docs/claude-design/ui_kits/desktop/forms.jsx`
- `docs/claude-design/ui_kits/desktop/overlays.jsx`
- `docs/claude-design/ui_kits/mobile/forms.jsx`
- `docs/claude-design/ui_kits/mobile/overlays.jsx`

## Screenshots Que Debe Adjuntar El Agente

Adjuntar al agente, ademas de los archivos anteriores:

- Screenshot desktop de la tabla simple en Dashboard/Athletes (`DataTable` de `desktop/components.jsx` usado en `desktop/screens.jsx`).
- Screenshot desktop de `AdvancedTableScreen` con toolbar, filtros, densidad y paginacion.
- Screenshot desktop de `AdvancedTableScreen` con al menos una fila expandida.
- Screenshot desktop de seleccion multiple activa, mostrando la selected bar.
- Screenshot mobile de una lista de sesiones o metricas detalladas para validar la alternativa mobile.

Si el agente no recibe screenshots, debe usar `docs/claude-design/ui_kits/desktop/advanced-table.jsx` como referencia visual principal y `docs/claude-design/ui_kits/mobile/screens.jsx` como referencia mobile.

## Validacion de Diseno

La implementacion debe respetar las reglas detectadas en Claude Design:

- Contenedor principal surface `#0F1D32`, borde azul sutil, radio `12px`.
- Header con texto uppercase, pequeno, muted y peso `600`.
- Rows con padding denso y separadores muy suaves.
- Hover desktop con background primary muy sutil.
- Datos numericos usan mono o estilo data.
- Estados se renderizan con badges compactos.
- Acciones usan iconos pequenos y no botones grandes.
- Toolbar usa input de busqueda, selects/filtros y acciones compactas.
- Pagination vive en footer con texto muted y botones pequenos.
- Mobile debe priorizar columnas clave y convertir filas en items/list cards.

## Contexto Visual

La tabla ArgFit debe sentirse:

- Enterprise.
- Densa.
- Tecnica.
- Rapida de escanear.
- Preparada para datos deportivos.
- Coherente con `AfPageShell`, `AfBadge`, `AfInput`, `AfButton` y `AfMetricCard`.

No debe sentirse:

- Como tabla HTML default.
- Como PrimeNG sin customizar.
- Como spreadsheet completo.
- Como una tabla mobile con overflow horizontal obligatorio.
- Como componente con logica de negocio de atletas hardcodeada.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/data-table.types.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/data-table/af-data-table-desktop.component.ts`
- `projects/argfit-ui-desktop/src/lib/components/data-table/af-data-table-desktop.component.html`
- `projects/argfit-ui-desktop/src/lib/components/data-table/af-data-table-desktop.component.scss`
- `projects/argfit-ui-desktop/src/lib/components/data-table/af-data-table-desktop.component.spec.ts`
- `projects/argfit-ui-desktop/src/public-api.ts`

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/data-table/af-data-table-mobile.component.ts`
- `projects/argfit-ui-mobile/src/lib/components/data-table/af-data-table-mobile.component.html`
- `projects/argfit-ui-mobile/src/lib/components/data-table/af-data-table-mobile.component.scss`
- `projects/argfit-ui-mobile/src/lib/components/data-table/af-data-table-mobile.component.spec.ts`
- `projects/argfit-ui-mobile/src/public-api.ts`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/data-table/af-data-table.component.ts`
- `projects/argfit-ui-adaptive/src/lib/components/data-table/af-data-table.component.html`
- `projects/argfit-ui-adaptive/src/lib/components/data-table/af-data-table.component.scss`
- `projects/argfit-ui-adaptive/src/lib/components/data-table/af-data-table.component.spec.ts`
- `projects/argfit-ui-adaptive/src/lib/components/data-table/af-data-table-cell.directive.ts`
- `projects/argfit-ui-adaptive/src/lib/components/data-table/af-data-table-slots.directive.ts`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- Virtual scroll.
- Server-side data source completo.
- Column resizing.
- Column reorder.
- Grouping.
- Tree table.
- Inline editing.
- CSV export real.
- Drag and drop.
- Persistencia de filtros.
- Query builder avanzado.
- Infinite scroll.
- Dependencia publica de PrimeNG table.

## API Publica Esperada

Uso basico:

```html
<af-data-table
  [columns]="columns"
  [rows]="athletes"
  rowIdKey="id"
/>
```

Con sorting y paginacion:

```html
<af-data-table
  [columns]="columns"
  [rows]="athletes"
  rowIdKey="id"
  [sort]="sort"
  [pagination]="pagination"
  (sortChange)="setSort($event)"
  (pageChange)="setPage($event)"
/>
```

Con seleccion y fila expandible:

```html
<af-data-table
  [columns]="columns"
  [rows]="athletes"
  rowIdKey="id"
  selectionMode="multiple"
  [selectedRowIds]="selected"
  [expandedRowIds]="expanded"
  (selectionChange)="setSelected($event)"
  (rowExpandedChange)="setExpanded($event)"
>
  <ng-template afDataTableExpandedRow let-row>
    ...
  </ng-template>
</af-data-table>
```

Con custom cell:

```html
<af-data-table [columns]="columns" [rows]="athletes" rowIdKey="id">
  <ng-template afDataTableCell="status" let-value let-row="row">
    <af-badge [tone]="row.status === 'active' ? 'success' : 'neutral'" dot>
      {{ value }}
    </af-badge>
  </ng-template>
</af-data-table>
```

Tipos sugeridos:

```ts
type AfDataTableDensity = 'compact' | 'normal' | 'comfortable';
type AfDataTableSelectionMode = 'none' | 'single' | 'multiple';
type AfDataTableSortDirection = 'asc' | 'desc';
type AfDataTableColumnAlign = 'start' | 'center' | 'end';
type AfDataTableColumnPriority = 'primary' | 'secondary' | 'tertiary';

interface AfDataTableColumn<TRow = unknown> {
  readonly key: string;
  readonly header: string;
  readonly sortable?: boolean;
  readonly align?: AfDataTableColumnAlign;
  readonly width?: string;
  readonly minWidth?: string;
  readonly mobilePriority?: AfDataTableColumnPriority;
  readonly valueLabel?: (row: TRow) => string;
}

interface AfDataTableSort {
  readonly key: string;
  readonly direction: AfDataTableSortDirection;
}

interface AfDataTablePagination {
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly totalItems?: number;
}

interface AfDataTablePageChange {
  readonly pageIndex: number;
  readonly pageSize: number;
}
```

Inputs sugeridos:

```ts
columns = input.required<readonly AfDataTableColumn[]>();
rows = input<readonly unknown[]>([]);
rowIdKey = input<string>('id');
density = input<AfDataTableDensity>('normal');
selectionMode = input<AfDataTableSelectionMode>('none');
selectedRowIds = input<readonly string[]>([]);
expandedRowIds = input<readonly string[]>([]);
sort = input<AfDataTableSort | undefined>();
pagination = input<AfDataTablePagination | undefined>();
loading = input(false, { transform: booleanAttribute });
error = input<string | undefined>();
emptyTitle = input('Sin datos');
emptyDescription = input<string | undefined>();
ariaLabel = input<string>('Tabla de datos');
```

Outputs sugeridos:

```ts
sortChange = output<AfDataTableSort>();
pageChange = output<AfDataTablePageChange>();
rowPressed = output<unknown>();
selectionChange = output<readonly string[]>();
rowExpandedChange = output<readonly string[]>();
```

Slots/directives sugeridos:

```html
<ng-template afDataTableCell="columnKey" let-value let-row="row">...</ng-template>
<ng-template afDataTableExpandedRow let-row>...</ng-template>
<div afDataTableToolbar>...</div>
<div afDataTableEmpty>...</div>
```

Requisitos:

- Selector publico adaptativo: `af-data-table`.
- Export publico: `AfDataTable`.
- Implementaciones internas: `af-data-table-desktop` y `af-data-table-mobile`.
- Debe soportar custom cell templates.
- Debe usar `AfIcon` para sorting, acciones internas y expand/collapse.
- Debe integrarse bien con `AfBadge` en celdas custom.
- Debe mantener API vendor-independent.
- Debe ser standalone y OnPush.
- Debe usar solo tokens `--af-*`.
- Debe soportar navegacion de teclado minima.
- Debe exponer `aria-sort` en columnas ordenables.
- Debe usar estructura semantica de table en desktop.
- Mobile debe renderizar lista semantica, no tabla horizontal forzada.

## Tokens

Usar tokens existentes siempre que alcance:

- `--af-bg-surface`
- `--af-bg-elevated`
- `--af-bg-interactive`
- `--af-text-main`
- `--af-text-muted`
- `--af-text-soft`
- `--af-primary`
- `--af-primary-soft`
- `--af-success`
- `--af-warning`
- `--af-danger`
- `--af-border`
- `--af-border-soft`
- `--af-radius-sm`
- `--af-radius-md`
- `--af-radius-lg`
- `--af-shadow-sm`

Si hace falta agregar tokens, mantenerlos minimos:

- `--af-data-table-row-hover-bg`
- `--af-data-table-header-bg`
- `--af-data-table-selected-bg`

No crear paleta ni sistema de spacing nuevo.

## Implementacion Desktop

Crear `AfDataTableDesktopComponent`.

Requisitos visuales desktop:

- Contenedor con radio `12px`, borde soft y overflow controlado.
- Header uppercase, font small, muted.
- Rows con separadores `--af-border-soft`.
- Hover con primary soft.
- Densidades: compact, normal, comfortable.
- Numeros alineables a end.
- Sorting con icono discreto.
- Seleccion con checkbox tokenizado.
- Expand row con chevron y panel inferior.
- Pagination footer con rango `Mostrando X-Y de Z`.
- Loading con skeleton rows.
- Empty state centrado, compacto y sin ilustracion grande.
- Error state con tono danger y accion proyectable opcional.

## Implementacion Mobile

Crear `AfDataTableMobileComponent`.

Requisitos visuales mobile:

- Renderizar filas como list items/cards compactas.
- Usar columna `mobilePriority="primary"` como titulo.
- Usar columnas `secondary` como metadata visible.
- Ocultar o plegar columnas `tertiary`.
- Soportar seleccion con checkbox o estado selected discreto.
- Soportar expand para detalle si hay template.
- No forzar scroll horizontal.
- Mantener touch target razonable.
- Pagination simple con prev/next y rango.
- Loading/empty/error equivalentes a desktop.

## Implementacion Adaptive

Crear `AfDataTable` como API publica adaptativa.

Requisitos:

- Delegar a desktop/mobile segun `AfPlatformService`.
- Pasar todos los inputs.
- Reemitir todos los outputs.
- Proyectar toolbar, empty, expanded row y cell templates.
- Seguir patron de `AfPageShell`, `AfBadge` y `AfMetricCard`.
- No duplicar rendering table/list en adaptive.

## Showcase

Agregar una seccion dentro de `AfPageShell` con dataset de atletas basado en `docs/claude-design/ui_kits/desktop/advanced-table.jsx`.

Debe incluir:

- Toolbar con `AfInput` para busqueda visual/local.
- Acciones con `AfButton`.
- Tabla desktop con columnas: Atleta, Deporte, Sesiones, Mejor salto, Fuerza, RSI, Asimetria, Estado.
- Celdas de estado con `AfBadge`.
- Celdas numericas alineadas y data-like.
- Seleccion multiple.
- Sorting en al menos 3 columnas.
- Pagination.
- Empty state filtrando sin resultados.
- Mobile renderizado como lista priorizada.

La busqueda/filtros pueden ser locales dentro del showcase. La libreria no debe asumir filtros de negocio.

## Tests Requeridos

### Core

- Tipos exportados desde public API.
- Columnas, sort, pagination y selection mode aceptan valores esperados.

### Desktop

- Renderiza headers y rows.
- Renderiza custom cell template.
- Emite `sortChange` al activar header sortable.
- Expone `aria-sort`.
- Renderiza loading rows.
- Renderiza empty state.
- Renderiza error state.
- Emite `rowPressed`.
- Emite `selectionChange` en single/multiple.
- Renderiza expanded row template.
- Renderiza pagination footer y emite `pageChange`.

### Mobile

- Renderiza rows como lista.
- Usa `mobilePriority` para titulo/metadatos.
- No renderiza tabla HTML principal.
- Emite `rowPressed`.
- Emite `selectionChange`.
- Renderiza expanded row template.
- Renderiza loading/empty/error.

### Adaptive

- Renderiza desktop cuando platform es desktop.
- Renderiza mobile cuando platform es mobile.
- Pasa columnas, rows, sort, pagination y selection.
- Reemite outputs.
- Proyecta custom cell templates.

### Showcase

- Compila con `AfDataTable`.
- Renderiza al menos 8 filas.
- Incluye sorting, selection, badges, pagination y empty state.
- Renderiza alternativa mobile.

## Criterios de Aceptacion

1. Existe `AfDataTable` publico desde `@argfit-ui/adaptive`.
2. Existen implementaciones desktop y mobile.
3. Existe contrato tipado en `@argfit-ui/core`.
4. El componente no expone PrimeNG ni Ionic.
5. Desktop usa estructura semantica de table.
6. Mobile usa lista adaptada sin scroll horizontal obligatorio.
7. Sorting funciona y expone `aria-sort`.
8. Seleccion single/multiple funciona.
9. Pagination funciona.
10. Loading, empty y error estan cubiertos.
11. Custom cell templates funcionan.
12. Showcase usa dataset realista de atletas.
13. `pnpm guard:architecture` pasa.
14. `pnpm build:all` pasa.
15. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-011-af-data-table.md`.
- [ ] Leer `docs/architecture.md`.
- [ ] Leer `docs/component-philosophy.md`.
- [ ] Leer `docs/design-system.md`.
- [ ] Leer `docs/claude-design/README.md`.
- [ ] Leer `docs/claude-design/colors_and_type.css`.
- [ ] Revisar `DataTable` en `docs/claude-design/ui_kits/desktop/components.jsx`.
- [ ] Revisar `AdvancedTableScreen` en `docs/claude-design/ui_kits/desktop/advanced-table.jsx`.
- [ ] Revisar patrones mobile en `docs/claude-design/ui_kits/mobile/screens.jsx`.
- [ ] Crear tipos `data-table.types.ts`.
- [ ] Exportar tipos desde core.
- [ ] Crear `AfDataTableDesktopComponent`.
- [ ] Crear `AfDataTableMobileComponent`.
- [ ] Crear `AfDataTable` adaptativo.
- [ ] Crear directivas para custom cells y slots.
- [ ] Integrar `AfIcon`.
- [ ] Integrar ejemplos con `AfBadge`.
- [ ] Agregar dataset de showcase.
- [ ] Escribir tests por capa.
- [ ] Ejecutar validaciones.

## Comandos de Validacion

```bash
pnpm guard:architecture
pnpm build:core
pnpm build:desktop
pnpm build:mobile
pnpm build:adaptive
ng test argfit-ui-core --watch=false
ng test argfit-ui-desktop --watch=false
ng test argfit-ui-mobile --watch=false
ng test argfit-ui-adaptive --watch=false
ng test showcase --watch=false
pnpm build:all
pnpm test:all
```

## Verificacion Visual

Abrir showcase y revisar:

- Desktop se parece al AdvancedTable de Claude Design sin copiar estilos inline.
- Header y filas mantienen densidad enterprise.
- Sorting y seleccion no cambian el alto de filas.
- Badges no agrandan celdas.
- Expanded row se lee como detalle, no como card anidada pesada.
- Pagination queda alineada y discreta.
- Mobile prioriza informacion clave sin overflow horizontal.
- Empty/loading/error mantienen el mismo ancho y no rompen layout.
- Light theme conserva contraste.

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-011 — AfDataTable Vertical Slice.

Contexto obligatorio:
- Lee docs/hus/HU-011-af-data-table.md.
- Lee docs/architecture.md, docs/component-philosophy.md y docs/design-system.md.
- Lee docs/claude-design/README.md y docs/claude-design/colors_and_type.css.
- Revisa DataTable en docs/claude-design/ui_kits/desktop/components.jsx.
- Revisa AdvancedTableScreen en docs/claude-design/ui_kits/desktop/advanced-table.jsx.
- Revisa mobile/screens.jsx para la alternativa mobile tipo lista.
- Usa los screenshots adjuntos de tabla simple, advanced table, fila expandida y mobile list.

Objetivo:
Crear AfDataTable como componente adaptativo para datasets enterprise de ArgFit.

Decisiones:
- API publica vendor-independent.
- Desktop usa tabla semantica; mobile usa lista adaptada.
- Soportar sorting, pagination, selection, loading/empty/error y custom cells.
- Usar AfIcon y AfBadge donde corresponda.
- No implementar virtual scroll, server-side data source completo ni export real.

Definition of Done:
- Tipos core exportados.
- Implementaciones desktop/mobile/adaptive.
- Showcase con dataset de atletas y estados.
- Tests de core/desktop/mobile/adaptive/showcase.
- pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

`AfDataTable` abre la puerta a pantallas enterprise reales: atletas, dispositivos, reportes y sesiones. Con HU-010 y HU-011, ArgFit UI deja de ser solo una libreria de controles base y empieza a cubrir workflows de datos completos.
