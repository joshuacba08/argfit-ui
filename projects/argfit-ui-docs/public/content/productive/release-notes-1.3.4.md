# Release Notes: 1.3.4

ArgFit UI `1.3.4` improves searchable, API-paginated selects and fixes
selection of adjacent-month dates in the calendar.

## Release Identity

- Stable version: `1.3.4`
- npm dist-tag: `latest`
- Validation gate: `pnpm release:production:check`
- Tarballs: `dist/production-tarballs/`

## Searchable And Paginated Selects

Long select result sets now keep the filter row visible while options scroll.
The overlay uses the ArgFit theme for its scrollbar and reserves scrollbar
space so labels do not jump as more API pages are appended.

Infinite-scroll observation is scoped through the trigger's `aria-controls`
relationship. This ensures each select listens only to its own overlay when a
form contains several searchable controls.

## Adjacent-Month Dates

The desktop date picker now allows selecting the visible leading and trailing
days from the previous or next month. Selecting one of those dates updates both
the value and the displayed month through PrimeNG's supported calendar option.

## Storybook

Storybook loads the same ArgFit providers and global styles as the showcase.
The select stories include realistic long datasets, autocomplete filtering and
an explicit loading-more state for rapid component development.

## Upgrade

Keep all ArgFit UI packages aligned:

```bash
pnpm add @argfit-ui/core@1.3.4 @argfit-ui/primitives@1.3.4
pnpm add @argfit-ui/desktop@1.3.4 @argfit-ui/mobile@1.3.4 @argfit-ui/adaptive@1.3.4
```

No application migration is required.
