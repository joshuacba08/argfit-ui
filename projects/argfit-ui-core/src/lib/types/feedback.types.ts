export type AfFeedbackSeverity = 'success' | 'info' | 'warning' | 'danger';

export type AfToastPlacement = 'top-end' | 'top-center' | 'bottom-center';

/**
 * Optional action offered inside a toast.
 *
 * A confirmation that cannot be acted on forces the user to go hunting for the thing that
 * just happened: "Deshacer" after a destructive change, or "Abrir" after a creation, are
 * part of the feedback, not decoration.
 *
 * The toast carries the label; the handler stays with whoever raised it, because the
 * service must not hold references to component state.
 */
export interface AfToastAction {
  readonly label: string;
  /** Overrides the accessible name when the visible label is too terse on its own. */
  readonly ariaLabel?: string;
  /** Free identifier echoed back on `actionInvoked`, for callers juggling several toasts. */
  readonly id?: string;
}

export interface AfToastOptions {
  readonly title: string;
  readonly description?: string;
  readonly severity?: AfFeedbackSeverity;
  readonly duration?: number;
  readonly persistent?: boolean;
  readonly id?: string;
  readonly action?: AfToastAction;
}

export interface AfToast {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly severity: AfFeedbackSeverity;
  readonly duration: number;
  readonly persistent: boolean;
  readonly action?: AfToastAction;
}

/** Payload emitted when the user activates a toast action. */
export interface AfToastActionEvent {
  readonly toastId: string;
  readonly action: AfToastAction;
}
