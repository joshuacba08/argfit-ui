# @argfit-ui/core

Core runtime package for ArgFit UI `2.1.0`.

It contains vendor-agnostic tokens, themes, shared types, platform services and `provideArgfitUi`. This package must not import PrimeNG, Ionic, desktop, mobile or adaptive implementations.

This package participates in the current `2.1.0` production contract.

## Install

```bash
pnpm add @argfit-ui/core@2.1.0
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

## Productive Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/quickstart.md)
- [Theming and adaptive rendering](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/theming.md)
- [Public API](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/public-api.md)
- [Release notes](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/release-notes-2.1.0.md)
- [Support policy](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/support-policy.md)

## Build

```bash
pnpm build:core
```
