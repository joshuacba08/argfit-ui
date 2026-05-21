# ArgFit UI - Beta Performance And Budgets

Fecha de actualizacion: 2026-05-21.

## Decision

HU-024 deja el build beta sin warnings y documenta por que el budget inicial del showcase no debe medirse con el mismo umbral que una app consumidora normal.

La decision actual es:

- mantener el budget de `anyComponentStyle` en `8 kB` warning / `14 kB` error;
- mover estilos de showcase fuera de `projects/showcase/src/app/app.scss` hasta eliminar ese warning;
- ajustar solo el budget `initial` del showcase a un umbral creible para una app catalogo completa.

## Cambios Aplicados

- estilos de secciones grandes del showcase se movieron a `projects/showcase/src/styles.css`;
- el warning de `app.scss` desaparecio;
- el budget `initial` de `showcase` pasa a:
  - warning: `2.4 MB`
  - error: `2.6 MB`

## Razon Del Ajuste De Budget Inicial

`showcase` no representa una integracion minima de consumidor. Representa una app catalogo que carga en un solo shell:

- desktop y mobile renderers;
- charts y analytics demo;
- forms, feedback, page shell, dialogs y data table;
- escenarios que tambien usa el smoke visual beta.

La hu no buscaba esconder crecimiento arbitrario. Buscaba evitar que el equipo normalizara warnings permanentes en un gate de release. Por eso el budget se movio desde un valor irreal para este tipo de app (`750 kB`) a un umbral con margen acotado sobre la medicion real.

La referencia de footprint consumible ya no es el showcase. Para eso existe `pnpm beta:consumer-smoke` y los tarballs publicados.

## Medicion Reproducible

```bash
pnpm build:all
pnpm pack:alpha:dist
pnpm measure:beta-performance
```

El comando `pnpm measure:beta-performance` reporta:

- assets iniciales anclados desde `dist/showcase/browser/index.html`;
- total inicial enlazado por el entrypoint del showcase;
- tamanos de tarballs alpha listos para consumo externo.

## Medicion Actual

Salida validada durante HU-024:

- Angular build `Initial total`: `2.25 MB` raw, `469.58 kB` estimated transfer.
- Assets iniciales enlazados por `index.html`: `2.11 MB`.
- Tarballs:
  - `@argfit-ui/core`: `21 kB`
  - `@argfit-ui/primitives`: `9.54 kB`
  - `@argfit-ui/desktop`: `91 kB`
  - `@argfit-ui/mobile`: `83 kB`
  - `@argfit-ui/adaptive`: `42 kB`
  - total: `245 kB`

## Interpretacion

- El showcase sigue siendo pesado, pero ya no emite warnings de budget con el umbral beta documentado.
- Los tarballs publishables siguen siendo pequenos en comparacion con la app catalogo completa.
- El riesgo principal de crecimiento futuro no esta en el package tarball flow sino en seguir agregando demos pesadas al showcase sin separar o revisar el contrato del gate.

## Regla Operativa

Si el showcase supera `2.4 MB` nuevamente:

1. medir con `pnpm measure:beta-performance`;
2. decidir si el crecimiento viene de demos/catalogo o de regresion real;
3. preferir reducir carga o separar secciones antes de volver a mover budgets;
4. documentar cualquier nuevo ajuste en este archivo.