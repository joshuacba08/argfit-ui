# ArgFit UI PWA Quickstart

This guide explains how to run the installable PWA starter introduced by HU-044.

## Run Locally

```bash
pnpm install
pnpm build:libs
pnpm start:pwa
```

The development server is useful for UI iteration, but it does not register the Angular service worker.

## Build And Serve The Production PWA

```bash
pnpm build:libs
ng build argfit-ui-pwa-starter --configuration production
pnpm pwa:smoke
```

The production build emits:

- `dist/argfit-ui-pwa-starter/browser/manifest.webmanifest`
- `dist/argfit-ui-pwa-starter/browser/ngsw.json`
- `dist/argfit-ui-pwa-starter/browser/ngsw-worker.js`
- install icons under `dist/argfit-ui-pwa-starter/browser/icons/`

Serve `dist/argfit-ui-pwa-starter/browser` from `localhost`, `127.0.0.1` or HTTPS. Powerful web capabilities require a secure context in production.

## Test Installability

1. Open the production build in Chrome or Edge.
2. Confirm the manifest loads from DevTools Application > Manifest.
3. Confirm the service worker is active from DevTools Application > Service workers.
4. Use the browser install affordance or the in-app install action when `beforeinstallprompt` is available.

iOS and iPadOS installation is performed through Safari Add to Home Screen. The app shell can be installed there, but Web Bluetooth should not be promised on that platform.

## Test Offline Behavior

1. Load the production app once while online.
2. Confirm the service worker is active.
3. Switch DevTools Network to offline.
4. Reload `/device`, `/install` and `/offline`.
5. Confirm the shell still renders and device sync actions communicate their fallback state.

## Test Updates

Build and serve a production version, then change app content and build again. When the Angular service worker detects a new version, the app surfaces update state through `PwaUpdateService` instead of silently reloading.

## Next Reading

- [Device capabilities](./device-capabilities.md)
- [Browser support](./browser-support.md)
