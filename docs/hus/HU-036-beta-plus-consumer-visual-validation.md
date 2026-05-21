# HU-036 - Beta+ Consumer And Visual Validation

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion / Fase 9 - Tooling

## Dependencias

Esta HU depende de:

- HU-035 - Beta+ Showcase And Documentation.
- HU-022 - Beta Visual Regression And Responsive QA.
- HU-023 - Beta Consumer Compatibility Matrix.

## Objetivo

Expandir validaciones:

- Consumer smoke Beta+.
- Visual QA Beta+.
- Accessibility checks for new components.
- Vendor leakage checks for new APIs.

## Requisitos

- Consumer app imports representative Beta+ components from every family: overlays, form inputs, selection controls, data components, panel/layout, status/identity and `AfKanban`.
- Visual QA captures overlay open states.
- Mobile visual QA proves touch-first behavior.
- Visual QA captures `AfInputCount`, `AfMultiSelect`, `AfDatePicker` and `AfTreeSelect` dark/light states.
- Visual QA captures `AfDataView`, `AfTimeline`, `AfTree`, `AfTabs`, `AfStepper` and `AfSplitter`.
- Visual QA captures kanban desktop, mobile and active drop states.
- CI runs the Beta+ validation command or documents why it is manual temporarily.

## Criterios De Aceptacion

1. `pnpm beta-plus:consumer-smoke` exists and passes.
2. `pnpm visual:beta-plus` exists and passes or has documented baseline flow.
3. Accessibility audit covers new components.
4. No adaptive public API leaks PrimeNG/Ionic types.
5. `pnpm test:all` passes.

## Comandos De Validacion

```bash
pnpm beta-plus:consumer-smoke
pnpm visual:beta-plus
pnpm test:all
```
