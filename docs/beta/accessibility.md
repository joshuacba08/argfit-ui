# Beta Accessibility Audit

This document defines the minimum accessibility gate for the current beta target.

It follows the Angular accessibility guidance for ARIA bindings, native interactive elements, live regions and focus management: https://angular.dev/best-practices/a11y

## Scope

The audit covers:

- Stable-for-beta components that form the recommended application path.
- Experimental-in-beta components that remain public and therefore need a minimum keyboard and ARIA baseline.
- Showcase shell semantics that should not regress obvious landmarks, active-navigation cues or feedback live regions.

## Reproducible Audit Command

Run the focused accessibility gate with:

```bash
pnpm audit:accessibility
```

That command executes the primitives, desktop, mobile, adaptive and showcase suites with the accessibility assertions added in HU-020 and HU-021.

For the full release gate, keep using:

```bash
pnpm test:all
pnpm build:all
```

## Audit Matrix

| Component | Beta category | Audit status | Keyboard | ARIA / semantics | Notes |
| --- | --- | --- | --- | --- | --- |
| `AfButton` | `stable-for-beta` | audited | native button keyboard | native button semantics preserved | Uses native button elements across renderers. |
| `AfInput` | `stable-for-beta` | audited | native input keyboard | label + hint/error wiring covered | Desktop/mobile specs cover `aria-describedby`. |
| `AfDialog` | `stable-for-beta` | audited | `Escape`, trapped focus, close button | `dialog`/`alertdialog`, `aria-labelledby`, `aria-describedby` | Desktop/mobile specs cover close, `Escape` and focus return. |
| `AfChart` | `stable-for-beta` | audited | not a primary keyboard control | loading and empty semantics covered | Loading state uses `role="status"` with polite live region. |
| `AfBadge` | `stable-for-beta` | audited | not interactive | decorative/status-only surface | No additional keyboard contract required. |
| `AfPageShell` | `stable-for-beta` | audited | shell actions and nav are keyboard reachable | `main`, navigation landmarks, active item `aria-current` | Showcase specs assert main + nav landmarks on desktop/mobile. |
| `AfMetricCard` | `stable-for-beta` | audited | interactive mode covered | button-like interaction stays explicit | Existing specs already cover keyboard activation. |
| `AfAnalyticsCard` | `experimental-in-beta` | baseline complete | slot/state rendering covered | semantic card composition retained | Still experimental because layout contract needs more field validation. |
| `AfDataTable` | `experimental-in-beta` | baseline complete | row activation with `Enter` and `Space`; sortable header button | desktop `aria-sort`, mobile list semantics, alert state | Desktop/mobile specs now cover keyboard row activation. |
| `AfSelect` | `experimental-in-beta` | baseline complete | native/vendor keyboard path delegated to renderer | label wiring covered via form-control specs | Still experimental due overlay/mobile UX risk. |
| `AfTextarea` | `experimental-in-beta` | baseline complete | native textarea keyboard | label wiring and CVA covered | Still experimental as part of expanded forms. |
| `AfToggle` | `experimental-in-beta` | baseline complete | toggle action reachable via renderer control | label/description contract covered | Promotion still blocked on broader parity audit. |
| `AfCheckbox` | `experimental-in-beta` | baseline complete | checkbox interaction covered via renderer control | label wiring covered | Promotion still blocked on broader parity audit. |
| `AfRadioGroup` | `experimental-in-beta` | baseline complete | radio interaction covered via renderer control | label wiring covered | Promotion still blocked on broader parity audit. |
| `AfSegmentedControl` | `experimental-in-beta` | baseline complete | segment buttons keyboard reachable | label wiring covered | Promotion still blocked on platform interaction review. |
| `AfPassword` | `experimental-in-beta` | baseline complete | input keyboard + reveal button | label + hint/error wiring covered | Still experimental due reveal/mobile flow validation. |
| `AfToastViewport` | `experimental-in-beta` | baseline complete | not a direct keyboard target | viewport hosts toast live regions | Placement/stacking rules still experimental. |
| `AfToast` | `experimental-in-beta` | baseline complete | dismiss button reachable | severity-driven `role` + `aria-live` covered | Danger/warning are assertive; success/info are polite. |
| `AfInlineMessage` | `experimental-in-beta` | baseline complete | dismiss button reachable when closable | severity-driven `role` + `aria-live` covered | Hidden state clears role/live-region attributes after dismiss. |

## Keyboard Contract Summary

- Dialogs close on `Escape` when dismissible and restore focus to the previous trigger when closing.
- Data-table rows support pointer activation and keyboard activation with `Enter` and `Space`.
- Interactive shell navigation exposes active state with `aria-current="page"`.
- Form controls depend on native inputs or renderer-native controls instead of recreating keyboard behavior from scratch.
- Dismiss actions for toasts and inline messages remain native buttons.

## ARIA And Labeling Rules

- Use attribute bindings for accessibility attributes where the values are dynamic.
- Prefer native interactive elements instead of div-based reimplementations.
- Form controls must keep label, hint and error relationships synchronized with the underlying control.
- Decorative icons stay outside the accessible name calculation.
- Feedback surfaces choose `status`/`polite` versus `alert`/`assertive` based on severity.

## Focus Management Rules

- Dialog uses focus trap primitives plus focus restoration on close.
- Showcase routing is section-based rather than router-based, so focus should stay on the triggering control unless a dialog opens.
- New beta components should not steal focus without a documented reason.

## Remaining Risks

- There is no automated screen-reader matrix yet.
- Form-control overlay behaviors still need broader cross-device QA before promotion.
- Feedback placement and stacking rules are covered functionally, but not yet validated through a dedicated visual regression gate.
- This audit is a beta engineering gate, not a full WCAG certification process.

## Manual Review Procedure

Use this checklist after significant UI changes:

1. Run `pnpm audit:accessibility`.
2. Run `pnpm start` and verify desktop and mobile shell modes.
3. Open dialogs from the showcase and confirm focus returns to the trigger after close.
4. Trigger feedback toasts and confirm dismiss buttons remain keyboard reachable.
5. Move through data-table rows with keyboard and verify the mobile renderer stays list-first.
