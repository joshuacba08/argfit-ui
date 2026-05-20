import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { AfPlatformService, type AfToastPlacement } from '@argfit-ui/core';
import { AfToastViewportDesktopComponent } from '@argfit-ui/desktop';
import { AfToastViewportMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-toast-viewport',
  imports: [AfToastViewportDesktopComponent, AfToastViewportMobileComponent],
  template: `
    @if (isMobile()) {
      <af-toast-viewport-mobile
        [placement]="effectivePlacement()"
        [ariaLabel]="ariaLabel()"
        [closeLabel]="closeLabel()"
      />
    } @else {
      <af-toast-viewport-desktop
        [placement]="effectivePlacement()"
        [ariaLabel]="ariaLabel()"
        [closeLabel]="closeLabel()"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfToastViewportComponent {
  private readonly platform = inject(AfPlatformService);

  readonly placement = input<AfToastPlacement | undefined>(undefined);
  readonly ariaLabel = input('Notificaciones');
  readonly closeLabel = input('Cerrar notificacion');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly effectivePlacement = computed<AfToastPlacement>(() =>
    this.placement() ?? (this.isMobile() ? 'top-center' : 'top-end'),
  );
}
