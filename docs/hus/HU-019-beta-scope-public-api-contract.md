# HU-019 - Beta Scope And Public API Contract

## Estado

Implemented

## Fase Del Roadmap

Fase 11 - Beta Hardening

## Dependencias

Esta HU depende de:

- HU-015 - Alpha Public API Scope.
- HU-016 - Alpha Packaging And Versioning.
- HU-017 - Alpha Consumer Docs And Showcase.
- HU-018 - Alpha Release Gate And CI.

## Decision De Producto

La beta no debe ser solo la alpha con otro tag. Necesita declarar que APIs quedan suficientemente estables para consumidores tempranos y cuales siguen en validacion.

El objetivo es reducir incertidumbre: cada export publico debe tener una categoria beta, una razon y una politica de cambio.

## Historia De Usuario

Como maintainer de ArgFit UI, quiero definir el contrato publico beta, para que consumidores tempranos sepan que APIs pueden adoptar con menor riesgo y que APIs siguen experimentales.

## Objetivo

Crear el scope beta:

- Version objetivo `0.1.0-beta.0`.
- Clasificacion de cada export publico.
- Decision de promocion o permanencia experimental.
- Decision de engine desktop/mobile para cada componente relevante.
- Politica de breaking changes durante beta.
- Guia inicial de migracion desde `0.1.0-alpha.0`.

## Alcance Incluido

Paths esperados:

- `docs/beta/beta-scope.md`
- `docs/beta/public-api.md`
- `docs/beta/component-engine-map.md`
- `docs/beta/migration-alpha-to-beta.md`
- `docs/beta/readiness.md`
- `docs/alpha/known-limitations.md`
- `docs/roadmap.md`
- `docs/hus/README.md`

## Clasificaciones Requeridas

Cada API publica debe quedar en una de estas categorias:

- `stable-for-beta`: contrato recomendado para consumidores beta.
- `experimental-in-beta`: disponible, pero todavia puede cambiar en prereleases beta.
- `out-of-beta`: no se promete para `0.1.0-beta.0`.
- `renderer-specific`: API publica de renderer, no ruta principal de consumo.

## Decisiones Minimas

La HU debe decidir explicitamente:

- La politica de renderers: desktop PrimeNG-first, mobile Ionic-first, adaptive vendor-independent.
- En que casos se permite PrimeNG dentro de `argfit-ui-mobile`.
- Si `AfDataTable` se promueve o sigue experimental.
- Si `AfAnalyticsCard` se promueve o sigue experimental.
- Si `AfSelect`, `AfTextarea`, `AfToggle`, `AfCheckbox`, `AfRadioGroup`, `AfSegmentedControl` y `AfPassword` se promueven.
- Si `AfToastService`, `AfToastViewport`, `AfToast` y `AfInlineMessage` se promueven.
- Que componentes planned siguen fuera de beta: overlays avanzados, date picker, file upload, autocomplete, slider, virtual table, chart export y notification center.

## Mapa De Engines Requerido

Crear o actualizar `docs/beta/component-engine-map.md` con una matriz como minimo para:

- `AfButton`: PrimeNG `Button` / Ionic `ion-button`.
- `AfInput`: PrimeNG `InputText`, `IconField`, `InputGroup` / Ionic `ion-input`, `ion-searchbar`.
- `AfTextarea`: PrimeNG `Textarea` / Ionic `ion-textarea`.
- `AfPassword`: PrimeNG `Password` / Ionic `ion-input` + `ion-input-password-toggle`.
- `AfSelect`: PrimeNG `Select` / Ionic `ion-select`.
- `AfCheckbox`: PrimeNG `Checkbox` / Ionic `ion-checkbox`.
- `AfRadioGroup`: PrimeNG `RadioButton` / Ionic `ion-radio-group`.
- `AfToggle`: PrimeNG `ToggleSwitch` / Ionic `ion-toggle`.
- `AfSegmentedControl`: PrimeNG `SelectButton` / Ionic `ion-segment`.
- `AfDialog`: PrimeNG `Dialog`, `ConfirmDialog` / Ionic `ion-modal`, `ion-alert`.
- `AfToast` and `AfInlineMessage`: PrimeNG `Toast`, `Message` / Ionic `ion-toast` plus custom inline message.
- `AfBadge`: PrimeNG `Badge`, `Tag`, `Chip` / Ionic `ion-badge`, `ion-chip`.
- `AfCard`: PrimeNG `Card`, `Panel` / Ionic `ion-card`.
- `AfDataTable`: PrimeNG `Table`, `Paginator` / Ionic `ion-list`, `ion-item`, `ion-infinite-scroll`, `ion-refresher` or custom list.
- `AfPageShell`: PrimeNG `Menu`, `Menubar`, `Breadcrumb`, `Toolbar`, `Drawer` / Ionic `ion-menu`, `ion-split-pane`, `ion-tabs`, `ion-toolbar`.

El mapa tambien debe marcar candidatos Beta+ o post-beta:

- `AfPopover`, `AfDrawer`, `AfTooltip`, `AfProgress`, `AfAvatar`, `AfChip`, `AfAccordion`.
- `AfAutocomplete`, `AfDatePicker`, `AfFileUpload`, `AfSlider`, `AfStepper`, `AfTree`, `AfVirtualList`, `AfActionSheet`.

## Politica Mobile

Mobile debe ser Ionic-first. PrimeNG puede usarse dentro de mobile solo si:

- Ionic no tiene equivalente fuerte.
- No se rompe la UX touch-first.
- No se ignoran safe areas, overlays nativos o comportamiento de teclado movil.
- No se exponen tipos, clases, eventos ni APIs PrimeNG al consumidor.
- El impacto de bundle queda medido.
- Hay tests o QA visual que demuestran que no parece un widget desktop encogido.

## Fuera De Alcance

Esta HU NO debe:

- Implementar componentes nuevos.
- Cambiar APIs sin documentar la razon.
- Crear release beta.
- Publicar paquetes.

## Criterios De Aceptacion

1. Existe `docs/beta/beta-scope.md`.
2. Existe `docs/beta/public-api.md`.
3. Existe `docs/beta/component-engine-map.md`.
4. Existe `docs/beta/migration-alpha-to-beta.md`.
5. Cada export publico queda clasificado.
6. Toda API promovida a `stable-for-beta` tiene razon documentada.
7. Toda API que siga experimental tiene condicion de salida documentada.
8. No hay vendor leakage en el contrato adaptive.
9. `docs/beta/readiness.md` enlaza esta HU.
10. `pnpm guard:architecture` pasa.
11. `pnpm build:libs` pasa.

## Checklist Tecnica

- [ ] Leer `docs/alpha/public-api.md`.
- [ ] Leer `docs/alpha/alpha-scope.md`.
- [ ] Revisar los cinco `src/public-api.ts`.
- [ ] Revisar package READMEs.
- [ ] Crear o actualizar component engine map.
- [ ] Definir excepciones permitidas para PrimeNG en mobile.
- [ ] Crear scope beta.
- [ ] Crear inventario public API beta.
- [ ] Crear migracion alpha -> beta.
- [ ] Actualizar roadmap y README de HUs.
- [ ] Ejecutar validaciones.

## Comandos De Validacion

```bash
pnpm guard:architecture
pnpm build:libs
git status --short
```

## Prompt Recomendado

```txt
Implementa HU-019 - Beta Scope And Public API Contract.

Objetivo:
Definir el contrato publico de `0.1.0-beta.0`, clasificando cada export como stable-for-beta, experimental-in-beta, out-of-beta o renderer-specific.

Definition of Done:
docs/beta/beta-scope.md, docs/beta/public-api.md y docs/beta/migration-alpha-to-beta.md existen, todos los exports estan clasificados y pnpm guard:architecture + pnpm build:libs pasan.
```
