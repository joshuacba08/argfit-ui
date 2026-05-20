# HU-012 — AfAnalyticsCard Vertical Slice

## Estado

Ready for implementation

## Fase del Roadmap

Fase 3 — Desktop Foundation / Fase 4 — Mobile Foundation / Fase 5 — Adaptive Layer / Fase 7 — Enterprise Systems

## Dependencias

Esta HU depende de:

- HU-001 — Formalizar tokens del design system.
- HU-002 — Theme runtime y estilos base.
- HU-003 — Accessibility primitives.
- HU-004 — AfCard vertical slice.
- HU-007 — Icon and Chart Foundations.
- HU-008 — AfBadge vertical slice.
- HU-009 — AfPageShell navigation slice.
- HU-010 — AfMetricCard vertical slice.
- HU-011 — AfDataTable vertical slice.

## Decision de Producto

ArgFit UI necesita `AfAnalyticsCard` para empaquetar graficos, metricas resumidas, controles compactos y metadata de contexto en un bloque reusable. `AfChart` ya resuelve la visualizacion base, pero las pantallas de analytics necesitan una card con header, subtitulo, acciones, filtros rapidos, estados y composicion predecible.

`AfAnalyticsCard` NO debe ser un dashboard completo ni un wrapper rigido de ECharts. Debe permitir construir:

- Grafico principal con titulo y subtitulo.
- Card de tendencia semanal.
- Comparacion radar de atletas.
- Donut con leyenda lateral.
- Gauge mobile con KPIs debajo.
- Chart con controles de periodo `1M`, `3M`, `6M`, `1A`.
- Estados loading, empty y error coherentes.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero una analytics card adaptativa, tipada y token-driven, para componer widgets de datos con chart, header, acciones y estados sin repetir layouts ni estilos inline en cada dashboard.

## Objetivo

Crear el vertical slice completo de `AfAnalyticsCard`:

- Tipos publicos en core.
- Implementacion desktop.
- Implementacion mobile.
- API adaptativa publica.
- Slots para metricas, acciones, leyenda y footer.
- Integracion con `AfChart`, `AfMetricCard`, `AfBadge` y `AfButton`.
- Estados loading, empty y error.
- Showcase con widgets reales de analytics.
- Tests por capa.

## Referencias del Design System

Todos los archivos de Claude Design estan disponibles localmente en `docs/claude-design`.

Referencias obligatorias:

- `docs/claude-design/README.md`
- `docs/claude-design/SKILL.md`
- `docs/claude-design/colors_and_type.css`
- `docs/claude-design/preview/colors-surfaces.html`
- `docs/claude-design/preview/comp-cards.html`
- `docs/claude-design/ui_kits/desktop/charts.jsx`
- `docs/claude-design/ui_kits/desktop/screens.jsx`
- `docs/claude-design/ui_kits/mobile/charts.jsx`
- `docs/claude-design/ui_kits/mobile/screens.jsx`

Referencias opcionales utiles:

- `docs/claude-design/ui_kits/desktop/components.jsx`
- `docs/claude-design/ui_kits/mobile/components.jsx`
- `docs/claude-design/preview/comp-toggles.html`

## Screenshots Que Debe Adjuntar El Agente

Adjuntar al agente:

- Screenshot desktop de `Analytics avanzados` con row de `Analisis 3D` y `Comparacion radar`.
- Screenshot desktop de `Sesiones mensuales` y `Intensidad semanal`.
- Screenshot desktop de `Distribucion de saltos` y `Coordenadas paralelas`.
- Screenshot mobile de `Performance Score`.
- Screenshot mobile de `Sesiones por tipo` con donut y leyenda.
- Screenshot mobile de `Progreso de salto` o `Fuerza por sesion`.

Si no hay screenshots, el agente debe usar `docs/claude-design/ui_kits/desktop/charts.jsx` y `docs/claude-design/ui_kits/mobile/charts.jsx` como referencia principal y anotarlo en la verificacion visual.

## Validacion de Diseno

La implementacion debe respetar:

- Surface `#0F1D32` / tokens `--af-bg-surface`.
- Borde azul sutil, radio 12px, padding 20px desktop y 16px mobile.
- Header compacto con titulo uppercase y subtitulo muted.
- Acciones/controles compactos alineados a la derecha en desktop.
- Mobile usa header mas simple y evita controles apretados.
- El chart debe ocupar el espacio principal sin quedar encerrado en otra card.
- Loading/empty/error no deben cambiar radicalmente las dimensiones.
- La card debe funcionar en grids 1x1, 1x2, 2x1 y full-width.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/analytics-card.types.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/analytics-card/af-analytics-card-desktop.component.ts`
- `projects/argfit-ui-desktop/src/lib/components/analytics-card/af-analytics-card-desktop.component.html`
- `projects/argfit-ui-desktop/src/lib/components/analytics-card/af-analytics-card-desktop.component.scss`
- `projects/argfit-ui-desktop/src/lib/components/analytics-card/af-analytics-card-desktop.component.spec.ts`
- `projects/argfit-ui-desktop/src/public-api.ts`

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/analytics-card/af-analytics-card-mobile.component.ts`
- `projects/argfit-ui-mobile/src/lib/components/analytics-card/af-analytics-card-mobile.component.html`
- `projects/argfit-ui-mobile/src/lib/components/analytics-card/af-analytics-card-mobile.component.scss`
- `projects/argfit-ui-mobile/src/lib/components/analytics-card/af-analytics-card-mobile.component.spec.ts`
- `projects/argfit-ui-mobile/src/public-api.ts`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/analytics-card/af-analytics-card.component.ts`
- `projects/argfit-ui-adaptive/src/lib/components/analytics-card/af-analytics-card.component.html`
- `projects/argfit-ui-adaptive/src/lib/components/analytics-card/af-analytics-card.component.scss`
- `projects/argfit-ui-adaptive/src/lib/components/analytics-card/af-analytics-card.component.spec.ts`
- `projects/argfit-ui-adaptive/src/lib/components/analytics-card/af-analytics-card-slots.directive.ts`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- Nuevos tipos de chart en ECharts.
- Dashboard completo.
- Exportacion de charts.
- Filtros globales.
- Drilldown profundo.
- Sincronizacion entre charts.
- 3D si `AfChart` no lo soporta ya.
- Data fetching.

## API Publica Esperada

Uso basico:

```html
<af-analytics-card title="Progreso semanal" subtitle="Altura promedio (cm)">
  <af-chart [type]="line" [data]="jumpData" />
</af-analytics-card>
```

Con acciones, metricas y footer:

```html
<af-analytics-card
  title="Sesiones mensuales"
  subtitle="Distribucion por tipo de test"
  density="comfortable"
>
  <div afAnalyticsCardActions>
    <af-button size="sm" variant="secondary">3M</af-button>
  </div>

  <div afAnalyticsCardMetrics>
    <af-metric-card label="Cambio" value="+8.2" unit="%" tone="success" size="sm" />
  </div>

  <af-chart [type]="chartType" [data]="chartData" />

  <div afAnalyticsCardFooter>
    <af-badge tone="neutral">12 sesiones</af-badge>
  </div>
</af-analytics-card>
```

Tipos sugeridos:

```ts
type AfAnalyticsCardDensity = 'compact' | 'comfortable';
type AfAnalyticsCardVariant = 'surface' | 'elevated' | 'outline';
type AfAnalyticsCardTone = 'neutral' | 'primary' | 'accent';
type AfAnalyticsCardState = 'ready' | 'loading' | 'empty' | 'error';
```

Inputs sugeridos:

```ts
title = input.required<string>();
subtitle = input<string | undefined>();
density = input<AfAnalyticsCardDensity>('comfortable');
variant = input<AfAnalyticsCardVariant>('surface');
tone = input<AfAnalyticsCardTone>('neutral');
state = input<AfAnalyticsCardState>('ready');
height = input<string | undefined>();
emptyTitle = input('Sin datos');
emptyDescription = input<string | undefined>();
errorTitle = input('No se pudo cargar');
errorDescription = input<string | undefined>();
ariaLabel = input<string | undefined>();
```

Slots sugeridos:

```html
<div afAnalyticsCardActions>...</div>
<div afAnalyticsCardMetrics>...</div>
<div afAnalyticsCardLegend>...</div>
<div afAnalyticsCardFooter>...</div>
```

Requisitos:

- Selector publico adaptativo: `af-analytics-card`.
- Export publico: `AfAnalyticsCard`.
- Debe soportar content projection.
- Debe usar `AfIcon` para estados.
- Debe ser standalone y OnPush.
- Debe usar solo tokens `--af-*`.
- No debe exponer ECharts, PrimeNG ni Ionic en la API.

## Implementacion Desktop

Requisitos:

- Header en fila con titulo/subtitulo a la izquierda y acciones a la derecha.
- Padding 20px, radio tokenizado.
- Content area con `min-height` estable.
- Acciones compactas, aptas para period buttons o select.
- Metrics slot puede renderizar una fila compacta debajo del chart o bajo el header.
- Empty/error centrados pero discretos.

## Implementacion Mobile

Requisitos:

- Padding 16px.
- Header apilado si no hay espacio.
- Acciones pueden ir debajo del titulo.
- Content area sin overflow horizontal.
- Funciona con chart height entre 160px y 240px.
- Legend slot puede apilarse debajo del chart.

## Showcase

Agregar en `AfPageShell`:

- Card `Performance Score`.
- Card `Progreso de salto`.
- Card `Sesiones por tipo`.
- Card `Comparacion atletas`.
- Card loading.
- Card empty.
- Card error.

## Tests Requeridos

- Core exporta tipos.
- Desktop renderiza titulo, subtitulo, acciones, metrics, legend y footer.
- Desktop muestra loading, empty y error.
- Mobile renderiza contenido proyectado y estados.
- Adaptive delega desktop/mobile.
- Showcase compila y renderiza al menos 4 analytics cards.

## Criterios de Aceptacion

1. Existe `AfAnalyticsCard` publico desde `@argfit-ui/adaptive`.
2. Existen implementaciones desktop y mobile.
3. Existe contrato tipado en `@argfit-ui/core`.
4. El componente no expone PrimeNG, Ionic ni ECharts.
5. Funciona con `AfChart` proyectado.
6. Soporta acciones, metrics, legend y footer.
7. Loading/empty/error estan cubiertos.
8. Showcase muestra widgets reales de analytics.
9. `pnpm guard:architecture` pasa.
10. `pnpm build:all` pasa.
11. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-012-af-analytics-card.md`.
- [ ] Leer `docs/claude-design/README.md`.
- [ ] Revisar `desktop/charts.jsx` y `mobile/charts.jsx`.
- [ ] Revisar `AfCard`, `AfChart` y `AfMetricCard`.
- [ ] Crear tipos core.
- [ ] Crear implementaciones desktop/mobile/adaptive.
- [ ] Crear directivas de slots.
- [ ] Agregar showcase.
- [ ] Escribir tests.
- [ ] Ejecutar validaciones.

## Comandos de Validacion

```bash
pnpm guard:architecture
pnpm build:core
pnpm build:desktop
pnpm build:mobile
pnpm build:adaptive
ng test argfit-ui-core --watch=false
ng test argfit-ui-desktop --watch=false
ng test argfit-ui-mobile --watch=false
ng test argfit-ui-adaptive --watch=false
ng test showcase --watch=false
pnpm build:all
pnpm test:all
```

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-012 — AfAnalyticsCard Vertical Slice.

Lee docs/hus/HU-012-af-analytics-card.md, docs/architecture.md, docs/component-philosophy.md y docs/design-system.md.
Usa docs/claude-design/ui_kits/desktop/charts.jsx y docs/claude-design/ui_kits/mobile/charts.jsx como referencias principales.

Objetivo:
Crear AfAnalyticsCard como contenedor adaptativo para widgets de analytics con header, acciones, metricas, leyenda, footer y estados.

Definition of Done:
Tipos core exportados, implementaciones desktop/mobile/adaptive, showcase con widgets reales, tests por capa, pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

`AfAnalyticsCard` convierte los charts en widgets de producto. Es la pieza que permite pasar de graficos sueltos a dashboards reales y bloques premium reutilizables.
