import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
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
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  type AfPopoverPlacement,
  type AfPopoverTone,
} from '@argfit-ui/core';
import {
  AfEscapeKeyDirective,
  AfFocusInitialDirective,
  AfFocusTrapDirective,
} from '@argfit-ui/primitives';

@Component({
  selector: 'af-popover-mobile',
  imports: [AfEscapeKeyDirective, AfFocusInitialDirective, AfFocusTrapDirective, NgTemplateOutlet],
  templateUrl: './af-popover-mobile.component.html',
  styleUrl: './af-popover-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-popover-mobile',
    '[attr.data-open]': 'open() ? "" : null',
  },
})
export class AfPopoverMobileComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly open = input(false, { transform: booleanAttribute });
  readonly title = input<string | undefined>(undefined);
  readonly placement = input<AfPopoverPlacement>('bottom');
  readonly tone = input<AfPopoverTone>('neutral');
  readonly dismissible = input(true, { transform: booleanAttribute });
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly closeLabel = input('Cerrar ayuda');
  readonly triggerTemplate = input<TemplateRef<unknown> | null>(null);
  readonly contentTemplate = input<TemplateRef<unknown> | null>(null);

  readonly openChange = output<boolean>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly backdropPress = output<void>();
  readonly escapePress = output<KeyboardEvent>();

  protected readonly id = nextAfMobilePopoverId++;
  protected readonly titleId = `af-popover-mobile-${this.id}-title`;
  protected readonly labelledBy = computed<string | null>(() => (this.ariaLabel() ? null : this.title() ? this.titleId : null));

  private readonly wasOpen = signal(false);
  private previousActiveElement: HTMLElement | null = null;

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
      this.restoreFocus();
    }
  }

  protected onTriggerClick(event: MouseEvent): void {
    event.stopPropagation();
    this.openChange.emit(!this.open());
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.openChange.emit(true);
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
    }

    this.opened.emit();
  }

  private handleClose(): void {
    if (this.isBrowser) {
      this.restoreFocus();
    }

    this.closed.emit();
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

let nextAfMobilePopoverId = 1;
