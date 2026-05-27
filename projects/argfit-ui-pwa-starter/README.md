# ArgFit UI PWA Starter

Installable Angular starter that demonstrates ArgFit UI adaptive surfaces, Angular service worker integration, offline shell state and app-level device capability detection.

## Run

```bash
pnpm build:libs
ng serve argfit-ui-pwa-starter --port 4400
```

## Production Validation

```bash
pnpm build:libs
ng build argfit-ui-pwa-starter --configuration production
ng test argfit-ui-pwa-starter --watch=false
pnpm pwa:smoke
```

The service worker is enabled only in production builds. Web Bluetooth requires a secure context and a browser that supports `navigator.bluetooth`.

## Device Policy

Device transports live in this app, not in `@argfit-ui/core`. The starter includes a Web Bluetooth transport and a native bridge stub for a future Capacitor/native BLE implementation.
