import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import {
  AfPlatformService,
  type AfAvatarShape,
  type AfAvatarSize,
  type AfAvatarTone,
  type AfIconName,
} from '@argfit-ui/core';
import { AfAvatarDesktopComponent } from '@argfit-ui/desktop';
import { AfAvatarMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-avatar',
  imports: [AfAvatarDesktopComponent, AfAvatarMobileComponent],
  templateUrl: './af-avatar.component.html',
  styleUrl: './af-avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfAvatarComponent {
  private readonly platform = inject(AfPlatformService);

  readonly label = input<string | undefined>(undefined);
  readonly initials = input<string | undefined>(undefined);
  readonly imageSrc = input<string | undefined>(undefined);
  readonly imageAlt = input<string | undefined>(undefined);
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly size = input<AfAvatarSize>('md');
  readonly tone = input<AfAvatarTone>('neutral');
  readonly shape = input<AfAvatarShape>('circle');
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly isMobile = this.platform.isMobile;
}
