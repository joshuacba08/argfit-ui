import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import {
    AfToastService,
    type AfToastActionEvent,
    type AfToastPlacement,
} from '@argfit-ui/core';

import { AfToastMobileComponent } from '../toast/af-toast-mobile.component';

@Component({
  selector: 'af-toast-viewport-mobile',
  imports: [AfToastMobileComponent],
  template: `
    @if (toasts().length > 0) {
      <section class="af-toast-viewport-mobile__stack" [attr.aria-label]="ariaLabel()">
        @for (toast of toasts(); track toast.id) {
          <af-toast-mobile
            [toast]="toast"
            [closeLabel]="closeLabel()"
            (dismissed)="dismissToast($event)"
            (actionInvoked)="actionInvoked.emit($event)"
          />
        }
      </section>
    }
  `,
  styles: [
    `
      .af-toast-viewport-mobile {
        display: contents;
      }

      .af-toast-viewport-mobile__stack {
        display: flex;
        flex-direction: column;
        gap: var(--af-space-1_5);
        left: var(--af-space-3);
        pointer-events: none;
        position: fixed;
        right: var(--af-space-3);
        top: calc(env(safe-area-inset-top, 0px) + var(--af-space-3));
        z-index: 1100;
      }

      .af-toast-viewport-mobile[data-placement='bottom-center'] .af-toast-viewport-mobile__stack {
        bottom: calc(env(safe-area-inset-bottom, 0px) + var(--af-shell-mobile-tabbar-height));
        top: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-toast-viewport-mobile',
    '[attr.data-placement]': 'placement()',
  },
})
export class AfToastViewportMobileComponent {
  private readonly toastService = inject(AfToastService);

  readonly placement = input<AfToastPlacement>('top-center');
  readonly ariaLabel = input('Notificaciones');
  readonly closeLabel = input('Cerrar notificacion');

  /**
   * El viewport vive una sola vez en la raíz, así que aquí es donde la aplicación
   * despacha por `event.action.id`. El servicio no guarda manejadores: mantener funciones
   * de componente dentro de un singleton de core filtraría estado de UI a la capa de datos.
   */
  readonly actionInvoked = output<AfToastActionEvent>();

  protected readonly toasts = this.toastService.toasts;

  protected dismissToast(id: string): void {
    this.toastService.dismiss(id);
  }
}
