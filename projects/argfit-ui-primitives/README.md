# @argfit-ui/primitives

Vendor-agnostic primitive package for ArgFit UI `0.1.0-alpha.0`.

Contains small building blocks shared by desktop, mobile and adaptive layers. Primitives may depend on `@argfit-ui/core` and `@angular/cdk`, but must not import PrimeNG, Ionic, desktop, mobile or adaptive implementations.

## Install

```bash
pnpm add @argfit-ui/core@0.1.0-alpha.0 @argfit-ui/primitives@0.1.0-alpha.0
pnpm add @angular/cdk@^21.2.0 @lucide/angular@^1.16.0
```

## Available primitives

| Symbol | Selector | Purpose |
| --- | --- | --- |
| `AfVisuallyHiddenComponent` | `af-visually-hidden` | Renders projected content visible only to assistive technology. |
| `AfFocusTrapDirective` | `[afFocusTrap]` | Contains keyboard focus within the host while enabled. |
| `AfFocusInitialDirective` | `[afFocusInitial]` | Marks the element that should receive focus first inside a trap. |
| `AfEscapeKeyDirective` | `[afEscapeKey]` | Emits `afEscape` when the user presses Escape on the host or a descendant. |

## Usage

```ts
import {
  AfEscapeKeyDirective,
  AfFocusInitialDirective,
  AfFocusTrapDirective,
  AfVisuallyHiddenComponent,
} from '@argfit-ui/primitives';
```

```html
<section
  afFocusTrap
  [afFocusTrapEnabled]="isOpen()"
  afEscapeKey
  (afEscape)="close()"
>
  <button type="button" afFocusInitial>Confirm</button>
  <button type="button">Cancel</button>
  <af-visually-hidden>Modal opened</af-visually-hidden>
</section>
```

## Alpha Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/quickstart.md)
- [Components](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/components.md)
- [Known limitations](https://github.com/joshuacba08/argfit-ui/blob/main/docs/alpha/known-limitations.md)

## Build

```bash
pnpm build:primitives
```

## Test

```bash
ng test argfit-ui-primitives --watch=false
```
