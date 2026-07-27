import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

import {
  AfPlatformService,
  type AfSkeletonAnimation,
  type AfSkeletonShape,
} from '@argfit-ui/core';
import { AfSkeletonDesktopComponent } from '@argfit-ui/desktop';
import { AfSkeletonMobileComponent } from '@argfit-ui/mobile';

/**
 * Loading placeholder.
 *
 * Exists so a loading surface can hold its shape without inventing content. Rendering
 * zeros or dashes while data is in flight is worse than showing nothing: the reader
 * cannot tell a real measurement from a placeholder.
 *
 * `AfProgress` with `variant="skeleton"` covers a single bar; this composes the block —
 * a paragraph, a media area, an avatar — which is what a card or a table row needs.
 */
@Component({
  selector: 'af-skeleton',
  imports: [AfSkeletonDesktopComponent, AfSkeletonMobileComponent],
  template: `
    @if (isMobile()) {
      <af-skeleton-mobile
        [shape]="shape()"
        [lines]="lines()"
        [width]="width()"
        [height]="height()"
        [radius]="radius()"
        [animation]="animation()"
        [ariaLabel]="ariaLabel()"
        [inline]="inline()"
      />
    } @else {
      <af-skeleton-desktop
        [shape]="shape()"
        [lines]="lines()"
        [width]="width()"
        [height]="height()"
        [radius]="radius()"
        [animation]="animation()"
        [ariaLabel]="ariaLabel()"
        [inline]="inline()"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfSkeletonComponent {
  private readonly platform = inject(AfPlatformService);

  readonly shape = input<AfSkeletonShape>('text');
  /** Solo aplica a `text`. La última línea se acorta para que se lea como prosa. */
  readonly lines = input(3, { transform: numberAttribute });
  readonly width = input<string | undefined>(undefined);
  readonly height = input<string | undefined>(undefined);
  readonly radius = input<string | undefined>(undefined);
  readonly animation = input<AfSkeletonAnimation>('pulse');
  readonly ariaLabel = input('Cargando');
  readonly inline = input(false, { transform: booleanAttribute });

  protected readonly isMobile = this.platform.isMobile;
}
