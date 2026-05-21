import { booleanAttribute, ChangeDetectionStrategy, Component, contentChild, inject, input, output } from '@angular/core';

import {
  AfPlatformService,
  type AfPopoverPlacement,
  type AfPopoverTone,
} from '@argfit-ui/core';
import { AfPopoverDesktopComponent } from '@argfit-ui/desktop';
import { AfPopoverMobileComponent } from '@argfit-ui/mobile';
import { AfPopoverContentDirective, AfPopoverTriggerDirective } from './af-popover-slots.directive';

@Component({
  selector: 'af-popover',
  imports: [AfPopoverDesktopComponent, AfPopoverMobileComponent],
  templateUrl: './af-popover.component.html',
  styleUrl: './af-popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfPopoverComponent {
  private readonly platform = inject(AfPlatformService);

  protected readonly triggerSlot = contentChild(AfPopoverTriggerDirective);
  protected readonly contentSlot = contentChild(AfPopoverContentDirective);

  readonly open = input(false, { transform: booleanAttribute });
  readonly title = input<string | undefined>(undefined);
  readonly placement = input<AfPopoverPlacement>('bottom');
  readonly tone = input<AfPopoverTone>('neutral');
  readonly dismissible = input(true, { transform: booleanAttribute });
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly closeLabel = input('Cerrar popover');

  readonly openChange = output<boolean>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly backdropPress = output<void>();
  readonly escapePress = output<KeyboardEvent>();

  protected readonly isMobile = this.platform.isMobile;

  protected onOpenChange(next: boolean): void {
    this.openChange.emit(next);
  }

  protected onOpened(): void {
    this.opened.emit();
  }

  protected onClosed(): void {
    this.closed.emit();
  }

  protected onBackdropPress(): void {
    this.backdropPress.emit();
  }

  protected onEscapePress(event: KeyboardEvent): void {
    this.escapePress.emit(event);
  }
}