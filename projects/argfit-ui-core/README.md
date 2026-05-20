# @argfit-ui/core

Core runtime package for ArgFit UI `0.1.0-alpha.0`.

It contains vendor-agnostic tokens, themes, shared types, platform services and `provideArgfitUi`. This package must not import PrimeNG, Ionic, desktop, mobile or adaptive implementations.

## Install

```bash
pnpm add @argfit-ui/core@0.1.0-alpha.0
```

Peer dependencies:

```bash
pnpm add @angular/common@^21.2.0 @angular/core@^21.2.0
```

## Usage

```ts
import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';

export const appConfig = {
	providers: [
		provideArgfitUi({
			theme: ARGFIT_DARK_THEME,
			platform: 'auto',
		}),
	],
};
```

## Alpha Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/quickstart.md)
- [Theming and adaptive rendering](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/theming.md)
- [Public API](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/public-api.md)

## Build

```bash
pnpm build:core
```
