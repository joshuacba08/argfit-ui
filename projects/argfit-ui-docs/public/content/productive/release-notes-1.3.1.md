# Release Notes: 1.3.1

ArgFit UI `1.3.1` is a focused production patch discovered while implementing
the ArgFit Football responsive shell and exercise library.

## Release Identity

- Stable version: `1.3.1`
- npm dist-tag: `latest`
- Validation gate: `pnpm release:production:check`
- Tarballs: `dist/production-tarballs/`

## Page Shell Projection

`AfPageShell` now keeps its four public slot directives in their documented
regions across both adaptive renderers:

- `afPageShellBrand` and `afPageShellFooter` compose into the desktop sidebar;
- `afPageShellActions` and `afPageShellUser` compose into the desktop topbar;
- the same templates compose into the mobile header and footer;
- unslotted application content remains inside the main landmark.

The release includes regression tests for desktop and mobile placement so a
future renderer change cannot silently move shell chrome into page content.

## Interactive Filter Chips

`AfChip` gains a small selection contract for filter bars:

- `interactive` enables keyboard and pointer activation;
- `selected` exposes the visual state and `aria-pressed`;
- `pressed` emits `MouseEvent | KeyboardEvent`;
- `removed` remains an independent mode for removable tokens, avoiding nested
  interactive targets.

```html
<af-chip
  interactive
  [selected]="activeCollection() === collection.id"
  (pressed)="activeCollection.set(collection.id)"
>
  {{ collection.label }}
</af-chip>
```

## Upgrade

Keep all ArgFit UI packages aligned:

```bash
pnpm add @argfit-ui/core@1.3.1 @argfit-ui/primitives@1.3.1
pnpm add @argfit-ui/desktop@1.3.1 @argfit-ui/mobile@1.3.1 @argfit-ui/adaptive@1.3.1
```

No migration is required for existing `1.3.0` consumers. The new chip inputs
are opt-in and the shell change restores the already documented slot behavior.
