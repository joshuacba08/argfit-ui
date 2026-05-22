# @argfit-ui/core

Core runtime package for ArgFit UI `0.1.0-beta.0`.

It contains vendor-agnostic tokens, themes, shared types, platform services and `provideArgfitUi`. This package must not import PrimeNG, Ionic, desktop, mobile or adaptive implementations.

This package participates in the current `0.1.0-beta.0` contract.

## Install

```bash
pnpm add @argfit-ui/core@0.1.0-beta.0
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

## Beta Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/quickstart.md)
- [Theming and adaptive rendering](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/theming.md)
- [Public API](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/public-api.md)
- [Migration alpha to beta](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/migration-alpha-to-beta.md)

Beta+ track:

- [Beta+ quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta-plus/quickstart.md)
- [Beta+ components](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta-plus/components.md)
- [Beta+ public API](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta-plus/public-api.md)
- [Beta+ known limitations](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta-plus/known-limitations.md)
- [Migration beta to beta plus](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta-plus/migration-beta-to-beta-plus.md)

## Build

```bash
pnpm build:core
```
