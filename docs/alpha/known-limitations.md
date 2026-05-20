# Alpha Known Limitations

ArgFit UI `0.1.0-alpha.0` is an early distribution target. It is usable for consumer trials, but it is not a production-stability promise.

## Breaking Changes

- Breaking changes are allowed before beta.
- `stable-for-alpha` APIs should receive migration notes when they change.
- `experimental` APIs can change shape, naming or behavior more aggressively.
- Exact internal peer versions are required so prerelease packages are not mixed accidentally.

## Distribution

- Packages are marked `UNLICENSED` until a public license is selected.
- Public npm publish is not part of this HU.
- Current publish mode is local tarball or private registry.
- CI release gates and automated changelog are planned for a later HU.

## Component Coverage

- Advanced overlays such as popover, dropdown, tooltip and drawer are not included.
- Advanced form inputs such as date picker, upload, autocomplete and slider are not included.
- Data table virtualization, server-side data sources, column resizing and inline editing are not included.
- Chart export, drilldown and synchronized charts are not included.
- Notification center and persistent notification history are not included.

## Rendering

- Desktop and mobile internals are vendor-specific: desktop uses PrimeNG internally and mobile uses Ionic internally.
- The public adaptive API is vendor-independent, but renderer package internals can change.
- Chart rendering is browser-oriented in the alpha and is not guaranteed for SSR.
- Mobile rendering expects the consumer runtime to support Ionic custom elements.

## Visual Validation

- The showcase is the primary visual reference for this alpha.
- A dedicated visual regression pipeline is not part of HU-017.
- Minor visual differences between local environments are not release blockers unless they break component contracts, accessibility or layout usability.

## Recommended Consumer Posture

- Use `@argfit-ui/adaptive` in app code.
- Keep ArgFit packages on the same alpha version.
- Avoid styling vendor internals.
- Treat experimental components as useful previews, not final contracts.
