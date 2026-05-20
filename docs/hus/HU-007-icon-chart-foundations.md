# HU-007 — Icon and Chart Foundations

## Estado

Implemented

## Fase del Roadmap

Fase 1 — Core System / Fase 2 — Primitive Foundation / Fase 5 — Adaptive Layer / Fase 7 — Enterprise Systems

## Dependencias

Esta HU depende de:

- HU-001 — Formalizar tokens del design system.
- HU-002 — Theme runtime y estilos base.
- HU-003 — Accessibility primitives.
- HU-004 — AfCard vertical slice.
- HU-005 — AfInput vertical slice.
- `AfButton` vertical slice funcionando como referencia.

## Decision de Producto

ArgFit UI usara:

- `lucide-angular` como proveedor interno de iconos.
- `echarts` como motor interno de graficos de datos.
- `echarts-gl` queda documentado como extension futura para charts 3D. No se instala en esta HU porque los presets 3D quedan fuera del primer cierre implementado.

Estas librerias NO deben filtrarse como contrato publico principal de ArgFit UI.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero una fundacion oficial de iconos y graficos, para que componentes futuros como inputs, dialogs, badges, metric cards, dashboards y analytics usen un lenguaje visual consistente sin acoplar sus APIs publicas a proveedores externos.

## Objetivo

Crear la base compartida para:

- Renderizar iconos ArgFit usando Lucide internamente.
- Reemplazar iconos sueltos como strings/emoji por nombres tipados.
- Renderizar graficos basicos ArgFit usando ECharts internamente.
- Cubrir los patrones reales del design system: KPI gauge, donut/ring, line/area, bar, radar, heatmap y charts analiticos avanzados.
- Definir tokens, tipos y patrones de uso para data visualization.
- Mantener APIs publicas simples, estables y vendor-independent.

Esta HU no busca construir dashboards completos. Busca cerrar la decision tecnica y un catalogo minimo de chart presets antes de que el sistema crezca.

## Validacion de Diseno

La HU debe validarse contra las referencias visuales adjuntas. El diseño real muestra tres familias que deben quedar contempladas:

1. **Iconografia de sistema**
   - Sidebar desktop y tabbar mobile usan SVG lineales tipo Lucide.
   - Stroke esperado: 1.8–2px, `roundCap`, `roundJoin`, sin fill salvo casos puntuales.
   - Iconos visibles en referencias: dashboard/grid, users, table, kanban, pie/chart, device/cpu, report/file, monitor, check-square, settings, search, bell, download, plus, edit, trash, chevron, filter.

2. **Charts KPI/mobile**
   - Gauge semicircular de performance score.
   - Donut/ring para distribucion de sesiones.
   - Radial/polar bars para KPIs.
   - Area line para progreso.
   - Horizontal bars para ranking.
   - Radar para comparar atletas.
   - Side-by-side bars para comparacion de metricas.

3. **Charts analytics/desktop**
   - Stacked bar mensual.
   - Heatmap semanal.
   - Boxplot de distribucion.
   - Parallel coordinates.
   - Radar comparison.
   - 3D scatter y 3D bar como charts avanzados.

La implementacion de HU-007 puede priorizar un subconjunto, pero el modelo de tipos, tokens y arquitectura no debe impedir estos charts. Si algun chart avanzado queda fuera, debe quedar marcado como `planned` y no como imposible.

## Referencias Visuales Obligatorias

Para esta HU SI hacen falta referencias visuales.

Adjuntar al agente al menos:

- Screenshot desktop dashboard.
- Screenshot desktop analytics.
- Screenshot mobile charts.
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\charts.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\charts.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\components.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\advanced-table.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\kanban.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\screens.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\components.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\screens.jsx`
- `C:\Users\Ander\Downloads\ArgFit\preview\colors-surfaces.html`
- `C:\Users\Ander\Downloads\ArgFit\preview\comp-badges.html`
- `C:\Users\Ander\Downloads\ArgFit\colors_and_type.css`

Opcionales utiles:

- `C:\Users\Ander\Downloads\ArgFit\preview\comp-inputs.html`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\forms.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\forms.jsx`

## Contexto Visual

Los iconos ArgFit deben sentirse:

- Minimalistas.
- Tecnicos.
- Consistentes.
- Legibles a 16px, 18px y 20px.
- Integrados con botones, inputs, badges, dialogs y navegación.

Los graficos ArgFit deben sentirse:

- Claros.
- Data-first.
- Sobrios.
- Sin ruido decorativo.
- Integrados con cards y superficies enterprise.
- Legibles en dark theme.

No deben sentirse:

- Como iconos mezclados de varias familias.
- Como emojis.
- Como PrimeIcons expuestos en API publica.
- Como graficos demo de ECharts con colores default.
- Como dashboards decorativos con gradientes excesivos.

## Alcance Incluido

### Dependencies

Instalar dependencias de workspace:

- `lucide-angular`
- `echarts`

No instalar wrappers de ECharts para Angular salvo justificacion tecnica clara.

Opcional avanzado:

- `echarts-gl`, solo si se implementan `scatter3d` o `bar3d` en esta HU.

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/icon.types.ts`
- `projects/argfit-ui-core/src/lib/types/chart.types.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Primitives

Paths esperados:

- `projects/argfit-ui-primitives/src/lib/icon/`
- `projects/argfit-ui-primitives/src/public-api.ts`
- `projects/argfit-ui-primitives/package.json`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/chart/`
- `projects/argfit-ui-desktop/src/public-api.ts`

Tambien se puede actualizar:

- `projects/argfit-ui-desktop/src/lib/components/input/`
- `projects/argfit-ui-desktop/src/lib/components/button/`

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/chart/`
- `projects/argfit-ui-mobile/src/public-api.ts`

Tambien se puede actualizar:

- `projects/argfit-ui-mobile/src/lib/components/input/`
- `projects/argfit-ui-mobile/src/lib/components/button/`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/chart/`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- Dashboard completo.
- `AfMetricCard`.
- `AfAnalyticsCard`.
- `AfDataTable`.
- Drilldown avanzado.
- Zoom/pan avanzado.
- Tooltips de negocio complejos.
- Exportacion de charts.
- Tema completo de ECharts para todos los casos.
- Icon browser completo.
- Iconos custom SVG fuera de Lucide.

Es valido mostrar ejemplos pequenos en showcase, pero no crear sistemas de analytics completos.

## API Publica Esperada — Iconos

Uso basico:

```html
<af-icon name="search" />
```

Uso con tamaño y label accesible:

```html
<af-icon name="activity" size="lg" ariaLabel="Actividad" />
```

Uso decorativo:

```html
<af-icon name="chevron-right" decorative />
```

Tipos sugeridos:

```ts
type AfIconName =
  | 'activity'
  | 'alert-triangle'
  | 'arrow-down'
  | 'arrow-up'
  | 'bar-chart-3'
  | 'battery'
  | 'bell'
  | 'bluetooth'
  | 'calendar'
  | 'check'
  | 'check-square'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'circle-alert'
  | 'circle-check'
  | 'clock'
  | 'cpu'
  | 'edit'
  | 'file-text'
  | 'download'
  | 'filter'
  | 'grid-2x2'
  | 'info'
  | 'layout-dashboard'
  | 'menu'
  | 'monitor'
  | 'panel-top'
  | 'pie-chart'
  | 'play'
  | 'plus'
  | 'search'
  | 'settings'
  | 'trash'
  | 'upload'
  | 'users'
  | 'zap'
  | 'x';

type AfIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AfIconTone = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
```

Inputs sugeridos:

```ts
name = input.required<AfIconName>();
size = input<AfIconSize>('md');
tone = input<AfIconTone>('default');
strokeWidth = input<number | undefined>();
decorative = input(true);
ariaLabel = input<string | undefined>();
```

Requisitos:

- El componente publico debe llamarse `AfIconComponent`.
- Selector publico: `af-icon`.
- Export publico desde `@argfit-ui/primitives`.
- Lucide debe estar encapsulado.
- Importar solo iconos permitidos para evitar bundles grandes.
- Si un icono no esta registrado, fallar de forma visible en dev/test o mostrar fallback accesible documentado.
- `decorative=true` debe aplicar `aria-hidden="true"`.
- Si `decorative=false`, debe exigir `ariaLabel` o equivalente.

## API Publica Esperada — Charts

Uso basico:

```html
<af-chart
  type="line"
  title="Saltos por sesion"
  [categories]="['Lun', 'Mar', 'Mie', 'Jue']"
  [series]="jumpSeries"
/>
```

Uso compacto:

```html
<af-chart
  type="sparkline"
  tone="primary"
  [series]="[{ name: 'Altura', data: [32, 36, 38, 35, 41] }]"
/>
```

Tipos sugeridos:

```ts
type AfChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'stacked-bar'
  | 'horizontal-bar'
  | 'sparkline'
  | 'donut'
  | 'gauge'
  | 'radar'
  | 'heatmap'
  | 'boxplot'
  | 'parallel';
type AfChartTone = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type AfChartDensity = 'compact' | 'comfortable';
type AfChartStatus = 'stable' | 'planned' | 'experimental';

interface AfChartSeries {
  name: string;
  data: readonly number[] | readonly AfChartPoint[];
  tone?: AfChartTone;
}

interface AfChartPoint {
  x?: string | number;
  y?: string | number;
  z?: string | number;
  value: number | readonly number[];
  label?: string;
}

interface AfChartIndicator {
  name: string;
  max: number;
  min?: number;
}
```

Inputs sugeridos:

```ts
type = input<AfChartType>('line');
title = input<string | undefined>();
description = input<string | undefined>();
categories = input<readonly string[]>([]);
series = input<readonly AfChartSeries[]>([]);
indicators = input<readonly AfChartIndicator[]>([]);
height = input<number>(220);
density = input<AfChartDensity>('comfortable');
tone = input<AfChartTone>('default');
legend = input(true);
showGrid = input(true);
interactive = input(true);
loading = input(false);
emptyMessage = input('Sin datos disponibles');
```

Outputs sugeridos:

```ts
pointSelect = output<AfChartPointEvent>();
```

Requisitos:

- Selector publico: `af-chart`.
- Export publico: `AfChart`.
- Debe delegar desktop/mobile segun `AfPlatformService`.
- ECharts debe estar encapsulado.
- No exponer `EChartsOption` como API publica principal.
- Usar imports modulares de `echarts/core` cuando sea razonable.
- Destruir la instancia de ECharts en `ngOnDestroy`.
- Redimensionar en cambios de contenedor/viewport.
- Soportar estado loading y empty.
- Respetar reduced motion cuando sea posible.
- Ser SSR-safe: no acceder a `window`/canvas fuera del browser.

## Chart Presets Requeridos

Para que la HU siga siendo implementable, dividir presets en dos niveles.

### Nivel 1 — Obligatorio en HU-007

Estos presets deben compilar, renderizar y aparecer en showcase:

- `line`
- `area`
- `bar`
- `stacked-bar`
- `horizontal-bar`
- `sparkline`
- `donut`
- `gauge`
- `radar`

### Nivel 2 — Soportado por arquitectura, opcional en showcase

Estos presets deben quedar previstos por tokens y arquitectura. Pueden implementarse como demo interno si el tiempo alcanza, pero no deben bloquear la HU:

- `heatmap`
- `boxplot`
- `parallel`

En este cierre se implementan `heatmap`, `boxplot` y `parallel` como presets avanzados 2D. `scatter3d` y `bar3d` quedan planeados para una HU posterior junto con `echarts-gl`.

## Actualizacion de Componentes Existentes

Actualizar `AfInput` para que `prefixIcon` use `AfIconName` y renderice `af-icon` en lugar de texto/emoji.

Requisitos:

- Mantener compatibilidad razonable con ejemplos actuales.
- Actualizar showcase de `prefixIcon="🔍"` a `prefixIcon="search"`.
- No romper labels, hints, errors ni ControlValueAccessor.
- Si `AfButton` agrega iconos en esta HU, hacerlo con scope pequeno y tests.

## Data Viz Tokens

Si los tokens actuales no alcanzan, agregar tokens minimos para charts:

- `--af-chart-grid`
- `--af-chart-axis`
- `--af-chart-label`
- `--af-chart-primary`
- `--af-chart-accent`
- `--af-chart-success`
- `--af-chart-warning`
- `--af-chart-danger`
- `--af-chart-track`
- `--af-chart-fill-soft`
- `--af-chart-tooltip-bg`
- `--af-chart-tooltip-border`

Requisitos:

- Mantener dark/light theme.
- Evitar paletas default de ECharts.
- No agregar un sistema cromatico enorme en esta HU.

## Implementacion Desktop

Crear `AfChartDesktopComponent`.

Requisitos:

- Usar ECharts internamente.
- Layout compacto y denso.
- Tooltips legibles.
- Ejes y grid de bajo ruido visual.
- Integrarse dentro de `AfCard`.
- OnPush.
- Standalone.

Visual desktop esperado:

- Altura estable.
- Labels pequenos pero legibles.
- Grid sutil.
- Tooltip sobrio.
- Sin animaciones excesivas.

## Implementacion Mobile

Crear `AfChartMobileComponent`.

Requisitos:

- Usar ECharts internamente.
- Menos ruido visual que desktop.
- Touch target razonable para puntos/barras.
- Altura responsive.
- Tooltips o labels aptos para touch.
- OnPush.
- Standalone.

Visual mobile esperado:

- Full-width friendly.
- Pocos labels para evitar saturacion.
- Sparkline compacto para cards.
- Scroll de pagina no debe pelearse con interaccion del chart.

## Implementacion Adaptive

Crear `AfChart` como API publica adaptativa.

Requisitos:

- Selector publico: `af-chart`.
- Export publico: `AfChart`.
- Debe delegar a desktop/mobile segun `AfPlatformService`.
- Debe pasar inputs/outputs.
- Debe seguir el patron de `AfButton`, `AfCard`, `AfInput` y `AfDialog`.

## Showcase

Agregar una seccion sencilla al showcase:

- Icon samples con `search`, `activity`, `calendar`, `settings`, `trash`, `x`.
- Input con `prefixIcon="search"`.
- Gauge de performance score.
- Donut/ring de sesiones por tipo.
- Area line de progreso de salto.
- Stacked bar de sesiones mensuales.
- Horizontal bar de ranking.
- Radar de comparacion de atletas.
- Sparkline dentro de una card o tabla compacta.
- Estado empty.

Contenido recomendado:

- Altura de salto por sesion.
- Sesiones completadas por semana.
- Tendencia de latencia o carga.

## Tests Requeridos

### Core

- Tipos exportados desde public API.
- Tokens de chart existen en dark/light si se agregan.

### Primitives

- `AfIconComponent` renderiza un icono registrado.
- Aplica `aria-hidden` cuando es decorativo.
- Aplica `aria-label` cuando no es decorativo.
- Aplica size y tone.

### Desktop

- `AfChartDesktopComponent` renderiza contenedor de chart.
- Muestra empty state sin series.
- Muestra loading state.
- Renderiza al menos `line`, `bar`, `stacked-bar`, `donut`, `radar`.
- Crea y destruye instancia ECharts sin leaks evidentes.

### Mobile

- `AfChartMobileComponent` renderiza contenedor de chart.
- Muestra empty/loading.
- Usa configuracion mobile distinta a desktop.
- Renderiza al menos `gauge`, `donut`, `area`, `horizontal-bar`, `radar`.

### Adaptive

- Renderiza desktop cuando platform es desktop.
- Renderiza mobile cuando platform es mobile.
- Pasa inputs basicos.
- Propaga `pointSelect` si se implementa.

### Showcase

- Compila con `AfIcon` y `AfChart`.
- Renderiza ejemplos principales.
- `AfInput` usa `prefixIcon="search"`.

## Criterios de Aceptacion

1. `lucide-angular` y `echarts` quedan como dependencias oficiales del workspace.
2. Existe `AfIconComponent` publico desde `@argfit-ui/primitives`.
3. Existe `AfChart` publico desde `@argfit-ui/adaptive`.
4. Existen implementaciones desktop y mobile de chart.
5. La API publica principal no expone tipos Lucide ni ECharts.
6. Los iconos usan nombres ArgFit tipados.
7. `AfInput` usa iconos Lucide para `prefixIcon`.
8. Los charts usan tokens `--af-*` y no paleta default de ECharts.
9. Los charts son SSR-safe.
10. Las instancias ECharts se destruyen correctamente.
11. El showcase muestra iconos y al menos 6 charts/estados: gauge, donut, line/area, stacked bar, horizontal bar, radar y empty.
12. Desktop y mobile se ven distintos cuando corresponde, pero comparten contrato publico.
13. `pnpm guard:architecture` pasa.
14. `pnpm build:all` pasa.
15. `pnpm test:all` pasa.

## Checklist Tecnica

- [x] Leer `docs/hus/HU-007-icon-chart-foundations.md`.
- [x] Leer `docs/architecture.md`.
- [x] Leer `docs/component-philosophy.md`.
- [x] Leer `docs/design-system.md`.
- [x] Revisar `AfButton`, `AfCard`, `AfInput` y `AfDialog`.
- [x] Instalar `lucide-angular`.
- [x] Instalar `echarts`.
- [x] Decidir si esta HU instala `echarts-gl` o lo deja para una HU posterior.
- [x] Crear tipos de iconos en core.
- [x] Crear tipos de charts en core.
- [x] Crear `AfIconComponent` en primitives.
- [x] Crear registry acotado de iconos Lucide.
- [x] Actualizar `AfInput` para usar `AfIcon`.
- [x] Crear `AfChartDesktopComponent`.
- [x] Crear `AfChartMobileComponent`.
- [x] Crear `AfChart` adaptativo.
- [x] Agregar tokens de chart si hacen falta.
- [x] Exportar APIs publicas.
- [x] Agregar ejemplos al showcase.
- [x] Escribir tests.
- [x] Verificar servidor local en `http://localhost:4200`.
- [x] Formatear archivos.
- [x] Ejecutar validaciones.

## Comandos de Validacion

```bash
pnpm guard:architecture
pnpm build:core
pnpm build:primitives
pnpm build:desktop
pnpm build:mobile
pnpm build:adaptive
ng test argfit-ui-core --watch=false
ng test argfit-ui-primitives --watch=false
ng test argfit-ui-desktop --watch=false
ng test argfit-ui-mobile --watch=false
ng test argfit-ui-adaptive --watch=false
ng test showcase --watch=false
pnpm build:all
pnpm test:all
```

## Verificacion Visual

Despues de implementar, abrir el showcase y revisar:

- Iconos: consistencia visual, stroke, color y alineacion.
- Inputs: `prefixIcon="search"` se ve como Lucide, no como emoji/texto.
- Charts desktop: ejes, grid, tooltip y contraste.
- Charts mobile: legibilidad y touch.
- Gauge/donut/radar: proporciones fieles a las referencias mobile.
- Stacked/horizontal bars: color y labels fieles a referencias desktop/mobile.
- Empty/loading: estados claros.
- Theme dark: charts e iconos respetan tokens.
- Theme light si esta habilitado: legibilidad minima aceptable.

Si se usa Browser/Playwright, tomar screenshots en:

```txt
desktop: 1440x900
mobile: 390x844
```

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-007 — Icon and Chart Foundations.

Contexto obligatorio:
- Lee docs/hus/HU-007-icon-chart-foundations.md.
- Lee docs/architecture.md.
- Lee docs/component-philosophy.md.
- Lee docs/design-system.md.
- Revisa los vertical slices existentes de AfButton, AfCard, AfInput y AfDialog.

Decisiones obligatorias:
- Usar lucide-angular como proveedor interno de iconos.
- Usar echarts como motor interno de graficos.
- Contemplar echarts-gl solo si se implementan charts 3D en esta HU.
- No exponer APIs Lucide ni ECharts como contrato publico principal.

Objetivo:
Crear AfIcon y AfChart como fundaciones oficiales: tipos core, registry de iconos, chart wrapper desktop/mobile/adaptive, presets de chart basados en las referencias visuales, tokens minimos de chart si hacen falta y ejemplos en showcase.

Alcance:
- projects/argfit-ui-core/src/lib/types/icon.types.ts
- projects/argfit-ui-core/src/lib/types/chart.types.ts
- projects/argfit-ui-primitives/src/lib/icon/
- projects/argfit-ui-desktop/src/lib/components/chart/
- projects/argfit-ui-mobile/src/lib/components/chart/
- projects/argfit-ui-adaptive/src/lib/components/chart/
- public-api.ts de cada paquete afectado
- projects/showcase/src/app/

No implementes dashboard completo, AfMetricCard, AfAnalyticsCard, AfDataTable, exportacion de charts ni icon browser. Usa tokens --af-*.

Definition of Done:
- lucide-angular y echarts instalados.
- AfIcon existe desde @argfit-ui/primitives.
- AfChart existe desde @argfit-ui/adaptive.
- AfInput usa prefixIcon con nombres ArgFit/Lucide.
- Charts tienen empty/loading, destruyen instancia ECharts y son SSR-safe.
- Showcase muestra iconos, gauge, donut, line/area, stacked bar, horizontal bar, radar, sparkline y empty state.
- pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

Esta HU fija dos decisiones de plataforma: Lucide para iconografia y ECharts para data visualization. Despues de esto, las siguientes HUs naturales son `AfBadge`, `AfSelect`/`AfTextarea`, `AfMetricCard` o `AfDataTable`, todas ya apoyadas sobre una base visual coherente.
