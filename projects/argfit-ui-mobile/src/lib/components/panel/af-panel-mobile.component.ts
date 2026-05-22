import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfSectionDensity, type AfSurfaceTone } from '@argfit-ui/core';

@Component({
  selector: 'af-panel-mobile',
  templateUrl: './af-panel-mobile.component.html',
  styleUrl: './af-panel-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-panel-mobile',
    '[class]': 'hostClasses()',
    '[attr.role]': 'heading() ? "region" : null',
    '[attr.aria-label]': 'heading() ?? null',
  },
})
export class AfPanelMobileComponent {
  readonly heading = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly density = input<AfSectionDensity>('comfortable');
  readonly tone = input<AfSurfaceTone>('neutral');

  protected readonly hostClasses = computed(() =>
    ['af-panel-mobile', `af-panel-mobile--${this.density()}`, `af-panel-mobile--tone-${this.tone()}`].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}