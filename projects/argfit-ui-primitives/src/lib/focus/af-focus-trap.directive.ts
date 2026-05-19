import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ContentChild,
  Directive,
  ElementRef,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  input,
  type OnDestroy,
} from '@angular/core';

import { AfFocusInitialDirective } from './af-focus-initial.directive';

/**
 * Headless focus trap primitive. Contains keyboard focus within the host
 * element while enabled, optionally honouring an `afFocusInitial` child as the
 * first focus target. Does not render UI nor execute product logic.
 */
@Directive({
  selector: '[afFocusTrap]',
  exportAs: 'afFocusTrap',
})
export class AfFocusTrapDirective implements OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /** Whether the trap is active. */
  readonly afFocusTrapEnabled = input(true, { transform: booleanAttribute });

  @ContentChild(AfFocusInitialDirective, { static: false })
  protected initialFocusTarget?: AfFocusInitialDirective;

  private focusTrap: FocusTrap | null = null;
  private previousActiveElement: HTMLElement | null = null;

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);

    effect(() => {
      const enabled = this.afFocusTrapEnabled();

      if (!this.focusTrap) {
        return;
      }

      this.focusTrap.enabled = enabled;

      if (enabled) {
        this.activate();
      } else {
        this.restoreFocus();
      }
    });
  }

  ngOnDestroy(): void {
    this.focusTrap?.destroy();
    this.focusTrap = null;
    this.restoreFocus();
  }

  private activate(): void {
    this.previousActiveElement = (this.document.activeElement as HTMLElement | null) ?? null;

    afterNextRender(
      () => {
        const initial = this.initialFocusTarget?.elementRef.nativeElement;

        if (initial) {
          initial.focus();
          return;
        }

        const focused = this.focusTrap?.focusFirstTabbableElement();

        if (!focused) {
          this.focusFirstTabbableFallback();
        }
      },
      { injector: this.injector },
    );
  }

  private focusFirstTabbableFallback(): void {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const candidate = this.elementRef.nativeElement.querySelector<HTMLElement>(selector);
    candidate?.focus();
  }

  private restoreFocus(): void {
    if (!this.isBrowser) {
      return;
    }

    const target = this.previousActiveElement;
    this.previousActiveElement = null;

    if (target && typeof target.focus === 'function' && this.document.contains(target)) {
      target.focus();
    }
  }
}
