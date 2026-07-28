# @argfit-ui/desktop

Desktop renderer package for ArgFit UI `1.3.1`.

This package contains desktop-oriented implementations backed by PrimeNG internally while keeping ArgFit public APIs vendor-independent. Application consumers should normally import components from `@argfit-ui/adaptive` instead of this renderer package.

This package participates in the current `1.3.1` production contract.

## Install

```bash
pnpm add @argfit-ui/core@1.3.1 @argfit-ui/primitives@1.3.1 @argfit-ui/desktop@1.3.1
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

## Productive Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/quickstart.md)
- [Public API](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/public-api.md)
- [Components](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/components.md)
- [Release notes](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/release-notes-1.3.1.md)
- [Migration beta/Beta+ to 1.0](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/migration-beta-to-1-0.md)

## Build

```bash
pnpm build:desktop
```
