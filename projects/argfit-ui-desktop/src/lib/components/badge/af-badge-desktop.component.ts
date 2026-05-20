import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    ViewEncapsulation,
} from '@angular/core';

import {
    AfThemeService,
    type AfBadgeShape,
    type AfBadgeSize,
    type AfBadgeTone,
    type AfBadgeVariant,
    type AfIconName,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

@Component({
  selector: 'af-badge-desktop',
  imports: [AfIconComponent],
  templateUrl: './af-badge-desktop.component.html',
  styleUrl: './af-badge-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-badge-desktop',
    '[class]': 'hostClasses()',
    '[attr.data-tone]': 'effectiveTone()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'effectiveShape()',
    '[attr.aria-label]': 'ariaLabel() ?? null',
  },
})
export class AfBadgeDesktopComponent {
  readonly tone = input<AfBadgeTone | undefined>(undefined);
  readonly variant = input<AfBadgeVariant>('soft');
  readonly size = input<AfBadgeSize>('sm');
  readonly shape = input<AfBadgeShape>('pill');
  readonly dot = input(false, { transform: booleanAttribute });
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly effectiveTone = computed<AfBadgeTone>(
    () => this.tone() ?? (this.variant() === 'tag' ? 'neutral' : 'primary'),
  );
  protected readonly effectiveShape = computed<AfBadgeShape>(() =>
    this.variant() === 'tag' ? 'rounded' : this.shape(),
  );

  protected readonly hostClasses = computed(() =>
    [
      'af-badge-desktop',
      `af-badge-desktop--${this.variant()}`,
      `af-badge-desktop--tone-${this.effectiveTone()}`,
      `af-badge-desktop--${this.size()}`,
      `af-badge-desktop--shape-${this.effectiveShape()}`,
    ].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}
