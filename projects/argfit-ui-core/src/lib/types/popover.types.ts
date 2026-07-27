/**
 * Where the panel sits relative to its trigger.
 *
 * The `-start` and `-end` variants align the panel's edge with the trigger's edge instead
 * of centring it. Without them a trigger near the viewport edge — a context switcher in
 * the top-left of a header, a status indicator in the top-right — pushes its panel off
 * screen or leaves it visibly detached from what opened it.
 */
export type AfPopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export type AfPopoverTone = 'neutral' | 'primary';

/** Side of the trigger the panel opens towards, ignoring alignment. */
export type AfPopoverSide = 'top' | 'right' | 'bottom' | 'left';

/** How the panel lines up along the trigger's cross axis. */
export type AfPopoverAlignment = 'center' | 'start' | 'end';

/** Splits a placement into its side and its alignment. */
export function afSplitPlacement(placement: AfPopoverPlacement): {
  readonly side: AfPopoverSide;
  readonly alignment: AfPopoverAlignment;
} {
  const [side, alignment] = placement.split('-') as [AfPopoverSide, AfPopoverAlignment | undefined];
  return { side, alignment: alignment ?? 'center' };
}
