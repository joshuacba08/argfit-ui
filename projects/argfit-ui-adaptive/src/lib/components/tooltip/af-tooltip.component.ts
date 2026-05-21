import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import {
  AfPlatformService,
  type AfTooltipPlacement,
  type AfTooltipTone,
} from '@argfit-ui/core';
import { AfTooltipDesktopComponent } from '@argfit-ui/desktop';
import { AfTooltipMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-tooltip',
  imports: [AfTooltipDesktopComponent, AfTooltipMobileComponent, NgTemplateOutlet],
  templateUrl: './af-tooltip.component.html',
  styleUrl: './af-tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfTooltipComponent {
  private readonly platform = inject(AfPlatformService);

  readonly open = input(false, { transform: booleanAttribute });
  readonly text = input<string | undefined>(undefined);
  readonly placement = input<AfTooltipPlacement>('top');
  readonly tone = input<AfTooltipTone>('neutral');
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly isMobile = this.platform.isMobile;
}