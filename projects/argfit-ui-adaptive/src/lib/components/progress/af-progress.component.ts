import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import {
  AfPlatformService,
  type AfProgressSize,
  type AfProgressTone,
  type AfProgressVariant,
} from '@argfit-ui/core';
import { AfProgressDesktopComponent } from '@argfit-ui/desktop';
import { AfProgressMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-progress',
  imports: [AfProgressDesktopComponent, AfProgressMobileComponent],
  templateUrl: './af-progress.component.html',
  styleUrl: './af-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfProgressComponent {
  private readonly platform = inject(AfPlatformService);

  readonly variant = input<AfProgressVariant>('bar');
  readonly tone = input<AfProgressTone>('primary');
  readonly size = input<AfProgressSize>('md');
  readonly value = input(0);
  readonly max = input(100);
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly skeletonWidth = input('100%');

  protected readonly isMobile = this.platform.isMobile;
}
