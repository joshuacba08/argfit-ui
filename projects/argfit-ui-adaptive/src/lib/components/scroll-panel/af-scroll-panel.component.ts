import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { AfPlatformService, type AfScrollPanelDirection } from '@argfit-ui/core';
import { AfScrollPanelDesktopComponent } from '@argfit-ui/desktop';
import { AfScrollPanelMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-scroll-panel',
  imports: [AfScrollPanelDesktopComponent, AfScrollPanelMobileComponent],
  templateUrl: './af-scroll-panel.component.html',
  styleUrl: './af-scroll-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfScrollPanelComponent {
  private readonly platform = inject(AfPlatformService);

  readonly ariaLabel = input('Scroll panel');
  readonly direction = input<AfScrollPanelDirection>('vertical');
  readonly maxHeight = input('18rem');

  protected readonly isMobile = this.platform.isMobile;
}