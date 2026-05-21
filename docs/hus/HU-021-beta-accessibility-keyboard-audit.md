# HU-021 - Beta Accessibility And Keyboard Audit

## Estado

Implemented

## Fase Del Roadmap

Fase 11 - Beta Hardening

## Dependencias

Esta HU depende de:

- HU-019 - Beta Scope And Public API Contract.
- HU-020 - Beta Experimental Components Hardening, si se promueven componentes experimentales.

## Decision De Producto

Beta necesita una promesa minima de accesibilidad. No alcanza con que algunos componentes tengan ARIA o focus states: debe existir una auditoria transversal y reproducible.

## Historia De Usuario

Como consumidor beta que construye dashboards y formularios enterprise, quiero componentes navegables por teclado y comprensibles para tecnologias asistivas, para poder adoptar ArgFit UI sin crear deuda de accesibilidad.

## Objetivo

Crear el gate de accesibilidad beta:

- Matriz de accesibilidad por componente.
- Tests de teclado para componentes interactivos.
- Auditoria automatizada donde sea practico.
- Documentacion de patrones ARIA.
- Cierre de bugs encontrados.

## Alcance Incluido

Paths esperados:

- `docs/beta/accessibility.md`
- `projects/argfit-ui-*/src/lib/components/**/*.spec.ts`
- `projects/argfit-ui-primitives/src/lib/**/*.spec.ts`
- `projects/showcase/src/app/app.spec.ts`
- `tools/` si se agrega un script de auditoria.
- `package.json` si se agrega un comando de validacion.

## Componentes Minimos A Auditar

- `AfButton`
- `AfInput`
- `AfDialog`
- `AfDataTable` si entra en beta
- `AfPageShell`
- `AfSelect`
- `AfTextarea`
- `AfToggle`
- `AfCheckbox`
- `AfRadioGroup`
- `AfSegmentedControl`
- `AfPassword`
- `AfToastViewport`, `AfToast`, `AfInlineMessage`

## Requisitos

- Focus visible en todos los controles interactivos.
- Navegacion por teclado documentada.
- `Escape` cierra dialog cuando corresponda.
- Dialog maneja focus trap, focus inicial y retorno de focus.
- Data table expone semantics correctos y `aria-sort`.
- Form controls conectan label, hint y error.
- Toasts e inline messages usan roles o live regions adecuados.
- Iconos decorativos no contaminan el arbol accesible.
- Componentes disabled no son accionables.

## Fuera De Alcance

Esta HU NO debe:

- Redisenar visualmente todos los componentes.
- Implementar soporte completo para lectores de pantalla especificos.
- Resolver WCAG legal completo para una aplicacion final.

## Criterios De Aceptacion

1. Existe `docs/beta/accessibility.md`.
2. Cada componente beta tiene estado de auditoria.
3. Los bugs bloqueantes de teclado estan corregidos.
4. Los componentes de formulario vinculan label/error/hint.
5. Dialog y table tienen tests especificos de teclado.
6. El showcase no introduce errores obvios de landmarks/focus.
7. Existe comando o procedimiento reproducible para auditoria.
8. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer HU-019 y HU-020.
- [ ] Crear matriz de componentes beta.
- [ ] Auditar keyboard path por componente.
- [ ] Agregar o reforzar tests.
- [ ] Documentar roles, labels y focus management.
- [ ] Corregir fallos.
- [ ] Ejecutar validaciones.

## Comandos De Validacion

```bash
pnpm test:all
pnpm build:all
```

## Prompt Recomendado

```txt
Implementa HU-021 - Beta Accessibility And Keyboard Audit.

Objetivo:
Crear una auditoria beta de accesibilidad y cerrar bugs de teclado/ARIA en los componentes que entren al contrato beta.

Definition of Done:
docs/beta/accessibility.md existe, los tests cubren keyboard y ARIA clave, y pnpm test:all pasa.
```

