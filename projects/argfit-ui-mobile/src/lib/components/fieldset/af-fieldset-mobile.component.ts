import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfSectionDensity, type AfSurfaceTone } from '@argfit-ui/core';

@Component({
  selector: 'af-fieldset-mobile',
  templateUrl: './af-fieldset-mobile.component.html',
  styleUrl: './af-fieldset-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-fieldset-mobile',
    '[class]': 'hostClasses()',
  },
})
export class AfFieldsetMobileComponent {
  readonly legend = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly density = input<AfSectionDensity>('comfortable');
  readonly tone = input<AfSurfaceTone>('neutral');
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly hostClasses = computed(() =>
    [
      'af-fieldset-mobile',
      `af-fieldset-mobile--${this.density()}`,
      `af-fieldset-mobile--tone-${this.tone()}`,
      this.disabled() ? 'af-fieldset-mobile--disabled' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  constructor() {
    inject(AfThemeService);
  }
}