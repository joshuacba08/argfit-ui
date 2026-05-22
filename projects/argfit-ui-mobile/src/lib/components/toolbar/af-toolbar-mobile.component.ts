import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfToolbarDensity } from '@argfit-ui/core';

@Component({
  selector: 'af-toolbar-mobile',
  imports: [NgTemplateOutlet],
  templateUrl: './af-toolbar-mobile.component.html',
  styleUrl: './af-toolbar-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-toolbar-mobile',
    '[class]': 'hostClasses()',
    '[attr.role]': '"toolbar"',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class AfToolbarMobileComponent {
  readonly density = input<AfToolbarDensity>('comfortable');
  readonly ariaLabel = input('Toolbar');
  readonly startTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly centerTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly endTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  protected readonly hostClasses = computed(() => ['af-toolbar-mobile', `af-toolbar-mobile--${this.density()}`].join(' '));

  constructor() {
    inject(AfThemeService);
  }
}
