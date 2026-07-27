# Release Notes: 1.2.0

ArgFit UI `1.2.0` is an additive minor release. It closes nine of the ten remaining gaps
found while building ArgFit Football, adding four components and extending five existing ones.

## Summary

- Stable version: `1.2.0`
- npm dist-tag: `latest`
- Primary application path: `@argfit-ui/adaptive`
- Production validation: `pnpm release:production:check`
- Upgrade cost from `1.1.0`: none. No public input, output, selector or type was renamed or removed.

## Added

### `AfSlider` (`GAP-UI-006`)

Bounded numeric input along a continuum — a perceived-effort rating, a 1–10 assessment,
a threshold. When the exact figure matters more than the position on the scale,
`AfInputCount` remains the better control.

Built on the native range input in both renderers: keyboard stepping, the `slider` role and
value announcements come for free and stay correct. `marks` turn a bare number into a
judgement — "6" means nothing until the ends read "Muy suave" and "Máximo" — and the mark's
label is what gets announced when the value lands on it.

The mobile thumb stays above the 44 px touch target at every size, including `sm`: the size
input tunes visual density, not how easy it is to hit with a thumb. The control is used
standing up, outdoors, sometimes with gloves on.

### `AfFileUpload` (`GAP-UI-005`)

File selection with declared constraints and reported rejections. The component selects and
presents; it never uploads. Transport, retries, presigned URLs and authentication stay with
the application, so the same control serves a direct POST, a background queue or a resumable
multipart flow — feed it `progress` and it renders what the application reports.

Two behaviours are deliberate:

- Limits are announced **before** choosing. Discovering a size cap by failing is a poor way
  to learn it.
- Rejected files come back through `filesChange` with a reason. A file that silently fails
  to attach looks exactly like one that worked, until someone notices it missing.

A real `<input type="file">` remains the control in both renderers; the desktop drop zone is
an enhancement layered on top, never the only way in. Mobile drops the drop zone entirely —
there is no dragging to offer — and gives the button the full width.

### `AfEmptyState` (`GAP-UI-008`)

Collection components carry their own `emptyTitle` / `emptyDescription`; this covers what
they cannot — a whole route with nothing in it, a detail that does not exist, a section the
current role may not see.

`actions` is part of the contract, not an optional extra: an empty surface that only says
"no data" leaves the user to work out what to do next at the moment they are least equipped
to guess. `tone` separates the four situations that look identical as a blank panel —
`empty`, `filtered`, `error` and `permission` — because the way out differs in each.

### `AfSkeleton` (`GAP-UI-014`)

Loading placeholder that lets a surface hold its shape without inventing content. Rendering
zeros or dashes while data is in flight is worse than showing nothing: the reader cannot
tell a real measurement from a placeholder.

`AfProgress` with `variant="skeleton"` covers a single bar; this composes the block. In
`text` shape the last line is shorter, which is what makes a block read as prose rather than
as a table. The whole placeholder is announced as a busy region and its bars are hidden from
assistive technology, and the pulse stops under `prefers-reduced-motion`.

## Changed

### `AfChart`: `scatter` and `bubble` (`GAP-UI-009`)

Both plot two continuous axes; `bubble` reads `z` as a third variable. The radius scales
with the square root of the value because perception compares areas — scaling the radius
linearly makes a doubled value look four times larger.

### `AfChart`: tabular alternative (`GAP-UI-010`)

`dataTable` publishes the series as an accessible table beside the canvas. A canvas cannot
be traversed with a keyboard or read by assistive technology, so this is the same data in a
navigable form, not a summary.

### `AfSelect` and `AfListbox`: `searchable` (`GAP-UI-004`)

Each renderer solves it in the way its platform allows. PrimeNG filters inside its panel.
Ionic cannot filter within `ion-select`, so the searchable mode swaps the control for a
trigger and a sheet with a search field and a list — the same pattern the date and time
pickers already use on that platform. "Sin resultados" and "no hay opciones" are worded
differently on purpose: only one of them has a way out.

### `AfPopover`: edge alignment (`GAP-UI-012`)

`AfPopoverPlacement` gains the `-start` and `-end` variants for all four sides. A trigger
near the viewport edge — a context switcher at the left of a header, a status indicator at
the right — pushed its centred panel off screen. On mobile the panel spans the available
width, so the aligned variants are accepted and behave as the plain side, letting a consumer
declare one placement for both platforms.

### `AfNavigationItem`: `disabledReason` (`GAP-UI-013`)

A padlock with no explanation tells the user they are blocked but not what would unblock
them: a missing role, an inactive plan and a closed season all look identical. Surfaced as a
tooltip and through `aria-describedby`, so the reason reaches pointer, keyboard and
screen-reader users alike.

### Date period helpers

`AfDateRange`, `isAfDateValue` and `isAfDateRange` give applications one definition of a
valid civil period instead of re-checking `from <= to` at every call site. `isAfDateValue`
also rejects dates that parse but do not exist, such as `2026-02-31`, which `Date` silently
rolls into the next month.

## Not in this release

**`GAP-UI-003` — range selection inside `AfDatePicker`.** PrimeNG supports ranges natively
and Ionic has no range-capable datetime, so shipping it now would mean a control that
behaves differently depending on the platform — the exact thing the adaptive layer exists to
prevent. It needs a purpose-built two-step sheet on mobile and is deferred to a later
release. The period types above ship in the meantime so applications composing two
`AfDatePicker` fields have a shared, validated contract.

## Size budgets

Four new components on every layer move the published tarballs, so the budgets in
`tools/production-performance.mjs` were recalibrated for this release:

| Package | 1.2.0 | New budget | Previous |
| --- | --- | --- | --- |
| `@argfit-ui/core` | 38.7 kB | 41 kB | 35 kB |
| `@argfit-ui/primitives` | 10.2 kB | 15 kB | unchanged |
| `@argfit-ui/adaptive` | 124.6 kB | 130 kB | unchanged |
| `@argfit-ui/desktop` | 256.4 kB | 270 kB | 250 kB |
| `@argfit-ui/mobile` | 237.3 kB | 250 kB | 230 kB |
| Total | 667.2 kB | 700 kB | 650 kB |

The growth is proportionate to what shipped: desktop gained 6.4 kB and mobile 7.3 kB for four
components each. Budgets keep roughly 5 % headroom, so they still fail on unintended growth.

Two figures are worth watching in 1.3.0: `adaptive` sits 4 % under its unchanged ceiling, and
the showcase main bundle measures 2.59 MB against a 2.62 MB budget. Neither was raised here —
they pass, and raising a passing budget with no release to justify it is how a ratchet stops
working — but both will need a decision next time.

## Validation

The production gate must pass before tagging or publishing:

```bash
pnpm release:production:check
```

It builds every package, runs the full test suite and the accessibility audit, verifies that no
PrimeNG or Ionic type leaks through the public declarations, then writes the package set to
`dist/production-tarballs/`, measures it against the budgets above and smoke-tests the result.

Tag as `v1.2.0` and publish to the `latest` dist-tag with public access.
