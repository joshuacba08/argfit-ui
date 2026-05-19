# ArgFit UI

ArgFit UI is an adaptive Angular UI platform for enterprise applications, dashboards, SaaS products, and mobile workflows.

The public API is semantic and vendor-independent. Desktop implementations use PrimeNG internally, mobile implementations use Ionic internally, and adaptive components expose a unified Angular API.

## Packages

```txt
@argfit-ui/core
@argfit-ui/primitives
@argfit-ui/desktop
@argfit-ui/mobile
@argfit-ui/adaptive
```

## Workspace Projects

```txt
argfit-ui-core
argfit-ui-primitives
argfit-ui-desktop
argfit-ui-mobile
argfit-ui-adaptive
showcase
```

## Development

```bash
pnpm install
pnpm build:all
pnpm test:all
pnpm start
```

## Architecture Guard

```bash
pnpm guard:architecture
```

The guard blocks vendor leakage across library boundaries. For example, `core` cannot import PrimeNG or Ionic, and `adaptive` cannot import either vendor directly.

## First Vertical Slice

`AfButton` is the reference implementation:

- shared API types, tokens, theme service, and platform service in `@argfit-ui/core`
- vendor-agnostic accessibility primitives in `@argfit-ui/primitives`
- PrimeNG-backed desktop rendering in `@argfit-ui/desktop`
- Ionic-backed mobile rendering in `@argfit-ui/mobile`
- public adaptive API in `@argfit-ui/adaptive`
