import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, type VersionEvent } from '@angular/service-worker';

export type PwaUpdateStatus = 'disabled' | 'idle' | 'checking' | 'available' | 'activated' | 'error';

@Injectable({
  providedIn: 'root',
})
export class PwaUpdateService {
  private readonly swUpdate = inject(SwUpdate, { optional: true });
  private readonly statusSignal = signal<PwaUpdateStatus>(this.swUpdate?.isEnabled ? 'idle' : 'disabled');
  private readonly latestEventSignal = signal<VersionEvent | null>(null);
  private readonly errorSignal = signal<string | null>(null);

  readonly status = this.statusSignal.asReadonly();
  readonly latestEvent = this.latestEventSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly updateAvailable = computed(() => this.statusSignal() === 'available');
  readonly enabled = computed(() => this.statusSignal() !== 'disabled');

  constructor() {
    if (!this.swUpdate?.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates.pipe(takeUntilDestroyed()).subscribe({
      next: (event) => this.handleVersionEvent(event),
      error: (error: unknown) => {
        this.statusSignal.set('error');
        this.errorSignal.set(error instanceof Error ? error.message : String(error));
      },
    });
  }

  async checkForUpdate(): Promise<boolean> {
    if (!this.swUpdate?.isEnabled) {
      this.statusSignal.set('disabled');
      return false;
    }

    this.statusSignal.set('checking');
    const available = await this.swUpdate.checkForUpdate();
    this.statusSignal.set(available ? 'available' : 'idle');
    return available;
  }

  async activateUpdate(reload = true): Promise<void> {
    if (!this.swUpdate?.isEnabled) {
      return;
    }

    await this.swUpdate.activateUpdate();
    this.statusSignal.set('activated');

    if (reload) {
      globalThis.location?.reload();
    }
  }

  private handleVersionEvent(event: VersionEvent): void {
    this.latestEventSignal.set(event);

    switch (event.type) {
      case 'VERSION_READY':
        this.statusSignal.set('available');
        this.errorSignal.set(null);
        break;
      case 'VERSION_INSTALLATION_FAILED':
        this.statusSignal.set('error');
        this.errorSignal.set(event.error);
        break;
      default:
        this.statusSignal.set('idle');
        this.errorSignal.set(null);
        break;
    }
  }
}
