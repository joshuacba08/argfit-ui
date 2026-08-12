# @argfit-ui/primitives

Vendor-agnostic primitive package for ArgFit UI `1.4.0`.

Contains small building blocks shared by desktop, mobile and adaptive layers. Primitives may depend on `@argfit-ui/core` and `@angular/cdk`, but must not import PrimeNG, Ionic, desktop, mobile or adaptive implementations.

This package participates in the current `1.4.0` production contract.

## Install

```bash
pnpm add @argfit-ui/core@1.4.0 @argfit-ui/primitives@1.4.0
pnpm add @angular/cdk@^21.2.0 @lucide/angular@^1.16.0 @ng-icons/core@^33.0.0
```

## Available primitives

| Symbol                      | Selector             | Purpose                                                                    |
| --------------------------- | -------------------- | -------------------------------------------------------------------------- |
| `AfVisuallyHiddenComponent` | `af-visually-hidden` | Renders projected content visible only to assistive technology.            |
| `AfFocusTrapDirective`      | `[afFocusTrap]`      | Contains keyboard focus within the host while enabled.                     |
| `AfFocusInitialDirective`   | `[afFocusInitial]`   | Marks the element that should receive focus first inside a trap.           |
| `AfEscapeKeyDirective`      | `[afEscapeKey]`      | Emits `afEscape` when the user presses Escape on the host or a descendant. |
| `AfIconComponent`           | `af-icon`            | Renders built-in or explicitly registered Lucide and ng-icons definitions. |

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
<section afFocusTrap [afFocusTrapEnabled]="isOpen()" afEscapeKey (afEscape)="close()">
  <button type="button" afFocusInitial>Confirm</button>
  <button type="button">Cancel</button>
  <af-visually-hidden>Modal opened</af-visually-hidden>
</section>
```

For icons outside the built-in catalog, import only the definitions the app uses and
register them at application, route or component scope:

```ts
import { LucideAlarmClock } from '@lucide/angular';
import { heroUser } from '@ng-icons/heroicons/outline';
import { provideAfLucideIcons, provideAfNgIcons } from '@argfit-ui/primitives';

const providers = [
  provideAfLucideIcons(LucideAlarmClock),
  provideAfNgIcons('hero', { user: heroUser }),
];
```

```html
<af-icon name="lucide:alarm-clock" ariaLabel="Alarm" /> <af-icon name="hero:user" decorative />
```

Concrete `@ng-icons/*` packs stay optional consumer dependencies. The Storybook Icon
page is the canonical catalog and integration guide.

## Productive Docs

- [Quickstart](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/quickstart.md)
- [Components](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/components.md)
- [Public API](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/public-api.md)
- [Accessibility](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/accessibility.md)
- [Release notes](https://github.com/joshuacba08/argfit-ui/blob/main/docs/productive/release-notes-1.4.0.md)

## Build

```bash
pnpm build:primitives
```

## Test

```bash
ng test argfit-ui-primitives --watch=false
```
