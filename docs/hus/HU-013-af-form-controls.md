# HU-013 — AfFormControls Expansion Slice

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
- HU-008 — AfBadge vertical slice.
- HU-009 — AfPageShell navigation slice.

## Decision de Producto

ArgFit UI ya tiene `AfInput`, pero los flujos reales de registro de atletas, configuracion de tests, ajustes de dispositivos y exportacion necesitan controles adicionales: select, textarea, toggle, checkbox, radio y segmented control.

Esta HU debe crear un set pequeno y coherente de controles de formulario. No busca cubrir todos los casos de formularios enterprise; busca desbloquear pantallas como las que aparecen en Claude Design sin copiar estilos inline ni filtrar APIs de PrimeNG/Ionic.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero controles de formulario adaptativos y compatibles con Angular Forms, para construir formularios de atleta, test, exportacion y settings de forma consistente en desktop y mobile.

## Objetivo

Crear el slice de expansion de formularios:

- `AfSelect`.
- `AfTextarea`.
- `AfToggle`.
- `AfCheckbox`.
- `AfRadioGroup`.
- `AfSegmentedControl`.
- Tipos publicos compartidos.
- Implementaciones desktop/mobile.
- API adaptativa publica.
- Compatibilidad con `ControlValueAccessor`.
- Showcase con formularios reales.
- Tests por capa.

## Referencias del Design System

Todos los archivos de Claude Design estan disponibles localmente en `docs/claude-design`.

Referencias obligatorias:

- `docs/claude-design/README.md`
- `docs/claude-design/SKILL.md`
- `docs/claude-design/colors_and_type.css`
- `docs/claude-design/preview/comp-inputs.html`
- `docs/claude-design/preview/comp-toggles.html`
- `docs/claude-design/ui_kits/desktop/forms.jsx`
- `docs/claude-design/ui_kits/desktop/screens.jsx`
- `docs/claude-design/ui_kits/mobile/forms.jsx`
- `docs/claude-design/ui_kits/mobile/screens.jsx`

Referencias opcionales utiles:

- `docs/claude-design/ui_kits/desktop/overlays.jsx`
- `docs/claude-design/ui_kits/mobile/overlays.jsx`

## Screenshots Que Debe Adjuntar El Agente

Adjuntar al agente:

- Screenshot desktop de `FormsScreen` tab `Nuevo atleta`.
- Screenshot desktop de `FormsScreen` tab `Configuracion de test`.
- Screenshot desktop de `FormsScreen` tab `Exportacion`.
- Screenshot mobile de menu `Formularios`.
- Screenshot mobile de `Nuevo atleta`.
- Screenshot mobile de `Config. de test`.
- Screenshot mobile de `Exportar datos`.
- Screenshot de `comp-toggles.html` para toggle/radio/checkbox/segment.

Si no hay screenshots, usar `docs/claude-design/ui_kits/desktop/forms.jsx`, `docs/claude-design/ui_kits/mobile/forms.jsx` y `docs/claude-design/preview/comp-toggles.html` como referencia principal.

## Validacion de Diseno

La implementacion debe respetar:

- Inputs y selects desktop con label superior pequeno, borde 1.5px, radio 8px.
- Mobile con campos tipo floating label y radio 12px.
- Toggle de 44x24 con knob de 18px.
- Checkbox de 18-20px, radio de 18-20px.
- Segmented control con surface, padding 3px y active primary.
- Mensajes de error compactos debajo del control.
- Touch targets mobile razonables sin agrandar demasiado el layout.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/form-control.types.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/select/*`
- `projects/argfit-ui-desktop/src/lib/components/textarea/*`
- `projects/argfit-ui-desktop/src/lib/components/toggle/*`
- `projects/argfit-ui-desktop/src/lib/components/checkbox/*`
- `projects/argfit-ui-desktop/src/lib/components/radio-group/*`
- `projects/argfit-ui-desktop/src/lib/components/segmented-control/*`
- `projects/argfit-ui-desktop/src/public-api.ts`

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/select/*`
- `projects/argfit-ui-mobile/src/lib/components/textarea/*`
- `projects/argfit-ui-mobile/src/lib/components/toggle/*`
- `projects/argfit-ui-mobile/src/lib/components/checkbox/*`
- `projects/argfit-ui-mobile/src/lib/components/radio-group/*`
- `projects/argfit-ui-mobile/src/lib/components/segmented-control/*`
- `projects/argfit-ui-mobile/src/public-api.ts`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/select/*`
- `projects/argfit-ui-adaptive/src/lib/components/textarea/*`
- `projects/argfit-ui-adaptive/src/lib/components/toggle/*`
- `projects/argfit-ui-adaptive/src/lib/components/checkbox/*`
- `projects/argfit-ui-adaptive/src/lib/components/radio-group/*`
- `projects/argfit-ui-adaptive/src/lib/components/segmented-control/*`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- Date picker.
- File upload.
- Chips input.
- Slider/stepper.
- Autocomplete remoto.
- Validacion schema-driven.
- Form builder.
- Wizard/multi-step form component.
- Persistencia de formularios.
- Dropdown overlay custom complejo para `AfSelect`; usar select nativo o vendor interno simple si alcanza.

## API Publica Esperada

Opciones compartidas:

```ts
interface AfFormOption<TValue = string> {
  readonly value: TValue;
  readonly label: string;
  readonly disabled?: boolean;
  readonly hint?: string;
}

type AfControlSize = 'sm' | 'md' | 'lg';
type AfValidationState = 'default' | 'error' | 'success';
```

Select:

```html
<af-select label="Tipo de test" [options]="testOptions" formControlName="testType" />
```

Textarea:

```html
<af-textarea label="Observaciones" [maxLength]="500" formControlName="notes" />
```

Toggle:

```html
<af-toggle label="Auto-conectar BLE" description="Conectar al abrir" formControlName="bleAuto" />
```

Checkbox:

```html
<af-checkbox label="CSV" formControlName="exportCsv" />
```

Radio group:

```html
<af-radio-group label="Lateralidad" [options]="lateralityOptions" formControlName="laterality" />
```

Segmented control:

```html
<af-segmented-control [options]="testOptions" formControlName="testType" />
```

Requisitos comunes:

- Todos los controles deben ser standalone y OnPush.
- Todos deben soportar disabled.
- Todos deben integrarse con Angular Forms via CVA.
- Todos deben exponer label/hint/error cuando aplique.
- Todos deben usar tokens `--af-*`.
- Todos deben mantener API vendor-independent.

## Implementacion Desktop

Requisitos:

- Select y textarea siguen el patron visual de `AfInput`.
- Toggle/checkbox/radio pueden ser controles nativos estilizados.
- Segment control debe usar botones con `role="tablist"` o `radiogroup` segun decision de accesibilidad.
- Labels compactos, errores debajo.
- Soportar grids de formularios densos.

## Implementacion Mobile

Requisitos:

- Select y textarea usan estilo mobile de Claude Design.
- Toggle funciona como row si hay description.
- Radio/checkbox list deben poder apilar opciones.
- Segment control apto para 3-4 opciones.
- Touch target minimo razonable.

## Showcase

Agregar ejemplos:

- Formulario `Nuevo atleta`.
- Formulario `Configuracion de test`.
- Formulario `Exportacion`.
- Uso con `FormControl`/`FormGroup`.
- Estados disabled/error/success.
- Desktop y mobile via `AfPageShell`.

## Tests Requeridos

- Core exporta tipos.
- Cada control desktop renderiza label/value/disabled/error.
- Cada control mobile renderiza label/value/disabled/error.
- Cada adaptativo delega desktop/mobile.
- CVA: `writeValue`, `registerOnChange`, touched y disabled funcionan.
- Showcase compila y muestra al menos un ejemplo de cada control.

## Criterios de Aceptacion

1. Existen `AfSelect`, `AfTextarea`, `AfToggle`, `AfCheckbox`, `AfRadioGroup` y `AfSegmentedControl` publicos desde `@argfit-ui/adaptive`.
2. Existen implementaciones desktop y mobile.
3. Existe contrato tipado en `@argfit-ui/core`.
4. Todos soportan Angular Forms.
5. Ningun control expone PrimeNG/Ionic.
6. Todos usan tokens `--af-*`.
7. Showcase muestra formularios reales.
8. `pnpm guard:architecture` pasa.
9. `pnpm build:all` pasa.
10. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-013-af-form-controls.md`.
- [ ] Leer `docs/claude-design/ui_kits/desktop/forms.jsx`.
- [ ] Leer `docs/claude-design/ui_kits/mobile/forms.jsx`.
- [ ] Leer `docs/claude-design/preview/comp-toggles.html`.
- [ ] Revisar `AfInput`.
- [ ] Crear tipos core.
- [ ] Implementar controles desktop.
- [ ] Implementar controles mobile.
- [ ] Implementar adaptativos.
- [ ] Agregar CVA y tests.
- [ ] Agregar showcase.
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

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-013 — AfFormControls Expansion Slice.

Lee docs/hus/HU-013-af-form-controls.md, docs/architecture.md, docs/component-philosophy.md y docs/design-system.md.
Usa docs/claude-design/ui_kits/desktop/forms.jsx, docs/claude-design/ui_kits/mobile/forms.jsx y docs/claude-design/preview/comp-toggles.html.

Objetivo:
Crear AfSelect, AfTextarea, AfToggle, AfCheckbox, AfRadioGroup y AfSegmentedControl con API adaptativa, CVA y estilos token-driven.

Definition of Done:
Tipos core, implementaciones desktop/mobile/adaptive, CVA, showcase con formularios reales, tests por capa, pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

HU-013 transforma `AfInput` en un sistema de formularios util para producto. Desbloquea registro de atletas, configuracion de tests, settings y exportacion sin esperar un form builder completo.
