# Release Notes: 1.3.3

ArgFit UI `1.3.3` adds the compact tab treatment required by application
collection and source filters.

## Release Identity

- Stable version: `1.3.3`
- npm dist-tag: `latest`
- Validation gate: `pnpm release:production:check`
- Tarballs: `dist/production-tarballs/`

## Compact Line Tabs

`AfTabs` now supports two visual contracts:

- `variant="cards"` remains the default for peer views with a visible panel;
- `variant="line"` renders a compact, horizontally scrollable tab bar.

For application-owned result regions, disable the implicit panel:

```html
<af-tabs
  variant="line"
  density="compact"
  [renderPanel]="false"
  [items]="libraryTabs"
  [activeId]="activeLibraryTab()"
  (activeIdChange)="activeLibraryTab.set($event)"
/>
```

With `renderPanel="false"`, the tab buttons keep their tab semantics and active
state but do not reference a missing panel through `aria-controls`. The
consumer remains responsible for labelling and announcing the controlled
result region.

## Tablet Renderer Selection

Automatic platform selection now follows the shared width boundary:

- up to `767.98px`: mobile renderer;
- from `768px`: desktop renderer, allowing applications to apply their tablet
  rail layout.

Pointer precision no longer changes the renderer. A touch-capable tablet
therefore receives the same tablet composition as a mouse-capable device at
the same width.

## Upgrade

Keep all ArgFit UI packages aligned:

```bash
pnpm add @argfit-ui/core@1.3.3 @argfit-ui/primitives@1.3.3
pnpm add @argfit-ui/desktop@1.3.3 @argfit-ui/mobile@1.3.3 @argfit-ui/adaptive@1.3.3
```

No migration is required. Existing tabs keep the `cards` variant and rendered
panel by default.
