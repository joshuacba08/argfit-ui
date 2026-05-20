# @argfit-ui/desktop

Desktop renderer package for ArgFit UI `0.1.0-alpha.0`.

This package contains desktop-oriented implementations backed by PrimeNG internally while keeping ArgFit public APIs vendor-independent. Application consumers should normally import components from `@argfit-ui/adaptive` instead of this renderer package.

## Install

```bash
pnpm add @argfit-ui/core@0.1.0-alpha.0 @argfit-ui/primitives@0.1.0-alpha.0 @argfit-ui/desktop@0.1.0-alpha.0
pnpm add @angular/cdk@^21.2.0 @angular/forms@^21.2.0 primeng@^21.1.8 echarts@^6.1.0
```

## Usage

```ts
import { AfButtonDesktopComponent } from '@argfit-ui/desktop';
```

Renderer components are documented for advanced cases. Prefer adaptive imports in app code:

```ts
import { AfButton, AfCard, AfInput } from '@argfit-ui/adaptive';
```

## Alpha Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/quickstart.md)
- [Components](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/components.md)
- [Package metadata](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/package-metadata.md)

## Build

```bash
pnpm build:desktop
```
