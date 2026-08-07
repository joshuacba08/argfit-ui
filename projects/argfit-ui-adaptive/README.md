# @argfit-ui/adaptive

Primary consumer component package for ArgFit UI `1.3.3`.

It contains lightweight orchestration components that select desktop or mobile renderers through `AfPlatformService`. Adaptive components should not import PrimeNG or Ionic directly, and application consumers should normally use this package for UI components.

This package participates in the current `1.3.3` production contract.

## Install

Install the full production package set so adaptive renderers can resolve their peers:

```bash
pnpm add @argfit-ui/core@1.3.3 @argfit-ui/primitives@1.3.3
pnpm add @argfit-ui/desktop@1.3.3 @argfit-ui/mobile@1.3.3 @argfit-ui/adaptive@1.3.3
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

## Productive Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/quickstart.md)
- [Components](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/components.md)
- [Public API](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/public-api.md)
- [Accessibility](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/accessibility.md)
- [Release notes](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/release-notes-1.3.3.md)

## Build

```bash
pnpm build:adaptive
```
