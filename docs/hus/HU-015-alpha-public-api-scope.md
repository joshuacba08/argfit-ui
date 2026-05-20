# HU-015 — Alpha Public API Scope

## Estado

Ready for implementation

## Fase del Roadmap

Fase 5 — Adaptive Layer / Fase 6 — Showcase Platform / Fase 9 — Tooling / Fase 10 — Alpha Distribution

## Dependencias

Esta HU depende de:

- HU-001 a HU-014 completadas o explicitamente marcadas como fuera del alcance alpha.

## Decision de Producto

Antes de publicar una primera version `-alpha`, ArgFit UI necesita declarar que superficie publica entra en el alpha, que APIs quedan experimentales y que partes del roadmap siguen fuera de contrato.

La alpha debe ser usable por un consumidor real, pero no debe prometer estabilidad de version `1.0`. El objetivo es publicar un paquete instalable, documentado y verificable con un contrato claro:

- Que se puede importar.
- Que se puede usar en una app Angular.
- Que no filtra PrimeNG/Ionic en la API publica.
- Que se puede romper en siguientes alphas con changelog.

## Historia de Usuario

Como maintainer de ArgFit UI, quiero definir y auditar el contrato publico de la version alpha, para que la primera distribucion de la libreria sea consumible sin exponer APIs accidentales ni prometer componentes incompletos.

## Objetivo

Crear el scope oficial de `0.1.0-alpha.0`:

- Definir componentes incluidos.
- Definir paquetes publicables.
- Auditar exports publicos.
- Marcar APIs experimentales.
- Documentar componentes fuera de alpha.
- Confirmar contrato vendor-independent.
- Crear un checklist de compatibility minima.

## Alcance Alpha Sugerido

La primera alpha debe incluir, si estan implementados y pasan validacion:

- `@argfit-ui/core`
- `@argfit-ui/primitives`
- `@argfit-ui/desktop`
- `@argfit-ui/mobile`
- `@argfit-ui/adaptive`
- `provideArgfitUi`
- theme runtime dark/light
- platform service
- accessibility primitives
- `AfIcon`
- `AfButton`
- `AfCard`
- `AfInput`
- `AfDialog`
- `AfChart`
- `AfBadge`
- `AfPageShell`
- `AfMetricCard`

Los siguientes componentes pueden quedar fuera o como experimental si no estan completos:

- `AfDataTable`
- `AfAnalyticsCard`
- `AfSelect`
- `AfTextarea`
- `AfToggle`
- `AfCheckbox`
- `AfRadioGroup`
- `AfSegmentedControl`
- `AfToastViewport`
- `AfInlineMessage`

La decision final debe quedar escrita en `docs/alpha/public-api.md`.

## Alcance Incluido

Paths esperados:

- `docs/alpha/public-api.md`
- `docs/alpha/alpha-scope.md`
- `docs/alpha/compatibility.md`
- `projects/argfit-ui-core/src/public-api.ts`
- `projects/argfit-ui-primitives/src/public-api.ts`
- `projects/argfit-ui-desktop/src/public-api.ts`
- `projects/argfit-ui-mobile/src/public-api.ts`
- `projects/argfit-ui-adaptive/src/public-api.ts`
- `README.md`

## Fuera de Alcance

Esta HU NO debe:

- Publicar a npm.
- Cambiar versiones.
- Crear changelog final.
- Implementar componentes faltantes.
- Crear CI.
- Crear smoke app.

## Requisitos

- El scope alpha debe nombrar cada paquete publicable.
- Cada paquete debe tener una lista de exports publicos esperados.
- El documento debe distinguir `stable-for-alpha` y `experimental`.
- No debe haber exports accidentales de componentes internos si no forman parte del contrato.
- No deben exportarse tipos de PrimeNG, Ionic o ECharts desde `@argfit-ui/adaptive`.
- Los aliases publicos deben ser consistentes: `AfButton`, `AfCard`, etc.
- La documentacion debe declarar que la version alpha puede tener breaking changes entre prereleases.

## Tests Requeridos

- `pnpm guard:architecture`.
- `pnpm build:libs`.
- Test o script de audit si se crea.
- Revisión manual de `dist/*/public-api` luego del build.

## Criterios de Aceptacion

1. Existe `docs/alpha/alpha-scope.md`.
2. Existe `docs/alpha/public-api.md`.
3. Existe `docs/alpha/compatibility.md`.
4. README enlaza la documentacion alpha.
5. Cada paquete tiene exports auditados.
6. Los componentes fuera de alpha estan listados como `planned` o `experimental`.
7. No hay vendor leakage en exports publicos.
8. `pnpm guard:architecture` pasa.
9. `pnpm build:libs` pasa.

## Checklist Tecnica

- [ ] Leer todas las HUs 001-014.
- [ ] Revisar public APIs de los cinco paquetes.
- [ ] Revisar `README.md`.
- [ ] Crear `docs/alpha/alpha-scope.md`.
- [ ] Crear `docs/alpha/public-api.md`.
- [ ] Crear `docs/alpha/compatibility.md`.
- [ ] Ajustar exports publicos si hay fugas.
- [ ] Marcar APIs experimentales.
- [ ] Ejecutar validaciones.

## Comandos de Validacion

```bash
pnpm guard:architecture
pnpm build:libs
pnpm test:all
```

## Prompt Recomendado

```txt
Implementa HU-015 — Alpha Public API Scope.

Objetivo:
Definir el contrato publico de 0.1.0-alpha.0, auditar exports de @argfit-ui/core, primitives, desktop, mobile y adaptive, y documentar que entra o no entra en la alpha.

Definition of Done:
docs/alpha/alpha-scope.md, docs/alpha/public-api.md y docs/alpha/compatibility.md existen, README enlaza la documentacion alpha, exports auditados, pnpm guard:architecture y pnpm build:libs pasan.
```

## Nota de Producto

Esta HU evita que la primera alpha sea una captura accidental del estado del repo. Convierte la alpha en un contrato deliberado.
