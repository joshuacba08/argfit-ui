import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import {
    AfPlatformService,
    type AfToastActionEvent,
    type AfToastPlacement,
} from '@argfit-ui/core';
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
        (actionInvoked)="actionInvoked.emit($event)"
      />
    } @else {
      <af-toast-viewport-desktop
        [placement]="effectivePlacement()"
        [ariaLabel]="ariaLabel()"
        [closeLabel]="closeLabel()"
        (actionInvoked)="actionInvoked.emit($event)"
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

  /**
   * Acción activada dentro de un aviso.
   *
   * El viewport vive una sola vez en la raíz de la aplicación, así que es el punto natural
   * de despacho: el consumidor discrimina por `event.action.id`. El servicio de toasts no
   * guarda manejadores a propósito —almacenar funciones de componente en un singleton de
   * core filtraría estado de UI a la capa de datos y dificultaría su liberación.
   */
  readonly actionInvoked = output<AfToastActionEvent>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly effectivePlacement = computed<AfToastPlacement>(() =>
    this.placement() ?? (this.isMobile() ? 'top-center' : 'top-end'),
  );
}
