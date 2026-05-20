# HU-014 — AfFeedback Toast Slice

## Estado

Ready for implementation

## Fase del Roadmap

Fase 2 — Primitive Foundation / Fase 3 — Desktop Foundation / Fase 4 — Mobile Foundation / Fase 5 — Adaptive Layer / Fase 7 — Enterprise Systems

## Dependencias

Esta HU depende de:

- HU-001 — Formalizar tokens del design system.
- HU-002 — Theme runtime y estilos base.
- HU-003 — Accessibility primitives.
- HU-006 — AfDialog vertical slice.
- HU-007 — Icon and Chart Foundations.
- HU-008 — AfBadge vertical slice.
- HU-009 — AfPageShell navigation slice.

## Decision de Producto

ArgFit UI necesita un sistema de feedback para confirmar acciones, advertir errores y comunicar estados temporales: dispositivo conectado, bateria baja, error BLE, firmware disponible, sesion guardada o reporte exportado.

Esta HU debe crear dos piezas:

- `AfToast` + `AfToastViewport` + servicio/store para notificaciones temporales.
- `AfInlineMessage` para mensajes persistentes dentro de pantallas, dialogs y formularios.

`AfFeedback` NO debe reemplazar `AfDialog` ni implementar un notification center completo.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero toasts e inline messages adaptativos, accesibles y token-driven, para comunicar feedback de sistema sin depender de PrimeNG/Ionic ni duplicar patrones visuales.

## Objetivo

Crear el vertical slice completo de feedback:

- Tipos publicos en core.
- Servicio/store `AfToastService`.
- Viewport/host de toasts.
- Componente `AfToast`.
- Componente `AfInlineMessage`.
- Implementacion desktop.
- Implementacion mobile.
- API adaptativa publica.
- Showcase con acciones reales.
- Tests por capa.

## Referencias del Design System

Todos los archivos de Claude Design estan disponibles localmente en `docs/claude-design`.

Referencias obligatorias:

- `docs/claude-design/README.md`
- `docs/claude-design/SKILL.md`
- `docs/claude-design/colors_and_type.css`
- `docs/claude-design/preview/comp-toasts.html`
- `docs/claude-design/ui_kits/desktop/overlays.jsx`
- `docs/claude-design/ui_kits/mobile/overlays.jsx`

Referencias opcionales utiles:

- `docs/claude-design/preview/comp-buttons.html`
- `docs/claude-design/preview/comp-badges.html`
- `docs/claude-design/ui_kits/desktop/forms.jsx`
- `docs/claude-design/ui_kits/mobile/forms.jsx`

## Screenshots Que Debe Adjuntar El Agente

Adjuntar al agente:

- Screenshot de `comp-toasts.html` con success, warning, error e info.
- Screenshot desktop de `OverlaysScreen` con inline messages.
- Screenshot desktop de toast stack top-right.
- Screenshot desktop de toast sticky.
- Screenshot mobile de inline messages.
- Screenshot mobile de toast top dentro del phone frame.
- Screenshot mobile de warning/error toast si existe.

Si no hay screenshots, usar `docs/claude-design/preview/comp-toasts.html`, `docs/claude-design/ui_kits/desktop/overlays.jsx` y `docs/claude-design/ui_kits/mobile/overlays.jsx` como referencia principal.

## Validacion de Diseno

La implementacion debe respetar:

- Toast desktop top-right, stack vertical, ancho aprox 360-380px.
- Toast mobile top dentro del shell/viewport, left/right 12px.
- Surface dark, borde semantico sutil y shadow controlado.
- Severity: success, info, warning, danger.
- Icono semantico en box pequeno.
- Texto principal corto y detalle opcional.
- Close button accesible.
- Inline message con fondo soft, borde semantico y layout compacto.
- Motion 250-300ms con easing del design system.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/types/feedback.types.ts`
- `projects/argfit-ui-core/src/lib/services/toast.service.ts`
- `projects/argfit-ui-core/src/public-api.ts`

### Desktop

Paths esperados:

- `projects/argfit-ui-desktop/src/lib/components/toast/af-toast-desktop.component.ts`
- `projects/argfit-ui-desktop/src/lib/components/toast/af-toast-desktop.component.html`
- `projects/argfit-ui-desktop/src/lib/components/toast/af-toast-desktop.component.scss`
- `projects/argfit-ui-desktop/src/lib/components/toast/af-toast-desktop.component.spec.ts`
- `projects/argfit-ui-desktop/src/lib/components/toast-viewport/af-toast-viewport-desktop.component.ts`
- `projects/argfit-ui-desktop/src/lib/components/inline-message/af-inline-message-desktop.component.ts`
- `projects/argfit-ui-desktop/src/public-api.ts`

### Mobile

Paths esperados:

- `projects/argfit-ui-mobile/src/lib/components/toast/af-toast-mobile.component.ts`
- `projects/argfit-ui-mobile/src/lib/components/toast/af-toast-mobile.component.html`
- `projects/argfit-ui-mobile/src/lib/components/toast/af-toast-mobile.component.scss`
- `projects/argfit-ui-mobile/src/lib/components/toast/af-toast-mobile.component.spec.ts`
- `projects/argfit-ui-mobile/src/lib/components/toast-viewport/af-toast-viewport-mobile.component.ts`
- `projects/argfit-ui-mobile/src/lib/components/inline-message/af-inline-message-mobile.component.ts`
- `projects/argfit-ui-mobile/src/public-api.ts`

### Adaptive

Paths esperados:

- `projects/argfit-ui-adaptive/src/lib/components/toast/af-toast.component.ts`
- `projects/argfit-ui-adaptive/src/lib/components/toast-viewport/af-toast-viewport.component.ts`
- `projects/argfit-ui-adaptive/src/lib/components/inline-message/af-inline-message.component.ts`
- `projects/argfit-ui-adaptive/src/public-api.ts`

### Showcase

Paths esperados:

- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- Notification center persistente.
- Push notifications del browser.
- WebSocket/event bus.
- Undo queue global.
- Dialogs o bottom sheets nuevos.
- Sonidos o vibracion.
- Persistencia de toasts.
- Integracion con router.

## API Publica Esperada

Toast service:

```ts
toast.success({ title: 'Sesion guardada', description: '12 saltos registrados.' });
toast.info({ title: 'Dispositivo sincronizado', description: 'ArgFit Jump 2 conectado via BLE.' });
toast.warning({ title: 'Bateria baja', description: '15% restante.' });
toast.danger({ title: 'Error BLE', description: 'No se pudo conectar.' });
```

Viewport:

```html
<af-toast-viewport />
```

Inline message:

```html
<af-inline-message
  severity="warning"
  title="Sesion sin finalizar"
  description="Existe una sesion sin guardar del 17 May."
/>
```

Tipos sugeridos:

```ts
type AfFeedbackSeverity = 'success' | 'info' | 'warning' | 'danger';
type AfToastPlacement = 'top-end' | 'top-center' | 'bottom-center';

interface AfToastOptions {
  readonly title: string;
  readonly description?: string;
  readonly severity?: AfFeedbackSeverity;
  readonly duration?: number;
  readonly persistent?: boolean;
  readonly id?: string;
}
```

Requisitos:

- `AfToastService` debe usar signals o estado reactivo simple.
- `duration=0` o `persistent=true` no debe autocerrar.
- Close manual debe remover el toast.
- Viewport adaptativo decide desktop/mobile.
- `AfInlineMessage` debe poder ser closable o no.
- Usar `role="status"` para info/success y `role="alert"` para warning/danger.
- Respetar `prefers-reduced-motion`.
- Usar `AfIcon`.
- Usar solo tokens `--af-*`.

## Implementacion Desktop

Requisitos:

- Viewport fixed top-right.
- Stack vertical con gap 8px.
- Toast ancho aprox 380px.
- Icon box 32px.
- Title 13px/600, description 12px muted.
- Close button iconico.

## Implementacion Mobile

Requisitos:

- Viewport dentro del shell cuando sea posible.
- Top inset con safe-area.
- Toast full width con left/right 12px.
- Tap/close accesible.
- Texto en una o dos lineas antes de wrap.

## Showcase

Agregar seccion:

- Botones para success/info/warning/danger.
- Boton para sticky/persistent.
- Inline messages de todas las severities.
- Ejemplo de toast disparado desde accion de formulario.
- Ejemplo de toast disparado desde dialog success.

## Tests Requeridos

- Core: service agrega, remueve, autocierra y limpia toasts.
- Desktop: toast renderiza severity, title, description, close.
- Mobile: toast renderiza severity y close.
- Inline message renderiza roles correctos.
- Adaptive: viewport delega desktop/mobile.
- Showcase: botones disparan toasts.

## Criterios de Aceptacion

1. Existe `AfToastService` publico desde `@argfit-ui/core`.
2. Existe `AfToastViewport` publico desde `@argfit-ui/adaptive`.
3. Existe `AfInlineMessage` publico desde `@argfit-ui/adaptive`.
4. Existen implementaciones desktop y mobile.
5. Severities success/info/warning/danger funcionan.
6. Autocierre y persistent funcionan.
7. Roles ARIA son correctos.
8. Showcase muestra toasts e inline messages.
9. `pnpm guard:architecture` pasa.
10. `pnpm build:all` pasa.
11. `pnpm test:all` pasa.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-014-af-feedback-toast.md`.
- [ ] Leer `docs/claude-design/preview/comp-toasts.html`.
- [ ] Leer `docs/claude-design/ui_kits/desktop/overlays.jsx`.
- [ ] Leer `docs/claude-design/ui_kits/mobile/overlays.jsx`.
- [ ] Crear tipos core.
- [ ] Crear `AfToastService`.
- [ ] Crear toast/viewport desktop.
- [ ] Crear toast/viewport mobile.
- [ ] Crear inline message desktop/mobile/adaptive.
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
Implementa HU-014 — AfFeedback Toast Slice.

Lee docs/hus/HU-014-af-feedback-toast.md, docs/architecture.md, docs/component-philosophy.md y docs/design-system.md.
Usa docs/claude-design/preview/comp-toasts.html, docs/claude-design/ui_kits/desktop/overlays.jsx y docs/claude-design/ui_kits/mobile/overlays.jsx.

Objetivo:
Crear AfToastService, AfToastViewport y AfInlineMessage con rendering adaptativo, severities, autocierre, persistent y accesibilidad.

Definition of Done:
Tipos y service core exportados, implementaciones desktop/mobile/adaptive, showcase de feedback, tests por capa, pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

HU-014 completa el feedback de sistema necesario para flujos enterprise: guardar sesiones, exportar reportes, conectar dispositivos y advertir errores sin interrumpir al usuario con dialogs innecesarios.
