# ArgFit UI - Beta Visual QA

Fecha de actualizacion: 2026-05-21.

## Objetivo

HU-022 agrega un smoke visual reproducible del showcase para detectar regresiones de layout, vistas en blanco y errores de responsive antes de publicar una beta.

## Comando

```bash
pnpm visual:beta
```

Instalacion local inicial de navegador:

```bash
pnpm exec playwright install chromium
```

## Que Hace El Smoke

- Compila `showcase` en modo production.
- Sirve `dist/showcase/browser` localmente con un servidor estatico del repo.
- Ejecuta Chromium headless via Playwright.
- Captura screenshots deterministas en `.tmp/visual-regression/current/`.
- Falla si falta una vista clave, si una seccion queda vacia o si mobile renderiza el host equivocado.

## Escenarios Cubiertos

| Snapshot | Viewport | Theme | Validaciones clave |
| --- | --- | --- | --- |
| `alpha-desktop-dark` | `1440x900` | dark | alpha shell, cards y contenido visible |
| `dashboard-desktop-light` | `1440x900` | light | shell desktop y metric cards |
| `dashboard-tablet-dark` | `768x1024` | dark | shell mobile wide/tablet y metric cards mobile |
| `data-table-desktop-dark` | `1440x900` | dark | `af-data-table-desktop`, filas y toolbar |
| `data-table-mobile-dark` | `390x844` | dark | `af-data-table-mobile`, sin desktop host |
| `analytics-desktop-dark` | `1440x900` | dark | analytics cards y charts |
| `forms-desktop-dark` | `1440x900` | dark | segmented control y password desktop |
| `forms-mobile-dark` | `390x844` | dark | password mobile y toggle Ionic presente |
| `feedback-desktop-dark` | `1440x900` | dark | inline messages y toast real |
| `dialog-desktop-dark` | `1440x900` | dark | dialog abierto desde dashboard |

## Selectores Estables

El showcase expone anclas estables para el smoke en roots de seccion:

- `section-alpha`
- `section-dashboard`
- `section-data-table`
- `section-analytics`
- `section-forms`
- `section-feedback`

El runner usa ademas clases estructurales del shell ya cubiertas por tests, como `main.af-page-shell-desktop__content`, `main.af-page-shell-mobile__content` y `.platform-switch button`.

## Politica Actual De Baseline

La beta actual no usa pixel-diff baseline. El gate es screenshot smoke con validaciones estructurales y responsive.

Esto es intencional por dos motivos:

- ECharts y renderers mezclados agregan ruido innecesario para una baseline estricta temprana.
- El objetivo de HU-022 era detectar vistas rotas, layouts vacios y regresiones desktop/mobile antes de release.

Si en una HU futura se agrega baseline visual, el flujo recomendado es:

1. Ejecutar `pnpm visual:beta`.
2. Revisar manualmente `.tmp/visual-regression/current/`.
3. Actualizar el baseline versionado solo junto con el cambio de UI esperado.

## CI

El workflow de CI instala Chromium y ejecuta `pnpm release:beta:check`.

Los screenshots del smoke se publican como artifact bajo `beta-visual-smoke` para inspeccion cuando el gate falla o para revisar una corrida puntual.
