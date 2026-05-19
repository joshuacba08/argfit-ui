# HU-003 — Accessibility Primitives

## Estado

Ready for implementation

## Fase del Roadmap

Fase 2 — Primitive Foundation

## Dependencias

Esta HU depende de:

- HU-001 — Formalizar tokens del design system.
- HU-002 — Theme runtime y estilos base.
- `@argfit-ui/primitives` creado y exportando `AfVisuallyHiddenComponent`.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero contar con primitives de accesibilidad y foco reutilizables, para que componentes futuros como dialogs, popovers, dropdowns, sidebars y mobile sheets no reimplementen comportamiento accesible de forma inconsistente.

## Objetivo

Expandir `@argfit-ui/primitives` con primitives headless, vendor-agnostic y reutilizables.

La HU debe dejar una base para:

- Ocultar contenido visualmente sin ocultarlo a screen readers.
- Encerrar foco dentro de superficies modales o flotantes.
- Definir foco inicial.
- Emitir eventos de Escape sin acoplarse a logica de negocio.
- Preparar componentes futuros sin depender de PrimeNG/Ionic para comportamiento base.

## Contexto Arquitectonico

`argfit-ui-primitives` vive entre `core` y las implementaciones:

```txt
core -> primitives -> desktop/mobile -> adaptive -> showcase
```

Primitives puede depender de `@argfit-ui/core` y de APIs oficiales de Angular. No puede depender de PrimeNG, Ionic, desktop, mobile ni adaptive.

Esta HU no debe crear componentes visuales. Debe crear piezas pequeñas que luego usaran `AfDialog`, `AfInput`, `AfPageShell`, `AfSidebar`, `AfDropdown`, `AfModalMobile` y otros componentes.

## Sobre Screenshots

No hacen falta screenshots para esta HU.

Los prints de pantalla de Claude Design empiezan a ser necesarios en la HU-004, cuando se implemente el primer componente visual de superficie, probablemente `AfCard`.

## Alcance Incluido

Paths esperados:

- `projects/argfit-ui-primitives/src/lib/a11y/`
- `projects/argfit-ui-primitives/src/lib/focus/`
- `projects/argfit-ui-primitives/src/public-api.ts`
- `projects/argfit-ui-primitives/README.md`
- `projects/argfit-ui-primitives/package.json` si se agrega `@angular/cdk` como peer dependency.

Se pueden agregar archivos nuevos dentro de:

```txt
projects/argfit-ui-primitives/src/lib/a11y/
projects/argfit-ui-primitives/src/lib/focus/
projects/argfit-ui-primitives/src/lib/dismiss/
```

## Fuera de Alcance

Esta HU NO debe implementar:

- `AfCard`.
- `AfInput`.
- `AfDialog`.
- `AfPopover`.
- `AfSidebar`.
- `AfPageShell`.
- Estilos visuales de cards, inputs o modals.
- Integracion con PrimeNG.
- Integracion con Ionic.
- Routing o navegacion.
- Showcase visual completo.

## Primitives Requeridos

### 1. AfVisuallyHiddenComponent

Ya existe. Debe mantenerse y seguir exportado.

Requisitos:

- No romper su selector actual `af-visually-hidden`.
- Mantenerlo vendor-agnostic.
- Mantener test de proyeccion de contenido.

### 2. AfFocusTrapDirective

Directive standalone para contener el foco dentro de un host.

Uso esperado:

```html
<section afFocusTrap [afFocusTrapEnabled]="isOpen">...</section>
```

Requisitos:

- No debe cerrar modals ni ejecutar logica de producto.
- Solo administra foco.
- Debe soportar enabled/disabled.
- Debe intentar mover foco al primer elemento enfocable cuando se activa.
- Debe restaurar foco previo al desactivarse si es razonable y no introduce complejidad excesiva.
- Puede usar `@angular/cdk/a11y` internamente si se agrega como peer dependency de `@argfit-ui/primitives`.
- Si usa CDK, la API publica debe seguir siendo `Af*`; no exponer `Cdk*` como contrato publico de ArgFit UI.

### 3. AfFocusInitialDirective

Directive standalone para marcar el elemento que debe recibir foco inicial dentro de un trap o superficie.

Uso esperado:

```html
<button afFocusInitial>Crear test</button>
```

Requisitos:

- No debe tener estilos visuales.
- Debe poder ser consultada por `AfFocusTrapDirective`.
- Si no existe un elemento con `afFocusInitial`, el trap debe usar el primer elemento enfocable disponible.

### 4. AfEscapeKeyDirective

Directive standalone para emitir un evento cuando el usuario presiona Escape.

Uso esperado:

```html
<section afEscapeKey (afEscape)="close()">...</section>
```

Requisitos:

- Debe emitir un output `afEscape`.
- No debe cerrar nada por si misma.
- No debe conocer dialogs, popovers, sheets ni negocio.
- Debe ignorar otras teclas.
- Debe funcionar con host focusable y eventos burbujeados desde hijos.

## Consideraciones Tecnicas

### Enfoque Preferido

Preferir primitives pequeñas y testeables:

- Directives standalone.
- Signals o inputs modernos donde aporten valor.
- `inject()` en lugar de constructor injection.
- Tipado estricto.
- Sin `any`.

### Foco Enfocable

Si se implementa sin CDK, usar una lista conservadora de selectores enfocables:

```txt
a[href]
button:not([disabled])
textarea:not([disabled])
input:not([disabled])
select:not([disabled])
[tabindex]:not([tabindex="-1"])
```

Si se usa CDK, preferir `FocusTrapFactory` o APIs de `@angular/cdk/a11y`.

### SSR Safety

Las directives no deben fallar fuera del browser.

Si acceden a `document`, `HTMLElement`, `focus()` o listeners globales:

- Usar `DOCUMENT`.
- Verificar platform/browser cuando corresponda.
- Evitar side effects durante SSR.

## Public API

`projects/argfit-ui-primitives/src/public-api.ts` debe exportar:

```ts
export * from './lib/a11y/af-visually-hidden.component';
export * from './lib/focus/af-focus-trap.directive';
export * from './lib/focus/af-focus-initial.directive';
export * from './lib/dismiss/af-escape-key.directive';
```

La estructura exacta puede variar, pero los exports publicos deben ser claros y estables.

## Criterios de Aceptacion

1. `AfVisuallyHiddenComponent` sigue funcionando y exportado.
2. Existe `AfFocusTrapDirective`.
3. Existe `AfFocusInitialDirective`.
4. Existe `AfEscapeKeyDirective`.
5. Todas las primitives son standalone.
6. Ninguna primitive importa PrimeNG, Ionic, desktop, mobile o adaptive.
7. Si se usa `@angular/cdk`, queda declarado correctamente como peer dependency de `@argfit-ui/primitives`.
8. El public API exporta todas las primitives.
9. El README de `@argfit-ui/primitives` lista las primitives disponibles.
10. Hay tests unitarios para:
    - proyeccion de `AfVisuallyHiddenComponent`;
    - emision de Escape;
    - foco inicial;
    - activacion basica del focus trap.
11. `pnpm guard:architecture` pasa.
12. `pnpm build:primitives` pasa.
13. `ng test argfit-ui-primitives --watch=false` pasa.
14. `pnpm build:all` y `pnpm test:all` pasan.

## Checklist Tecnica

- [ ] Leer `docs/agent-rules.md`.
- [ ] Leer `docs/architecture.md`.
- [ ] Leer `docs/hus/HU-003-accessibility-primitives.md`.
- [ ] Revisar `projects/argfit-ui-primitives`.
- [ ] Mantener `AfVisuallyHiddenComponent`.
- [ ] Crear `AfFocusInitialDirective`.
- [ ] Crear `AfFocusTrapDirective`.
- [ ] Crear `AfEscapeKeyDirective`.
- [ ] Exportar todo desde `src/public-api.ts`.
- [ ] Actualizar README de primitives.
- [ ] Agregar peer dependency si se usa CDK.
- [ ] Escribir tests unitarios.
- [ ] Formatear archivos.
- [ ] Ejecutar validaciones.

## Comandos de Validacion

```bash
pnpm guard:architecture
pnpm build:primitives
ng test argfit-ui-primitives --watch=false
pnpm build:all
pnpm test:all
```

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-003 — Accessibility Primitives.

Contexto obligatorio:
- Lee docs/hus/HU-003-accessibility-primitives.md.
- Lee docs/agent-rules.md.
- Lee docs/architecture.md.
- Revisa projects/argfit-ui-primitives.

Objetivo:
Expandir @argfit-ui/primitives con primitives headless de accesibilidad: AfFocusTrapDirective, AfFocusInitialDirective y AfEscapeKeyDirective, manteniendo AfVisuallyHiddenComponent.

Alcance:
- projects/argfit-ui-primitives/src/lib/a11y/
- projects/argfit-ui-primitives/src/lib/focus/
- projects/argfit-ui-primitives/src/lib/dismiss/
- projects/argfit-ui-primitives/src/public-api.ts
- projects/argfit-ui-primitives/README.md
- package.json de primitives solo si hace falta declarar @angular/cdk.

No implementes componentes visuales. No uses PrimeNG ni Ionic. No toques desktop/mobile/adaptive salvo que una validacion revele un problema real.

Definition of Done:
- Las primitives son standalone y exportadas.
- Hay tests para visually hidden, focus initial, focus trap y escape.
- pnpm guard:architecture, pnpm build:primitives, ng test argfit-ui-primitives --watch=false, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

Esta HU es invisible para el usuario final, pero evita deuda tecnica en todos los componentes futuros que necesiten modals, popovers, sheets, dropdowns o navegacion por teclado.
