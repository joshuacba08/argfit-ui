import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfDividerOrientation, type AfDividerTone } from '@argfit-ui/core';

@Component({
  selector: 'af-divider-desktop',
  templateUrl: './af-divider-desktop.component.html',
  styleUrl: './af-divider-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-divider-desktop',
    '[class]': 'hostClasses()',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.aria-label]': 'label() ?? null',
  },
})
export class AfDividerDesktopComponent {
  readonly label = input<string | undefined>(undefined);
  readonly orientation = input<AfDividerOrientation>('horizontal');
  readonly tone = input<AfDividerTone>('subtle');

  protected readonly hostClasses = computed(() =>
    ['af-divider-desktop', `af-divider-desktop--${this.orientation()}`, `af-divider-desktop--tone-${this.tone()}`].join(
      ' ',
    ),
  );

  constructor() {
    inject(AfThemeService);
  }
}