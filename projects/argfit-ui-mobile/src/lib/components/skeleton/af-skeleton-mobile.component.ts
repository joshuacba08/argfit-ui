import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    numberAttribute,
    ViewEncapsulation,
} from '@angular/core';

import type { AfSkeletonAnimation, AfSkeletonShape } from '@argfit-ui/core';

/**
 * Mobile renderer for `AfSkeleton`.
 */
@Component({
  selector: 'af-skeleton-mobile',
  templateUrl: './af-skeleton-mobile.component.html',
  styleUrl: './af-skeleton-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-skeleton-mobile',
    '[attr.data-shape]': 'shape()',
    '[attr.data-animation]': 'animation()',
    // El contenido es un marcador de posición: se anuncia el estado, no las formas.
    '[attr.role]': '"status"',
    '[attr.aria-busy]': '"true"',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class AfSkeletonMobileComponent {
  readonly shape = input<AfSkeletonShape>('text');
  readonly lines = input(3, { transform: numberAttribute });
  readonly width = input<string | undefined>(undefined);
  readonly height = input<string | undefined>(undefined);
  readonly radius = input<string | undefined>(undefined);
  readonly animation = input<AfSkeletonAnimation>('pulse');
  readonly ariaLabel = input('Cargando');
  readonly inline = input(false, { transform: booleanAttribute });

  protected readonly lineCount = computed(() =>
    this.shape() === 'text' ? Math.max(1, this.lines()) : 1,
  );

  /**
   * La última línea se acorta porque es lo que hace que un bloque se lea como prosa.
   * Con todas iguales el marcador parece una tabla y desorienta.
   */
  protected lineWidth(index: number): string | null {
    if (this.shape() !== 'text') {
      return this.width() ?? null;
    }
    const isLast = index === this.lineCount() - 1;
    return isLast && this.lineCount() > 1 ? '62%' : (this.width() ?? '100%');
  }
}
