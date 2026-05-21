# HU-020 - Beta Experimental Components Hardening

## Estado

Implemented

## Fase Del Roadmap

Fase 11 - Beta Hardening

## Dependencias

Esta HU depende de:

- HU-019 - Beta Scope And Public API Contract.

## Decision De Producto

La alpha ya expone componentes experimentales utiles. Para beta, cada uno debe dejar de ser "preview casual" y convertirse en contrato beta o quedar explicitamente marcado como experimental-in-beta.

El foco no es agrandar el catalogo: es endurecer lo que ya existe.

Desktop debe ser PrimeNG-first y mobile debe ser Ionic-first. PrimeNG dentro del renderer mobile solo se acepta como excepcion interna documentada, nunca como API publica ni como sustituto de una UX touch-first.

## Historia De Usuario

Como consumidor beta de ArgFit UI, quiero que las APIs de data, analytics, formularios y feedback tengan contratos predecibles, para poder integrarlas sin rehacer pantallas completas en cada prerelease.

## Objetivo

Endurecer las APIs experimentales alpha:

- `AfDataTable`.
- `AfAnalyticsCard`.
- `AfSelect`, `AfTextarea`, `AfToggle`, `AfCheckbox`, `AfRadioGroup`, `AfSegmentedControl`.
- `AfPassword`.
- `AfToastService`, `AfToast`, `AfToastViewport`, `AfInlineMessage`.

## Alcance Incluido

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/*.types.ts`
- `projects/argfit-ui-core/src/lib/services/toast.service.ts`
- `projects/argfit-ui-adaptive/src/lib/components/**`
- `projects/argfit-ui-desktop/src/lib/components/**`
- `projects/argfit-ui-mobile/src/lib/components/**`
- `projects/showcase/src/app/*`
- `docs/beta/beta-scope.md`
- `docs/beta/public-api.md`
- `docs/alpha/known-limitations.md`

## Requisitos De Hardening

Para cada componente candidato a beta:

- Engine desktop/mobile decidido segun `docs/beta/component-engine-map.md`.
- Si mobile usa PrimeNG, la excepcion esta justificada con UX, accesibilidad y bundle.
- Inputs y outputs documentados.
- Defaults estables y consistentes entre desktop/mobile.
- Eventos sin duplicados y con tipos ArgFit-owned.
- ControlValueAccessor validado en los controles de formulario.
- Estados disabled, loading, empty, error o readonly cuando correspondan.
- Tests de desktop, mobile y adaptive.
- Showcase cubre caso happy path y al menos un estado limite.
- No se exponen tipos de PrimeNG, Ionic o ECharts.

## Decisiones Por Componente

`AfDataTable` debe resolver:

- Sorting controlado/no controlado.
- Pagination.
- Selection single/multiple.
- Empty/loading/error.
- Custom cell templates.
- Mobile list parity.
- Mobile no debe renderizar una tabla desktop con overflow horizontal obligatorio.

`AfAnalyticsCard` debe resolver:

- Estados ready/loading/empty/error.
- Slots de actions, metrics, legend y footer.
- Altura estable con charts.

Form controls deben resolver:

- CVA.
- Label, hint, error y disabled.
- Reactive forms en desktop/mobile.
- Valores iniciales y cambios programaticos.

Feedback debe resolver:

- Lifecycle de toasts.
- Duracion y persistencia.
- Placement.
- Dismiss accesible.
- Limpieza por servicio.

## Componentes Beta+ A No Perder

Si durante esta HU aparece necesidad de componentes nuevos, no implementarlos salvo que desbloqueen el hardening. Dejarlos documentados como candidatos:

- `AfPopover`: PrimeNG `Popover` / Ionic `ion-popover`.
- `AfDrawer`: PrimeNG `Drawer` / Ionic `ion-menu` o sheet modal.
- `AfTooltip`: PrimeNG `Tooltip` / mobile custom help popover o inline disclosure.
- `AfProgress`: PrimeNG `ProgressBar`, `ProgressSpinner`, `Skeleton` / Ionic `ion-progress-bar`, `ion-spinner`, `ion-skeleton-text`, `ion-loading`.
- `AfAvatar`: PrimeNG `Avatar` / Ionic `ion-avatar`.
- `AfChip`: PrimeNG `Chip`, `Tag` / Ionic `ion-chip`.
- `AfAccordion`: PrimeNG `Accordion` / Ionic `ion-accordion`.

## Fuera De Alcance

Esta HU NO debe implementar:

- Virtual scroll.
- Server-side table data source completo.
- Notification center.
- Date picker.
- File upload.
- Autocomplete.
- Chart export.

Esos gaps pueden quedar `out-of-beta` si HU-019 lo decide.

## Criterios De Aceptacion

1. Cada componente experimental alpha queda promovido o marcado como `experimental-in-beta` con razon.
2. Los componentes promovidos tienen tests de contrato suficientes.
3. Desktop y mobile tienen comportamiento equivalente donde aplique.
4. No hay vendor leakage en public signatures.
5. Showcase demuestra los componentes promovidos.
6. Docs beta reflejan el estado final.
7. `pnpm guard:architecture` pasa.
8. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer HU-019.
- [ ] Revisar public API beta propuesta.
- [ ] Auditar inputs/outputs de componentes experimentales.
- [ ] Cerrar inconsistencias de desktop/mobile.
- [ ] Agregar tests faltantes.
- [ ] Actualizar showcase.
- [ ] Actualizar docs beta.
- [ ] Ejecutar validaciones.

## Comandos De Validacion

```bash
pnpm guard:architecture
pnpm build:all
pnpm test:all
```

## Prompt Recomendado

```txt
Implementa HU-020 - Beta Experimental Components Hardening.

Objetivo:
Endurecer las APIs experimentales alpha y dejar cada una promovida a stable-for-beta o marcada como experimental-in-beta con razon.

Definition of Done:
Contratos, tests, showcase y docs beta actualizados; pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```
