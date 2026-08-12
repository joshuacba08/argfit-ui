import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Región viva para anuncios de lectores de pantalla.
 *
 * Existe porque un cambio de estado que solo se ve — un evento que se movió
 * media hora, un rango que cambió de semana — no existe para quien navega con
 * lector. El elemento está siempre en el DOM: crear el contenedor y su texto en
 * el mismo tick hace que muchos lectores no anuncien nada, así que el
 * contenedor se monta vacío y solo cambia su contenido.
 *
 * Se oculta visualmente con la técnica de recorte estándar en lugar de
 * `display: none` o `visibility: hidden`, que lo sacarían del árbol de
 * accesibilidad y anularían el propósito.
 */
@Component({
  selector: 'af-live-region',
  standalone: true,
  template: `{{ message() }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'af-live-region',
    '[attr.aria-live]': 'politeness()',
    '[attr.aria-atomic]': 'atomic() ? "true" : "false"',
    role: 'status',
  },
  styles: [
    `
      .af-live-region {
        border: 0;
        clip-path: inset(50%);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }
    `,
  ],
})
export class AfLiveRegionComponent {
  /** Texto a anunciar. Vaciarlo y volver a escribirlo fuerza un reanuncio. */
  readonly message = input<string>('');

  /**
   * `polite` espera a que el lector termine la frase en curso; `assertive`
   * interrumpe. Los pasos de un arrastre son `polite`: interrumpir en cada
   * flecha convertiría el modo mover en ruido.
   */
  readonly politeness = input<'polite' | 'assertive'>('polite');

  readonly atomic = input<boolean>(true);
}
