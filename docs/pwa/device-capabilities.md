# PWA Device Capabilities

HU-044 keeps device access at the application layer. ArgFit UI remains responsible for adaptive UI, tokens, layout, feedback and accessibility. The PWA starter owns install state, network state, service worker updates and device transports.

## Capability Model

The starter exposes a typed capability model with:

- `pwaInstallable`
- `standaloneDisplay`
- `online`
- `secureContext`
- `webBluetoothSupported`
- `webBluetoothAvailable`
- `nativeBridgeSupported`

Unsupported capability states are shown as normal product states. They do not block the rest of the app.

## Transport Contract

The app-level transport contract lives under `projects/argfit-ui-pwa-starter/src/app/types/device-capabilities.types.ts`.

Implemented transports:

- `WebBluetoothTransport`: uses `navigator.bluetooth` when the browser and secure context allow it.
- `NativeDeviceTransport`: documented stub for future Capacitor/native BLE integration.

The contract includes:

- `isSupported()`
- `requestDevice()`
- `connect()`
- `disconnect()`
- `read()`
- `write()`
- status signals or typed error states

## Web Bluetooth Rules

The Web Bluetooth flow:

- uses feature detection before enabling the connect action
- requires `window.isSecureContext`
- calls `navigator.bluetooth.requestDevice()` only from the user-triggered connect action
- uses explicit filters and `optionalServices`
- handles cancelled device selection as a normal user path
- never runs Bluetooth from the service worker

The demo filter targets the standard `battery_service` and marks demo intent in the request object. Broader `acceptAllDevices` scanning must stay behind explicitly labelled demo mode.

## Native Bridge Path

iOS/iPadOS Safari and unsupported desktop browsers should use a native or hybrid bridge when BLE is required. The stub transport names the seam for a later Capacitor BLE plugin without making native APIs part of `@argfit-ui/core`.

## References

- Angular service workers: `https://angular.dev/ecosystem/service-workers/getting-started`
- MDN Web Bluetooth: `https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API`
- Chrome Web Bluetooth: `https://developer.chrome.com/docs/capabilities/bluetooth`
