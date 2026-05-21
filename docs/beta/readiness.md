# ArgFit UI - Beta Readiness Evaluation

Fecha de evaluacion: 2026-05-21.

## Veredicto

La version alpha esta sana como alpha publica: compila, testea, empaqueta y tiene smoke test de consumo. Todavia no deberia llamarse beta.

El salto a beta no necesita "mas componentes por cantidad"; necesita estabilizar contrato, validar consumo real, cerrar deuda visual/accesible y eliminar warnings de release. La beta debe sentirse como un prerelease confiable, no como una demo amplia.

## Evidencia Actual

- Version actual: `0.1.0-alpha.0`.
- Paquetes publishables: `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile`, `@argfit-ui/adaptive`.
- Componentes adaptativos exportados: 20.
- Spec files detectados: 51.
- Tests ejecutados por `pnpm release:alpha:check`: 154.
- Gate alpha ejecutado el 2026-05-21: `PASS`.
- Architecture guard: `PASS`.
- Regression guard: `PASS`.
- Pack dry-run y tarballs alpha: `PASS`.
- Alpha smoke: `PASS`.

Tarballs generados por el gate:

| Package | Tarball size |
| --- | ---: |
| `@argfit-ui/core` | 21,078 bytes |
| `@argfit-ui/primitives` | 9,768 bytes |
| `@argfit-ui/desktop` | 92,828 bytes |
| `@argfit-ui/mobile` | 84,918 bytes |
| `@argfit-ui/adaptive` | 42,543 bytes |

## Fortalezas Para Beta

- Arquitectura por capas clara y protegida por guard.
- API adaptativa vendor-independent.
- Paquetes publishables con metadata, licencia y tarball flow.
- Showcase con shell, data table, analytics, forms, feedback y seccion alpha.
- Buen volumen inicial de tests por core, primitives, desktop, mobile, adaptive y showcase.
- CI alpha y publish alpha ya existen.

## Bloqueantes Beta

1. No existe contrato `stable-for-beta`. La documentacion separa `stable-for-alpha` y `experimental`, pero beta necesita una decision mas estricta export por export.
2. APIs experimentales amplias siguen sin cierre formal: `AfDataTable`, `AfAnalyticsCard`, form controls, `AfPassword`, feedback y `AfToastService`.
3. No hay pipeline de visual regression ni QA responsive automatizado.
4. La accesibilidad esta cubierta por componentes y tests puntuales, pero no hay auditoria beta transversal.
5. El smoke de consumidor es minimo; falta una matriz de consumo real desde tarballs/paquetes, con app externa temporal y casos de peer dependencies.
6. El showcase compila con warnings de presupuesto:
   - Initial bundle: `2.25 MB` vs warning budget `750 kB`.
   - `projects/showcase/src/app/app.scss`: `12.95 kB` vs warning budget `8 kB`.
7. Falta documentar la decision de engines: desktop PrimeNG-first, mobile Ionic-first, y PrimeNG en mobile solo como excepcion interna.
8. La documentacion beta aun no existe: public API beta, migracion alpha -> beta, compatibilidad y release notes beta.

## Definicion Recomendada De Beta

Target recomendado: `0.1.0-beta.0`.

Una beta esta lista cuando:

- Existe `docs/beta/beta-scope.md` con APIs clasificadas como `stable-for-beta`, `experimental-in-beta` u `out-of-beta`.
- Existe [component engine map](./component-engine-map.md) y las HUs beta lo respetan.
- Los componentes que se promuevan a beta tienen tests de contrato, accesibilidad y mobile/desktop parity.
- `pnpm release:beta:check` pasa sin warnings de build.
- Existe visual regression o un gate visual documentado y reproducible.
- Existe consumer compatibility smoke con tarballs generados.
- Hay guia de migracion alpha -> beta.
- La publicacion usa dist-tag `beta` y no sobreescribe el canal `alpha`.

## Backlog HU Beta

El camino beta queda dividido en estas HUs:

1. [HU-019 - Beta Scope And Public API Contract](../hus/HU-019-beta-scope-public-api-contract.md)
2. [HU-020 - Experimental Components Hardening](../hus/HU-020-beta-experimental-components-hardening.md)
3. [HU-021 - Accessibility And Keyboard Audit](../hus/HU-021-beta-accessibility-keyboard-audit.md)
4. [HU-022 - Visual Regression And Responsive QA](../hus/HU-022-beta-visual-regression-responsive-qa.md)
5. [HU-023 - Consumer Compatibility Matrix](../hus/HU-023-beta-consumer-compatibility-matrix.md)
6. [HU-024 - Performance And Bundle Budget](../hus/HU-024-beta-performance-bundle-budget.md)
7. [HU-025 - Docs, API Reference And Migration](../hus/HU-025-beta-docs-api-reference-migration.md)
8. [HU-026 - Beta Release Gate And Publish Channel](../hus/HU-026-beta-release-gate-publish-channel.md)

## Recomendacion De Orden

Primero hacer HU-019. Sin una decision de scope, las demas HUs pueden estabilizar cosas que despues no entren en beta.

Despues ejecutar en paralelo o por bloques:

- HU-020, HU-021 y HU-022 para calidad del catalogo.
- HU-023 y HU-024 para consumo y performance.
- HU-025 cuando el contrato de HU-019 ya este cerrado.
- HU-026 al final como gate y publicacion.
