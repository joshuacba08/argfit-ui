# HU-005 — AfInput Vertical Slice

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
- `AfButton` vertical slice funcionando como referencia.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero un componente `AfInput` adaptativo, accesible y compatible con Angular Forms, para construir filtros, formularios desktop, formularios mobile y configuraciones enterprise sin duplicar estilos ni comportamiento.

## Objetivo

Implementar `AfInput` como segundo componente visual base despues de `AfCard`.

`AfInput` debe:

- Exponer una API publica unificada.
- Renderizar desktop y mobile de forma adaptativa.
- Integrarse con Angular Forms mediante `ControlValueAccessor`.
- Soportar label, placeholder, hint, error, disabled, required y estados visuales.
- Usar tokens de `@argfit-ui/core`.
- No exponer APIs de PrimeNG ni Ionic.
- Respetar accesibilidad desde el primer slice.

## Referencias Visuales Obligatorias

Para esta HU SI hacen falta referencias visuales.

Adjuntar al agente al menos:

- Screenshot mobile form `Nuevo atleta`.
- Screenshot desktop modal `Nuevo test rapido`.
- Screenshot desktop tabla avanzada, por filtros/search inputs.
- `C:\Users\Ander\Downloads\ArgFit\preview\comp-inputs.html`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\forms.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\forms.jsx`

Opcionales utiles:

- `C:\Users\Ander\Downloads\ArgFit\preview\comp-toggles.html`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\overlays.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\advanced-table.jsx`
- `C:\Users\Ander\Downloads\ArgFit\colors_and_type.css`

## Contexto Visual

El input ArgFit debe sentirse:

- Tecnico.
- Preciso.
- Compacto en desktop.
- Tactil y comodo en mobile.
- Integrado con superficies `AfCard`.
- Con borde azul sutil.
- Con focus claro y accesible.
- Con errores visibles sin saturar la UI.

No debe sentirse:

- Como input HTML default.
- Como PrimeNG default.
- Como Ionic default.
- Como un form control generico sin identidad ArgFit.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/input.types.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/input/`
- `projects/argfit-ui-desktop/src/public-api.ts`

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/input/`
- `projects/argfit-ui-mobile/src/public-api.ts`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/input/`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- `AfTextarea`.
- `AfSelect`.
- `AfCheckbox`.
- `AfRadio`.
- `AfToggle`.
- Date pickers.
- Masks avanzadas.
- Async validation.
- Form layouts completos.
- Nuevo atleta como pantalla completa.
- Dialog/modal de formularios.

Es valido mostrar ejemplos realistas de formulario usando `AfInput`, pero no crear componentes publicos extra.

## API Publica Esperada

Uso basico:

```html
<af-input label="Nombre completo" placeholder="Maria Garcia" />
```

Uso con Angular Forms:

```html
<af-input
  label="Email"
  type="email"
  placeholder="coach@argfit.com"
  [formControl]="emailControl"
  hint="Usaremos este email para reportes"
/>
```

Uso con error:

```html
<af-input label="Peso" type="number" suffix="kg" [required]="true" error="Ingresá un peso válido" />
```

Uso con icon/prefix:

```html
<af-input label="Buscar" placeholder="Buscar atleta o equipo..." prefixIcon="search" />
```

## Inputs Requeridos

El contrato puede ajustarse, pero debe cubrir:

```ts
type AfInputSize = 'sm' | 'md' | 'lg';
type AfInputTone = 'neutral' | 'success' | 'warning' | 'danger';
type AfInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
```

Inputs sugeridos:

```ts
label = input<string | undefined>();
placeholder = input<string | undefined>();
hint = input<string | undefined>();
error = input<string | undefined>();
type = input<AfInputType>('text');
size = input<AfInputSize>('md');
tone = input<AfInputTone>('neutral');
required = input(false);
disabled = input(false);
readonly = input(false);
prefix = input<string | undefined>();
suffix = input<string | undefined>();
prefixIcon = input<string | undefined>();
autocomplete = input<string | undefined>();
name = input<string | undefined>();
```

Outputs sugeridos:

```ts
valueChange = output<string>();
focusChange = output<boolean>();
```

## Angular Forms

`AfInput` debe implementar `ControlValueAccessor`.

Requisitos:

- Funciona con `[(ngModel)]` si FormsModule esta disponible en consumidor.
- Funciona con `formControl`.
- `disabled` se sincroniza con `setDisabledState`.
- No usa `any`.
- Emite cambios solo cuando corresponde.
- Marca touched en blur.

## Accesibilidad

Requisitos:

- `label` asociado al control.
- `aria-describedby` para hint/error.
- `aria-invalid` cuando hay error.
- `aria-required` cuando required.
- `disabled` y `readonly` reflejados en el input nativo.
- Focus visible usando tokens.
- Error visible y programaticamente asociado.

Si no hay label visible, debe existir mecanismo para nombre accesible futuro. En esta HU se puede exigir label para ejemplos y tests.

## Implementacion Desktop

Crear `AfInputDesktopComponent`.

Requisitos:

- Puede usar PrimeNG internamente si aporta valor, pero no debe exponer API PrimeNG.
- Si PrimeNG dificulta identidad visual, usar input nativo estilizado.
- Debe usar tokens `--af-*`.
- Debe soportar prefix/suffix.
- Debe soportar error/hint.
- Debe tener OnPush.
- Debe ser standalone.
- Debe ser compatible con Angular Forms.

Visual desktop esperado:

- Altura compacta.
- Label arriba, no floating por defecto.
- Border `rgba(37,153,213,0.15)` o token equivalente.
- Focus con primary y focus ring suave.
- Error con danger.
- Padding horizontal 12–14px.

## Implementacion Mobile

Crear `AfInputMobileComponent`.

Requisitos:

- Puede usar Ionic internamente si aporta valor, pero no debe exponer API Ionic.
- Si Ionic introduce estilos default dificiles de controlar, usar input nativo estilizado.
- Debe tener mayor touch target que desktop.
- Debe soportar label estilo floating o raised, inspirado en referencias mobile.
- Debe soportar prefix/suffix.
- Debe soportar error/hint.
- Debe tener OnPush.
- Debe ser standalone.
- Debe ser compatible con Angular Forms.

Visual mobile esperado:

- Full-width friendly.
- Radius 12px.
- Padding vertical comodo.
- Label raised/floating cuando hay foco o valor.
- Focus claro con primary.
- Error bajo el campo.

## Implementacion Adaptive

Crear `AfInput` como API publica adaptativa.

Requisitos:

- Selector publico: `af-input`.
- Export publico: `AfInput`.
- Debe delegar a desktop/mobile segun `AfPlatformService`.
- No debe contener logica de negocio.
- Debe pasar inputs/outputs.
- Debe integrarse con ControlValueAccessor sin duplicar estado de forma fragil.
- Debe seguir el patron de `AfButton` y `AfCard`.

Nota tecnica: si CVA en adaptive complica demasiado el forwarding, se puede implementar CVA en `AfInput` adaptive y pasar `value`/callbacks a las implementaciones internas como inputs/outputs controlados.

## Showcase

Agregar una seccion sencilla de inputs al showcase:

- Basic input.
- Search input.
- Number input con suffix.
- Disabled input.
- Error input.
- Input conectado a un `FormControl` con preview del valor.

Contenido recomendado:

- Nombre del atleta.
- Buscar atleta o equipo.
- Peso (kg).
- Altura (cm).
- Email.
- ID de dispositivo.

## Tests Requeridos

### Core

- Tipos exportados desde public API.

### Desktop

- Renderiza label y placeholder.
- Emite cambios de valor.
- Aplica error/hint.
- Refleja disabled/readonly.
- CVA escribe valor y marca touched en blur.

### Mobile

- Renderiza label y placeholder.
- Emite cambios de valor.
- Aplica error/hint.
- Refleja disabled/readonly.
- CVA escribe valor y marca touched en blur.

### Adaptive

- Renderiza desktop cuando platform es desktop.
- Renderiza mobile cuando platform es mobile.
- Pasa inputs basicos.
- Funciona con `FormControl`.
- Propaga value changes.

### Showcase

- Compila con `AfInput`.
- Renderiza ejemplos principales.

## Criterios de Aceptacion

1. Existe `AfInput` publico desde `@argfit-ui/adaptive`.
2. Existen implementaciones desktop y mobile.
3. La API publica no menciona PrimeNG ni Ionic.
4. Los estilos usan tokens `--af-*`.
5. No hay colores, spacing, shadows o radius hardcodeados salvo fallback estrictamente justificado.
6. `AfInput` soporta Angular Forms via ControlValueAccessor.
7. `AfInput` soporta label, placeholder, hint, error, type, size, tone, required, disabled, readonly, prefix y suffix.
8. El input es accesible con label/aria-describedby/aria-invalid.
9. El showcase muestra al menos 6 ejemplos.
10. Desktop y mobile se ven distintos cuando corresponde, pero comparten contrato publico.
11. `pnpm guard:architecture` pasa.
12. `pnpm build:all` pasa.
13. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-005-af-input.md`.
- [ ] Leer `docs/architecture.md`.
- [ ] Leer `docs/component-philosophy.md`.
- [ ] Revisar `AfButton` y `AfCard` vertical slices.
- [ ] Revisar referencias visuales de inputs/forms.
- [ ] Crear tipos de input en core.
- [ ] Crear `AfInputDesktopComponent`.
- [ ] Crear `AfInputMobileComponent`.
- [ ] Crear `AfInput` adaptativo.
- [ ] Implementar ControlValueAccessor.
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

- Desktop: labels compactos, inputs densos, focus claro.
- Mobile: labels raised/floating, touch target comodo, texto sin overflow.
- Error: borde y mensaje danger.
- Disabled: contraste bajo pero legible.
- FormControl: el valor se actualiza en pantalla.
- Theme dark: superficies y campos respetan tokens.
- Theme light si esta habilitado: legibilidad minima aceptable.

Si se usa Browser/Playwright, tomar screenshots en:

```txt
desktop: 1440x900
mobile: 390x844
```

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-005 — AfInput Vertical Slice.

Contexto obligatorio:
- Lee docs/hus/HU-005-af-input.md.
- Lee docs/architecture.md.
- Lee docs/component-philosophy.md.
- Revisa los vertical slices existentes de AfButton y AfCard.
- Usa las referencias visuales adjuntas de Claude Design, especialmente comp-inputs.html, desktop forms.jsx y mobile forms.jsx.

Objetivo:
Crear AfInput como componente adaptativo completo: core types, desktop implementation, mobile implementation, adaptive public API, ControlValueAccessor y ejemplos en showcase.

Alcance:
- projects/argfit-ui-core/src/lib/types/input.types.ts
- projects/argfit-ui-desktop/src/lib/components/input/
- projects/argfit-ui-mobile/src/lib/components/input/
- projects/argfit-ui-adaptive/src/lib/components/input/
- public-api.ts de cada paquete afectado
- projects/showcase/src/app/

No implementes AfTextarea, AfSelect, AfCheckbox, AfRadio, AfToggle, dialogs ni layouts completos. No expongas APIs de PrimeNG/Ionic. Usa tokens --af-*.

Definition of Done:
- AfInput existe desde @argfit-ui/adaptive.
- Desktop/mobile/adaptive compilan.
- ControlValueAccessor funciona con FormControl.
- label, placeholder, hint, error, disabled, readonly, prefix y suffix estan soportados.
- Showcase muestra basic, search, number+suffix, disabled, error y FormControl examples.
- pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

Esta HU desbloquea el primer sistema real de formularios. Despues de `AfInput`, las siguientes HUs naturales son `AfTextarea`/`AfSelect`, `AfBadge`, o `AfDialog` usando `AfCard`, `AfInput`, `AfButton` y las primitives de accesibilidad.
