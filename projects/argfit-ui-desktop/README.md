# @argfit-ui/desktop

Desktop renderer package for ArgFit UI `0.1.0-alpha.0`.

This package contains desktop-oriented implementations backed by PrimeNG internally while keeping ArgFit public APIs vendor-independent. Application consumers should normally import components from `@argfit-ui/adaptive` instead of this renderer package.

This package participates in the intended `0.1.0-beta.0` contract. The repository still builds as `0.1.0-alpha.0` until the beta publish channel is finalized.

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

## Beta Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/quickstart.md)
- [Public API](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/public-api.md)
- [Package matrix](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/package-matrix.md)
- [Known limitations](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/known-limitations.md)

## Build

```bash
pnpm build:desktop
```
