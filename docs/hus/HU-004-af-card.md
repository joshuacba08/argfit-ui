# HU-004 — AfCard Vertical Slice

## Estado

Ready for implementation

## Fase del Roadmap

Fase 3 — Desktop Foundation / Fase 4 — Mobile Foundation / Fase 5 — Adaptive Layer

## Dependencias

Esta HU depende de:

- HU-001 — Formalizar tokens del design system.
- HU-002 — Theme runtime y estilos base.
- HU-003 — Accessibility primitives.
- `AfButton` vertical slice funcionando como referencia.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero un componente `AfCard` adaptativo, token-driven y visualmente alineado al design system, para construir dashboards, paneles, modales, listas mobile y superficies enterprise sin hardcodear estilos en cada feature.

## Objetivo

Implementar el primer componente visual base despues de `AfButton`: `AfCard`.

`AfCard` debe:

- Representar una superficie semantica de ArgFit UI.
- Renderizar desktop y mobile con el mismo contrato publico.
- Usar tokens de `@argfit-ui/core`.
- No sentirse como PrimeNG default ni Ionic default.
- Servir como base para metric cards, device rows, kanban cards, chart panels y form panels.

## Referencias Visuales Obligatorias

Para esta HU SI hacen falta referencias visuales.

Adjuntar al agente al menos:

- Screenshot desktop dashboard.
- Screenshot desktop tabla avanzada.
- Screenshot desktop kanban.
- Screenshot mobile home.
- Screenshot mobile charts.
- Screenshot mobile overlays.
- `C:\Users\Ander\Downloads\ArgFit\preview\comp-cards.html`
- `C:\Users\Ander\Downloads\ArgFit\preview\spacing-radii.html`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\components.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\components.jsx`

Opcionales utiles:

- `C:\Users\Ander\Downloads\ArgFit\preview\comp-badges.html`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\kanban.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\overlays.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\overlays.jsx`

## Contexto Visual

El card ArgFit debe sentirse:

- Dark-first.
- Azul/navy profundo.
- Borde sutil azulado.
- Radio moderado de 8–12px.
- Sombra contenida, sin efecto material pesado.
- Denso en desktop.
- Comodo/tactil en mobile.
- Preparado para datos, metricas, dispositivos y acciones.

No debe sentirse:

- Como `p-card` default.
- Como `ion-card` default.
- Como una tarjeta decorativa de landing page.
- Como un wrapper generico sin identidad visual.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/card.types.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/card/`
- `projects/argfit-ui-desktop/src/public-api.ts`
- `projects/argfit-ui-desktop/package.json` si hace falta ajustar peer deps.

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/card/`
- `projects/argfit-ui-mobile/src/public-api.ts`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/card/`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- `AfMetricCard` como componente separado.
- `AfDataTable`.
- `AfInput`.
- `AfDialog`.
- Sistema de charts.
- Drag and drop kanban.
- Layout shell completo.
- Nuevos themes.
- Persistencia de theme.

Se pueden mostrar ejemplos de metric card o device card usando `AfCard` + contenido proyectado, pero no crear componentes publicos nuevos.

## API Publica Esperada

Uso basico:

```html
<af-card> Content </af-card>
```

Uso con slots semanticos:

```html
<af-card variant="surface" density="comfortable">
  <header afCardHeader>
    <div>
      <h3 afCardTitle>Sesiones semanales</h3>
      <p afCardSubtitle>Ultimos 3 meses</p>
    </div>
    <button type="button">Accion</button>
  </header>

  <section afCardContent>Content</section>

  <footer afCardFooter>Footer</footer>
</af-card>
```

Metric-style example:

```html
<af-card variant="metric">
  <span afCardEyebrow>Atletas activos</span>
  <strong>38</strong>
  <span>12% vs mes anterior</span>
</af-card>
```

Interactive example:

```html
<af-card interactive selected> ArgFit Jump 2 </af-card>
```

## Inputs Requeridos

El contrato puede ajustarse, pero debe cubrir:

```ts
type AfCardVariant = 'surface' | 'elevated' | 'metric' | 'device' | 'panel';
type AfCardDensity = 'compact' | 'comfortable';
type AfCardTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
```

Inputs sugeridos:

```ts
variant = input<AfCardVariant>('surface');
density = input<AfCardDensity>('comfortable');
tone = input<AfCardTone>('neutral');
interactive = input(false);
selected = input(false);
```

Reglas:

- `interactive=true` debe agregar affordance visual y estados hover/focus.
- `selected=true` debe marcar borde/fondo usando primary tokens.
- `tone` debe afectar detalles sutiles, no convertir toda la card en un bloque saturado.
- Mobile puede aumentar padding/min-height respecto a desktop.

## Selectores Auxiliares

Agregar directives standalone simples para slots semanticos, si el equipo lo ve util:

```txt
[afCardHeader]
[afCardTitle]
[afCardSubtitle]
[afCardEyebrow]
[afCardContent]
[afCardFooter]
```

Estas directives no deben tener logica pesada. Pueden existir para styling semantico y consistencia.

Si se decide no crear directives auxiliares, documentar el motivo en el README del paquete correspondiente y mantener la API simple.

## Implementacion Desktop

Crear `AfCardDesktopComponent`.

Requisitos:

- Puede usar PrimeNG internamente si aporta valor, pero no debe exponer API PrimeNG.
- Si `p-card` dificulta la identidad visual, se permite usar markup propio en desktop layer.
- Debe usar tokens `--af-*`.
- Debe soportar projected content.
- Debe soportar variantes, density, tone, interactive y selected.
- Debe tener OnPush.
- Debe ser standalone.

Visual desktop esperado:

- `background: var(--af-card-bg)` o surface token equivalente.
- `border: 1px solid var(--af-card-border)`.
- `border-radius: var(--af-radius-lg)` o `--af-radius-xl` segun variante.
- `padding` entre `--af-space-4` y `--af-space-5`.
- Hover muy sutil para interactive.
- Focus visible usando `--af-focus-ring`.

## Implementacion Mobile

Crear `AfCardMobileComponent`.

Requisitos:

- Puede usar Ionic internamente si aporta valor, pero no debe exponer API Ionic.
- Si `ion-card` introduce estilos default dificiles de controlar, se permite usar markup propio en mobile layer.
- Debe respetar tap targets y mayor comodidad tactil.
- Debe usar tokens `--af-*`.
- Debe soportar projected content.
- Debe tener OnPush.
- Debe ser standalone.

Visual mobile esperado:

- Full-width friendly.
- Radius 12px.
- Padding minimo 16px.
- Estados pressed/interactive sutiles.
- Sin sombras pesadas.
- Compatible con bottom navigation y safe-area layouts futuros.

## Implementacion Adaptive

Crear `AfCard` como API publica adaptativa.

Requisitos:

- Selector publico: `af-card`.
- Export publico: `AfCard`.
- Debe delegar a desktop/mobile segun `AfPlatformService`.
- No debe contener logica de negocio.
- Debe pasar inputs y projected content.
- Debe seguir el patron del `AfButton` vertical slice.

## Showcase

Agregar una seccion sencilla de cards al showcase:

- Basic card.
- Metric card example.
- Device status card example.
- Interactive/selected card example.
- Comparacion desktop/mobile mediante el toggle/plataforma existente si aplica.

No crear una landing page.

El showcase debe usar contenido realista de ArgFit:

- Atletas activos.
- ArgFit Jump 2.
- Sesiones semanales.
- Mejor salto.
- Bateria/dispositivo.

## Tests Requeridos

### Core

- Tipos exportados desde public API.

### Desktop

- Renderiza contenido proyectado.
- Aplica clases/atributos para variant/density/tone.
- `interactive` y `selected` reflejan estado en host.

### Mobile

- Renderiza contenido proyectado.
- Aplica clases/atributos para variant/density/tone.
- `interactive` y `selected` reflejan estado en host.

### Adaptive

- Renderiza desktop cuando platform es desktop.
- Renderiza mobile cuando platform es mobile.
- Pasa inputs basicos.
- Proyecta contenido.

### Showcase

- Compila con `AfCard`.
- Renderiza ejemplos principales.

## Criterios de Aceptacion

1. Existe `AfCard` publico desde `@argfit-ui/adaptive`.
2. Existen implementaciones desktop y mobile.
3. La API publica no menciona PrimeNG ni Ionic.
4. Los estilos usan tokens `--af-*`.
5. No hay colores, spacing, shadows o radius hardcodeados salvo fallback estrictamente justificado.
6. `AfCard` soporta content projection.
7. `AfCard` soporta variant, density, tone, interactive y selected.
8. El showcase muestra al menos 4 ejemplos.
9. La UI se parece razonablemente a las referencias de Claude Design para cards/surfaces.
10. `pnpm guard:architecture` pasa.
11. `pnpm build:all` pasa.
12. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-004-af-card.md`.
- [ ] Leer `docs/architecture.md`.
- [ ] Leer `docs/component-philosophy.md`.
- [ ] Revisar `AfButton` vertical slice.
- [ ] Revisar referencias visuales de cards.
- [ ] Crear tipos de card en core.
- [ ] Crear `AfCardDesktopComponent`.
- [ ] Crear `AfCardMobileComponent`.
- [ ] Crear `AfCard` adaptativo.
- [ ] Exportar APIs publicas.
- [ ] Agregar ejemplos al showcase.
- [ ] Escribir tests.
- [ ] Verificar visualmente en browser desktop/mobile.
- [ ] Formatear archivos.
- [ ] Ejecutar validaciones.

## Comandos de Validacion

```bash
pnpm guard:architecture
pnpm build:desktop
pnpm build:mobile
pnpm build:adaptive
ng test argfit-ui-desktop --watch=false
ng test argfit-ui-mobile --watch=false
ng test argfit-ui-adaptive --watch=false
ng test showcase --watch=false
pnpm build:all
pnpm test:all
```

## Verificacion Visual

Despues de implementar, abrir el showcase y revisar:

- Desktop ancho: cards alineadas, densas, sin spacing roto.
- Mobile viewport: cards full-width, padding comodo, texto sin overflow.
- Theme dark: superficies respetan tokens.
- Theme light si HU-002 lo habilito: legibilidad minima aceptable.
- Focus visible en cards interactivas.

Si se usa Browser/Playwright, tomar screenshots en:

```txt
desktop: 1440x900
mobile: 390x844
```

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-004 — AfCard Vertical Slice.

Contexto obligatorio:
- Lee docs/hus/HU-004-af-card.md.
- Lee docs/architecture.md.
- Lee docs/component-philosophy.md.
- Revisa el vertical slice existente de AfButton.
- Usa las referencias visuales adjuntas de Claude Design, especialmente comp-cards.html, desktop components.jsx y mobile components.jsx.

Objetivo:
Crear AfCard como componente adaptativo completo: core types, desktop implementation, mobile implementation, adaptive public API y ejemplos en showcase.

Alcance:
- projects/argfit-ui-core/src/lib/types/card.types.ts
- projects/argfit-ui-desktop/src/lib/components/card/
- projects/argfit-ui-mobile/src/lib/components/card/
- projects/argfit-ui-adaptive/src/lib/components/card/
- public-api.ts de cada paquete afectado
- projects/showcase/src/app/

No implementes AfMetricCard, AfInput, AfDialog, tablas ni layouts completos. No expongas APIs de PrimeNG/Ionic. Usa tokens --af-*.

Definition of Done:
- AfCard existe desde @argfit-ui/adaptive.
- Desktop/mobile/adaptive compilan.
- Content projection funciona.
- variant, density, tone, interactive y selected estan soportados.
- Showcase muestra basic, metric, device e interactive cards.
- pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

Esta HU inaugura el lenguaje visual reutilizable. Si `AfCard` queda bien, los siguientes componentes pueden crecer rapido sin duplicar superficies ni romper identidad visual.
