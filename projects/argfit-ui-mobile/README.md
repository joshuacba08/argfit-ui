# @argfit-ui/mobile

Mobile renderer package for ArgFit UI `0.1.0-beta.0`.

This package contains touch-oriented implementations that render Ionic elements internally while keeping ArgFit public APIs vendor-independent. Application consumers should normally import components from `@argfit-ui/adaptive` instead of this renderer package.

This package participates in the current `0.1.0-beta.0` contract.

## Install

```bash
pnpm add @argfit-ui/core@0.1.0-beta.0 @argfit-ui/primitives@0.1.0-beta.0 @argfit-ui/mobile@0.1.0-beta.0
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

## Beta Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/quickstart.md)
- [Theming and adaptive rendering](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/theming.md)
- [Package matrix](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/package-matrix.md)
- [Known limitations](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/known-limitations.md)

## Build

```bash
pnpm build:mobile
```
