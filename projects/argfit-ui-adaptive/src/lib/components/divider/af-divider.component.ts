import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { AfPlatformService, type AfDividerOrientation, type AfDividerTone } from '@argfit-ui/core';
import { AfDividerDesktopComponent } from '@argfit-ui/desktop';
import { AfDividerMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-divider',
  imports: [AfDividerDesktopComponent, AfDividerMobileComponent],
  templateUrl: './af-divider.component.html',
  styleUrl: './af-divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfDividerComponent {
  private readonly platform = inject(AfPlatformService);

  readonly label = input<string | undefined>(undefined);
  readonly orientation = input<AfDividerOrientation>('horizontal');
  readonly tone = input<AfDividerTone>('subtle');

  protected readonly isMobile = this.platform.isMobile;
}