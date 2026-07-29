# PWA Browser Support

The PWA starter separates installability from hardware access.

| Platform | Installable PWA | Web Bluetooth | Recommended Device Path |
| --- | --- | --- | --- |
| Chrome or Edge desktop | Yes | Supported where OS and browser allow it | `WebBluetoothTransport` |
| Chrome Android | Yes | Supported for BLE | `WebBluetoothTransport` |
| Safari desktop | Limited browser-specific install behavior | Not a baseline capability | Fallback or native bridge |
| iOS/iPadOS Safari | Add to Home Screen | Do not promise Web Bluetooth | Native or hybrid app bridge |
| Capacitor/native shell | Native app install | Native BLE through plugin | `NativeDeviceTransport` implementation |

## Secure Context

Device APIs require a secure context. Use HTTPS in production. Local `localhost` and `127.0.0.1` origins are acceptable for development and smoke tests.

## Install Notes

The manifest uses:

- `display: standalone`
- `start_url: /`
- 192px and 512px icons
- theme and background colors aligned with the ArgFit UI app shell

The service worker is registered only for production builds through Angular's service worker provider.

## References

- MDN installable PWAs: `https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable`
- Apple Add to Home Screen: `https://support.apple.com/en-euro/guide/iphone/iphea86e5236/ios`
- Chrome Web Bluetooth: `https://developer.chrome.com/docs/capabilities/bluetooth`
