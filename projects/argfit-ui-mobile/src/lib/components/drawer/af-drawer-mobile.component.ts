import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  type AfDrawerPlacement,
  type AfDrawerSize,
  type AfDrawerTone,
} from '@argfit-ui/core';
import {
  AfEscapeKeyDirective,
  AfFocusInitialDirective,
  AfFocusTrapDirective,
} from '@argfit-ui/primitives';

@Component({
  selector: 'af-drawer-mobile',
  imports: [AfEscapeKeyDirective, AfFocusInitialDirective, AfFocusTrapDirective],
  templateUrl: './af-drawer-mobile.component.html',
  styleUrl: './af-drawer-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-drawer-mobile',
    '[attr.data-open]': 'open() ? "" : null',
  },
})
export class AfDrawerMobileComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly open = input(false, { transform: booleanAttribute });
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly placement = input<AfDrawerPlacement>('bottom');
  readonly size = input<AfDrawerSize>('md');
  readonly tone = input<AfDrawerTone>('neutral');
  readonly dismissible = input(true, { transform: booleanAttribute });
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaDescribedBy = input<string | undefined>(undefined);
  readonly closeLabel = input('Cerrar panel');

  readonly openChange = output<boolean>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly backdropPress = output<void>();
  readonly escapePress = output<KeyboardEvent>();

  protected readonly id = nextAfMobileDrawerId++;
  protected readonly titleId = `af-drawer-mobile-${this.id}-title`;
  protected readonly descriptionId = `af-drawer-mobile-${this.id}-desc`;
  protected readonly labelledBy = computed<string | null>(() => (this.ariaLabel() ? null : this.title() ? this.titleId : null));
  protected readonly describedBy = computed<string | null>(() => {
    if (this.ariaDescribedBy()) {
      return this.ariaDescribedBy() ?? null;
    }
    return this.description() ? this.descriptionId : null;
  });

  private readonly wasOpen = signal(false);
  private previousActiveElement: HTMLElement | null = null;
  private previousBodyOverflow: string | null = null;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const previously = this.wasOpen();

      if (isOpen === previously) {
        return;
      }

      this.wasOpen.set(isOpen);

      if (isOpen) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.wasOpen()) {
      this.unlockBodyScroll();
      this.restoreFocus();
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target !== event.currentTarget) {
      return;
    }

    this.backdropPress.emit();

    if (!this.dismissible() || !this.closeOnBackdrop()) {
      return;
    }

    this.requestClose();
  }

  protected onEscape(event: KeyboardEvent): void {
    this.escapePress.emit(event);

    if (!this.dismissible() || !this.closeOnEscape()) {
      return;
    }

    event.stopPropagation();
    this.requestClose();
  }

  protected onCloseButton(): void {
    this.requestClose();
  }

  private requestClose(): void {
    this.openChange.emit(false);
  }

  private handleOpen(): void {
    if (this.isBrowser) {
      this.previousActiveElement = (this.document.activeElement as HTMLElement | null) ?? null;
      this.lockBodyScroll();
    }

    this.opened.emit();
  }

  private handleClose(): void {
    if (this.isBrowser) {
      this.unlockBodyScroll();
      this.restoreFocus();
    }

    this.closed.emit();
  }

  private lockBodyScroll(): void {
    const body = this.document.body;

    if (!body) {
      return;
    }

    this.previousBodyOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    const body = this.document.body;

    if (!body) {
      return;
    }

    body.style.overflow = this.previousBodyOverflow ?? '';
    this.previousBodyOverflow = null;
  }

  private restoreFocus(): void {
    const target = this.previousActiveElement;
    this.previousActiveElement = null;

    if (
      target &&
      typeof target.focus === 'function' &&
      this.document.contains(target) &&
      !this.hostRef.nativeElement.contains(target)
    ) {
      target.focus();
    }
  }
}

let nextAfMobileDrawerId = 1;