# HU-009 — AfPageShell Navigation Slice

## Estado

Ready for implementation

## Fase del Roadmap

Fase 3 — Desktop Foundation / Fase 4 — Mobile Foundation / Fase 5 — Adaptive Layer / Fase 6 — Showcase Platform

## Dependencias

Esta HU depende de:

- HU-001 — Formalizar tokens del design system.
- HU-002 — Theme runtime y estilos base.
- HU-003 — Accessibility primitives.
- HU-004 — AfCard vertical slice.
- HU-007 — Icon and Chart Foundations.
- HU-008 — AfBadge vertical slice.

## Decision de Producto

ArgFit UI necesita un shell adaptativo que convierta los componentes base en una aplicacion real: sidebar y topbar en desktop, contenido scrolleable, navegacion inferior en mobile, estados activos claros y un contrato reusable para dashboards, pantallas de atletas, dispositivos, reportes, formularios y analytics.

`AfPageShell` NO debe ser un router, un sistema de permisos ni una plantilla cerrada de dashboard. Debe ser una estructura de aplicacion vendor-independent que permita componer:

- Dashboard desktop con sidebar colapsable y topbar con breadcrumbs.
- Mobile app con contenido vertical y bottom tabs.
- Showcase con navegacion real entre secciones.
- Pantallas enterprise que combinen cards, inputs, dialogs, badges, iconos y charts.
- Futuras piezas como `AfMetricCard`, `AfDataTable`, `AfDeviceCard` y bloques premium.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero un page shell adaptativo, tipado y token-driven, para estructurar pantallas completas con navegacion consistente en desktop y mobile sin acoplar las apps a PrimeNG, Ionic ni estilos inline.

## Objetivo

Crear el vertical slice inicial de `AfPageShell`:

- Tipos publicos de shell, navegacion y breadcrumbs en core.
- Implementacion desktop con sidebar, topbar y area principal.
- Implementacion mobile con safe-area, contenido scrolleable y bottom tabs.
- API adaptativa publica `af-page-shell`.
- Slots para acciones de topbar/header y contenido principal.
- Integracion con `AfIcon` para items de navegacion.
- Integracion opcional con `AfBadge` para contadores compactos.
- Showcase que use el shell para una pantalla tipo dashboard.
- Tests por capa.

## Validacion de Diseno

La HU debe validarse contra las referencias visuales adjuntas. El diseno real muestra navegacion con estas reglas:

- Desktop usa sidebar lateral con fondo dark elevado, borde derecho sutil y ancho colapsable.
- Desktop usa topbar horizontal con titulo, breadcrumbs, busqueda, notificaciones y avatar.
- Mobile usa bottom tabs con icono arriba, label abajo, safe-area inferior y estado activo azul.
- Los items activos usan background soft de primary y texto/icono primary.
- Los items inactivos usan texto muted y transiciones rapidas.
- El contenido debe tener scroll propio y no romper viewport completo.
- La navegacion debe sentirse tecnica, densa y limpia, no como un layout generico.

Referencias detectadas:

- `comp-navigation.html` define bottom tabs mobile y sidebar desktop base.
- `desktop/components.jsx` define `Sidebar` y `TopBar`.
- `desktop/index.html` define `app-shell`, `main-area`, `main-content`, sidebar extendido y cambio de pantalla.
- `mobile/components.jsx` define `MobileTabBar` y `MobileStatusBar`.
- `mobile/index.html` define `phone-frame`, `screen-content`, `MobileTabBar` y home indicator.
- `desktop/screens.jsx` y `mobile/screens.jsx` muestran uso real del shell con dashboards, dispositivos y sesiones.

## Referencias Visuales Obligatorias

Adjuntar al agente:

- `C:\Users\Ander\Downloads\ArgFit\preview\comp-navigation.html`
- `C:\Users\Ander\Downloads\ArgFit\preview\colors-surfaces.html`
- `C:\Users\Ander\Downloads\ArgFit\colors_and_type.css`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\components.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\index.html`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\desktop\screens.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\components.jsx`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\index.html`
- `C:\Users\Ander\Downloads\ArgFit\ui_kits\mobile\screens.jsx`

Opcionales utiles:

- Screenshot desktop dashboard con sidebar expandido.
- Screenshot desktop con sidebar colapsado.
- Screenshot mobile home con bottom tabs.
- Screenshot mobile training screen con bottom tabs.

## Contexto Visual

El shell ArgFit debe sentirse:

- Enterprise.
- Denso sin ser pesado.
- Preparado para dashboards.
- Coherente entre desktop y mobile.
- Integrado con el sistema de tokens.
- Estable para pantallas largas y contenido scrolleable.

No debe sentirse:

- Como un template administrativo generico.
- Como una landing page.
- Como un wrapper visual de PrimeNG o Ionic.
- Como una navegacion con estilos inline repetidos.
- Como un componente que fuerza routing o modelo de negocio.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/navigation.types.ts`
- `projects/argfit-ui-core/src/lib/types/page-shell.types.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/page-shell/af-page-shell-desktop.component.ts`
- `projects/argfit-ui-desktop/src/lib/components/page-shell/af-page-shell-desktop.component.html`
- `projects/argfit-ui-desktop/src/lib/components/page-shell/af-page-shell-desktop.component.scss`
- `projects/argfit-ui-desktop/src/lib/components/page-shell/af-page-shell-desktop.component.spec.ts`
- `projects/argfit-ui-desktop/src/lib/components/sidebar/af-sidebar-desktop.component.ts`
- `projects/argfit-ui-desktop/src/lib/components/sidebar/af-sidebar-desktop.component.html`
- `projects/argfit-ui-desktop/src/lib/components/sidebar/af-sidebar-desktop.component.scss`
- `projects/argfit-ui-desktop/src/lib/components/sidebar/af-sidebar-desktop.component.spec.ts`
- `projects/argfit-ui-desktop/src/lib/components/topbar/af-topbar-desktop.component.ts`
- `projects/argfit-ui-desktop/src/lib/components/topbar/af-topbar-desktop.component.html`
- `projects/argfit-ui-desktop/src/lib/components/topbar/af-topbar-desktop.component.scss`
- `projects/argfit-ui-desktop/src/lib/components/topbar/af-topbar-desktop.component.spec.ts`
- `projects/argfit-ui-desktop/src/public-api.ts`

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/page-shell/af-page-shell-mobile.component.ts`
- `projects/argfit-ui-mobile/src/lib/components/page-shell/af-page-shell-mobile.component.html`
- `projects/argfit-ui-mobile/src/lib/components/page-shell/af-page-shell-mobile.component.scss`
- `projects/argfit-ui-mobile/src/lib/components/page-shell/af-page-shell-mobile.component.spec.ts`
- `projects/argfit-ui-mobile/src/lib/components/bottom-tabs/af-bottom-tabs-mobile.component.ts`
- `projects/argfit-ui-mobile/src/lib/components/bottom-tabs/af-bottom-tabs-mobile.component.html`
- `projects/argfit-ui-mobile/src/lib/components/bottom-tabs/af-bottom-tabs-mobile.component.scss`
- `projects/argfit-ui-mobile/src/lib/components/bottom-tabs/af-bottom-tabs-mobile.component.spec.ts`
- `projects/argfit-ui-mobile/src/public-api.ts`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/page-shell/af-page-shell.component.ts`
- `projects/argfit-ui-adaptive/src/lib/components/page-shell/af-page-shell.component.html`
- `projects/argfit-ui-adaptive/src/lib/components/page-shell/af-page-shell.component.scss`
- `projects/argfit-ui-adaptive/src/lib/components/page-shell/af-page-shell.component.spec.ts`
- `projects/argfit-ui-adaptive/src/lib/components/page-shell/af-page-shell-slots.directive.ts`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- Angular Router integration.
- Guards, permisos, roles o auth.
- Persistencia de sidebar colapsado en localStorage.
- Menu contextual avanzado.
- Nested navigation o grupos colapsables profundos.
- Drawer mobile lateral.
- `AfDataTable`.
- `AfMetricCard`.
- `AfTopbar` o `AfSidebar` como API adaptativa publica independiente.
- Search funcional contra datos reales.
- Notificaciones reales o dropdown de usuario.
- Layout builder o sistema de templates premium.

## API Publica Esperada

Uso basico:

```html
<af-page-shell
  title="Dashboard"
  [navItems]="navItems"
  activeItem="dashboard"
  (navItemSelected)="setActiveSection($event.id)"
>
  <section class="dashboard-grid">
    ...
  </section>
</af-page-shell>
```

Con breadcrumbs y acciones:

```html
<af-page-shell
  title="Atletas"
  subtitle="Seguimiento de rendimiento"
  [breadcrumbs]="breadcrumbs"
  [navItems]="navItems"
  activeItem="athletes"
>
  <div afPageShellActions>
    <af-button size="sm" variant="secondary">Exportar</af-button>
    <af-button size="sm">Nuevo atleta</af-button>
  </div>

  <af-card>
    ...
  </af-card>
</af-page-shell>
```

Con tabs mobile:

```html
<af-page-shell
  title="Inicio"
  [navItems]="desktopNavItems"
  [mobileTabs]="mobileTabs"
  activeItem="dashboard"
  activeTab="home"
  (navItemSelected)="navigate($event.id)"
  (tabSelected)="navigate($event.id)"
>
  ...
</af-page-shell>
```

Tipos sugeridos:

```ts
type AfPageShellDensity = 'compact' | 'comfortable';
type AfPageShellVariant = 'app' | 'dashboard' | 'contained';
type AfNavigationItemKind = 'item' | 'action';

interface AfNavigationItem {
  readonly id: string;
  readonly label: string;
  readonly icon?: AfIconName;
  readonly ariaLabel?: string;
  readonly href?: string;
  readonly disabled?: boolean;
  readonly badge?: string | number;
  readonly kind?: AfNavigationItemKind;
}

interface AfBreadcrumbItem {
  readonly id?: string;
  readonly label: string;
  readonly href?: string;
}
```

Inputs sugeridos:

```ts
title = input<string>('');
subtitle = input<string | undefined>();
navItems = input<readonly AfNavigationItem[]>([]);
mobileTabs = input<readonly AfNavigationItem[]>([]);
breadcrumbs = input<readonly AfBreadcrumbItem[]>([]);
activeItem = input<string | undefined>();
activeTab = input<string | undefined>();
density = input<AfPageShellDensity>('comfortable');
variant = input<AfPageShellVariant>('dashboard');
collapsible = input(true, { transform: booleanAttribute });
collapsed = input(false, { transform: booleanAttribute });
showSearch = input(false, { transform: booleanAttribute });
searchPlaceholder = input('Buscar...');
notificationCount = input<number | undefined>();
userInitials = input<string | undefined>();
ariaLabel = input<string>('Navegacion principal');
```

Outputs sugeridos:

```ts
navItemSelected = output<AfNavigationItem>();
tabSelected = output<AfNavigationItem>();
breadcrumbSelected = output<AfBreadcrumbItem>();
collapsedChange = output<boolean>();
searchChanged = output<string>();
```

Slots sugeridos:

```html
<div afPageShellBrand>...</div>
<div afPageShellActions>...</div>
<div afPageShellUser>...</div>
<div afPageShellFooter>...</div>
```

Requisitos:

- Selector publico adaptativo: `af-page-shell`.
- Export publico: `AfPageShellComponent`.
- Implementaciones internas: `af-page-shell-desktop` y `af-page-shell-mobile`.
- Sidebar/topbar desktop pueden exportarse desde desktop para tests y composicion interna.
- Bottom tabs mobile puede exportarse desde mobile para tests y composicion interna.
- Debe soportar content projection.
- Debe usar `AfIcon` para iconos de navegacion.
- Debe usar `AfBadge` si se renderiza `badge`.
- Debe mantener API vendor-independent.
- Debe ser standalone y OnPush.
- Debe usar solo tokens `--af-*`.
- Debe permitir que el consumidor maneje routing mediante outputs o `href`.
- Si un item tiene `href`, renderizar anchor semantico; si no, renderizar button.
- `disabled` debe impedir emision de eventos y marcar `aria-disabled`.
- La navegacion activa debe exponerse con `aria-current="page"` cuando aplique.

## Tokens

Usar tokens existentes siempre que alcance:

- `--af-bg-main`
- `--af-bg-surface`
- `--af-bg-elevated`
- `--af-bg-interactive`
- `--af-text-main`
- `--af-text-muted`
- `--af-text-soft`
- `--af-primary`
- `--af-primary-soft`
- `--af-border`
- `--af-border-soft`
- `--af-radius-sm`
- `--af-radius-md`
- `--af-radius-lg`
- `--af-radius-pill`
- `--af-shadow-sm`

Si hace falta agregar tokens, mantenerlos minimos:

- `--af-shell-sidebar-width`
- `--af-shell-sidebar-collapsed-width`
- `--af-shell-topbar-height`
- `--af-shell-mobile-tabbar-height`

No crear una escala nueva de layout ni hardcodear colores.

## Implementacion Desktop

Crear `AfPageShellDesktopComponent`, `AfSidebarDesktopComponent` y `AfTopbarDesktopComponent`.

Requisitos visuales desktop:

- Layout raiz full-height con `display: flex`.
- Sidebar expandido aprox `220px`.
- Sidebar colapsado aprox `64px`.
- Topbar altura aprox `60px` a `64px`.
- Main area con `min-width: 0` para evitar overflow horizontal.
- Content area scrolleable con padding `24px`.
- Sidebar con background dark elevado y borde derecho soft.
- Topbar con borde inferior soft y fondo main/elevated.
- Active nav item con `--af-primary-soft` o equivalente tokenizado.
- Iconos de nav `sm` o `md`, alineados a label.
- Badge de contador opcional alineado a la derecha.
- Collapse toggle accesible y visible solo si `collapsible=true`.
- Al colapsar, labels se ocultan pero iconos mantienen `aria-label`.

## Implementacion Mobile

Crear `AfPageShellMobileComponent` y `AfBottomTabsMobileComponent`.

Requisitos visuales mobile:

- Layout raiz full viewport con columna.
- Header mobile compacto con titulo y slot de acciones si existe.
- Content area vertical scrolleable.
- Bottom tabs fijo al final del shell, no a la ventana global.
- Padding inferior compatible con safe-area.
- Tabs con icono arriba y label abajo.
- Active tab con tono primary y background soft.
- Labels de tabs legibles entre `10px` y `12px`.
- Soportar entre 3 y 5 tabs sin romper layout.
- Si hay mas de 5 tabs, documentar que se debe priorizar navegacion secundaria fuera de esta HU.
- No crear frame de telefono en la libreria. El phone frame es solo una referencia de showcase.

## Implementacion Adaptive

Crear `AfPageShellComponent` como API publica adaptativa.

Requisitos:

- Delegar a desktop/mobile segun `AfPlatformService`.
- Pasar todos los inputs.
- Reemitir todos los outputs.
- Proyectar contenido y slots.
- Seguir patron de `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart` y `AfBadge`.
- No duplicar logica de rendering interna en adaptive.

## Showcase

Agregar una seccion/pantalla que use `AfPageShell` con:

- Sidebar desktop con Dashboard, Atletas, Dispositivos, Analytics, Reportes y Configuracion.
- Bottom tabs mobile con Inicio, Entrenar, Analytics, Dispositivos y Ajustes.
- Titulo y breadcrumbs visibles en desktop.
- Acciones de topbar con `AfButton`.
- Contador de notificacion con `AfBadge`.
- Contenido compuesto con `AfCard`, `AfBadge`, `AfIcon` y `AfChart`.
- Ejemplo de cambio de seccion local sin Angular Router.
- Estado colapsado demostrable en desktop.

El showcase debe priorizar la experiencia util, no una pagina explicativa. La primera vista debe verse como una app real.

## Tests Requeridos

### Core

- Tipos exportados desde public API.
- `AfNavigationItem` acepta icono tipado `AfIconName`.
- `AfBreadcrumbItem` exportado desde public API.

### Desktop

- Renderiza contenido proyectado.
- Renderiza sidebar con items.
- Renderiza topbar con titulo.
- Marca item activo con `aria-current`.
- Emite `navItemSelected` al activar un item.
- No emite cuando el item esta disabled.
- Renderiza iconos via `AfIcon`.
- Renderiza badge cuando el item tiene `badge`.
- Alterna collapsed y emite `collapsedChange`.
- Renderiza breadcrumbs y emite `breadcrumbSelected`.

### Mobile

- Renderiza contenido proyectado.
- Renderiza bottom tabs.
- Marca tab activo con `aria-current`.
- Emite `tabSelected`.
- No emite para tab disabled.
- Usa safe-area padding en tabbar.
- Renderiza header compacto con titulo.

### Adaptive

- Renderiza desktop cuando platform es desktop.
- Renderiza mobile cuando platform es mobile.
- Pasa nav items, mobile tabs, active item y title.
- Reemite outputs desktop/mobile.
- Proyecta contenido y slots.

### Showcase

- Compila con `AfPageShell`.
- Incluye al menos 5 items desktop.
- Incluye al menos 4 tabs mobile.
- Incluye `AfBadge`, `AfIcon`, `AfCard` y `AfChart` dentro del shell.
- Permite cambiar seccion localmente sin Router.

## Criterios de Aceptacion

1. Existe `AfPageShell` publico desde `@argfit-ui/adaptive`.
2. Existen implementaciones desktop y mobile.
3. Existe contrato tipado en `@argfit-ui/core`.
4. El shell no expone PrimeNG ni Ionic.
5. Sidebar desktop usa `AfIcon` para items.
6. Bottom tabs mobile usa `AfIcon` para tabs.
7. Badges de navegacion usan `AfBadge`.
8. Desktop soporta sidebar colapsable.
9. Mobile soporta bottom tabs con safe-area.
10. Content projection funciona en ambas plataformas.
11. La navegacion activa es accesible con `aria-current`.
12. Showcase muestra una app real, no una landing page.
13. `pnpm guard:architecture` pasa.
14. `pnpm build:all` pasa.
15. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-009-af-page-shell.md`.
- [ ] Leer `docs/architecture.md`.
- [ ] Leer `docs/component-philosophy.md`.
- [ ] Leer `docs/design-system.md`.
- [ ] Revisar `AfButton`, `AfCard`, `AfDialog`, `AfChart` y `AfBadge`.
- [ ] Leer `comp-navigation.html`.
- [ ] Leer `desktop/components.jsx` y `desktop/index.html`.
- [ ] Leer `mobile/components.jsx` y `mobile/index.html`.
- [ ] Crear tipos `navigation.types.ts`.
- [ ] Crear tipos `page-shell.types.ts`.
- [ ] Exportar tipos desde core.
- [ ] Crear `AfSidebarDesktopComponent`.
- [ ] Crear `AfTopbarDesktopComponent`.
- [ ] Crear `AfPageShellDesktopComponent`.
- [ ] Crear `AfBottomTabsMobileComponent`.
- [ ] Crear `AfPageShellMobileComponent`.
- [ ] Crear `AfPageShellComponent` adaptativo.
- [ ] Crear directivas de slots de page shell.
- [ ] Integrar `AfIcon`.
- [ ] Integrar `AfBadge` para contadores.
- [ ] Agregar shell real al showcase.
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

- Desktop ocupa el viewport completo sin scroll doble innecesario.
- Sidebar expandido y colapsado se ven estables.
- Topbar no tapa contenido.
- Breadcrumbs no compiten con el titulo.
- Items activos son claros sin saturar la UI.
- Mobile muestra bottom tabs dentro del shell y respeta safe-area.
- Mobile no se siente como desktop comprimido.
- Content area scrollea sin mover la navegacion principal.
- Light theme conserva contraste suficiente.

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-009 — AfPageShell Navigation Slice.

Contexto obligatorio:
- Lee docs/hus/HU-009-af-page-shell.md.
- Lee docs/architecture.md.
- Lee docs/component-philosophy.md.
- Lee docs/design-system.md.
- Revisa AfButton, AfCard, AfDialog, AfChart y AfBadge.
- Usa las referencias visuales comp-navigation.html, desktop/components.jsx, desktop/index.html, mobile/components.jsx y mobile/index.html.

Objetivo:
Crear AfPageShell como shell adaptativo para estructurar pantallas completas con sidebar/topbar desktop y bottom tabs mobile.

Decisiones:
- API publica vendor-independent.
- Usar AfIcon para navegacion.
- Usar AfBadge para contadores opcionales.
- Usar tokens --af-*.
- No implementar router, auth ni permisos.
- No exponer PrimeNG/Ionic.

Definition of Done:
- Tipos core exportados.
- Implementaciones desktop/mobile/adaptive.
- Showcase con pantalla tipo app real.
- Tests de core/desktop/mobile/adaptive/showcase.
- pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

`AfPageShell` cambia el sistema de componentes sueltos a experiencia de aplicacion. Despues de esta HU, ArgFit UI queda mejor preparado para `AfMetricCard`, `AfDataTable`, dashboards completos, mobile flows y un showcase que funcione como portfolio real del design system.
