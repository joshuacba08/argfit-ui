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
  type AfButtonSize,
  type AfButtonType,
  type AfButtonVariant,
} from '@argfit-ui/core';
import { AfButtonDesktopComponent } from '@argfit-ui/desktop';
import { AfButtonMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-button',
  imports: [AfButtonDesktopComponent, AfButtonMobileComponent],
  templateUrl: './af-button.component.html',
  styleUrl: './af-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfButtonComponent {
  private readonly platform = inject(AfPlatformService);

  readonly variant = input<AfButtonVariant>('primary');
  readonly size = input<AfButtonSize>('md');
  readonly type = input<AfButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null);
  readonly pressed = output<MouseEvent>();

  protected readonly isMobile = this.platform.isMobile;

  protected onPressed(event: MouseEvent): void {
    this.pressed.emit(event);
  }

  protected normalizeProjectedLabel(value: string | null): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }
}
