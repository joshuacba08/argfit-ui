# HU-030 - Beta+ Form Field And Input Components

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion

## Dependencias

Esta HU depende de:

- HU-027 - Beta+ Scope And Component Strategy.
- HU-013 - AfFormControls Expansion Slice.
- HU-021 - Beta Accessibility And Keyboard Audit.

## Decision De Producto

Beta+ debe tener una base de formularios mucho mas amplia que beta. Esta HU cubre la familia de inputs, field wrappers y controles de captura directa.

La meta no es exponer PrimeNG uno a uno. La meta es que un consumidor pueda construir formularios avanzados con API ArgFit, usando PrimeNG en desktop, Ionic en mobile y wrappers custom cuando el equivalente mobile no exista o no sea suficientemente bueno.

## Historia De Usuario

Como desarrollador de interfaces avanzadas, quiero inputs ricos, mascaras, fechas, OTP, editor y contador numerico con unidad, para construir formularios reales sin importar PrimeNG o Ionic directamente.

## Componentes Incluidos

### Stable-For-Beta+

- `AfInput`
- `AfTextarea`
- `AfPassword`
- `AfInputNumber`
- `AfInputCount`
- `AfInputMask`
- `AfInputOtp`
- `AfDatePicker`
- `AfIconField`
- `AfInputGroup`
- `AfField`

### Experimental-In-Beta+

- `AfAutoComplete`
- `AfColorPicker`
- `AfEditor`
- `AfKnob`
- `AfKeyFilter`

### Label And Field Variations

- `AfFloatLabel`
- `AfIftaLabel`

Estas variaciones pueden implementarse como componentes, directivas o modos de `AfField`, siempre que el API final quede documentado.

## Referencia Visual Obligatoria: Input Count

`AfInputCount` debe cubrir el patron visto en el design system:

- label: `Edad`, `Peso`, `Altura`;
- decrement button a la izquierda;
- valor fuerte centrado;
- unidad inline: `años`, `kg`, `cm`;
- increment button a la derecha;
- borde azul oscuro, fondo oscuro y estados claros de foco/disabled/error.

## Engines Recomendados

| ArgFit API | Desktop | Mobile |
| --- | --- | --- |
| `AfInputNumber` | PrimeNG `InputNumber` | Ionic `ion-input` type number + ArgFit formatting |
| `AfInputCount` | PrimeNG `Button`/`InputGroup` or custom tokenized wrapper | Ionic `ion-button` + custom touch-first wrapper |
| `AfInputMask` | PrimeNG `InputMask` | Custom mask directive or lightweight internal formatter |
| `AfInputOtp` | PrimeNG `InputOtp` | Custom segmented inputs |
| `AfDatePicker` | PrimeNG `DatePicker` | Ionic `ion-datetime`, `ion-datetime-button`, `ion-popover` |
| `AfAutoComplete` | PrimeNG `AutoComplete` | `ion-searchbar` + modal/list pattern |
| `AfColorPicker` | PrimeNG `ColorPicker` | Custom swatches + native color input fallback |
| `AfEditor` | PrimeNG `Editor`/Quill | Textarea-first rich editor fallback, experimental |
| `AfKnob` | PrimeNG `Knob` | Custom SVG/range hybrid |
| `AfIconField` | PrimeNG `IconField` | ArgFit field composition |
| `AfInputGroup` | PrimeNG `InputGroup` | ArgFit field composition |

## Requisitos Transversales

- Todos los componentes deben ser standalone y OnPush.
- Todos los controles de valor deben soportar `ControlValueAccessor` cuando aplique.
- Todos deben funcionar con `ReactiveFormsModule`.
- Los formatos y eventos publicos deben ser ArgFit-owned.
- Ningun tipo de PrimeNG, Ionic o Quill debe filtrarse por `@argfit-ui/adaptive`.
- Mobile debe evitar overlays desktop reducidos.
- Los estados `disabled`, `readonly`, `invalid`, `required`, `helperText` y `errorText` deben ser coherentes.

## API Minima Para `AfInputCount`

Inputs:

- `label`
- `value`
- `unit`
- `min`
- `max`
- `step`
- `precision`
- `helperText`
- `errorText`
- `disabled`
- `readonly`
- `required`
- `allowManualInput`
- `size`: `sm | md | lg`
- `density`: `compact | comfortable`

Outputs:

- `valueChange`
- `increment`
- `decrement`

Teclado:

- `ArrowUp` incrementa.
- `ArrowDown` decrementa.
- `Home` usa `min` cuando existe.
- `End` usa `max` cuando existe.

## Paths Esperados

- `projects/argfit-ui-core/src/lib/types/form-field.types.ts`
- `projects/argfit-ui-core/src/lib/types/input-count.types.ts`
- `projects/argfit-ui-core/src/lib/types/date-picker.types.ts`
- `projects/argfit-ui-core/src/lib/types/autocomplete.types.ts`
- `projects/argfit-ui-desktop/src/lib/components/*`
- `projects/argfit-ui-mobile/src/lib/components/*`
- `projects/argfit-ui-adaptive/src/lib/components/*`
- public APIs de core, desktop, mobile y adaptive
- `projects/showcase/src/app/*`
- docs Beta+

## Showcase Esperado

Agregar seccion de Forms Beta+ con:

- `AfInputCount`: edad, peso y altura.
- `AfDatePicker`: fecha de sesion.
- `AfInputMask`: documento, telefono o codigo de atleta.
- `AfInputOtp`: codigo de vinculacion de dispositivo.
- `AfAutoComplete`: busqueda de atleta.
- `AfColorPicker`: color de equipo o categoria.
- `AfEditor`: notas de rutina, marcado como experimental.
- estados disabled, error, helper y readonly.

## Criterios De Aceptacion

1. Existen exports adaptive para todos los componentes stable-for-Beta+ incluidos.
2. Los componentes experimental-in-Beta+ existen o quedan documentados como opt-in si se decide entregarlos en una segunda PR de la HU.
3. `AfInputCount` cumple el patron visual de edad/peso/altura.
4. Los controles de valor funcionan con reactive forms.
5. No hay fugas de tipos PrimeNG/Ionic/Quill en adaptive.
6. Tests cubren CVA, estados, formato, accesibilidad basica y eventos criticos.
7. Showcase cubre dark/light, desktop/mobile y estados principales.
8. `pnpm guard:architecture` pasa.
9. `pnpm test:all` pasa.

## Comandos De Validacion

```bash
pnpm guard:architecture
pnpm test:all
pnpm build:all
```

## Prompt Para Implementacion

Implementa HU-030 - Beta+ Form Field And Input Components.

Primero revisa los patrones existentes de `AfInput`, `AfTextarea`, `AfPassword`, `AfSelect` y `AfToggle`. Luego implementa la familia de inputs Beta+ priorizando `AfInputCount`, `AfInputNumber`, `AfInputMask`, `AfInputOtp`, `AfDatePicker`, `AfIconField`, `AfInputGroup` y `AfField`. Mantiene API vendor-independent y documenta cualquier componente que quede experimental.
