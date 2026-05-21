# @argfit-ui/adaptive

Primary consumer component package for ArgFit UI `0.1.0-beta.0`.

It contains lightweight orchestration components that select desktop or mobile renderers through `AfPlatformService`. Adaptive components should not import PrimeNG or Ionic directly, and application consumers should normally use this package for UI components.

This package participates in the current `0.1.0-beta.0` contract.

## Install

Install the full beta package set so adaptive renderers can resolve their peers:

```bash
pnpm add @argfit-ui/core@0.1.0-beta.0 @argfit-ui/primitives@0.1.0-beta.0
pnpm add @argfit-ui/desktop@0.1.0-beta.0 @argfit-ui/mobile@0.1.0-beta.0 @argfit-ui/adaptive@0.1.0-beta.0
pnpm add @angular/cdk@^21.2.0 @angular/forms@^21.2.0 @ionic/angular@^8.8.7 @lucide/angular@^1.16.0 echarts@^6.1.0 primeng@^21.1.8
```

## Usage

```ts
import { AfButton, AfCard, AfInput, AfPageShell } from '@argfit-ui/adaptive';
```

```html
<af-page-shell title="Dashboard" [navItems]="navItems">
	<af-card variant="panel">
		<div afCardContent>
			<af-input label="Athlete" placeholder="Search athlete" />
			<af-button>Start session</af-button>
		</div>
	</af-card>
</af-page-shell>
```

## Beta Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/quickstart.md)
- [Components](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/components.md)
- [Public API](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/public-api.md)
- [Known limitations](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/known-limitations.md)
- [Migration alpha to beta](https://github.com/joshuacba08/argfit-ui/blob/main/docs/beta/migration-alpha-to-beta.md)

## Build

```bash
pnpm build:adaptive
```
