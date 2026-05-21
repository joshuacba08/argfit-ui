import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import {
  AfPlatformService,
  type AfDrawerPlacement,
  type AfDrawerSize,
  type AfDrawerTone,
} from '@argfit-ui/core';
import { AfDrawerDesktopComponent } from '@argfit-ui/desktop';
import { AfDrawerMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-drawer',
  imports: [AfDrawerDesktopComponent, AfDrawerMobileComponent, NgTemplateOutlet],
  templateUrl: './af-drawer.component.html',
  styleUrl: './af-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfDrawerComponent {
  private readonly platform = inject(AfPlatformService);

  readonly open = input(false, { transform: booleanAttribute });
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly placement = input<AfDrawerPlacement>('end');
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