import { NgTemplateOutlet } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
} from '@angular/core';

import {
    AfPlatformService,
    type AfDialogMobilePresentation,
    type AfDialogSize,
    type AfDialogTone,
} from '@argfit-ui/core';
import { AfDialogDesktopComponent } from '@argfit-ui/desktop';
import { AfDialogMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-dialog',
  imports: [AfDialogDesktopComponent, AfDialogMobileComponent, NgTemplateOutlet],
  templateUrl: './af-dialog.component.html',
  styleUrl: './af-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfDialogComponent {
  private readonly platform = inject(AfPlatformService);

  readonly open = input(false, { transform: booleanAttribute });
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly size = input<AfDialogSize>('md');
  readonly tone = input<AfDialogTone>('neutral');
  readonly mobilePresentation = input<AfDialogMobilePresentation>('sheet');
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
