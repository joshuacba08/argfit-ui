import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NetworkStatusService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly onlineSignal = signal(true);

  readonly online = this.onlineSignal.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const view = this.document.defaultView;

    if (!view) {
      return;
    }

    const updateOnlineState = (): void => {
      this.onlineSignal.set(view.navigator.onLine);
    };

    updateOnlineState();
    view.addEventListener('online', updateOnlineState);
    view.addEventListener('offline', updateOnlineState);

    this.destroyRef.onDestroy(() => {
      view.removeEventListener('online', updateOnlineState);
      view.removeEventListener('offline', updateOnlineState);
    });
  }
}
