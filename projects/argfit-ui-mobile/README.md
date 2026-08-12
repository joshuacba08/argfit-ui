# @argfit-ui/mobile

Mobile renderer package for ArgFit UI `1.5.0`.

This package contains touch-oriented implementations that render Ionic elements internally while keeping ArgFit public APIs vendor-independent. Application consumers should normally import components from `@argfit-ui/adaptive` instead of this renderer package.

This package participates in the current `1.5.0` production contract.

## Install

```bash
pnpm add @argfit-ui/core@1.5.0 @argfit-ui/primitives@1.5.0 @argfit-ui/mobile@1.5.0
pnpm add @angular/cdk@^21.2.0 @ionic/angular@^8.8.7 echarts@^6.1.0
```

Consumers that render mobile components directly should initialize Ionic Angular in the host application.

## Usage

```ts
import { AfButtonMobileComponent } from '@argfit-ui/mobile';
```

Prefer adaptive imports in app code:

```ts
import { AfButton, AfCard, AfInput } from '@argfit-ui/adaptive';
```

## Productive Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/quickstart.md)
- [Theming and adaptive rendering](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/theming.md)
- [Public API](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/public-api.md)
- [Release notes](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/release-notes-1.5.0.md)
- [Migration beta/Beta+ to 1.0](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/migration-beta-to-1-0.md)

## Build

```bash
pnpm build:mobile
```
