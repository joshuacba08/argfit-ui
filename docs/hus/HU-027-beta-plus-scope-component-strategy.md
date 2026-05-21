# HU-027 - Beta+ Scope And Component Strategy

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion

## Dependencias

Esta HU depende de:

- HU-026 - Beta Release Gate And Publish Channel.

## Decision De Producto

Beta+ debe ampliar el catalogo sin romper la confianza ganada en beta. El objetivo ahora es habilitar interfaces avanzadas: formularios completos, seleccion compleja, data views, panel/layout, overlays, identidad visual y un primer componente compuesto de workflow.

## Historia De Usuario

Como consumidor beta de ArgFit UI, quiero una expansion controlada del catalogo, para cubrir patrones frecuentes de producto sin depender directamente de PrimeNG o Ionic.

## Objetivo

Definir el contrato Beta+:

- Target recomendado `0.2.0-beta.0`.
- APIs incluidas y excluidas.
- Engines desktop/mobile por componente.
- Politica de promocion desde Beta+ hacia productiva.

## Alcance Incluido

Paths esperados:

- `docs/beta-plus/scope.md`
- `docs/beta-plus/public-api.md`
- `docs/beta-plus/readiness.md`
- `docs/beta/component-engine-map.md`
- `docs/roadmap.md`
- `docs/hus/README.md`

## Componentes Incluidos Por Familia

### Overlay

- `AfPopover`
- `AfDrawer`
- `AfTooltip`

### Status And Identity

- `AfProgress`
- `AfAvatar`
- `AfChip`

### Form

- `AfAutoComplete`
- `AfCascadeSelect`
- `AfCheckbox`
- `AfColorPicker`
- `AfDatePicker`
- `AfEditor`
- `AfField`
- `AfFloatLabel`
- `AfIconField`
- `AfIftaLabel`
- `AfInputGroup`
- `AfInputMask`
- `AfInputNumber`
- `AfInputCount`
- `AfInputOtp`
- `AfKeyFilter`
- `AfKnob`
- `AfListbox`
- `AfMultiSelect`
- `AfPassword`
- `AfRadioGroup`
- `AfRating`
- `AfSelect`
- `AfSegmentedControl`
- `AfSlider`
- `AfTextarea`
- `AfToggle`
- `AfToggleButton`
- `AfTreeSelect`

### Data

- `AfDataView`
- `AfPaginator`
- `AfOrderList`
- `AfPickList`
- `AfTimeline`
- `AfTree`
- `AfTreeTable`
- `AfVirtualScroller`
- `AfOrganizationChart`

### Panel And Layout

- `AfAccordion`
- `AfCard`
- `AfDivider`
- `AfFieldset`
- `AfPanel`
- `AfScrollPanel`
- `AfSplitter`
- `AfStepper`
- `AfTabs`
- `AfToolbar`

### Workflow

- `AfKanban`

## Componentes Por Prioridad

1. Alta prioridad para interfaces avanzadas: `AfMultiSelect`, `AfDatePicker`, `AfAutoComplete`, `AfTreeSelect`, `AfDataView`, `AfPaginator`, `AfTabs`, `AfStepper`, `AfKanban`.
2. Forms base y variaciones: inputs, masks, OTP, numeric, count, labels y field composition.
3. Data suite: DataView, paginator, reorder, picklist, tree, timeline y virtual scroll.
4. Panel/layout suite: tabs, toolbar, panels, accordion, splitter, stepper y scroll areas.
5. Bajo riesgo / alto reuso: overlays, progress, avatar y chip.

## Decision Tecnica Para Kanban

`AfKanban` puede usar `@angular/cdk/drag-drop` como engine de interaccion en desktop y mobile. PrimeNG queda permitido en desktop para piezas visuales internas como button, badge, menu o scroll, pero no como contrato publico. Mobile debe seguir touch-first y ofrecer alternativa accesible sin drag.

## Fuera De Alcance

No incluir en Beta+ salvo decision explicita:

- `AfFileUpload`
- `AfActionSheet`
- `AfCalendarScheduler`
- `AfVirtualKanban`
- `AfTerminal`

## Criterios De Aceptacion

1. Existe `docs/beta-plus/scope.md`.
2. Existe `docs/beta-plus/public-api.md`.
3. Cada componente Beta+ tiene engine desktop/mobile decidido.
4. Mobile sigue siendo Ionic-first.
5. No se aprueban excepciones PrimeNG mobile sin justificacion.
6. `AfMultiSelect` queda marcado como prioridad alta.
7. `AfKanban` documenta CDK DragDrop como engine de interaccion y fallback accesible.
8. Roadmap y README de HUs enlazan Beta+.
9. `pnpm guard:architecture` pasa.

## Comandos De Validacion

```bash
pnpm guard:architecture
```
