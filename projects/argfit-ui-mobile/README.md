# @argfit-ui/mobile

Mobile renderer package for ArgFit UI `0.1.0-alpha.0`.

This package contains touch-oriented implementations that render Ionic elements internally while keeping ArgFit public APIs vendor-independent. Application consumers should normally import components from `@argfit-ui/adaptive` instead of this renderer package.

## Install

```bash
pnpm add @argfit-ui/core@0.1.0-alpha.0 @argfit-ui/primitives@0.1.0-alpha.0 @argfit-ui/mobile@0.1.0-alpha.0
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

## Alpha Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/quickstart.md)
- [Theming and adaptive rendering](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/theming.md)
- [Package metadata](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/package-metadata.md)

## Build

```bash
pnpm build:mobile
```
