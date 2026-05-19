# @argfit-ui/primitives

Vendor-agnostic primitive package for ArgFit UI.

Contains small building blocks shared by desktop, mobile, and adaptive layers. Primitives may depend on `@argfit-ui/core` and `@angular/cdk`, but must not import PrimeNG, Ionic, desktop, mobile, or adaptive implementations.

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

## Build

```bash
pnpm build:primitives
```

## Test

```bash
ng test argfit-ui-primitives --watch=false
```
