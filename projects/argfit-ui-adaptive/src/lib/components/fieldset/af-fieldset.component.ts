import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { AfPlatformService, type AfSectionDensity, type AfSurfaceTone } from '@argfit-ui/core';
import { AfFieldsetDesktopComponent } from '@argfit-ui/desktop';
import { AfFieldsetMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-fieldset',
  imports: [AfFieldsetDesktopComponent, AfFieldsetMobileComponent],
  templateUrl: './af-fieldset.component.html',
  styleUrl: './af-fieldset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfFieldsetComponent {
  private readonly platform = inject(AfPlatformService);

  readonly legend = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly density = input<AfSectionDensity>('comfortable');
  readonly tone = input<AfSurfaceTone>('neutral');
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isMobile = this.platform.isMobile;
}