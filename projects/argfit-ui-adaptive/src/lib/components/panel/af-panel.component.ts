import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';

import { AfPlatformService, type AfSectionDensity, type AfSurfaceTone } from '@argfit-ui/core';
import { AfPanelDesktopComponent } from '@argfit-ui/desktop';
import { AfPanelMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-panel',
  imports: [AfPanelDesktopComponent, AfPanelMobileComponent],
  templateUrl: './af-panel.component.html',
  styleUrl: './af-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfPanelComponent {
  private readonly platform = inject(AfPlatformService);

  readonly heading = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly density = input<AfSectionDensity>('comfortable');
  readonly tone = input<AfSurfaceTone>('neutral');

  protected readonly isMobile = this.platform.isMobile;
}