import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfDividerOrientation, type AfDividerTone } from '@argfit-ui/core';

@Component({
  selector: 'af-divider-mobile',
  templateUrl: './af-divider-mobile.component.html',
  styleUrl: './af-divider-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-divider-mobile',
    '[class]': 'hostClasses()',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.aria-label]': 'label() ?? null',
  },
})
export class AfDividerMobileComponent {
  readonly label = input<string | undefined>(undefined);
  readonly orientation = input<AfDividerOrientation>('horizontal');
  readonly tone = input<AfDividerTone>('subtle');

  protected readonly hostClasses = computed(() =>
    ['af-divider-mobile', `af-divider-mobile--${this.orientation()}`, `af-divider-mobile--tone-${this.tone()}`].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}
