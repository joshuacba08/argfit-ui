import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ButtonDirective } from 'primeng/button';

import {
  AfThemeService,
  type AfButtonIconPosition,
  type AfButtonSize,
  type AfButtonType,
  type AfButtonVariant,
  type AfIconName,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

@Component({
  selector: 'af-button-desktop',
  imports: [ButtonDirective, AfIconComponent],
  templateUrl: './af-button-desktop.component.html',
  styleUrl: './af-button-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.af-button-host-full]': 'fullWidth()',
  },
})
export class AfButtonDesktopComponent {
  readonly variant = input<AfButtonVariant>('primary');
  readonly size = input<AfButtonSize>('md');
  readonly type = input<AfButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly icon = input<AfIconName | null>(null);
  readonly iconPosition = input<AfButtonIconPosition>('start');
  readonly label = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly pressed = output<MouseEvent>();

  constructor() {
    inject(AfThemeService);
  }

  protected onClick(event: MouseEvent): void {
    if (this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.pressed.emit(event);
  }
}
