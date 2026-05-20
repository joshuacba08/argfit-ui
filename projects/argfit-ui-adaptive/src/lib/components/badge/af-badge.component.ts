import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import {
    AfPlatformService,
    type AfBadgeShape,
    type AfBadgeSize,
    type AfBadgeTone,
    type AfBadgeVariant,
    type AfIconName,
} from '@argfit-ui/core';
import { AfBadgeDesktopComponent } from '@argfit-ui/desktop';
import { AfBadgeMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-badge',
  imports: [AfBadgeDesktopComponent, AfBadgeMobileComponent, NgTemplateOutlet],
  templateUrl: './af-badge.component.html',
  styleUrl: './af-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfBadgeComponent {
  private readonly platform = inject(AfPlatformService);

  readonly tone = input<AfBadgeTone | undefined>(undefined);
  readonly variant = input<AfBadgeVariant>('soft');
  readonly size = input<AfBadgeSize>('sm');
  readonly shape = input<AfBadgeShape>('pill');
  readonly dot = input(false, { transform: booleanAttribute });
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly isMobile = this.platform.isMobile;
}
