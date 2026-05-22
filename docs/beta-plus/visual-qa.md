# Beta+ Visual QA

Beta+ visual validation now runs against a generated external consumer app built from the Beta+ tarballs.

This keeps the curated showcase focused on the current product-facing slices while still validating representative wave 3 and wave 4 surfaces.

## Consumer Surface Under Test

`pnpm beta-plus:consumer-smoke` generates `.tmp/beta-plus-consumer/` from the `dist/beta-plus-tarballs/` artifacts and renders representative Beta+ families through public imports only.

The current visual smoke covers:

- overlays: `AfTooltip`, `AfPopover`, `AfDrawer`
- status and identity: `AfAvatar`, `AfChip`, `AfProgress`
- advanced forms: `AfInputCount`, `AfMultiSelect`, `AfDatePicker`, `AfListbox`
- data: `AfDataView`, `AfTimeline`, `AfTree`
- panel and layout: `AfTabs`, `AfStepper`, `AfSplitter`
- workflow: `AfKanban`

## Commands

Install Chromium locally when needed:

```bash
pnpm exec playwright install chromium
```

Build the Beta+ consumer smoke app:

```bash
pnpm beta-plus:consumer-smoke
```

Run the focused Beta+ accessibility audit:

```bash
pnpm audit:accessibility:beta-plus
```

Run the focused Beta+ visual smoke:

```bash
pnpm visual:beta-plus
```

## Current Scenario Set

- desktop dark overlays open state
- desktop dark forms state
- desktop light forms state
- desktop dark data and layout state
- mobile dark touch-first forms and layout state
- desktop dark Kanban board
- desktop dark Kanban drop-active state
- mobile dark Kanban board

## Notes

- This is a smoke workflow, not a full visual baseline review.
- The curated showcase still remains the source of truth for the active Beta+ product slice.
- Wave 3 and wave 4 stay validated here through the generated consumer app instead of being re-expanded inside the showcase.
