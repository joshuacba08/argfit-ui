# Productive Accessibility

This document defines the accessibility posture for the frozen `1.0.0` ArgFit UI contract.

It complements [productive components](./components.md) and [enterprise readiness](./enterprise-readiness.md). The component guide gives per-surface notes; this page explains the cross-cutting rules that application code should preserve when building on top of ArgFit.

## Baseline

The productive posture targets WCAG AA-oriented application behavior:

- visible focus states
- keyboard-complete primary interactions
- explicit labels, descriptions and error relationships
- severity-appropriate live-region behavior
- safe disclosure patterns on both desktop and mobile

The release gate continues to rely on `pnpm release:production:check`, which inherits the broader accessibility validation already wired into the repository.

## Focus Management Rules

- `AfDialog` must keep focus trapping, `Escape` close when dismissible and focus return to the trigger.
- `AfDrawer` should follow the same open, close and focus-restoration expectations as a secondary overlay surface.
- New product flows should not steal focus without a documented reason.
- Virtualized or recycled item surfaces must preserve focus continuity when items update.

## Labeling Rules

- Inputs and selection controls must keep label, hint and error copy synchronized with the underlying control.
- Prefix and suffix icons in `AfIconField` should remain decorative unless they are explicit interactive controls.
- Status-only visuals such as badges or chips must not carry meaning through color alone.
- Charts, metric cards and analytics panels need readable labels and should not leave critical meaning only in the visual layer.

## Keyboard Rules

- Button, chip-dismiss, toast-dismiss and inline-message-dismiss actions must remain keyboard reachable.
- Row activation in `AfDataTable` must preserve keyboard behavior for table and mobile-list renderers.
- Tree, tree-table, tabs, accordion and stepper flows must expose active or expanded state clearly.
- Drag-capable workflow surfaces such as `AfKanban` still require non-drag movement paths.

## Live Region And Feedback Rules

- `AfToast` should use severity-appropriate live-region semantics and should not replace blocking inline validation.
- `AfInlineMessage` is the preferred surface for persistent local errors, warnings and empty-state guidance.
- Loading and empty states in analytics, charts and data surfaces should remain explicit rather than implied by absence.

## Mobile Disclosure Rules

- `AfTooltip` must not gate critical information behind hover-only behavior.
- Dense edit flows should prefer drawer, sheet or fullscreen presentation over stacked small overlays.
- Touch targets for toggles, segmented control, list selection and dismiss actions must stay comfortable on the mobile renderer.

## Manual Review Checklist

Use this checklist after major UI changes or wrapper work:

1. Run `pnpm release:production:check` for the full productive gate.
2. Verify dialog and drawer focus return from the showcase or a consumer app.
3. Walk table, tabs, tree and kanban interactions with keyboard only.
4. Trigger success, warning and danger feedback paths and confirm severity semantics remain appropriate.
5. Verify that mobile disclosure patterns do not depend on hover.

## Related Docs

- [Productive components](./components.md)
- [Productive quickstart](./quickstart.md)
- [Productive theming](./theming.md)
- [Productive enterprise readiness](./enterprise-readiness.md)
- [Productive quality gates](./quality-gates.md)
