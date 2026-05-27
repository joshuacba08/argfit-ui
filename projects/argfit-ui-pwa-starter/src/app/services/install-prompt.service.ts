import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

type InstallOutcome = 'accepted' | 'dismissed' | 'installed' | 'unavailable' | 'idle';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms?: readonly string[];
  readonly userChoice: Promise<{
    readonly outcome: 'accepted' | 'dismissed';
    readonly platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class InstallPromptService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly deferredPromptSignal = signal<BeforeInstallPromptEvent | null>(null);
  private readonly standaloneDisplaySignal = signal(false);
  private readonly outcomeSignal = signal<InstallOutcome>('idle');

  readonly canPrompt = computed(() => this.deferredPromptSignal() !== null);
  readonly standaloneDisplay = this.standaloneDisplaySignal.asReadonly();
  readonly outcome = this.outcomeSignal.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const view = this.document.defaultView;

    if (!view) {
      return;
    }

    const updateStandaloneDisplay = (): void => {
      const standaloneQuery = view.matchMedia?.('(display-mode: standalone)');
      const fullscreenQuery = view.matchMedia?.('(display-mode: fullscreen)');
      const navigatorStandalone = Boolean((view.navigator as Navigator & { standalone?: boolean }).standalone);
      this.standaloneDisplaySignal.set(Boolean(standaloneQuery?.matches || fullscreenQuery?.matches || navigatorStandalone));
    };

    const handleBeforeInstallPrompt = (event: Event): void => {
      event.preventDefault();
      this.deferredPromptSignal.set(event as BeforeInstallPromptEvent);
      this.outcomeSignal.set('idle');
    };

    const handleInstalled = (): void => {
      this.deferredPromptSignal.set(null);
      this.outcomeSignal.set('installed');
      updateStandaloneDisplay();
    };

    updateStandaloneDisplay();
    view.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    view.addEventListener('appinstalled', handleInstalled);

    this.destroyRef.onDestroy(() => {
      view.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      view.removeEventListener('appinstalled', handleInstalled);
    });
  }

  async promptInstall(): Promise<InstallOutcome> {
    const event = this.deferredPromptSignal();

    if (!event) {
      this.outcomeSignal.set('unavailable');
      return 'unavailable';
    }

    await event.prompt();
    const choice = await event.userChoice;
    this.deferredPromptSignal.set(null);
    this.outcomeSignal.set(choice.outcome);

    return choice.outcome;
  }
}
