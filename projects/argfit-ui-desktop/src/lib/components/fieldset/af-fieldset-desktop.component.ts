import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfSectionDensity, type AfSurfaceTone } from '@argfit-ui/core';

@Component({
  selector: 'af-fieldset-desktop',
  templateUrl: './af-fieldset-desktop.component.html',
  styleUrl: './af-fieldset-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-fieldset-desktop',
    '[class]': 'hostClasses()',
  },
})
export class AfFieldsetDesktopComponent {
  readonly legend = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly density = input<AfSectionDensity>('comfortable');
  readonly tone = input<AfSurfaceTone>('neutral');
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly hostClasses = computed(() =>
    [
      'af-fieldset-desktop',
      `af-fieldset-desktop--${this.density()}`,
      `af-fieldset-desktop--tone-${this.tone()}`,
      this.disabled() ? 'af-fieldset-desktop--disabled' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}
