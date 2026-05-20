# HU-008 — AfBadge Vertical Slice

## Estado

Ready for implementation

## Fase del Roadmap

Fase 3 — Desktop Foundation / Fase 4 — Mobile Foundation / Fase 5 — Adaptive Layer

## Dependencias

Esta HU depende de:

- HU-001 — Formalizar tokens del design system.
- HU-002 — Theme runtime y estilos base.
- HU-003 — Accessibility primitives.
- HU-004 — AfCard vertical slice.
- HU-007 — Icon and Chart Foundations.

## Decision de Producto

ArgFit UI necesita un componente `AfBadge` para representar estados, etiquetas, versiones, contadores pequenos y metadatos compactos en cards, tablas, filas de dispositivos, dashboards y pantallas mobile.

`AfBadge` NO debe ser un `StatusBadge` de negocio. Debe ser un componente base reusable que permita construir:

- `Conectado`, `Desconectado`, `Activo`, `Inactivo`, `Bateria baja`.
- Badges de version: `v2.4.1`.
- Badges de plan o nivel: `PRO`.
- Tags de filtro: `Fuerza`, `Velocidad`, `Salto`.
- Badges compactos con icono: `BLE`, `CSV`, `+18%`.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero un badge adaptativo, tipado y token-driven, para representar informacion compacta de estado o metadata de forma consistente en desktop y mobile sin repetir estilos inline en cada feature.

## Objetivo

Crear el vertical slice completo de `AfBadge`:

- Tipos publicos en core.
- Implementacion desktop.
- Implementacion mobile.
- API adaptativa publica.
- Uso opcional de `AfIcon` para iconos pequenos.
- Dot indicator para estados.
- Showcase con variantes reales del design system.
- Tests por capa.

## Validacion de Diseno

La HU debe validarse contra las referencias visuales adjuntas. El diseño real muestra badges con estas reglas:

- Forma principal: pill `999px`.
- Forma tag: radio `8px`.
- Padding badge: `3px/4px` vertical y `8px/10px` horizontal.
- Padding tag: `6px 12px`.
- Font size principal: `10px` a `12px`.
- Font weight: `600`.
- Dot: circulo de `6px`, color `currentColor`.
- Gap: `4px` a `6px`.
- Background soft por tono, nunca solido salvo variante explicita.
- Desktop es mas denso; mobile mantiene touch/readability sin agrandar demasiado.

Referencias detectadas:

- `comp-badges.html` define `badge`, `badge-dot`, tonos `primary`, `accent`, `success`, `warning`, `error`, `neutral`, `solid` y `tag`.
- `desktop/components.jsx` define `StatusBadge` para `connected`, `disconnected`, `active`, `inactive`, `low`.
- `desktop/advanced-table.jsx` usa badges en columna `Estado`.
- `desktop/screens.jsx` usa badges en dispositivos y tablas.
- `mobile/components.jsx` usa chip `BLE` y dot de conexion en filas de dispositivo.

## Referencias Visuales Obligatorias

Adjuntar al agente:

- `C:\Users\Ander\Downloads\ArgFit\preview\comp-badges.html`
- `C:\Users\Ander\Downloads\ArgFit\preview\colors-surfaces.html`
- `C:\Users\Ander\Downloads\ArgFit\colors_and_type.css`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\components.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\advanced-table.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\screens.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\components.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\screens.jsx`

Opcionales utiles:

- Screenshot desktop tabla avanzada.
- Screenshot desktop dispositivos.
- Screenshot mobile device row.

## Contexto Visual

Los badges ArgFit deben sentirse:

- Compactos.
- Legibles.
- Tecnicos.
- Integrados con cards, tablas y filas densas.
- Claros para estados de dispositivo o atleta.

No deben sentirse:

- Como chips Material por defecto.
- Como botones.
- Como etiquetas enormes.
- Como estilos inline repetidos.
- Como badges de Bootstrap/Tailwind default.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/badge.types.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/badge/af-badge-desktop.component.ts`
- `projects/argfit-ui-desktop/src/lib/components/badge/af-badge-desktop.component.html`
- `projects/argfit-ui-desktop/src/lib/components/badge/af-badge-desktop.component.scss`
- `projects/argfit-ui-desktop/src/lib/components/badge/af-badge-desktop.component.spec.ts`
- `projects/argfit-ui-desktop/src/public-api.ts`

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/badge/af-badge-mobile.component.ts`
- `projects/argfit-ui-mobile/src/lib/components/badge/af-badge-mobile.component.html`
- `projects/argfit-ui-mobile/src/lib/components/badge/af-badge-mobile.component.scss`
- `projects/argfit-ui-mobile/src/lib/components/badge/af-badge-mobile.component.spec.ts`
- `projects/argfit-ui-mobile/src/public-api.ts`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/badge/af-badge.component.ts`
- `projects/argfit-ui-adaptive/src/lib/components/badge/af-badge.component.spec.ts`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- `AfDataTable`.
- `AfDeviceCard`.
- `AfMetricCard`.
- Sistema de filtros completo.
- Menus de tags.
- Multi-select chips.
- Badges con popover.
- Logica de negocio para estados de atletas/dispositivos.
- Animaciones complejas.

## API Publica Esperada

Uso basico:

```html
<af-badge>Primary</af-badge>
```

Tonos:

```html
<af-badge tone="success" dot>Conectado</af-badge>
<af-badge tone="warning" dot>Bateria baja</af-badge>
<af-badge tone="danger" dot>Desconectado</af-badge>
<af-badge tone="neutral">v2.4.1</af-badge>
```

Variante solida:

```html
<af-badge variant="solid" tone="primary">PRO</af-badge>
```

Tag:

```html
<af-badge variant="tag">Fuerza</af-badge>
<af-badge variant="tag" tone="primary" icon="plus">Agregar</af-badge>
```

Badge con icono:

```html
<af-badge tone="primary" icon="bluetooth">BLE</af-badge>
```

Tipos sugeridos:

```ts
type AfBadgeTone = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
type AfBadgeVariant = 'soft' | 'solid' | 'outline' | 'tag';
type AfBadgeSize = 'sm' | 'md';
type AfBadgeShape = 'pill' | 'rounded';
```

Inputs sugeridos:

```ts
tone = input<AfBadgeTone>('primary');
variant = input<AfBadgeVariant>('soft');
size = input<AfBadgeSize>('sm');
shape = input<AfBadgeShape>('pill');
dot = input(false);
icon = input<AfIconName | undefined>();
ariaLabel = input<string | undefined>();
```

Requisitos:

- Selector publico adaptativo: `af-badge`.
- Export publico: `AfBadge`.
- Implementaciones internas: `af-badge-desktop` y `af-badge-mobile`.
- Debe soportar content projection.
- Debe usar `AfIcon` cuando `icon` exista.
- Debe mantener API vendor-independent.
- Debe ser standalone y OnPush.
- Debe usar solo tokens `--af-*`.
- `dot` debe ser decorativo y no duplicar informacion para screen readers.
- Si el badge no tiene texto visible y usa solo icono/dot, debe requerir `ariaLabel` o documentar fallback.

## Tokens

Usar tokens existentes siempre que alcance:

- `--af-primary`
- `--af-accent`
- `--af-success`
- `--af-warning`
- `--af-danger`
- `--af-text-muted`
- `--af-bg-interactive`
- `--af-border`
- `--af-radius-pill`
- `--af-radius-md`

Si hace falta agregar tokens, mantenerlos minimos:

- `--af-badge-neutral-bg`
- `--af-badge-neutral-text`

No crear una escala cromatica nueva.

## Implementacion Desktop

Crear `AfBadgeDesktopComponent`.

Requisitos visuales desktop:

- `size="sm"`: `font-size: 11px`, padding aprox `3px 10px`.
- `size="md"`: `font-size: 12px`, padding aprox `5px 12px`.
- `variant="tag"`: radio `8px`, background `--af-bg-interactive`, border `--af-border`.
- `variant="soft"`: background rgba del tono, texto del tono.
- `variant="solid"`: background del tono, texto contrastado.
- `variant="outline"`: border del tono, background transparente o muy sutil.
- Dot de `6px`, `currentColor`.
- Icono `xs` o `sm`, alineado al texto.

## Implementacion Mobile

Crear `AfBadgeMobileComponent`.

Requisitos visuales mobile:

- Debe verse igual de compacto que desktop pero con mejor legibilidad.
- `size="sm"` puede usar `font-size: 10px` o `11px`.
- `size="md"` puede usar `font-size: 12px`.
- No debe parecer un boton ni capturar taps si no hay interaccion.
- Compatible con filas mobile tipo `DeviceRow`.

## Implementacion Adaptive

Crear `AfBadge` como API publica adaptativa.

Requisitos:

- Delegar a desktop/mobile segun `AfPlatformService`.
- Pasar todos los inputs.
- Proyectar contenido.
- Seguir patron de `AfButton`, `AfCard`, `AfInput`, `AfDialog` y `AfChart`.

## Showcase

Agregar seccion `AfBadge` al showcase con:

- Tonos: primary, accent, success, warning, danger, neutral.
- Dot statuses: Conectado, Bateria baja, Desconectado, Activo, Inactivo.
- Variante solid: PRO.
- Variante tag: Fuerza, Velocidad, Salto, + Agregar.
- Badge con icono: BLE con `bluetooth`, CSV con `download`, +18% sin icono.
- Ejemplo dentro de una card de dispositivo o fila compacta.

## Tests Requeridos

### Core

- Tipos exportados desde public API.

### Desktop

- Renderiza contenido proyectado.
- Aplica `data-tone`, `data-variant`, `data-size`, `data-shape`.
- Renderiza dot cuando `dot=true`.
- Renderiza `AfIcon` cuando `icon` existe.
- No renderiza icono cuando no se pasa `icon`.

### Mobile

- Renderiza contenido proyectado.
- Aplica defaults mobile.
- Renderiza dot/icon.
- Mantiene atributos accesibles.

### Adaptive

- Renderiza desktop cuando platform es desktop.
- Renderiza mobile cuando platform es mobile.
- Pasa inputs basicos.
- Proyecta contenido.

### Showcase

- Compila con `AfBadge`.
- Renderiza al menos 10 badges.
- Incluye dot, solid, tag e icon.

## Criterios de Aceptacion

1. Existe `AfBadge` publico desde `@argfit-ui/adaptive`.
2. Existen implementaciones desktop y mobile.
3. Existe contrato tipado en `@argfit-ui/core`.
4. El componente no expone PrimeNG ni Ionic.
5. El componente usa `AfIcon` para iconos.
6. Los tonos coinciden con el design system.
7. Dot status usa `currentColor`.
8. Desktop y mobile se ven consistentes pero pueden ajustar densidad.
9. Showcase muestra tonos, dots, tags, solid e icon badges.
10. `pnpm guard:architecture` pasa.
11. `pnpm build:all` pasa.
12. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-008-af-badge.md`.
- [ ] Revisar `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`.
- [ ] Leer `comp-badges.html`.
- [ ] Leer `desktop/components.jsx` y `mobile/components.jsx`.
- [ ] Crear tipos `badge.types.ts`.
- [ ] Exportar tipos desde core.
- [ ] Crear `AfBadgeDesktopComponent`.
- [ ] Crear `AfBadgeMobileComponent`.
- [ ] Crear `AfBadge` adaptativo.
- [ ] Integrar `AfIcon` opcional.
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

- Badges no se ven como botones.
- Dot queda centrado verticalmente.
- Iconos se alinean a texto sin agrandar el alto.
- `solid` tiene buen contraste.
- `tag` usa radio menor que pill.
- Mobile no rompe filas compactas.
- Light theme conserva contraste.

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-008 — AfBadge Vertical Slice.

Contexto obligatorio:
- Lee docs/hus/HU-008-af-badge.md.
- Lee docs/architecture.md.
- Lee docs/component-philosophy.md.
- Lee docs/design-system.md.
- Revisa AfButton, AfCard, AfInput, AfDialog y AfChart.
- Usa las referencias visuales comp-badges.html, desktop/components.jsx, advanced-table.jsx y mobile/components.jsx.

Objetivo:
Crear AfBadge como componente base adaptativo para estados, tags, versiones y metadata compacta.

Decisiones:
- API publica vendor-independent.
- Usar AfIcon para iconos opcionales.
- Usar tokens --af-*.
- No crear logica de negocio de StatusBadge.

Definition of Done:
- Tipos core exportados.
- Implementaciones desktop/mobile/adaptive.
- Showcase con tonos, dots, tag, solid e icon badges.
- Tests de core/desktop/mobile/adaptive/showcase.
- pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

`AfBadge` prepara el terreno para `AfDataTable`, `AfMetricCard`, `AfDeviceCard`, filtros visuales y estados de sesiones/dispositivos. Es pequeno, pero reduce mucha repeticion visual antes de avanzar hacia tablas y bloques enterprise.
