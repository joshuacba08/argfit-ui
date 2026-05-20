export type AfFeedbackSeverity = 'success' | 'info' | 'warning' | 'danger';

export type AfToastPlacement = 'top-end' | 'top-center' | 'bottom-center';

export interface AfToastOptions {
  readonly title: string;
  readonly description?: string;
  readonly severity?: AfFeedbackSeverity;
  readonly duration?: number;
  readonly persistent?: boolean;
  readonly id?: string;
}

export interface AfToast {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly severity: AfFeedbackSeverity;
  readonly duration: number;
  readonly persistent: boolean;
}
