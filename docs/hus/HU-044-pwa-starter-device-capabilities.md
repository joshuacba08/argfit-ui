# HU-044 - PWA Starter And Device Capability Demo

## Estado

Implemented

## Fase Del Roadmap

Fase 14 - PWA And Device Capability Starter / Fase 6 - Showcase Platform

## Dependencias

Esta HU depende de:

- HU-041 - Productive Documentation Site.
- HU-043 - Production 1.0 Release Gate, only as release baseline context.

## Decision De Producto

ArgFit UI debe poder demostrar que su contrato adaptive sirve para aplicaciones instalables en desktop, tablet y mobile sin convertir la libreria core en una capa de hardware.

La PWA y las capacidades de dispositivo deben vivir en una app consumidora o starter. ArgFit UI aporta componentes, tokens, theming, feedback, layout adaptive y accesibilidad; la app aporta service worker, manifest, permisos, transporte Bluetooth y fallback por plataforma.

## Historia De Usuario

Como equipo que construye aplicaciones con ArgFit UI, quiero un starter PWA instalable con una demo de conexion a dispositivos, para validar flujos reales en desktop, tablet y mobile sin depender de PrimeNG, Ionic o APIs nativas como contrato publico.

## Objetivo

Crear una aplicacion starter PWA que demuestre:

- Instalacion como PWA en desktop y mobile.
- Shell responsive con `@argfit-ui/adaptive` y `platform: 'auto'`.
- Offline/app shell despues de la primera carga.
- Prompt de actualizacion cuando el service worker detecta nueva version.
- Deteccion de capacidades de dispositivo.
- Demo BLE usando Web Bluetooth cuando el navegador lo soporte.
- Fallback claro para iOS/iPadOS Safari y navegadores sin Web Bluetooth.
- Interfaz de transporte preparada para una futura implementacion nativa/hibrida.

## Alcance Incluido

Paths esperados:

- `projects/argfit-ui-pwa-starter/`
- `projects/argfit-ui-pwa-starter/public/manifest.webmanifest`
- `projects/argfit-ui-pwa-starter/public/icons/*`
- `projects/argfit-ui-pwa-starter/src/app/app.config.ts`
- `projects/argfit-ui-pwa-starter/src/app/app.routes.ts`
- `projects/argfit-ui-pwa-starter/src/app/services/install-prompt.service.ts`
- `projects/argfit-ui-pwa-starter/src/app/services/network-status.service.ts`
- `projects/argfit-ui-pwa-starter/src/app/services/pwa-update.service.ts`
- `projects/argfit-ui-pwa-starter/src/app/services/device-connection.service.ts`
- `projects/argfit-ui-pwa-starter/src/app/services/ble-transport.ts`
- `projects/argfit-ui-pwa-starter/src/app/services/native-device-transport.ts`
- `projects/argfit-ui-pwa-starter/src/app/pages/device-demo/*`
- `projects/argfit-ui-pwa-starter/src/app/pages/offline/*`
- `projects/argfit-ui-pwa-starter/src/app/pages/install/*`
- `projects/argfit-ui-pwa-starter/src/app/types/device-capabilities.types.ts`
- `projects/argfit-ui-pwa-starter/src/styles.css`
- `ngsw-config.json` or the Angular CLI generated service worker config for this app
- `angular.json`
- `package.json`
- `README.md`
- `docs/pwa/quickstart.md`
- `docs/pwa/device-capabilities.md`
- `docs/pwa/browser-support.md`

## PWA Requirements

- Use the Angular PWA/service worker integration for the starter app.
- Register service worker only for production builds.
- Manifest includes `name`, `short_name`, `start_url`, `display`, `theme_color`, `background_color`, 192px icon and 512px icon.
- `display` must be `standalone` unless a documented reason chooses `window-controls-overlay` or another display mode.
- The app shell must use `provideArgfitUi({ platform: 'auto' })`.
- The first screen must be the usable starter experience, not a landing page.
- Offline state must be visible and actionable.
- Application updates must surface through an ArgFit UI feedback pattern instead of silently reloading.
- The starter must document how to serve production builds locally for service worker testing.
- The starter must document that HTTPS is required in production; `localhost` and `127.0.0.1` are acceptable for local development.

## Device Capability Requirements

### Capability Model

Create a typed capability model with at least:

- `pwaInstallable`
- `standaloneDisplay`
- `online`
- `secureContext`
- `webBluetoothSupported`
- `webBluetoothAvailable`
- `nativeBridgeSupported`

The UI must show capability state without implying that unsupported features are broken.

### Transport Contract

Create an app-level transport abstraction:

- `DeviceTransport`
- `WebBluetoothTransport`
- `NativeDeviceTransport`

The contract must support:

- `isSupported()`
- `requestDevice()`
- `connect()`
- `disconnect()`
- `read()`
- `write()`
- connection status events or signals
- typed error states

`NativeDeviceTransport` may be a documented stub in this HU, but its presence should make a future Capacitor/native implementation straightforward.

### Web Bluetooth Behavior

The Web Bluetooth implementation must:

- Use feature detection before showing the connect flow.
- Require `window.isSecureContext`.
- Call `navigator.bluetooth.requestDevice()` only from a user gesture such as click, pointerup or touch.
- Use explicit filters and `optionalServices`; `acceptAllDevices` is allowed only in a clearly marked demo mode.
- Handle permission cancellation as a normal user path.
- Listen for disconnect events when available.
- Avoid service worker or Web Worker usage for Bluetooth.
- Avoid claiming support on iOS/iPadOS Safari.

### Unsupported Browser UX

Unsupported platforms must show a clear fallback:

- On iOS/iPadOS Safari: explain that installation as PWA is possible, but BLE requires a native/hybrid app or supported companion approach.
- On Firefox/Safari desktop: explain that the UI can run, but BLE transport is unavailable.
- On insecure origins: explain that HTTPS is required for device APIs.
- On offline state: disable scanning and explain that device sync may need network after capture, depending on the app.

## UI Requirements

The starter should include:

- Desktop layout for dense operational workflows.
- Tablet layout that preserves readable control density.
- Mobile layout with touch-first actions and safe-area friendly spacing.
- Device status surface with connected, disconnected, scanning, unsupported and error states.
- Install/update/offline surfaces built with ArgFit adaptive components.
- No visible explanatory marketing section before the actual app experience.

## Documentation Requirements

Create docs that explain:

- How to run the PWA starter locally.
- How to build and serve the production PWA.
- How to test installability.
- How to test offline behavior.
- How to test service worker updates.
- Browser support for PWA installation and Web Bluetooth.
- Why BLE support is app-level and not part of `@argfit-ui/core`.
- When to choose pure PWA vs Capacitor/native shell.

Technical references to include in docs:

- Angular service workers: `https://angular.dev/ecosystem/service-workers/getting-started`
- MDN installable PWAs: `https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable`
- MDN Web Bluetooth: `https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API`
- Chrome Web Bluetooth: `https://developer.chrome.com/docs/capabilities/bluetooth`
- Apple Add to Home Screen: `https://support.apple.com/en-euro/guide/iphone/iphea86e5236/ios`

## Fuera De Alcance

No incluir en esta HU:

- Publicar una app en App Store, Play Store o Microsoft Store.
- Implementar Capacitor o un plugin BLE nativo completo.
- Soporte para Bluetooth Classic como contrato principal.
- Protocolos reales de dispositivos medicos, deportivos o industriales.
- Sincronizacion BLE en background.
- Push notifications.
- Cuenta de usuario, autenticacion o backend real.
- Guardar datos sensibles de dispositivo en cache offline.

## Riesgos Y Restricciones

- Web Bluetooth es una API de disponibilidad limitada y no debe tratarse como baseline universal.
- La instalacion PWA no garantiza acceso a APIs nativas.
- iOS/iPadOS puede instalar web apps desde Safari, pero no debe prometer BLE via Web Bluetooth.
- BLE debe ser iniciado por gesto del usuario.
- APIs potentes requieren secure context.
- Las pruebas CI deben usar mocks; no deben depender de hardware fisico.

## Criterios De Aceptacion

1. Existe una app `argfit-ui-pwa-starter` en el workspace.
2. La app usa `@argfit-ui/adaptive` como path principal.
3. La app registra `provideArgfitUi({ platform: 'auto' })`.
4. Production build emite manifest, icons y service worker.
5. La app puede instalarse en navegadores compatibles.
6. Offline shell funciona despues de una primera carga productiva.
7. Existe flujo visible de update cuando `SwUpdate` detecta una version nueva.
8. Existe pantalla o seccion de capacidades con estado PWA, red, secure context y Bluetooth.
9. El flujo BLE solo aparece como accion conectable cuando el navegador lo soporta.
10. `requestDevice()` solo se ejecuta desde interaccion directa del usuario.
11. Plataformas sin Web Bluetooth muestran fallback claro y no bloquean el resto de la app.
12. Los servicios de PWA, red, update y device connection tienen tests unitarios.
13. Existe smoke test con Web Bluetooth mockeado.
14. Docs PWA quedan enlazadas desde README o docs platform.
15. `pnpm guard:architecture` sigue pasando sin nuevas fugas PrimeNG/Ionic.

## Comandos De Validacion

```bash
pnpm build:libs
ng build argfit-ui-pwa-starter --configuration production
ng test argfit-ui-pwa-starter --watch=false
pnpm guard:architecture
pnpm pwa:smoke
git status --short
```

## Notas De Implementacion

- Si `pnpm pwa:smoke` no existe, esta HU debe crearlo como script reproducible.
- Preferir mocks de `navigator.bluetooth`, `BeforeInstallPromptEvent`, `navigator.serviceWorker` y `SwUpdate`.
- El smoke puede validar la app en `localhost`, porque los origenes locales son tratados como confiables para desarrollo.
- No agregar APIs publicas de dispositivo a `@argfit-ui/core` en esta HU.
- Si se agrega algun componente reusable de estado, debe permanecer semantico y no depender de Web Bluetooth.
