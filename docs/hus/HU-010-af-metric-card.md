# HU-010 — AfMetricCard Vertical Slice

## Estado

Ready for implementation

## Fase del Roadmap

Fase 3 — Desktop Foundation / Fase 4 — Mobile Foundation / Fase 5 — Adaptive Layer / Fase 6 — Showcase Platform / Fase 7 — Enterprise Systems

## Dependencias

Esta HU depende de:

- HU-001 — Formalizar tokens del design system.
- HU-002 — Theme runtime y estilos base.
- HU-003 — Accessibility primitives.
- HU-004 — AfCard vertical slice.
- HU-007 — Icon and Chart Foundations.
- HU-008 — AfBadge vertical slice.
- HU-009 — AfPageShell navigation slice.

## Decision de Producto

ArgFit UI necesita un componente `AfMetricCard` para mostrar KPIs y mediciones de rendimiento de forma consistente en dashboards, pantallas mobile, reportes de sesiones y vistas de dispositivos.

`AfMetricCard` NO debe ser una card de negocio cerrada. Debe ser un bloque de datos reusable que permita construir:

- Atletas activos: `38`.
- Sesiones del mes: `247`.
- Dispositivos online: `4/6`.
- Mejor salto: `45.2 cm`.
- Fuerza pico: `2847 N`.
- Tiempo de contacto: `0.342 s`.
- Cambios de tendencia: `+8%`, `-3%`, `sin cambios`.
- Cards compactas mobile tipo `StatCard`.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero una metric card adaptativa, tipada y token-driven, para representar indicadores numericos y tendencias de forma clara en desktop y mobile sin repetir estilos inline ni logica visual en cada pantalla.

## Objetivo

Crear el vertical slice completo de `AfMetricCard`:

- Tipos publicos en core.
- Implementacion desktop.
- Implementacion mobile.
- API adaptativa publica.
- Icono opcional con `AfIcon`.
- Badge/tendencia opcional con `AfBadge`.
- Estado loading y estado neutral/sin datos.
- Showcase dentro de `AfPageShell`.
- Tests por capa.

## Referencias del Design System

Todos los archivos de Claude Design estan disponibles localmente en `docs/claude-design`.

Referencias obligatorias para esta HU:

- `docs/claude-design/README.md`
- `docs/claude-design/SKILL.md`
- `docs/claude-design/colors_and_type.css`
- `docs/claude-design/preview/colors-surfaces.html`
- `docs/claude-design/preview/comp-cards.html`
- `docs/claude-design/preview/comp-badges.html`
- `docs/claude-design/ui_kits/desktop/components.jsx`
- `docs/claude-design/ui_kits/desktop/screens.jsx`
- `docs/claude-design/ui_kits/mobile/components.jsx`
- `docs/claude-design/ui_kits/mobile/screens.jsx`

Referencias opcionales utiles:

- `docs/claude-design/ui_kits/desktop/charts.jsx`
- `docs/claude-design/ui_kits/mobile/charts.jsx`
- `docs/claude-design/assets/logo-icon-dark.png`
- `docs/claude-design/assets/product-jump.png`

## Screenshots Que Debe Adjuntar El Agente

Adjuntar al agente, ademas de los archivos anteriores:

- Screenshot desktop del dashboard con la fila de KPI cards: `Atletas activos`, `Sesiones (mes)`, `Dispositivos online`, `Salto prom. (mes)`.
- Screenshot mobile de Home con las cards de `HOY`: `Sesiones` y `Mejor salto`.
- Screenshot mobile de Results/Stats con las cuatro summary cards: `Mejor salto`, `Promedio`, `Fuerza pico`, `T. contacto`.
- Screenshot de la card con grafico/sparkline semanal si se va a validar el layout junto a data viz.

Si el agente no recibe screenshots, debe usar los archivos de `docs/claude-design/ui_kits/...` como referencia principal y dejar constancia en la verificacion visual.

## Validacion de Diseno

La implementacion debe respetar las reglas detectadas en Claude Design:

- Desktop `KpiCard` usa superficie `#0F1D32`, borde azul sutil, radio `12px`, padding `20px`.
- Mobile `StatCard` usa superficie elevada, borde sutil, radio `12px`, padding `16px`.
- El valor numerico es protagonista y usa tipografia display/data.
- El label es pequeno, muted y escaneable.
- El icono vive en un contenedor cuadrado con color soft del tono.
- Los cambios de tendencia usan success/danger/warning segun direccion.
- Las units (`cm`, `N`, `s`, `/6`) no deben competir con el valor principal.
- Desktop es mas denso y horizontal; mobile prioriza legibilidad en grids de 2 columnas.

## Contexto Visual

Las metric cards ArgFit deben sentirse:

- Tecnicas.
- Precisas.
- Escaneables.
- Data-first.
- Integradas con `AfPageShell` y `AfCard`.
- Utiles tanto para dashboards como para resultados de sesiones.

No deben sentirse:

- Como pricing cards.
- Como marketing stats gigantes.
- Como tarjetas decorativas.
- Como widgets con colores hardcodeados.
- Como cards que conocen conceptos de negocio de ArgFit.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/metric-card.types.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/metric-card/af-metric-card-desktop.component.ts`
- `projects/argfit-ui-desktop/src/lib/components/metric-card/af-metric-card-desktop.component.html`
- `projects/argfit-ui-desktop/src/lib/components/metric-card/af-metric-card-desktop.component.scss`
- `projects/argfit-ui-desktop/src/lib/components/metric-card/af-metric-card-desktop.component.spec.ts`
- `projects/argfit-ui-desktop/src/public-api.ts`

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/metric-card/af-metric-card-mobile.component.ts`
- `projects/argfit-ui-mobile/src/lib/components/metric-card/af-metric-card-mobile.component.html`
- `projects/argfit-ui-mobile/src/lib/components/metric-card/af-metric-card-mobile.component.scss`
- `projects/argfit-ui-mobile/src/lib/components/metric-card/af-metric-card-mobile.component.spec.ts`
- `projects/argfit-ui-mobile/src/public-api.ts`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/metric-card/af-metric-card.component.ts`
- `projects/argfit-ui-adaptive/src/lib/components/metric-card/af-metric-card.component.html`
- `projects/argfit-ui-adaptive/src/lib/components/metric-card/af-metric-card.component.scss`
- `projects/argfit-ui-adaptive/src/lib/components/metric-card/af-metric-card.component.spec.ts`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- `AfAnalyticsCard` como wrapper de charts.
- `AfDataTable`.
- Calculos de metricas deportivas.
- Formateo por locale avanzado.
- Fetching de datos.
- Drilldown real.
- Exportacion.
- Animaciones complejas de conteo.
- Charts completos dentro de la card.
- Grids de dashboard como componente aparte.

## API Publica Esperada

Uso basico:

```html
<af-metric-card label="Atletas activos" value="38" icon="users" />
```

Con unidad y tono:

```html
<af-metric-card
  label="Mejor salto"
  value="45.2"
  unit="cm"
  tone="accent"
  icon="activity"
/>
```

Con tendencia:

```html
<af-metric-card
  label="Sesiones (mes)"
  value="247"
  trendValue="8%"
  trendDirection="up"
  trendLabel="vs mes anterior"
  icon="file-text"
/>
```

Con estado neutral:

```html
<af-metric-card
  label="Dispositivo"
  value="--"
  helper="Sin conexion"
  tone="neutral"
  icon="bluetooth"
/>
```

Tipos sugeridos:

```ts
type AfMetricCardTone = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
type AfMetricCardSize = 'sm' | 'md' | 'lg';
type AfMetricCardDensity = 'compact' | 'comfortable';
type AfMetricCardVariant = 'surface' | 'elevated' | 'outline';
type AfMetricTrendDirection = 'up' | 'down' | 'flat';
```

Inputs sugeridos:

```ts
label = input.required<string>();
value = input<string | number>('');
unit = input<string | undefined>();
helper = input<string | undefined>();
icon = input<AfIconName | undefined>();
tone = input<AfMetricCardTone>('primary');
size = input<AfMetricCardSize>('md');
density = input<AfMetricCardDensity>('comfortable');
variant = input<AfMetricCardVariant>('surface');
trendValue = input<string | number | undefined>();
trendDirection = input<AfMetricTrendDirection | undefined>();
trendLabel = input<string | undefined>();
loading = input(false, { transform: booleanAttribute });
interactive = input(false, { transform: booleanAttribute });
fill = input(false, { transform: booleanAttribute });
ariaLabel = input<string | undefined>();
```

Outputs sugeridos:

```ts
pressed = output<MouseEvent | KeyboardEvent>();
```

Requisitos:

- Selector publico adaptativo: `af-metric-card`.
- Export publico: `AfMetricCard`.
- Implementaciones internas: `af-metric-card-desktop` y `af-metric-card-mobile`.
- Debe usar `AfIcon` cuando `icon` exista.
- Debe usar `AfBadge` o una estructura equivalente tokenizada para la tendencia, sin duplicar estilos inline.
- Debe mantener API vendor-independent.
- Debe ser standalone y OnPush.
- Debe usar solo tokens `--af-*`.
- Debe soportar `content projection` para footer simple o helper extendido si el patron existente lo permite.
- Si `interactive=true`, debe ser accesible con teclado y emitir `pressed`.

### Contrato de altura

La altura de la tarjeta la decide el layout que la contiene, no el largo de su contenido.
Es una decision de contrato, no una variante estetica:

- La superficie (`af-metric-card-desktop` / `-mobile`) rellena **siempre** el host. Sin esto,
  una fila de grilla estira el host y deja tarjetas de alturas distintas segun cuanto texto
  arrastre cada una — un defecto del componente, no algo que el consumidor deba parchear.
- `min-height` (por `size` y `density`) sigue siendo el piso: `fill` sube el techo, no baja
  el suelo, y una tarjeta suelta fuera de grilla sigue midiendo su contenido.
- `fill` cubre el caso restante: cuando es el propio host el que no recibe altura (flex con
  `align-items` distinto de `stretch`, padre con altura fija), `fill` hace que la reclame.
  Emite `data-fill` en el host y en el renderer.

## Tokens

Usar tokens existentes siempre que alcance:

- `--af-bg-surface`
- `--af-bg-elevated`
- `--af-bg-interactive`
- `--af-text-main`
- `--af-text-muted`
- `--af-text-soft`
- `--af-primary`
- `--af-accent`
- `--af-success`
- `--af-warning`
- `--af-danger`
- `--af-border`
- `--af-border-soft`
- `--af-radius-md`
- `--af-radius-lg`
- `--af-shadow-sm`

Si hace falta agregar tokens, mantenerlos minimos:

- `--af-metric-card-icon-bg`
- `--af-metric-card-value-color`

No crear una paleta nueva ni hardcodear hex en componentes.

## Implementacion Desktop

Crear `AfMetricCardDesktopComponent`.

Requisitos visuales desktop:

- Padding aprox `20px`.
- Radio `12px` o token equivalente.
- Label arriba a la izquierda.
- Icono arriba a la derecha dentro de box `36px`.
- Valor grande, fuerte y alineado a baseline con la unidad.
- `size="md"` debe acercarse al `KpiCard` de Claude Design.
- `size="sm"` debe servir para grids densos.
- Trend debajo del valor, font small, color segun direccion.
- El componente debe funcionar dentro de un grid de 4 columnas.
- Si `loading=true`, mostrar skeleton tokenizado sin layout shift fuerte.

## Implementacion Mobile

Crear `AfMetricCardMobileComponent`.

Requisitos visuales mobile:

- Padding aprox `16px`.
- Debe funcionar en grid de 2 columnas.
- Valor legible sin overflow.
- Unit mas pequena y muted.
- Label no debe ocupar mas de 2 lineas.
- Icono opcional mas discreto que desktop.
- `size="sm"` debe replicar `StatCard`.
- No debe parecer boton si `interactive=false`.
- Compatible con pantallas `Home`, `Training` y `Stats`.

## Implementacion Adaptive

Crear `AfMetricCard` como API publica adaptativa.

Requisitos:

- Delegar a desktop/mobile segun `AfPlatformService`.
- Pasar todos los inputs.
- Reemitir `pressed`.
- Seguir patron de `AfButton`, `AfCard`, `AfBadge` y `AfPageShell`.
- No duplicar estilos entre adaptive y plataformas.

## Showcase

Agregar una seccion real dentro de `AfPageShell` con:

- Grid desktop de 4 metric cards.
- Grid mobile de 2 metric cards.
- Ejemplos: `Atletas activos`, `Sesiones (mes)`, `Dispositivos online`, `Salto prom. (mes)`.
- Ejemplos de resultados: `Mejor salto`, `Promedio`, `Fuerza pico`, `T. contacto`.
- Al menos una card con tendencia up, una down y una flat/neutral.
- Al menos una card con `loading`.
- Al menos una card sin icono.

## Tests Requeridos

### Core

- Tipos exportados desde public API.
- `AfMetricCardTone`, `AfMetricCardVariant`, `AfMetricTrendDirection` aceptan valores esperados.

### Desktop

- Renderiza label, value y unit.
- Renderiza icono cuando `icon` existe.
- No renderiza icono cuando no se pasa.
- Aplica `data-tone`, `data-size`, `data-density`, `data-variant`.
- Renderiza tendencia up/down/flat.
- Renderiza loading sin mostrar valor real.
- Emite `pressed` con teclado si `interactive=true`.

### Mobile

- Renderiza label, value y unit.
- Mantiene layout compacto.
- Renderiza tendencia.
- Renderiza icono opcional.
- Aplica atributos accesibles.

### Adaptive

- Renderiza desktop cuando platform es desktop.
- Renderiza mobile cuando platform es mobile.
- Pasa inputs basicos.
- Reemite `pressed`.

### Showcase

- Compila con `AfMetricCard`.
- Renderiza al menos 8 metric cards.
- Incluye iconos, tonos, tendencias y loading.

## Criterios de Aceptacion

1. Existe `AfMetricCard` publico desde `@argfit-ui/adaptive`.
2. Existen implementaciones desktop y mobile.
3. Existe contrato tipado en `@argfit-ui/core`.
4. El componente no expone PrimeNG ni Ionic.
5. El componente usa `AfIcon` para iconos.
6. La tendencia usa tonos semanticos del design system.
7. El valor y la unidad mantienen jerarquia visual correcta.
8. Desktop funciona en grid de 4 columnas.
9. Mobile funciona en grid de 2 columnas.
10. Loading no genera layout shift fuerte.
11. Showcase muestra KPIs reales de ArgFit.
12. `pnpm guard:architecture` pasa.
13. `pnpm build:all` pasa.
14. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-010-af-metric-card.md`.
- [ ] Leer `docs/architecture.md`.
- [ ] Leer `docs/component-philosophy.md`.
- [ ] Leer `docs/design-system.md`.
- [ ] Leer `docs/claude-design/README.md`.
- [ ] Leer `docs/claude-design/colors_and_type.css`.
- [ ] Revisar `KpiCard` en `docs/claude-design/ui_kits/desktop/components.jsx`.
- [ ] Revisar `StatCard` en `docs/claude-design/ui_kits/mobile/components.jsx`.
- [ ] Revisar usos en `desktop/screens.jsx` y `mobile/screens.jsx`.
- [ ] Crear tipos `metric-card.types.ts`.
- [ ] Exportar tipos desde core.
- [ ] Crear `AfMetricCardDesktopComponent`.
- [ ] Crear `AfMetricCardMobileComponent`.
- [ ] Crear `AfMetricCard` adaptativo.
- [ ] Integrar `AfIcon`.
- [ ] Integrar tendencia tokenizada.
- [ ] Agregar ejemplos al showcase.
- [ ] Escribir tests por capa.
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

## Verificacion Visual

Abrir showcase y revisar:

- El grid desktop se ve como dashboard, no como marketing stats.
- El valor domina sin romper la card.
- Las unidades quedan alineadas a baseline.
- Los iconos no compiten con el dato.
- Las tendencias son legibles y no dependen solo de color.
- Mobile mantiene legibilidad en 2 columnas.
- Light theme conserva contraste.

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-010 — AfMetricCard Vertical Slice.

Contexto obligatorio:
- Lee docs/hus/HU-010-af-metric-card.md.
- Lee docs/architecture.md, docs/component-philosophy.md y docs/design-system.md.
- Lee docs/claude-design/README.md y docs/claude-design/colors_and_type.css.
- Revisa KpiCard en docs/claude-design/ui_kits/desktop/components.jsx.
- Revisa StatCard y sus usos en docs/claude-design/ui_kits/mobile/components.jsx y mobile/screens.jsx.
- Usa los screenshots adjuntos de KPI desktop y cards mobile para validar proporciones.

Objetivo:
Crear AfMetricCard como componente adaptativo para KPIs y mediciones deportivas.

Decisiones:
- API publica vendor-independent.
- Usar AfIcon para icono opcional.
- Usar tokens --af-*.
- No implementar calculos de negocio ni AfDataTable.

Definition of Done:
- Tipos core exportados.
- Implementaciones desktop/mobile/adaptive.
- Showcase con KPIs reales dentro de AfPageShell.
- Tests de core/desktop/mobile/adaptive/showcase.
- pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

`AfMetricCard` convierte los datos de ArgFit en bloques reutilizables. Es el puente entre cards base, charts y pantallas dashboard antes de avanzar hacia tablas enterprise y analytics cards mas complejas.
