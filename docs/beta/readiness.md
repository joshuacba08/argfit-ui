# ArgFit UI - Beta Readiness Evaluation

Fecha de evaluacion: 2026-05-21.

## Veredicto

La beta ya tiene canal, gate y artefactos propios: compila, testea, empaqueta como beta, valida consumidor externo, ejecuta smoke visual reproducible y publica mediante workflow/tag dedicado. HU-019 a HU-026 dejan completo el baseline tecnico y de distribucion para `0.1.0-beta.0`.

La clasificacion `experimental-in-beta` sigue vigente para ciertas superficies, pero eso ya no bloquea la publicacion beta: forma parte del contrato documentado de esta fase.

## Evidencia Actual

- Version actual: `0.1.0-beta.0`.
- Paquetes publishables: `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile`, `@argfit-ui/adaptive`.
- Componentes adaptativos exportados: 20.
- Spec files detectados: 51.
- Tests ejecutados por `pnpm test:all`: 154.
- Gate alpha ejecutado el 2026-05-21: `PASS`.
- Gate beta ejecutado el 2026-05-21: `PASS`.
- Architecture guard: `PASS`.
- Regression guard: `PASS`.
- Pack dry-run y tarballs beta: `PASS`.
- Alpha smoke: `PASS`.
- Visual beta smoke: `PASS`.
- Beta consumer smoke: `PASS`.
- `pnpm build:all` sin warnings de budget: `PASS`.
- Medicion reproducible de performance: `PASS`.
- Beta smoke: `PASS`.
- Publish workflow beta: `PASS`.

## Salida De HU-019

HU-019 ya define el baseline documental para beta:

- [Beta scope](./beta-scope.md)
- [Beta public API](./public-api.md)
- [Component engine map](./component-engine-map.md)
- [Migration alpha -> beta](./migration-alpha-to-beta.md)
- [HU-019](../hus/HU-019-beta-scope-public-api-contract.md)

La decision actual es conservadora:

- El catalogo base se promueve a `stable-for-beta`.
- `AfAnalyticsCard`, `AfDataTable`, expanded form controls y feedback siguen `experimental-in-beta`.
- `@argfit-ui/desktop` y `@argfit-ui/mobile` permanecen `renderer-specific`.
- PrimeNG en mobile sigue con cero excepciones aprobadas para beta.

## Salida De HU-020 Y HU-021

El baseline beta tambien quedo reforzado con:

- hardening contractual para superficies `experimental-in-beta`, sin promocionarlas todavia;
- cobertura explicita de teclado para data table desktop/mobile;
- cobertura explicita de focus return en dialog desktop/mobile;
- cobertura explicita de live regions en toast e inline message;
- [matriz y gate de accesibilidad beta](./accessibility.md);
- [QA visual beta](./visual-qa.md);
- [compatibilidad de consumidor beta](./compatibility.md);
- [matriz de paquetes beta](./package-matrix.md);
- [decision de performance y budgets beta](./performance.md);
- comando reproducible `pnpm audit:accessibility`.

## Salida De HU-022 A HU-025

El baseline beta ya incluye tambien:

- [visual beta QA](./visual-qa.md) con `pnpm visual:beta`;
- [consumer compatibility](./compatibility.md) y [package matrix](./package-matrix.md) con `pnpm beta:consumer-smoke`;
- [performance y budgets](./performance.md) con `pnpm measure:beta-performance`;
- [beta quickstart](./quickstart.md), [beta components](./components.md), [beta theming](./theming.md) y [beta known limitations](./known-limitations.md);
- README root, package READMEs y showcase enlazando la ruta documental beta.

## Fortalezas Para Beta

- Arquitectura por capas clara y protegida por guard.
- API adaptativa vendor-independent.
- Paquetes publishables con metadata, licencia y tarball flow.
- Contrato beta inicial ya documentado export por export.
- Showcase con shell, data table, analytics, forms, feedback y seccion alpha.
- Buen volumen inicial de tests por core, primitives, desktop, mobile, adaptive y showcase.
- CI beta y publish beta ya existen.

## Bloqueantes Beta Restantes

No hay bloqueantes duros restantes para `0.1.0-beta.0` en este repositorio.

Queda trabajo posterior, pero ya fuera de HU-026:

1. decidir que APIs `experimental-in-beta` permanecen experimentales o se promueven en prereleases siguientes;
2. continuar con Beta+ y la estrategia de expansion del catalogo.

## Definicion Recomendada De Beta

Target recomendado: `0.1.0-beta.0`.

Una beta esta lista cuando:

- Existe `docs/beta/beta-scope.md` con APIs clasificadas como `stable-for-beta`, `experimental-in-beta` u `out-of-beta`.
- Existe [component engine map](./component-engine-map.md) y las HUs beta lo respetan.
- Los componentes que se promuevan a beta tienen tests de contrato, accesibilidad y mobile/desktop parity.
- `pnpm release:beta:check` pasa sin warnings de build.
- Existe visual regression o un gate visual documentado y reproducible.
- Existe consumer compatibility smoke con tarballs o paquetes publicados.
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

HU-019 a HU-026 ya resolvieron el baseline beta principal. El siguiente bloque natural es:

- HU-027 en adelante para Beta+.
