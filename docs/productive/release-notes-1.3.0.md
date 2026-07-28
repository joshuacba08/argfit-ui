# Release Notes: 1.3.0

ArgFit UI `1.3.0` is the first release shaped directly by a real product
integration. It adds a complete shared contract for button icons and fixes
full-width mobile actions, allowing ArgFit Football to implement its Hub
Identity launch screen without private SVG markup or deep CSS overrides.

## Release Metadata

- Stable version: `1.3.0`
- npm dist-tag: `latest`
- Packages: `@argfit-ui/core`, `@argfit-ui/primitives`,
  `@argfit-ui/desktop`, `@argfit-ui/mobile`, `@argfit-ui/adaptive`
- Release gate: `pnpm release:production:check`
- Tarballs: `dist/production-tarballs/`

## Public API

`AfButton` now accepts:

```ts
icon: AfIconName | null;
iconPosition: 'start' | 'end'; // defaults to start
fullWidth: boolean;
```

The adaptive layer forwards the contract to both renderers. Icons use
`AfIconComponent`, are hidden while the loading spinner is active and are
decorative when the button has visible text.

```html
<af-button icon="log-in" fullWidth> Ingresar con Hub Identity </af-button>

<af-button icon="arrow-right" iconPosition="end"> Continuar </af-button>
```

The curated icon registry also includes `log-in`.

## Mobile Layout Fix

`fullWidth` now applies `width: 100%` to the Ionic renderer itself as well as
its Angular host. This makes the public input reliable inside sheets, forms and
mobile authentication layouts.

## Validation

The release is covered at three levels:

- the icon registry test renders every declared `AfIconName`
- renderer tests verify leading/trailing icon placement and mobile width
- adaptive tests verify forwarding of icon, position and width inputs

The complete production gate rebuilds all packages, tests the full workspace,
creates production tarballs, runs consumer smoke checks and validates package
metadata before the `v1.3.0` tag is published.
