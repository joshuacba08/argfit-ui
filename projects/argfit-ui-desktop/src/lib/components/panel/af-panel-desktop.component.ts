import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfSectionDensity, type AfSurfaceTone } from '@argfit-ui/core';

@Component({
  selector: 'af-panel-desktop',
  templateUrl: './af-panel-desktop.component.html',
  styleUrl: './af-panel-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-panel-desktop',
    '[class]': 'hostClasses()',
    '[attr.role]': 'heading() ? "region" : null',
    '[attr.aria-label]': 'heading() ?? null',
  },
})
export class AfPanelDesktopComponent {
  readonly heading = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly density = input<AfSectionDensity>('comfortable');
  readonly tone = input<AfSurfaceTone>('neutral');

  protected readonly hostClasses = computed(() =>
    ['af-panel-desktop', `af-panel-desktop--${this.density()}`, `af-panel-desktop--tone-${this.tone()}`].join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}
