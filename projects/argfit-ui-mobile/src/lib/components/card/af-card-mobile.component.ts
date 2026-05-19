import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    ViewEncapsulation,
} from '@angular/core';

import type { AfCardDensity, AfCardTone, AfCardVariant } from '@argfit-ui/core';

@Component({
  selector: 'af-card-mobile',
  templateUrl: './af-card-mobile.component.html',
  styleUrl: './af-card-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-card-mobile',
    '[class]': 'hostClasses()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-density]': 'density()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-interactive]': 'interactive() ? "" : null',
    '[attr.data-selected]': 'selected() ? "" : null',
    '[attr.tabindex]': 'interactive() ? 0 : null',
    '[attr.role]': 'interactive() ? "button" : null',
    '[attr.aria-pressed]': 'interactive() ? selected() : null',
  },
})
export class AfCardMobileComponent {
  readonly variant = input<AfCardVariant>('surface');
  readonly density = input<AfCardDensity>('comfortable');
  readonly tone = input<AfCardTone>('neutral');
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly selected = input(false, { transform: booleanAttribute });

  protected readonly hostClasses = computed(() => {
    const classes = ['af-card-mobile', `af-card-mobile--${this.variant()}`];
    classes.push(`af-card-mobile--density-${this.density()}`);
    classes.push(`af-card-mobile--tone-${this.tone()}`);

    if (this.interactive()) {
      classes.push('af-card-mobile--interactive');
    }

    if (this.selected()) {
      classes.push('af-card-mobile--selected');
    }

    return classes.join(' ');
  });
}
