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

import { AfToastDesktopComponent } from '../toast/af-toast-desktop.component';

@Component({
  selector: 'af-toast-viewport-desktop',
  imports: [AfToastDesktopComponent],
  template: `
    @if (toasts().length > 0) {
      <section class="af-toast-viewport-desktop__stack" [attr.aria-label]="ariaLabel()">
        @for (toast of toasts(); track toast.id) {
          <af-toast-desktop
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
      .af-toast-viewport-desktop {
        display: contents;
      }

      .af-toast-viewport-desktop__stack {
        display: flex;
        flex-direction: column;
        gap: var(--af-space-2);
        pointer-events: none;
        position: fixed;
        right: var(--af-space-4);
        top: var(--af-space-4);
        width: min(380px, calc(100vw - var(--af-space-8)));
        z-index: 1100;
      }

      .af-toast-viewport-desktop[data-placement='top-center'] .af-toast-viewport-desktop__stack {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
      }

      .af-toast-viewport-desktop[data-placement='bottom-center'] .af-toast-viewport-desktop__stack {
        bottom: var(--af-space-4);
        left: 50%;
        right: auto;
        top: auto;
        transform: translateX(-50%);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-toast-viewport-desktop',
    '[attr.data-placement]': 'placement()',
  },
})
export class AfToastViewportDesktopComponent {
  private readonly toastService = inject(AfToastService);

  readonly placement = input<AfToastPlacement>('top-end');
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
