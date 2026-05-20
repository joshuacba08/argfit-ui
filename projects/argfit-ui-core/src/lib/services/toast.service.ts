import { Injectable, OnDestroy, signal } from '@angular/core';

import type { AfFeedbackSeverity, AfToast, AfToastOptions } from '../types/feedback.types';

const AF_TOAST_DEFAULT_DURATION = 4000;

@Injectable({
  providedIn: 'root',
})
export class AfToastService implements OnDestroy {
  private readonly toastsSignal = signal<readonly AfToast[]>([]);
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  readonly toasts = this.toastsSignal.asReadonly();

  show(options: AfToastOptions): string {
    const id = this.resolveId(options.id);
    const duration = Math.max(0, options.duration ?? AF_TOAST_DEFAULT_DURATION);
    const persistent = options.persistent === true || duration === 0;
    const toast: AfToast = {
      id,
      title: options.title,
      description: options.description,
      severity: options.severity ?? 'info',
      duration,
      persistent,
    };

    this.clearTimer(id);
    this.toastsSignal.update((current) => [
      ...current.filter((item) => item.id !== id),
      toast,
    ]);

    if (!persistent) {
      this.timers.set(id, setTimeout(() => this.dismiss(id), duration));
    }

    return id;
  }

  success(options: Omit<AfToastOptions, 'severity'>): string {
    return this.showWithSeverity('success', options);
  }

  info(options: Omit<AfToastOptions, 'severity'>): string {
    return this.showWithSeverity('info', options);
  }

  warning(options: Omit<AfToastOptions, 'severity'>): string {
    return this.showWithSeverity('warning', options);
  }

  danger(options: Omit<AfToastOptions, 'severity'>): string {
    return this.showWithSeverity('danger', options);
  }

  dismiss(id: string): void {
    this.clearTimer(id);
    this.toastsSignal.update((current) => current.filter((toast) => toast.id !== id));
  }

  clear(): void {
    for (const id of this.timers.keys()) {
      this.clearTimer(id);
    }
    this.toastsSignal.set([]);
  }

  ngOnDestroy(): void {
    this.clear();
  }

  private showWithSeverity(
    severity: AfFeedbackSeverity,
    options: Omit<AfToastOptions, 'severity'>,
  ): string {
    return this.show({ ...options, severity });
  }

  private resolveId(id: string | undefined): string {
    const providedId = id?.trim();
    if (providedId) {
      return providedId;
    }

    this.nextId += 1;
    return `af-toast-${this.nextId}`;
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (!timer) {
      return;
    }

    clearTimeout(timer);
    this.timers.delete(id);
  }
}
