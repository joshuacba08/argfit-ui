import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { AF_UI_CONFIG } from '../config/argfit-ui.config';
import { AF_MOBILE_MEDIA_QUERY } from '../tokens/breakpoints';
import type { AfPlatform, AfPlatformPreference } from '../types/platform.types';

@Injectable({
  providedIn: 'root',
})
export class AfPlatformService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly config = inject(AF_UI_CONFIG);
  private readonly preferenceSignal = signal<AfPlatformPreference>(this.config.platform ?? 'auto');
  private readonly detectedPlatformSignal = signal<AfPlatform>('desktop');

  readonly preference = this.preferenceSignal.asReadonly();
  readonly detectedPlatform = this.detectedPlatformSignal.asReadonly();
  readonly platform = computed<AfPlatform>(() => {
    const preference = this.preferenceSignal();
    return preference === 'auto' ? this.detectedPlatformSignal() : preference;
  });
  readonly isDesktop = computed(() => this.platform() === 'desktop');
  readonly isMobile = computed(() => this.platform() === 'mobile');

  constructor() {
    this.bindMediaQuery();
  }

  setPreference(preference: AfPlatformPreference): void {
    this.preferenceSignal.set(preference);
  }

  useAutoDetection(): void {
    this.setPreference('auto');
  }

  private bindMediaQuery(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const view = this.document.defaultView;

    if (!view || typeof view.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = view.matchMedia(AF_MOBILE_MEDIA_QUERY);

    const updateDetectedPlatform = (): void => {
      this.detectedPlatformSignal.set(mediaQuery.matches ? 'mobile' : 'desktop');
    };

    updateDetectedPlatform();
    mediaQuery.addEventListener('change', updateDetectedPlatform);

    this.destroyRef.onDestroy(() => {
      mediaQuery.removeEventListener('change', updateDetectedPlatform);
    });
  }
}
