import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  output,
} from '@angular/core';

import {
  AfThemeService,
  type AfButtonIconPosition,
  type AfButtonSize,
  type AfButtonType,
  type AfButtonVariant,
  type AfIconName,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

let nextAfMobileButtonId = 0;

@Component({
  selector: 'af-button-mobile',
  imports: [AfIconComponent],
  templateUrl: './af-button-mobile.component.html',
  styleUrl: './af-button-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    '[class.af-button-host-full]': 'fullWidth()',
  },
})
export class AfButtonMobileComponent {
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

  protected readonly contentId = `af-button-mobile-content-${nextAfMobileButtonId++}`;

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
