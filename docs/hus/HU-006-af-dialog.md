# HU-006 — AfDialog Vertical Slice

## Estado

Ready for implementation

## Fase del Roadmap

Fase 3 — Desktop Foundation / Fase 4 — Mobile Foundation / Fase 5 — Adaptive Layer

## Dependencias

Esta HU depende de:

- HU-001 — Formalizar tokens del design system.
- HU-002 — Theme runtime y estilos base.
- HU-003 — Accessibility primitives.
- HU-004 — AfCard vertical slice.
- HU-005 — AfInput vertical slice.
- `AfButton` vertical slice funcionando como referencia.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero un componente `AfDialog` adaptativo, accesible y token-driven, para construir confirmaciones, formularios cortos, overlays desktop y sheets mobile sin duplicar comportamiento modal ni estilos base.

## Objetivo

Implementar `AfDialog` como primer componente overlay publico del sistema.

`AfDialog` debe:

- Exponer una API publica unificada.
- Renderizar desktop y mobile de forma adaptativa.
- Usar primitives de accesibilidad para foco y Escape.
- Bloquear el scroll de fondo solo mientras esta abierto.
- Restaurar foco al cerrar cuando sea posible.
- Soportar titulo, descripcion, contenido proyectado y acciones.
- Usar tokens de `@argfit-ui/core`.
- No exponer APIs de PrimeNG, Ionic ni Angular CDK.
- Respetar accesibilidad desde el primer slice.

## Referencias Visuales Obligatorias

Para esta HU SI hacen falta referencias visuales.

Adjuntar al agente al menos:

- Screenshot desktop overlay/modal de formulario.
- Screenshot desktop confirmacion destructiva.
- Screenshot mobile overlay o bottom sheet.
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\overlays.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\overlays.jsx`
- `C:\Users\Ander\Downloads\ArgFit\preview\comp-toasts.html`

Opcionales utiles:

- `C:\Users\Ander\Downloads\ArgFit\preview\comp-badges.html`
- `C:\Users\Ander\Downloads\ArgFit\preview\comp-inputs.html`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\forms.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\forms.jsx`
- `C:\Users\Ander\Downloads\ArgFit\colors_and_type.css`

## Contexto Visual

El dialog ArgFit debe sentirse:

- Enterprise.
- Preciso.
- Oscuro y tecnico en theme dark.
- Integrado con `AfCard`, `AfButton` y `AfInput`.
- Modal y enfocado, sin parecer una pantalla de marketing.
- Compacto en desktop.
- Comodo y tactil en mobile.
- Con backdrop sobrio y no invasivo.

No debe sentirse:

- Como `p-dialog` default.
- Como `ion-modal` default.
- Como alerta nativa del browser.
- Como card flotante decorativa.
- Como overlay sin control de foco.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/dialog.types.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/dialog/`
- `projects/argfit-ui-desktop/src/public-api.ts`

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/dialog/`
- `projects/argfit-ui-mobile/src/public-api.ts`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/dialog/`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- `AfPopover`.
- `AfDropdown`.
- `AfToast`.
- `AfTooltip`.
- `AfDrawer`.
- `AfCommandPalette`.
- Routing modal.
- Dialog stack avanzado.
- Animaciones complejas encadenadas.
- Formularios completos de producto.
- Validacion async.
- API publica de PrimeNG, Ionic o CDK.

Es valido mostrar ejemplos realistas con `AfInput` dentro del dialog, pero no crear flujos de negocio completos.

## API Publica Esperada

Uso basico:

```html
<af-dialog
  [open]="detailsOpen()"
  title="Detalles del atleta"
  description="Resumen rapido de la sesion actual"
  (openChange)="detailsOpen.set($event)"
>
  Contenido del dialog
</af-dialog>
```

Uso con acciones:

```html
<af-dialog
  [open]="removeOpen()"
  title="Eliminar dispositivo"
  tone="danger"
  (openChange)="removeOpen.set($event)"
>
  <p>Esta accion no se puede deshacer.</p>

  <footer afDialogFooter>
    <af-button variant="ghost" (pressed)="removeOpen.set(false)">Cancelar</af-button>
    <af-button variant="danger" (pressed)="confirmRemove()">Eliminar</af-button>
  </footer>
</af-dialog>
```

Uso con formulario corto:

```html
<af-dialog
  [open]="athleteOpen()"
  title="Nuevo atleta"
  description="Carga rapida para iniciar una medicion"
  size="md"
  (openChange)="athleteOpen.set($event)"
>
  <af-input label="Nombre" placeholder="Maria Garcia" />
  <af-input label="Email" type="email" placeholder="atleta@argfit.com" />
</af-dialog>
```

## Inputs Requeridos

El contrato puede ajustarse, pero debe cubrir:

```ts
type AfDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
type AfDialogTone = 'neutral' | 'danger';
type AfDialogMobilePresentation = 'sheet' | 'fullscreen';
```

Inputs sugeridos:

```ts
open = input(false);
title = input<string | undefined>();
description = input<string | undefined>();
size = input<AfDialogSize>('md');
tone = input<AfDialogTone>('neutral');
mobilePresentation = input<AfDialogMobilePresentation>('sheet');
dismissible = input(true);
closeOnBackdrop = input(true);
closeOnEscape = input(true);
ariaLabel = input<string | undefined>();
ariaDescribedBy = input<string | undefined>();
```

Outputs sugeridos:

```ts
openChange = output<boolean>();
opened = output<void>();
closed = output<void>();
backdropPress = output<void>();
escapePress = output<void>();
```

## Slots / Directives

Se pueden crear directives de slots si el patron de `AfCard` lo justifica:

```html
<header afDialogHeader>...</header>
<section afDialogContent>...</section>
<footer afDialogFooter>...</footer>
```

Requisitos:

- Los slots deben ser opcionales.
- Si se provee `title`, el componente debe renderizar un heading accesible.
- Si se proyecta header custom, no duplicar headings innecesariamente.
- El footer debe alinear acciones de forma compacta en desktop y tactil en mobile.

## Accesibilidad

Requisitos:

- Usar `role="dialog"` o `role="alertdialog"` cuando `tone="danger"` y el contenido sea confirmacion critica.
- Usar `aria-modal="true"`.
- Asociar `aria-labelledby` al titulo cuando exista.
- Asociar `aria-describedby` a la descripcion cuando exista.
- Encerrar foco mientras el dialog esta abierto.
- Soportar `afFocusInitial`.
- Restaurar foco al trigger al cerrar cuando sea posible.
- Cerrar con Escape si `closeOnEscape` y `dismissible` son true.
- Cerrar con backdrop si `closeOnBackdrop` y `dismissible` son true.
- No cerrar por backdrop cuando se interactua dentro del panel.
- Mantener una ruta accesible de cierre visible cuando `dismissible` sea true.

## Scroll y Layering

Requisitos:

- Bloquear scroll de fondo solo mientras el dialog esta abierto.
- Restaurar scroll al cerrar, incluso si el dialog se destruye.
- No dejar `body` con `overflow: hidden`, `position: fixed` ni clases residuales al cerrar.
- El overlay debe ocupar el viewport y respetar safe areas en mobile.
- El panel debe tener `max-height` y scroll interno cuando el contenido excede el viewport.
- El z-index debe usar token o constante local documentada.
- Debe convivir con el scroll vertical del showcase.

## Implementacion Desktop

Crear `AfDialogDesktopComponent`.

Requisitos:

- Puede usar Angular CDK internamente si aporta valor, pero no debe exponer API CDK.
- Puede usar PrimeNG internamente si aporta valor visual o de overlay, pero no debe exponer API PrimeNG.
- Si PrimeNG dificulta identidad visual o foco, usar implementacion propia con primitives.
- Debe usar tokens `--af-*`.
- Debe tener OnPush.
- Debe ser standalone.
- Debe soportar contenido proyectado.
- Debe soportar acciones en footer.
- Debe soportar backdrop, Escape y boton de cierre.

Visual desktop esperado:

- Panel centrado.
- Ancho segun size.
- Radius moderado.
- Backdrop azul/negro sobrio.
- Header compacto.
- Footer con acciones alineadas a la derecha.
- Focus ring claro.

## Implementacion Mobile

Crear `AfDialogMobileComponent`.

Requisitos:

- Puede usar Ionic internamente si aporta valor, pero no debe exponer API Ionic.
- Si Ionic introduce estilos default dificiles de controlar, usar implementacion propia con primitives.
- Debe soportar presentacion `sheet` por defecto.
- Debe soportar presentacion `fullscreen` para formularios largos.
- Debe tener touch target comodo.
- Debe usar safe-area insets.
- Debe tener OnPush.
- Debe ser standalone.

Visual mobile esperado:

- Sheet anclado abajo para `mobilePresentation="sheet"`.
- Radius superior amplio, pero alineado al sistema.
- Backdrop sobrio.
- Header con cierre claro.
- Footer sticky o facil de alcanzar cuando el contenido scrollea.
- `fullscreen` ocupa el viewport sin parecer una pagina externa.

## Implementacion Adaptive

Crear `AfDialog` como API publica adaptativa.

Requisitos:

- Selector publico: `af-dialog`.
- Export publico: `AfDialog`.
- Debe delegar a desktop/mobile segun `AfPlatformService`.
- No debe contener logica de negocio.
- Debe pasar inputs/outputs.
- Debe seguir el patron de `AfButton`, `AfCard` y `AfInput`.
- Debe mantener la API estable aunque internamente cambie el motor.

## Showcase

Agregar una seccion sencilla de dialogs al showcase:

- Boton que abre dialog de detalles.
- Boton que abre dialog destructivo.
- Boton que abre dialog con formulario corto usando `AfInput`.
- Ejemplo de footer con `AfButton`.
- Estado visible de la ultima accion/cierre.

Contenido recomendado:

- Detalles de atleta.
- Nuevo test rapido.
- Eliminar dispositivo.

## Tests Requeridos

### Core

- Tipos exportados desde public API.

### Desktop

- Renderiza cuando `open=true`.
- No renderiza panel interactivo cuando `open=false`.
- Renderiza title/description.
- Emite `openChange(false)` al cerrar.
- Cierra con Escape cuando corresponde.
- Cierra con backdrop cuando corresponde.
- No cierra con backdrop si `closeOnBackdrop=false`.
- Mantiene foco dentro del dialog.
- Aplica tone danger.

### Mobile

- Renderiza presentacion sheet por defecto.
- Renderiza presentacion fullscreen cuando se solicita.
- Emite `openChange(false)` al cerrar.
- Cierra con Escape cuando corresponde.
- Respeta safe-area y scroll interno.

### Adaptive

- Renderiza desktop cuando platform es desktop.
- Renderiza mobile cuando platform es mobile.
- Pasa inputs basicos.
- Propaga outputs.

### Showcase

- Compila con `AfDialog`.
- Renderiza botones de ejemplo.
- Abre y cierra al menos un dialog en test.

## Criterios de Aceptacion

1. Existe `AfDialog` publico desde `@argfit-ui/adaptive`.
2. Existen implementaciones desktop y mobile.
3. La API publica no menciona PrimeNG, Ionic ni CDK.
4. Los estilos usan tokens `--af-*`.
5. No hay colores, spacing, shadows o radius hardcodeados salvo fallback estrictamente justificado.
6. `AfDialog` soporta `open`, `openChange`, title, description, size, tone y dismissible.
7. El dialog es accesible con role, aria-modal, labelledby/describedby, focus trap y Escape.
8. El scroll del body se bloquea solo mientras el dialog esta abierto y se restaura al cerrar.
9. El panel scrollea internamente cuando el contenido excede el viewport.
10. El showcase muestra al menos 3 ejemplos.
11. Desktop y mobile se ven distintos cuando corresponde, pero comparten contrato publico.
12. `pnpm guard:architecture` pasa.
13. `pnpm build:all` pasa.
14. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-006-af-dialog.md`.
- [ ] Leer `docs/architecture.md`.
- [ ] Leer `docs/component-philosophy.md`.
- [ ] Revisar `AfButton`, `AfCard` y `AfInput` vertical slices.
- [ ] Revisar `@argfit-ui/primitives`.
- [ ] Revisar referencias visuales de overlays.
- [ ] Crear tipos de dialog en core.
- [ ] Crear `AfDialogDesktopComponent`.
- [ ] Crear `AfDialogMobileComponent`.
- [ ] Crear `AfDialog` adaptativo.
- [ ] Crear slot directives si hacen falta.
- [ ] Implementar foco, Escape, backdrop y scroll lock.
- [ ] Exportar APIs publicas.
- [ ] Agregar ejemplos al showcase.
- [ ] Escribir tests.
- [ ] Verificar visualmente en browser desktop/mobile.
- [ ] Formatear archivos.
- [ ] Ejecutar validaciones.

## Comandos de Validacion

```bash
pnpm guard:architecture
pnpm build:desktop
pnpm build:mobile
pnpm build:adaptive
ng test argfit-ui-desktop --watch=false
ng test argfit-ui-mobile --watch=false
ng test argfit-ui-adaptive --watch=false
ng test showcase --watch=false
pnpm build:all
pnpm test:all
```

## Verificacion Visual

Despues de implementar, abrir el showcase y revisar:

- Desktop: dialog centrado, compacto, foco claro.
- Mobile: sheet inferior usable y fullscreen cuando corresponda.
- Backdrop: sobrio, sin oscurecer de mas el contenido.
- Scroll: fondo bloqueado mientras esta abierto, restaurado al cerrar.
- Contenido largo: panel con scroll interno.
- Escape/backdrop: cierran solo si la config lo permite.
- Theme dark: superficies respetan tokens.
- Theme light si esta habilitado: legibilidad minima aceptable.

Si se usa Browser/Playwright, tomar screenshots en:

```txt
desktop: 1440x900
mobile: 390x844
```

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-006 — AfDialog Vertical Slice.

Contexto obligatorio:
- Lee docs/hus/HU-006-af-dialog.md.
- Lee docs/architecture.md.
- Lee docs/component-philosophy.md.
- Revisa los vertical slices existentes de AfButton, AfCard y AfInput.
- Revisa @argfit-ui/primitives.
- Usa las referencias visuales adjuntas de Claude Design, especialmente desktop overlays.jsx y mobile overlays.jsx.

Objetivo:
Crear AfDialog como componente adaptativo completo: core types, desktop implementation, mobile implementation, adaptive public API, accesibilidad modal, scroll lock y ejemplos en showcase.

Alcance:
- projects/argfit-ui-core/src/lib/types/dialog.types.ts
- projects/argfit-ui-desktop/src/lib/components/dialog/
- projects/argfit-ui-mobile/src/lib/components/dialog/
- projects/argfit-ui-adaptive/src/lib/components/dialog/
- public-api.ts de cada paquete afectado
- projects/showcase/src/app/

No implementes AfPopover, AfDropdown, AfToast, AfTooltip, AfDrawer ni flujos completos de producto. No expongas APIs de PrimeNG/Ionic/CDK. Usa tokens --af-*.

Definition of Done:
- AfDialog existe desde @argfit-ui/adaptive.
- Desktop/mobile/adaptive compilan.
- open/openChange funciona.
- title, description, size, tone, dismissible, closeOnBackdrop y closeOnEscape estan soportados.
- El dialog tiene role/aria-modal, focus trap, Escape, backdrop y restauracion de foco.
- El scroll de fondo se restaura correctamente al cerrar.
- Showcase muestra detalles, confirmacion destructiva y formulario corto.
- pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

Esta HU convierte el sistema en una base real para flujos enterprise: confirmaciones, formularios cortos y acciones criticas. Despues de `AfDialog`, las siguientes HUs naturales son `AfBadge`, `AfSelect`/`AfTextarea`, `AfToast` o `AfPageShell`.
