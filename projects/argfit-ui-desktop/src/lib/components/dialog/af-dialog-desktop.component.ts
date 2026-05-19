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

import type {
    AfDialogSize,
    AfDialogTone,
} from '@argfit-ui/core';
import {
    AfEscapeKeyDirective,
    AfFocusInitialDirective,
    AfFocusTrapDirective,
} from '@argfit-ui/primitives';

let nextAfDesktopDialogId = 0;

@Component({
  selector: 'af-dialog-desktop',
  imports: [AfEscapeKeyDirective, AfFocusTrapDirective, AfFocusInitialDirective],
  templateUrl: './af-dialog-desktop.component.html',
  styleUrl: './af-dialog-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-dialog-desktop',
    '[attr.data-open]': 'open() ? "" : null',
  },
})
export class AfDialogDesktopComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly open = input(false, { transform: booleanAttribute });
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly size = input<AfDialogSize>('md');
  readonly tone = input<AfDialogTone>('neutral');
  readonly dismissible = input(true, { transform: booleanAttribute });
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaDescribedBy = input<string | undefined>(undefined);
  readonly closeLabel = input<string>('Cerrar');

  readonly openChange = output<boolean>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly backdropPress = output<void>();
  readonly escapePress = output<KeyboardEvent>();

  protected readonly id = ++nextAfDesktopDialogId;
  protected readonly titleId = `af-dialog-desktop-${this.id}-title`;
  protected readonly descriptionId = `af-dialog-desktop-${this.id}-desc`;

  protected readonly role = computed<'dialog' | 'alertdialog'>(() =>
    this.tone() === 'danger' ? 'alertdialog' : 'dialog',
  );

  protected readonly labelledBy = computed<string | null>(() => {
    if (this.ariaLabel()) {
      return null;
    }
    return this.title() ? this.titleId : null;
  });

  protected readonly describedBy = computed<string | null>(() => {
    if (this.ariaDescribedBy()) {
      return this.ariaDescribedBy() ?? null;
    }
    return this.description() ? this.descriptionId : null;
  });

  private previousActiveElement: HTMLElement | null = null;
  private previousBodyOverflow: string | null = null;
  private previousBodyPaddingRight: string | null = null;
  private readonly wasOpen = signal(false);

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
      this.previousActiveElement =
        (this.document.activeElement as HTMLElement | null) ?? null;
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
    const view = this.document.defaultView;
    const scrollbarWidth = view
      ? view.innerWidth - this.document.documentElement.clientWidth
      : 0;
    this.previousBodyOverflow = body.style.overflow;
    this.previousBodyPaddingRight = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  private unlockBodyScroll(): void {
    const body = this.document.body;
    if (!body) {
      return;
    }
    body.style.overflow = this.previousBodyOverflow ?? '';
    body.style.paddingRight = this.previousBodyPaddingRight ?? '';
    this.previousBodyOverflow = null;
    this.previousBodyPaddingRight = null;
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
